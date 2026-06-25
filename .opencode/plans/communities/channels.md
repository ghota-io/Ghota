# Channels — CRUD

## Rotas

| Método | Rota | Controller | Ação |
|---|---|---|---|
| POST | /canais | ChannelController@store | Criar |
| PUT | /canais/{channel} | ChannelController@update | Renomear/alterar |
| DELETE | /canais/{channel} | ChannelController@destroy | Apagar |

## ChannelController

### store()
- Valida: `name`, `type`(text|page), `community_id`, `category_id`(nullable)
- Verifica ownership
- Normaliza nome: trim, spaces → `-`, `alpha_dash`
- Unique por comunidade
- Se sem `category_id`, cria/default "Canais de texto" ou "Páginas"
- `order` = max + 1 na categoria
- Frontend usa `router.post({ preserveState: true })`
- Retorna redirect()->back()

### update()
- Valida: `name` required
- Normaliza nome, unique check (excluindo próprio)
- `alpha_dash` validation
- Se nome mudou, redirect para nova URL do canal
- Frontend usa `router.put({ preserveState: true })` — se o nome mudou, o
  redirect vai para a nova URL, mas preserveState mantém o componente montado
- Retorna redirect()->route('communities.channel', ...)

### destroy()
- Verifica ownership
- Delete
- Frontend usa `router.delete({ preserveState: true })`
- Retorna redirect()->back()

## Tipos de canal

| type | Descrição | Comportamento |
|---|---|---|
| `text` | Canal de chat | Mensagens em tempo real, input |
| `page` | Página de conteúdo | Mensagens como conteúdo Wiki-like |
| `voice` | Voz (futuro) | — |
| `announcement` | Anúncios (futuro) | Só admins escrevem |

## Normalização de nomes

```javascript
// frontend (onChange)
e.target.value.replace(/\s+/g, '-')

// backend
$name = str_replace(' ', '-', trim($name));
// valida: alpha_dash
// unique: WHERE community_id = X AND name = Y
```

## Frontend

### Inline na sidebar
- `[+]` no header da categoria → input inline
- Input com autoFocus, submit on Enter
- Fecha onBlur (200ms delay)

### Inline rename
- Context menu → "Editar canal"
- Input inline com confirm (✓) e cancel (X)
- Submit faz PUT, redirect para nova URL se nome mudou

### Delete
- Context menu → "Eliminar canal"
- Confirm dialog
- DELETE + redirect()->back()

## Views (futuro — "canais customizáveis")

- Canais `page` podem ter conteúdo rich text (editor)
- Canais `voice` com integração áudio/vídeo
- Canais `announcement` só escritos por admins
- Canais `forum` com tópicos e respostas
- Cada tipo de canal terá o seu próprio component React
- O `type` do canal determina qual componente renderizar na main area

## Regras

- Nomes só: letras, números, hífen, underscore
- Único por comunidade (case-insensitive? agora é case-sensitive)
- Owner pode criar/editar/apagar qualquer canal
- Futuramente: permissão `manage_channels` para não-owners
