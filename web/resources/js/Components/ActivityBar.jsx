import { useState, useRef, useEffect } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { Hash, Users, Settings, CreditCard, Sun, Moon, User } from 'lucide-react'
import { getPersistedTheme, setPersistedTheme } from '@/theme'

export default function ActivityBar({ community, user, section }) {
    const { auth, csrf_token } = usePage().props
    const isOwner = user?.id === community.owner_id
    const isAdmin = isOwner
    const hasPlans = (community.plans?.length ?? 0) > 0
    const [userOpen, setUserOpen] = useState(false)
    const userDropdownRef = useRef(null)

    const [theme, setTheme] = useState(() => getPersistedTheme() ?? auth?.user?.theme ?? 'light')

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setPersistedTheme(next)
        setTheme(next)
        fetch(route('profile.theme'), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf_token },
            body: JSON.stringify({ theme: next }),
        })
    }

    useEffect(() => {
        const handler = (e) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const userInitials = user
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : null

    const items = [
        { icon: Hash, label: 'Canais', section: 'canais', show: true },
        { icon: Settings, label: 'Gerir', section: 'gerir', show: isAdmin },
        { icon: Users, label: 'Membros', section: 'membros', show: true },
        { icon: CreditCard, label: 'Planos', section: 'planos', show: hasPlans },
    ]

    const navigateToSection = (sec) => {
        if (sec === section) return
        const sub = sec === 'canais' ? (community.channels?.[0]?.name ?? 'geral') : undefined
        router.get(route('communities.app', [community.slug, sec, sub]), {}, {
            preserveState: false,
        })
    }

    return (
        <aside className="w-14 shrink-0 bg-gray-100 dark:bg-[#1a1b1e] flex flex-col items-center py-3 border-r border-gray-200 dark:border-[#1e1f22]">
            <div className="flex flex-col items-center gap-2 flex-1">
                {items.filter(i => i.show).map((item) => {
                    const Icon = item.icon
                    const isActive = section === item.section

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigateToSection(item.section)}
                            title={item.label}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative cursor-pointer
                                ${isActive
                                    ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2b2d31]'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-600 dark:bg-violet-400 rounded-full" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* User avatar dropdown */}
            <div className="relative" ref={userDropdownRef}>
                <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
                    title="Menu do utilizador"
                >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold select-none">
                        {userInitials}
                    </span>
                </button>

                {userOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] shadow-lg py-2 z-50">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            onClick={() => setUserOpen(false)}
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                            onClick={() => setUserOpen(false)}
                        >
                            <User className="w-4 h-4 text-gray-400" />
                            Perfil
                        </Link>
                        <button
                            onClick={() => { toggleTheme(); setUserOpen(false) }}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c] transition"
                        >
                            {theme === 'dark'
                                ? <Sun className="w-4 h-4 text-gray-400" />
                                : <Moon className="w-4 h-4 text-gray-400" />}
                            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-[#1e1f22] my-2 mx-4" />
                        <button
                            onClick={() => { router.post(route('logout')); setUserOpen(false) }}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Terminar Sessão
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}
