# Migrations

Target project: **udplvssgghqajxwbjkyv**  
https://supabase.com/dashboard/project/udplvssgghqajxwbjkyv

`supabase/config.toml` is linked to this project.

## Files

1. `202609110001_sw_wave1_tables.sql` — CMS tables (`sw_*`)
2. `202609110002_sw_wave1_rls.sql` — RLS + `private.is_sw_admin()`
3. `202609110003_sw_storage_media_bucket.sql` — public bucket `sevenways-media`
4. `202609110004_sw_set_updated_at_search_path.sql` — fix `search_path` on trigger helper

## After apply

1. Set in `.env.local` / Hostinger: `SUPABASE_URL`, `SUPABASE_ANON_KEY` / `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SECRET_KEY`)
2. Bootstrap first owner: `/dashboard/setup/` with `CMS_BOOTSTRAP_SECRET`
3. Payments (optional): set `PAYMENTS_ENABLED=1` + `PAYMENTS_SECRETS_KEY`; enter Click/Payme/Uzum in Dashboard → Settings (table `sw_payment_credentials`); enable checkout
4. Applied: `202609110005_sw_payments_multicurrency.sql` — booking_mode, currencies, `sw_payment_orders`
5. Applied: `20260911103645_sw_payment_credentials.sql` — PSP credentials in Supabase

