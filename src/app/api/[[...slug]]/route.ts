import { Elysia, t } from 'elysia';
import { db } from '~/server/db';
import { Resend } from 'resend';
import AlertEmail from '~/components/emails/alert-email';
import { calculateSmartGrace } from '~/lib/smart-grace';
import { createTerminalCard, STYLES } from '~/server/terminal-response';

const resend = new Resend(process.env.RESEND_API_KEY);

const app = new Elysia({ prefix: '/api' })
  .onError(({ code, error }) => {
    console.error(`Elysia Error [${code}]:`, error);
    return new Response(JSON.stringify({ error: code, message: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  })

  .group('/ping', (app) => app
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
          const errorOutput = createTerminalCard("NOT FOUND", {
            "Error Code": "404",
            "Key Provided": key,
            "Message": "Invalid Monitor Key",
            "Action": "Check configuration"
          }, 'error');

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

        const isHealthy = latency < 100;
        const latencyColor = isHealthy ? STYLES.green : STYLES.yellow;

        const prettyOutput = createTerminalCard("ONLINE", {
          "Monitor Name": monitor.name,
          "Status": "UP 🚀",
          "Latency": `${latencyColor}${latency} ms${STYLES.reset}`,
          "Last Ping": now.toLocaleTimeString(),
          "Grace Period": `${monitor.gracePeriod} min`,
          "Message": "Heartbeat synced"
        }, 'success');

        return new Response(prettyOutput, { status: 200, headers: { 'Content-Type': 'text/plain' } });
      } catch (error) {
        const fatalOutput = createTerminalCard("SYSTEM FAILURE", {
          "Error Code": "500",
          "Type": "Internal Server Error",
          "Details": "Database or logic failure",
          "Timestamp": new Date().toISOString()
        }, 'error');

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

      // Start a downtime record immediately
      await db.downtime.create({
        data: { monitorId: monitor.id, startedAt: new Date() }
      });

      return { success: true };
    }, { body: t.String() })
  )

  .group('/cron', (app) => app
    .onBeforeHandle(({ request }) => {
      const authHeader = request.headers.get("authorization");
      if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
      }
    })

    .get('/check', async () => {
      const now = new Date();
      const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

      const activeMonitors = await db.monitor.findMany({
        where: { status: "UP" },
        select: {
          id: true, lastPing: true, interval: true, gracePeriod: true, name: true,
          user: { select: { email: true } }
        }
      });

      const deadMonitorIds: string[] = [];
      const emailPromises: any[] = [];
      const downtimePromises: any[] = [];

      for (const monitor of activeMonitors) {
        if (!monitor.lastPing) continue;

        const expectedTime = new Date(monitor.lastPing.getTime() + (monitor.interval * 60000));
        const deadTime = new Date(expectedTime.getTime() + (monitor.gracePeriod * 60000));

        if (now > deadTime) {
          deadMonitorIds.push(monitor.id);

          console.log(`[Alert] ${monitor.name} is DOWN`);

          // Queue Email
          emailPromises.push(
            resend.emails.send({
              from: fromEmail,
              to: monitor.user.email,
              subject: `🚨 Alert: ${monitor.name} is DOWN`,
              react: AlertEmail({
                monitorName: monitor.name,
                monitorId: monitor.id,
                lastPing: monitor.lastPing
              })
            }).catch(e => console.error(e))
          );

          // Queue Downtime Record Creation
          downtimePromises.push(
            db.downtime.create({
              data: {
                monitorId: monitor.id,
                startedAt: deadTime
              }
            })
          );
        }
      }

      if (deadMonitorIds.length > 0) {
        await Promise.all([
          db.monitor.updateMany({
            where: { id: { in: deadMonitorIds } },
            data: { status: "DOWN" }
          }),
          ...emailPromises,
          ...downtimePromises
        ]);
      }

      return {
        success: true,
        checked: activeMonitors.length,
        markedDown: deadMonitorIds.length
      };
    })
  );

export const GET = app.handle;
export const POST = app.handle;