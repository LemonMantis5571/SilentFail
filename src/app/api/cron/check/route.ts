import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { Resend } from "resend";
import AlertEmail from "~/components/emails/alert-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  try {
    const now = new Date();
    

    const activeMonitors = await db.monitor.findMany({
      where: { status: "UP" },
      select: {
        id: true,
        lastPing: true,
        interval: true,
        gracePeriod: true,
        name: true,
        user: {
          select: { email: true } 
        }
      }
    });

    const deadMonitorIds: string[] = [];
    const emailPromises = [];
    const downtimePromises = [];

    for (const monitor of activeMonitors) {
      if (!monitor.lastPing) continue;

      const expectedTime = new Date(monitor.lastPing.getTime() + (monitor.interval * 60000));
      const deadTime = new Date(expectedTime.getTime() + (monitor.gracePeriod * 60000));

      if (now > deadTime) {
        deadMonitorIds.push(monitor.id);
      
        console.log(`Sending alert for ${monitor.name} to ${monitor.user.email}`);
        
   
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
          }).catch(err => {
            console.error(`Failed to send email to ${monitor.user.email}:`, err);
            return null; 
          })
        );

        downtimePromises.push(
          db.downtime.create({
            data: {
              monitorId: monitor.id,
              startedAt: deadTime,
            }
          }).catch(err => {
            console.error(`Failed to create downtime record for ${monitor.name}:`, err);
            return null;
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

    return NextResponse.json({
      success: true,
      markedDown: deadMonitorIds.length,
      emailsSent: emailPromises.length,
      downtimesCreated: downtimePromises.length
    });

  } catch (error) {
    console.error("Cron failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}