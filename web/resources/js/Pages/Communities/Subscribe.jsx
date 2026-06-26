import { Head, Link, useForm } from '@inertiajs/react';
import { Check, ArrowRight, Users, Sparkles } from 'lucide-react';
import GhotaNavbar from '@/Components/GhotaNavbar';

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

export default function Subscribe({ community, isMember }) {
    const { data, setData, post, processing } = useForm({
        plan_id: null,
    });

    const joinWithPlan = (planId) => {
        setData('plan_id', planId);
        post(route('communities.join.store', community.slug));
    };

    const joinFree = () => {
        post(route('communities.join.store', community.slug));
    };

    const plans = community.plans ?? []
    const hasMultiplePlans = plans.length > 1
    const recommendedIndex = plans.findIndex(p => !p.is_free)
    const isRecommended = (i) => hasMultiplePlans && i === recommendedIndex

    return (
        <>
            <Head title={`Entrar — ${community.name}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-[#1e1f22] font-sans">
                <GhotaNavbar />

                <div className="max-w-5xl mx-auto px-5 pt-28 pb-24">
                    {/* Community header */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-indigo-500/30">
                            {community.name.charAt(0)}
                        </span>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{community.name}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <span>por <span className="text-violet-600 dark:text-violet-400 font-semibold">{community.owner?.name}</span></span>
                                <span className="text-gray-300 dark:text-gray-600">&middot;</span>
                                <Users className="w-3 h-3" />
                                {community.memberships_count ?? 0} membros
                            </p>
                        </div>
                    </div>

                    {isMember ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-5">
                                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Já és membro</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                                A tua subscrição está ativa. Podes aceder diretamente aos canais da comunidade.
                            </p>
                            <Link
                                href={route('communities.show', community.slug)}
                                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20"
                            >
                                Ir para a comunidade
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Heading */}
                            <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    Escolhe o teu plano
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {community.description || 'Seleciona o plano que melhor se adequa a ti e começa já a participar.'}
                                </p>
                            </div>

                            {/* Pricing grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
                                {plans.map((plan, i) => {
                                    const recommended = isRecommended(i)
                                    const features = plan.is_free ? planFeatures.free : planFeatures.paid

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`
                                                relative rounded-2xl p-6 flex flex-col transition-all
                                                ${recommended
                                                    ? 'bg-white dark:bg-[#2b2d31] border-2 border-violet-500/40 shadow-xl'
                                                    : 'bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] hover:border-gray-300 dark:hover:border-white/10'
                                                }
                                            `}
                                        >
                                            {/* Badges */}
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

                                            {/* Plan name & description */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                                {plan.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                                                )}
                                            </div>

                                            {/* Price */}
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

                                            {/* Features */}
                                            <ul className="space-y-2.5 mb-6 flex-1">
                                                {features.map((feat, fi) => (
                                                    <li key={fi} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                                                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* CTA */}
                                            <button
                                                onClick={() => plan.is_free ? joinFree() : joinWithPlan(plan.id)}
                                                disabled={processing}
                                                className={`
                                                    w-full py-3 rounded-xl text-sm font-bold transition-all
                                                    ${recommended
                                                        ? 'bg-violet-600 hover:bg-violet-700 text-white'
                                                        : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white'
                                                    }
                                                    disabled:opacity-40 cursor-pointer
                                                `}
                                            >
                                                {processing ? (
                                                    'A entrar…'
                                                ) : plan.is_free ? (
                                                    'Entrar Grátis'
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        Subscrever <ArrowRight className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Footer note */}
                            <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-8">
                                Pagamentos processados via Stripe. Cancela quando quiseres.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
