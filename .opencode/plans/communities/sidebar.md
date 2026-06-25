# Sidebar — Categorias e Canais

## Estrutura

```
┌──────────────────────────┐
│  ⚙️ Gerir                │
│  👥 Membros              │
│  #️⃣ Canais               │ links de navegação
│  💳 Planos               │ (condicional: >1 plano)
├──────────────────────────┤
│                          │
│  ▼ CANAIS DE TEXTO    [+]│ ← categoria colapsável
│    # geral               │
│    # anúncios            │
│    # recursos            │
│                          │
│  ▼ PÁGINAS            [+]│
│    📄 regras             │
│    📄 guia               │
│                          │
│  [Nova categoria...]     │ ← se owner, no fim
└──────────────────────────┘
```

## Comportamento

| Ação | Comportamento |
|---|---|
| Clicar canal | Navega para o canal (preserveState) |
| Clicar canal ativo | Desmarca, mostra overview da comunidade |
| Clicar ▶/▼ categoria | Expande/colapsa (estado local) |
| [+] por categoria | Abre input inline para novo canal (owner) |
| Botão "Nova categoria" | Abre input no fim da sidebar (owner) |
| Context menu (direito) | Editar/Eliminar canal ou Nova categoria (owner) |
| Editar canal | Input inline com confirm + cancel |

## Regras de negócio

- Categorias ordenadas por `order`
- Canais ordenados por `order` dentro de cada categoria
- Canais `text` mostram `#`, canais `page` mostram `📄`
- Canal ativo tem fundo destacado (indigo)
- Owner vê botões de ação extra (+ e ⋮)

## Propagação de estado

- Todo o estado da sidebar é **React local** — nunca é resetado por navegações
  entre canais ou CRUD actions
- `collapsedCategories` — preserveState mantém intacto
- `contextMenu`, `editingChannelId`, `creatingForCategory` — estado local,
  vive dentro do componente Sidebar
- `creatingForCategory` — estado local do input inline
- Ao clicar num canal, o `<Link preserveState>` navega sem desmontar o
  componente — as props `channel` e `messages` mudam, mas o estado React não
- CRUD de canais/categorias usa `router.post({ preserveState: true })` —
  a resposta do servidor atualiza `community.categories` nas props, a sidebar
  re-renderiza os items mas mantém collapsedCategories

## Ficheiros

- `web/resources/js/Components/Sidebar.jsx`
