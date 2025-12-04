# SilentFail

A lightweight "Dead Man's Switch" for cron jobs and background scripts — detect silent failures when automated tasks stop checking in.

Quick highlights:
- Zero-config HTTP ping monitoring
- AI-driven adaptive grace periods
- Instant email alerts (Resend)
- Incident history and automatic resolution on next successful ping
- Built with modern UX/stack: Next.js 15, Tailwind v4, Shadcn/UI, Framer Motion

---

## Features

- Simple HTTP ping endpoint per monitor
- Grace periods adapt to historical run-times
- Email alerts via Resend
- Uptime, latency drift, and downtime history
- Self-healing: incidents resolve automatically when your script pings again
- OAuth (GitHub & Discord) via Better Auth
- PostgreSQL (Prisma) persistence

---

## Tech Stack

- Framework: Next.js 15 (App Router)
- API: ElysiaJS (via Next.js Route Handlers)
- DB: PostgreSQL + Prisma
- Auth: Better Auth (GitHub, Discord)
- Email: Resend
- UI: Tailwind CSS, Shadcn/UI, Framer Motion

---

## Quick start

Prerequisites:
- Node.js 18+
- PostgreSQL (local, Neon or Supabase)
- GitHub/Discord OAuth app credentials
- Resend API key

Install and run:

```bash
git clone https://github.com/yourusername/silentfail.git
cd silentfail
npm install
cp .env.example .env
# fill .env with your secrets
npx prisma db push
npm run dev
# open http://localhost:3000