import { useEffect, useRef, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Plus, Check, ArrowRightLeft } from 'lucide-react'

const STORAGE_KEY = 'ghota_accounts'

export function getSavedAccounts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
        return []
    }
}

export function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

export default function AccountSwitcher({ isLanding, onClose }) {
    const { auth, login_token, csrf_token } = usePage().props
    const user = auth?.user
    const [accounts, setAccounts] = useState(getSavedAccounts)
    const formRef = useRef(null)

    useEffect(() => {
        if (user && login_token) {
            setAccounts(prev => {
                const filtered = prev.filter(a => a.id !== user.id)
                const updated = [{ id: user.id, name: user.name, email: user.email, login_token }, ...filtered]
                saveAccounts(updated)
                return updated
            })
        }
    }, [user?.id, login_token])

    const handleSwitch = (account) => {
        if (account.id === user?.id) return
        onClose?.()

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

    if (!user) return null

    return (
        <>
            <div className={`h-px my-2 mx-4 ${isLanding ? 'bg-white/5' : 'bg-gray-100 dark:bg-[#1e1f22]'}`} />

            <div className={`px-4 py-1 text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 ${isLanding ? 'text-white/30' : 'text-gray-400'}`}>
                <ArrowRightLeft className="w-3 h-3" />
                Trocar conta
            </div>

            <div className="max-h-48 overflow-y-auto">
                {accounts.map((account) => (
                    <button
                        key={account.id}
                        onClick={() => handleSwitch(account)}
                        className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition ${
                            account.id === user?.id
                                ? isLanding
                                    ? 'text-white bg-white/5 cursor-default'
                                    : 'text-gray-900 dark:text-white bg-gray-50 dark:bg-[#35373c] cursor-default'
                                : isLanding
                                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'
                        }`}
                    >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                            account.id === user?.id
                                ? 'bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF]'
                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                            {account.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{account.name}</div>
                            <div className={`truncate text-[11px] ${isLanding ? 'text-white/30' : 'text-gray-400'}`}>
                                {account.email}
                            </div>
                        </div>
                        {account.id === user?.id && (
                            <Check className={`w-3.5 h-3.5 shrink-0 ${isLanding ? 'text-[#B46CFF]' : 'text-indigo-500'}`} />
                        )}
                    </button>
                ))}
            </div>

            <Link
                href={route('add.account')}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${isLanding ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#35373c]'}`}
            >
                <Plus className="w-4 h-4" />
                Adicionar conta
            </Link>
        </>
    )
}
