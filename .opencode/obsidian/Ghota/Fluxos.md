# Fluxos

## 1. Junção a Comunidade (Plano Pago)

```
User clica "Entrar" → POST /comunidades/{community}/entrar
                        │
                        ├── Owner tem stripe_connect_status=completed?
                        │     ├── Não → redirect com erro "Owner não configurou pagamentos"
                        │     └── Sim → continua
                        │
                        ├── Plano gratuito?
                        │     ├── Sim → cria Membership, redirect /app/chat
                        │     └── Não → continua
                        │
                        └── Cria Stripe Checkout Session:
                            - price: stripe_price_id do plano
                            - subscription_data.transfer_data.destination
                                = community.owner.stripe_connect_id
                            - success_url: /pagamento-sucesso
                            │
                            Redirect → Stripe Checkout

User paga no Stripe → Webhook checkout.session.completed
                        │
                        ├── StripeWebhookController verifica assinatura
                        ├── Cria Subscription (status: active)
                        ├── Cria Membership
                        └── 200 OK

User redirect para /pagamento-sucesso
  → Polling até membership existir (setInterval por 5s, timeout 30s)
  → Redirect /app/chat
```

## 2. Onboarding Stripe Connect (Owner)

```
Owner em Gerir > Planos > "Ligar conta Stripe"
  → GET /comunidades/{community}/connect
  │
  ├── Já tem stripe_connect_id?
  │     ├── Sim → verificar status
  │     └── Não → criar Account Express via Stripe API
  │
  ├── Criar Account Link (type: account_onboarding)
  ├── Redirect → Stripe Express onboarding
  │
  Owner completa onboarding na Stripe
  → Stripe redirect para /comunidades/{community}/planos
  → stripe_connect_status actualizado para 'completed'
```

## 3. Alteração de Preço de Plano

```
Owner edita preço do plano → PUT /comunidades/{community}
  │
  ├── Cria novo Price no Stripe (product existente)
  ├── Actualiza plan.stripe_price_id
  ├── Para cada subscription activa:
  │     ├── stripe.subscriptionItem.update(
  │     │     price: novo_stripe_price_id,
  │     │     proration_behavior: 'none'
  │     │   )
  │     └── Preço só muda no próximo ciclo
  └── Flash success
```

## 4. Chat em Tempo Real

```
User envia mensagem → POST /api/channels/{channel}/messages
  │
  ├── MessageController@store:
  │     ├── Cria Message na BD
  │     └── Broadcast MessageSent(event)
  │
  Outros users no canal:
  └── Echo recebe MessageSent
        ├── Se estamos na página desse canal:
        │     ├── Append message ao state
        │     └── Scroll to bottom
        └── Se não estamos:
              └── Mostrar notificação / badge
```

## 5. Arquivo de Mensagens

```
Diariamente (00:00):
  php artisan messages:archive
  │
  ├── SELECT messages WHERE created_at < now() - 30 days
  ├── INSERT INTO message_archives (mesmos dados)
  ├── DELETE FROM messages WHERE id IN (os selecionados)
  └── Log: "Archived {count} messages"
```

## 6. Toggle Tema

```
User clica toggle tema
  │
  ├── localStorage.setItem('theme', novoValor)
  ├── document.documentElement.classList.toggle('dark')
  └── fetch POST /api/theme (fire-and-forget)
        └── ThemeController@update guarda na BD
```

## 7. Multi-Selecção de Membros

```
User faz check num membro (ou "Select All")
  │
  ├── selectedMembers actualizado (useState)
  │
  ├── Se ≥1 selecionado:
  │     └── Mostrar barra de acções: "X selecionados" + "Remover" + "Limpar"
  │
  ├── Remover:
  │     ├── Confirmação para cada (ou todos)
  │     └── DELETE /api/members/{membership}
  │
  └── Limpar:
        └── setSelectedMembers([])
```

## 8. Criação de Canal / Categoria

```
Owner clica "+" na ChannelSidebar
  ├── Dropdown: "Novo Canal" | "Nova Categoria"
  │
  ├── Canal:
  │     ├── Modal com input name + select parent category
  │     └── POST /api/communities/{community}/channels (type: 'text')
  │
  └── Categoria:
        ├── Modal com input name
        └── POST /api/communities/{community}/channels (type: 'category')
```
