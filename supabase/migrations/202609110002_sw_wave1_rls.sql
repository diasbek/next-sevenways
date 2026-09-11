-- Seven Ways RLS helpers and policies

create or replace function private.is_sw_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sw_admin_users u
    where u.user_id = auth.uid()
      and u.is_active = true
  );
$$;

revoke all on function private.is_sw_admin() from public;
grant execute on function private.is_sw_admin() to authenticated;

alter table public.sw_admin_users enable row level security;
alter table public.sw_leads enable row level security;
alter table public.sw_site_settings enable row level security;
alter table public.sw_destinations enable row level security;
alter table public.sw_resorts enable row level security;
alter table public.sw_tour_offers enable row level security;
alter table public.sw_offices enable row level security;
alter table public.sw_news enable row level security;
alter table public.sw_media enable row level security;
alter table public.sw_messaging_providers enable row level security;
alter table public.sw_messaging_log enable row level security;

-- Admin users: read own row (login) or any as staff
drop policy if exists sw_admin_users_select_own_or_staff on public.sw_admin_users;
create policy sw_admin_users_select_own_or_staff
  on public.sw_admin_users for select to authenticated
  using (user_id = auth.uid() or private.is_sw_admin());

drop policy if exists sw_admin_users_update_staff on public.sw_admin_users;
create policy sw_admin_users_update_staff
  on public.sw_admin_users for update to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_admin_users_insert_staff on public.sw_admin_users;
create policy sw_admin_users_insert_staff
  on public.sw_admin_users for insert to authenticated
  with check (private.is_sw_admin());

-- Public reads (do not OR private.is_sw_admin — anon has no EXECUTE)
drop policy if exists sw_destinations_public_read on public.sw_destinations;
create policy sw_destinations_public_read on public.sw_destinations
  for select to anon, authenticated
  using (is_published = true);

drop policy if exists sw_resorts_public_read on public.sw_resorts;
create policy sw_resorts_public_read on public.sw_resorts
  for select to anon, authenticated
  using (is_published = true);

drop policy if exists sw_tour_offers_public_read on public.sw_tour_offers;
create policy sw_tour_offers_public_read on public.sw_tour_offers
  for select to anon, authenticated
  using (is_published = true);

drop policy if exists sw_offices_public_read on public.sw_offices;
create policy sw_offices_public_read on public.sw_offices
  for select to anon, authenticated
  using (is_published = true);

drop policy if exists sw_news_public_read on public.sw_news;
create policy sw_news_public_read on public.sw_news
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists sw_site_settings_public_read on public.sw_site_settings;
create policy sw_site_settings_public_read on public.sw_site_settings
  for select to anon, authenticated
  using (true);

-- Staff select unpublished + writes
drop policy if exists sw_destinations_staff_select on public.sw_destinations;
create policy sw_destinations_staff_select on public.sw_destinations
  for select to authenticated
  using (private.is_sw_admin());

drop policy if exists sw_resorts_staff_select on public.sw_resorts;
create policy sw_resorts_staff_select on public.sw_resorts
  for select to authenticated
  using (private.is_sw_admin());

drop policy if exists sw_tour_offers_staff_select on public.sw_tour_offers;
create policy sw_tour_offers_staff_select on public.sw_tour_offers
  for select to authenticated
  using (private.is_sw_admin());

drop policy if exists sw_offices_staff_select on public.sw_offices;
create policy sw_offices_staff_select on public.sw_offices
  for select to authenticated
  using (private.is_sw_admin());

drop policy if exists sw_news_staff_select on public.sw_news;
create policy sw_news_staff_select on public.sw_news
  for select to authenticated
  using (private.is_sw_admin());

drop policy if exists sw_leads_staff on public.sw_leads;
create policy sw_leads_staff on public.sw_leads
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_site_settings_staff on public.sw_site_settings;
create policy sw_site_settings_staff on public.sw_site_settings
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_destinations_staff_write on public.sw_destinations;
create policy sw_destinations_staff_write on public.sw_destinations
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_resorts_staff_write on public.sw_resorts;
create policy sw_resorts_staff_write on public.sw_resorts
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_tour_offers_staff_write on public.sw_tour_offers;
create policy sw_tour_offers_staff_write on public.sw_tour_offers
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_offices_staff_write on public.sw_offices;
create policy sw_offices_staff_write on public.sw_offices
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_news_staff_write on public.sw_news;
create policy sw_news_staff_write on public.sw_news
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_media_staff on public.sw_media;
create policy sw_media_staff on public.sw_media
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_messaging_providers_staff on public.sw_messaging_providers;
create policy sw_messaging_providers_staff on public.sw_messaging_providers
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());

drop policy if exists sw_messaging_log_staff on public.sw_messaging_log;
create policy sw_messaging_log_staff on public.sw_messaging_log
  for all to authenticated
  using (private.is_sw_admin())
  with check (private.is_sw_admin());
