import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, Users, ArrowRight } from 'lucide-react';
import GhotaNavbar from '@/Components/GhotaNavbar';

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

    return (
        <>
            <Head title={`Entrar — ${community.name}`} />

            <div className="min-h-screen bg-white dark:bg-[#1e1f22]">
                <GhotaNavbar />

                <div className="max-w-6xl mx-auto px-5 pt-20 pb-24">
                    {/* Community header */}
                    <div className="flex items-center gap-5 mb-10">
                        <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                            {community.name.charAt(0)}
                        </span>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{community.name}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                por {community.owner?.name} &middot; {community.memberships_count ?? 0} {community.memberships_count === 1 ? 'membro' : 'membros'}
                            </p>
                        </div>
                    </div>

                    {isMember ? (
                        <div className="text-center py-20">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Já és membro desta comunidade</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Podes aceder diretamente aos canais da comunidade.
                            </p>
                            <Link
                                href={route('communities.show', community.slug)}
                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-900/10"
                            >
                                Ir para a comunidade
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xl">
                                {community.description || 'Escolhe o plano que melhor se adequa a ti e começa já a participar.'}
                            </p>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl">
                                {community.plans?.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6 flex flex-col"
                                    >
                                        {plan.is_free && (
                                            <span className="inline-flex self-start items-center gap-1 text-[10px] bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full font-medium mb-4">
                                                <CheckCircle className="w-2.5 h-2.5" />
                                                Grátis
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 flex-1">
                                            {plan.description || 'Acesso a todos os canais públicos da comunidade.'}
                                        </p>
                                        <div className="mb-5">
                                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                                {plan.is_free ? 'Grátis' : `${plan.price} €`}
                                            </span>
                                            {!plan.is_free && (
                                                <span className="text-sm text-gray-400 dark:text-gray-500 ml-1"></span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => plan.is_free ? joinFree() : joinWithPlan(plan.id)}
                                            disabled={processing}
                                            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40 shadow-lg shadow-gray-900/10"
                                        >
                                            {processing ? 'A entrar…' : plan.is_free ? 'Entrar grátis' : 'Subscrever'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
