import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { Resend } from "resend";
import AlertEmail from "~/components/emails/alert-email"; // Import the template

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    
    // 1. Fetch monitors + User Email
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

    // 2. Logic
    for (const monitor of activeMonitors) {
      if (!monitor.lastPing) continue;

      const expectedTime = new Date(monitor.lastPing.getTime() + (monitor.interval * 60000));
      const deadTime = new Date(expectedTime.getTime() + (monitor.gracePeriod * 60000));

      if (now > deadTime) {
        deadMonitorIds.push(monitor.id);
        
        // 3. Queue the Email
        console.log(`Sending alert for ${monitor.name} to ${monitor.user.email}`);
        
        emailPromises.push(
            resend.emails.send({
                // use 'onboarding@resend.dev' until you verify your own domain
                from: 'briter456@gmail.com', 
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

    // 4. Update DB & Send Emails in parallel
    if (deadMonitorIds.length > 0) {
      await Promise.all([
          // Update Status
          db.monitor.updateMany({
            where: { id: { in: deadMonitorIds } },
            data: { status: "DOWN" }
          }),
          // Send Emails
          ...emailPromises
      ]);
    }

    return NextResponse.json({
      success: true,
      markedDown: deadMonitorIds.length,
      emailsSent: emailPromises.length
    });

  } catch (error) {
    console.error("Cron failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}