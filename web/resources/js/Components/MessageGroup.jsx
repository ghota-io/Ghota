import { useState, useRef, useEffect } from 'react'
import { format } from '@/time'
import { Pencil, Trash2, X, Check } from 'lucide-react'

export default function MessageGroup({ group, currentUserId, onEdit, onDelete }) {
    const firstMessage = group.messages[0]
    const isSingle = group.messages.length === 1

    if (isSingle) {
        const msg = firstMessage
        return (
            <MessageRow
                message={msg}
                user={group.user}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                showHeader={true}
            />
        )
    }

    return (
        <div className="py-0.5 hover:bg-white/[0.02] px-5">
            <div className="flex items-start gap-3">
                <div className="w-10 shrink-0 flex justify-center pt-0.5">
                    <UserAvatar user={group.user} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-white/90 hover:underline cursor-pointer">
                            {group.user.name}
                        </span>
                        <span className="text-[11px] text-white/30">
                            {format(firstMessage.created_at)}
                        </span>
                    </div>
                    {group.messages.map((msg) => (
                        <MessageRow
                            key={msg.id}
                            message={msg}
                            user={group.user}
                            currentUserId={currentUserId}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            showHeader={false}
                            nested
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function MessageRow({ message, user, currentUserId, onEdit, onDelete, showHeader, nested }) {
    const [editing, setEditing] = useState(false)
    const [editContent, setEditContent] = useState(message.content)
    const [saving, setSaving] = useState(false)
    const inputRef = useRef(null)
    const isAuthor = currentUserId === user.id

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [editing])

    const handleStartEdit = () => {
        setEditContent(message.content)
        setEditing(true)
    }

    const handleCancelEdit = () => {
        setEditing(false)
        setEditContent(message.content)
    }

    const handleSaveEdit = async () => {
        const text = editContent.trim()
        if (!text || text === message.content) {
            setEditing(false)
            return
        }
        setSaving(true)
        try {
            await onEdit(message.id, text)
            setEditing(false)
        } finally {
            setSaving(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSaveEdit()
        }
        if (e.key === 'Escape') {
            handleCancelEdit()
        }
    }

    const handleDelete = () => {
        if (!confirm('Tens a certeza que queres eliminar esta mensagem?')) return
        onDelete(message.id)
    }

    if (nested) {
        if (editing) {
            return (
                <div className="group py-0.5 px-5">
                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            className="flex-1 bg-[#1a0038] text-white text-sm px-3 py-2 rounded-lg outline-none border border-[#6C3BFF]/50 resize-none min-h-[60px] placeholder-white/30"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim() || saving}
                            className="flex items-center gap-1.5 text-xs font-medium bg-[#6C3BFF] text-white px-3 py-1.5 rounded-md hover:bg-[#7d4fff] disabled:opacity-50 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="group py-0.5 pr-5 relative hover:bg-white/[0.02]">
                <div className="text-sm text-white/80 whitespace-pre-wrap break-words pr-16">
                    {message.content}
                </div>
                {isAuthor && (
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-[#0d0026] rounded-md border border-white/10 shadow-lg transition-opacity">
                        <button
                            onClick={handleStartEdit}
                            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            title="Editar mensagem"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Eliminar mensagem"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        )
    }

    if (editing) {
        return (
            <div className="flex items-start gap-3 pt-0.5 group py-0.5 px-5">
                {showHeader && <UserAvatar user={user} />}
                {!showHeader && <div className="w-10 shrink-0" />}
                <div className="flex-1 min-w-0">
                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            className="flex-1 bg-[#1a0038] text-white text-sm px-3 py-2 rounded-lg outline-none border border-[#6C3BFF]/50 resize-none min-h-[60px] placeholder-white/30"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim() || saving}
                            className="flex items-center gap-1.5 text-xs font-medium bg-[#6C3BFF] text-white px-3 py-1.5 rounded-md hover:bg-[#7d4fff] disabled:opacity-50 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-start gap-3 group py-0.5 px-5 relative hover:bg-white/[0.02] pt-0.5">
            {showHeader && <UserAvatar user={user} />}
            {!showHeader && <div className="w-10 shrink-0" />}
            <div className="flex-1 min-w-0 relative">
                {showHeader && (
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-white/90 hover:underline cursor-pointer">
                            {user.name}
                        </span>
                        <span className="text-[11px] text-white/30">
                            {format(message.created_at)}
                        </span>
                    </div>
                )}
                <div className="text-sm text-white/80 whitespace-pre-wrap break-words mt-0.5 pr-16">
                    {message.content}
                </div>

                {isAuthor && (
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-[#0d0026] rounded-md border border-white/10 shadow-lg transition-opacity">
                        <button
                            onClick={handleStartEdit}
                            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            title="Editar mensagem"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Eliminar mensagem"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function UserAvatar({ user }) {
    const initials = user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
            {initials}
        </div>
    )
}
