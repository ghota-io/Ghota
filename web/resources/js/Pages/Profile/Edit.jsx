import { useState, useEffect } from 'react'
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'
import { Sun, Moon, User, Mail, Lock, Eye, EyeOff, Trash2, ChevronLeft } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import { getPersistedTheme, setPersistedTheme } from '@/theme'

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props
    const user = auth.user

    const [theme, setTheme] = useState(() => getPersistedTheme() ?? user?.theme ?? 'light')

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setPersistedTheme(next)
        setTheme(next)
        router.patch(route('profile.theme'), { theme: next })
    }

    return (
        <>
            <Head title="Perfil" />

            <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#1e1f22]">
                <GhotaNavbar />

                <div className="max-w-2xl mx-auto px-5 pt-8 pb-24">
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Dashboard
                    </Link>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                            {user.name.charAt(0)}
                        </span>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Perfil</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ProfileInfoForm user={user} mustVerifyEmail={mustVerifyEmail} status={status} />
                        <PasswordForm />
                        <ThemeSection theme={theme} toggleTheme={toggleTheme} />
                        <DangerSection />
                    </div>
                </div>
            </div>
        </>
    )
}

function ProfileInfoForm({ user, mustVerifyEmail, status }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    })

    const submit = (e) => {
        e.preventDefault()
        patch(route('profile.update'))
    }

    return (
        <form onSubmit={submit} className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Informação Pessoal</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-gray-50 dark:bg-[#1e1f22] pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-gray-50 dark:bg-[#1e1f22] pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            O teu email ainda não foi verificado.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-medium underline hover:text-amber-600 transition"
                            >
                                Reenviar email de verificação
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                                Um novo link de verificação foi enviado para o teu email.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {processing ? 'A guardar…' : 'Guardar'}
                    </button>
                    {recentlySuccessful && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Guardado!</span>
                    )}
                </div>
            </div>
        </form>
    )
}

function PasswordForm() {
    const { data, setData, put, errors, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)

    const updatePassword = (e) => {
        e.preventDefault()
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        })
    }

    return (
        <form onSubmit={updatePassword} className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Alterar Palavra-passe</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Palavra-passe atual</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-gray-50 dark:bg-[#1e1f22] pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nova palavra-passe</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-gray-50 dark:bg-[#1e1f22] pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirmar nova palavra-passe</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-gray-50 dark:bg-[#1e1f22] pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {processing ? 'A alterar…' : 'Alterar palavra-passe'}
                    </button>
                    {recentlySuccessful && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Palavra-passe atualizada!</span>
                    )}
                </div>
            </div>
        </form>
    )
}

function ThemeSection({ theme, toggleTheme }) {
    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Tema</h2>
            <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-3 px-5 py-3 bg-gray-100 dark:bg-[#35373c] text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#3f4248] transition"
            >
                {theme === 'dark' ? <><Sun className="w-5 h-5" /> Modo claro</> : <><Moon className="w-5 h-5" /> Modo escuro</>}
            </button>
        </div>
    )
}

function DangerSection() {
    const [showConfirm, setShowConfirm] = useState(false)
    const { data, setData, delete: destroy, processing, errors, reset } = useForm({ password: '' })

    const confirmDelete = () => setShowConfirm(true)

    const deleteUser = (e) => {
        e.preventDefault()
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => reset(),
            onFinish: () => reset(),
        })
    }

    const closeModal = () => {
        setShowConfirm(false)
        reset()
    }

    return (
        <div className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Zona de Perigo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Assim que eliminares a conta, todos os dados associados serão permanentemente apagados. Esta ação é irreversível.
            </p>
            <button
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
            >
                <Trash2 className="w-4 h-4" />
                Eliminar conta
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
                    <form onSubmit={deleteUser} className="bg-white dark:bg-[#2b2d31] rounded-2xl border border-gray-200 dark:border-[#1e1f22] p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tens a certeza?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                            Confirma a tua palavra-passe para eliminares a conta permanentemente.
                        </p>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-[#1e1f22] bg-gray-50 dark:bg-[#1e1f22] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition mb-4"
                            placeholder="Palavra-passe"
                        />
                        {errors.password && <p className="text-xs text-red-500 mb-4">{errors.password}</p>}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                            >
                                {processing ? 'A eliminar…' : 'Eliminar conta'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
