# Messages — CRUD

## Rotas

| Método | Rota | Controller | Ação |
|---|---|---|---|
| GET | /canais/{channel}/mensagens | MessageController@index | Listar mensagens (JSON) |
| POST | /canais/{channel}/mensagens | MessageController@store | Criar mensagem (JSON) |
| PUT | /canais/{channel}/mensagens/{message} | MessageController@update | Editar mensagem |
| DELETE | /canais/{channel}/mensagens/{message} | MessageController@destroy | Apagar mensagem |

## MessageController

### index()
- Parâmetro opcional `?after={id}` para polling incremental
- Carrega `user` relationship
- `latest()->limit(50)` se sem `after`, senão `where('id', '>', after)->get()`
- Retorna `JsonResponse` ou coleção

### store()
- `MessageRequest` com validação: `content` required|string|max:5000
- `channel_id` do route binding
- `user_id` do auth
- Retorna a Message com `user` carregado
- Verificar permissão `send_messages` no canal

### update()
- Só o autor da mensagem pode editar
- `content` validated
- Retorna mensagem atualizada

### destroy()
- Autor ou role `manage_messages` pode apagar
- Soft delete? Não — delete físico por agora

## MessageRequest

```php
public function rules(): array
{
    return [
        'content' => ['required', 'string', 'max:5000'],
    ];
}
```

## Frontend

- `MessageInput.jsx`: input + send button, optimistic update com fetch()
- `MessageGroup.jsx`: renderiza grupo de mensagens do mesmo user
- `ChatArea.jsx`: container com scroll, polling, empty state
- Mensagens temporárias (optimistic) têm `id` negativo

## Validações

- Canal `text` aceita mensagens
- Canal `page` usa mensagens como conteúdo formatado (sem input de chat)
- Só membros com permissão `send_messages` podem escrever
- Só membros com permissão `read_channel` no canal podem ver
