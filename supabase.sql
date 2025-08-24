-- HISTÓRICO (guarda qualquer geração)
create table if not exists public.generated_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('plan','flashcards','quiz')),
  subject text,
  params jsonb,        -- parâmetros da geração (ex: {count:10, level:'intermediario'})
  payload jsonb not null, -- conteúdo gerado (JSON bruto)
  created_at timestamptz default now()
);
alter table public.generated_history enable row level security;
create policy "history_select_own" on public.generated_history
for select using (auth.uid() = user_id);
create policy "history_insert_own" on public.generated_history
for insert with check (auth.uid() = user_id);

-- QUIZ (instância jogável a partir de um payload gerado)
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text,
  meta jsonb,              -- ex: {count:10, level:'intermediario'}
  questions jsonb not null, -- [{id,statement,options[5],correctIndex,explanation}]
  score int,               -- preenchido ao finalizar
  created_at timestamptz default now(),
  finished_at timestamptz
);
alter table public.quizzes enable row level security;
create policy "quiz_select_own" on public.quizzes
for select using (auth.uid() = user_id);
create policy "quiz_insert_own" on public.quizzes
for insert with check (auth.uid() = user_id);
create policy "quiz_update_own" on public.quizzes
for update using (auth.uid() = user_id);

-- RESPOSTAS DO QUIZ (opcional: salvar cliques)
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_index int not null,     -- 0..n-1
  selected_index int not null,     -- 0..4
  is_correct boolean not null,
  answered_at timestamptz default now()
);
alter table public.quiz_answers enable row level security;
create policy "qa_select_own" on public.quiz_answers
for select using (auth.uid() = user_id);
create policy "qa_insert_own" on public.quiz_answers
for insert with check (auth.uid() = user_id);

-- MATÉRIAS FAVORITAS DO USUÁRIO
create table if not exists public.user_subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  created_at timestamptz default now(),
  unique(user_id, subject)
);
alter table public.user_subjects enable row level security;
create policy "us_select_own" on public.user_subjects
for select using (auth.uid() = user_id);
create policy "us_insert_own" on public.user_subjects
for insert with check (auth.uid() = user_id);
create policy "us_delete_own" on public.user_subjects
for delete using (auth.uid() = user_id);

-- PERFIL DO EXAME
create table if not exists public.exam_profiles (
  user_id uuid not null references auth.users(id) on delete cascade,
  target_exam text,
  university text,
  location text,
  profile_json jsonb not null,
  updated_at timestamptz default now(),
  primary key (user_id, target_exam)
);
alter table public.exam_profiles enable row level security;

drop policy if exists exam_profiles_select_own on public.exam_profiles;
create policy exam_profiles_select_own
on public.exam_profiles
for select using (auth.uid() = user_id);

drop policy if exists exam_profiles_upsert_own on public.exam_profiles;
create policy exam_profiles_upsert_own
on public.exam_profiles
for insert with check (auth.uid() = user_id);

drop policy if exists exam_profiles_update_own on public.exam_profiles;
create policy exam_profiles_update_own
on public.exam_profiles
for update using (auth.uid() = user_id);

select pg_notify('pgrst','reload schema');
