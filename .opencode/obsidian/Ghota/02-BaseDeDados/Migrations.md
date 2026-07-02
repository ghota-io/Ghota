# Migrations

> Localização: `database/migrations/`

## Core

| Ficheiro | Tabela | Descrição |
|---|---|---|
| `0001_01_01_000000_create_users_table` | `users` | Base |
| `0001_01_01_000001_create_cache_table` | `cache`, `cache_locks` | Cache |
| `0001_01_01_000002_create_jobs_table` | `jobs`, `job_batches`, `failed_jobs` | Queue |
| `0001_01_01_000003_create_sessions_table` | `sessions` | Sessões |
| `2025_01_20_201000_create_communities_table` | `communities`, `memberships` | |
| `2025_01_20_201002_create_community_roles_table` | `community_roles` | |
| `2026_06_21_004110_create_channels_table` | `channels` | type, order |
| `2026_06_22_185556_create_categories_table` | `categories` | Tabela separada de categorias |
| `2026_06_22_185559_add_category_id_to_channels_table` | `channels` (alter) | add `category_id` FK; migra dados existentes |
| *(dates a confirmar)* `_create_plans_table` | `plans` | |
| *(dates a confirmar)* `_create_subscriptions_table` | `subscriptions` | |
| *(dates a confirmar)* `_create_message_archives_table` | `message_archives` | |
| *(dates a confirmar)* `_create_community_invitations_table` | `community_invitations` | |
| *(dates a confirmar)* `_create_notifications_table` | `notifications` | |
| *(dates a confirmar)* `_create_events_table` | `events` | |

## Alterações Estruturais

| Data | Tabela | Mudança |
|---|---|---|
| `2026_06_30_235250` | `users` | add `theme` column |
| `2026_07_01_014548` | `users` | add `stripe_connect_id`, `stripe_connect_status` |
| `2026_07_01_020651` | `plans` | add `stripe_price_id` |
| `2026_07_01_192044` | `memberships` | add `is_owner` column, drop `role` column |
| `2026_07_01_200245` | `community_roles` | drop `is_default` column |

## Índices

- `messages`: índice composto `(channel_id, id)` para scroll
- `subscriptions`: unique index em `stripe_subscription_id`
- `memberships`: unique composto `(user_id, community_id)`
- `community_invitations`: unique composto `(community_id, invited_email)`
- `channels`: índice `(community_id, order)` para ordenação
