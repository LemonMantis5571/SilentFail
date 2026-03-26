import { Elysia, t } from 'elysia';
import { pingRateLimit } from './rate-limit';
import { db } from '~/server/db';
import { calculateSmartGrace } from '~/lib/smart-grace';
import { createTerminalCard } from '~/server/terminal-response';

function getProvidedSecret(request: Request) {
  const url = new URL(request.url);
  const secretParam = url.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");

  return secretParam ?? (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);
}

function createNotFoundResponse(key: string) {
  const errorOutput = createTerminalCard({
    title: "NOT FOUND",
    metrics: {
      "Error Code": "404",
      "Key Provided": key,
      "Message": "Invalid Monitor Key",
      "Action": "Check configuration"
    },
    type: 'error',
    format: 'text'
  });

  return new Response(errorOutput, {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

function createUnauthorizedResponse() {
  return new Response("Unauthorized: Invalid Secret", { status: 401 });
}

async function findMonitorForHeartbeat(key: string) {
  return db.monitor.findUnique({
    where: { key },
    include: {
      pings: { take: 10, orderBy: { createdAt: 'desc' } }
    }
  });
}

async function recordHeartbeat(key: string, request: Request) {
  const monitor = await findMonitorForHeartbeat(key);

  if (!monitor) {
    return { response: createNotFoundResponse(key) } as const;
  }

  if (monitor.secret && getProvidedSecret(request) !== monitor.secret) {
    return { response: createUnauthorizedResponse() } as const;
  }

  const now = new Date();
  const observedIntervalSeconds = monitor.lastPing
    ? Math.floor((now.getTime() - monitor.lastPing.getTime()) / 1000)
    : 0;

  await db.pingEvent.create({
    data: { monitorId: monitor.id, latency: observedIntervalSeconds }
  });

  const activeDowntime = await db.downtime.findFirst({
    where: { monitorId: monitor.id, endedAt: null }
  });

  if (activeDowntime) {
    const durationMinutes = Math.floor(
      (now.getTime() - activeDowntime.startedAt.getTime()) / (1000 * 60),
    );
    await db.downtime.update({
      where: { id: activeDowntime.id },
      data: { endedAt: now, duration: durationMinutes }
    });
  }

  let newGracePeriod = monitor.gracePeriod;
  if (monitor.useSmartGrace && monitor.pings.length >= 3) {
    const historyLatencies = monitor.pings.map((ping) => ping.latency);
    const smartGrace = calculateSmartGrace(
      [observedIntervalSeconds, ...historyLatencies],
      monitor.interval * 60,
    );

    if (smartGrace !== monitor.gracePeriod) {
      newGracePeriod = smartGrace;
    }
  }

  await db.monitor.update({
    where: { id: monitor.id },
    data: {
      status: "UP",
      lastPing: now,
      gracePeriod: newGracePeriod
    }
  });

  return {
    response: null,
    monitor,
    now,
    observedIntervalSeconds,
    newGracePeriod,
  } as const;
}

export const pingRoutes = new Elysia({ prefix: '/ping' })
  .use(pingRateLimit)
  .get('/:key', async ({ params: { key }, request }) => {
    try {
      const monitorKey = key ?? "";
      const result = await recordHeartbeat(monitorKey, request);
      if (result.response) {
        return result.response;
      }

      const prettyOutput = createTerminalCard({
        title: "ONLINE",
        metrics: {
          "Monitor Name": result.monitor.name,
          "Status": "UP 🚀",
          "Observed Interval": `${result.observedIntervalSeconds}s`,
          "Last Ping": result.now.toLocaleTimeString(),
          "Grace Period": `${result.newGracePeriod} min`,
          "Message": "Heartbeat synced"
        },
        type: 'success',
        format: 'text'
      });

      return new Response(prettyOutput, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch {
      const fatalOutput = createTerminalCard({
        title: "SYSTEM FAILURE",
        metrics: {
          "Error Code": "500",
          "Type": "Internal Server Error",
          "Details": "Database or logic failure",
          "Timestamp": new Date().toISOString()
        },
        type: 'error',
        format: 'text'
      });

      return new Response(fatalOutput, {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  }, {
    detail: {
      tags: ['Ping'],
      summary: 'Send heartbeat (GET)',
      description: 'Records a heartbeat ping for a monitor. For private monitors, include secret as query param or Bearer token.'
    }
  })
  .head('/:key', async ({ params: { key }, request }) => {
    try {
      const monitorKey = key ?? "";
      const result = await recordHeartbeat(monitorKey, request);
      return result.response ?? new Response(null, { status: 204 });
    } catch {
      return new Response(null, { status: 500 });
    }
  }, {
    detail: {
      tags: ['Ping'],
      summary: 'Send heartbeat (HEAD)',
      description: 'Records a heartbeat ping without returning a response body.'
    }
  })
  .post('/:key', async ({ params: { key }, request }) => {
    const monitorKey = key ?? "";
    const monitor = await db.monitor.findUnique({ where: { key: monitorKey } });
    if (!monitor) {
      return new Response("Not found", { status: 404 });
    }

    if (monitor.secret && getProvidedSecret(request) !== monitor.secret) {
      return createUnauthorizedResponse();
    }

    const now = new Date();
    const activeDowntime = await db.downtime.findFirst({
      where: { monitorId: monitor.id, endedAt: null }
    });

    if (!activeDowntime) {
      await db.downtime.create({
        data: { monitorId: monitor.id, startedAt: now }
      });
    }

    await db.monitor.update({
      where: { id: monitor.id },
      data: { status: "DOWN", lastPing: now }
    });

    return { success: true };
  }, {
    body: t.String(),
    detail: {
      tags: ['Ping'],
      summary: 'Report failure (POST)',
      description: 'Manually reports a monitor as DOWN and creates a downtime record. For private monitors, include secret as query param or Bearer token.'
    }
  });
