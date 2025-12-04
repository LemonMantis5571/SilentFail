SilentFail
The "Dead Man's Switch" for your cron jobs & background scripts.
SilentFail listens for a heartbeat from your backup scripts, data imports, and scheduled tasks. If a script fails to check in within the expected timeframe, SilentFail alerts you instantly.

🚀 Features
Zero Config: Just a simple HTTP curl request to start monitoring.
Smart Grace Periods: AI-driven logic adapts to your script's historical run times.
Instant Alerts: Get notified via Email (Resend) immediately upon failure.
Incident History: Track uptime, latency drift, and past downtime events.
Self-Healing: Downtime incidents automatically resolve when the next successful ping arrives.
Modern UI: Built with Next.js 15, Tailwind v4, Shadcn/UI, and Framer Motion.

🛠 Tech Stack
Framework: Next.js 15 (App Router)
API: ElysiaJS (running via Next.js Route Handlers)
Database: PostgreSQL (via Prisma ORM)
Auth: Better Auth (GitHub & Discord)
Email: Resend
Styling: Tailwind CSS + Shadcn/UI + Framer Motion
📦 Getting Started
Prerequisites
Node.js 18+
PostgreSQL Database (Local or Neon/Supabase)
GitHub/Discord OAuth Credentials
Resend API Key
Installation
Clone the repository
git clone [https://github.com/yourusername/silentfail.git](https://github.com/yourusername/silentfail.git)
cd silentfail


Install dependencies
npm install


Set up Environment Variables
Copy .env.example to .env and fill in your secrets.
cp .env.example .env


Initialize Database
npx prisma db push


Run Development Server
npm run dev

Open http://localhost:3000 in your browser.
🔑 Environment Variables
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/silentfail"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000" # Change for production

# OAuth Providers
BETTER_AUTH_GITHUB_CLIENT_ID=""
BETTER_AUTH_GITHUB_CLIENT_SECRET=""
BETTER_AUTH_DISCORD_CLIENT_ID=""
BETTER_AUTH_DISCORD_CLIENT_SECRET=""

# Email (Resend)
RESEND_API_KEY="re_123..."
EMAIL_FROM="SilentFail <onboarding@resend.dev>"

# Cron Security
CRON_SECRET="generate_a_long_random_string"


⚡ How to Monitor a Script
Create a monitor in the dashboard (e.g., "Nightly Backup").
Get your unique Ping URL.
Add it to your script:
# Example: Database Backup
pg_dump mydb > backup.sql && curl 