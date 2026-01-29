# SilentFail API Documentation

## Authentication

Admin endpoints require a Bearer token (your API key from Settings).

```bash
Authorization: Bearer sk_your_api_key
```

---

## Monitoring Endpoints

### Send Heartbeat (GET)

```
GET /api/ping/{key}
```

| Parameter | In | Required | Description |
|-----------|-----|----------|-------------|
| `key` | path | Yes | Monitor's unique key |
| `secret` | query | No | Required if monitor is private |

**Responses:** `200` OK, `401` Unauthorized, `404` Not Found

---

### Send Heartbeat (POST)

```
POST /api/ping/{key}
```

Same parameters as GET. Use POST to explicitly fail a monitor.

---

## Admin Endpoints

### List Monitors

```
GET /api/admin/monitors
```

Returns all monitors belonging to the authenticated user.

---

### Create Monitor

```
POST /api/admin/monitors
```

**Body:**
```json
{
  "name": "My Monitor",
  "interval": 60,
  "gracePeriod": 5,
  "useSmartGrace": false,
  "privateMonitor": false
}
```

---

### Update Monitor

```
PATCH /api/admin/monitors/{id}
```

**Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "interval": 120,
  "gracePeriod": 10,
  "useSmartGrace": true,
  "privateMonitor": true
}
```

---

### Get System Stats

```
GET /api/admin/stats
```

Returns global statistics for the system.

**Response:**
```json
{
  "total": 5,
  "active": 4,
  "down": 1,
  "monitors": {
    "total": 5,
    "active": 4,
    "down": 1
  }
}
```

---

### Get Monitor Details

```
GET /api/admin/monitors/{id}
```

Returns full configuration details for a specific monitor.

---

### Get Downtime History

```
GET /api/admin/monitors/{id}/downtimes
```

Returns a paginated list of downtime incidents for a monitor.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Number of records to return |
| `offset` | number | 0 | Number of records to skip |

---

## Example Usage

```bash
# Create monitor
curl -X POST https://your-domain.com/api/admin/monitors \
  -H "Authorization: Bearer sk_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Daily Backup", "interval": 1440, "gracePeriod": 60, "useSmartGrace": false, "privateMonitor": false}'

# Ping monitor
curl https://your-domain.com/api/ping/your_monitor_key
```
