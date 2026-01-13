# 🔕 SilentFail

> A lightweight **"Dead Man's Switch"** for cron jobs and background scripts — detect silent failures when automated tasks stop checking in.

![Beta](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Quick Highlights

- 🔔 **Zero-config HTTP ping monitoring**
- 🐋 **Fully Dockerized** (single container with built-in cron)
- 🔒 **Production-ready security** (Non-root containers, log rotation)
- 🧠 **Adaptive grace periods**
- 📊 **AI Incident history & automatic resolution (Soon)**
- ⏱️ **Precision Downtime Tracking**
- 📧 **Instant email alerts** (Resend)
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
| **Deployment** | Docker |

---

## 🚀 Quick Start

### Option A: Docker (Recommended)

Run the entire application with a single command:

```bash
# Clone
git clone https://github.com/LemonMantis5571/SilentFail.git
cd silentfail

# Create .env file
cp .env.example .env
# Edit .env with your values
```

**Choose your database setup:**

```bash
# Option 1: Local Docker Postgres (includes database container)
docker-compose --profile local-db up -d

# Option 2: Cloud Database (Supabase, Neon, Railway, etc.)
# Just set DATABASE_URL in .env, then:
docker-compose up -d
```

The app will be available at **http://localhost:3000**

> 💡 **Note:** The Docker image includes a built-in cron worker that automatically checks for silent failures. No separate cron service needed!

> ⚠️ **Docker Runtime:** The Docker image uses **Bun** as its runtime. For npm-based deployments, see Option B below.

**Managing the stack:**
```bash
docker-compose down          # Stop all services
docker-compose down -v       # Stop and remove all data
docker-compose logs -f app   # View app logs
docker-compose restart app   # Restart app service
```

---

### Option B: Local Development

For faster development iteration:

**Using Bun (recommended):**
```bash
# Start only the database
docker-compose --profile local-db up db -d

# Install dependencies
bun install

# Push database schema
bun run db:push

# Run app locally
bun run dev

# In a separate terminal, run the cron worker
bun run worker
```

**Using npm:**
```bash
# Start only the database
docker-compose --profile local-db up db -d

# Install dependencies
npm install

# Push database schema
npm run db:push

# Run app locally
npm run dev

# In a separate terminal, run the cron worker (requires ts-node or tsx)
npx tsx scripts/worker.ts
```

---

## 📝 Environment Variables

### Required Variables

```env
# App Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/silentfail"
NEXT_PUBLIC_APP_URL="https://your-domain.com"  # Your deployed URL

# Authentication
BETTER_AUTH_SECRET=""      # Generate: openssl rand -base64 32
BETTER_AUTH_URL=""         # Same as NEXT_PUBLIC_APP_URL

# OAuth (at least one required)
BETTER_AUTH_GITHUB_CLIENT_ID=""
BETTER_AUTH_GITHUB_CLIENT_SECRET=""

# Email Alerts
RESEND_API_KEY="re_..."
EMAIL_FROM="SilentFail <alerts@yourdomain.com>"

# Cron Security
CRON_SECRET=""             # Generate: openssl rand -hex 32
```

### Optional Variables

```env
# Server Port (default: 3000, some platforms use 8080)
PORT="3000"

# Discord OAuth
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""

# Cron Configuration
CRON_INTERVAL="60"         # Check interval in seconds (default: 60)

# Docker Postgres
DB_USER="silentfail"
DB_PASSWORD="securepassword"
DB_NAME="silentfail"
```

**Quick secret generation:**
```bash
openssl rand -base64 32  # For BETTER_AUTH_SECRET
openssl rand -hex 32     # For CRON_SECRET
```

---

## 📌 How It Works

1. **Create a monitor** in the dashboard
2. **Add the ping URL** to the end of your script:

```bash
# Bash example
pg_dump mydb > backup.sql && curl https://your-app.com/api/ping/abc123xyz

# Python
import requests
requests.get("https://your-app.com/api/ping/abc123xyz")

# Node.js
await fetch("https://your-app.com/api/ping/abc123xyz");
```

3. **Get alerted** if your script stops pinging within the expected interval

---

## 🧪 Testing Your Setup

Use the included test scripts to simulate a monitored job:

**PowerShell (Windows):**
```powershell
.\scripts\test-monitor.ps1 -PingId your-ping-id -Interval 10
```

**Bash (Linux/Mac):**
```bash
./scripts/test-monitor.sh your-ping-id 10
```

These scripts will ping your monitor every N seconds. Stop the script with `Ctrl+C` to simulate a failure and test your alerting.

---

## 🌐 OAuth Setup

> 💡 **Note:** At least one OAuth provider is required. You can use GitHub, Discord, or both.

### GitHub
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set Authorization callback URL: `https://your-app.com/api/auth/callback/github`
4. Copy Client ID and Client Secret to your environment variables

### Discord
1. Go to https://discord.com/developers/applications
2. Create New Application → OAuth2
3. Add Redirect URL: `https://your-app.com/api/auth/callback/discord`
4. Copy Client ID and Client Secret to your environment variables

---

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
bun run worker           # Run cron worker locally
```

---

## 🚢 Production Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Generate secure values for `BETTER_AUTH_SECRET` and `CRON_SECRET`
- [ ] Configure OAuth callback URLs for your production domain
- [ ] Set up a verified domain in Resend for email alerts
- [ ] (Optional) Remove database port exposure in docker-compose.yml
- [ ] (Optional) Set up SSL/TLS with a reverse proxy

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

GNU General Public License v3.0 