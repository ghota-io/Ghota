# Fase 2 — Índices + Rate Limiting

## Objetivo
Garantir que queries de mensagens se mantêm rápidas com milhares de mensagens por canal e evitar abuso na API.

## 1. Migration — Índice composto para mensagens
```php
// database/migrations/xxxx_add_channel_id_id_index_to_messages.php
Schema::table('messages', function (Blueprint $table) {
    $table->index(['channel_id', 'id']);
});
```

Este índice optimiza o `WHERE channel_id = ? AND id > ? ORDER BY id` da query `?after=`.

## 2. Migration — Limitar profundidade de histórico
Considerar adicionar uma coluna `archived_at` ou mover mensagens > 30 dias para uma tabela `messages_archive`. Opcional nesta fase, documentar como decisão futura.

## 3. Rate Limiting — MessageController@store
No controller ou como middleware:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

// AppServiceProvider::boot() ou RouteServiceProvider
RateLimiter::for('messages', fn ($job) => Limit::perMinute(30)->by($job->user?->id ?? $job->ip()));
```

Aplicar no route ou controller:
```php
public function store(MessageRequest $request, Channel $channel): JsonResponse
{
    $executed = RateLimiter::attempt(
        'send-message:' . $request->user()->id,
        5,                    // 5 mensagens
        10,                   // a cada 10 segundos
        function () use ($request, $channel) {
            // ... criar mensagem
        }
    );

    if (!$executed) {
        return response()->json(['message' => 'Muitas mensagens. Aguarda um pouco.'], 429);
    }
}
```

## Verificação
- `EXPLAIN SELECT * FROM messages WHERE channel_id = 1 AND id > 100 ORDER BY id` — must show index scan
- Enviar 6+ mensagens em 10s → HTTP 429
