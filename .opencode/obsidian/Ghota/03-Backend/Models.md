# Models

> Localização: `app/Models/`

## User (`app/Models/User.php`)

```php
class User extends Authenticatable
```

| Relação | Tipo | FK |
|---|---|---|
| `communitiesOwned()` | HasMany | `communities.owner_id` |
| `memberships()` | HasMany | `memberships.user_id` |
| `subscriptions()` | HasMany | `subscriptions.user_id` |
| `messages()` | HasMany | `messages.user_id` |

**Cast:** `password` → hashed

## Community (`app/Models/Community.php`)

```php
class Community extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `owner()` | BelongsTo | `users` |
| `memberships()` | HasMany | `memberships.community_id` |
| `members()` | HasManyThrough | `users` via `memberships` |
| `categories()` | HasMany | `categories.community_id` |
| `channels()` | HasMany | `channels.community_id` |
| `roles()` | HasMany | `community_roles.community_id` |
| `plans()` | HasMany | `plans.community_id` |
| `subscriptions()` | HasManyThrough | `subscriptions` via `plans` |
| `invitations()` | HasMany | `community_invitations.community_id` |
| `events()` | HasMany | `events.community_id` |

**Métodos notáveis:**
- `getRouteKeyName()` → `'slug'`

## Membership (`app/Models/Membership.php`)

```php
class Membership extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `user()` | BelongsTo | `users` |
| `community()` | BelongsTo | `communities` |
| `role()` | BelongsTo | `community_roles` |

**Fillable:** `user_id`, `community_id`, `is_owner`, `community_role_id`

## CommunityRole (`app/Models/CommunityRole.php`)

```php
class CommunityRole extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `community()` | BelongsTo | `communities` |
| `members()` | HasMany | `memberships.community_role_id` |

**Cast:** `permissions` → array

**Nota:** Não tem `is_default`. Cargos são criados manualmente pelo owner.

## Category (`app/Models/Category.php`)

```php
class Category extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `community()` | BelongsTo | `communities` |
| `channels()` | HasMany | `channels.category_id` (ordenado por `order`) |

**Fillable:** `community_id`, `name`, `order`

## Channel (`app/Models/Channel.php`)

```php
class Channel extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `community()` | BelongsTo | `communities` |
| `category()` | BelongsTo | `categories` |
| `messages()` | HasMany | `messages.channel_id` |

**Fillable:** `community_id`, `category_id`, `name`, `type`, `order`

## Message (`app/Models/Message.php`)

```php
class Message extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `channel()` | BelongsTo | `channels` |
| `user()` | BelongsTo | `users` |

**Soft deletes:** `SoftDeletes`

## Plan (`app/Models/Plan.php`)

```php
class Plan extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `community()` | BelongsTo | `communities` |
| `subscriptions()` | HasMany | `subscriptions.plan_id` |

**Cast:** `features` → array, `price` → integer, `is_active` → boolean, `is_free` → boolean

## Subscription (`app/Models/Subscription.php`)

```php
class Subscription extends Model
```

| Relação | Tipo | FK |
|---|---|---|
| `user()` | BelongsTo | `users` |
| `plan()` | BelongsTo | `plans` |
| `community()` | BelongsTo | `communities` |

## MessageArchive (`app/Models/MessageArchive.php`)

> Mesma estrutura que `Message`, mas para mensagens arquivadas (>30 dias).

## CommunityInvitation (`app/Models/CommunityInvitation.php`)

| Relação | Tipo | FK |
|---|---|---|
| `community()` | BelongsTo | `communities` |

## Event (`app/Models/Event.php`)

| Relação | Tipo | FK |
|---|---|---|
| `community()` | BelongsTo | `communities` |
