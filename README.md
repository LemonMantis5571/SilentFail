# 🔕 SilentFail

> A lightweight **"Dead Man's Switch"** for cron jobs and background scripts — detect silent failures when automated tasks stop checking in.

---

## ✨ Quick Highlights

- 🔔 **Zero-config HTTP ping monitoring**
- 🐋 **Fully Dockerized** (Database + App + Cron Worker)
- 🔒 **Production-ready security** (Non-root containers, log rotation)
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
| **Database** | PostgreSQL 16.1 + Prisma |
| **Authentication** | Better Auth (GitHub, Discord) |
| **Email** | Resend |
| **UI** | Tailwind CSS v4, Shadcn/UI, Framer Motion |
| **Deployment** | Docker + Docker Compose |

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (Recommended)
- Or: Bun/Node.js 18+ with PostgreSQL

### Option A: Docker (Recommended - Full Stack)

Run the entire application in Docker with a single command:

```bash
# Clone
git clone https://github.com/LemonMantis5571/SilentFail.git
cd silentfail

# Create .env file (copy from .env.example and fill in your values)
cp .env.example .env

# Start entire stack (DB + App + Cron Worker)
docker-compose up -d

# View logs
docker-compose logs -f
```

The app will be available at **http://localhost:3000**

**Managing the stack:**
```bash
docker-compose down          # Stop all services
docker-compose down -v       # Stop and remove all data
docker-compose logs -f app   # View app logs
docker-compose logs -f cron  # View cron worker logs
docker-compose restart app   # Restart app service
```

### Option B: Hybrid Development

For faster development iteration (database in Docker, app runs locally):

```bash
# Start only the database
docker-compose up db -d

# Install dependencies
bun install

# Push database schema
bun run db:push

# Run app locally
bun run dev
```

### Option C: Manual / Cloud

If you have a cloud database (Supabase, Neon, Railway) or local Postgres:

1. **Configure .env**:
   - Set all required environment variables (see below)

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

5. **Start the Cron Worker**:
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

---

## 📝 Environment Variables

### Required

```env
# App Configuration
DATABASE_URL="postgresql://silentfail:securepassword@localhost:5432/silentfail"
BETTER_AUTH_SECRET="your_generated_secret_here"  # Generate: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Docker Postgres (Only for Docker setup)
DB_USER="silentfail"
DB_PASSWORD="securepassword"
DB_NAME="silentfail"

# OAuth (GitHub required, Discord optional)
BETTER_AUTH_GITHUB_CLIENT_ID="your_github_client_id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your_github_client_secret"
BETTER_AUTH_DISCORD_CLIENT_ID="your_discord_client_id"  # Optional
BETTER_AUTH_DISCORD_CLIENT_SECRET="your_discord_secret"  # Optional

# Email (Required for Alerts)
RESEND_API_KEY="re_..."
EMAIL_FROM="SilentFail <noreply@yourdomain.com>"

# Cron Worker
CRON_SECRET="your_cron_secret"  # Generate a random string
CRON_INTERVAL="60"  # Check interval in seconds
APP_URL="http://localhost:3000"  # For Docker: http://app:3000
```

**Quick setup:**
```bash
# Generate secrets
openssl rand -base64 32  # For BETTER_AUTH_SECRET
openssl rand -hex 32     # For CRON_SECRET
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


## 🗄️ Database Management

```bash
bun run db:studio         # View/edit data in browser
bun run db:push           # Push schema changes
bun run db:generate       # Generate migrations

# Docker-specific
docker-compose down -v    # Reset database (WARNING: deletes all data)
docker-compose logs db    # View database logs
```

---

## 🔧 Development

```bash
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Run production build
bun run preview          # Build + Start (Shortcut)
bun run check            # Lint + Type check
bun run test             # Run tests
```

---

## 🌐 OAuth Setup

### GitHub (Required)
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### Discord (Optional)
1. Go to https://discord.com/developers/applications
2. Create New Application → OAuth2
3. Add Redirect URL: `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Client Secret to `.env`

---

## 🚢 Production Deployment

The Docker setup is production-ready. For cloud deployment:

1. **Remove database port exposure** (unless needed):
   ```yaml
   # In docker-compose.yml, remove:
   ports:
     - "5432:5432"
   ```

2. **Use Docker secrets** for sensitive data in production

3. **Set up SSL/TLS** with a reverse proxy (nginx, Traefik, Caddy)

4. **Configure proper DNS** and update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`

5. **Monitor logs**:
   ```bash
   docker-compose logs -f --tail=100
   ```

---

## 📄 License

MIT License