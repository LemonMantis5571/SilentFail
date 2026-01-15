#!/bin/bash

# SilentFail Combined Entrypoint
# Runs both the Next.js app and cron worker in a single container


if [ "$NODE_ENV" = "production" ]; then
  if [ -z "$CRON_SECRET" ] || [ "$CRON_SECRET" = "placeholder" ]; then
    echo "❌ FATAL: CRON_SECRET is required in production"
    exit 1
  fi
  if [ -z "$RESEND_API_KEY" ] || [ "$RESEND_API_KEY" = "re_placeholder" ]; then
    echo "❌ FATAL: RESEND_API_KEY is required in production"
    exit 1
  fi
fi

APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
CRON_PATH="${CRON_PATH:-/api/cron/check}"
CRON_SECRET="${CRON_SECRET:-}"
CRON_INTERVAL="${CRON_INTERVAL:-60}"
INTERNAL_PORT="${PORT:-3000}"

CRON_URL="http://localhost:${INTERNAL_PORT}${CRON_PATH}"

# Function to run cron worker in background
run_cron() {
  echo "🔕 Starting cron worker..."
  echo "   Target: ${CRON_URL}"
  echo "   Interval: ${CRON_INTERVAL}s"
  
  # Wait for app to be ready
  echo "⏳ Waiting for app to be ready..."
  sleep 10  # Give the app time to start
  
  until curl -sf "${CRON_URL}" -H "Authorization: Bearer ${CRON_SECRET}" > /dev/null 2>&1; do
    echo "   App not ready, retrying in 5s..."
    sleep 5
  done
  echo "✅ App is ready! Cron worker started."
  
  # Main cron loop
  while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [ -n "$CRON_SECRET" ]; then
      RESPONSE=$(curl -sf "${CRON_URL}" -H "Authorization: Bearer ${CRON_SECRET}" 2>&1)
    else
      RESPONSE=$(curl -sf "${CRON_URL}" 2>&1)
    fi
    
    if [ $? -eq 0 ]; then
      echo "[${TIMESTAMP}] ✅ Cron check completed: ${RESPONSE}"
    else
      echo "[${TIMESTAMP}] ❌ Cron check failed: ${RESPONSE}"
    fi
    
    sleep "${CRON_INTERVAL}"
  done
}

# Start cron worker in background
run_cron &

# Start the Next.js app (foreground)
echo "🚀 Starting Next.js app..."
exec bun server.js
