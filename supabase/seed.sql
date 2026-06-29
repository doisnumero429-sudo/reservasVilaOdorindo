-- =====================================================================
--  VILLA GRILL — DADOS INICIAIS (seed)
--  Rode DEPOIS do schema.sql, no SQL Editor do Supabase.
--  Pode rodar de novo: usa "on conflict" para não duplicar.
-- =====================================================================

-- ---- 1. Restaurante --------------------------------------------------
insert into public.restaurants
  (slug, name, short_name, public_phone, whatsapp_number, address,
   instagram_handle, instagram_url, timezone)
values
  ('villa-grill',
   'Villa Grill — Unidade Odorindo Perenha',
   'Villa Grill',
   '(18) 99652-4860',
   '5518996524860',
   'Av. Odorindo Perenha, 728 — Umuarama, Araçatuba/SP',
   '@novovillagrill',
   'https://www.instagram.com/novovillagrill/',
   'America/Sao_Paulo')
on conflict (slug) do update
  set name = excluded.name,
      whatsapp_number = excluded.whatsapp_number,
      address = excluded.address,
      instagram_handle = excluded.instagram_handle,
      instagram_url = excluded.instagram_url;

-- A partir daqui usamos o id do restaurante recém-criado.
do $$
declare rid uuid;
begin
  select id into rid from public.restaurants where slug = 'villa-grill';

  -- ---- 2. Regras de reserva -----------------------------------------
  insert into public.reservation_rules
    (restaurant_id, lunch_enabled, dinner_enabled,
     lunch_times, dinner_times, min_people, max_people,
     tolerance_minutes, large_group_threshold, large_group_message, awareness_text)
  select rid, true, true,
     array['11:00','11:30','12:00','12:30','13:00','13:30','14:00'],
     array['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'],
     1, 20, 15, 12,
     'Para grupos grandes, fale direto com a nossa equipe pelo WhatsApp para organizarmos tudo com carinho.',
     'A escolha do setor é uma preferência e depende de confirmação da equipe.'
  where not exists (select 1 from public.reservation_rules where restaurant_id = rid);

  -- ---- 3. Setores ----------------------------------------------------
  insert into public.sectors (restaurant_id, code, public_name, internal_name, sort_order, allow_reservation)
  values
    (rid, 'kids',          'Próximo ao Espaço Kids', 'Setor Espaço Kids',   1, true),
    (rid, 'churrasqueira', 'Próximo à Churrasqueira','Setor Churrasqueira', 2, true),
    (rid, 'pizzaria',      'Próximo à Pizzaria',     'Setor Pizzaria',      3, true),
    (rid, 'palco',         'Setor do Palco',         'Setor Palco',         4, true)
  on conflict (restaurant_id, code) do nothing;

  -- ---- 4. Configurações de e-mail (destinatários começam vazios) -----
  insert into public.email_settings (restaurant_id, from_name)
  select rid, 'Villa Grill'
  where not exists (select 1 from public.email_settings where restaurant_id = rid);

  -- ---- 5. Configurações da IA (Lorena) + cascata OpenRouter ----------
  -- Por padrão a Lorena começa no modo GRÁTIS (regras locais, sem custo de IA).
  -- Troque para 'hibrido' ou 'openrouter' na tela /admin/ia quando quiser ativar a IA paga.
  insert into public.ai_settings
    (restaurant_id, enabled, mode, cascade_config, fallback_message, human_transfer_message)
  select rid, true, 'local',
    jsonb_build_object(
      'cheap_model',  'openai/gpt-4o-mini',
      'mid_model',    'openai/gpt-4o-mini',
      'strong_model', 'openai/gpt-4o',
      'timeout_ms',   12000,
      'cost_limit_usd', 5
    ),
    'Vou confirmar essa informação com a nossa equipe e já te retorno, tá? 🙏',
    'Posso te encaminhar para um atendente humano agora pelo WhatsApp.'
  where not exists (select 1 from public.ai_settings where restaurant_id = rid);

  -- ---- 6. Template de impressão padrão (80mm) ------------------------
  insert into public.print_templates (restaurant_id, name, active, config)
  select rid, 'Padrão 80mm', true,
    jsonb_build_object(
      'show_logo', true, 'logo_solid_black', false, 'logo_original', true,
      'logo_size', 120, 'show_qr', true, 'qr_own', true,
      'welcome_text', 'Seja bem-vindo ao Villa Grill!',
      'qr_caption', 'Siga @novovillagrill',
      'footer', 'Obrigado pela preferência.',
      'show_sector', true, 'show_notes', true, 'show_employee', true,
      'show_phone', true, 'show_address', true, 'show_tables', true,
      'name_size', 22, 'tables_size', 18, 'model', '80mm'
    )
  where not exists (select 1 from public.print_templates where restaurant_id = rid);

  -- ---- 7. Templates de mensagem (WhatsApp / e-mail) ------------------
  insert into public.message_templates (restaurant_id, template_key, title, channel, body)
  values
    (rid,'verificar_reserva','Verificar reserva','whatsapp',
     'Oi {nome}! Aqui é do {unidade}. Recebemos sua pré-reserva para {data} às {horario} ({pessoas} pessoas). Estamos verificando a disponibilidade e já te confirmamos. 🙏'),
    (rid,'confirmar_reserva','Confirmar reserva','whatsapp',
     'Oi {nome}! Sua reserva no {unidade} está CONFIRMADA para {data} às {horario}, {pessoas} pessoas, {setor}. Te esperamos! 🔥'),
    (rid,'cancelar_reserva','Cancelar reserva','whatsapp',
     'Oi {nome}, infelizmente não conseguimos confirmar sua reserva para {data} às {horario}. Sentimos muito! Qualquer coisa, fale com a gente: {whatsapp}'),
    (rid,'nao_respondeu','Não respondeu','whatsapp',
     'Oi {nome}! Tentamos contato sobre sua reserva para {data} às {horario}, mas não tivemos retorno. Se ainda quiser vir, é só responder por aqui. 😊'),
    (rid,'lista_espera','Lista de espera','whatsapp',
     'Oi {nome}! No momento estamos lotados para {data} às {horario}, mas te colocamos na lista de espera e avisamos assim que abrir uma vaga.'),
    (rid,'evento_especial','Evento especial','whatsapp',
     'Oi {nome}! No dia {data} teremos um evento especial no {unidade}. As reservas seguem regras diferentes — fale com a gente pelo WhatsApp {whatsapp}.'),
    (rid,'data_bloqueada','Data bloqueada','whatsapp',
     'Oi {nome}! No dia {data} não estamos recebendo reservas. Podemos te ajudar com outra data?'),
    (rid,'grupo_grande','Grupo grande','whatsapp',
     'Oi {nome}! Para {pessoas} pessoas, vamos organizar com carinho. Me chama no WhatsApp {whatsapp} para acertarmos os detalhes.'),
    (rid,'aniversario','Aniversário','whatsapp',
     'Oi {nome}! Que alegria receber sua comemoração no {unidade} no dia {data}! 🎉 Já anotamos a observação sobre o aniversário.'),
    (rid,'reclamacao_recebida','Reclamação recebida','whatsapp',
     'Oi {nome}, sentimos muito pelo ocorrido. Seu relato foi registrado e encaminhado à equipe responsável. Obrigado por nos contar. 🙏'),
    (rid,'email_nova_reserva','E-mail: nova reserva','email',
     'Nova pré-reserva: {nome} — {data} às {horario} — {pessoas} pessoas — {setor}. Observação: {observacao}. Contato: {whatsapp}.'),
    (rid,'email_reclamacao','E-mail: reclamação','email',
     'Reclamação recebida de {nome} ({whatsapp}): {observacao}'),
    (rid,'email_relatorio_diario','E-mail: relatório diário','email',
     'Relatório de reservas de {data} — {unidade}.')
  on conflict (restaurant_id, template_key) do nothing;

  -- ---- 8. Configurações flexíveis (textos da casa) ------------------
  insert into public.restaurant_settings (restaurant_id, key, value)
  values
    (rid, 'atendimento_humano', '"11h às 14h e 17h às 23h59"'::jsonb),
    (rid, 'prazo_retorno', '"até 60 minutos"'::jsonb),
    (rid, 'reclamacao_prazo', '"até 24 horas"'::jsonb)
  on conflict (restaurant_id, key) do nothing;

end $$;

-- Fim do seed.
