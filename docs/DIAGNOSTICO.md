# Diagnóstico técnico e plano

## O que o site era (antes)

- **Um único arquivo HTML** (`legacy/original-site.html`, ~2,1 MB) com tudo embutido:
  CSS, JavaScript, cardápio em JSON e imagens em base64.
- Não tinha páginas separadas: era uma SPA que trocava de "tela" via `go('reserva')`,
  `go('admin')`, etc.
- **Admin dentro da página pública** (botão "Administrador" na home).
- **Dados só no navegador (localStorage):** reservas, bloqueios, reclamações,
  configurações e a chave de IA.
- **IA chamada direto do navegador**, com a chave colada numa engrenagem (risco).
- **E-mail nunca era enviado** (tentava `POST /api/notificar-reserva`, que não existia).

## O que foi feito nesta entrega

1. **Backup** do site original em `legacy/original-site.html`.
2. **Projeto Next.js** (Vercel) criado preservando o visual.
3. **Site público preservado** em `public/site/index.html` — mesmo HTML/CSS/JS, com:
   - removido o botão "Administrador", a engrenagem da chave de IA e o painel admin;
   - reserva religada ao backend `POST /api/reservations`;
   - chat do Bento religado ao backend `POST /api/ai/chat` (chave só no servidor).
4. **Banco Supabase**: `supabase/schema.sql` (20 tabelas + RLS + políticas) e
   `supabase/seed.sql` (restaurante, regras, setores, templates, IA, impressão).
5. **Admin separado e protegido** (`/admin/login`, `/admin`, middleware de proteção):
   - **Reservas** (`/admin/reservas`): listar, buscar, filtrar, confirmar, cancelar,
     não respondeu, lista de espera, mesas, WhatsApp — lendo/gravando no Supabase.
   - **E-mails e Alertas** (`/admin/emails`): destinatários, ativar/desativar, testes,
     relatório diário e remetente técnico.
   - **IA (Bento)** (`/admin/ia`): liga/desliga, modo, cascata de modelos, parâmetros,
     mensagens e teste.
   - **Reclamações** e **Logs** (e-mail/IA/auditoria) funcionais.
   - Demais telas (bloqueios, eventos, configurações, personalização, impressão,
     cardápio, usuários, backup) criadas como **tela base** no mesmo tema, com a tabela
     do banco já pronta — falta ligar os controles.
6. **Backend (rotas de API)**: reservas, e-mail (teste, relatório), reclamações,
   IA (cascata OpenRouter) e cron do relatório diário.
7. **E-mails automáticos** (Resend): nova reserva e reclamação disparam aviso; relatório
   diário às 10h via Vercel Cron (`vercel.json`).
8. **Documentação** simples em `README.md`.

## Mudanças visuais (transparência)

Apenas **remoções intencionais** que você pediu, todas no site público:
- botão "Administrador" na home;
- engrenagem que pedia a chave de IA;
- o painel admin (movido para `/admin`).

Nenhuma cor, fonte, espaçamento ou animação foi alterada.

## Próximos passos (a completar)

- Ligar os controles das telas base: **configurações** (dados da unidade, regras,
  setores), **bloqueios**, **eventos**, **cardápio**, **impressão** (modelo 80mm
  configurável), **usuários**, **personalização** (upload de imagens) e **backup**.
- Migrar o cardápio fixo do HTML para as tabelas `menu_categories`/`menu_items`.
- Tela de impressão de comanda 80mm configurável (hoje a impressão existia só no admin
  antigo em localStorage).
- Histórico de alterações de reserva no admin (tabela `reservation_history` já existe).
- Refinar o visual do admin para casar 100% com o painel antigo, se desejar.
