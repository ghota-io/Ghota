import { useState, useRef, useEffect } from 'react'
import { Head, Link, router, usePage, useForm } from '@inertiajs/react'
import { Hash, FileText, Plus, ChevronDown, ChevronRight, Pencil, Trash2, X, Check, ChevronsUpDown, Settings, Users, Shield, Crown, MoreHorizontal, Compass, Folder } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import ActivityBar from '@/Components/ActivityBar'
import ChatArea from '@/Components/ChatArea'
import MessageInput from '@/Components/MessageInput'

function ChannelSidebar({ community, currentChannel, isOwner }) {
    const [collapsedCategories, setCollapsedCategories] = useState({})
    const [contextMenu, setContextMenu] = useState(null)
    const [editingChannelId, setEditingChannelId] = useState(null)
    const [editingCategoryId, setEditingCategoryId] = useState(null)
    const [editName, setEditName] = useState('')
    const [creatingForCategory, setCreatingForCategory] = useState(null)
    const [newChannelName, setNewChannelName] = useState('')
    const [creatingCategory, setCreatingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false)
    const contextRef = useRef(null)
    const editInputRef = useRef(null)
    const createInputRef = useRef(null)
    const communityDropdownRef = useRef(null)
    const { myCommunities } = usePage().props

    useEffect(() => {
        const handler = (e) => {
            if (contextRef.current && !contextRef.current.contains(e.target)) setContextMenu(null)
            if (communityDropdownRef.current && !communityDropdownRef.current.contains(e.target)) setCommunityDropdownOpen(false)
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

    const navigateToChannel = (ch) => {
        router.get(route('communities.app', [community.slug, 'canais', ch.name]), {}, {
            preserveState: true,
            preserveScroll: false,
        })
    }

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
        if (!name || name === channel.name) { setEditingChannelId(null); return }
        router.put(route('channels.update', channel.id), { name }, {
            preserveState: true,
            onSuccess: () => setEditingChannelId(null),
            onError: () => setEditingChannelId(null),
        })
    }

    const saveEditCategory = (category) => {
        const name = editName.trim()
        if (!name || name === category.name) { setEditingCategoryId(null); return }
        router.put(route('categories.update', category.id), { name }, {
            preserveState: true,
            onSuccess: () => setEditingCategoryId(null),
            onError: () => setEditingCategoryId(null),
        })
    }

    const getAllChannels = () => {
        const result = []
        for (const cat of categories) {
            for (const ch of (cat.channels || [])) {
                result.push(ch)
            }
        }
        result.push(...uncategorizedChannels)
        return result
    }

    const deleteChannel = (channel) => {
        if (!confirm(`Tens a certeza que queres eliminar o canal #${channel.name}?`)) return
        const isCurrent = channel.id === currentChannel?.id
        const fallback = isCurrent ? getAllChannels().filter(ch => ch.id !== channel.id)[0] : null
        router.delete(route('channels.destroy', channel.id), {
            preserveState: true,
            onSuccess: () => {
                if (isCurrent && fallback) {
                    navigateToChannel(fallback)
                }
            }
        })
        setContextMenu(null)
    }

    const deleteCategory = (category) => {
        if (!confirm(`Tens a certeza que queres eliminar a categoria "${category.name}"?`)) return
        const isCurrentInCategory = currentChannel && currentChannel.category_id === category.id
        const fallback = isCurrentInCategory ? getAllChannels().filter(ch => ch.category_id !== category.id)[0] : null
        router.delete(route('categories.destroy', category.id), {
            preserveState: true,
            onSuccess: () => {
                if (isCurrentInCategory && fallback) {
                    navigateToChannel(fallback)
                }
            }
        })
        setContextMenu(null)
    }

    const createChannel = (categoryId) => {
        const name = newChannelName.trim().replace(/\s+/g, '-')
        if (!name) { setCreatingForCategory(null); setNewChannelName(''); return }
        router.post(route('channels.store'), { name, type: 'text', community_id: community.id, category_id: categoryId }, {
            preserveState: true,
            onSuccess: () => { setCreatingForCategory(null); setNewChannelName('') },
            onError: () => { setCreatingForCategory(null); setNewChannelName('') },
        })
    }

    const createCategory = () => {
        const name = newCategoryName.trim()
        if (!name) { setCreatingCategory(false); setNewCategoryName(''); return }
        router.post(route('categories.store'), { name, community_id: community.id }, {
            preserveState: true,
            onSuccess: () => { setCreatingCategory(false); setNewCategoryName('') },
            onError: () => { setCreatingCategory(false); setNewCategoryName('') },
        })
    }

    const handleBlurCreateChannel = (categoryId) => {
        setTimeout(() => {
            if (newChannelName.trim()) createChannel(categoryId)
            else { setCreatingForCategory(null); setNewChannelName('') }
        }, 200)
    }

    const handleBlurCreateCategory = () => {
        setTimeout(() => {
            if (newCategoryName.trim()) createCategory()
            else { setCreatingCategory(false); setNewCategoryName('') }
        }, 200)
    }

    const categories = community.categories || []
    const uncategorizedChannels = (community.channels || []).filter(ch => !ch.category_id)

    return (
        <aside className="w-60 shrink-0 bg-white dark:bg-[#232428] flex flex-col overflow-hidden border-r border-gray-200 dark:border-[#1e1f22]">
            <div className="h-12 flex items-center px-3 border-b border-gray-200 dark:border-[#1e1f22] shrink-0 relative" ref={communityDropdownRef}>
                <button onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)} className="flex items-center gap-1.5 w-full text-left cursor-pointer group">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{community.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0 transition" />
                </button>
                {communityDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-[200] bg-white dark:bg-[#2b2d31] rounded-xl border border-gray-200 dark:border-[#1e1f22] shadow-lg py-2 max-h-80 overflow-y-auto">
                        <Link href={route('dashboard')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition" onClick={() => setCommunityDropdownOpen(false)}>
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Dashboard
                        </Link>
                        <Link href={route('communities.index')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition" onClick={() => setCommunityDropdownOpen(false)}>
                            <Compass className="w-4 h-4 text-gray-400" />
                            Descobrir Comunidades
                        </Link>
                        <div className="h-px bg-gray-100 dark:bg-[#1e1f22] my-1.5 mx-4" />
                        <p className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">As minhas comunidades</p>
                        {(myCommunities ?? []).length === 0 && (
                            <p className="px-4 py-2 text-xs text-gray-400">Nenhuma comunidade.</p>
                        )}
                        {(myCommunities ?? []).map((c) => (
                            <Link key={c.id} href={route('communities.app', [c.slug, 'canais'])} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition rounded-lg mx-2" onClick={() => setCommunityDropdownOpen(false)}>
                                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                                    {c.name?.charAt(0) ?? '?'}
                                </span>
                                <span className="truncate">{c.name}</span>
                            </Link>
                        ))}
                        <div className="h-px bg-gray-100 dark:bg-[#1e1f22] my-1.5 mx-4" />
                        <Link href={route('communities.create')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-[#35373c] transition" onClick={() => setCommunityDropdownOpen(false)}>
                            <Plus className="w-4 h-4" />
                            Criar Comunidade
                        </Link>
                    </div>
                )}
            </div>
            {isOwner && (
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-[#1e1f22] shrink-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Canais</span>
                    <div className="flex items-center gap-0.5">
                        <button onClick={() => { setCreatingCategory(true); setCreatingForCategory(null) }} title="Nova Categoria"
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] rounded-md transition">
                            <Folder className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => {
                            const catId = currentChannel?.category_id
                            if (catId) { setCreatingForCategory(catId); setCreatingCategory(false) }
                            else { setCreatingCategory(true); setCreatingForCategory(null) }
                        }} title="Novo Canal"
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] rounded-md transition">
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                        <Link href={route('communities.app', [community.slug, 'gerir', 'channels'])} title="Gerir Canais"
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] rounded-md transition">
                            <Settings className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            )}
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                {categories.map((cat) => {
                    const isCollapsed = collapsedCategories[cat.id]
                    const channels = cat.channels || []
                    const isActiveInCategory = channels.some(ch => ch.id === currentChannel?.id)
                    return (
                        <div key={cat.id} className="mb-1">
                            <div
                                className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none ${isActiveInCategory ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} hover:text-gray-700 dark:hover:text-gray-200`}
                                onClick={() => setCollapsedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                                onContextMenu={isOwner ? (e) => handleContextMenu(e, 'category', cat) : undefined}
                            >
                                {isCollapsed ? <ChevronRight className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
                                <span className="truncate">{cat.name}</span>
                                {isOwner && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCreatingForCategory(cat.id) }}
                                        className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
                                    ><Plus className="w-3.5 h-3.5" /></button>
                                )}
                            </div>
                            {!isCollapsed && (
                                <div className="ml-1 space-y-0.5">
                                    {channels.map((ch) => {
                                        const isActive = ch.id === currentChannel?.id
                                        if (editingChannelId === ch.id) {
                                            return (
                                                <div key={ch.id} className="flex items-center gap-1 px-2 py-1">
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs">{ch.type === 'page' ? '📄' : '#'}</span>
                                                    <input ref={editInputRef} value={editName} onChange={(e) => setEditName(e.target.value.replace(/\s+/g, '-'))}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') saveEditChannel(ch); if (e.key === 'Escape') setEditingChannelId(null) }}
                                                        onBlur={() => saveEditChannel(ch)}
                                                        className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-1.5 py-0.5 rounded outline-none border border-violet-400/50" />
                                                    <button onClick={() => setEditingChannelId(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-3 h-3" /></button>
                                                    <button onClick={() => saveEditChannel(ch)} className="text-emerald-500 hover:text-emerald-400"><Check className="w-3 h-3" /></button>
                                                </div>
                                            )
                                        }
                                        return (
                                            <button key={ch.id} onClick={() => navigateToChannel(ch)}
                                                onContextMenu={isOwner ? (e) => handleContextMenu(e, 'channel', ch) : undefined}
                                                className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors text-left ${isActive ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'}`}
                                            >
                                                <span className="w-4 text-center shrink-0 text-xs">{ch.type === 'page' ? '📄' : '#'}</span>
                                                <span className="truncate">{ch.name}</span>
                                            </button>
                                        )
                                    })}
                                    {creatingForCategory === cat.id && (
                                        <div className="flex items-center gap-1 px-2 py-1">
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">#</span>
                                            <input ref={createInputRef} value={newChannelName}
                                                onChange={(e) => setNewChannelName(e.target.value.replace(/\s+/g, '-'))}
                                                onKeyDown={(e) => { if (e.key === 'Enter') createChannel(cat.id); if (e.key === 'Escape') { setCreatingForCategory(null); setNewChannelName('') } }}
                                                onBlur={() => handleBlurCreateChannel(cat.id)}
                                                placeholder="novo-canal"
                                                className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-1.5 py-0.5 rounded outline-none border border-violet-400/50 placeholder-gray-400 dark:placeholder-gray-500" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
                {uncategorizedChannels.length > 0 && (
                    <div className="mb-1">
                        <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"><span className="truncate">Outros</span></div>
                        <div className="ml-1 space-y-0.5">
                            {uncategorizedChannels.map((ch) => {
                                const isActive = ch.id === currentChannel?.id
                                return (
                                    <button key={ch.id} onClick={() => navigateToChannel(ch)}
                                        onContextMenu={isOwner ? (e) => handleContextMenu(e, 'channel', ch) : undefined}
                                        className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors text-left ${isActive ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'}`}
                                    >
                                        <span className="w-4 text-center shrink-0 text-xs">{ch.type === 'page' ? '📄' : '#'}</span>
                                        <span className="truncate">{ch.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
                {creatingCategory && (
                    <div className="flex items-center gap-1 px-2 py-1 mt-1">
                        <input ref={createInputRef} value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') createCategory(); if (e.key === 'Escape') { setCreatingCategory(false); setNewCategoryName('') } }}
                            onBlur={() => handleBlurCreateCategory()}
                            placeholder="Nome da categoria"
                            className="flex-1 bg-gray-100 dark:bg-[#1e1f22] text-gray-900 dark:text-white text-sm px-1.5 py-0.5 rounded outline-none border border-violet-400/50 placeholder-gray-400 dark:placeholder-gray-500" />
                    </div>
                )}
            </nav>
            {contextMenu && (
                <div ref={contextRef}
                    className="fixed z-[100] w-48 bg-white dark:bg-[#2b2d31] rounded-xl border border-gray-200 dark:border-[#1e1f22] shadow-lg py-1.5"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {contextMenu.type === 'channel' && (
                        <>
                            <button onClick={() => startEditChannel(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition">
                                <Pencil className="w-4 h-4 text-gray-400" /> Editar canal
                            </button>
                            <button onClick={() => deleteChannel(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                <Trash2 className="w-4 h-4" /> Eliminar canal
                            </button>
                        </>
                    )}
                    {contextMenu.type === 'category' && (
                        <>
                            <button onClick={() => startEditCategory(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition">
                                <Pencil className="w-4 h-4 text-gray-400" /> Editar categoria
                            </button>
                            <button onClick={() => setCreatingForCategory(contextMenu.item.id)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition">
                                <Plus className="w-4 h-4 text-gray-400" /> Novo canal
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-[#1e1f22] my-1 mx-4" />
                            <button onClick={() => deleteCategory(contextMenu.item)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                <Trash2 className="w-4 h-4" /> Eliminar categoria
                            </button>
                        </>
                    )}
                </div>
            )}
        </aside>
    )
}

function ManageSidebar({ community, activeTab, onTabChange }) {
    const tabs = [
        { key: 'settings', label: 'Definições' },
        { key: 'plans', label: 'Planos' },
        { key: 'channels', label: 'Canais' },
        { key: 'members', label: 'Membros' },
        { key: 'danger', label: 'Zona de Perigo' },
    ]

    return (
        <aside className="w-60 shrink-0 bg-white dark:bg-[#232428] flex flex-col overflow-hidden border-r border-gray-200 dark:border-[#1e1f22]">
            <div className="h-12 flex items-center px-4 border-b border-gray-200 dark:border-[#1e1f22] shrink-0">
                <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Gerir Comunidade</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>
    )
}

function MembersSidebar({ community, activeSub, onSubChange }) {
    const members = community.members ?? []
    const items = [
        { key: 'lista', label: 'Membros', count: members.length },
        { key: 'cargos', label: 'Cargos' },
    ]
    return (
        <aside className="w-60 shrink-0 bg-white dark:bg-[#232428] flex flex-col overflow-hidden border-r border-gray-200 dark:border-[#1e1f22]">
            <div className="h-12 flex items-center px-4 border-b border-gray-200 dark:border-[#1e1f22] shrink-0">
                <Users className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Membros</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                {items.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onSubChange(item.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeSub === item.key
                                ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'
                        }`}
                    >
                        {item.key === 'lista' ? <Users className="w-4 h-4 shrink-0" /> : <Shield className="w-4 h-4 shrink-0" />}
                        <span className="truncate">{item.label}</span>
                        {item.count !== undefined && (
                            <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">{item.count}</span>
                        )}
                    </button>
                ))}
            </nav>
        </aside>
    )
}

function PlansSidebar({ community }) {
    const plans = community.plans ?? []
    return (
        <aside className="w-60 shrink-0 bg-white dark:bg-[#232428] flex flex-col overflow-hidden border-r border-gray-200 dark:border-[#1e1f22]">
            <div className="h-12 flex items-center px-4 border-b border-gray-200 dark:border-[#1e1f22] shrink-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Planos</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-2">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-gray-50 dark:bg-[#1e1f22] rounded-xl px-4 py-3">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                        <p className="text-lg font-extrabold text-violet-600 dark:text-violet-400 mt-1">
                            {plan.is_free ? 'Grátis' : `${plan.price}€`}
                            {!plan.is_free && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal"> /mês</span>}
                        </p>
                        {plan.description && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    )
}

function ManageContent({ community, initialTab, isOwner }) {
    const [activeTab, setActiveTab] = useState(initialTab ?? 'settings')

    const updateUrlTab = (tab) => {
        setActiveTab(tab)
        router.get(route('communities.app', [community.slug, 'gerir', tab]), {}, {
            preserveState: true,
            preserveScroll: false,
        })
    }

    return (
        <div className="flex-1 flex">
            <ManageSidebar community={community} activeTab={activeTab} onTabChange={updateUrlTab} />
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#1e1f22]">
                {activeTab === 'settings' && <SettingsSection community={community} />}
                {activeTab === 'plans' && <PlansSection community={community} />}
                {activeTab === 'channels' && <ChannelsSection community={community} />}
                {activeTab === 'members' && <MembersSection community={community} isOwner={isOwner} />}
                {activeTab === 'danger' && <DangerSection community={community} />}
            </main>
        </div>
    )
}

function SettingsSection({ community }) {
    const { data, setData, put, processing, errors } = useForm({
        name: community.name ?? '',
        description: community.description ?? '',
        is_visible: community.is_visible ?? true,
        is_private: community.is_private ?? false,
    })
    const submit = (e) => { e.preventDefault(); put(route('communities.update', community.slug)) }
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Definições Gerais</h2>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white" />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white resize-none" />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={data.is_visible} onChange={(e) => setData('is_visible', e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Comunidade pública (visível na página de descoberta)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={data.is_private} onChange={(e) => setData('is_private', e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Comunidade privada (só acede com código de convite)</span>
                    </label>
                    {community.code && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Código de convite</label>
                            <div className="flex items-center gap-2">
                                <code className="px-4 py-2.5 bg-gray-100 dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-xl text-sm font-mono text-gray-900 dark:text-white select-all">{community.code}</code>
                                <button type="button" onClick={() => navigator.clipboard.writeText(community.code)} className="px-3 py-2.5 text-sm text-indigo-600 hover:text-indigo-500 font-medium transition">Copiar</button>
                            </div>
                        </div>
                    )}
                    <button type="submit" disabled={processing} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition">
                        {processing ? 'A guardar…' : 'Guardar alterações'}
                    </button>
                </form>
            </div>
        </div>
    )
}

function PlansSection({ community }) {
    const [plans, setPlans] = useState(
        community.plans?.length
            ? community.plans.map(p => ({ id: p.id, name: p.name, price: String(p.price), description: p.description ?? '', is_free: p.is_free }))
            : [{ name: 'Gratuito', price: '0', description: 'Acesso gratuito', is_free: true }]
    )
    const { data, setData, put, processing, errors } = useForm({
        name: community.name, description: community.description,
        is_visible: community.is_visible ?? true, is_private: community.is_private ?? false,
    })
    const addPlan = () => setPlans([...plans, { name: '', price: '0', description: '', is_free: plans.length === 0 }])
    const removePlan = (i) => { if (plans.length <= 1) return; setPlans(plans.filter((_, idx) => idx !== i)) }
    const updatePlan = (i, field, value) => {
        const updated = [...plans]; updated[i] = { ...updated[i], [field]: value }
        if (field === 'is_free' && value) updated[i].price = '0'
        setPlans(updated)
    }
    const submit = (e) => {
        e.preventDefault()
        put(route('communities.update', community.slug), {
            ...data, plans: plans.map(p => ({ ...(p.id ? { id: p.id } : {}), name: p.name, price: p.price, description: p.description, is_free: p.is_free }))
        })
    }
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Planos / Preçário</h2>
                    <button type="button" onClick={addPlan} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"><Plus className="w-4 h-4" /> Adicionar plano</button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    {plans.map((plan, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Plano {i + 1}</span>
                                {plans.length > 1 && <button type="button" onClick={() => removePlan(i)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input type="text" value={plan.name} onChange={(e) => updatePlan(i, 'name', e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white" placeholder="Ex: Mensal" />
                                </div>
                                <div className="w-28">
                                    <input type="number" step="0.01" min="0" value={plan.price} onChange={(e) => updatePlan(i, 'price', e.target.value)} disabled={plan.is_free}
                                        className="w-full px-3 py-2 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100 dark:disabled:bg-[#232428] disabled:text-gray-400 text-gray-900 dark:text-white" placeholder="0.00" />
                                </div>
                            </div>
                            <input type="text" value={plan.description} onChange={(e) => updatePlan(i, 'description', e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white" placeholder="Descrição (opcional)" />
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                <input type="checkbox" checked={plan.is_free} onChange={(e) => updatePlan(i, 'is_free', e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                Plano gratuito
                            </label>
                        </div>
                    ))}
                    {errors['plans.0.name'] && <p className="text-xs text-red-500">{errors['plans.0.name']}</p>}
                    <button type="submit" disabled={processing} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition">
                        {processing ? 'A guardar…' : 'Guardar planos'}
                    </button>
                </form>
            </div>
        </div>
    )
}

function ChannelsSection({ community }) {
    const [newName, setNewName] = useState('')
    const [newType, setNewType] = useState('text')
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const addChannel = () => {
        if (!newName.trim()) return
        router.post(route('channels.store'), { name: newName.trim(), type: newType, community_id: community.id })
        setNewName('')
    }
    const startEdit = (ch) => { setEditingId(ch.id); setEditName(ch.name) }
    const saveEdit = (ch) => {
        if (!editName.trim()) return
        router.put(route('channels.update', ch.id), { name: editName.trim(), type: ch.type })
        setEditingId(null)
    }
    const deleteChannel = (ch) => {
        if (confirm(`Tens a certeza que queres eliminar o canal #${ch.name}?`)) router.delete(route('channels.destroy', ch.id))
    }
    const channels = community.channels ?? []
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Canais</h2>
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-[#1e1f22]">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do novo canal"
                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && addChannel()} />
                    <select value={newType} onChange={(e) => setNewType(e.target.value)}
                        className="px-3 py-2.5 bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white">
                        <option value="text">Texto</option><option value="page">Página</option>
                    </select>
                    <button onClick={addChannel} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"><Plus className="w-4 h-4" /> Adicionar</button>
                </div>
                <div className="space-y-1">
                    {channels.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Nenhum canal ainda.</p>}
                    {channels.map((ch) => (
                        <div key={ch.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#35373c] transition group">
                            <span className="text-gray-400 shrink-0">{ch.type === 'page' ? <FileText className="w-4 h-4" /> : <Hash className="w-4 h-4" />}</span>
                            {editingId === ch.id ? (
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white"
                                    autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(ch); if (e.key === 'Escape') setEditingId(null) }}
                                    onBlur={() => saveEdit(ch)} />
                            ) : (
                                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium">{ch.name}</span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                {editingId !== ch.id && <button onClick={() => startEdit(ch)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"><Pencil className="w-3.5 h-3.5" /></button>}
                                <button onClick={() => deleteChannel(ch)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function MembersSection({ community, isOwner }) {
    const members = community.members ?? []
    const removeMember = (user) => {
        if (confirm(`Tens a certeza que queres remover ${user.name} da comunidade?`)) router.delete(route('communities.members.remove', [community.slug, user.id]))
    }
    const roleIcon = (role) => {
        switch (role) { case 'owner': return <Crown className="w-4 h-4 text-amber-500" />; case 'admin': return <Shield className="w-4 h-4 text-indigo-500" />; default: return <Users className="w-4 h-4 text-gray-400" /> }
    }
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Membros ({members.length})</h2>
                <div className="space-y-1">
                    {members.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Nenhum membro ainda.</p>}
                    {members.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#35373c] transition group">
                            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {m.user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '??'}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{m.user?.email}</p>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">{roleIcon(m.role)}{m.role === 'owner' ? 'Owner' : m.role === 'admin' ? 'Admin' : 'Membro'}</span>
                            {isOwner && m.role !== 'owner' && (
                                <button onClick={() => removeMember(m.user)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function DangerSection({ community }) {
    const [confirmDelete, setConfirmDelete] = useState('')
    const { delete: destroy, processing } = useForm()
    const deleteCommunity = () => { if (confirmDelete !== community.name) return; destroy(route('communities.destroy', community.slug)) }
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
                <h2 className="text-lg font-bold text-red-600 mb-2">Zona de Perigo</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Apagar a comunidade é uma ação irreversível.</p>
                <div className="space-y-3 max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escreve <span className="font-bold text-red-600">{community.name}</span> para confirmares</label>
                    <input type="text" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} placeholder={community.name}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-400" />
                    <button onClick={deleteCommunity} disabled={processing || confirmDelete !== community.name}
                        className="w-full px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
                        {processing ? 'A apagar…' : 'Apagar comunidade'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function MembersTable({ members, isOwner, community, roles }) {
    const [openDropdown, setOpenDropdown] = useState(null)
    const [changingRole, setChangingRole] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(null)
                setChangingRole(null)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const removeMember = (user) => {
        if (confirm(`Tens a certeza que queres remover ${user.name} da comunidade?`)) {
            router.delete(route('communities.members.remove', [community.slug, user.id]))
        }
        setOpenDropdown(null)
    }

    const changeRole = (user, roleId) => {
        router.put(route('communities.members.role', [community.slug, user.id]), {
            community_role_id: roleId,
        }, { preserveState: true })
        setOpenDropdown(null)
        setChangingRole(null)
    }

    const availRoles = roles ?? []

    const timeAgo = (date) => {
        if (!date) return ''
        const now = new Date()
        const then = new Date(date)
        const diffMs = now - then
        const seconds = Math.floor(diffMs / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        if (seconds < 60) return 'Há poucos segundos'
        if (minutes < 60) return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
        if (hours < 24) return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`
        if (days < 30) return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`
        if (months < 12) return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`
        return `Há ${years} ${years === 1 ? 'ano' : 'anos'}`
    }

    return (
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-[#1e1f22] flex flex-col">
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#2b2d31] border-b border-gray-200 dark:border-[#1e1f22]">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1e1f22] shrink-0">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Membros ({members.length})</h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white dark:bg-[#2b2d31]">
                                <tr className="border-b border-gray-100 dark:border-[#1e1f22]">
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Nome</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Email</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Cargo</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Membro desde</th>
                                    {isOwner && (
                                        <th className="text-right px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Opções</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#1e1f22]">
                                {members.length === 0 && (
                                    <tr>
                                        <td colSpan={isOwner ? 5 : 4} className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                                            Nenhum membro ainda.
                                        </td>
                                    </tr>
                                )}
                                {members.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-[#35373c] transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                                    {m.user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '??'}
                                                </span>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{m.user?.name}</span>
                                                    {m.role === 'owner' && (
                                                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                            <Crown className="w-3 h-3" /> Owner
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{m.user?.email}</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                                                {m.role === 'owner' ? (
                                                    <><Crown className="w-3.5 h-3.5 text-amber-500" /> Owner</>
                                                ) : (
                                                    m.community_role_name
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{timeAgo(m.joined_at)}</td>
                                        {isOwner && (
                                            <td className="px-6 py-3 text-right">
                                                {m.role !== 'owner' && (
                                                    <div className="relative inline-block">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === m.id ? null : m.id); setChangingRole(null) }}
                                                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#35373c] transition"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                        {openDropdown === m.id && (
                                                            <div ref={dropdownRef}
                                                                className="absolute right-0 top-full mt-1 z-[100] w-52 bg-white dark:bg-[#2b2d31] rounded-xl border border-gray-200 dark:border-[#1e1f22] shadow-lg py-1.5"
                                                            >
                                                                <button
                                                                    onClick={() => setChangingRole(changingRole === m.id ? null : m.id)}
                                                                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                                                                >
                                                                    <Shield className="w-4 h-4 text-gray-400" /> Alterar cargo
                                                                </button>
                                                                {changingRole === m.id && (
                                                                    <div className="border-t border-gray-100 dark:border-[#1e1f22] pt-1 mt-1 mx-2 space-y-0.5">
                                                                        {availRoles.map((r) => (
                                                                            <button key={r.id}
                                                                                onClick={() => changeRole(m.user, r.id)}
                                                                                className={`w-full text-left px-4 py-1.5 rounded-lg text-sm transition ${
                                                                                    m.community_role_id === r.id
                                                                                        ? 'text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-500/10'
                                                                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#35373c]'
                                                                                }`}
                                                                            >
                                                                                {r.name} {r.is_default && <span className="text-[10px] text-gray-400 ml-1">(padrão)</span>}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="h-px bg-gray-200 dark:bg-[#1e1f22] my-1 mx-4" />
                                                                <button
                                                                    onClick={() => removeMember(m.user)}
                                                                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Remover membro
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}

function RolesContent({ community, isOwner }) {
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [editPerms, setEditPerms] = useState({})
    const [newName, setNewName] = useState('')
    const roles = community.roles ?? []

    const permissionLabels = {
        manage_roles: 'Gerir Cargos',
        manage_members: 'Gerir Membros',
        manage_messages: 'Gerir Mensagens',
        manage_plans: 'Gerir Planos',
        manage_categories: 'Gerir Categorias',
        manage_channels: 'Gerir Canais',
    }

    const allPermissions = Object.keys(permissionLabels)

    const startEdit = (role) => {
        setEditingId(role.id)
        setEditName(role.name)
        setEditPerms(role.permissions ?? {})
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditName('')
        setEditPerms({})
    }

    const saveRole = (role) => {
        if (!editName.trim()) return
        router.put(route('communities.roles.update', [community.slug, role.id]), {
            name: editName.trim(),
            permissions: editPerms,
        }, {
            preserveState: true,
            onSuccess: () => cancelEdit(),
        })
    }

    const createRole = () => {
        if (!newName.trim()) return
        router.post(route('communities.roles.store', community.slug), {
            name: newName.trim(),
            permissions: {},
        }, {
            preserveState: true,
            onSuccess: () => setNewName(''),
        })
    }

    const deleteRole = (role) => {
        if (!confirm(`Tens a certeza que queres eliminar o cargo "${role.name}"?`)) return
        router.delete(route('communities.roles.destroy', [community.slug, role.id]), {
            preserveState: true,
            onSuccess: () => {},
        })
    }

    const togglePerm = (perm) => {
        setEditPerms(prev => ({ ...prev, [perm]: !prev[perm] }))
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#1e1f22]">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {isOwner && (
                    <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Novo Cargo</h3>
                        <div className="flex items-center gap-3">
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ex: Moderador"
                                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white"
                                onKeyDown={(e) => e.key === 'Enter' && createRole()} />
                            <button onClick={createRole}
                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                                Criar
                            </button>
                        </div>
                    </div>
                )}

                {roles.length === 0 && (
                    <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-12 text-center">
                        <Shield className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum cargo definido ainda.</p>
                    </div>
                )}

                {roles.map((role) => (
                    <div key={role.id} className={`bg-white dark:bg-[#2b2d31] rounded-2xl border overflow-hidden ${
                        role.is_default ? 'border-indigo-200 dark:border-indigo-900/50' : 'border-gray-200 dark:border-[#1e1f22]'
                    }`}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e1f22] flex items-center justify-between">
                            {editingId === role.id ? (
                                <div className="flex items-center gap-3 flex-1">
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                        className="px-3 py-1.5 bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white"
                                        autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveRole(role); if (e.key === 'Escape') cancelEdit() }} />
                                    <button onClick={() => saveRole(role)} className="text-emerald-600 hover:text-emerald-500 text-sm font-semibold">Guardar</button>
                                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-500 text-sm">Cancelar</button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{role.name}</h3>
                                        {role.is_default && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
                                                Padrão
                                            </span>
                                        )}
                                    </div>
                                    {isOwner && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => startEdit(role)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            {!role.is_default && (
                                                <button onClick={() => deleteRole(role)} className="text-xs text-gray-400 hover:text-red-500 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        {editingId === role.id ? (
                            <div className="p-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Permissões</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {allPermissions.map((perm) => (
                                        <label key={perm} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1e1f22] hover:bg-gray-100 dark:hover:bg-[#35373c] transition cursor-pointer">
                                            <input type="checkbox" checked={!!editPerms[perm]}
                                                onChange={() => togglePerm(perm)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{permissionLabels[perm]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {(role.permissions && Object.keys(role.permissions).filter(p => role.permissions[p]).length > 0
                                        ? Object.keys(role.permissions).filter(p => role.permissions[p])
                                        : []
                                    ).length === 0 ? (
                                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">Sem permissões</span>
                                    ) : (
                                        Object.keys(role.permissions).filter(p => role.permissions[p]).map((perm) => (
                                            <span key={perm} className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                {permissionLabels[perm] ?? perm}
                                            </span>
                                        ))
                                    )}
                                </div>
                                {role.is_default && (
                                    <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 italic">
                                        Cargo atribuído automaticamente a novos membros. Edita as permissões para definir o acesso padrão.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default function AppLayout({ community, section, channel, messages, initialTab, membersList, membersSub }) {
    const { auth } = usePage().props
    const user = auth?.user ?? null
    const isOwner = user?.id === community.owner_id

    return (
        <>
            <Head title={`${community.name} — ${section === 'canais' ? channel?.name : section === 'gerir' ? 'Gerir' : section === 'membros' ? 'Membros' : section === 'planos' ? 'Planos' : 'App'}`} />

            <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#1e1f22] overflow-hidden">
                <div className="flex flex-1 overflow-hidden">
                    <ActivityBar community={community} user={user} section={section} />

                    {section === 'canais' && (
                        <ChannelSidebar community={community} currentChannel={channel} isOwner={isOwner} />
                    )}
                    {section === 'membros' && (
                        <MembersSidebar community={community} activeSub={membersSub ?? 'lista'} onSubChange={(sub) => {
                            router.get(route('communities.app', [community.slug, 'membros', sub]), {}, { preserveState: true, preserveScroll: false })
                        }} />
                    )}
                    {section === 'planos' && <PlansSidebar community={community} />}

                    {section === 'canais' && channel && (
                        <main className="flex-1 flex flex-col min-w-0">
                            <ChatArea channel={channel} messages={messages ?? []} user={user} community={community} />
                        </main>
                    )}
                    {section === 'gerir' && (
                        <ManageContent community={community} initialTab={initialTab} isOwner={isOwner} />
                    )}
                    {section === 'membros' && membersSub === 'lista' && (
                        <MembersTable members={membersList ?? []} isOwner={isOwner} community={community} roles={community.roles ?? []} />
                    )}
                    {section === 'membros' && membersSub === 'cargos' && (
                        <RolesContent community={community} isOwner={isOwner} />
                    )}
                    {section === 'planos' && (
                        <main className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm bg-gray-50 dark:bg-[#1e1f22]">
                            Planos — em breve
                        </main>
                    )}
                </div>
            </div>
        </>
    )
}
