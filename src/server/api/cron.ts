import { Elysia } from 'elysia';
import { db } from '~/server/db';
import { Resend } from 'resend';
import AlertEmail from '~/components/emails/alert-email';
import { env } from '~/env';


if (!env.RESEND_API_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('RESEND_API_KEY is required in production');
}
const resend = new Resend(env.RESEND_API_KEY);

export const cronRoutes = new Elysia({ prefix: '/cron' })
  .onBeforeHandle(({ request }) => {
    const authHeader = request.headers.get("authorization");

    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
      }
    } else if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
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
    const emailPromises: Promise<unknown>[] = [];
    const downtimePromises: Promise<unknown>[] = [];

    for (const monitor of activeMonitors) {
      if (!monitor.lastPing) continue;

      const expectedTime = new Date(monitor.lastPing.getTime() + (monitor.interval * 60000));
      const deadTime = new Date(expectedTime.getTime() + (monitor.gracePeriod * 60000));

      if (now > deadTime) {
        deadMonitorIds.push(monitor.id);

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
  });
