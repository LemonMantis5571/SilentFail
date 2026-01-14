# Contributing to SilentFail

Thanks for your interest in contributing! 🎉

## Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/SilentFail.git
cd silentfail

# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Start database
docker-compose --profile local-db up db -d

# Push schema
bun run db:push

# Run dev server
bun run dev

# In another terminal, run the worker
bun run worker
```

## Development Workflow

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes
3. Run checks: `bun run check`
4. Commit with clear message
5. Push and open a PR

## Code Style

- **TypeScript** - Use strict types, avoid `any`
- **Imports** - Use `~/` alias for absolute imports
- **Components** - Use Shadcn/UI primitives from `~/components/ui/`
- **API Routes** - Add to appropriate file in `src/server/api/`
- **Formatting** - Prettier handles it: `bun run format:write`

## Before Submitting

- [ ] `bun run check` passes (lint + types)
- [ ] Tested your changes locally
- [ ] Updated docs if needed

## Types of Contributions

- 🐛 **Bug fixes** - Always welcome
- ✨ **Features** - Open an issue first to discuss
- 📝 **Docs** - Improvements to README, comments, etc.
- 🧪 **Tests** - We need more of these!

## Questions?

Open an issue or start a discussion. We're happy to help!
