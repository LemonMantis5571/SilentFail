---
description: Code style and architecture guidelines for SilentFail
---

# SilentFail Architecture & Code Style Guide

## Tech Stack Overview

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js 15 (App Router)                 |
| Runtime        | Bun (or Node.js 18+)                    |
| API            | ElysiaJS (Route Handlers)               |
| Database       | PostgreSQL 16+ with Prisma ORM          |
| Authentication | Better Auth (GitHub, Discord OAuth)     |
| Email          | Resend                                  |
| UI             | Tailwind CSS v4, Shadcn/UI, Radix       |
| Animations     | Framer Motion                           |
| Validation     | Zod + t3-oss/env                        |
| Testing        | Vitest                                  |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── actions/           # Server Actions (use "use server")
│   ├── api/[[...slug]]/   # ElysiaJS API routes (catch-all)
│   ├── dashboard/         # Protected dashboard pages
│   └── settings/          # Settings pages
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── emails/            # React Email templates
│   ├── monitor-details/   # Monitor detail components
│   ├── nav/               # Navigation components
│   ├── settings/          # Settings components
│   └── ui/                # Shadcn/UI primitives
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── server/
│   ├── better-auth/       # Auth configuration
│   ├── db.ts              # Prisma client instance
│   └── terminal-response.ts # Terminal card formatting
└── styles/                # Global CSS files
```

---

## Code Style Guidelines

### 1. TypeScript Standards

- Use **strict typing** - no `any` unless absolutely necessary
- Prefer **type imports**: `import { type User } from '~/types'`
- Use **const assertions** for literal types
- Define interfaces for component props

```typescript
// ✅ Good
import { type Monitor } from "@prisma/client";

interface MonitorCardProps {
  monitor: Monitor;
  onDelete?: () => void;
}

// ❌ Avoid
import { Monitor } from "@prisma/client"; // missing type keyword
```

### 2. Component Structure

- Use **"use client"** directive only when needed (interactivity, hooks)
- Follow **co-location**: component-specific logic stays near the component
- Use **Radix/Shadcn primitives** from `~/components/ui/`
- Use **Lucide icons** (`lucide-react`)

```tsx
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

### 3. Server Actions

- Place in `src/app/actions/` directory
- Always use **"use server"** directive
- Get session via `auth.api.getSession({ headers: await headers() })`
- Use `revalidatePath()` after mutations

```typescript
"use server";

import { db } from "~/server/db";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateMonitor(id: string, data: MonitorInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db.monitor.update({ where: { id }, data });
  revalidatePath("/dashboard");
}
```

### 4. API Routes (ElysiaJS)

- All API routes live in `src/app/api/[[...slug]]/route.ts`
- Use **Elysia grouping** for route organization:
  - `/ping` - Public heartbeat endpoints
  - `/admin` - Authenticated user endpoints
  - `/cron` - Internal cron endpoints (CRON_SECRET protected)
- Use **typebox (`t`)** for request/response validation
- Export `GET`, `POST`, `PATCH` handlers

```typescript
import { Elysia, t } from "elysia";

const app = new Elysia({ prefix: "/api" })
  .group("/admin", (app) =>
    app
      .resolve(async ({ request }) => {
        // Auth middleware
        const apiKey = request.headers.get("authorization")?.slice(7);
        const user = await db.user.findUnique({ where: { apiKey } });
        if (!user) throw new Error("Unauthorized");
        return { user };
      })
      .get("/monitors", async ({ user }) => {
        return db.monitor.findMany({ where: { userId: user.id } });
      })
  );
```

### 5. Database Access

- Use Prisma client from `~/server/db`
- Use `select` to limit fields when possible
- Use `include` sparingly for relations
- Handle cascading deletes in Prisma schema

```typescript
import { db } from "~/server/db";

// ✅ Good - limit fields
const user = await db.user.findUnique({
  where: { id },
  select: { apiKey: true, email: true },
});

// ❌ Avoid - fetching all fields
const user = await db.user.findUnique({ where: { id } });
```

