# Migrations

Apply SQL in this folder to a **new** Supabase project for Seven Ways (not the EPOS project).

1. Create project in Supabase dashboard
2. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY` / `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
3. Run migrations via SQL editor or `supabase db push`
4. Create public storage bucket `sevenways-media`
5. Bootstrap first owner: sign up via `/dashboard/setup/` with `CMS_BOOTSTRAP_SECRET`
