-- lucIA · Supabase schema (run in SQL Editor or supabase db push)
-- After: enable Row Level Security policies that match your auth model.

create type lucia_role as enum ('student', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role lucia_role not null default 'student',
  created_at timestamptz default now()
);

create table public.text_submissions (
  id uuid primary key default gen_random_uuid (),
  student_id uuid references public.profiles (id) on delete set null,
  student_label text not null default 'Estudiante',
  title text not null,
  body text not null,
  status text not null default 'nuevo' check (status in ('nuevo', 'en_revision', 'devuelto')),
  admin_comment text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.custom_books (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  tags text[] default '{}',
  fun_facts text[] default '{}',
  pages jsonb not null default '[]',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.exercise_attempts (
  id uuid primary key default gen_random_uuid (),
  student_id uuid references public.profiles (id) on delete set null,
  student_label text not null,
  exercise_id text not null,
  exercise_summary text not null,
  level text not null,
  correct boolean not null,
  score_percent smallint not null check (score_percent >= 0 and score_percent <= 100),
  attempted_at timestamptz default now()
);

create table public.scheduled_sessions (
  id uuid primary key default gen_random_uuid (),
  student_label text not null,
  title text not null,
  notes text default '',
  starts_at timestamptz not null,
  google_event_id text,
  created_at timestamptz default now()
);

create index text_submissions_created_idx on public.text_submissions (created_at desc);
create index attempts_at_idx on public.exercise_attempts (attempted_at desc);
create index sessions_start_idx on public.scheduled_sessions (starts_at);

alter table public.profiles enable row level security;
alter table public.text_submissions enable row level security;
alter table public.custom_books enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.scheduled_sessions enable row level security;

-- Policies are project-specific; typical pattern:
-- students: insert/read own submissions; admins: all (role check via profiles).
-- Placeholder: tighten before production.

comment on table public.text_submissions is 'Escritos enviados por estudiantes para revisión humana.';
comment on table public.custom_books is 'Libros con notas y curiosidades; páginas en JSON (BookPage[]).';
