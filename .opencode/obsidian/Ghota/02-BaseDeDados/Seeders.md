# Seeders

> Localização: `database/seeders/`

## Ordem de Execução

```
DatabaseSeeder
  ├── CommunitySeeder (1º)
  └── SubscriptionSeeder (2º)
```

```bash
php artisan db:seed
# ou
php artisan migrate:fresh --seed
```

---

## `DatabaseSeeder`

Orquestrador. Chama `CommunitySeeder` e `SubscriptionSeeder` por esta ordem.

---

## `CommunitySeeder`

Cria dados base de desenvolvimento.

### Users (5)
| Email | Name | Stripe Connect |
|---|---|---|
| ana@ghota.io | Ana Rita | `acct_1TnnFKINvlqGVSzO` (completed) |
| mario@ghota.io | Mario Carlos | `acct_1TnpUeIrptQeFzAk` (completed) |
| joao@ghota.io | Joao Pereira | `acct_1To5gzInYJk1mUCk` (completed) |
| sofia@ghota.io | Sofia Mendes | null |
| rui@ghota.io | Rui Costa | null |

Password para todos: `password`.

### Communities (7)
| Nome | Owner | Público |
|---|---|---|
| Design Systems na Pratica | Ana | sim |
| DevOps na Vida Real | Mario | sim |
| React Avancado | Ana | sim |
| Fotografia para Devs | Joao | sim |
| Product Design Weekly | Sofia | sim |
| Tech Founders Club | Rui | **não** |
| Design Critique Club | Sofia | **não** |

### Por Comunidade
- **1 categoria:** "Canais de texto"
- **5 canais:** boas-vindas, geral, anuncios, duvidas, partilhas (nomes variam por comunidade)
- **Memberships:** 1 owner + 1-2 membros extra
- **2-3 planos** (gratuitos e pagos)
- **4-7 mensagens** de boas-vindas no canal #boas-vindas

### Totais
| Tabela | Registos |
|---|---|
| `users` | 5 |
| `communities` | 7 |
| `memberships` | 19 |
| `categories` | 7 |
| `channels` | 35 |
| `plans` | 14 |
| `messages` | 39 |

### Idempotência
- `updateOrCreate` / `firstOrCreate` — pode correr多次 sem duplicar.

---

## `SubscriptionSeeder`

Cria subscrições para users em comunidades onde são membros.

- Skipea se `Subscription::count() > 0` (idempotente)
- 14 subscrições pre-definidas (todas `status: active`)
- Preços variam de 4.99€ a 149.99€

### Exemplos
| User | Community | Plano | Preço |
|---|---|---|---|
| Ana | DevOps na Vida Real | Acesso Total | 19.99€ |
| Ana | Tech Founders Club | Mensal | 29.99€ |
| Mario | Design Systems na Pratica | Pro | 9.99€ |
| Sofia | React Avancado | Anual | 89.99€ |
| Rui | Design Critique Club | Pro | 12.99€ |
