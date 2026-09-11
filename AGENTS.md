# Seven Ways — agent notes

Next.js 16 App Router. Prefer docs under `node_modules/next/dist/docs/` when APIs differ.

## Scope

- Public tourism site + CMS at `/dashboard` (Supabase project **sevenways** / `udplvssgghqajxwbjkyv`)
- Content: static TS seed (`src/data`, `src/i18n`) with CMS overlays (tours, offices, news, settings)
- Locales: `uz` (default, unprefixed), `ru` (`/ru/`), `en` (`/en/`)
- Canonical host: https://sevenways.uz
- Env:
  - Public defaults: `.env.development` / `.env.production` (include `SUPABASE_URL` only)
  - Secrets: `.env.local` or Hostinger / `.env.production.local` — see `.env.example` / `.env.production.example`
  - Server-only: `SUPABASE_URL` + `SUPABASE_ANON_KEY` (or `SUPABASE_PUBLISHABLE_KEY`) + `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` / `SUPABASE_API_KEY` (+ `CMS_BOOTSTRAP_SECRET` only for first owner). Never `NEXT_PUBLIC_SUPABASE_*`.
- Remote: `origin` → `diasbek/next-sevenways`
- Migrations: do not apply until the separate Supabase schema config is ready

## Product rules

- Site prices are indicative; final amount confirmed by a manager after a lead (unless CMS `booking_mode=checkout`)
- Online card payment is **off by default** (`booking_mode=lead_only`, `payments_enabled=false`, `PAYMENTS_ENABLED=0`). Enable in Dashboard → Settings + PSP credentials (stored in `sw_payment_credentials`, optional env fallback). Set `PAYMENTS_SECRETS_KEY` to encrypt secrets at rest. Humo/Uzcard/Visa/Mastercard via those PSPs.
- Tours support **UZS** and **USD** (`currency` on offers). Click/Payme: UZS; Uzum: UZS+USD when contracted.
- Do not copy TripTour copyrighted copy/photos — IA only

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
