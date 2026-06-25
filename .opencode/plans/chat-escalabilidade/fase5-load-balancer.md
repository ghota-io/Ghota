# Fase 5 — Load Balancer (nginx)

## Objetivo
Distribuir tráfego HTTP e WebSocket entre múltiplos containers app e Reverb, com health checks e sticky sessions.

## 1. nginx — upstream para Reverb
No nginx actual (que já serve a app em `localhost:8080`), adicionar um server block para WebSocket:

```nginx
upstream reverb_backend {
    ip_hash;
    server reverb:8081 weight=3;
    server reverb-2:8081 weight=2;
}

server {
    listen 8082;

    location / {
        proxy_pass http://reverb_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

## 2. docker-compose.yml — nginx extra ou novo serviço
Opção A: Adicionar port `8082` ao nginx actual e incluir o config.
Opção B: Serviço `nginx-ws` separado.

Recomendação: Opção A (manter um só nginx).

## 3. app — Múltiplas instâncias PHP
Para escalar o backend HTTP:

```yaml
app-2:
  build:
    context: ./web
    target: dev
  container_name: ghota-app-2
  # mesmas envs do app
  depends_on: [pgsql, redis]
  networks:
    - ghota-network
```

O nginx faz `upstream app_backend { server app:9000; server app-2:9000; }`.

## 4. Sessions — Driver Redis
Com múltiplas instâncias app, as sessões precisam de um backend partilhado:

```env
SESSION_DRIVER=redis
SESSION_CONNECTION=redis
```

## Verificação
- `docker compose up -d --scale app=2 --scale reverb=2`
- Browser conecta a `http://localhost:8080` → nginx roteia para app-1 ou app-2
- WebSocket conecta a `ws://localhost:8082` → nginx roteia para reverb-1 ou reverb-2
- Sessão mantém-se após refresh (session via Redis)
- Matar app-1 → requests vão para app-2 sem interrupção
