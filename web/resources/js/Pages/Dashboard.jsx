import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Plus, Compass, ArrowRight, CalendarDays, CreditCard } from 'lucide-react';
import GhotaNavbar from '@/Components/GhotaNavbar';

export default function Dashboard({ ownedCommunities, memberCommunities, myPlans, upcomingEvents }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-white dark:bg-[#1e1f22]">
                <GhotaNavbar />

                <div className="max-w-6xl mx-auto px-5 pt-12 pb-24">
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Olá, {user?.name?.split(' ')[0] || 'utilizador'} 👋
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bem-vindo de volta ao Ghota.</p>
                    </div>

                    {/* Owned communities */}
                    <section className="mb-14">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">As minhas comunidades</h2>
                            <Link
                                href={route('communities.create')}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                            >
                                <Plus className="w-4 h-4" />
                                Criar comunidade
                            </Link>
                        </div>

                        {ownedCommunities.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ownedCommunities.map((c) => (
                                    <Link
                                        key={c.id}
                                        href={route('communities.app', [c.slug, 'canais'])}
                                        className="flex items-center gap-4 bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-100/50 dark:hover:shadow-black/30 transition-all group"
                                    >
                                        <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            {c.name.charAt(0)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                {c.name}
                                            </h3>
                                            <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                <Users className="w-3 h-3" />
                                                {c.memberships_count} {c.memberships_count === 1 ? 'membro' : 'membros'}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 dark:bg-[#232428] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-10 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Ainda não criaste nenhuma comunidade.</p>
                                <Link
                                    href={route('communities.create')}
                                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-900/10"
                                >
                                    <Plus className="w-4 h-4" />
                                    Criar a minha primeira comunidade
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Member communities */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Comunidades onde participo</h2>
                            <Link
                                href={route('communities.index')}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                            >
                                <Compass className="w-4 h-4" />
                                Descobrir mais
                            </Link>
                        </div>

                        {memberCommunities.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {memberCommunities.map((c) => (
                                    <Link
                                        key={c.id}
                                        href={route('communities.app', [c.slug, 'canais'])}
                                        className="flex items-center gap-4 bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-100/50 dark:hover:shadow-black/30 transition-all group"
                                    >
                                        <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            {c.name.charAt(0)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                {c.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                por {c.owner?.name}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 dark:bg-[#232428] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-10 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Ainda não participas em nenhuma comunidade.</p>
                                <Link
                                    href={route('communities.index')}
                                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-900/10"
                                >
                                    <Compass className="w-4 h-4" />
                                    Explorar comunidades
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Plans + Events grid */}
                    <section className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* My Plans */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Os meus planos</h2>
                            </div>

                            {myPlans.length > 0 ? (
                                <div className="space-y-3 max-h-[18rem] overflow-y-auto">
                                    {myPlans.map((plan) => (
                                        <Link
                                            key={plan.id}
                                            href={route('communities.app', [plan.community.slug, 'planos'])}
                                            className="flex items-center gap-4 bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-100/50 dark:hover:shadow-black/30 transition-all group"
                                        >
                                            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                {plan.community.name.charAt(0)}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                    {plan.name} — {plan.community.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {plan.price > 0 ? plan.price + '€/mês' : 'Gratuito'}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-[#232428] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-10 text-center">
                                    <CreditCard className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Ainda não tens planos ativos.</p>
                                    <Link
                                        href={route('communities.index')}
                                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-900/10"
                                    >
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Events */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Eventos</h2>
                                <Link
                                    href={route('calendar')}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                                >
                                    <CalendarDays className="w-4 h-4" />
                                    Ver calendário
                                </Link>
                            </div>

                            {upcomingEvents.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {upcomingEvents.map((event) => {
                                        const d = new Date(event.starts_at);
                                        return (
                                            <div
                                                key={event.id}
                                                className="flex items-start gap-3 bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-100/50 dark:hover:shadow-black/30 transition-all group"
                                            >
                                                <div
                                                    className="w-11 h-11 rounded-xl flex flex-col items-center justify-center text-white shrink-0"
                                                    style={{ backgroundColor: event.color || '#6366f1' }}
                                                >
                                                    <span className="text-[10px] leading-none font-medium">
                                                        {d.toLocaleDateString('pt-PT', { month: 'short' })}
                                                    </span>
                                                    <span className="text-sm leading-none font-bold">{d.getDate()}</span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                        {event.community?.name} · {d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-[#232428] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-10 text-center">
                                    <CalendarDays className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Nenhum evento upcoming.</p>
                                    <Link
                                        href={route('calendar')}
                                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-900/10"
                                    >
                                        <CalendarDays className="w-4 h-4" />
                                        Ver calendário completo
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
