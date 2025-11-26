import { NextResponse } from "next/server";
import { calculateSmartGrace } from "~/lib/smart-grace";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  try {
    const monitor = await db.monitor.findUnique({
      where: { key },
      include: { 
        pings: { 
          orderBy: { createdAt: 'desc' },
          take: 10 
        },
        downtimes: {
          where: { endedAt: null },
          orderBy: { startedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!monitor) return new NextResponse("Not Found", { status: 404 });

    const now = new Date();
    let latency = 0;
    const wasDown = monitor.status === "DOWN";
    const activeDowntime = monitor.downtimes[0];


    if (monitor.lastPing) {
      const diffMs = now.getTime() - monitor.lastPing.getTime();
      latency = Math.floor(diffMs / 1000);
    }


    let newGracePeriod = monitor.gracePeriod;
    if (monitor.useSmartGrace && monitor.pings.length >= 3) {
      const historyLatencies = monitor.pings.map(p => p.latency);
      const allLatencies = [latency, ...historyLatencies];
      const smartGrace = calculateSmartGrace(allLatencies, monitor.interval * 60);
      if (smartGrace !== monitor.gracePeriod) {
        newGracePeriod = smartGrace;
        console.log(`[AI Adjustment] ${monitor.name}: Grace period updated to ${smartGrace}m`);
      }
    }

    // Build transaction operations for PingEvent and Monitor
    const pingMonitorOps = [
      // Create ping event
      db.pingEvent.create({
        data: {
          monitorId: monitor.id,
          latency: latency
        }
      }),
      // Update monitor status
      db.monitor.update({
        where: { id: monitor.id },
        data: {
          status: "UP",
          lastPing: now,
          gracePeriod: newGracePeriod 
        },
      })
    ];

    // Execute PingEvent and Monitor updates in a transaction
    await db.$transaction(pingMonitorOps);

    // If monitor was down and has an active downtime, close it
    if (wasDown && activeDowntime) {
      const downtimeDuration = Math.floor((now.getTime() - activeDowntime.startedAt.getTime()) / (1000 * 60));

      await db.downtime.update({
        where: { id: activeDowntime.id },
        data: {
          endedAt: now,
          duration: downtimeDuration
        }
      });

      console.log(`[Recovery] ${monitor.name}: Downtime ended after ${downtimeDuration} minutes`);
    }

    return new NextResponse(
      wasDown ? "Monitor recovered - downtime logged" : "Heartbeat received", 
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new NextResponse("Error", { status: 500 });
  }
}

// Handle the "I crashed" report
// Usage: curl -X POST -d "Error: Database connection failed" https://your-site.com/api/ping/key-123
export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const body = await req.text(); // Read the raw error log

  try {
    const monitor = await db.monitor.findUnique({
      where: { key },
      include: {
        downtimes: {
          where: { endedAt: null },
          orderBy: { startedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!monitor) {
      return new NextResponse("Monitor not found", { status: 404 });
    }

    const now = new Date();
    const operations = [];

    // Update monitor status to DOWN
    operations.push(
      db.monitor.update({
        where: { id: monitor.id },
        data: {
          status: "DOWN", 
          lastPing: now,
        },
      })
    );

    // Create downtime record if one doesn't already exist
    // (Prevents duplicate downtime records if POST is called multiple times)
    if (!monitor.downtimes[0]) {
      operations.push(
        db.downtime.create({
          data: {
            monitorId: monitor.id,
            startedAt: now
          }
        })
      );
      console.log(`[Crash Report] ${monitor.name}: Downtime started`);
    } else {
      console.log(`[Crash Report] ${monitor.name}: Downtime already active`);
    }

    await db.$transaction(operations);

    // TODO: Send 'body' to your AI Service here
    // await analyzeErrorLog(body, monitor.userId);
    console.log(`[Crash Report] Monitor ${monitor.name}: ${body.slice(0, 100)}...`);

    return new NextResponse("Error logged. AI analysis queued.", { status: 202 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}