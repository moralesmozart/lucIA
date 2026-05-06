-- Identificador estable por navegador (no reemplaza Auth; sirve hasta login real).
alter table public.text_submissions
  add column if not exists student_local_id text not null default '';

create index if not exists text_submissions_student_local_id_idx
  on public.text_submissions (student_local_id)
  where student_local_id <> '';

comment on column public.text_submissions.student_local_id is 'UUID persistente en localStorage del estudiante; filtrar "mis textos".';
