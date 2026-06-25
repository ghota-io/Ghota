# Roles e Permissões

## Tabelas

### roles
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigIncrements | |
| community_id | foreignId | FK → communities |
| name | string | ex: "Admin", "Moderador", "Membro" |
| slug | string | ex: "admin", "mod", "member" |
| is_default | boolean | role atribuída a novos membros |
| sort_order | integer | para ordenar |
| timestamps | | |

### permissions
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigIncrements | |
| role_id | foreignId | FK → roles |
| action | string | ex: "manage_channels", "delete_messages", "manage_members" |
| resource | string | ex: "channel", "message", "member", "category" |
| timestamps | | |

### role_user (pivot)
| Coluna | Tipo | Notas |
|---|---|---|
| id | bigIncrements | |
| role_id | foreignId | FK → roles |
| user_id | foreignId | FK → users |
| community_id | foreignId | FK → communities |
| timestamps | | |

## Permissões planeadas

| Action | Descrição |
|---|---|
| `manage_channels` | Criar, editar, eliminar canais |
| `manage_categories` | Criar, editar, eliminar categorias |
| `manage_messages` | Editar/eliminar mensagens de qualquer user |
| `manage_members` | Remover membros, atribuir cargos |
| `manage_roles` | Criar/editar/eliminar cargos |
| `send_messages` | Enviar mensagens em canais de texto |
| `read_channel` | Ver um canal específico |
| `manage_community` | Editar definições da comunidade |

## Comportamento

- Owner tem todas as permissões (hardcoded, não precisa de role)
- Ao entrar na comunidade, o membro recebe a role `is_default`
- Futuramente: canais podem restringir `read_channel` / `send_messages` por role
- Futuramente: UI de gestão de roles em `/gerir?tab=roles`

## Seed

- `RoleSeeder` cria roles base (Admin, Moderador, Membro) com permissões por comunidade

## Ficheiros

- `web/app/Models/Role.php`
- `web/app/Models/Permission.php`
- `web/app/Models/RoleUser.php` (pivot)
- `web/app/Services/PermissionService.php`
- `web/database/migrations/xxxx_create_roles_table.php`
- `web/database/migrations/xxxx_create_permissions_table.php`
- `web/database/migrations/xxxx_create_role_user_table.php`
- `web/database/seeders/RoleSeeder.php`
