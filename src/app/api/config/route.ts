import { NextResponse } from "next/server";

/**
 * Returns the app configuration at runtime.
 * This allows NEXT_PUBLIC_APP_URL to be read from env vars at runtime,
 * instead of being baked in at build time.
 */
export async function GET() {
  return NextResponse.json({
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  });
}
