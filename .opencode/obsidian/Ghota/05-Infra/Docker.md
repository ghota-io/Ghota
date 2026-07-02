# Docker

> Ficheiro: `docker-compose.yml` na raiz do projecto.

## Serviços

| Serviço | Imagem | Porta | Função |
|---|---|---|---|
| `app` | `serversideup/php:8.5-nginx` | `8080:80` | Servidor PHP + Nginx |
| `db` | `postgres:17-alpine` | `5432` | PostgreSQL |
| `redis` | `redis:alpine` | `6379` | Cache + Queue |
| `reverb` | `serversideup/php:8.5-nginx` | `8081:8081` | Laravel Reverb (websockets) |

## Variáveis de Ambiente (`.env`)

```env
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=ghota
DB_USERNAME=ghota
DB_PASSWORD=ghota

REDIS_HOST=redis

REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
REVERB_HOST=reverb
REVERB_PORT=8081
REVERB_SCHEME=http

STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_CONNECT_CLIENT_ID=ca_xxx
```

## Comandos Comuns

```bash
# Iniciar containers
docker compose up -d

# Executar comando no container app (com user local para evitar root)
docker compose exec -u $(id -u):$(id -g) app php artisan <comando>

# Dev server Vite (hot-reload)
docker compose exec app npm run dev

# Build assets
docker compose exec app npm run build

# Logs
docker compose logs -f app

# Reconstruir
docker compose build --no-cache app
```

## Notas

- Ficheiros criados dentro do container (ex: `php artisan make:migration`) ficam com owner `root:root`. Usar `-u $(id -u):$(id -g)` para prevenir.
- Após alterar `.env`, correr `php artisan config:clear` (Laravel usa config cache).
- O serviço `reverb` corre o mesmo PHP image mas com comando `php artisan reverb:start`.
