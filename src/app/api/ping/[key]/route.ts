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
        } 
      }
    });

    if (!monitor) return new NextResponse("Not Found", { status: 404 });

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
         console.log(`[AI Adjustment] ${monitor.name}: Grace period updated to ${smartGrace}m`);
       }
    }
    await db.monitor.update({
      where: { id: monitor.id },
      data: {
        status: "UP",
        lastPing: now,
        gracePeriod: newGracePeriod 
      },
    });

    return new NextResponse("HeartBeat received", { status: 200 });
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
    });

    if (!monitor) {
      return new NextResponse("Monitor not found", { status: 404 });
    }


    await db.monitor.update({
      where: { id: monitor.id },
      data: {
        status: "DOWN", 
        lastPing: new Date(),
      },
    });

    // 2. TODO: Send 'body' to your AI Service here
    // await analyzeErrorLog(body, monitor.userId);
    console.log(`[Crash Report] Monitor ${monitor.name}: ${body.slice(0, 100)}...`);

    return new NextResponse("Error logged. AI analysis queued.", { status: 202 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}