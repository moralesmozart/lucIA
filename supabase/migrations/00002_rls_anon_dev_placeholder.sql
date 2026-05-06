-- ⚠️ SOLO DESARROLLO · Quita o sustituye antes de producción.
-- Sin Auth real, esto permite que anon/authenticated lean y escriban todo.
-- Cuando uses Supabase Auth + profiles.role, reemplaza por políticas por usuario.

create policy "dev_text_submissions_all"
  on public.text_submissions for all
  to anon, authenticated
  using (true) with check (true);

create policy "dev_custom_books_all"
  on public.custom_books for all
  to anon, authenticated
  using (true) with check (true);

create policy "dev_exercise_attempts_all"
  on public.exercise_attempts for all
  to anon, authenticated
  using (true) with check (true);

create policy "dev_scheduled_sessions_all"
  on public.scheduled_sessions for all
  to anon, authenticated
  using (true) with check (true);

-- `profiles` enlaza con auth.users: sin usuarios reales, no uses políticas «todo» aquí.
-- Añade trigger `on_auth_user_created` + políticas por `auth.uid()` cuando actives Auth.
