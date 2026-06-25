# Plano — Escalabilidade do Chat (50k users / 2k CCU)

## Stack actual
- Queue: PostgreSQL (`QUEUE_CONNECTION=database`)
- Cache: PostgreSQL (`CACHE_STORE=database`)
- WebSocket: 1x Reverb (single container, sem HA)
- Broadcast: Canais públicos (`chat.{id}`)
- DB: 1x PostgreSQL (sem replicação)
- Mensagens: carregamento sem paginação limitada

## Problemas identificados para 2k CCU
1. Queue em PostgreSQL — cada broadcast faz INSERT + polling, satura o DB
2. Cache em PostgreSQL — concorre com a queue e dados da app
3. Reverb single — sem HA nem escalamento horizontal
4. Canais públicos — qualquer um pode ouvir sem auth
5. Sem rate limiting — abuso pode derrubar o servidor
6. Mensagens sem índice completo — `?after=` pode ficar lento com milhares de msgs

## Fases de implementação

| Fase | O quê | Prioridade |
|---|---|---|
| 1 | Redis (queue + cache) | Crítica |
| 2 | Índices + Rate limiting | Alta |
| 3 | Canais privados com auth | Alta |
| 4 | Cluster Reverb (HA) | Média |
| 5 | Load balancer | Média |
