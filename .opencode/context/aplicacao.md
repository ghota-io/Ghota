# Ghota — Plataforma de Cursos/Comunidades

## Stack

- **Backend**: Laravel (PHP 8.5)
- **Frontend**: React (Inertia.js + Vite)
- **Database**: PostgreSQL 17
- **Container**: Docker (PHP-FPM + Nginx)

## Estrutura do projeto

```
Ghota/
├── web/                    ← código da aplicação Laravel
│   ├── app/
│   ├── resources/js/       ← React (Inertia pages)
│   ├── routes/
│   ├── database/
│   ├── Dockerfile
│   └── docker/
├── docker-compose.yml
└── .opencode/
```

## Domínio

### Utilizadores

- Registam-se e autenticam-se (Breeze/React).
- Podem criar comunidades ou entrar em comunidades existentes.
- Um utilizador pode ser owner de várias comunidades.

### Comunidades

- Cada comunidade tem um **owner** (criador).
- O owner define o tipo de acesso:
  - **Gratuita** — entrada livre.
  - **One-time fee** — pagamento único para entrar.
  - **Subscription** — pagamento recorrente (mensal/anual/vitalício).
- Cada comunidade pode ter múltiplos **canais** (texto/página).
- Dentro da comunidade o layout segue o modelo do Discord:
  - Sidebar esquerda com a lista de canais/páginas.
  - Área principal com o canal selecionado (chat ou página de conteúdo).
  - Dropdown no topo para alternar entre comunidades.

### Páginas previstas

| Rota | Descrição |
|---|---|
| `/` | Landing / explorar comunidades |
| `/comunidades/{id}` | Página pública da comunidade (banner, descrição, preçário) |
| `/comunidades/{id}/entrar` | Selecionar plano e entrar |
| `/c/{id}/canal/{canal}` | Layout interno tipo Discord com sidebar e chat |
| `/dashboard` | Dashboard do utilizador |
| `/admin/comunidades` | Gestão das comunidades do owner |

## Layouts de referência

Os wireframes estão em `.opencode/resources/`:
- `Comunidade.excalidraw` — layout interno da comunidade (sidebar canais + chat)
- `EntrarComunidade.excalidraw` — página pública com banner, descrição e preçário

## Regras de desenvolvimento

- Usar Inertia + React para páginas interativas.
- As migrações devem refletir o schema real (users, communities, memberships, channels, messages, subscriptions).
- Qualquer funcionalidade nova deve ter testes.
- Seguir as convenções do Laravel (PSR-4, routes/web.php, etc.).
