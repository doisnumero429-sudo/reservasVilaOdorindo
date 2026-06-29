# Villa Grill — Site + Administrador

Site público do Villa Grill (visual preservado) **+** um administrador separado e
protegido, com banco de dados (Supabase), e-mails automáticos, relatório diário e a
assistente **Lorena** rodando com segurança no servidor (IA via OpenRouter).

> Este guia é escrito para **quem não é programador**. Siga na ordem.

---

## 0. Como o projeto está organizado

| Pasta | O que é |
|---|---|
| `public/site/` | O **site público** (o mesmo HTML/CSS/JS de antes, com o admin removido). |
| `app/admin/` | O **painel administrador** (login + telas). Endereço: `/admin`. |
| `app/api/` | O **backend** (reservas, e-mails, IA, relatório). |
| `lib/` | Código compartilhado (Supabase, e-mail, OpenRouter). |
| `supabase/` | `schema.sql` (cria as tabelas) e `seed.sql` (dados iniciais). |
| `legacy/` | **Backup** do site original, intacto. |
| `docs/` | Diagnóstico técnico. |

**Endereços (rotas):**
- Público: `/` (o site), e `/cardapio`, `/reservar`, `/atendimento` levam ao mesmo site.
- Privado: `/admin/login` (entrar) e `/admin` (painel). O cliente comum **não vê** o admin.

---

## 1. Rodar no seu computador (opcional)

Precisa do **Node.js 18+** instalado.

```bash
npm install
cp .env.example .env.local   # depois preencha o .env.local (passo 5)
npm run dev
```

Abra `http://localhost:3000` (site) e `http://localhost:3000/admin/login` (admin).

---

## 2. Criar o Supabase (banco de dados)

1. Acesse <https://supabase.com> e crie uma conta (gratuita).
2. Clique em **New project**. Dê um nome (ex.: `villa-grill`) e uma senha de banco.
3. Espere alguns minutos até o projeto ficar pronto.

## 3. Colar o SQL (criar as tabelas)

1. No Supabase, menu lateral: **SQL Editor** → **New query**.
2. Abra o arquivo `supabase/schema.sql` deste projeto, **copie tudo** e cole. Clique **Run**.
3. Faça o mesmo com `supabase/seed.sql` (dados iniciais do Villa Grill). Clique **Run**.
4. (Opcional, recomendado) Faça o mesmo com `supabase/seed_menu.sql` para já trazer
   **todo o cardápio** (383 itens) para o banco. Clique **Run**.
5. Rode `supabase/migration_nivel1.sql` (cria o cache da Lorena — economia de IA). **Run**.
   Em seguida rode `supabase/migration_nivel3.sql` (base de conhecimento + feedback). **Run**.
6. (Opcional) Para usar o **upload de imagens** (tela Personalização), rode também
   `supabase/storage.sql`. Clique **Run**.

Pronto: as 20 tabelas, as regras de segurança e os dados iniciais foram criados.

## 4. Pegar a URL e as chaves do Supabase

No Supabase: **Project Settings** (engrenagem) → **API**. Você vai usar:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** (secreta!) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ A **service_role** é secreta. Nunca compartilhe nem coloque em lugar público.

## 5. Preencher as variáveis

Abra `.env.local` e preencha (veja `.env.example` com os comentários):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENROUTER_API_KEY=...
RESEND_API_KEY=...
EMAIL_FROM=onboarding@resend.dev
CRON_SECRET=invente-uma-senha-longa-aqui
```

---

## 6. Criar o primeiro administrador

1. No Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
   Coloque o **e-mail** e a **senha** que você vai usar para entrar no painel.
   Copie o **User UID** que aparece.
2. Volte ao **SQL Editor** e rode (troque o UID e o nome):

```sql
insert into public.admin_users (auth_user_id, restaurant_id, name, role, active)
select
  'COLE-AQUI-O-USER-UID',
  (select id from public.restaurants where slug = 'villa-grill'),
  'Seu Nome', 'owner', true;