### 6. Environment Variables

- Define schema in `src/env.js` using **@t3-oss/env-nextjs**
- Server vars: `BETTER_AUTH_SECRET`, `DATABASE_URL`, etc.
- Client vars: Must be prefixed with `NEXT_PUBLIC_`

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CRON_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    // ...
  },
});
```

### 7. Styling Conventions

- Use **Tailwind CSS v4** utility classes
- Dark theme by default (`bg-[#0B1121]`, `text-slate-300`)
- Use CSS variables for consistent theming
- Use `cn()` helper from `~/lib/utils` for conditional classes

```tsx
import { cn } from "~/lib/utils";

<div
  className={cn(
    "bg-[#0B1121] border-slate-800 text-slate-300",
    isActive && "border-green-500"
  )}
/>;
```

### 8. Animations

Use **Framer Motion** for page transitions and micro-interactions:

```tsx
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

<motion.div variants={fadeIn} initial="hidden" animate="visible">
  {/* content */}
</motion.div>;
```

---

## Directory Conventions

| Path                    | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `src/app/actions/`      | Server Actions only                        |
| `src/app/api/`          | ElysiaJS API routes                        |
| `src/components/ui/`    | Shadcn/UI primitives (don't modify)        |
| `src/components/*/`     | Feature-specific components                |
| `src/server/`           | Server-only code (db, auth, utils)         |
| `src/lib/`              | Shared utilities (both client/server safe) |
| `scripts/`              | CLI scripts, workers, deployment helpers   |
| `prisma/`               | Database schema and migrations             |
| `docs/`                 | Project documentation                      |

---

## Import Aliases

Use the `~` alias for absolute imports from `src/`:

```typescript
// ✅ Good
import { db } from "~/server/db";
import { Button } from "~/components/ui/button";

// ❌ Avoid
import { db } from "../../../server/db";
```

---

## Commands Reference

```bash
# Development
bun run dev              # Start dev server with Turbopack
bun run worker           # Run cron worker locally

# Code Quality
bun run check            # Lint + Type check
bun run lint:fix         # Auto-fix lint issues
bun run format:write     # Format with Prettier

# Database
bun run db:push          # Push schema changes
bun run db:studio        # Open Prisma Studio
bun run db:generate      # Generate migration

# Testing
bun run test             # Run Vitest tests
```

---

## Feature Planning Workflow

When given a PRD or feature request, follow this process:

1. **Explore the codebase** - Understand existing patterns, relevant files, and dependencies
2. **Ask clarifying questions** - Before planning, ask about:
   - Requirements that seem ambiguous
   - Constraints (performance, backwards compatibility, etc.)
   - Edge cases and error handling expectations
   - Priority and scope (MVP vs full implementation)
3. **Create a spec-kit style implementation plan** - Write to `docs/<feature_name>_plan.md`:
   - Problem statement and goals
   - Proposed technical approach
   - Files to create/modify
   - Database schema changes (if any)
   - API endpoints (if any)
   - UI components needed
   - Testing strategy
   - Open questions or risks

**Template prompt for new features:**
```
"<paste PRD here>. Explore the codebase and create a spec-kit style 
implementation plan. Write it down to docs/<feature_name>_plan.md.

Before creating this plan, ask me any clarifying questions about 
requirements, constraints, or edge cases."
```

---

## New Feature Checklist

When adding a new feature:

1. [ ] Define Prisma models in `prisma/schema.prisma`
2. [ ] Run `bun run db:push` to sync schema
3. [ ] Add server actions in `src/app/actions/`
4. [ ] Add API routes to ElysiaJS groups if needed
5. [ ] Create components in appropriate `src/components/*/` folder
6. [ ] Use Shadcn/UI primitives where applicable
7. [ ] Add Framer Motion animations for polish
8. [ ] Update docs if API endpoints change
9. [ ] Run `bun run check` before committing
