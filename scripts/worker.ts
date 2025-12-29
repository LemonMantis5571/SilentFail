import "dotenv/config";
import { parseArgs } from "util";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "";
const INTERVAL = parseInt(process.env.CRON_INTERVAL || "60", 10);

console.log("🔕 SilentFail Local Worker");
console.log(`   Target: ${APP_URL}/api/cron/check`);
console.log(`   Interval: ${INTERVAL}s`);
console.log(`   Secret: ${CRON_SECRET ? "configured" : "none"}`);
console.log("");

async function ping() {
  try {
    const headers: Record<string, string> = {};
    if (CRON_SECRET) {
      headers["Authorization"] = `Bearer ${CRON_SECRET}`;
    }

    const res = await fetch(`${APP_URL}/api/cron/check`, { headers });
    const text = await res.text();

    const timestamp = new Date().toLocaleString();

    if (res.ok) {
      console.log(`[${timestamp}] ✅ Check completed: ${text}`);
    } else {
      console.error(`[${timestamp}] ❌ Check failed (${res.status}): ${text}`);
    }
  } catch (error) {
    const timestamp = new Date().toLocaleString();
    console.error(`[${timestamp}] ❌ Network error:`, error);
  }
}

async function main() {
  console.log("⏳ Waiting for app (5s)...");
  // Small initial delay to allow server restart if concurrent
  await new Promise(r => setTimeout(r, 5000));

  console.log("🚀 Worker started");

  // Immediate first run
  await ping();

  // Schedule loop
  setInterval(ping, INTERVAL * 1000);
}

main();