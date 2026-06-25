import { Head, Link, usePage, router } from '@inertiajs/react'
import {
    Activity, BookOpen, MessageSquare, Bell,
    Check, ChevronDown, ArrowRight, Shield, Users
} from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'

const defaultFeatures = [
    {
        icon: Activity,
        title: 'Conteúdo Exclusivo',
        desc: 'Materiais e recursos partilhados exclusivamente com membros da comunidade.',
    },
    {
        icon: BookOpen,
        title: 'Aprendizagem Contínua',
        desc: 'Discussões estruturadas e partilha de conhecimento entre membros.',
    },
    {
        icon: MessageSquare,
        title: 'Chat em Direto',
        desc: 'Conversas em tempo real com outros membros e equipa.',
    },
    {
        icon: Bell,
        title: 'Notificações',
        desc: 'Fica a par de novidades, eventos e atualizações importantes.',
    },
]

const planFeatures = [
    'Acesso total a todos os canais',
    'Participação em discussões',
    'Suporte da comunidade',
]

function PricingCard({ plan, community, isAuthenticated, hasFreePlan, recommended }) {
    const cta = () => {
        if (!isAuthenticated) {
            return { label: 'Iniciar Sessão', href: route('login') }
        }
        if (hasFreePlan || plan.is_free) {
            return {
                label: 'Entrar na Comunidade',
                action: () => router.post(route('communities.join.store', community.slug)),
            }
        }
        return { label: 'Aderir a esta Comunidade', href: route('communities.join', community.slug) }
    }

    const btn = cta()

    return (
        <div className={`bg-slate-950/70 rounded-2xl p-6 relative ${recommended ? 'border-2 border-violet-500/30' : 'border border-white/5'}`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Acesso Recomendado
                </div>
            )}
            <div className="space-y-4 pt-2">
                <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-white text-4xl">{plan.is_free ? '0' : `${plan.price}`}€</span>
                    <span className="text-xs text-slate-400">{plan.is_free ? '' : '/ mês'}</span>
                </div>
                {plan.description && (
                    <p className="text-xs text-slate-400">{plan.description}</p>
                )}

                <hr className="border-white/5" />

                <ul className="text-xs text-slate-300 space-y-2.5">
                    {(plan.is_free ? planFeatures.slice(0, 1) : planFeatures).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" /> {f}
                        </li>
                    ))}
                </ul>

                {'href' in btn ? (
                    <Link
                        href={btn.href}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-sm font-bold transition-all mt-4 flex items-center justify-center gap-2"
                    >
                        {btn.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <button
                        onClick={btn.action}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-sm font-bold transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {btn.label} <ArrowRight className="w-4 h-4" />
                    </button>
                )}

                <p className="text-[10px] text-slate-500 text-center">
                    <Shield className="w-3 h-3 text-emerald-500 inline mr-1" />
                    Pagamentos processados via Stripe.
                </p>
            </div>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-xs text-slate-400 mt-1">{desc}</p>
            </div>
        </div>
    )
}

export default function Show({ community }) {
    const { auth } = usePage().props
    const isAuthenticated = !!auth.user

    const plans = community.plans ?? []
    const hasFreePlan = plans.some(p => p.is_free)
    const recommendedPlan = plans.find(p => !p.is_free) || plans[0]

    const features = defaultFeatures

    return (
        <>
            <Head title={community.name} />

            <div className="min-h-screen bg-[#05020c] font-sans">
                <GhotaNavbar community={community} />

                <div className="max-w-5xl mx-auto pt-28 pb-16 px-4 space-y-8 animate-fadeIn">
                    {/* Banner + Community Header */}
                    <div className="bg-slate-950/70 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="h-44 bg-gradient-to-r from-indigo-950 via-purple-950 to-pink-950 relative" />
                        <div className="px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                                <div className="w-20 h-20 rounded-2xl border-4 border-[#05020c] bg-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl shrink-0">
                                    {community.name.charAt(0)}
                                </div>
                                <div className="mb-2">
                                    <h1 className="font-extrabold text-2xl text-white">{community.name}</h1>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {community.owner && (
                                            <>Espaço liderado por <span className="text-violet-400 font-semibold">@{community.owner.name}</span></>
                                        )}
                                        <span className="ml-2 inline-flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {community.memberships_count ?? 0} membros
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {plans.length > 0 && (
                                <div className="mb-2">
                                    <Link
                                        href={route('communities.join', community.slug)}
                                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20"
                                    >
                                        Ver Opções de Planos <ChevronDown className="w-3 h-3" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: About + Features */}
                        <div className="md:col-span-2 space-y-6">
                            {/* About */}
                            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-6 space-y-4">
                                <h2 className="font-bold text-lg text-white border-b border-white/5 pb-2">Sobre a Comunidade</h2>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {community.description || 'Sem descrição disponível.'}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-6 space-y-4">
                                <h2 className="font-bold text-lg text-white border-b border-white/5 pb-2">O que vais ter acesso imediato</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {features.map((f, i) => (
                                        <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Pricing Card */}
                        <div className="space-y-6">
                            {recommendedPlan && (
                                <PricingCard
                                    plan={recommendedPlan}
                                    community={community}
                                    isAuthenticated={isAuthenticated}
                                    hasFreePlan={hasFreePlan}
                                    recommended
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}