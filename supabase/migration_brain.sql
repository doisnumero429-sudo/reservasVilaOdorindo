-- =====================================================================
--  VILLA GRILL — "Cérebro do Bento" (conhecimento/regras versionado)
--  Rode no SQL Editor do Supabase (depois do schema.sql). Pode rodar de novo.
-- =====================================================================

create table if not exists public.ai_brain (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  version int not null,
  data jsonb not null,
  active boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  unique (restaurant_id, version)
);
create index if not exists idx_brain_active on public.ai_brain (restaurant_id, active);

alter table public.ai_brain enable row level security;
drop policy if exists "admin_all_ai_brain" on public.ai_brain;
create policy "admin_all_ai_brain" on public.ai_brain
  for all using (public.is_admin(restaurant_id)) with check (public.is_admin(restaurant_id));

-- O servidor (service_role) lê o cérebro ativo ignorando RLS; o público não acessa.
-- Fim.
