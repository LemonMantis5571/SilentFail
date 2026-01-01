# 🔕 SilentFail

> A lightweight **"Dead Man's Switch"** for cron jobs and background scripts — detect silent failures when automated tasks stop checking in.

---

## ✨ Quick Highlights

- 🔔 **Zero-config HTTP ping monitoring**
- 🐋 **Dockerized Cron Worker** (Reliable background checks)
- 🧠 **AI-driven adaptive grace periods**
- ⏱️ **Precision Downtime Tracking**
- 📧 **Instant email alerts** (Resend)
- 📊 **Incident history & automatic resolution**
- ⚡ **Modern stack:** Next.js 15, Tailwind v4, Shadcn/UI, Framer Motion

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Runtime** | Bun (or Node.js 18+) |
| **API** | ElysiaJS (Route Handlers) |
| **Database** | PostgreSQL + Prisma |
| **Authentication** | Better Auth (GitHub, Discord) |
| **Email** | Resend |
| **UI** | Tailwind CSS v4, Shadcn/UI, Framer Motion |

---


## 🚀 Quick Start

### Prerequisites

- Bun or Node.js 18+
- **Option A (Recommended):** Docker & Docker Compose
- **Option B (Manual):** PostgreSQL database + method to run cron

### Option A: Docker (Easiest)

```bash
# Clone
git clone https://github.com/LemonMantis5571/SilentFail.git
cd silentfail

# Run the all-in-one setup
# This installs dependencies, creates .env, starts Docker, and pushes schema
bun run setup

# Start App
bun run dev
```

### Option B: Manual / Cloud

If you have a cloud database (Supabase, Neon, Railway) or local Postgres:

1. **Configure .env**:
   - Set all required environment variables.

2. **Install Dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Initialize DB**:
   ```bash
   bun run db:push
   ```

4. **Start the App**:
   
   **Development:**
   ```bash
   bun run dev
   ```

   **Production:**
   ```bash
   bun run build
   bun start
   # Or shortcut:
   bun run preview
   ```

4. **Start the Cron Worker**:
   This app needs a "pinger" service to check for silent failures.
   
   **Run locally:**
   ```bash
   bun run worker
   ```
   
   **Or use system cron:**
   ```bash
   # Run every minute
   * * * * * curl -H "Authorization: Bearer <YOUR_SECRET>" -s http://localhost:3000/api/cron/check
   ```
   
   **Or use Vercel Cron:**
   - Configure `vercel.json` and deploy.

Open http://localhost:3000

---

## 📝 Environment Variables

### Required

```env
# App Configuration
DATABASE_URL="postgresql://silentfail:securepassword@localhost:5432/silentfail"
BETTER_AUTH_SECRET="your_generated_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Docker Postgres (Only required for Option A)
# If using a cloud database (Option B), you can ignore these.
DB_USER="silentfail"
DB_PASSWORD="securepassword"
DB_NAME="silentfail"

# OAuth (Required for Auth)
BETTER_AUTH_GITHUB_CLIENT_ID="your_client_id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your_client_secret"
BETTER_AUTH_DISCORD_CLIENT_ID="your_client_id"
BETTER_AUTH_DISCORD_CLIENT_SECRET="your_client_secret"

# Email (Required for Alerts)
RESEND_API_KEY="re_..."
EMAIL_FROM="SilentFail <onboarding@resend.dev>"

# Cron (Required for Monitoring)
CRON_SECRET="your_cron_secret"
CRON_INTERVAL="60"
APP_URL="http://localhost:3000"
```

---

## 📌 How It Works

1. Create a monitor in the dashboard
2. Add the ping URL to your script:

```bash
# Bash
pg_dump mydb > backup.sql && curl https://your-app.com/api/ping/abc123xyz

# Python
import requests
requests.get("https://your-app.com/api/ping/abc123xyz")

# Node.js
await fetch("https://your-app.com/api/ping/abc123xyz");
```

3. Get alerted if your script stops pinging

---

## 🗄️ Database Management

```bash
bun run db:studio  # View/edit data
bun run db:push    # Update schema
docker-compose down -v  # Reset database
```

---

## 🔧 Development

```bash
bun run dev    # Start dev server
bun run build  # Build for production
bun run start  # Run production build
bun run preview # Build + Start (Shortcut)
```

---

## 🌐 OAuth Setup

### GitHub
1. https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

### Discord
1. https://discord.com/developers/applications
2. New Application → OAuth2
3. Redirect URL: `http://localhost:3000/api/auth/callback/discord`

---

## 📄 License

MIT License