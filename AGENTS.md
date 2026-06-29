# Project: Ghota

Instruções para agentes. Lê `.opencode/context/aplicacao.md` antes de qualquer tarefa.

## Stack

- Backend: Laravel (PHP 8.5)
- Frontend: React (Inertia.js + Vite)
- Database: PostgreSQL 17
- Containers: Docker (docker-compose)

## Commands

| Comando | Descrição |
|---|---|
| `docker compose up -d` | Iniciar containers |
| `docker compose exec app npm run dev` | Dev server Vite (hot-reload) |
| `docker compose exec app npm run build` | Build production assets |
| `docker compose exec app php artisan migrate` | Correr migrations |
| `docker compose exec app php artisan make: migration ...` | Criar migration |
| `docker compose exec app composer require ...` | Instalar pacote PHP |
| `docker compose exec app php artisan test` | Correr testes |

## Stripe

Stripe integrado com pagamentos via Checkout Sessions (modo subscription) + Stripe Connect (80% owner / 20% plataforma).

### Setup

```bash
# 1. Adicionar ao .env
STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_CONNECT_CLIENT_ID=ca_xxx

# 2. Forward webhooks em dev (Stripe CLI)
stripe listen --forward-to http://localhost:8080/stripe/webhook
```

### Fluxo de pagamento

1. User seleciona plano pago → POST `/comunidades/{community}/entrar`
2. `JoinCommunityController` verifica se owner tem `stripe_connect_status=completed` (senão, redirect com erro)
3. Cria Checkout Session com `subscription_data.transfer_data.destination` = owner's `stripe_connect_id`
4. Stripe trata pagamento, envia webhook `checkout.session.completed` para `/stripe/webhook`
5. `StripeWebhookController` verifica assinatura, guarda `stripe_subscription_id`, cria `Subscription` (status `active`) e `Membership`
6. Webhook `invoice.paid` define `application_fee_amount` = 20% do `amount_paid` na invoice
7. Webhooks `customer.subscription.updated`/`.deleted` sincronizam estado local
8. User é redirecionado para `/comunidades/{community}/pagamento-sucesso` que faz polling até membership existir

### Connect onboarding

- Owner liga conta Stripe Express via Gerir > Planos > "Ligar conta Stripe"
- `ConnectController@onboarding` cria Account Express + Account Link, redireciona para Stripe
- Após onboarding, owner volta para Planos > Gerir com status `completed`
- Se owner não tem Connect configurado e há planos pagos, membros não podem subscrever (banner amarelo + erro no join)

### Endpoints

| Método | Rota | Controller |
|---|---|---|
| POST | `/stripe/webhook` | `StripeWebhookController` (sem CSRF) |
| GET | `/comunidades/{community}/pagamento-sucesso` | `CommunityController@paymentSuccess` |
| GET | `/comunidades/{community}/connect` | `ConnectController@onboarding` |

### Cartão de teste

`4242 4242 4242 4242` — qualquer data futura, qualquer CVC.

## Links

- App: http://localhost:8080
- Preview Comunidade: http://localhost:8080/preview/comunidade.html
- Preview Entrar: http://localhost:8080/preview/entrar-comunidade.html
- Descrição completa: `.opencode/context/aplicacao.md`
- Plano da página interna: `.opencode/plans/communities/context.md`
