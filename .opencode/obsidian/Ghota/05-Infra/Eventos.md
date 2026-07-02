# Eventos Broadcast

> Stack: Laravel Reverb (server) + Echo/pusher-js (client). Porta 8081.

## Arquitectura

```
Controller ──dispatch()──▶ Event Class ──▶ Reverb ──▶ Echo.listen()──▶ React state
```

**Channel auth:** `routes/channels.php` — `chat.{channelId}` autorizado apenas a membros da comunidade.

## Eventos

### `MessageSent`

| Campo | Valor |
|---|---|
| **Classe** | `App\Events\MessageSent` |
| **Channel** | `PrivateChannel` → `chat.{channel_id}` |
| **BroadcastAs** | `message.sent` |
| **Trigger** | `MessageController@store` (POST `/canais/{channel}/mensagens`) |
| **Rate limit** | 5 tentativas / 10s por user (429 se excedido) |

**Payload:**
```json
{
  "id": "int",
  "channel_id": "int",
  "user_id": "int",
  "content": "string",
  "created_at": "datetime",
  "user": { "id": "int", "name": "string" }
}
```

**Frontend** (ChatArea.jsx):
```js
Echo.private(`chat.${channelId}`)
  .listen('.message.sent', (data) => {
    setMessages(prev => {
      if (prev.some(m => m.id === data.id)) return prev  // dedup
      return [...prev, data]
    })
  })
```

---

### `MessageUpdated`

| Campo | Valor |
|---|---|
| **Classe** | `App\Events\MessageUpdated` |
| **Channel** | `PrivateChannel` → `chat.{channel_id}` |
| **BroadcastAs** | `message.updated` |
| **Trigger** | `MessageController@update` (PUT `/canais/{channel}/mensagens/{message}`) |
| **Permissão** | Apenas o owner da mensagem pode editar |

**Payload:** (mesma estrutura que MessageSent)

**Frontend:**
```js
.listen('.message.updated', (data) => {
  setMessages(prev => prev.map(m =>
    m.id === data.id ? { ...m, content: data.content } : m
  ))
})
```

---

### `MessageDeleted`

| Campo | Valor |
|---|---|
| **Classe** | `App\Events\MessageDeleted` |
| **Channel** | `PrivateChannel` → `chat.{channel_id}` |
| **BroadcastAs** | `message.deleted` |
| **Trigger** | `MessageController@destroy` (DELETE `/canais/{channel}/mensagens/{message}`) |
| **Nota** | Disparado **antes** de eliminar da BD (evento dispara enquanto registo existe) |

**Payload:**
```json
{
  "id": "int"
}
```

**Frontend:**
```js
.listen('.message.deleted', (data) => {
  setMessages(prev => prev.filter(m => m.id !== data.id))
})
```

## Channels Auth (`routes/channels.php`)

```php
Broadcast::channel('chat.{channelId}', function ($user, $channelId) {
    return Channel::where('id', $channelId)
        ->whereHas('community.memberships', fn ($q) => $q->where('user_id', $user->id))
        ->exists();
});
```

## Cleanup

Em `ChatArea.jsx`, o `useEffect` cleanup faz `Echo.leave('chat.{channelId}')` ao desmontar ou mudar de canal.
