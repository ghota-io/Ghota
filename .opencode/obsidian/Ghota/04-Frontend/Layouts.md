# Layouts

> Localização: `resources/js/Layouts/`

## `AuthenticatedLayout.jsx`

Layout base para páginas autenticadas (dashboard, profile, etc.). Inclui:
- Navbar (`GhotaNavbar`)
- Flash messages (success/error via Inertia)
- Slot para `{children}` e `{header}`

## `GuestLayout.jsx`

Layout para páginas públicas (login, register, landing). Minimalista, sem sidebar.

---

## AppLayout (especial)

> `resources/js/Pages/Communities/AppLayout.jsx` — não é um layout tradicional, é a página `app()` que renderiza toda a UI interna.

**Estrutura:**
```
┌──────────────┬─────────────────────┬───────────────────────────┐
│ ActivityBar  │ Sidebar             │ Main Content              │
│ (60px)       │ (conteúdo variável) │ (conteúdo da secção)     │
│              │                     │                           │
│ Ícones:      │ Renderiza conforme  │ Renderiza conforme:       │
│ - Logo       │ section:            │                           │
│ - Dashboard  │ - ChannelSidebar    │ - ChatArea                │
│ - Comunidades│ - MembersSidebar    │ - MembersTable            │
│ - Sair       │ - PlansSidebar      │ - RolesContent            │
│              │ - ManageContent(*)  │ - Sections gerir          │
│              │   (*) interno       │                           │
└──────────────┴─────────────────────┴───────────────────────────┘
```

**Estado partilhado via props Inertia:**
- `community` — dados da comunidade
- `member` — membership do user actual
- `channels` — lista de canais
- `membersList` — todos os membros com roles, plans, subscriptions
- `roles` — cargos da comunidade
- `plans` — planos da comunidade
- `currentPlan` — plano do user actual (se aplicável)
- `memberCount` — contagem de membros

Ver [[01-Arquitetura/AppRouting|AppRouting]] para o mapeamento completo de secções.
