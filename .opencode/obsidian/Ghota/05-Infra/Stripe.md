# Stripe

## Arquitectura

```
User ──▶ JoinCommunityController
              │
              ├── Plano gratuito ──▶ criar Membership → redirect app
              │
              └── Plano pago ──▶ Stripe Checkout Session
                                      │
                                      ├── line_items: plano
                                      ├── subscription_data.transfer_data.destination
                                      │   = owner's stripe_connect_id
                                      │
                                      └── success_url → /pagamento-sucesso

Stripe ──▶ Webhook POST /stripe/webhook
                │
                ├── checkout.session.completed → Subscription + Membership
                ├── invoice.paid → application_fee_amount = 20%
                ├── customer.subscription.updated → sync status
                └── customer.subscription.deleted → mark canceled
```

## Stripe Connect

- **Tipo:** Express (onboarding hosted Stripe)
- **Destino:** Destination Charges com `transfer_data.destination`
- **Fee:** 20% (aplicado no webhook `invoice.paid`)
- **Fluxo:**
  1. Owner acede "Ligar conta Stripe" em Gerir > Planos
  2. `ConnectController@onboarding` cria Account Express + Account Link
  3. Redireciona para Stripe (onboarding)
  4. Após conclusão, redirect para planos com status `completed`
  5. Se owner não tem Connect configurado e há planos pagos, membros não podem subscrever (banner amarelo)

## Webhook Stripe (Dev)

```bash
stripe listen --forward-to http://localhost:8080/stripe/webhook
```

Stripe CLI (v1.43.2) localizado em `~/.local/bin/stripe`.

## Endpoints

| Método | Rota | Controller |
|---|---|---|
| POST | `/stripe/webhook` | `StripeWebhookController` (sem CSRF) |
| GET | `/comunidades/{community}/connect` | `ConnectController@onboarding` |
| GET | `/comunidades/{community}/billing` | `BillingController@portal` |
| GET | `/comunidades/{community}/pagamento-sucesso` | `CommunityController@paymentSuccess` |

## Cartão de Teste

`4242 4242 4242 4242` — qualquer data futura, qualquer CVC.

## Sincronização de Preços

Quando o owner altera o preço de um plano em `CommunityController@update`:
1. Cria novo `stripe_price_id` no Stripe
2. Associa a subscrições activas com `proration_behavior: 'none'`
3. A actualização só afecta o próximo ciclo de facturação

## Prevenção

- Planos com `subscriptions` activas não podem ser eliminados (validação no controller)
- Owner precisa de `stripe_connect_status=completed` para aceitar pagamentos
