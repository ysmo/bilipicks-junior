-- BiliPicks 账号和每个孩子的学习进度。
-- 在 Supabase 的 SQL Editor 里整段执行。只使用 anon 公钥时，
-- 下面的 RLS 保证家长只能读写自己账号下的孩子档案。
-- 不要把 service_role 密钥放到网站或这个仓库里。
--
-- profiles.track 是这个孩子上次打开的课（g1、jh，或以后的新课编号）。
-- profiles.courses 是家长给这个孩子选的课，可以有好几门。
-- 进度在 progress.data 里按课程编号分开，换课不会互相覆盖。
-- 已经建过表的项目，再执行一次文末的升级语句，或单独执行 migrate-courses.sql。

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  track text not null default 'jh',
  courses text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint profiles_display_name_len check (char_length(btrim(display_name)) between 1 and 24),
  constraint profiles_track_check check (track ~ '^[a-z0-9][a-z0-9_-]{0,31}$'),
  constraint profiles_courses_check check (cardinality(courses) <= 24)
);

create table if not exists public.progress (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_idx on public.profiles (user_id);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists profiles_select on public.profiles;
drop policy if exists profiles_insert on public.profiles;
drop policy if exists profiles_update on public.profiles;
drop policy if exists profiles_delete on public.profiles;
drop policy if exists progress_select on public.progress;
drop policy if exists progress_insert on public.progress;
drop policy if exists progress_update on public.progress;
drop policy if exists progress_delete on public.progress;

create policy profiles_select on public.profiles
  for select using (auth.uid() = user_id);
create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = user_id);
create policy profiles_update on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy profiles_delete on public.profiles
  for delete using (auth.uid() = user_id);

create policy progress_select on public.progress
  for select using (auth.uid() = user_id);
create policy progress_insert on public.progress
  for insert with check (auth.uid() = user_id);
create policy progress_update on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy progress_delete on public.progress
  for delete using (auth.uid() = user_id);

create or replace function public.progress_owner_ok()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles p
    where p.id = new.profile_id
      and p.user_id = auth.uid()
      and p.user_id = new.user_id
  ) then
    raise exception 'profile does not belong to this account';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists progress_owner_ok on public.progress;
create trigger progress_owner_ok
  before insert or update on public.progress
  for each row execute function public.progress_owner_ok();

revoke all on public.profiles from anon, public;
revoke all on public.progress from anon, public;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.progress to authenticated;

-- 已经建过表的项目：补上 courses，并放宽 track。可以重复执行。
-- g1 / jh 的旧行会留下，并把自己的 track 放进 courses。
-- 单独执行时用 supabase/migrate-courses.sql，内容和下面相同。
alter table public.profiles add column if not exists courses text[] not null default '{}';

alter table public.profiles drop constraint if exists profiles_track_check;
alter table public.profiles
  add constraint profiles_track_check check (track ~ '^[a-z0-9][a-z0-9_-]{0,31}$');

alter table public.profiles drop constraint if exists profiles_courses_check;
alter table public.profiles
  add constraint profiles_courses_check check (cardinality(courses) <= 24);

update public.profiles
set courses = array[track]
where cardinality(courses) = 0
  and track is not null;

update public.profiles
set courses = array[track] || courses
where track is not null
  and not (track = any(courses));
