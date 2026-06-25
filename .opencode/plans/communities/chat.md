# Chat — Main Area

## Estrutura

```
┌─────────────────────────────────────────────┐
│  # canal-nome                           ▲   │ header fixo
├─────────────────────────────────────────────┤
│  [avatar] Nome  · 14:30                     │
│  Mensagem de texto aqui                     │
│                                             │
│  [avatar] Outro  · 14:31                    │
│  Outra mensagem                             │
│  E mais uma do mesmo user (agrupada)        │
│                                             │
│  ...                                        │ scroll
│                                             │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │ Mensagem para # canal...        [➤]  │  │ input fixo
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Comportamento

| Ação | Comportamento |
|---|---|
| Abrir canal | Mostra últimas 50 mensagens, scroll to bottom |
| Enviar mensagem | POST /canais/{channel}/mensagens, optimistic update |
| Polling | GET /canais/{channel}/mensagens?after={lastId} a cada 2s |
| Canal text vs page | text → chat view; page → conteúdo formatado |
| Canal vazio | "Nenhuma mensagem ainda. Sê o primeiro a escrever!" |

## Mensagens agrupadas

Mensagens consecutivas do mesmo user agrupam-se:
- Primeira: avatar + nome + hora + mensagem
- Seguintes: só mensagem (sem avatar/nome)

## Atualização de dados

- Ao mudar de canal (via sidebar), Inertia atualiza as props `channel` e
  `messages` — a ChatArea recebe as novas props e re-renderiza
- Polling de mensagens faz fetch direto (não Inertia), sem afetar a sidebar
- Mensagens enviadas via `fetch()` POST com optimistic update — a ChatArea
  atualiza localmente sem qualquer viagem Inertia
- O efeito `useEffect(() => setMessages(initialMessages), [channel.id])`
  sincroniza as mensagens quando o canal muda

## Estados

- **Loading**: spinner enquanto carrega mensagens
- **Empty**: texto informativo
- **Sending**: input desativado, mensagem aparece com opacidade
- **Error**: toast/notificação se falhar envio

## Ficheiros

- `web/resources/js/Components/ChatArea.jsx`
- `web/resources/js/Components/MessageGroup.jsx`
- `web/resources/js/Components/MessageInput.jsx`
