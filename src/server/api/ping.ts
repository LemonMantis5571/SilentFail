import { Elysia, t } from 'elysia';
import { db } from '~/server/db';
import { calculateSmartGrace } from '~/lib/smart-grace';
import { createTerminalCard, STYLES } from '~/server/terminal-response';

export const pingRoutes = new Elysia({ prefix: '/ping' })
  .get('/:key', async ({ params: { key }, request }) => {
    try {
      const monitor = await db.monitor.findUnique({
        where: { key },
        include: {
          pings: { take: 10, orderBy: { createdAt: 'desc' } }
        }
      });

      if (monitor && monitor.secret) {
        const url = new URL(request.url);
        const secretParam = url.searchParams.get("secret");
        const authHeader = request.headers.get("authorization");

        const providedSecret = secretParam || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

        if (providedSecret !== monitor.secret) {
          return new Response("Unauthorized: Invalid Secret", { status: 401 });
        }
      }

      if (!monitor) {
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

      const now = new Date();
      let latency = 0;

      if (monitor.lastPing) {
        console.log(monitor.lastPing, now);

        const diffMs = now.getTime() - monitor.lastPing.getTime();
        latency = Math.floor(diffMs / 1000);
      }

      // 1. Record Ping
      await db.pingEvent.create({
        data: { monitorId: monitor.id, latency }
      });


      const activeDowntime = await db.downtime.findFirst({
        where: { monitorId: monitor.id, endedAt: null }
      });

      if (activeDowntime) {
        const durationMinutes = Math.floor((now.getTime() - activeDowntime.startedAt.getTime()) / (1000 * 60));
        await db.downtime.update({
          where: { id: activeDowntime.id },
          data: { endedAt: now, duration: durationMinutes }
        });
        console.log(`[Recovery] Closed downtime for ${monitor.name}`);
      }

      // 3. Smart Grace Logic
      let newGracePeriod = monitor.gracePeriod;
      if (monitor.useSmartGrace && monitor.pings.length >= 3) {
        const historyLatencies = monitor.pings.map(p => p.latency);
        const smartGrace = calculateSmartGrace([latency, ...historyLatencies], monitor.interval * 60);
        if (smartGrace !== monitor.gracePeriod) newGracePeriod = smartGrace;
      }

      // 4. Update Monitor
      await db.monitor.update({
        where: { id: monitor.id },
        data: {
          status: "UP",
          lastPing: now,
          gracePeriod: newGracePeriod
        }
      });

   
      const prettyOutput = createTerminalCard({
        title: "ONLINE",
        metrics: {
          "Monitor Name": monitor.name,
          "Status": "UP 🚀",
          "Latency": `${latency} ms`,
          "Last Ping": now.toLocaleTimeString(),
          "Grace Period": `${monitor.gracePeriod} min`,
          "Message": "Heartbeat synced"
        },
        type: 'success',
        format: 'text'
      });

      return new Response(prettyOutput, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    } catch (error) {
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
  })

  .post('/:key', async ({ params: { key }, body, request }) => {
    const monitor = await db.monitor.findUnique({ where: { key } });
    if (!monitor) return new Response("Not found", { status: 404 });

    if (monitor.secret) {
      const url = new URL(request.url);
      const secretParam = url.searchParams.get("secret");
      const authHeader = request.headers.get("authorization");

      const providedSecret = secretParam || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

      if (providedSecret !== monitor.secret) {
        return new Response("Unauthorized: Invalid Secret", { status: 401 });
      }
    }

    await db.monitor.update({
      where: { id: monitor.id },
      data: { status: "DOWN", lastPing: new Date() }
    });


    await db.downtime.create({
      data: { monitorId: monitor.id, startedAt: new Date() }
    });

    return { success: true };
  }, { body: t.String() });
