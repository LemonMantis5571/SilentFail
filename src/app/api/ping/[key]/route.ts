import { NextResponse } from "next/server";
import { db } from "~/server/db";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

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
        status: "UP",
        lastPing: new Date(),
      },
    });

    return new NextResponse("pong", { status: 200 });
  } catch (error) {
    console.error("Ping failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
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

    // 1. Mark as DOWN immediately
    await db.monitor.update({
      where: { id: monitor.id },
      data: {
        status: "DOWN", // Or a specific "CRASHED" status if you add it to Prisma later
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