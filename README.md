# SilentFail

A lightweight **"Dead Man's Switch"** for cron jobs and background scripts — detect silent failures when automated tasks stop checking in.

## ✨ Quick Highlights

- 🔔 **Zero-config HTTP ping monitoring**
- 🧠 **AI-driven adaptive grace periods**
- 📧 **Instant email alerts** (Resend)
- 📊 **Incident history & automatic resolution**
- ⚡ **Modern stack:** Next.js 15, Tailwind v4, Shadcn/UI, Framer Motion

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

## 🚀 Quick Start (5 minutes)

### Prerequisites

- **Bun** (recommended) or **Node.js 18+**
- **Docker** (for database)
- **GitHub/Discord OAuth credentials** (optional for development)
- **Resend API key** (optional for development)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/silentfail.git
cd silentfail

# 2. Copy environment variables
cp .env.example .env

# 3. Generate authentication secret
openssl rand -base64 32
# Copy the output and add to .env as BETTER_AUTH_SECRET

# 4. Start the database
docker-compose up -d

# 5. Install dependencies
bun install
# or: npm install

# 6. Set up database schema
bun run db:push
# or: npm run db:push

# 7. Start development server
bun run dev
# or: npm run dev

# 8. Open http://localhost:3000 🎉
```

## 📝 Environment Variables

The `.env.example` file contains all required variables with comments.

### Required (Minimal Setup)

```env
# Database (works out of the box with docker-compose)
DATABASE_URL="postgresql://silentfail:securepassword@localhost:5432/silentfail"

# Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your_generated_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
```

### Optional (For Full Features)

```env
# GitHub OAuth (https://github.com/settings/developers)
BETTER_AUTH_GITHUB_CLIENT_ID="your_client_id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your_client_secret"

# Discord OAuth (https://discord.com/developers/applications)
BETTER_AUTH_DISCORD_CLIENT_ID="your_client_id"
BETTER_AUTH_DISCORD_CLIENT_SECRET="your_client_secret"

# Email alerts (https://resend.com/api-keys)
RESEND_API_KEY="re_..."
EMAIL_FROM="SilentFail <onboarding@resend.dev>"

# Cron job security (generate with: openssl rand -hex 32)
CRON_SECRET="your_cron_secret"
```

## 📌 How It Works

### 1. Create a Monitor

Create a monitor in the dashboard (e.g., **"Nightly Backup"**):

- Set **check interval** (e.g., every 24 hours)
- Set **grace period** (extra time allowed before alerting)
- Optionally enable **AI-driven adaptive grace periods**

### 2. Add Ping to Your Script

Copy the unique ping URL and add it to your script:

**Bash example:**
```bash
pg_dump mydb > backup.sql && curl https://your-app.com/api/ping/abc123xyz
```

**Python example:**
```python
import requests
# ... your backup logic ...
requests.get("https://your-app.com/api/ping/abc123xyz")
```

**Node.js example:**
```javascript
const response = await fetch("https://your-app.com/api/ping/abc123xyz");
```

### 3. Get Alerted on Failures

If your script doesn't ping within the expected interval + grace period, you'll receive an email alert. The incident **auto-resolves** when the next successful ping arrives.

## 🗄️ Database Management

```bash
# View/edit data with Prisma Studio
bun run db:studio

# Push schema changes (development)
bun run db:push

# Create migrations (production)
bun run db:migrate

# Stop database
docker-compose down

# Reset database (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d
bun run db:push
```

## 🔧 Development

```bash
# Start dev server with hot reload
bun run dev

# Type check
bun run type-check

# Lint
bun run lint

# Format code
bun run format

# Build for production
bun run build

# Run production build
bun run start
```

## 🐳 Docker (Optional)

```bash
# Build and run everything
docker-compose -f docker-compose.full.yml up

# Or just the database
docker-compose up -d
```

## 🌐 OAuth Setup

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** SilentFail (Local)
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:3000/api/auth/callback/github
4. Copy **Client ID** and **Secret** to `.env`

### Discord OAuth

1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Go to **"OAuth2"** tab
4. Add redirect URL: http://localhost:3000/api/auth/callback/discord
5. Copy **Client ID** and **Secret** to `.env`

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Use a production database (Neon, Supabase, etc.)
```

### Railway / Render

1. Connect your **GitHub repository**
2. Add **environment variables**
3. **Deploy!**

## 🤝 Contributing

Contributions are welcome!
## 📄 License

**MIT License** - see LICENSE file for details.