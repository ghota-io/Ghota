import { useState, useRef, useEffect } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { Hash, FileText, Plus, ChevronDown, ChevronRight, Pencil, Trash2, X, Check, ChevronsUpDown } from 'lucide-react'

export default function Sidebar({
    community,
    currentChannel,
    collapsedCategories,
    toggleCategory,
    navigateToChannel,
    isOwner,
}) {
    const { myCommunities } = usePage().props
    const [switcherOpen, setSwitcherOpen] = useState(false)
    const switcherRef = useRef(null)
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
            if (switcherRef.current && !switcherRef.current.contains(e.target)) {
                setSwitcherOpen(false)
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
        <aside className="w-60 shrink-0 bg-white dark:bg-[#232428] flex flex-col overflow-hidden border-r border-gray-200 dark:border-[#1e1f22]">
            <div className="h-12 flex items-center px-3 border-b border-gray-200 dark:border-[#1e1f22] shrink-0 relative" ref={switcherRef}>
                <button
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="flex items-center gap-1.5 flex-1 min-w-0 text-left cursor-pointer"
                >
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {community.name}
                    </span>
                    <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
                </button>

                {switcherOpen && (
                    <div className="absolute left-2 top-full mt-1 w-56 rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] shadow-lg py-2 z-50">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            onClick={() => setSwitcherOpen(false)}
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link
                            href={route('communities.index')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            onClick={() => setSwitcherOpen(false)}
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            </svg>
                            Descobrir Comunidades
                        </Link>

                        {myCommunities?.length > 0 && (
                            <>
                                <div className="h-px bg-gray-100 dark:bg-[#1e1f22] my-2 mx-4" />
                                <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                    As minhas comunidades
                                </div>
                                {myCommunities.map((c) => (
                                    <Link
                                        key={c.id}
                                        href={route('communities.channel', [c.slug, 'geral'])}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                                        onClick={() => setSwitcherOpen(false)}
                                    >
                                        <span className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                            {c.name.charAt(0)}
                                        </span>
                                        <span className="truncate">{c.name}</span>
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                {/* Categories */}
                {categories.map((cat) => {
                    const isCollapsed = collapsedCategories[cat.id]
                    const channels = cat.channels || []
                    const isActiveInCategory = channels.some(ch => ch.id === currentChannel?.id)

                    return (
                        <div key={cat.id} className="mb-1">
                            <div
                                className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none
                                    ${isActiveInCategory ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}
                                    hover:text-gray-700 dark:hover:text-gray-200`}
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
                                        className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
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
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs">
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
                                                        className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-1.5 py-0.5 rounded outline-none border border-violet-400/50"
                                                    />
                                                    <button onClick={() => setEditingChannelId(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={() => saveEditChannel(ch)} className="text-emerald-500 hover:text-emerald-400">
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
                                                        ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 font-medium'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'
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
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">#</span>
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
                                                className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-1.5 py-0.5 rounded outline-none border border-violet-400/50 placeholder-gray-400 dark:placeholder-gray-500"
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
                        <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
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
                                                ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 font-medium'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'
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
                        className="flex items-center gap-1.5 w-full px-2 py-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-2"
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
                            className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-1.5 py-0.5 rounded outline-none border border-violet-400/50 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>
                )}
            </nav>

            {/* Context menu */}
            {contextMenu && (
                <div
                    ref={contextRef}
                    className="fixed z-[100] w-48 bg-white dark:bg-[#2b2d31] rounded-xl border border-gray-200 dark:border-[#1e1f22] shadow-lg py-1.5"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {contextMenu.type === 'channel' && (
                        <>
                            <button
                                onClick={() => startEditChannel(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            >
                                <Pencil className="w-4 h-4 text-gray-400" />
                                Editar canal
                            </button>
                            <button
                                onClick={() => deleteChannel(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
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
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            >
                                <Pencil className="w-4 h-4 text-gray-400" />
                                Editar categoria
                            </button>
                            <button
                                onClick={() => setCreatingForCategory(contextMenu.item.id)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            >
                                <Plus className="w-4 h-4 text-gray-400" />
                                Novo canal
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-[#1e1f22] my-1 mx-4" />
                            <button
                                onClick={() => deleteCategory(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
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
