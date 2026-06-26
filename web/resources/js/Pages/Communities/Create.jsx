import { Head, Link, useForm } from '@inertiajs/react'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Create({ community }) {
    const isEditing = !!community

    const [plans, setPlans] = useState(
        community?.plans?.length
            ? community.plans.map(p => ({ id: p.id, name: p.name, price: String(p.price), description: p.description ?? '', is_free: p.is_free }))
            : [{ name: 'Gratuito', price: '0', description: 'Acesso gratuito a toda a comunidade', is_free: true }]
    )

    const { data, setData, post, put, processing, errors } = useForm({
        name: community?.name ?? '',
        description: community?.description ?? '',
        is_visible: community?.is_visible ?? true,
        is_private: community?.is_private ?? false,
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

        const payload = { ...data, plans: plans.map(p => ({
            ...(p.id ? { id: p.id } : {}),
            name: p.name,
            price: p.price,
            description: p.description,
            is_free: p.is_free,
        }))}

        if (isEditing) {
            put(route('communities.update', community.slug), payload)
        } else {
            post(route('communities.store'), payload)
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Editar Comunidade' : 'Criar Comunidade'} />

            <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#1e1f22] font-sans">
                <div className="max-w-2xl mx-auto px-5 py-10">
                    <Link
                        href={route('communities.index')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                    </Link>

                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
                        {isEditing ? 'Editar Comunidade' : 'Criar Nova Comunidade'}
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-[#2b2d31] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                                placeholder="Ex: Design Systems na Prática"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 bg-white dark:bg-[#2b2d31] border border-gray-300 dark:border-[#1e1f22] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none text-gray-900 dark:text-white"
                                placeholder="Descreve o propósito da tua comunidade..."
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>

                        {/* Plans */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Planos / Preçário</label>
                                <button
                                    type="button"
                                    onClick={addPlan}
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Adicionar plano
                                </button>
                            </div>

                            <div className="space-y-3">
                                {plans.map((plan, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-[#232428] border border-gray-200 dark:border-[#1e1f22] rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Plano {i + 1}</span>
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

                                        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <input
                                                type="checkbox"
                                                checked={plan.is_free}
                                                onChange={(e) => updatePlan(i, 'is_free', e.target.checked)}
                                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Plano gratuito
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors['plans.0.name'] && <p className="text-xs text-red-500 mt-1">Preenche todos os planos corretamente</p>}
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_visible"
                                checked={data.is_visible}
                                onChange={(e) => setData('is_visible', e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_visible" className="text-sm text-gray-700 dark:text-gray-300">
                                Comunidade pública (visível na página de descoberta)
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_private"
                                checked={data.is_private}
                                onChange={(e) => setData('is_private', e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_private" className="text-sm text-gray-700 dark:text-gray-300">
                                Comunidade privada (só acede com código de convite)
                            </label>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                            >
                                {isEditing ? 'Guardar Alterações' : 'Criar Comunidade'}
                            </button>
                            <Link
                                href={route('communities.index')}
                                className="px-6 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
