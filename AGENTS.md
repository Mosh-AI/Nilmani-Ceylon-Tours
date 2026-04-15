# Nilmani Ceylon Tours — Agent Instructions

## Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict) — read `node_modules/next/dist/docs/` before writing any Next.js code. APIs may differ from training data.
- **UI:** shadcn/ui + Tailwind CSS v4 + Lucide icons
- **Auth:** Better Auth — handler import: `better-auth/integrations/next-js` (NOT `better-auth/next-js`)
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Zod:** v4 — use `{ error: "..." }` not `{ invalid_type_error: "..." }` for number schemas

## Design Tokens
- Gold: `#C9A84C`
- Dark: `#1C1209`
- Background: `#FAFAF9`
- Font serif: Cormorant (`font-serif`)
- Font body: Montserrat (`font-sans`)

## Code Style
- TypeScript strict, no `any`
- Named exports, PascalCase components, camelCase utils
- 2-space indentation, mobile-first responsive

## Security Rules
- Every user-facing DB query must be scoped: `AND userId = session.user.id` (IDOR prevention)
- Admin routes: always call `requireAdmin()` / `getAdminSession()` from `src/lib/admin-auth.ts`
- User routes: always call `requireUser()` / `getUserSession()` from `src/lib/user-auth.ts`
- All form inputs validated with Zod server-side
- PII fields (phone) encrypted with `encryptIfPresent()` from `src/lib/encryption.ts`

## Key Files
- `src/db/schema.ts` — full Drizzle schema
- `src/lib/auth.ts` — Better Auth config
- `src/lib/email.ts` — Resend email templates
- `src/lib/validations.ts` — Zod schemas
- `src/lib/sanitize.ts` — input sanitization
- `src/lib/encryption.ts` — AES-256-GCM PII encryption
- `src/middleware.ts` — route protection
