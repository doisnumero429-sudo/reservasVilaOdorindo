-- =====================================================================
--  VILLA GRILL — Motor de Reclamações/Sugestões do Bento (customer_feedback)
--  Rode no SQL Editor do Supabase (depois do schema.sql). Pode rodar de novo.
-- =====================================================================

create table if not exists public.customer_feedback (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  protocolo text unique,
  unidade text not null default 'Villa Grill 1 - Odorindo Perenha',
  tipo_manifestacao text,            -- reclamação | sugestão | feedback
  nome_cliente text,
  whatsapp_cliente text,
  relato_original text,
  relato_organizado text,
  categoria text,
  prioridade text,                   -- baixa | média | alta
  data_ocorrido text,
  horario_ocorrido text,
  periodo text,
  canal text,
  mesa_numero text,
  mesa_referencia text,
  valor_cobrado text,
  valor_esperado text,
  forma_pagamento text,
  prato_item text,
  expectativa_cliente text,
  status text not null default 'novo'
    check (status in ('rascunho','novo','em_analise','aguardando_cliente','respondido','resolvido','arquivado')),
  enviado_gerencia boolean not null default false,
  origem_envio text,                 -- bento | whatsapp
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_feedback_rest_data on public.customer_feedback (restaurant_id, created_at desc);
create index if not exists idx_feedback_status on public.customer_feedback (restaurant_id, status);

create table if not exists public.customer_feedback_attachments (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid references public.customer_feedback(id) on delete cascade,
  file_url text,
  file_name text,
  file_type text,
  file_size int,
  attachment_kind text,              -- comprovante | foto_comida | foto_ambiente | print | outro
  created_at timestamptz not null default now()
);

alter table public.customer_feedback enable row level security;
alter table public.customer_feedback_attachments enable row level security;

drop policy if exists "admin_all_customer_feedback" on public.customer_feedback;
create policy "admin_all_customer_feedback" on public.customer_feedback
  for all using (public.is_admin(restaurant_id)) with check (public.is_admin(restaurant_id));

drop policy if exists "admin_all_feedback_attachments" on public.customer_feedback_attachments;
create policy "admin_all_feedback_attachments" on public.customer_feedback_attachments
  for all using (
    exists (select 1 from public.customer_feedback f
            where f.id = feedback_id and public.is_admin(f.restaurant_id))
  ) with check (true);

drop trigger if exists trg_touch_customer_feedback on public.customer_feedback;
create trigger trg_touch_customer_feedback before update on public.customer_feedback
  for each row execute function public.touch_updated_at();

-- Gera o próximo protocolo VG-AAAA-NNNNNN para o restaurante/ano.
create or replace function public.next_feedback_protocol(p_restaurant_id uuid)
returns text language plpgsql as $$
declare ano text := to_char(now() at time zone 'America/Sao_Paulo', 'YYYY');
declare seq int;
begin
  select count(*) + 1 into seq
  from public.customer_feedback
  where restaurant_id = p_restaurant_id
    and to_char(created_at at time zone 'America/Sao_Paulo', 'YYYY') = ano;
  return 'VG-' || ano || '-' || lpad(seq::text, 6, '0');
end $$;

-- Fim.
