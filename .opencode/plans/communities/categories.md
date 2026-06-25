# Categories — CRUD

## Rotas

| Método | Rota | Controller | Ação |
|---|---|---|---|
| POST | /categorias | CategoryController@store | Criar |
| PUT | /categorias/{category} | CategoryController@update | Renomear |
| DELETE | /categorias/{category} | CategoryController@destroy | Apagar (com canais) |

## CategoryController

### store()
- Valida: `name` required|string|max:255, `community_id` required|exists
- Verifica ownership (user.id === community.owner_id)
- Calcula `order` (max + 1)
- Frontend usa `router.post({ preserveState: true })` — sidebar mantém estado
- Retorna redirect()->back()

### update()
- Valida: `name` required|string|max:255
- Verifica ownership via $category->community->owner_id
- Renomeia
- Frontend usa `router.put({ preserveState: true })`
- Retorna redirect()->back()

### destroy()
- Verifica ownership
- `$category->delete()` — cascade nos canais
- Frontend usa `router.delete({ preserveState: true })`
- Retorna redirect()->back()

## Frontend

### Inline na sidebar
- `[+]` hover no header da categoria → input inline
- Context menu → "Nova categoria"
- Input fecha onBlur com 200ms delay

### CategoryManager (tela de gestão)
- Lista categorias com canais
- Inline rename
- Delete com confirmação
- Criar canal dentro da categoria

## Regras

- Toda categoria pertence a uma comunidade
- `order` define a posição na sidebar
- Ao apagar categoria, canais são apagados em cascata
- Não pode haver categorias com nome vazio
- Nomes únicos dentro da mesma comunidade? Opcional (não validado)
