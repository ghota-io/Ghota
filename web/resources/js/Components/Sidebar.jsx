import { useState, useRef, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Hash, FileText, Plus, ChevronDown, ChevronRight, MoreVertical, Pencil, Trash2, X, Check } from 'lucide-react'

export default function Sidebar({
    community,
    currentChannel,
    collapsedCategories,
    toggleCategory,
    navigateToChannel,
    isOwner,
}) {
    const [contextMenu, setContextMenu] = useState(null)
    const [editingChannelId, setEditingChannelId] = useState(null)
    const [editingCategoryId, setEditingCategoryId] = useState(null)
    const [editName, setEditName] = useState('')
    const [creatingForCategory, setCreatingForCategory] = useState(null)
    const [newChannelName, setNewChannelName] = useState('')
    const [creatingCategory, setCreatingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    const contextRef = useRef(null)
    const editInputRef = useRef(null)
    const createInputRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (contextRef.current && !contextRef.current.contains(e.target)) {
                setContextMenu(null)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        if (editingChannelId || editingCategoryId) {
            editInputRef.current?.focus()
            editInputRef.current?.select()
        }
    }, [editingChannelId, editingCategoryId])

    useEffect(() => {
        if (creatingForCategory !== null || creatingCategory) {
            createInputRef.current?.focus()
        }
    }, [creatingForCategory, creatingCategory])

    const handleContextMenu = (e, type, item) => {
        e.preventDefault()
        e.stopPropagation()
        setContextMenu({ x: e.clientX, y: e.clientY, type, item })
    }

    const startEditChannel = (channel) => {
        setEditingChannelId(channel.id)
        setEditName(channel.name)
        setContextMenu(null)
    }

    const startEditCategory = (category) => {
        setEditingCategoryId(category.id)
        setEditName(category.name)
        setContextMenu(null)
    }

    const saveEditChannel = (channel) => {
        const name = editName.trim().replace(/\s+/g, '-')
        if (!name || name === channel.name) {
            setEditingChannelId(null)
            return
        }
        router.put(route('channels.update', channel.id), { name }, {
            preserveState: true,
            onSuccess: () => setEditingChannelId(null),
            onError: () => setEditingChannelId(null),
        })
    }

    const saveEditCategory = (category) => {
        const name = editName.trim()
        if (!name || name === category.name) {
            setEditingCategoryId(null)
            return
        }
        router.put(route('categories.update', category.id), { name }, {
            preserveState: true,
            onSuccess: () => setEditingCategoryId(null),
            onError: () => setEditingCategoryId(null),
        })
    }

    const deleteChannel = (channel) => {
        if (!confirm(`Tens a certeza que queres eliminar o canal #${channel.name}?`)) return
        router.delete(route('channels.destroy', channel.id), {
            preserveState: true,
        })
        setContextMenu(null)
    }

    const deleteCategory = (category) => {
        if (!confirm(`Tens a certeza que queres eliminar a categoria "${category.name}" e todos os seus canais?`)) return
        router.delete(route('categories.destroy', category.id), {
            preserveState: true,
        })
        setContextMenu(null)
    }

    const createChannel = (categoryId) => {
        const name = newChannelName.trim().replace(/\s+/g, '-')
        if (!name) {
            setCreatingForCategory(null)
            setNewChannelName('')
            return
        }
        router.post(route('channels.store'), {
            name,
            type: 'text',
            community_id: community.id,
            category_id: categoryId,
        }, {
            preserveState: true,
            onSuccess: () => {
                setCreatingForCategory(null)
                setNewChannelName('')
            },
            onError: () => {
                setCreatingForCategory(null)
                setNewChannelName('')
            },
        })
    }

    const createCategory = () => {
        const name = newCategoryName.trim()
        if (!name) {
            setCreatingCategory(false)
            setNewCategoryName('')
            return
        }
        router.post(route('categories.store'), {
            name,
            community_id: community.id,
        }, {
            preserveState: true,
            onSuccess: () => {
                setCreatingCategory(false)
                setNewCategoryName('')
            },
            onError: () => {
                setCreatingCategory(false)
                setNewCategoryName('')
            },
        })
    }

    const handleBlurCreateChannel = (categoryId) => {
        setTimeout(() => {
            if (newChannelName.trim()) {
                createChannel(categoryId)
            } else {
                setCreatingForCategory(null)
                setNewChannelName('')
            }
        }, 200)
    }

    const handleBlurCreateCategory = () => {
        setTimeout(() => {
            if (newCategoryName.trim()) {
                createCategory()
            } else {
                setCreatingCategory(false)
                setNewCategoryName('')
            }
        }, 200)
    }

    const categories = community.categories || []

    const uncategorizedChannels = (community.channels || []).filter(
        ch => !ch.category_id
    )

    return (
        <aside className="w-60 shrink-0 bg-[#0d0026] flex flex-col overflow-hidden border-r border-white/5">
            <div className="h-12 flex items-center px-4 border-b border-white/5 shrink-0">
                <span className="text-sm font-semibold text-white/80 truncate">
                    {community.name}
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                {/* Quick links */}
                <div className="space-y-0.5 mb-3">
                    <SidebarLink
                        icon={<SettingsIcon />}
                        label="Gerir"
                        href={route('communities.manage', community.slug)}
                        active={false}
                    />
                    <SidebarLink
                        icon={<UsersIcon />}
                        label="Membros"
                        href="#"
                        active={false}
                    />
                    <SidebarLink
                        icon={<Hash className="w-4 h-4" />}
                        label="Canais"
                        href={route('communities.channel', [community.slug, currentChannel?.name])}
                        active={true}
                    />
                    {community.plans?.length > 1 && (
                        <SidebarLink
                            icon={<CreditCardIcon />}
                            label="Planos"
                            href="#"
                            active={false}
                        />
                    )}
                </div>

                <div className="h-px bg-white/5 mx-2 mb-2" />

                {/* Categories */}
                {categories.map((cat) => {
                    const isCollapsed = collapsedCategories[cat.id]
                    const channels = cat.channels || []
                    const isActiveInCategory = channels.some(ch => ch.id === currentChannel?.id)

                    return (
                        <div key={cat.id} className="mb-1">
                            <div
                                className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none
                                    ${isActiveInCategory ? 'text-white/70' : 'text-white/40'}
                                    hover:text-white/70`}
                                onClick={() => toggleCategory(cat.id)}
                                onContextMenu={isOwner ? (e) => handleContextMenu(e, 'category', cat) : undefined}
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="w-3 h-3 shrink-0" />
                                ) : (
                                    <ChevronDown className="w-3 h-3 shrink-0" />
                                )}
                                <span className="truncate">{cat.name}</span>

                                {isOwner && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCreatingForCategory(cat.id) }}
                                        className="ml-auto opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/70 transition-opacity"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {!isCollapsed && (
                                <div className="ml-1 space-y-0.5">
                                    {channels.map((ch) => {
                                        const isActive = ch.id === currentChannel?.id

                                        if (editingChannelId === ch.id) {
                                            return (
                                                <div key={ch.id} className="flex items-center gap-1 px-2 py-1">
                                                    <span className="text-white/40 text-xs">
                                                        {ch.type === 'page' ? '📄' : '#'}
                                                    </span>
                                                    <input
                                                        ref={editInputRef}
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value.replace(/\s+/g, '-'))}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveEditChannel(ch)
                                                            if (e.key === 'Escape') setEditingChannelId(null)
                                                        }}
                                                        onBlur={() => saveEditChannel(ch)}
                                                        className="flex-1 bg-[#1a0038] text-white text-sm px-1.5 py-0.5 rounded outline-none border border-[#6C3BFF]/50"
                                                    />
                                                    <button onClick={() => setEditingChannelId(null)} className="text-white/30 hover:text-white/70">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={() => saveEditChannel(ch)} className="text-green-400 hover:text-green-300">
                                                        <Check className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        }

                                        return (
                                            <button
                                                key={ch.id}
                                                onClick={() => navigateToChannel(ch)}
                                                onContextMenu={isOwner ? (e) => handleContextMenu(e, 'channel', ch) : undefined}
                                                className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors text-left
                                                    ${isActive
                                                        ? 'bg-[#6C3BFF]/20 text-white font-medium'
                                                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                                                    }`}
                                            >
                                                <span className="w-4 text-center shrink-0 text-xs">
                                                    {ch.type === 'page' ? '📄' : '#'}
                                                </span>
                                                <span className="truncate">{ch.name}</span>
                                            </button>
                                        )
                                    })}

                                    {creatingForCategory === cat.id && (
                                        <div className="flex items-center gap-1 px-2 py-1">
                                            <span className="text-white/40 text-xs">#</span>
                                            <input
                                                ref={createInputRef}
                                                value={newChannelName}
                                                onChange={(e) => setNewChannelName(e.target.value.replace(/\s+/g, '-'))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') createChannel(cat.id)
                                                    if (e.key === 'Escape') { setCreatingForCategory(null); setNewChannelName('') }
                                                }}
                                                onBlur={() => handleBlurCreateChannel(cat.id)}
                                                placeholder="novo-canal"
                                                className="flex-1 bg-[#1a0038] text-white text-sm px-1.5 py-0.5 rounded outline-none border border-[#6C3BFF]/50 placeholder-white/20"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Uncategorized channels (legacy support) */}
                {uncategorizedChannels.length > 0 && (
                    <div className="mb-1">
                        <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                            <span className="truncate">Outros</span>
                        </div>
                        <div className="ml-1 space-y-0.5">
                            {uncategorizedChannels.map((ch) => {
                                const isActive = ch.id === currentChannel?.id
                                return (
                                    <button
                                        key={ch.id}
                                        onClick={() => navigateToChannel(ch)}
                                        onContextMenu={isOwner ? (e) => handleContextMenu(e, 'channel', ch) : undefined}
                                        className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors text-left
                                            ${isActive
                                                ? 'bg-[#6C3BFF]/20 text-white font-medium'
                                                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="w-4 text-center shrink-0 text-xs">
                                            {ch.type === 'page' ? '📄' : '#'}
                                        </span>
                                        <span className="truncate">{ch.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* New category button (owner only) */}
                {isOwner && !creatingCategory && (
                    <button
                        onClick={() => setCreatingCategory(true)}
                        className="flex items-center gap-1.5 w-full px-2 py-1.5 text-sm text-white/30 hover:text-white/60 transition-colors mt-2"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Nova categoria
                    </button>
                )}

                {creatingCategory && (
                    <div className="flex items-center gap-1 px-2 py-1 mt-1">
                        <input
                            ref={createInputRef}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') createCategory()
                                if (e.key === 'Escape') { setCreatingCategory(false); setNewCategoryName('') }
                            }}
                            onBlur={() => handleBlurCreateCategory()}
                            placeholder="Nome da categoria"
                            className="flex-1 bg-[#1a0038] text-white text-sm px-1.5 py-0.5 rounded outline-none border border-[#6C3BFF]/50 placeholder-white/20"
                        />
                    </div>
                )}
            </nav>

            {/* Context menu */}
            {contextMenu && (
                <div
                    ref={contextRef}
                    className="fixed z-[100] w-48 bg-[#1a0040] rounded-xl border border-white/10 shadow-2xl shadow-black/40 py-1.5"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {contextMenu.type === 'channel' && (
                        <>
                            <button
                                onClick={() => startEditChannel(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                            >
                                <Pencil className="w-4 h-4 text-white/40" />
                                Editar canal
                            </button>
                            <button
                                onClick={() => deleteChannel(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar canal
                            </button>
                        </>
                    )}
                    {contextMenu.type === 'category' && (
                        <>
                            <button
                                onClick={() => startEditCategory(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                            >
                                <Pencil className="w-4 h-4 text-white/40" />
                                Editar categoria
                            </button>
                            <button
                                onClick={() => setCreatingForCategory(contextMenu.item.id)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                            >
                                <Plus className="w-4 h-4 text-white/40" />
                                Novo canal
                            </button>
                            <div className="h-px bg-white/5 my-1 mx-4" />
                            <button
                                onClick={() => deleteCategory(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar categoria
                            </button>
                        </>
                    )}
                </div>
            )}
        </aside>
    )
}

function SidebarLink({ icon, label, href, active }) {
    return (
        <a
            href={href}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                ${active ? 'bg-[#6C3BFF]/20 text-white font-medium' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
        >
            <span className="w-4 h-4 shrink-0 flex items-center justify-center text-current">
                {icon}
            </span>
            <span>{label}</span>
        </a>
    )
}

function SettingsIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    )
}

function UsersIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

function CreditCardIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    )
}
