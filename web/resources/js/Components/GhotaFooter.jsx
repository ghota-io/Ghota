import { Link } from '@inertiajs/react'
import { Mail } from 'lucide-react'

export default function GhotaFooter({ isLanding = false }) {
    const baseClass = isLanding
        ? 'text-white/30 hover:text-white/50'
        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'

    return (
        <footer className={`relative border-t py-8 ${isLanding ? 'border-white/5' : 'border-gray-200 dark:border-[#1e1f22]'}`}>
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    <div className={`flex items-center gap-2 text-sm ${isLanding ? 'text-white/30' : 'text-gray-400 dark:text-gray-500'}`}>
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-[8px] font-bold text-white">
                            G
                        </div>
                        Ghota &copy; {new Date().getFullYear()}
                    </div>
                    <div className="flex items-center gap-6 text-xs">
                        <Link href={route('privacy')} className={`transition-colors ${baseClass}`}>
                            Privacidade
                        </Link>
                        <Link href={route('terms')} className={`transition-colors ${baseClass}`}>
                            Termos
                        </Link>
                        <Link href={route('contact')} className={`transition-colors ${baseClass}`}>
                            Contacto
                        </Link>
                    </div>
                </div>
                <div className={`flex items-center justify-center gap-1.5 text-xs ${isLanding ? 'text-white/20' : 'text-gray-400 dark:text-gray-500'}`}>
                    <Mail className="w-3 h-3" />
                    geral@ghota.io
                </div>
            </div>
        </footer>
    )
}
