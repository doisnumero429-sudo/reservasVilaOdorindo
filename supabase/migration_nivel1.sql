-- =====================================================================
--  VILLA GRILL — Migração "Nível 1" da Lorena
--  Rode no SQL Editor do Supabase (depois do schema.sql).
--  Cria o cache de respostas da IA (economiza requisições/custo).
--  Pode rodar de novo sem problema.
-- =====================================================================

create table if not exists public.ai_cache (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  question_key text not null,
  answer text not null,
  hits int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, question_key)
);

alter table public.ai_cache enable row level security;

drop policy if exists "admin_all_ai_cache" on public.ai_cache;
create policy "admin_all_ai_cache" on public.ai_cache
  for all using (public.is_admin(restaurant_id)) with check (public.is_admin(restaurant_id));

-- Fim.
