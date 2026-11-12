-- Adds: admin role check, video URL fields, subjects, site settings, admin policies, safe profile policy.
create function is_admin() returns bool language sql security definer stable set search_path=public as $$
 select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
alter table lessons add column if not exists video_url text, add column if not exists embed_url text, add column if not exists thumbnail_url text, add column if not exists duration_seconds int;
create table if not exists subjects(id uuid primary key default gen_random_uuid(), name text not null, position int default 0);
alter table courses add column if not exists subject_id uuid references subjects;
create table if not exists site_settings(key text primary key, value jsonb not null default '{}');
alter table subjects enable row level security; alter table site_settings enable row level security;
create policy subj_read on subjects for select using (true);
create policy set_read on site_settings for select using (true);
-- students may edit their profile but never change their own role
drop policy if exists p_self_upd on profiles;
create policy p_self_upd on profiles for update using (id=auth.uid()) with check (id=auth.uid() and role=(select role from profiles where id=auth.uid()));
create policy p_admin_all on profiles for all using (is_admin()) with check (is_admin());
create policy c_admin on courses for all using (is_admin()) with check (is_admin());
create policy u_admin on units for all using (is_admin()) with check (is_admin());
create policy l_admin on lessons for all using (is_admin()) with check (is_admin());
create policy pk_admin on packages for all using (is_admin()) with check (is_admin());
create policy pkc_admin on package_courses for all using (is_admin()) with check (is_admin());
create policy pm_admin on payment_methods for all using (is_admin()) with check (is_admin());
create policy pr_admin on payment_requests for all using (is_admin()) with check (is_admin());
create policy s_admin on subscriptions for all using (is_admin()) with check (is_admin());
create policy subj_admin on subjects for all using (is_admin()) with check (is_admin());
create policy set_admin on site_settings for all using (is_admin()) with check (is_admin());
create index if not exists idx_progress_user_updated on lesson_progress(user_id, updated_at desc);
create index if not exists idx_lessons_course on lessons(course_id, position);
-- Make someone admin manually (SQL editor only): update profiles set role='admin' where id='<user uuid>';
