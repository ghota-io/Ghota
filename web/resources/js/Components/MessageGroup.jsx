import { useState, useRef, useEffect } from 'react'
import { format } from '@/time'
import { Pencil, Trash2, X, Check } from 'lucide-react'
import MarkdownRenderer from '@/Components/MarkdownRenderer'

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
        <div className="py-0.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] px-5">
            <div className="flex items-start gap-3">
                <div className="w-10 shrink-0 flex justify-center pt-0.5">
                    <UserAvatar user={group.user} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">
                            {group.user.name}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
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
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
        }
    }, [editing])

    const handleEditInput = (e) => {
        const el = e.currentTarget
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + 'px'
    }

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
                            onInput={handleEditInput}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-3 py-2 rounded-lg outline-none border border-violet-400/50 resize-none min-h-[36px] placeholder-gray-400 dark:placeholder-gray-500 overflow-hidden"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim() || saving}
                            className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 text-white px-3 py-1.5 rounded-md hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="group py-0.5 pr-5 relative hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <div className="pr-16">
                    <MarkdownRenderer content={message.content} />
                </div>
                {isAuthor && (
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-white dark:bg-[#2b2d31] rounded-md border border-gray-200 dark:border-[#1e1f22] shadow-lg transition-opacity">
                        <button
                            onClick={handleStartEdit}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] rounded-md transition-colors"
                            title="Editar mensagem"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
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
                            onInput={handleEditInput}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-3 py-2 rounded-lg outline-none border border-violet-400/50 resize-none min-h-[36px] placeholder-gray-400 dark:placeholder-gray-500 overflow-hidden"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim() || saving}
                            className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 text-white px-3 py-1.5 rounded-md hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
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
        <div className="flex items-start gap-3 group py-0.5 px-5 relative hover:bg-gray-50 dark:hover:bg-white/[0.02] pt-0.5">
            {showHeader && <UserAvatar user={user} />}
            {!showHeader && <div className="w-10 shrink-0" />}
            <div className="flex-1 min-w-0 relative">
                {showHeader && (
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">
                            {user.name}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
                            {format(message.created_at)}
                        </span>
                    </div>
                )}
                <div className="mt-0.5 pr-16">
                    <MarkdownRenderer content={message.content} />
                </div>

                {isAuthor && (
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-white dark:bg-[#2b2d31] rounded-md border border-gray-200 dark:border-[#1e1f22] shadow-lg transition-opacity">
                        <button
                            onClick={handleStartEdit}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] rounded-md transition-colors"
                            title="Editar mensagem"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
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
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
            {initials}
        </div>
    )
}
