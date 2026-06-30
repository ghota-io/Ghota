import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
import { getSavedAccounts } from '@/Components/AccountSwitcher'

export default function ChooseAccount() {
    const { csrf_token } = usePage().props
    const [accounts, setAccounts] = useState(getSavedAccounts)
    const [switching, setSwitching] = useState(null)

    const handleSwitch = (account) => {
        if (switching) return
        setSwitching(account.id)

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = route('auth.switch')
        form.style.display = 'none'

        const addField = (name, value) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = name
            input.value = value
            form.appendChild(input)
        }

        addField('_token', csrf_token)
        addField('login_token', account.login_token)

        document.body.appendChild(form)
        form.submit()
    }

    return (
        <>
            <Head title="Escolher conta" />

            <div className="min-h-screen bg-white dark:bg-[#1e1f22] flex flex-col items-center justify-center px-5 py-16">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Escolher conta
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Seleciona a conta para continuares
                        </p>
                    </div>

                    {accounts.length > 0 ? (
                        <div className="space-y-2">
                            {accounts.map((account) => (
                                <button
                                    key={account.id}
                                    onClick={() => handleSwitch(account)}
                                    disabled={switching === account.id}
                                    className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all text-left group disabled:opacity-50"
                                >
                                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {account.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                                            {account.name}
                                        </div>
                                        <div className="text-xs text-gray-400 truncate">
                                            {account.email}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Nenhuma conta guardada.
                        </p>
                    )}

                    <div className="mt-4">
                        <Link
                            href={route('add.account')}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg shadow-gray-900/10"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar outra conta
                        </Link>
                    </div>

                    <div className="mt-4">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 dark:border-[#1e1f22] text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#2b2d31] transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar à página inicial
                        </Link>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                        >
                            Fazer login
                        </Link>
                        <Link
                            href={route('register')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                        >
                            Criar conta nova
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
