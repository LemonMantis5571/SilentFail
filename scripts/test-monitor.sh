#!/bin/bash
# Test Monitor Script for SilentFail
# Usage: ./test-monitor.sh <ping-id> [interval-seconds]

PING_ID="$1"
INTERVAL="${2:-30}"
APP_URL="${APP_URL:-http://localhost:3000}"

if [ -z "$PING_ID" ]; then
  echo "❌ Error: No ping ID provided"
  echo "Usage: ./test-monitor.sh <ping-id> [interval-seconds]"
  echo "Example: ./test-monitor.sh abc123xyz 10"
  exit 1
fi

PING_URL="${APP_URL}/api/ping/${PING_ID}"

echo "🔕 SilentFail Test Monitor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 Ping URL: ${PING_URL}"
echo "⏱️  Interval: ${INTERVAL} seconds"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔄 Running... Press Ctrl+C to stop"
echo ""

while true; do
  TIMESTAMP=$(date +"%H:%M:%S")
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$PING_URL")
  
  if [ "$RESPONSE" = "200" ]; then
    echo "✅ [${TIMESTAMP}] Ping successful (${RESPONSE})"
  else
    echo "⚠️  [${TIMESTAMP}] Ping failed (${RESPONSE})"
  fi
  
  sleep "$INTERVAL"
done
