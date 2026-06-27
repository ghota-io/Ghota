import { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Sliders, Check, Minus, Plus, Euro, ArrowRight } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'

const options = [
    {
        key: 'members',
        label: 'Membros',
        desc: 'Número máximo de membros na comunidade',
        base: 0,
        tiers: [
            { value: 25, label: '25', price: 0 },
            { value: 50, label: '50', price: 3 },
            { value: 100, label: '100', price: 5 },
            { value: 500, label: '500', price: 10 },
            { value: 2000, label: '2.000', price: 18 },
            { value: 10000, label: '10.000', price: 30 },
        ],
    },
    {
        key: 'textChannels',
        label: 'Canais de texto',
        desc: 'Número de canais de texto disponíveis',
        base: 5,
        tiers: [
            { value: 5, label: '5', price: 0 },
            { value: 10, label: '10', price: 2 },
            { value: 25, label: '25', price: 5 },
            { value: 50, label: '50', price: 8 },
            { value: 100, label: '100', price: 12 },
        ],
    },
    {
        key: 'categories',
        label: 'Categorias',
        desc: 'Categorias para organizar os canais',
        base: 3,
        tiers: [
            { value: 3, label: '3', price: 0 },
            { value: 10, label: '10', price: 2 },
            { value: 25, label: '25', price: 4 },
            { value: 50, label: '50', price: 7 },
        ],
    },
    {
        key: 'storage',
        label: 'Armazenamento',
        desc: 'Espaço para ficheiros e conteúdos',
        base: 0,
        tiers: [
            { value: 100, label: '100 MB', price: 0 },
            { value: 1024, label: '1 GB', price: 4 },
            { value: 10240, label: '10 GB', price: 8 },
            { value: 102400, label: '100 GB', price: 15 },
            { value: 512000, label: '500 GB', price: 25 },
        ],
    },
    {
        key: 'voiceChannels',
        label: 'Canais de voz',
        desc: 'Disponibilidade de canais de voz',
        base: 0,
        tiers: [
            { value: 0, label: 'Não', price: 0 },
            { value: 1, label: 'Sim', price: 5 },
        ],
    },
    {
        key: 'events',
        label: 'Eventos ao vivo',
        desc: 'Criação de eventos ao vivo na comunidade',
        base: 0,
        tiers: [
            { value: 0, label: 'Não', price: 0 },
            { value: 1, label: 'Sim', price: 5 },
        ],
    },
    {
        key: 'admins',
        label: 'Administradores',
        desc: 'Número de administradores permitidos',
        base: 1,
        tiers: [
            { value: 1, label: '1', price: 0 },
            { value: 3, label: '3', price: 3 },
            { value: 10, label: '10', price: 6 },
            { value: 25, label: '25', price: 10 },
        ],
    },
    {
        key: 'customDomain',
        label: 'Domínio personalizado',
        desc: 'Usar o teu próprio domínio',
        base: 0,
        tiers: [
            { value: 0, label: 'Não', price: 0 },
            { value: 1, label: 'Sim', price: 10 },
        ],
    },
    {
        key: 'api',
        label: 'API e Webhooks',
        desc: 'Acesso a API e webhooks para integrações',
        base: 0,
        tiers: [
            { value: 0, label: 'Não', price: 0 },
            { value: 1, label: 'Sim', price: 8 },
        ],
    },
]

const BASE_PRICE = 5

export default function Customize() {
    const [selections, setSelections] = useState(() =>
        Object.fromEntries(options.map(o => [o.key, o.base]))
    )

    const setTier = (key, value) => {
        setSelections(prev => ({ ...prev, [key]: value }))
    }

    const total = BASE_PRICE + options.reduce((sum, opt) => {
        const selectedValue = selections[opt.key]
        const tier = opt.tiers.find(t => t.value === selectedValue)
        return sum + (tier?.price ?? 0)
    }, 0)

    const getSelectedLabel = (opt) => {
        const tier = opt.tiers.find(t => t.value === selections[opt.key])
        return tier?.label ?? '-'
    }

    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Personalizar Plano — Ghota" />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#6C3BFF] opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#B46CFF] opacity-15 blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />
            </div>

            <GhotaNavbar landingStyle />

            <main className="relative pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center">
                            <Sliders className="w-5 h-5 text-[#B46CFF]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Personalizar plano</h1>
                            <p className="text-sm text-white/40 mt-0.5">Define os limites da tua comunidade e vê o preço em tempo real.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Options */}
                        <div className="lg:col-span-3 space-y-3">
                            {options.map((opt) => (
                                <div key={opt.key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="text-sm font-semibold">{opt.label}</h3>
                                            <p className="text-xs text-white/40 mt-0.5">{opt.desc}</p>
                                        </div>
                                        <span className="text-xs font-bold text-[#B46CFF] bg-[#B46CFF]/10 px-2.5 py-1 rounded-lg">
                                            {getSelectedLabel(opt)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {opt.tiers.map((tier) => {
                                            const isActive = selections[opt.key] === tier.value
                                            return (
                                                <button
                                                    key={tier.value}
                                                    onClick={() => setTier(opt.key, tier.value)}
                                                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                                                        isActive
                                                            ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/20'
                                                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                                    }`}
                                                >
                                                    {tier.label}
                                                    {tier.price > 0 && (
                                                        <span className="ml-1 text-[10px] opacity-70">+€{tier.price}</span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary & Price */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sticky top-28">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <Euro className="w-4 h-4 text-[#B46CFF]" />
                                    Resumo do plano
                                </h3>

                                <div className="space-y-2.5 mb-6">
                                    {options.map((opt) => (
                                        <div key={opt.key} className="flex items-center justify-between text-xs">
                                            <span className="text-white/50">{opt.label}</span>
                                            <span className="text-white/80 font-medium">{getSelectedLabel(opt)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/[0.06] pt-4 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/50">Base</span>
                                        <span className="text-white/80">€{BASE_PRICE}</span>
                                    </div>
                                    {options.map((opt) => {
                                        const tier = opt.tiers.find(t => t.value === selections[opt.key])
                                        if (!tier || tier.price === 0) return null
                                        return (
                                            <div key={opt.key} className="flex items-center justify-between text-xs mt-1.5">
                                                <span className="text-white/40">{opt.label}</span>
                                                <span className="text-white/60">+€{tier.price}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-base font-bold">Total</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">
                                            €{total}
                                        </span>
                                        <span className="text-sm text-white/40 ml-1">/mês</span>
                                    </div>
                                </div>

                                <Link
                                    href={route('register')}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] text-white hover:opacity-90 transition-all shadow-lg shadow-[#6C3BFF]/20"
                                >
                                    Criar comunidade
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href={route('pricing')}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors"
                                >
                                    Voltar aos planos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
