# Arquitetura

## Routing

- **Páginas públicas:** Rotas Laravel normais com `Inertia::render`
  - `/` — Landing page
  - `/login`, `/register` — Auth
  - `/comunidades/{community}/preview` — Pré-visualização pública
  - `/comunidades/{community}/entrar` — Join (com plano pago ou gratuito)
- **Área interna (app):** Rota única `/app/{section}/{sub?}` gerida por `AppLayout.jsx`
  - Secções: `chat`, `membros`, `planos`, `gerir`
  - Toda a navegação interna é client-side (Inertia)
- **Webhooks:** `POST /stripe/webhook` (excluído CSRF)

## Layout Interno

```
┌──────────────┬─────────────────┬──────────────────────────┐
│ ActivityBar  │ Sidebar         │ Main Content             │
│ (60px)       │ (240px)         │ (restante)               │
│              │                 │                          │
│  ☰ Comunidades│  ○ Canais      │  ┌─ Chat ──────────┐    │
│  💬 Chat     │  ○ Membros     │  │ Mensagens        │    │
│  👥 Membros  │  ○ Planos      │  │                  │    │
│  📋 Planos   │  ○ Gerir       │  └──────────────────┘    │
│  ⚙️ Gerir    │                 │                          │
└──────────────┴─────────────────┴──────────────────────────┘
```

## Fluxo de Dados

```
Browser ──Inertia──▶ Laravel ──▶ PostgreSQL
  │                    │
  │                    ├── Stripe API ──▶ Stripe
  │                    │
  │                    └── Reverb ──▶ WebSocket ──▶ Browser (outros clients)
  │
  └── localStorage (tema, cache de permissões)
```

## Segurança

- **Autorização:** Gates do Laravel + verificação `is_owner` na Membership
- **CSRF:** Protecção global; webhook Stripe excluído
- **XSS:** React lida com escaping; markdown usa `react-markdown` (sem `dangerouslySetInnerHTML`)
- **Permissões:** Guardadas em `localStorage` para acesso rápido no frontend
- **Stripe:** Webhook verificado com assinatura HMAC-SHA256

## Temas

- **Primário:** `localStorage` (imediato, sem round-trip)
- **Fallback:** BD (via fetch fire-and-forget)
- Sincronização: ao fazer toggle, guarda em ambos

## Arquivo de Mensagens

- Comando `php artisan messages:archive` (diário via scheduler)
- Mensagens >30 dias movidas para `message_archives`
- Mantém desempenho da tabela `messages` para consultas frequentes
