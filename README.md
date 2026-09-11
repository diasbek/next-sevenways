# Seven Ways

Tourism company website for [sevenways.uz](https://sevenways.uz) — package tours from Tashkent.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Custom i18n: Uzbek (default), Russian (`/ru/`), English (`/en/`)
- Supabase CMS at `/dashboard` (leads, tours, offices, news, media, settings)
- Forms → `/api/leads/` → Supabase + Telegram / Resend

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run build` — production build (webpack)
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint

## Env

Copy `.env.example` → `.env.local` for secrets. Public defaults live in `.env.development` / `.env.production`.
