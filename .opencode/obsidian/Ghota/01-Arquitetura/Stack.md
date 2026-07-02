# Stack

## Backend — Laravel 13

| Componente | Versão / Detalhe |
|---|---|
| PHP | 8.5.7 |
| Framework | Laravel 13.x |
| Queue | Redis (não para sessões — `SESSION_DRIVER=database`) |
| Cache | Redis |
| Broadcast | Laravel Reverb (Websockets) |

**Packages principais:**
- `laravel/cashier` — Stripe subscriptions
- `laravel/reverb` — WebSockets
- `pusher/pusher-php-server` — Broadcasting via Reverb
- `laravel/horizon` — Queue monitoring
- `spatie/laravel-permission` — (não usado activamente; gestão própria via `is_owner` + cargos manuais)

---

## Frontend — React + Inertia + Tailwind

| Componente | Versão / Detalhe |
|---|---|
| React | 19.x |
| Inertia.js | Laravel Adapter |
| Vite | 6.x |
| Tailwind CSS | 4.x |
| Tipografia | Inter (via `@fontsource/inter`) |
| Ícones | Lucide React |
| Markdown | `react-markdown` + `remark-gfm` + `remark-breaks` |

**UI patterns:**
- Dark mode por omissão (tema em `localStorage` + BD fallback)
- Layout tipo VSCode: ActivityBar (esquerda) → Sidebar (conteúdo dinâmico) → Main Content
- Cores unificadas:
  - Fundo página: `bg-gray-50` / `dark:bg-[#1e1f22]`
  - Cards/sidebar: `bg-white` / `dark:bg-[#2b2d31]`
  - Acento: `violet-600` / `violet-400`

---

## Base de Dados — PostgreSQL 17

- Motor: PostgreSQL 17
- Índices: `(channel_id, id)` para listagem de mensagens eficiente
- Sessões guardadas em BD (`sessions` table)

---

## Containerização

- Docker Compose com serviços:
  - `app` — Servidor PHP (Laravel) + Nginx (porta 8080)
  - `db` — PostgreSQL 17
  - `redis` — Redis (queue + cache)
  - `reverb` — Laravel Reverb (websockets, porta 8081)
- Imagens: `serversideup/php:8.5-nginx` (ou similar)

---

## Pagamentos — Stripe

- **Modo:** Subscription via Checkout Sessions
- **Stripe Connect:** Express accounts para os owners
  - 80% owner / 20% plataforma
  - `application_fee_amount` definido no webhook `invoice.paid`
- **Cartão de teste:** `4242 4242 4242 4242` (qualquer data futura, qualquer CVC)
