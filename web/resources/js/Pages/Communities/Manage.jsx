import { useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import { ChevronLeft, Plus, Trash2, Hash, FileText, GripVertical, Users, Shield, Crown } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'

export default function Manage({ community, initialTab }) {
    const [activeTab, setActiveTab] = useState(initialTab ?? 'settings')

    const tabs = [
        { key: 'settings', label: 'Definições' },
        { key: 'plans', label: 'Planos' },
        { key: 'channels', label: 'Canais' },
        { key: 'members', label: 'Membros' },
        { key: 'danger', label: 'Zona de Perigo' },
    ]

    return (
        <>
            <Head title={`Gerir — ${community.name}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-[#1e1f22]">
                <GhotaNavbar community={community} />

                <div className="max-w-4xl mx-auto px-5 pt-20 pb-24">
                    <Link
                        href={route('communities.show', community.slug)}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar para {community.name}
                    </Link>

                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">Gerir Comunidade</h1>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-8 overflow-x-auto">
                        {tabs.map((tab) => (
                                <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                                    activeTab === tab.key
                                        ? 'bg-white dark:bg-[#2b2d31] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-[#1e1f22]'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#35373c]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'settings' && <SettingsSection community={community} />}
                    {activeTab === 'plans' && <PlansSection community={community} />}
                    {activeTab === 'channels' && <ChannelsSection community={community} />}
                    {activeTab === 'members' && <MembersSection community={community} />}
                    {activeTab === 'danger' && <DangerSection community={community} />}
                </div>
            </div>
        </>
    )
}

function SettingsSection({ community }) {
    const { data, setData, put, processing, errors } = useForm({
        name: community.name ?? '',
        description: community.description ?? '',
        is_visible: community.is_visible ?? true,
    })

    const submit = (e) => {
        e.preventDefault()
        put(route('communities.update', community.slug))
    }

    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Definições Gerais</h2>
            <form onSubmit={submit} className="space-y-5 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome da comunidade</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none text-gray-900 dark:text-white"
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.is_visible}
                        onChange={(e) => setData('is_visible', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Comunidade pública (visível na página de descoberta)</span>
                </label>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition"
                >
                    {processing ? 'A guardar…' : 'Guardar alterações'}
                </button>
            </form>
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
        name: community.name,
        description: community.description,
        is_visible: community.is_visible ?? true,
    })

    const addPlan = () => {
        setPlans([...plans, { name: '', price: '0', description: '', is_free: plans.length === 0 }])
    }

    const removePlan = (i) => {
        if (plans.length <= 1) return
        setPlans(plans.filter((_, idx) => idx !== i))
    }

    const updatePlan = (i, field, value) => {
        const updated = [...plans]
        updated[i] = { ...updated[i], [field]: value }
        if (field === 'is_free' && value) {
            updated[i].price = '0'
        }
        setPlans(updated)
    }

    const submit = (e) => {
        e.preventDefault()
        const payload = {
            ...data,
            plans: plans.map(p => ({
                ...(p.id ? { id: p.id } : {}),
                name: p.name,
                price: p.price,
                description: p.description,
                is_free: p.is_free,
            })),
        }
        put(route('communities.update', community.slug), payload)
    }

    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Planos / Preçário</h2>
                <button
                    type="button"
                    onClick={addPlan}
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                >
                    <Plus className="w-4 h-4" /> Adicionar plano
                </button>
            </div>
            <form onSubmit={submit} className="space-y-4">
                {plans.map((plan, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Plano {i + 1}</span>
                            {plans.length > 1 && (
                                <button type="button" onClick={() => removePlan(i)} className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => updatePlan(i, 'name', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                                    placeholder="Ex: Mensal"
                                />
                            </div>
                            <div className="w-28">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={plan.price}
                                    onChange={(e) => updatePlan(i, 'price', e.target.value)}
                                    disabled={plan.is_free}
                                    className="w-full px-3 py-2 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-[#232428] disabled:text-gray-400 text-gray-900 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            value={plan.description}
                            onChange={(e) => updatePlan(i, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                            placeholder="Descrição do plano (opcional)"
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={plan.is_free}
                                onChange={(e) => updatePlan(i, 'is_free', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Plano gratuito
                        </label>
                    </div>
                ))}
                {errors['plans.0.name'] && <p className="text-xs text-red-500">Preenche todos os planos corretamente.</p>}
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition"
                >
                    {processing ? 'A guardar…' : 'Guardar planos'}
                </button>
            </form>
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
        router.post(route('channels.store'), {
            name: newName.trim(),
            type: newType,
            community_id: community.id,
        })
        setNewName('')
    }

    const startEdit = (channel) => {
        setEditingId(channel.id)
        setEditName(channel.name)
    }

    const saveEdit = (channel) => {
        if (!editName.trim()) return
        router.put(route('channels.update', channel.id), {
            name: editName.trim(),
            type: channel.type,
        })
        setEditingId(null)
    }

    const deleteChannel = (channel) => {
        if (confirm(`Tens a certeza que queres eliminar o canal #${channel.name}?`)) {
            router.delete(route('channels.destroy', channel.id))
        }
    }

    const channels = community.channels ?? []

    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Canais</h2>

            {/* Add channel */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome do novo canal"
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && addChannel()}
                />
                <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="px-3 py-2.5 bg-gray-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                >
                    <option value="text">Texto</option>
                    <option value="page">Página</option>
                </select>
                <button
                    onClick={addChannel}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar
                </button>
            </div>

            {/* Channel list */}
            <div className="space-y-1">
                {channels.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">Nenhum canal ainda.</p>
                )}
                {channels.map((channel, i) => (
                    <div
                        key={channel.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#35373c] transition group"
                    >
                        <span className="text-gray-300 dark:text-gray-500">
                            <GripVertical className="w-4 h-4" />
                        </span>
                        <span className="text-gray-400 shrink-0">
                            {channel.type === 'page' ? <FileText className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                        </span>
                        {editingId === channel.id ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-white dark:bg-[#1e1f22] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEdit(channel)
                                    if (e.key === 'Escape') setEditingId(null)
                                }}
                                onBlur={() => saveEdit(channel)}
                            />
                        ) : (
                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {channel.name}
                                <span className="ml-2 text-[10px] text-gray-400 uppercase">
                                    {channel.type === 'page' ? 'Página' : 'Texto'}
                                </span>
                            </span>
                        )}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            {editingId !== channel.id && (
                                <button
                                    onClick={() => startEdit(channel)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={() => deleteChannel(channel)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function MembersSection({ community }) {
    const members = community.members ?? []

    const removeMember = (user) => {
        if (confirm(`Tens a certeza que queres remover ${user.name} da comunidade?`)) {
            router.delete(route('communities.members.remove', [community.slug, user.id]))
        }
    }

    const roleIcon = (role) => {
        switch (role) {
            case 'owner': return <Crown className="w-4 h-4 text-amber-500" />
            case 'admin': return <Shield className="w-4 h-4 text-indigo-500" />
            default: return <Users className="w-4 h-4 text-gray-400" />
        }
    }

    const roleLabel = (role) => {
        switch (role) {
            case 'owner': return 'Owner'
            case 'admin': return 'Admin'
            default: return 'Membro'
        }
    }

    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Membros ({members.length})</h2>

            <div className="space-y-1">
                {members.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">Nenhum membro ainda.</p>
                )}
                {members.map((membership) => (
                    <div
                        key={membership.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#35373c] transition group"
                    >
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {membership.user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '??'}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{membership.user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{membership.user?.email}</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            {roleIcon(membership.role)}
                            {roleLabel(membership.role)}
                        </span>
                        {membership.role !== 'owner' && (
                            <button
                                onClick={() => removeMember(membership.user)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function DangerSection({ community }) {
    const [confirmDelete, setConfirmDelete] = useState('')
    const { delete: destroy, processing } = useForm()

    const deleteCommunity = () => {
        if (confirmDelete !== community.name) return
        destroy(route('communities.destroy', community.slug))
    }

    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
            <h2 className="text-lg font-bold text-red-600 mb-2">Zona de Perigo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Apagar a comunidade é uma ação irreversível. Todos os canais, mensagens e membros serão perdidos.
            </p>
            <div className="space-y-3 max-w-sm">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Escreve <span className="font-bold text-red-600">{community.name}</span> para confirmares
                </label>
                <input
                    type="text"
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                    placeholder={community.name}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                />
                <button
                    onClick={deleteCommunity}
                    disabled={processing || confirmDelete !== community.name}
                    className="w-full px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    {processing ? 'A apagar…' : 'Apagar comunidade'}
                </button>
            </div>
        </div>
    )
}