```

3. Agora você consegue entrar em `/admin/login` com esse e-mail e senha.

---

## 7. Configurar os e-mails (avisos)

Entre no painel → **E-mails e Alertas** (`/admin/emails`).

- **Não é preciso criar um e-mail novo do Villa Grill.** Você cadastra **e-mails que já
  existem** (seu Gmail, o do gerente, o da recepção...). Eles são os **destinatários**.
- Seções: **Novas reservas**, **Reclamações**, **Relatório diário**. Em cada uma,
  adicione os e-mails, ligue/desligue o aviso e use **Enviar teste**.

### Remetente técnico
O sistema precisa de um "carteiro" para enviar (o **Resend**). Isso **não é uma caixa
de e-mail nova** — é só quem despacha os avisos.

1. Crie conta em <https://resend.com> → **API Keys** → crie uma chave → coloque em
   `RESEND_API_KEY`.
2. Para testes, pode usar `EMAIL_FROM=onboarding@resend.dev`. Para produção, verifique
   o seu domínio no Resend e use um e-mail desse domínio.

### Testar
Em **E-mails e Alertas**, clique **Enviar teste**. Se chegar na caixa, está funcionando.

---

## 8. Relatório diário às 10h

- Já cadastre os e-mails na seção **Relatório diário**.
- O envio automático roda **todo dia às 10:00 (horário de Brasília)** pelo **Vercel Cron**
  (arquivo `vercel.json`, agendado em `0 13 * * *` = 13:00 UTC = 10:00 de Brasília).
- A senha `CRON_SECRET` protege esse disparo (o Vercel a envia automaticamente).
- Para testar agora: botão **Enviar relatório de teste** na tela de e-mails.

---

## 9. Configurar a IA (Lorena) com OpenRouter

1. Crie conta em <https://openrouter.ai> → **Keys** → crie uma chave → coloque em
   `OPENROUTER_API_KEY`. **A chave fica só no servidor** — o cliente nunca a vê.
2. No painel → **IA (Lorena)** (`/admin/ia`):
   - Ligue/desligue a IA e escolha o **modo** (regras locais / híbrido / OpenRouter).
   - **Cascata de modelos**: do mais barato ao mais forte. Use nomes da OpenRouter, ex.:
     - Barato: `openai/gpt-4o-mini`
     - Intermediário: `openai/gpt-4o-mini` (ou outro)
     - Forte: `openai/gpt-4o`
   - A lógica tenta **primeiro o mais barato**; só sobe se precisar. Se tudo falhar,
     responde a mensagem de **fallback** (encaminhar para humano).
3. **Testar Lorena**: na mesma tela há um campo para você digitar uma pergunta e ver a
   resposta (e qual etapa/modelo respondeu).

---

## 10. Publicar na Vercel

1. Suba este projeto para um repositório no **GitHub**.
2. Em <https://vercel.com>, **Add New → Project**, conecte o GitHub e escolha o repositório.
3. Em **Environment Variables**, cole **todas** as variáveis do seu `.env.local`
   (Supabase, OpenRouter, Resend, CRON_SECRET, etc.). Ajuste `APP_URL` para o domínio final.
4. Clique **Deploy**. O **Vercel Cron** (relatório das 10h) é ativado automaticamente
   pelo arquivo `vercel.json`.

---

## 11. Testes rápidos (checklist)

- [ ] Abrir o site público — **não aparece** nada de admin.
- [ ] Entrar em `/admin/login` com o usuário criado.
- [ ] Fazer uma reserva no site → ela aparece em **/admin/reservas**.
- [ ] Confirmar/cancelar a reserva no admin.
- [ ] Receber o e-mail de nova reserva (se cadastrou destinatário).
- [ ] **Enviar teste** de e-mail funciona.
- [ ] **Testar Lorena** responde (e a chave não aparece no navegador).
- [ ] **Enviar relatório de teste** funciona.

---

## Perguntas comuns

**O visual mudou?** Não. O site é o mesmo arquivo de antes. As únicas remoções
**intencionais** no público foram: o botão "Administrador", a engrenagem que pedia a
chave de IA, e o painel admin — tudo isso foi **movido** para a área protegida `/admin`.

**Onde está o site antigo?** Em `legacy/original-site.html`, intacto, como backup.

**O que ainda falta?** Veja `docs/DIAGNOSTICO.md` (seção "Próximos passos").
