# Integration Examples

Complete code examples for integrating SilentFail heartbeat pings into your scheduled tasks and scripts.

> 💡 Replace `https://your-app.com/api/ping/abc123xyz` with your actual monitor's ping URL from the dashboard.

---

## Bash / Shell Script

```bash
# Ping after successful backup
pg_dump mydb > backup.sql && curl -s https://your-app.com/api/ping/abc123xyz

# Ping only if the entire script succeeds
#!/bin/bash
set -e
./run-etl-job.sh
./validate-data.sh
curl -s https://your-app.com/api/ping/abc123xyz
```

---

## Python

```python
import requests

def run_job():
    # Your scheduled task logic
    process_data()
    
    # Ping on success
    requests.get("https://your-app.com/api/ping/abc123xyz")

# With error handling
try:
    run_job()
    requests.get("https://your-app.com/api/ping/abc123xyz")
except Exception as e:
    print(f"Job failed: {e}")
    # No ping = alert triggered
```

---

## Node.js / JavaScript

```javascript
// ES Module
await fetch("https://your-app.com/api/ping/abc123xyz");

// CommonJS
const https = require('https');
https.get("https://your-app.com/api/ping/abc123xyz");

// With async job
async function scheduledTask() {
  await processQueue();
  await fetch("https://your-app.com/api/ping/abc123xyz");
}
```

---

## Go

```go
package main

import "net/http"

func main() {
    // Run your task
    runBackup()
    
    // Ping on completion
    http.Get("https://your-app.com/api/ping/abc123xyz")
}
```

---

## PHP

```php
<?php
// After cron job completes
file_get_contents("https://your-app.com/api/ping/abc123xyz");

// With cURL
$ch = curl_init("https://your-app.com/api/ping/abc123xyz");
curl_exec($ch);
curl_close($ch);
```

---

## Ruby

```ruby
require 'net/http'

# Ping after job
Net::HTTP.get(URI("https://your-app.com/api/ping/abc123xyz"))
```

---

## PowerShell

```powershell
# Windows scheduled task
.\run-backup.ps1
Invoke-WebRequest -Uri "https://your-app.com/api/ping/abc123xyz" -Method GET
```

---

## Crontab

```bash
# Add to crontab -e
# Daily backup at 2 AM with heartbeat
0 2 * * * /home/user/backup.sh && curl -s https://your-app.com/api/ping/abc123xyz

# Every 5 minutes health check
*/5 * * * * curl -s https://your-app.com/api/ping/abc123xyz
```

---

## Docker Compose Healthcheck

```yaml
services:
  worker:
    image: my-worker
    healthcheck:
      test: ["CMD", "curl", "-sf", "https://your-app.com/api/ping/abc123xyz"]
      interval: 5m
```

---

## Private Monitors

For private monitors, include the secret as a query parameter or header:

```bash
# Query parameter
curl -s "https://your-app.com/api/ping/abc123xyz?secret=your-secret"

# Bearer header
curl -s -H "Authorization: Bearer your-secret" https://your-app.com/api/ping/abc123xyz
```

```python
# Python with secret
requests.get(
    "https://your-app.com/api/ping/abc123xyz",
    headers={"Authorization": "Bearer your-secret"}
)
```
