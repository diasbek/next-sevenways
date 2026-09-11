-- Booking mode, multicurrency tours, payment orders

alter table public.sw_site_settings
  add column if not exists booking_mode text not null default 'lead_only'
    check (booking_mode in ('lead_only', 'checkout')),
  add column if not exists payments_enabled boolean not null default false,
  add column if not exists enabled_providers text[] not null default '{}',
  add column if not exists default_currency text not null default 'USD'
    check (default_currency in ('UZS', 'USD'));

-- Destinations: neutral from_price + currency (keep from_price_usd for compat)
alter table public.sw_destinations
  add column if not exists from_price numeric(12,2),
  add column if not exists from_currency text not null default 'USD'
    check (from_currency in ('UZS', 'USD'));

update public.sw_destinations
set from_price = from_price_usd
where from_price is null and from_price_usd is not null;

-- Offers: currency + neutral price columns (keep *_usd populated)
alter table public.sw_tour_offers
  add column if not exists currency text not null default 'USD'
    check (currency in ('UZS', 'USD')),
  add column if not exists price_per_person numeric(12,2),
  add column if not exists price_two numeric(12,2);

update public.sw_tour_offers
set
  price_per_person = coalesce(price_per_person, price_per_person_usd),
  price_two = coalesce(price_two, price_two_usd)
where price_per_person is null or price_two is null;

alter table public.sw_tour_offers
  alter column price_per_person set not null,
  alter column price_two set not null;

-- Payment orders
create table if not exists public.sw_payment_orders (
  id text primary key,
  lead_id text references public.sw_leads (id) on delete set null,
  offer_id text,
  amount numeric(14,2) not null,
  currency text not null check (currency in ('UZS', 'USD')),
  provider text not null check (provider in ('click', 'payme', 'uzum')),
  status text not null default 'pending'
    check (status in ('pending', 'waiting', 'paid', 'failed', 'cancelled', 'refunded')),
  external_id text,
  description text,
  customer_name text,
  customer_phone text,
  customer_email text,
  return_url text,
  payload jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sw_payment_orders_status_idx
  on public.sw_payment_orders (status);
create index if not exists sw_payment_orders_provider_idx
  on public.sw_payment_orders (provider);
create index if not exists sw_payment_orders_external_idx
  on public.sw_payment_orders (external_id);

drop trigger if exists sw_payment_orders_updated_at on public.sw_payment_orders;
create trigger sw_payment_orders_updated_at
before update on public.sw_payment_orders
for each row execute function private.set_updated_at();

alter table public.sw_payment_orders enable row level security;

drop policy if exists sw_payment_orders_staff on public.sw_payment_orders;
create policy sw_payment_orders_staff on public.sw_payment_orders
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());
