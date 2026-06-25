# Plano — Página Interna da Comunidade

## Objetivo
Recriar a página interna da comunidade (chat) com sidebar tipo Discord,
canais na main area, sistema de cargos/permissões, e CRUD completo.

## Stack
- React (Inertia) + Tailwind CSS + Lucide icons
- Laravel backend (API JSON + Inertia)
- PostgreSQL

## Modelo de renderização (critical)

Toda a página (`ShowChannel.jsx`) é uma **única página Inertia** composta por
sidebar + main area. Ao navegar entre canais ou fazer CRUD de
categorias/canais/mensagens, **apenas a main area atualiza** — a sidebar
mantém o seu estado React (categorias colapsadas, scroll position, etc.)

### Como funciona

1. `ShowChannel.jsx` recebe `{ community, channel, messages }` como props Inertia
2. Sidebar é um componente React puro — o seu estado (`collapsedCategories`,
   `contextMenu`, `editingChannelId`) é **local** e nunca é resetado
3. Navegação entre canais usa `<Link preserveState>` — Inertia atualiza só as
   props `channel` e `messages`, o componente React mantém-se montado
4. CRUD actions (`router.post`/`put`/`delete`) usam `{ preserveState: true }` —
   a resposta do servidor atualiza as props, o estado local sobrevive
5. O controller `channel()` carrega `community` completa (com categorias) + o
   canal atual + mensagens. Assim a sidebar tem sempre os dados mais recentes
   sem precisar de recarregar

### O que NÃO deve causar full page reload

- Clicar num canal diferente na sidebar
- Criar/renomear/apagar canal (inline na sidebar)
- Criar/renomear/apagar categoria
- Enviar mensagem (fetch, não Inertia)
- Alternar entre views (channel, overview, plans, channels management)

### O que PODE causar full page reload

- Navegar para fora da comunidade (dashboard, perfil, etc.)
- Recarregar a página (F5)

## Estrutura de ficheiros

```
web/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CommunityController.php      ← channel() refeito
│   │   │   ├── MessageController.php        ← já existe
│   │   │   ├── CategoryController.php       ← já existe
│   │   │   └── ChannelController.php        ← já existe
│   │   └── Requests/
│   │       └── MessageRequest.php           ← novo
│   ├── Models/
│   │   ├── Role.php                         ← novo
│   │   ├── Permission.php                   ← novo
│   │   └── RoleUser.php                     ← novo (pivot)
│   └── Services/
│       └── PermissionService.php            ← novo
├── resources/js/
│   ├── Pages/Communities/
│   │   └── ShowChannel.jsx                  ← refeito (componente principal)
│   └── Components/
│       ├── ChatArea.jsx                     ← novo (main area)
│       ├── Sidebar.jsx                      ← novo (categorias + canais)
│       ├── MessageGroup.jsx                 ← novo (grupo de mensagens)
│       ├── MessageInput.jsx                 ← novo
│       └── CategoryManager.jsx              ← refeito
├── database/migrations/
│   ├── xxxx_create_roles_table.php          ← novo
│   ├── xxxx_create_permissions_table.php    ← novo
│   └── xxxx_create_role_user_table.php      ← novo
└── routes/web.php                           ← rotas restauradas
```
