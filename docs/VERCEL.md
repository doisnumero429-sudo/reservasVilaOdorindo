# Guia: variáveis de ambiente na Vercel (passo a passo)

Guia simples de **onde clicar** e **de onde sai cada valor**. Você não precisa entender
de programação — é só copiar e colar.

## Onde colocar as variáveis

1. Entre em **vercel.com** e abra o seu projeto.
2. Clique em **Settings** (topo) → **Environment Variables** (menu da esquerda).
3. Para cada item da tabela: digite o **Name (Key)**, cole o **Value**, deixe marcado
   **Production, Preview e Development**, e clique **Save**.
4. Depois de salvar tudo, faça **Deployments → ••• → Redeploy** para valer.

> O nome (Key) precisa ser **idêntico** ao da tabela (maiúsculas e tudo).

## A tabela

| Name (Key) | Para que serve | De onde vem |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Endereço do banco | Supabase → ⚙️ Project Settings → API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (segura) do banco | Mesma página → chave **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave mestra secreta (só servidor) | Mesma página → chave **service_role** |
| `OPENROUTER_API_KEY` | Inteligência da Lorena (IA) | openrouter.ai → **Keys** → Create Key |
| `OPENROUTER_SITE_URL` | Identifica seu site na OpenRouter | É o seu `APP_URL` |
| `OPENROUTER_APP_NAME` | Nome do app na OpenRouter | Você inventa: `Villa Grill - Lorena` |
| `RESEND_API_KEY` | Autoriza o envio de e-mails | resend.com → **API Keys** → Create |
| `EMAIL_FROM` | Endereço que aparece no "De:" | Teste: `onboarding@resend.dev` / Produção: e-mail de domínio verificado |
| `EMAIL_FROM_NAME` | Nome no remetente | Você inventa: `Villa Grill` |
| `APP_URL` | Endereço público do site | A Vercel te dá após o deploy |
| `ADMIN_URL` | Endereço do painel | `APP_URL` + `/admin` |
| `CRON_SECRET` | Protege o relatório automático das 10h | Você inventa uma senha longa |
| `DEFAULT_RESTAURANT_SLUG` | Restaurante principal | `villa-grill` |
| `DEFAULT_TIMEZONE` | Fuso dos horários | `America/Sao_Paulo` |

## Resumo de onde sai cada uma

- **Copia do Supabase (página API):** as 3 do Supabase.
- **Cria no provedor:** `OPENROUTER_API_KEY`, `RESEND_API_KEY`.
- **Você inventa:** `CRON_SECRET`, `EMAIL_FROM_NAME`, `OPENROUTER_APP_NAME`.
- **É o seu endereço:** `APP_URL`, `ADMIN_URL`, `OPENROUTER_SITE_URL`.
- **Já vem pronto, só copiar:** `EMAIL_FROM` (de teste), `DEFAULT_RESTAURANT_SLUG`, `DEFAULT_TIMEZONE`.

---

## E o custo? (resumo honesto)

| Serviço | No seu caso |
|---|---|
| **Supabase** (banco) | **Grátis** no plano gratuito (Pro US$ 25/mês só se crescer muito) |
| **Resend** (e-mail) | **Grátis** (até ~3.000 e-mails/mês, 100/dia) |
| **Vercel** (site) | **Grátis** no Hobby; Pro (~US$ 20/mês) pode ser exigido por ser uso comercial |
| **OpenRouter** (IA) | **Pago por uso** — recarregue ~US$ 5–10 e dura bastante. Modelos baratos custam centavos por milhares de conversas. |

**Dica para gastar zero com IA no começo:** a Lorena já vem configurada no **modo grátis
(regras locais)**. Ela responde com o cardápio e as regras cadastradas, sem custo. Quando
quiser deixá-la mais "conversadora", entre em `/admin/ia`, troque o modo para **híbrido**
ou **OpenRouter** e informe os modelos da cascata.

## Sobre o "De:" dos e-mails

- Os avisos **chegam** nos e-mails que você cadastra no painel (seu Gmail, do gerente…).
- O **`EMAIL_FROM`** é só quem **despacha** (aparece no campo "De:"). Não é uma caixa de
  e-mail nova que você precise abrir e ler.
- Exemplo de como chega na caixa do gerente:
  - **De:** Villa Grill &lt;onboarding@resend.dev&gt;
  - **Para:** gerente@gmail.com
  - **Assunto:** Nova pré-reserva recebida — Maria Fernanda
