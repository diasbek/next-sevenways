insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sevenways-media',
  'sevenways-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists sw_media_public_read on storage.objects;
create policy sw_media_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'sevenways-media');

drop policy if exists sw_media_staff_insert on storage.objects;
create policy sw_media_staff_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'sevenways-media' and private.is_sw_admin());

drop policy if exists sw_media_staff_update on storage.objects;
create policy sw_media_staff_update
  on storage.objects for update to authenticated
  using (bucket_id = 'sevenways-media' and private.is_sw_admin())
  with check (bucket_id = 'sevenways-media' and private.is_sw_admin());

drop policy if exists sw_media_staff_delete on storage.objects;
create policy sw_media_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'sevenways-media' and private.is_sw_admin());
