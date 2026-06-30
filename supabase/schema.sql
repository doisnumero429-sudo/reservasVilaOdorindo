-- =====================================================================
--  VILLA GRILL — ESQUEMA DO BANCO (Supabase / PostgreSQL)
-- ---------------------------------------------------------------------
--  COMO USAR:
--  1. Abra o Supabase do seu projeto.
--  2. Menu lateral > "SQL Editor" > "New query".
--  3. Cole TODO o conteúdo deste arquivo e clique em "Run".
--  4. Depois rode o arquivo supabase/seed.sql (dados iniciais).
--
--  Pode rodar de novo sem medo: usa "if not exists" e "on conflict".
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
--  1. restaurants
-- =====================================================================
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  slug text unique not null,
  public_phone text,
  whatsapp_number text,
  address text,
  google_maps_url text,
  instagram_handle text,
  instagram_url text,
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  2. admin_users  (funções: owner | manager | reception | viewer)
-- =====================================================================
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text,
  role text not null default 'reception' check (role in ('owner','manager','reception','viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (auth_user_id, restaurant_id)
);

-- Função auxiliar: o usuário logado é admin ativo deste restaurante?
create or replace function public.is_admin(p_restaurant_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.auth_user_id = auth.uid()
      and au.restaurant_id = p_restaurant_id
      and au.active = true
  );
$$;

-- Função auxiliar: o usuário tem papel de gestão (owner/manager)?
create or replace function public.is_manager(p_restaurant_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.auth_user_id = auth.uid()
      and au.restaurant_id = p_restaurant_id
      and au.active = true
      and au.role in ('owner','manager')
  );
$$;

-- =====================================================================
--  3. restaurant_settings  (configurações flexíveis chave/valor)
-- =====================================================================
create table if not exists public.restaurant_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, key)
);

-- =====================================================================
--  4. reservation_rules
-- =====================================================================
create table if not exists public.reservation_rules (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  lunch_enabled boolean not null default true,
  dinner_enabled boolean not null default true,
  lunch_days int[] not null default '{0,1,2,3,4,5,6}',
  dinner_days int[] not null default '{0,1,2,3,4,5,6}',
  lunch_times text[] not null default '{}',
  dinner_times text[] not null default '{}',
  lunch_limit_time text,
  dinner_limit_time text,
  min_people int not null default 1,
  max_people int not null default 20,
  tolerance_minutes int not null default 15,
  large_group_threshold int not null default 12,
  large_group_message text,
  awareness_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  5. sectors  (Kids | Churrasqueira | Pizzaria | Palco ...)
-- =====================================================================
create table if not exists public.sectors (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  code text not null,
  public_name text not null,
  internal_name text,
  description text,
  internal_note text,
  active boolean not null default true,
  sort_order int not null default 0,
  capacity int,
  allow_reservation boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, code)
);

-- =====================================================================
--  6. reservation_blocks
-- =====================================================================
create table if not exists public.reservation_blocks (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  block_date date not null,
  period text not null default 'todos' check (period in ('todos','almoco','noite')),
  sector_id uuid references public.sectors(id) on delete set null,
  reason_internal text,
  public_message text,
  block_type text not null default 'manual',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  7. special_events
-- =====================================================================
create table if not exists public.special_events (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  title text not null,
  event_date date,
  period text default 'todos' check (period in ('todos','almoco','noite')),
  rule_type text,
  public_message text,
  assistant_message text,
  banner_asset_id uuid,
  show_public_notice boolean not null default false,
  block_reservations boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  8. reservations
-- =====================================================================
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  customer_name text not null,
  customer_whatsapp text not null,
  customer_email text,
  people_count int not null default 1,
  reservation_date date not null,
  period text not null default 'almoco' check (period in ('almoco','noite')),
  reservation_time text,
  sector_id uuid references public.sectors(id) on delete set null,
  customer_notes text,
  internal_notes text,
  assigned_tables text,
  status text not null default 'pending'
    check (status in ('pending','checking','confirmed','cancelled','no_response','waitlist')),
  cancellation_reason text,
  source text not null default 'site',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  handled_by uuid references auth.users(id)
);
create index if not exists idx_reservations_date on public.reservations (restaurant_id, reservation_date);
create index if not exists idx_reservations_status on public.reservations (restaurant_id, status);

-- =====================================================================
--  9. reservation_history
-- =====================================================================
create table if not exists public.reservation_history (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- =====================================================================
--  10. complaints
-- =====================================================================
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  customer_name text,
  customer_whatsapp text,
  message text not null,
  status text not null default 'nova' check (status in ('nova','em_analise','resolvida')),
  email_status text default 'preparado',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- =====================================================================
--  11. email_settings
-- =====================================================================
create table if not exists public.email_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade unique,
  provider text not null default 'resend',
  from_email text,
  from_name text,
  reservation_recipients text[] not null default '{}',
  complaint_recipients text[] not null default '{}',
  daily_report_recipients text[] not null default '{}',
  reservation_email_enabled boolean not null default true,
  complaint_email_enabled boolean not null default true,
  daily_report_enabled boolean not null default true,
  daily_report_time text not null default '10:00',
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  12. email_logs
-- =====================================================================
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  type text not null,
  recipients text[] not null default '{}',
  subject text,
  status text not null default 'enviado',
  provider_message_id text,
  error_message text,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- =====================================================================
--  13. message_templates
-- =====================================================================
create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  template_key text not null,
  title text,
  body text,
  channel text not null default 'whatsapp',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, template_key)
);

