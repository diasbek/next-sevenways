# Migrations

Target project: **udplvssgghqajxwbjkyv**  
https://supabase.com/dashboard/project/udplvssgghqajxwbjkyv

Do **not** apply these SQL files until the separate schema/config for Seven Ways is ready.

When ready:

1. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY` / `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` / Hostinger
2. Apply migrations via SQL editor or `supabase db push`
3. Create public storage bucket `sevenways-media`
4. Bootstrap first owner: `/dashboard/setup/` with `CMS_BOOTSTRAP_SECRET`
