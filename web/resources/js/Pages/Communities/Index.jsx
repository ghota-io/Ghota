import { useEffect, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { Search, Users, Globe, Crown } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'

export default function Index({ communities, search: initialSearch, memberCommunityIds }) {
    const [search, setSearch] = useState(initialSearch ?? '')

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('communities.index'),
                { search: search || undefined },
                { preserveState: true, replace: true }
            )
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    return (
        <>
            <Head title="Descobre Comunidades" />

            <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#1e1f22] font-sans">
                <GhotaNavbar />

                <div className="max-w-6xl mx-auto px-5 py-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Descobre Comunidades</h1>
                        <p className="text-gray-500 dark:text-gray-400">Encontra comunidades que combinam com os teus interesses</p>
                    </div>

                    <div className="relative max-w-md mx-auto mb-10">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Pesquisar comunidades..."
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-gray-900 dark:text-white"
                        />
                    </div>

                    {communities.data.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 mb-4">Nenhuma comunidade encontrada</p>
                            <Link
                                href={route('communities.create')}
                                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                            >
                                Criar a primeira comunidade
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {communities.data.map((community) => {
                                const cheapest = community.plans?.filter(p => !p.is_free).sort((a, b) => a.price - b.price)[0]
                                const hasFree = community.plans?.some(p => p.is_free)

                                return (
                                    <Link
                                        key={community.id}
                                        href={route('communities.show', community.slug)}
                                        className="bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-[#1e1f22] rounded-xl overflow-hidden hover:shadow-md dark:hover:shadow-black/30 transition group"
                                    >
                                        <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                                            <div className="absolute inset-0 bg-black/20" />
                                            {memberCommunityIds?.includes(community.id) && (
                                                <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                                                    Membro
                                                </span>
                                            )}
                                            <div className="absolute bottom-3 left-4 right-4">
                                                <h3 className="text-white font-bold text-lg leading-tight">{community.name}</h3>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                                                por @{community.owner.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                                {community.description ?? 'Sem descrição'}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {community.memberships_count ?? 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {hasFree ? (
                                                        <><Globe className="w-3.5 h-3.5" /> Gratuita</>
                                                    ) : cheapest ? (
                                                        <><Crown className="w-3.5 h-3.5" /> Desde {cheapest.price} €</>
                                                    ) : null}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {communities.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {communities.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                                ? 'bg-white dark:bg-[#2b2d31] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#35373c] border border-gray-200 dark:border-[#1e1f22]'
                                                : 'text-gray-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
