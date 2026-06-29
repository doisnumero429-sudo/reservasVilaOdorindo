-- =====================================================================
--  VILLA GRILL — Migração "Nível 3" da Lorena
--  Rode no SQL Editor do Supabase (depois do schema.sql).
--  Cria a base de conhecimento (FAQ treinável) e o feedback das respostas.
--  Pode rodar de novo sem problema.
-- =====================================================================

-- Base de conhecimento editável: perguntas/respostas próprias da casa.
create table if not exists public.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  question text not null,
  answer text not null,
  keywords text[] not null default '{}',
  active boolean not null default true,
  sort_order int not null default 0,
  hits int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.ai_knowledge enable row level security;
drop policy if exists "admin_all_ai_knowledge" on public.ai_knowledge;
create policy "admin_all_ai_knowledge" on public.ai_knowledge
  for all using (public.is_admin(restaurant_id)) with check (public.is_admin(restaurant_id));

-- Feedback (👍/👎) das respostas da Lorena.
alter table public.ai_logs add column if not exists feedback text;

-- Fim.
