-- Seven Ways CMS tables

create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin users
create table if not exists public.sw_admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  role text not null check (role in ('owner', 'editor', 'viewer')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists sw_admin_users_updated_at on public.sw_admin_users;
create trigger sw_admin_users_updated_at
before update on public.sw_admin_users
for each row execute function private.set_updated_at();

-- Leads / CRM
create table if not exists public.sw_leads (
  id text primary key,
  type text not null check (type in ('tour', 'contact', 'price', 'business')),
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'won', 'lost', 'spam')),
  locale text not null default 'uz',
  name text,
  phone text,
  email text,
  page_url text,
  request_id text,
  payload jsonb not null default '{}'::jsonb,
  kanban_sort bigint not null default 0,
  notified_email boolean not null default false,
  notified_telegram boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sw_leads_status_idx on public.sw_leads (status);
create index if not exists sw_leads_created_idx on public.sw_leads (created_at desc);

drop trigger if exists sw_leads_updated_at on public.sw_leads;
create trigger sw_leads_updated_at
before update on public.sw_leads
for each row execute function private.set_updated_at();

-- Site settings
create table if not exists public.sw_site_settings (
  id int primary key default 1 check (id = 1),
  phone text,
  email text,
  telegram_url text,
  instagram_url text,
  facebook_url text,
  hours text,
  address_uz text,
  address_ru text,
  address_en text,
  map_lat double precision,
  map_lng double precision,
  updated_at timestamptz not null default now()
);

insert into public.sw_site_settings (id) values (1)
on conflict (id) do nothing;

-- Destinations CMS overlay
create table if not exists public.sw_destinations (
  slug text primary key,
  name_uz text not null,
  name_ru text not null,
  name_en text not null,
  blurb_uz text not null default '',
  blurb_ru text not null default '',
  blurb_en text not null default '',
  from_price_usd numeric(10,2),
  country_code text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.sw_resorts (
  slug text primary key,
  destination_slug text not null references public.sw_destinations (slug) on delete cascade,
  name_uz text not null,
  name_ru text not null,
  name_en text not null,
  blurb_uz text not null default '',
  blurb_ru text not null default '',
  blurb_en text not null default '',
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.sw_tour_offers (
  id text primary key,
  destination_slug text not null references public.sw_destinations (slug) on delete cascade,
  resort_slug text references public.sw_resorts (slug) on delete set null,
  hotel text not null,
  rating numeric(3,1),
  nights int not null,
  board_uz text not null default '',
  board_ru text not null default '',
  board_en text not null default '',
  room_uz text not null default '',
  room_ru text not null default '',
  room_en text not null default '',
  date_from date,
  date_to date,
  price_per_person_usd numeric(10,2) not null,
  price_two_usd numeric(10,2) not null,
  badges text[] not null default '{}',
  featured boolean not null default false,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Offices
create table if not exists public.sw_offices (
  id text primary key,
  city_uz text not null,
  city_ru text not null,
  city_en text not null,
  name_uz text not null,
  name_ru text not null,
  name_en text not null,
  address_uz text not null,
  address_ru text not null,
  address_en text not null,
  phones text[] not null default '{}',
  lat double precision,
  lng double precision,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- News
create table if not exists public.sw_news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_uz text not null,
  title_ru text not null,
  title_en text not null,
  excerpt_uz text not null default '',
  excerpt_ru text not null default '',
  excerpt_en text not null default '',
  body_uz text not null default '',
  body_ru text not null default '',
  body_en text not null default '',
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media
create table if not exists public.sw_media (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  created_at timestamptz not null default now()
);

-- Messaging (simplified)
create table if not exists public.sw_messaging_providers (
  id text primary key,
  channel text not null check (channel in ('telegram', 'email', 'sms')),
  label text not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.sw_messaging_log (
  id bigint generated always as identity primary key,
  channel text not null,
  event text not null,
  entity_type text,
  entity_id text,
  ok boolean not null default false,
  detail text,
  created_at timestamptz not null default now()
);
