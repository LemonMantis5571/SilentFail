#!/bin/bash

# SilentFail Cron Runner
# Calls the /api/cron/check endpoint at regular intervals

APP_URL="${APP_URL:-http://host.docker.internal:3000}"
CRON_SECRET="${CRON_SECRET:-}"
INTERVAL="${CRON_INTERVAL:-60}"  # Default: every 60 seconds

echo "🔕 SilentFail Cron Runner"
echo "   Target: ${APP_URL}/api/cron/check"
echo "   Interval: ${INTERVAL}s"
echo "   Secret: ${CRON_SECRET:+configured}"
echo ""

# Wait for app to be ready
echo "⏳ Waiting for app to be ready..."
until curl -sf "${APP_URL}/api/cron/check" -H "Authorization: Bearer ${CRON_SECRET}" > /dev/null 2>&1; do
  echo "   App not ready, retrying in 5s..."
  sleep 5
done
echo "✅ App is ready!"
echo ""

# Main loop
while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  if [ -n "$CRON_SECRET" ]; then
    RESPONSE=$(curl -sf "${APP_URL}/api/cron/check" -H "Authorization: Bearer ${CRON_SECRET}" 2>&1)
  else
    RESPONSE=$(curl -sf "${APP_URL}/api/cron/check" 2>&1)
  fi
  
  if [ $? -eq 0 ]; then
    echo "[${TIMESTAMP}] ✅ Check completed: ${RESPONSE}"
  else
    echo "[${TIMESTAMP}] ❌ Check failed: ${RESPONSE}"
  fi
  
  sleep "${INTERVAL}"
done
