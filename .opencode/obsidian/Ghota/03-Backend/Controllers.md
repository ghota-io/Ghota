# Controllers

> Localização: `app/Http/Controllers/`

## Auth

| Controller | Rotas | Função |
|---|---|---|
| `Auth\LoginController` | GET/POST `/login` | Autenticação |
| `Auth\RegisterController` | GET/POST `/register` | Registo |
| `Auth\LogoutController` | POST `/logout` | Terminar sessão |

## Profile
| Controller | Rotas | Função |
|---|---|---|
| `ProfileController` | GET/PATCH `/profile` | Editar perfil |
| | PATCH `/profile/theme` | Actualizar tema |

## Contact
| Controller | Rotas | Função |
|---|---|---|
| `ContactController` | GET/POST `/contacto` | Formulário de contacto |

## Comunidades

### `CommunityController`
| Método | Rota | Função |
|---|---|---|
| `index()` | GET `/comunidades` | Lista de comunidades |
| `show()` | GET `/comunidades/{community}` | Pré-visualização pública |
| `create()` | GET `/comunidades/criar` | Formulário criação |
| `store()` | POST `/comunidades` | Criar comunidade |
| `edit()` | GET `/comunidades/{community}/editar` | Formulário edição |
| `update()` | PUT `/comunidades/{community}` | Actualizar comunidade + sync preços Stripe |
| `destroy()` | DELETE `/comunidades/{community}` | Eliminar comunidade |
| `joinForm()` | GET `/comunidades/{community}/entrar` | Formulário de entrada |
| `app()` | GET `/comunidades/{community}/app/{section?}/{sub?}` | Página interna (Inertia) |
| `paymentSuccess()` | GET `/comunidades/{community}/pagamento-sucesso` | Polling pós-pagamento |
| `manage()` | GET `/comunidades/{community}/gerir` | Página de gestão |
| `channel()` | GET `/comunidades/{community}/c/{canal}` | Vista de canal |
| `removeMember()` | DELETE `/comunidades/{community}/membros/{user}` | Remover membro |
| `changeMemberRole()` | PUT `/comunidades/{community}/membros/{user}/cargo` | Alterar cargo |
| `storeRole()` | POST `/comunidades/{community}/roles` | Criar cargo |
| `updateRole()` | PUT `/comunidades/{community}/roles/{role}` | Editar cargo |
| `destroyRole()` | DELETE `/comunidades/{community}/roles/{role}` | Eliminar cargo |

**Notas `app()`:**
- Carrega `membersList` (todos os membros + roles + planos + subscriptions) para a página
- Injeta `channels`, `roles`, `plans`, `currentPlan`, `memberCount`, `member`
- Usada por `AppLayout.jsx` para montar toda a UI interna

### `JoinCommunityController`
| Método | Rota | Função |
|---|---|---|
| `__invoke()` | POST `/comunidades/{community}/entrar` | Entrar na comunidade |

**Fluxo:**
1. Verifica se o plano é pago e se owner tem `stripe_connect_status=completed`
2. Se gratuito: cria Membership + redirect para `/app/chat`
3. Se pago: cria Stripe Checkout Session → redirect para Stripe

## Stripe

### `StripeWebhookController`
| Método | Rota | Função |
|---|---|---|
| `__invoke()` | POST `/stripe/webhook` | Receber eventos Stripe |

**Eventos tratados:**
- `checkout.session.completed` — cria Subscription + Membership
- `invoice.paid` — define `application_fee_amount` (20%)
- `customer.subscription.updated` — sincroniza estado local
- `customer.subscription.deleted` — marca como cancelada

### `ConnectController`
| Método | Rota | Função |
|---|---|---|
| `onboarding()` | GET `/comunidades/{community}/connect` | Onboarding Stripe Connect |
| `update()` | GET `/comunidades/{community}/connect/atualizar` | Actualizar Connect |

## Canais e Categorias

### `CategoryController`
| Método | Rota | Função |
|---|---|---|
| `store()` | POST `/categorias` | Criar categoria |
| `update()` | PUT `/categorias/{category}` | Editar categoria |
| `destroy()` | DELETE `/categorias/{category}` | Eliminar categoria |

### `ChannelController`
| Método | Rota | Função |
|---|---|---|
| `store()` | POST `/canais` | Criar canal |
| `update()` | PUT `/canais/{channel}` | Editar canal |
| `destroy()` | DELETE `/canais/{channel}` | Eliminar canal |

## Messages

### `MessageController`
| Método | Rota | Função |
|---|---|---|
| `index()` | GET `/canais/{channel}/mensagens` | Listar mensagens (paginação after ID) |
| `store()` | POST `/canais/{channel}/mensagens` | Criar mensagem (rate limit 5/10s) |
| `update()` | PUT `/canais/{channel}/mensagens/{message}` | Editar mensagem (owner only, max 5000) |
| `destroy()` | DELETE `/canais/{channel}/mensagens/{message}` | Eliminar mensagem (owner only) |

**Nota:** Dispara eventos broadcast `MessageSent`, `MessageUpdated`, `MessageDeleted`.

## Eventos

### `EventController` (se existir)
| Método | Rota | Função |
|---|---|---|
| `index()` | GET `/api/events` | Listar eventos |
| `store()` | POST `/api/events` | Criar evento |
