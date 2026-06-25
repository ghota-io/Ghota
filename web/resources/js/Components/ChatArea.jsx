import { useState, useEffect, useRef, useCallback } from 'react'
import { Hash, Loader2 } from 'lucide-react'
import MessageGroup from '@/Components/MessageGroup'
import MessageInput from '@/Components/MessageInput'
import { initEcho } from '@/bootstrap'

export default function ChatArea({ channel, messages: initialMessages, user, community }) {
    const [messages, setMessages] = useState(initialMessages || [])
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef(null)
    const channelIdRef = useRef(channel.id)
    const isOwner = user?.id === community.owner_id

    useEffect(() => {
        setMessages(initialMessages || [])
        setLoading(false)
        channelIdRef.current = channel.id
    }, [channel.id])

    useEffect(() => {
        if (scrollRef.current && messages.length > 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages.length])

    useEffect(() => {
        if (loading) return

        let cancelled = false
        let channel = null

        initEcho().then(() => {
            if (cancelled || !window.Echo) return

            const channelName = `chat.${channelIdRef.current}`

            channel = window.Echo.channel(channelName)
            channel.listen('.message.sent', (data) => {
                setMessages(prev => {
                    if (prev.some(m => m.id === data.id)) return prev
                    return [...prev, data]
                })
            })
        })

        return () => {
            cancelled = true
            if (channel) {
                window.Echo.leave(`chat.${channelIdRef.current}`)
            }
        }
    }, [channel.id, loading])

    const handleSend = useCallback(async (content) => {
        const optimisticId = -Date.now()
        const tempMessage = {
            id: optimisticId,
            channel_id: channel.id,
            user_id: user.id,
            content,
            created_at: new Date().toISOString(),
            user: {
                id: user.id,
                name: user.name,
            },
        }

        setMessages(prev => [...prev, tempMessage])

        try {
            const res = await window.axios.post(`/canais/${channel.id}/mensagens`, { content })
            const saved = res.data

            setMessages(prev => prev.map(m => m.id === optimisticId ? saved : m))
        } catch {
            setMessages(prev => prev.filter(m => m.id !== optimisticId))
        }
    }, [channel.id, user])

    const handleEdit = useCallback(async (messageId, content) => {
        const res = await window.axios.put(`/canais/${channel.id}/mensagens/${messageId}`, { content })
        const updated = res.data
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: updated.content } : m))
    }, [channel.id])

    const handleDelete = useCallback(async (messageId) => {
        await window.axios.delete(`/canais/${channel.id}/mensagens/${messageId}`)
        setMessages(prev => prev.filter(m => m.id !== messageId))
    }, [channel.id])

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0a001a]">
                <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
            </div>
        )
    }

    const hasMessages = messages.length > 0

    const groupedMessages = hasMessages ? groupMessages(messages) : []

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Channel header */}
            <div className="shrink-0 h-12 flex items-center gap-2 px-5 border-b border-white/5">
                <Hash className="w-5 h-5 text-white/40" />
                <span className="text-base font-semibold text-white/90">{channel.name}</span>
            </div>

            {/* Messages area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto py-4 scrollbar-thin"
            >
                {!hasMessages ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                        <div className="w-16 h-16 rounded-full bg-[#1a0038] flex items-center justify-center mb-4">
                            <Hash className="w-7 h-7 text-white/20" />
                        </div>
                        <h3 className="text-lg font-semibold text-white/60 mb-1">
                            Nenhuma mensagem ainda
                        </h3>
                        <p className="text-sm text-white/30 max-w-md">
                            Sê o primeiro a escrever em <strong className="text-white/50">#{channel.name}</strong>!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {groupedMessages.map((group) => (
                            <MessageGroup
                                key={group.messages[0].id}
                                group={group}
                                currentUserId={user?.id}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Message input */}
            {channel.type === 'text' && (
                <MessageInput channel={channel} onSend={handleSend} />
            )}
        </div>
    )
}

function groupMessages(messages) {
    const groups = []

    for (const msg of messages) {
        const lastGroup = groups[groups.length - 1]

        if (lastGroup && lastGroup.user.id === msg.user_id) {
            const lastMsg = lastGroup.messages[lastGroup.messages.length - 1]
            const lastTime = new Date(lastMsg.created_at).getTime()
            const thisTime = new Date(msg.created_at).getTime()
            const diffMinutes = (thisTime - lastTime) / 1000 / 60

            if (diffMinutes < 5) {
                lastGroup.messages.push(msg)
                continue
            }
        }

        groups.push({
            user: msg.user,
            messages: [msg],
        })
    }

    return groups
}