-- =====================================================================
--  14. print_templates
-- =====================================================================
create table if not exists public.print_templates (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  15. assets
-- =====================================================================
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  type text not null,
  name text,
  storage_path text,
  public_url text,
  created_at timestamptz not null default now()
);

-- =====================================================================
--  16. menu_categories
-- =====================================================================
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  17. menu_items
-- =====================================================================
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  variation text,
  description text,
  price numeric(10,2),
  active boolean not null default true,
  available boolean not null default true,
  featured boolean not null default false,
  image_asset_id uuid references public.assets(id) on delete set null,
  tags text[] default '{}',
  allergens text[] default '{}',
  accompaniments text[] default '{}',
  serving_note text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  18. ai_settings
-- =====================================================================
create table if not exists public.ai_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade unique,
  enabled boolean not null default true,
  mode text not null default 'hibrido' check (mode in ('local','hibrido','openrouter')),
  cascade_config jsonb not null default '{}'::jsonb,
  system_prompt text,
  fallback_message text,
  human_transfer_message text,
  max_tokens int not null default 400,
  temperature numeric(3,2) not null default 0.6,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
--  19. ai_logs
-- =====================================================================
create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  session_id text,
  user_message text,
  assistant_message text,
  selected_model text,
  cascade_step text,
  input_tokens int,
  output_tokens int,
  estimated_cost numeric(10,6),
  latency_ms int,
  fallback_used boolean default false,
  created_at timestamptz not null default now()
);

-- =====================================================================
--  20. audit_logs
-- =====================================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  user_id uuid references auth.users(id),
  area text,
  action text,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

-- =====================================================================
--  RLS — Row Level Security
--  Regra geral:
--   * Escrita de reservas/reclamações é feita pelo SERVIDOR (service_role),
--     que ignora o RLS. O navegador do cliente NÃO escreve direto.
--   * O ADMIN logado enxerga/edita apenas o restaurante dele.
--   * O público (anon) só LÊ tabelas de exibição (cardápio, setores...).
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'restaurants','admin_users','restaurant_settings','reservation_rules',
    'sectors','reservation_blocks','special_events','reservations',
    'reservation_history','complaints','email_settings','email_logs',
    'message_templates','print_templates','assets','menu_categories',
    'menu_items','ai_settings','ai_logs','audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Tabelas que o público pode LER (para o site renderizar conteúdo):
do $$
declare t text;
begin
  foreach t in array array[
    'restaurants','sectors','reservation_rules','special_events',
    'menu_categories','menu_items','assets','print_templates'
  ]
  loop
    execute format('drop policy if exists "public_read_%1$s" on public.%1$I;', t);
    execute format('create policy "public_read_%1$s" on public.%1$I for select using (true);', t);
  end loop;
end $$;

-- Admin: acesso total às linhas do próprio restaurante (todas as tabelas
-- que têm restaurant_id).
do $$
declare t text;
begin
  foreach t in array array[
    'restaurants','restaurant_settings','reservation_rules','sectors',
    'reservation_blocks','special_events','reservations','reservation_history',
    'complaints','email_settings','email_logs','message_templates',
    'print_templates','assets','menu_categories','menu_items','ai_settings',
    'ai_logs','audit_logs'
  ]
  loop
    execute format('drop policy if exists "admin_all_%1$s" on public.%1$I;', t);
    if t = 'restaurants' then
      execute 'create policy "admin_all_restaurants" on public.restaurants
        for all using (public.is_admin(id)) with check (public.is_admin(id));';
    else
      execute format(
        'create policy "admin_all_%1$s" on public.%1$I
           for all using (public.is_admin(restaurant_id))
           with check (public.is_admin(restaurant_id));', t);
    end if;
  end loop;
end $$;

-- admin_users: cada admin vê os usuários do seu restaurante;
-- gestores (owner/manager) podem alterar.
drop policy if exists "admin_read_users" on public.admin_users;
create policy "admin_read_users" on public.admin_users
  for select using (public.is_admin(restaurant_id));
drop policy if exists "manager_write_users" on public.admin_users;
create policy "manager_write_users" on public.admin_users
  for all using (public.is_manager(restaurant_id)) with check (public.is_manager(restaurant_id));

-- =====================================================================
--  Gatilho updated_at automático
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array[
    'restaurants','admin_users','restaurant_settings','reservation_rules',
    'sectors','reservation_blocks','special_events','reservations',
    'complaints','email_settings','message_templates','print_templates',
    'menu_categories','menu_items','ai_settings'
  ]
  loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$I;', t);
    execute format('create trigger trg_touch_%1$s before update on public.%1$I
      for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- =====================================================================
--  21. ai_cache  (cache de respostas do Bento — economia de IA)
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

-- =====================================================================
--  22. ai_knowledge  (base de conhecimento treinável do Bento)
-- =====================================================================
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

-- feedback das respostas da IA
alter table public.ai_logs add column if not exists feedback text;

-- Fim do schema.
