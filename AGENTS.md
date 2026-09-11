# Seven Ways — agent notes

Next.js 16 App Router. Prefer docs under `node_modules/next/dist/docs/` when APIs differ.

## Scope

- Public tourism site + CMS at `/dashboard` (Supabase project for Seven Ways — configure via env)
- Content: static TS seed (`src/data`, `src/i18n`) with CMS overlays (tours, offices, news, settings)
- Locales: `uz` (default, unprefixed), `ru` (`/ru/`), `en` (`/en/`)
- Canonical host: https://sevenways.uz
- Env: see `.env.example`. Never `NEXT_PUBLIC_SUPABASE_*`.
- Remote: `origin` → `diasbek/next-sevenways`

## Product rules

- Site prices are indicative; final amount confirmed by a manager after a lead
- No online card payment; office cash desk only
- Do not copy TripTour copyrighted copy/photos — IA only

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
