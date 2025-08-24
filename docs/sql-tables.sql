-- Para gen_random_uuid()
create extension if not exists pgcrypto;

-- Dificuldades do aluno (psicopedagogo)
create table if not exists public.learning_difficulties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  difficulty_type text,
  description text,
  intensity int check (intensity between 1 and 5),
  interventions jsonb,
  follow_up_date date,
  created_at timestamptz default now()
);
alter table public.learning_difficulties enable row level security;
drop policy if exists ld_select_own on public.learning_difficulties;
create policy ld_select_own on public.learning_difficulties for select using (auth.uid() = user_id);
drop policy if exists ld_insert_own on public.learning_difficulties;
create policy ld_insert_own on public.learning_difficulties for insert with check (auth.uid() = user_id);
drop policy if exists ld_update_own on public.learning_difficulties;
create policy ld_update_own on public.learning_difficulties for update using (auth.uid() = user_id);
drop policy if exists ld_delete_own on public.learning_difficulties;
create policy ld_delete_own on public.learning_difficulties for delete using (auth.uid() = user_id);

-- Sessões do Professor (opcional: guardar últimas respostas da IA)
create table if not exists public.professor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text,
  level text,
  payload jsonb not null,
  created_at timestamptz default now()
);
alter table public.professor_sessions enable row level security;
drop policy if exists ps_select_own on public.professor_sessions;
create policy ps_select_own on public.professor_sessions for select using (auth.uid() = user_id);
drop policy if exists ps_insert_own on public.professor_sessions;
create policy ps_insert_own on public.professor_sessions for insert with check (auth.uid() = user_id);

select pg_notify('pgrst','reload schema');
