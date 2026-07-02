# Componentes

> Localização: `resources/js/Components/` (componentes reutilizáveis)  
> `resources/js/Pages/Communities/` (componentes de página, inline)

## Components Reutilizáveis (`resources/js/Components/`)

| Componente | Ficheiro | Função |
|---|---|---|
| `ChatArea` | `ChatArea.jsx` | Área principal de chat, scroll infinito, broadcast |
| `MessageGroup` | `MessageGroup.jsx` | Grupo de mensagens por user (avatar, nome, timestamp, edit/delete) |
| `MessageInput` | `MessageInput.jsx` | `<textarea>` com auto-grow, Enter=envia, Shift+Enter=nova linha |
| `MarkdownRenderer` | `MarkdownRenderer.jsx` | Renderizador markdown reutilizável |
| `ActivityBar` | `ActivityBar.jsx` | Barra lateral esquerda (60px) |
| `Sidebar` | `Sidebar.jsx` | Sidebar genérica |
| `Dropdown` | `Dropdown.jsx` | Menu dropdown |

### MarkdownRenderer

Componente standalone que usa `react-markdown` + `remark-gfm` + `remark-breaks`.

**Funcionalidades:**
- Botão "Copiar" em blocos de código (hover, feedback "Copiado!" 2s)
- `remark-breaks`: quebra de linha única vira `<br>`
- Links abrem em nova tab (`target="_blank"` + `rel="noopener noreferrer"`)
- Tabelas com scroll horizontal (`overflow-x-auto`) e linhas alternadas
- Imagens com fade-in + placeholder cinzento + `loading="lazy"`
- Headings: h1=24px, h2=20px, h3=16px; h4-h6 invisíveis (estilo Discord)

## Componentes de Página (inline em `AppLayout.jsx`)

> Estes componentes estão definidos no ficheiro `resources/js/Pages/Communities/AppLayout.jsx` e não como ficheiros separados.

| Componente | Função |
|---|---|
| `ChannelSidebar` | Sidebar de canais (árvore categorias/canais, criar/editar/eliminar) |
| `ManageContent` | Container da secção "Gerir" com tabs internas |
| `MembersSection` | Secção de membros dentro de Gerir |
| `MembersTable` | Tabela com search, filtros, ordenação, multi-seleção |
| `RolesContent` | Gestão de cargos (criar/editar/eliminar) |

### MembersTable (AppLayout.jsx:820)

**Funcionalidades:**
- **Search:** Input com ícone Search, filtra por nome/email
- **Filtros:** Dropdown único "Filtros" → submenu lateral com checkboxes (Cargos / Planos)
- **Tags removíveis:** Clicar na tag remove o filtro
- **Ordenação:** Clique nas colunas Nome, Email, Cargo, Plano, Membro desde (asc/desc + indicadores ↑↓)
- **Multi-seleção:** Checkbox por linha, select-all no cabeçalho, barra de acções (contagem, "Remover selecionados", "Limpar seleção")
- **Linhas seleccionadas:** Fundo indigo subtil `bg-indigo-50`/`dark:bg-indigo-900/20`
- **Owner:** Não seleccionável (opacidade reduzida, cursor not-allowed)

### ChannelSidebar (AppLayout.jsx:9)

- Dropdown header com nome da comunidade
- Secção "Canais" com botão `+` (owner) e gear para gerir
- Lista de categorias (colapsáveis) com canais dentro
- Canais sem categoria em "Outros"
- Context menu (right-click) para owner editar/eliminar
- Inline creation inputs

### ManageContent (AppLayout.jsx:450)

Renderiza `ManageSidebar` (tabs) + conteúdo:
- `settings` → `SettingsSection`
- `channels` → `ChannelsSection`
- `members` → `MembersSection`
- `danger` → `DangerSection`

## Componentes de Página (outros)

| Componente | Localização | Função |
|---|---|---|
| `PlansSidebar` | `AppLayout.jsx` | Sidebar de planos (Gerir/Alterar/Cancelar) |
| `MembersSidebar` | `AppLayout.jsx` | Sidebar de membros (Membros/Cargos) |
| `ManageSidebar` | `AppLayout.jsx` | Sidebar de gestão (Definições/Canais/Membros/Zona Perigo) |

## UI

| Componente | Ficheiro | Função |
|---|---|---|
| `Modal` | `Components/Modal.jsx` | Modal genérico |
| `Dropdown` | `Components/Dropdown.jsx` | Menu dropdown |
| `PrimaryButton` | `Components/PrimaryButton.jsx` | Botão primário (violet) |
| `SecondaryButton` | `Components/SecondaryButton.jsx` | Botão secundário |
| `DangerButton` | `Components/DangerButton.jsx` | Botão de perigo |
| `InputError` | `Components/InputError.jsx` | Mensagem de erro de input |
| `InputLabel` | `Components/InputLabel.jsx` | Label de input |
| `TextInput` | `Components/TextInput.jsx` | Input de texto |
| `Checkbox` | `Components/Checkbox.jsx` | Checkbox |
| `NavLink` | `Components/NavLink.jsx` | Link de navegação |
| `Sidebar` | `Components/Sidebar.jsx` | Sidebar genérica |
