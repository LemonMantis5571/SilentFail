# 🔕 SilentFail

> A lightweight **"Dead Man's Switch"** for cron jobs and background scripts — detect silent failures when automated tasks stop checking in.

---

## ✨ Quick Highlights

- 🔔 **Zero-config HTTP ping monitoring**
- 🧠 **AI-driven adaptive grace periods**
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
- Docker

### Installation

```bash
# Clone and install
git clone https://github.com/LemonMantis5571/SilentFail.git
cd silentfail
bun install

# Setup environment
cp .env.example .env
# Edit .env and add BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)

# Start database and create tables
docker-compose up -d
bun run db:push

# Start app
bun run dev
```

Open http://localhost:3000

---

## 📝 Environment Variables

### Required

```env
DATABASE_URL="postgresql://silentfail:securepassword@localhost:5432/silentfail"
BETTER_AUTH_SECRET="your_generated_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
```

### Optional

```env
# GitHub OAuth
BETTER_AUTH_GITHUB_CLIENT_ID="your_client_id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your_client_secret"

# Discord OAuth
BETTER_AUTH_DISCORD_CLIENT_ID="your_client_id"
BETTER_AUTH_DISCORD_CLIENT_SECRET="your_client_secret"

# Email alerts
RESEND_API_KEY="re_..."
EMAIL_FROM="SilentFail <onboarding@resend.dev>"

# Cron security
CRON_SECRET="your_cron_secret"
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