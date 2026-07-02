# Decisões de Arquitectura (ADRs)

## ADR-001: Stripe Connect com Destination Charges

**Data:** 2026-07-01  
**Contexto:** A plataforma precisa de receber pagamentos dos membros e distribuir o valor (80% owner, 20% plataforma).

**Decisão:** Usar Stripe Connect Express com Destination Charges. `subscription_data.transfer_data.destination` aponta para `owner.stripe_connect_id`. A application fee de 20% é calculada no webhook `invoice.paid`.

**Consequências:**
- Owner precisa de onboarding Express (Stripe hosted UI, sem conta prévia)
- Account Link usa `account_onboarding` (Stripe rejeita `account_update` para contas sem `details_submitted`)
- Se owner não tem Connect configurado, membros não podem subscrever planos pagos

---

## ADR-002: Cargos e Planos Independentes

**Data:** 2026-07-01  
**Contexto:** Originalmente cargos tinham `is_default` e eram associados automaticamente a membros. Planos não estavam claramente separados de cargos.

**Decisão:** Separar completamente cargos (`community_roles`) de planos (`plans`). Cargos são criados manualmente pelo owner. Membros podem ter `community_role_id = null`.

**Consequências:**
- Removido `is_default` de `community_roles`
- Removido `role` de `memberships`, substituído por `is_owner` boolean
- Owner não pode mudar plano de membro — apenas o membro pode cancelar/alterar

---

## ADR-003: Tema localStorage + BD

**Data:** 2026-06-30  
**Contexto:** O tema (dark/light) precisa de persistir entre sessões sem latência.

**Decisão:** `localStorage` como fonte primária (imediato, sem round-trip). Sincronização para BD via fetch fire-and-forget.

**Consequências:**
- Toggle é instantâneo
- BD serve como fallback para novos dispositivos
- Sem bloqueio de UI para escrita na BD

---

## ADR-004: Scroll do Chat com useLayoutEffect

**Data:** 2026-07-02  
**Contexto:** O scroll para o fundo do chat falhava em F5/recarga, ao mudar de canal, e ao receber novas mensagens.

**Decisão:** Usar `useLayoutEffect` sem array de dependências para garantir execução síncrona após cada render. `hasScrolledRef` para scroll inicial (F5), `prevLengthRef` para detectar novas mensagens.

**Consequências:**
- Scroll correcto em: F5, mudança de canal, mensagens novas
- Não scrolla em edições/eliminações
- Sem dependência de mudança de props (mais robusto)

---

## ADR-005: react-markdown sem dangerouslySetInnerHTML

**Data:** 2026-07-02  
**Contexto:** Necessário renderizar markdown nas mensagens de chat sem risco de XSS.

**Decisão:** Usar `react-markdown` + `remark-gfm` + `remark-breaks`. Zero `dangerouslySetInnerHTML`.

**Consequências:**
- Seguro por omissão (XSS prevenido)
- `remark-breaks`: quebra de linha única vira `<br>`
- Links abrem em nova tab
- Código com botão "Copiar"
- Headings com tamanhos estilo Discord (h1=24px, h2=20px, h3=16px; h4-h6 invisíveis)

---

## ADR-006: Search/Filtros Client-side

**Data:** 2026-07-02  
**Contexto:** A lista de membros precisa de search, filtros e ordenação.

**Decisão:** Implementar 100% client-side com `useMemo`. Todos os membros já estão carregados via `membersList` prop.

**Consequências:**
- Zero queries extra ao servidor
- Resposta instantânea a filtros
- Menu único "Filtros" com submenus (Cargos/Planos) em vez de botões separados

---

## ADR-007: ChannelSidebar com Dropdown Unificado

**Data:** 2026-07-02  
**Contexto:** O botão "+" na sidebar de canais precisava de oferecer "Novo Canal" e "Nova Categoria".

**Decisão:** Substituir ícone Folder por um único botão "+" que abre dropdown com "Novo Canal" (ícone Hash) e "Nova Categoria" (ícone Folder).

---

## ADR-008: MessageInput como textarea

**Data:** 2026-07-02  
**Contexto:** O input de mensagens era um `<input>` single-line, impossibilitando mensagens multi-linha.

**Decisão:** Migrar para `<textarea>` com auto-grow via `scrollHeight`. Enter envia, Shift+Enter nova linha.

---

## ADR-009: Categorias como Tabela Separada

**Data:** 2026-06-22  
**Contexto:** Inicialmente canais tinham `type: 'text' | 'category'` e `parent_id` para hierarquia.

**Decisão:** Separar categorias numa tabela própria (`categories`). Canais pertencem a categorias via `category_id`.

**Consequências:**
- Categorias: `id`, `community_id`, `name`, `order`
- Canais: `id`, `community_id`, `category_id` (nullable FK), `name`, `type` (default 'text'), `order`
- Seeders criam 1 categoria ("Canais de texto") + 5 canais por comunidade

---

## ADR-010: Rotas em Português

**Data:** 2026-06-21  
**Contexto:** Definição de naming para URLs.

**Decisão:** Usar português nas rotas (`/canais/{channel}/mensagens`, `/comunidades/{community}/app/{section?}/{sub?}`) em vez de inglês.

**Consequências:**
- URLs amigáveis para o público-alvo lusófono
- Rotas internas da app (Inertia) usam `section` e `sub` em português: `canais`, `membros`, `planos`, `gerir`
