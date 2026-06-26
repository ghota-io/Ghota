import { useState } from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import {
    Activity, BookOpen, MessageSquare, Bell,
    Check, ArrowRight, Shield, Users, ArrowLeft, Sparkles, ChevronDown
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

const planFeatures = {
    free: [
        'Acesso ao canal #geral',
        'Ver anúncios da comunidade',
        'Perfil de membro',
    ],
    paid: [
        'Acesso a todos os canais',
        'Mensagens e notificações em tempo real',
        'Participação em discussões exclusivas',
        'Suporte prioritário',
    ],
}

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
        <div className={`bg-white dark:bg-[#2b2d31] rounded-2xl p-6 relative border border-gray-200 dark:border-[#1e1f22] ${recommended ? 'ring-2 ring-violet-500/30' : ''}`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Acesso Recomendado
                </div>
            )}
            <div className="space-y-4 pt-2">
                <h3 className="font-extrabold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-gray-900 dark:text-white text-4xl">{plan.is_free ? '0' : `${plan.price}`}€</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{plan.is_free ? '' : '/ mês'}</span>
                </div>
                {plan.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</p>
                )}

                <hr className="border-gray-200 dark:border-[#1e1f22]" />

                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2.5">
                    {plan.is_free
                        ? planFeatures.free.slice(0, 1).map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" /> {f}
                            </li>
                        ))
                        : planFeatures.paid.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" /> {f}
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

                <p className="text-[10px] text-gray-400 text-center">
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
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
            </div>
        </div>
    )
}

function PlansView({ plans, community, isAuthenticated, hasFreePlan, onBack }) {
    const recommendedIndex = plans.findIndex(p => !p.is_free)
    const isRecommended = (i) => plans.length > 1 && i === recommendedIndex

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Sobre
                </button>
            </div>

            <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Escolhe o teu plano
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {community.description || 'Seleciona o plano que melhor se adequa a ti e começa já a participar.'}
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
                {plans.map((plan, i) => {
                    const recommended = isRecommended(i)
                    const features = plan.is_free ? planFeatures.free : planFeatures.paid

                    return (
                        <div
                            key={plan.id}
                            style={{ animationDelay: `${i * 0.08}s` }}
                            className={`
                                animate-popIn opacity-0 relative rounded-2xl p-6 flex flex-col transition-all
                                ${recommended
                                    ? 'bg-white dark:bg-[#2b2d31] border-2 border-violet-500/40 shadow-xl'
                                    : 'bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] hover:border-gray-300 dark:hover:border-white/10'
                                }
                            `}
                        >
                            {plan.is_free && (
                                <span className="self-start inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full mb-4">
                                    <Check className="w-2.5 h-2.5" />
                                    Grátis
                                </span>
                            )}
                            {recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                    <span className="flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Mais Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                {plan.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                                )}
                            </div>

                            <div className="mb-5">
                                {plan.is_free ? (
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">Grátis</span>
                                ) : (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{plan.price}€</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">/mês</span>
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-2.5 mb-6 flex-1">
                                {features.map((feat, fi) => (
                                    <li key={fi} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => plan.is_free
                                    ? router.post(route('communities.join.store', community.slug))
                                    : router.post(route('communities.join.store', community.slug), { plan_id: plan.id })
                                }
                                className={`
                                    w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer
                                    ${recommended
                                        ? 'bg-violet-600 hover:bg-violet-700 text-white'
                                        : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white'
                                    }
                                `}
                            >
                                {plan.is_free ? 'Entrar Grátis' : (
                                    <span className="flex items-center justify-center gap-1.5">
                                        Subscrever <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>

            <p className="text-center text-[10px] text-gray-400 dark:text-gray-500">
                Pagamentos processados via Stripe. Cancela quando quiseres.
            </p>
        </div>
    )
}

export default function Show({ community }) {
    const { auth } = usePage().props
    const isAuthenticated = !!auth.user
    const [view, setView] = useState('main')

    const plans = community.plans ?? []
    const hasFreePlan = plans.some(p => p.is_free)
    const recommendedPlan = plans.find(p => !p.is_free) || plans[0]

    const features = defaultFeatures

    return (
        <>
            <Head title={community.name} />

            <div className="min-h-screen bg-gray-50 dark:bg-[#1e1f22] font-sans">
                <GhotaNavbar community={community} />

                <div className="max-w-5xl mx-auto pt-28 pb-16 px-4 space-y-8 animate-fadeIn">
                    {/* Banner + Community Header */}
                    <div className="bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-2xl overflow-hidden shadow-sm">
                        <div className="h-44 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 relative" />
                        <div className="px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-4">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                                <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-[#1e1f22] bg-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl shrink-0">
                                    {community.name.charAt(0)}
                                </div>
                                <div className="mb-2">
                                    <h1 className="font-extrabold text-2xl text-gray-900 dark:text-white">{community.name}</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {community.owner && (
                                            <>por <span className="text-violet-600 dark:text-violet-400 font-semibold">@{community.owner.name}</span></>
                                        )}
                                        <span className="ml-2 inline-flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {community.memberships_count ?? 0} membros
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {plans.length > 0 && (
                                <div className="mb-2">
                                    <button
                                        onClick={() => setView(view === 'main' ? 'plans' : 'main')}
                                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
                                    >
                                        {view === 'main' ? (
                                            <>Ver Opções de Planos <ChevronDown className="w-3 h-3" /></>
                                        ) : (
                                            <><ArrowLeft className="w-3 h-3" /> Voltar para Sobre</>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div key={view} className="animate-fadeIn">
                        {view === 'main' ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-2xl p-6 space-y-4 shadow-sm">
                                        <h2 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#1e1f22] pb-2">Sobre a Comunidade</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {community.description || 'Sem descrição disponível.'}
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-2xl p-6 space-y-4 shadow-sm">
                                        <h2 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#1e1f22] pb-2">O que vais ter acesso imediato</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {features.map((f, i) => (
                                                <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

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
                        ) : (
                            <PlansView
                                plans={plans}
                                community={community}
                                isAuthenticated={isAuthenticated}
                                hasFreePlan={hasFreePlan}
                                onBack={() => setView('main')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}