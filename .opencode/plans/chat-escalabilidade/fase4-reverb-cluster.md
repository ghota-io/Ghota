# Fase 4 — Cluster Reverb (High Availability)

## Objetivo
Permitir múltiplas instâncias Reverb partilhando estado via Redis, garantindo que o serviço de WebSocket não tem single point of failure.

## Pré-requisito
Redis configurado e funcional (Fase 1).

## 1. config/reverb.php — Activar scaling
```php
'scaling' => [
    'enabled' => env('REVERB_SCALING_ENABLED', true),
    'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
    'server' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', 'redis'),
        'port' => env('REDIS_PORT', '6379'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'database' => env('REDIS_DB', '0'),
        'timeout' => env('REDIS_TIMEOUT', 60),
    ],
],
```

## 2. .env
```env
REVERB_SCALING_ENABLED=true
```

## 3. docker-compose.yml — Múltiplos Reverb
```yaml
reverb:
  build:
    context: ./web
    target: dev
    # ... (config actual)
  command: php artisan reverb:start --debug
  # ... healthcheck, depends_on: [pgsql, redis]

reverb-2:
  build:
    context: ./web
    target: dev
  container_name: ghota-reverb-2
  command: php artisan reverb:start --debug
  environment:
    - APP_ENV=local
    - DB_CONNECTION=pgsql
    - DB_HOST=pgsql
    - REDIS_HOST=redis
    - REVERB_SCALING_ENABLED=true
  depends_on:
    pgsql:
      condition: service_healthy
    redis:
      condition: service_started
  networks:
    - ghota-network
```

## 4. Nota sobre portas
Apenas o primeiro `reverb` expõe a porta 8081 para o exterior. O `reverb-2` comunica via Redis — partilha o mesmo estado de canais/connections.

## Verificação
- `docker compose up -d --scale reverb=2` — ambos os containers iniciam
- Cliente WebSocket conecta a `ws://localhost:8081` — mensagens publicadas num nó chegam aos clients ligados a qualquer nó
- Matar um container (`docker compose stop reverb-2`) — clients continuam a receber mensagens do nó vivo
