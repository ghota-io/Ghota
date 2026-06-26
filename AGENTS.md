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

Stripe integrado com pagamentos via Checkout Sessions (modo subscription).

### Setup

```bash
# 1. Adicionar ao .env
STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 2. Forward webhooks em dev (Stripe CLI)
stripe listen --forward-to http://localhost:8080/stripe/webhook
```

### Fluxo de pagamento

1. User seleciona plano pago → POST `/comunidades/{community}/entrar`
2. `JoinCommunityController` cria Checkout Session, redireciona para Stripe via `Inertia::location()`
3. Stripe trata pagamento, envia webhook `checkout.session.completed` para `/stripe/webhook`
4. `StripeWebhookController` verifica assinatura, cria `Subscription` (status `active`) e `Membership`
5. User é redirecionado para `/comunidades/{community}/pagamento-sucesso` que faz polling até membership existir

### Endpoints

| Método | Rota | Controller |
|---|---|---|
| POST | `/stripe/webhook` | `StripeWebhookController` (sem CSRF) |
| GET | `/comunidades/{community}/pagamento-sucesso` | `CommunityController@paymentSuccess` |

## Links

- App: http://localhost:8080
- Preview Comunidade: http://localhost:8080/preview/comunidade.html
- Preview Entrar: http://localhost:8080/preview/entrar-comunidade.html
- Descrição completa: `.opencode/context/aplicacao.md`
- Plano da página interna: `.opencode/plans/communities/context.md`
