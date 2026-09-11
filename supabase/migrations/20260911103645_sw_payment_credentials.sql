-- PSP credentials editable from Dashboard → Settings (service role / staff RLS)

create table if not exists public.sw_payment_credentials (
  provider text primary key
    check (provider in ('click', 'payme', 'uzum')),
  -- Non-secret + encrypted secret fields (enc:v1:… strings)
  credentials jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.sw_payment_credentials (provider, credentials)
values
  ('click', '{}'::jsonb),
  ('payme', '{}'::jsonb),
  ('uzum', '{}'::jsonb)
on conflict (provider) do nothing;

drop trigger if exists sw_payment_credentials_updated_at on public.sw_payment_credentials;
create trigger sw_payment_credentials_updated_at
before update on public.sw_payment_credentials
for each row execute function private.set_updated_at();

alter table public.sw_payment_credentials enable row level security;

drop policy if exists sw_payment_credentials_staff on public.sw_payment_credentials;
create policy sw_payment_credentials_staff on public.sw_payment_credentials
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());
