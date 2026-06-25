# Project: Ghota

Instruções para agentes. Lê `.opencode/context/aplicacao.md` antes de qualquer tarefa.

## Stack

- Backend: Laravel (PHP 8.5)
- Frontend: React (Inertia.js + Vite)
- Database: PostgreSQL 17
- Containers: Docker (docker-compose)

## Commands

| Comando | Descrição |
|---|---|
| `docker compose up -d` | Iniciar containers |
| `docker compose exec app npm run dev` | Dev server Vite (hot-reload) |
| `docker compose exec app npm run build` | Build production assets |
| `docker compose exec app php artisan migrate` | Correr migrations |
| `docker compose exec app php artisan make: migration ...` | Criar migration |
| `docker compose exec app composer require ...` | Instalar pacote PHP |
| `docker compose exec app php artisan test` | Correr testes |

## Links

- App: http://localhost:8080
- Preview Comunidade: http://localhost:8080/preview/comunidade.html
- Preview Entrar: http://localhost:8080/preview/entrar-comunidade.html
- Descrição completa: `.opencode/context/aplicacao.md`
- Plano da página interna: `.opencode/plans/communities/context.md`
