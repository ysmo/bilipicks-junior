-- 给已经在用的 BiliPicks 项目加上「一个孩子可以选多门课」。
-- 在 Supabase 的 SQL Editor 里整段执行一次。可以重复执行。
-- 不需要 service_role。不要把任何密钥写进这个文件。
--
-- 已有的 public.profiles / public.progress 和原来的 RLS 不动。
-- g1、jh 的旧行会保留：track 仍是上次打开的课，courses 会补上这一门。
-- 进度本来就在 progress.data.tracks 里按 g1 / jh 分开，这条 SQL 不改那些记录。
--
-- 合并之后、执行这条 SQL 之前，两门现有课仍然可以切换：
-- track 还是 g1 或 jh，选课列表也会写在进度 JSON 的 selected 里。
-- 执行之后，选课列表写在档案上，以后的新课编号也能放进 track。

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
