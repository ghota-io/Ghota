# Base de Dados

> PostgreSQL 17. Migrations em `database/migrations/`.

## Diagrama Relacional

```
users ──1:N── memberships ──N:1── communities
  │                │
  │                └──N:1── community_roles
  │
  ├──1:N── subscriptions ──N:1── plans ──N:1── communities
  │                │
  │                └── community_id (via plans)
  │
  └──1:N── messages ──N:1── channels ──N:1── categories ──N:1── communities

message_archives ──N:1── channels (same schema as messages)

community_invitations ── community_id + invited_email

events ──N:1── communities
```

## Tabelas Principais

### `users`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| name | string | |
| email | string | unique |
| password | string | hashed |
| theme | string | 'dark' \| 'light', nullable |
| stripe_connect_id | string | nullable, para Connect |
| stripe_connect_status | string | 'pending' \| 'completed', nullable |

### `communities`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| name | string | |
| slug | string | unique |
| description | text | |
| owner_id | bigint FK→users | |
| is_public | boolean | se aparece em listagens |
| icon | string | nullable, emoji |
| is_visible | boolean | controla visibilidade |

### `memberships`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| user_id | bigint FK→users | |
| community_id | bigint FK→communities | |
| is_owner | boolean | se é owner (único) |
| community_role_id | bigint FK→community_roles | nullable, sem cargo obrigatório |
| joined_at | timestamp | |
| *unique(user_id, community_id)* | | |

### `community_roles`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| community_id | bigint FK→communities | |
| name | string | ex: "Moderador", "Mentor" |
| color | string | hex, ex: "#ff0000" |
| permissions | jsonb | array de permissões |
| created_at | timestamp | |

### `categories`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| community_id | bigint FK→communities | |
| name | string | ex: "Canais de texto" |
| order | integer | ordenação |
| created_at | timestamp | |

### `channels`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| community_id | bigint FK→communities | |
| category_id | bigint FK→categories | nullable |
| name | string | |
| type | string | default 'text' |
| order | integer | ordenação |
| created_at | timestamp | |
| *index(community_id, order)* | | para ordenação |

### `messages`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| channel_id | bigint FK→channels | indexed |
| user_id | bigint FK→users | |
| content | text | markdown |
| edited_at | timestamp | nullable |
| deleted_at | timestamp | nullable (soft delete) |
| created_at | timestamp | |
| *index(channel_id, id)* | | para scroll eficiente |

### `plans`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| community_id | bigint FK→communities | |
| name | string | |
| description | text | nullable |
| price | integer | cents |
| is_free | boolean | se é grátis |
| stripe_price_id | string | ID do preço no Stripe |
| interval | string | 'month' \| 'year' |
| features | jsonb | array de strings |
| is_active | boolean | |
| sort_order | integer | ordenação |
| created_at | timestamp | |

### `subscriptions`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| user_id | bigint FK→users | |
| plan_id | bigint FK→plans | |
| community_id | bigint FK→communities | |
| stripe_subscription_id | string | unique |
| plan_type | string | 'free' \| 'paid' |
| status | string | 'active' \| 'canceled' \| etc |
| current_period_start | timestamp | |
| current_period_end | timestamp | |
| canceled_at | timestamp | nullable |
| created_at | timestamp | |

### `message_archives`
> Mesma estrutura que `messages`. Mensagens >30 dias movidas para aqui pelo comando `messages:archive`.

### `community_invitations`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| community_id | bigint FK→communities | |
| invited_email | string | |
| token | string | unique, para aceitar convite |
| accepted_at | timestamp | nullable |
| created_at | timestamp | |
| *unique(community_id, invited_email)* | | |

### `events`
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint AI | PK |
| community_id | bigint FK→communities | |
| name | string | |
| starts_at | timestamp | |

## Índices Relevantes

- `messages(channel_id, id)` — otimizado para scroll de chat com `orderBy('id', 'desc')`
- `subscriptions(stripe_subscription_id)` — lookup rápido em webhooks
- `memberships(user_id, community_id)` — unique composta
- `channels(community_id, order)` — ordenação de canais
