# Nilmani Ceylon Tours — Project Context

This document preserves full project context for AI assistants and developers.
Last updated: 2026-04-15. Phases 1–4 complete.

---

## What This Is
Full-stack website for Nilmani Ceylon Tours — private tour operator, Roshan Jayasuriya, Seeduwa, Sri Lanka.
Built to fulfill Skymax Solution quotation INV-2025-001 (LKR 132,100).

## Stack
- **Framework:** Next.js 16.2.1 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui + Tailwind CSS v4 + Lucide icons
- **Auth:** Better Auth v1.6.4 (email/password + Google OAuth)
  - Handler: `better-auth/next-js` (NOT `better-auth/integrations/next-js`)
  - Adapter: `better-auth/adapters/drizzle` (NOT `better-auth/adapters/drizzle-adapter`)
  - Client: `better-auth/react` (NOT `better-auth/client/react`)
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Email:** Resend (free tier)
- **Error tracking:** Sentry
- **E2E tests:** Playwright
- **Deployment:** PM2 + Nginx on VPS (no Docker)

## Design Tokens
- Gold: `#C9A84C` (brand accent)
- Dark: `#1C1209` (primary text/backgrounds)
- Background: `#FAFAF9`
- Font serif: Cormorant (`font-serif`, headings)
- Font body: Montserrat (`font-sans`, body text)

## Key Files
| File | Purpose |
|------|---------|
| `src/db/schema.ts` | Full Drizzle schema — all 13 tables |
| `src/lib/auth.ts` | Better Auth server config |
| `src/lib/auth-client.ts` | Better Auth React client |
| `src/lib/user-auth.ts` | `requireUser()` + `getUserSession()` |
| `src/lib/admin-auth.ts` | `requireAdmin()` + `getAdminSession()` |
| `src/lib/email.ts` | Resend HTML email templates |
| `src/lib/validations.ts` | Zod schemas for all forms |
| `src/lib/sanitize.ts` | Input sanitization utilities |
| `src/lib/encryption.ts` | AES-256-GCM PII encryption |
| `src/lib/rate-limit.ts` | 4-tier rate limiting |
| `src/middleware.ts` | Route protection (/admin, /dashboard) |
| `src/db/seed.ts` | Seed admin + initial content |
| `ecosystem.config.js` | PM2 config (port 3002) |

## Security Rules (critical)
1. **IDOR prevention**: every user DB query scoped with `AND userId = session.user.id`
2. **Admin guard**: every `/api/admin/*` handler calls `getAdminSession()` first
3. **User guard**: every `/api/user/*` handler calls `getUserSession()` first
4. **PII encryption**: phone fields use `encryptIfPresent()` from `src/lib/encryption.ts`
5. **Zod validation**: all inputs validated server-side

## Database Tables
`user`, `session`, `account`, `verification` — Better Auth tables
`tours`, `destinations`, `tour_destinations` — tour content
`bookings`, `booking_status_history` — booking management
`gallery_images`, `blog_posts`, `testimonials` — content
`site_settings` — key/value store
`messages` — booking thread messages (senderRole: admin|user|guest)
`favorites` — user saved tours
`contact_submissions` — contact form entries

## Booking Status Flow
`inquiry → quoted → deposit_paid → confirmed → in_progress → completed → cancelled`

## Booking Reference Format
`NCT-YYYYMMDD-XXXXX` (generated in `src/lib/sanitize.ts`)

## Admin Credentials (after seed)
- Email: `nilmaniceylontours@gmail.com`
- Password: set via `ADMIN_PASSWORD` env var in seed script
- URL: `/admin`

## Deployment (VPS: 89.116.29.233)
- **App path:** `/var/www/nilmani`
- **Port:** 3002 (PM2)
- **Domain:** `www.nilmaniceylontours.skymaxsolution.com`
- **Process manager:** PM2 (`pm2 list` → name: `nilmani`)
- **Nginx config:** `/etc/nginx/sites-available/nilmani`
- **Database:** PostgreSQL local, db: `nilmani`, user: `nilmani`
- **CI/CD:** GitHub Actions on push to master (`.github/workflows/deploy.yml`)

## What's Built (Phases 1–4)
### Phase 1 — Public Frontend
Homepage, tours listing, tour detail pages, gallery, about, contact form,
booking form, WhatsApp button, breadcrumbs, SEO (sitemap, robots, JSON-LD,
OG tags), 404/error/loading pages, web manifest, Nginx security headers.

### Phase 2 — Backend
PostgreSQL + Drizzle schema, Better Auth, Resend email (dual notification
+ auto-reply), contact + booking server actions, rate limiting, CSRF,
honeypot, Zod validation, DB seed, Sentry, Playwright E2E setup.

### Phase 3 — Admin Dashboard (/admin)
Full CRUD: tours, bookings, gallery, blog, testimonials, site settings.
File upload (magic bytes validation, UUID filenames). Blog XSS sanitization.
Booking status workflow + history. Admin-only route guards.

### Phase 4 — User Accounts
Auth pages (login/register/forgot-password). User dashboard (bookings,
favorites, messages, voucher download, settings). IDOR prevention on all
queries. PII encryption (AES-256-GCM). GDPR: cookie consent, privacy policy,
terms, data export (Art.20), account erasure (Art.17). Message threads
(user ↔ admin per booking). E2E tests for all user flows.

## Remaining Work (Phase 5)
- AI Chatbot (Groq/Llama, free) — LKR 30,000 quotation item
- Trip Planner interactive map — LKR 15,000 quotation item
- Blog (5 SEO articles)
- Destination hub pages
- Google Business Profile + TripAdvisor + review collection
