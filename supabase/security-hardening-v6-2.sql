-- DERMA-MAZE V6.2 — SECURITY MIGRATION FOR AN EXISTING SUPABASE PROJECT
-- Back up the derma_updates table first. Run once in SQL Editor.

begin;

-- Convert legacy public Storage URLs into object paths.
update public.derma_updates
set cover_image = regexp_replace(
  cover_image,
  '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/updates-media/',
  ''
)
where cover_image ~ '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/updates-media/';

update public.derma_updates u
set images = coalesce((
  select jsonb_agg(
    case
      when value #>> '{}' ~ '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/updates-media/'
      then to_jsonb(regexp_replace(
        value #>> '{}',
        '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/updates-media/',
        ''
      ))
      else value
    end
  )
  from jsonb_array_elements(u.images) value
), '[]'::jsonb)
where jsonb_typeof(u.images) = 'array';

create or replace function public.is_updates_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.update_admins
    where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_updates_admin() from public;
grant execute on function public.is_updates_admin() to authenticated;

-- Hide created_by from browser roles while preserving admin CRUD.
revoke all on table public.derma_updates from anon, authenticated;
grant select (
  id, slug, status, category, featured, version, chapter,
  title_ar, title_en, summary_ar, summary_en, content_ar, content_en,
  cover_image, images, tags, published_at, created_at, updated_at
) on table public.derma_updates to anon, authenticated;
grant insert (
  slug, status, category, featured, version, chapter,
  title_ar, title_en, summary_ar, summary_en, content_ar, content_en,
  cover_image, images, tags, published_at
) on table public.derma_updates to authenticated;
grant update (
  slug, status, category, featured, version, chapter,
  title_ar, title_en, summary_ar, summary_en, content_ar, content_en,
  cover_image, images, tags, published_at
) on table public.derma_updates to authenticated;
grant delete on table public.derma_updates to authenticated;

update storage.buckets
set public=false,
    file_size_limit=5242880,
    allowed_mime_types=array['image/jpeg','image/png','image/webp']
where id='updates-media';

create or replace function public.is_published_update_media(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.derma_updates
    where status = 'published'
      and published_at is not null
      and published_at <= now()
      and (
        cover_image = object_name
        or images @> jsonb_build_array(object_name)
      )
  );
$$;
revoke all on function public.is_published_update_media(text) from public;
grant execute on function public.is_published_update_media(text) to anon, authenticated;

drop policy if exists "Published update media can be read" on storage.objects;
create policy "Published update media can be read"
on storage.objects for select to anon, authenticated
using (bucket_id='updates-media' and (select public.is_published_update_media(name)));

drop policy if exists "Update admins can read media metadata" on storage.objects;
create policy "Update admins can read media metadata"
on storage.objects for select to authenticated
using (bucket_id='updates-media' and (select public.is_updates_admin()));

drop policy if exists "Update admins can upload media" on storage.objects;
create policy "Update admins can upload media"
on storage.objects for insert to authenticated
with check (bucket_id='updates-media' and (select public.is_updates_admin()));

drop policy if exists "Update admins can update media" on storage.objects;
create policy "Update admins can update media"
on storage.objects for update to authenticated
using (bucket_id='updates-media' and (select public.is_updates_admin()))
with check (bucket_id='updates-media' and (select public.is_updates_admin()));

drop policy if exists "Update admins can delete media" on storage.objects;
create policy "Update admins can delete media"
on storage.objects for delete to authenticated
using (bucket_id='updates-media' and (select public.is_updates_admin()));

commit;
