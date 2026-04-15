# Nilmani Ceylon Tours

Full-stack website for **Nilmani Ceylon Tours** — private tour operator based in Seeduwa, Sri Lanka (Roshan Jayasuriya).

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Auth:** Better Auth (email/password + Google OAuth)
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Email:** Resend
- **Error Tracking:** Sentry
- **E2E Testing:** Playwright
- **Deployment:** Docker + Nginx + VPS

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env.local

# 3. Start the database
docker compose up db -d

# 4. Run migrations and seed
npx drizzle-kit migrate
npx tsx src/db/seed.ts

# 5. Start dev server
npm run dev
```

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run check        # lint + typecheck + build
```

## Project Structure

```
src/
  app/              # Next.js App Router pages
    admin/          # Admin dashboard (/admin)
    dashboard/      # User dashboard (/dashboard)
    api/            # API routes
  components/       # Shared React components
  db/               # Drizzle schema + seed
  lib/              # Auth, email, encryption, validation utilities
e2e/                # Playwright E2E tests
nginx/              # Nginx reverse proxy config
public/images/      # Static images
```

## Environment Variables

See `.env.example` for all required variables including:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Auth secret key
- `RESEND_API_KEY` — Transactional email
- `PII_ENCRYPTION_KEY` — AES-256-GCM key for PII fields

## Admin Access

After seeding, the admin account is:
- **Email:** `nilmaniceylontours@gmail.com`
- **Password:** Set via `ADMIN_PASSWORD` env var (see seed script)
- **URL:** `/admin`

## Deployment

See `docker-compose.yml` and `nginx/` for production setup.
