# Fase 3 — Canais Privados com Autorização

## Objetivo
Substituir canais públicos por privados, garantindo que apenas membros da comunidade podem ouvir mensagens em tempo real.

## 1. MessageSent.php — Mudar de Channel para PrivateChannel
```php
use Illuminate\Broadcasting\PrivateChannel;

public function broadcastOn(): array
{
    return [
        new PrivateChannel('chat.' . $this->message->channel_id),
    ];
}
```

## 2. routes/channels.php — Adicionar autorização
```php
use App\Models\Channel;
use App\Models\Membership;

Broadcast::channel('chat.{channelId}', function ($user, $channelId) {
    $channel = Channel::findOrFail($channelId);
    return Membership::where('community_id', $channel->community_id)
        ->where('user_id', $user->id)
        ->exists();
});
```

## 3. Frontend — Echo privado
```js
// ChatArea.jsx — substituir Echo.channel por Echo.private
const channel = window.Echo.private(`chat.${channel.id}`)
```

Reverber exige autenticação para canais privados — o Echo faz um HTTP request a `/broadcasting/auth` com o socket_id. O Laravel verifica a callback em `routes/channels.php` e devolve uma assinatura.

## 4. Config — broadcasting.php (já está correcto)
Garantir que `config/broadcasting.php` tem as credenciais Reverb correctas para o auth endpoint (já estão definidas).

## 5. Middleware — CSRF
O auth endpoint usa verificações CSRF e de sessão. Confirmar que `VerifyCsrfToken` não bloqueia o endpoint (por omissão, `/broadcasting/auth` está exceptuado).

## Verificação
- User não-membro → `Echo.private('chat.X')` → HTTP 403 → callback error no Echo
- User membro → subscreve com sucesso → recebe mensagens em tempo real
- Ver nos logs do Reverb: `pusher_internal:subscription_succeeded` para os privados
