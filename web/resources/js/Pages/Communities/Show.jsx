import { Head, Link, usePage, router } from '@inertiajs/react'
import { CheckCircle, Users } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'

export default function Show({ community }) {
    const { auth } = usePage().props
    const isOwner = auth.user && auth.user.id === community.owner_id

    return (
        <>
            <Head title={community.name} />

            <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#1e1f22] font-sans">
                <GhotaNavbar community={community} />

                <div className="flex max-w-6xl mx-auto pt-20 px-5 gap-6 items-start">
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Banner */}
                        <div className="w-full h-44 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-end p-5 text-white relative overflow-hidden">
                            <h1 className="text-xl font-bold">{community.name}</h1>
                        </div>

                        {/* Owner row */}
                        <div className="flex items-center gap-4">
                            <div className="w-[72px] h-[72px] rounded-full bg-gray-200 border-4 border-white shadow shrink-0 flex items-center justify-center overflow-hidden text-gray-400 text-[10px] uppercase tracking-wide">
                                {community.owner.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">Owner</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">@{community.owner.name}</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{community.name}</div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {community.memberships_count ?? 0} membros</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-xl p-5">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-3">
                                Descrição
                            </span>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {community.description ?? 'Sem descrição disponível.'}
                            </p>
                        </div>

                    </div>

                    {/* Plans sidebar */}
                    <div className="w-[300px] shrink-0 flex flex-col gap-5">
                        <div className="bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-xl p-5">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 block mb-4">
                                Planos
                            </span>

                            {community.plans?.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{plan.name}</span>
                                        {plan.is_free && (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                                <CheckCircle className="w-2.5 h-2.5" />
                                                Grátis
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {plan.is_free ? 'Grátis' : `${plan.price} €`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {auth.user ? (
                            community.plans?.some(p => p.is_free) ? (
                                <button
                                    onClick={() => router.post(route('communities.join.store', community.slug))}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition text-center block cursor-pointer"
                                >
                                    Entrar na Comunidade
                                </button>
                            ) : (
                                <Link
                                    href={route('communities.join', community.slug)}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition text-center block"
                                >
                                    Entrar na Comunidade
                                </Link>
                            )
                        ) : (
                            <Link
                                href={route('login')}
                                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition text-center block"
                            >
                                Iniciar Sessão para Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
