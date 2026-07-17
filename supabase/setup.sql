
-- DERMA-MAZE UPDATE CENTER — ONE-TIME SUPABASE SETUP
-- Run this file in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.update_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.update_admins enable row level security;

drop policy if exists "Admins can view their own membership" on public.update_admins;
create policy "Admins can view their own membership"
on public.update_admins for select to authenticated
using (user_id = (select auth.uid()));

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

create table if not exists public.derma_updates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft','published')),
  category text not null default 'content' check (category in ('correction','content','treatment','questions','book','website')),
  featured boolean not null default false,
  version text,
  chapter text,
  title_ar text not null,
  title_en text not null,
  summary_ar text not null,
  summary_en text not null,
  content_ar text not null default '',
  content_en text not null default '',
  cover_image text,
  images jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  published_at timestamptz,
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists derma_updates_status_published_idx on public.derma_updates(status,published_at desc);
create index if not exists derma_updates_category_idx on public.derma_updates(category);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path=public as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists derma_updates_set_updated_at on public.derma_updates;
create trigger derma_updates_set_updated_at before update on public.derma_updates
for each row execute function public.set_updated_at();

alter table public.derma_updates enable row level security;

drop policy if exists "Public can read published updates" on public.derma_updates;
create policy "Public can read published updates"
on public.derma_updates for select to anon, authenticated
using (status='published' and published_at is not null and published_at <= now());

drop policy if exists "Update admins can read all updates" on public.derma_updates;
create policy "Update admins can read all updates"
on public.derma_updates for select to authenticated
using ((select public.is_updates_admin()));

drop policy if exists "Update admins can insert updates" on public.derma_updates;
create policy "Update admins can insert updates"
on public.derma_updates for insert to authenticated
with check ((select public.is_updates_admin()));

drop policy if exists "Update admins can modify updates" on public.derma_updates;
create policy "Update admins can modify updates"
on public.derma_updates for update to authenticated
using ((select public.is_updates_admin()))
with check ((select public.is_updates_admin()));

drop policy if exists "Update admins can delete updates" on public.derma_updates;
create policy "Update admins can delete updates"
on public.derma_updates for delete to authenticated
using ((select public.is_updates_admin()));

grant select on public.derma_updates to anon;
grant select, insert, update, delete on public.derma_updates to authenticated;
grant select on public.update_admins to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('updates-media','updates-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

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

-- FINAL MANUAL STEP
-- 1) In Supabase Dashboard > Authentication > Users, create the admin user.
-- 2) Copy that user's UUID and run:
-- insert into public.update_admins (user_id) values ('PASTE_AUTH_USER_UUID_HERE');
