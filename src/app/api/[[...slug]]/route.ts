import { Elysia, t } from 'elysia';
import { db } from '~/server/db';
import { Resend } from 'resend';
import AlertEmail from '~/components/emails/alert-email';
import { calculateSmartGrace } from '~/lib/smart-grace';

const resend = new Resend(process.env.RESEND_API_KEY);

const app = new Elysia({ prefix: '/api' })
  .onError(({ code, error }) => {
    console.error(`Elysia Error [${code}]:`, error);
    return new Response(JSON.stringify({ error: code, message: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  })

  /**
   * ------------------------------------------------------------------
   * INGEST GROUP: Public endpoints for pings
   * ------------------------------------------------------------------
   */
  .group('/ping', (app) => app
    .get('/:key', async ({ params: { key } }) => {
      try {
        const monitor = await db.monitor.findUnique({ 
            where: { key },
            include: {
                pings: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        
        if (!monitor) {
          return new Response("Monitor not found", { status: 404 });
        }

        const now = new Date();
        let latency = 0; 


        if (monitor.lastPing) {
            const diffMs = now.getTime() - monitor.lastPing.getTime();
            latency = Math.floor(diffMs / 1000); 
        }

  
        await db.pingEvent.create({
            data: {
                monitorId: monitor.id,
                latency: latency
            }
        });

   
        let newGracePeriod = monitor.gracePeriod;

        if (monitor.useSmartGrace && monitor.pings.length >= 3) {
            const historyLatencies = monitor.pings.map(p => p.latency);
            const allLatencies = [latency, ...historyLatencies];
            
         
            const smartGrace = calculateSmartGrace(allLatencies, monitor.interval * 60);
            
            if (smartGrace !== monitor.gracePeriod) {
                newGracePeriod = smartGrace;
                console.log(`[Smart Grace] ${monitor.name}: Updated to ${smartGrace}m`);
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

        return new Response("HeartBeat received", { status: 200 });
      } catch (error) {
        console.error("Ping failed:", error);
        return new Response("Internal Error", { status: 500 });
      }
    })

    // 2. Crash Report (Direct DB Write)
    // Usage: curl -X POST -d "Error log..." https://site.com/api/ping/key-123
    .post('/:key', async ({ params: { key }, body }) => {
      try {
        const monitor = await db.monitor.findUnique({ where: { key } });
        if (!monitor) return new Response("Monitor not found", { status: 404 });

        // Mark DOWN immediately
        await db.monitor.update({
          where: { id: monitor.id },
          data: { status: "DOWN", lastPing: new Date() }
        });

        // Log the crash (In a real app, save 'body' to a Logs table)
        console.log(`[Crash Report] ${monitor.name}:`, body);

        return { success: true, message: "Crash reported" };
      } catch (e) {
        return new Response("Internal Error", { status: 500 });
      }
    }, {
      body: t.String() // Expect raw text body for logs
    })
  )
  /**
   * ------------------------------------------------------------------
   * CRON GROUP: Protected endpoints for workers
   * ------------------------------------------------------------------
   */
  .group('/cron', (app) => app
    .onBeforeHandle(({ request }) => {
      const authHeader = request.headers.get("authorization");
      if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
      }
    })

    // 3. Check Worker (Find dead monitors)
    // Runs every minute to check for expired deadlines
    .get('/check', async () => {
      const now = new Date();
      const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev"; 

      // Fetch UP monitors
      const activeMonitors = await db.monitor.findMany({
        where: { status: "UP" },
        select: {
          id: true, lastPing: true, interval: true, gracePeriod: true, name: true,
          user: { select: { email: true } }
        }
      });

      const deadMonitorIds: string[] = [];
      const emailPromises: any[] = [];

      for (const monitor of activeMonitors) {
        if (!monitor.lastPing) continue;

        const expectedTime = new Date(monitor.lastPing.getTime() + (monitor.interval * 60000));
        const deadTime = new Date(expectedTime.getTime() + (monitor.gracePeriod * 60000));
        console.log(`[Check] ${monitor.name}: Now=${now.toISOString()}, DeadTime=${deadTime.toISOString()}`);

        if (now > deadTime) {
          deadMonitorIds.push(monitor.id);
          
          console.log(`Sending alert for ${monitor.name}`);
          
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
          ...emailPromises
        ]);
      }

      return {
        success: true,
        checked: activeMonitors.length,
        markedDown: deadMonitorIds.length
      };
    })
  );

// Export handlers for Next.js App Router
export const GET = app.handle;
export const POST = app.handle;