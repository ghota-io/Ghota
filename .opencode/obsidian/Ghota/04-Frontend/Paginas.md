# Páginas

> Localização: `resources/js/Pages/`

## Auth

| Página | Rota | Função |
|---|---|---|
| `Auth/Login.jsx` | `/login` | Login |
| `Auth/Register.jsx` | `/register` | Registo |
| `Auth/ForgotPassword.jsx` | `/forgot-password` | Recuperar password |
| `Auth/ResetPassword.jsx` | `/reset-password` | Reset password |
| `Auth/ConfirmPassword.jsx` | `/confirm-password` | Confirmar password |
| `Auth/VerifyEmail.jsx` | `/verify-email` | Verificar email |
| `Auth/VerifyCode.jsx` | `/verify-code` | Verificar código 2FA |

## Públicas

| Página | Rota | Função |
|---|---|---|
| `Public/Welcome.jsx` | `/` | Landing page |
| `Public/Pricing.jsx` | `/precos` | Preços |
| `Public/Customize.jsx` | `/precos/personalizar` | Personalizar preços |
| `Public/Features.jsx` | `/recursos` | Funcionalidades |
| `Public/Help.jsx` | `/ajuda` | Ajuda |
| `Public/Contact.jsx` | `/contacto` | Contacto |
| `Public/Privacy.jsx` | `/privacidade` | Privacidade |
| `Public/Terms.jsx` | `/termos` | Termos |

## Dashboard

| Página | Rota | Função |
|---|---|---|
| `Dashboard.jsx` | `/dashboard` | Dashboard do user (comunidades, subscrições, eventos) |
| `Calendar.jsx` | `/calendario` | Calendário de eventos |
| `Profile/Edit.jsx` | `/profile` | Editar perfil |

## Comunidades

| Página | Rota | Função |
|---|---|---|
| `Communities/Index.jsx` | `/comunidades` | Lista de comunidades |
| `Communities/Show.jsx` | `/comunidades/{community}` | Pré-visualização pública |
| `Communities/Create.jsx` | `/comunidades/criar` | Criar comunidade |
| `Communities/Manage.jsx` | `/comunidades/{community}/gerir` | Gestão (parcialmente substituído por AppLayout) |
| `Communities/Subscribe.jsx` | `/comunidades/{community}/entrar` | Formulário de entrada |
| `Communities/PaymentSuccess.jsx` | `/comunidades/{community}/pagamento-sucesso` | Polling pós-pagamento |

## App Interna

### `Communities/AppLayout.jsx` — Rota: `/comunidades/{community}/app/{section?}/{sub?}`

Página principal que monta toda a UI interna. Subpáginas renderizadas condicionalmente.

**Secções:**
| `section` | `sub` | Conteúdo |
|---|---|---|
| `canais` | — | `ChatArea` + `ChannelSidebar` |
| | `{canal}` | `ChatArea` com canal específico |
| `membros` | `lista` | `MembersTable` |
| | `cargos` | `RolesContent` |
| `planos` | `gerir` | `PlanManageContent` |
| | `alterar` | `PlanChangeContent` |
| | `cancelar` | `PlanCancelContent` |
| `gerir` | `settings` | `SettingsSection` |
| | `channels` | `ChannelsSection` |
| | `members` | `MembersSection` |
| | `danger` | `DangerSection` |

### `Communities/ShowChannel.jsx` — Rota: `/comunidades/{community}/c/{canal}`

Vista de canal individual (alternativa ao AppLayout).

## Preview (HTML estático)

| Ficheiro | Descrição |
|---|---|
| `preview/comunidade.html` | HTML estático para preview de comunidade |
| `preview/entrar-comunidade.html` | HTML estático para preview de join |
