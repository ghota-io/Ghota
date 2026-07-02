# Rotas da App Interna

> Rota única: `GET /comunidades/{community}/app/{section?}/{sub?}` gerida por `AppLayout.jsx`.

## Mapeamento Section → Componentes

| `section` | `sub` / `initialTab` | Sidebar | Main Content |
|---|---|---|---|
| `canais` | — | `ChannelSidebar` (árvore categorias/canais) | `ChatArea` (se `channel` existe) |
| `gerir` | `settings` | `ManageSidebar` → Definições | `SettingsSection` |
| | `channels` | `ManageSidebar` → Canais | `ChannelsSection` |
| | `members` | `ManageSidebar` → Membros | `MembersSection` |
| | `danger` | `ManageSidebar` → Zona de Perigo | `DangerSection` |
| `membros` | `lista` | `MembersSidebar` → Membros (count) + Cargos | `MembersTable` |
| | `cargos` | `MembersSidebar` (igual) | `RolesContent` |
| `planos` | `gerir` | `PlansSidebar` → Gerir + Alterar + Cancelar | `PlanManageContent` |
| | `alterar` | `PlansSidebar` (igual) | `PlanChangeContent` |
| | `cancelar` | `PlansSidebar` (igual) | `PlanCancelContent` |

## Notas

- **`gerir`** é especial: a sidebar é renderizada internamente por `ManageContent`, não pelo `AppLayout`. As tabs usam `initialTab` prop (default `settings`).
- **`canais`** não tem conceito de `sub` — a `ChannelSidebar` mostra sempre a árvore completa.
- Navegação entre subpáginas preserva estado com `preserveState: true, preserveScroll: false`.

## Layout Visual

```
┌──────────────┬─────────────────────┬──────────────────────────────┐
│ ActivityBar  │ Sidebar (240px)     │ Main Content (flex-1)        │
│ (60px)       │                     │                              │
│              │ Conteúdo varia      │ Conteúdo varia conforme:      │
│ Ícones:      │ conforme section:   │                              │
│ - Logo       │                     │  canais → ChatArea           │
│ - Dashboard  │  canais → Channel   │  membros/lista → MembersTable│
│ - Comunidades│  membros → Members  │  membros/cargos → RolesContent│
│ - Sair       │  planos → Plans     │  planos/gerir → PlanManage   │
│              │  gerir → Manage     │  gerir/* → Sections           │
└──────────────┴─────────────────────┴──────────────────────────────┘
```

## Estado Partilhado (props Inertia)

| Prop | Tipo | Descrição |
|---|---|---|
| `community` | object | Dados da comunidade |
| `member` | object | Membership do user actual |
| `channels` | array | Canais (com categorias) |
| `membersList` | array | Todos os membros (com roles, plans, subscriptions) |
| `roles` | array | Cargos da comunidade |
| `plans` | array | Planos da comunidade |
| `currentPlan` | object|null | Plano do user actual |
| `memberCount` | int | Contagem de membros |
