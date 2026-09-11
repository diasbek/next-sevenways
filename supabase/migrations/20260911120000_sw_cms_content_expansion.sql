-- CMS expansion: cover images, site copy, operators, legal, audit

alter table public.sw_destinations
  add column if not exists cover_url text,
  add column if not exists categories text[] not null default '{}';

alter table public.sw_resorts
  add column if not exists cover_url text;

alter table public.sw_offices
  add column if not exists image_url text,
  add column if not exists city_key text;

-- Full site copy overlays (partial SiteCopy JSON per locale bucket)
create table if not exists public.sw_site_copy (
  key text primary key,
  label text not null default '',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

drop trigger if exists sw_site_copy_updated_at on public.sw_site_copy;
create trigger sw_site_copy_updated_at
before update on public.sw_site_copy
for each row execute function private.set_updated_at();

create table if not exists public.sw_operators (
  id text primary key,
  name_uz text not null,
  name_ru text not null,
  name_en text not null,
  role_uz text not null default '',
  role_ru text not null default '',
  role_en text not null default '',
  phone text not null default '',
  telegram text not null default '',
  image_url text,
  is_online boolean not null default true,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists sw_operators_updated_at on public.sw_operators;
create trigger sw_operators_updated_at
before update on public.sw_operators
for each row execute function private.set_updated_at();

create table if not exists public.sw_legal_pages (
  slug text primary key check (slug in ('privacy', 'terms')),
  title_uz text not null default '',
  title_ru text not null default '',
  title_en text not null default '',
  body_uz text not null default '',
  body_ru text not null default '',
  body_en text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists sw_legal_pages_updated_at on public.sw_legal_pages;
create trigger sw_legal_pages_updated_at
before update on public.sw_legal_pages
for each row execute function private.set_updated_at();

create table if not exists public.sw_admin_audit (
  id bigint generated always as identity primary key,
  actor_id uuid,
  actor_email text,
  action text not null,
  entity_type text,
  entity_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sw_admin_audit_created_idx
  on public.sw_admin_audit (created_at desc);

-- RLS
alter table public.sw_site_copy enable row level security;
alter table public.sw_operators enable row level security;
alter table public.sw_legal_pages enable row level security;
alter table public.sw_admin_audit enable row level security;

drop policy if exists sw_site_copy_public_read on public.sw_site_copy;
create policy sw_site_copy_public_read on public.sw_site_copy
  for select using (true);

drop policy if exists sw_site_copy_staff_write on public.sw_site_copy;
create policy sw_site_copy_staff_write on public.sw_site_copy
  for all using (private.is_sw_admin()) with check (private.is_sw_admin());

drop policy if exists sw_operators_public_read on public.sw_operators;
create policy sw_operators_public_read on public.sw_operators
  for select using (is_published = true);

drop policy if exists sw_operators_staff_all on public.sw_operators;
create policy sw_operators_staff_all on public.sw_operators
  for all using (private.is_sw_admin()) with check (private.is_sw_admin());

drop policy if exists sw_legal_pages_public_read on public.sw_legal_pages;
create policy sw_legal_pages_public_read on public.sw_legal_pages
  for select using (true);

drop policy if exists sw_legal_pages_staff_write on public.sw_legal_pages;
create policy sw_legal_pages_staff_write on public.sw_legal_pages
  for all using (private.is_sw_admin()) with check (private.is_sw_admin());

drop policy if exists sw_admin_audit_staff_read on public.sw_admin_audit;
create policy sw_admin_audit_staff_read on public.sw_admin_audit
  for select using (private.is_sw_admin());

drop policy if exists sw_admin_audit_staff_insert on public.sw_admin_audit;
create policy sw_admin_audit_staff_insert on public.sw_admin_audit
  for insert with check (private.is_sw_admin());
