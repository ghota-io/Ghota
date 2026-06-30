import { useEffect, useRef, useState } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import { ChevronsUpDown, Bell, Plus, Compass, Sun, Moon, User, Menu, X } from 'lucide-react'
import { getPersistedTheme, setPersistedTheme } from '@/theme'
import GhotaLogo from '@/Components/GhotaLogo'

export default function GhotaNavbar({ community = null, className = '', landingStyle = false }) {
    const { auth, myCommunities, url } = usePage().props
    const page = usePage()
    const user = auth?.user ?? null
    const isLanding = landingStyle || page.url === '/'
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)
    const [userOpen, setUserOpen] = useState(false)
    const userDropdownRef = useRef(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const [theme, setTheme] = useState(() => getPersistedTheme() ?? user?.theme ?? 'light')

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setPersistedTheme(next)
        setTheme(next)
        fetch(route('profile.theme'), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': page.props.csrf_token },
            body: JSON.stringify({ theme: next }),
        })
    }

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const userInitials = user
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : null

    const landingBg = 'bg-[#12002E]/80 backdrop-blur-xl border-b border-white/5'
    const internalBg = 'bg-white/80 dark:bg-[#1e1f22]/80 backdrop-blur-xl border-b border-[#808080]/20'

    return (
        <header className={`${isLanding ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 ${className}`}>
            <div className={`absolute inset-0 ${isLanding ? landingBg : internalBg}`} />
            <div className="relative max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

                {/* Logo / Community switcher */}
                <div className="flex items-center gap-0 relative" ref={dropdownRef}>
                    {community ? (
                        <Link
                            href={route('communities.show', community.slug)}
                            className={`flex items-center gap-2 no-underline font-extrabold text-xl tracking-tight select-none ${isLanding ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                        >
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {community.name.charAt(0)}
                            </span>
                            <span className="max-w-[160px] truncate">{community.name}</span>
                        </Link>
                    ) : (
                        <Link href="/" className="flex items-center no-underline select-none">
                            <GhotaLogo white={isLanding} className="h-8" />
                        </Link>
                    )}

                    {/* Community switcher chevron */}
                    <button
                        onClick={() => setOpen(!open)}
                        className={`flex items-center justify-center w-8 h-8 transition-colors rounded-lg ml-0.5 ${isLanding ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-700 dark:text-white/40 dark:hover:text-white'}`}
                        aria-label="Trocar comunidade"
                    >
                        <ChevronsUpDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Switcher dropdown */}
                    {open && (
                        <div className={`absolute left-0 top-full mt-2 w-64 rounded-xl border shadow-2xl py-2 z-50 ${
                            isLanding
                                ? 'border-white/10 bg-[#1a0040] shadow-black/40'
                                : 'border-gray-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] shadow-gray-200/50 dark:shadow-black/30'
                        }`}>
                            <Link
                                href={route('communities.create')}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                onClick={() => setOpen(false)}
                            >
                                <Plus className="w-4 h-4 text-[#B46CFF]" />
                                Criar Comunidade
                            </Link>
                            <Link
                                href={route('communities.index')}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                onClick={() => setOpen(false)}
                            >
                                <Compass className="w-4 h-4 text-[#B46CFF]" />
                                Descobrir Comunidades
                            </Link>

                            {myCommunities?.length > 0 && (
                                <>
                                    <div className={`h-px my-2 mx-4 ${isLanding ? 'bg-white/5' : 'bg-gray-100 dark:bg-[#1e1f22]'}`} />
                                    <div className={`px-4 py-1 text-[10px] font-semibold uppercase tracking-widest ${isLanding ? 'text-white/30' : 'text-gray-400'}`}>
                                        As minhas comunidades
                                    </div>
                                    {myCommunities.map((c) => (
                                        <Link
                                            key={c.id}
                                            href={route('communities.show', c.slug)}
                                            className={`flex items-center gap-3 px-4 py-2 text-sm transition ${isLanding ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                                {c.name.charAt(0)}
                                            </span>
                                            <span className="truncate">{c.name}</span>
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop nav links — only on landing page */}
                {isLanding && (
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href={route('features')} className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200">
                            Recursos
                        </Link>
                        <Link href={route('communities.index')} className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200">
                            Comunidades
                        </Link>
                        <Link href={route('pricing')} className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200">
                            Preços
                        </Link>
                        <Link href={route('help')} className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200">
                            Ajuda
                        </Link>
                    </nav>
                )}

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        /* — Authenticated — */
                        <div className="flex items-center gap-1">
                            <button className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${isLanding ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 dark:text-white/50 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                <Bell className="w-5 h-5" />
                            </button>

                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={() => setUserOpen(!userOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full"
                                    aria-label="Menu do utilizador"
                                >
                                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-white text-[11px] font-bold select-none">
                                        {userInitials}
                                    </span>
                                </button>

                                {userOpen && (
                                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-2xl py-2 z-50 ${
                                        isLanding
                                            ? 'bg-[#1a0040] border-white/10 shadow-black/40'
                                            : 'bg-white dark:bg-[#2b2d31] border-gray-200 dark:border-[#1e1f22] shadow-gray-200/50 dark:shadow-black/30'
                                    }`}>
                                        <Link
                                            href={route('dashboard')}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                            onClick={() => setUserOpen(false)}
                                        >
                                            <svg className={`w-4 h-4 ${isLanding ? 'text-white/40' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route('profile.edit')}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                            onClick={() => setUserOpen(false)}
                                        >
                                            <User className={`w-4 h-4 ${isLanding ? 'text-white/40' : 'text-gray-400'}`} />
                                            Perfil
                                        </Link>
                                        <button
                                            onClick={() => { toggleTheme(); setUserOpen(false) }}
                                            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                        >
                                            {theme === 'dark'
                                                ? <Sun className={`w-4 h-4 ${isLanding ? 'text-white/40' : 'text-gray-400'}`} />
                                                : <Moon className={`w-4 h-4 ${isLanding ? 'text-white/40' : 'text-gray-400'}`} />}
                                            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                                        </button>
                                        <div className={`h-px my-2 mx-4 ${isLanding ? 'bg-white/5' : 'bg-gray-100 dark:bg-[#1e1f22]'}`} />
                                        <button
                                            onClick={() => { router.post(route('logout')); setUserOpen(false) }}
                                            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition ${isLanding ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Terminar Sessão
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* — Guest — */
                        <>
                            <Link
                                href={route('login')}
                                className={`hidden md:inline text-sm font-medium px-4 py-2 transition-colors ${isLanding ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                            >
                                Entrar
                            </Link>
                            <Link
                                href={route('register')}
                                className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#6C3BFF]/25"
                            >
                                Criar conta
                            </Link>
                        </>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden p-2 transition-colors ${isLanding ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white'}`}
                        aria-label="Abrir menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className={`md:hidden backdrop-blur-xl border-b ${isLanding ? 'bg-[#12002E]/95 border-white/10' : 'bg-white/95 dark:bg-[#1e1f22]/95 border-gray-200 dark:border-[#1e1f22]'}`}>
                    <div className="px-5 py-5 space-y-1">
                        <Link
                            href={route('features')}
                            className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Recursos
                        </Link>
                        {isLanding && (
                            <Link
                                href={route('communities.index')}
                                className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Comunidades
                            </Link>
                        )}
                        {isLanding && (
                            <>
                            <Link
                                href={route('pricing')}
                                className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Preços
                            </Link>
                            <Link
                                href={route('help')}
                                className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Ajuda
                            </Link>
                            </>
                        )}
                        <div className={`pt-3 border-t space-y-2 ${isLanding ? 'border-white/5' : 'border-gray-200 dark:border-[#1e1f22]'}`}>
                            {user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className={`block text-sm py-2.5 px-3 rounded-lg transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { router.post(route('logout')); setMobileMenuOpen(false) }}
                                        className={`block w-full text-left text-sm py-2.5 px-3 rounded-lg transition ${isLanding ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                    >
                                        Terminar Sessão
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className={`block text-sm py-2.5 px-3 rounded-lg transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block text-center text-sm font-semibold bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] text-white px-5 py-3 rounded-xl hover:opacity-90 transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Criar conta
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}