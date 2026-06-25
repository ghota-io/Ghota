# Fase 1 — Redis (Queue + Cache)

## Objetivo
Substituir PostgreSQL como driver de queue e cache por Redis, libertando o DB para operações críticas da app e permitindo throughput de 10k+ jobs/s.

## Mudanças

### 1. docker-compose.yml — Adicionar serviço Redis
```yaml
redis:
  image: redis:7-alpine
  container_name: ghota-redis
  ports:
    - "6379:6379"
  volumes:
    - redis-data:/data
  networks:
    - ghota-network
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 5s
    timeout: 5s
    retries: 5

volumes:
  redis-data:
```

O Redis deve vir `depends_on` do `app` e do `reverb`.

### 2. .env — Alterar drivers
```env
QUEUE_CONNECTION=redis
CACHE_STORE=redis
REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 3. Instalar predis (ou phpredis)
```bash
composer require predis/predis
```

### 4. docker-compose.yml — app service
Adicionar à environment do `app`:
```yaml
- REDIS_HOST=redis
- QUEUE_CONNECTION=redis
- CACHE_STORE=redis
```

### 5. config/queue.php
Confirmar que `connections.redis` está presente (vem por omissão no Laravel).

### 6. config/cache.php
Alterar `default` para `redis` ou manter `database` mas configurar `stores.redis`.

## Verificação
- `docker compose exec app php artisan tinker --execute="echo Cache::store('redis')->get('test');"`
- Queue worker processa jobs sem falhas
- `docker compose logs reverb` mostra eventos publicados sem erros
