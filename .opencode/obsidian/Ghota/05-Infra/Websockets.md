# Websockets (Laravel Reverb + Echo)

## Stack

- **Server:** Laravel Reverb (porta 8081)
- **Client:** Laravel Echo + `pusher-js`

## Configuração

### Server (`.env`)
```
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
REVERB_HOST=reverb
REVERB_PORT=8081
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

### Client (`resources/js/bootstrap.js`)
```js
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

## Eventos

Apenas 3 eventos, todos no canal privado `chat.{channel_id}`:

| Evento | Trigger | Payload |
|---|---|---|
| `message.sent` | POST `/canais/{channel}/mensagens` | `{id, channel_id, user_id, content, created_at, user}` |
| `message.updated` | PUT `/canais/{channel}/mensagens/{message}` | `{id, channel_id, user_id, content, created_at, user}` |
| `message.deleted` | DELETE `/canais/{channel}/mensagens/{message}` | `{id}` |

Detalhes completos em [[05-Infra/Eventos|Eventos]].

## Channel Auth (`routes/channels.php`)

```php
Broadcast::channel('chat.{channelId}', function ($user, $channelId) {
    return Channel::where('id', $channelId)
        ->whereHas('community.memberships', fn ($q) => $q->where('user_id', $user->id))
        ->exists();
});
```

## Comandos

```bash
docker compose up -d reverb
# ou
php artisan reverb:start
```

## Segurança

- Autenticação via Sanctum + PrivateChannel
- Apenas membros da comunidade podem subscrever `chat.{channel_id}`
- Eventos usam `ShouldBroadcast` (não `ShouldBroadcastNow`)
