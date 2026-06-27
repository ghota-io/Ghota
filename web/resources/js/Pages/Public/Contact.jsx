import { Head, usePage } from '@inertiajs/react'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'
import { useForm } from '@inertiajs/react'

export default function Contact() {
    const { errors, flash } = usePage().props

    const { data, setData, post, processing, reset } = useForm({
        email: '',
        message: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('contact.send'), {
            onSuccess: () => reset(),
        })
    }

    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Contacto — Ghota" />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#6C3BFF] opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#B46CFF] opacity-15 blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />
            </div>

            <GhotaNavbar landingStyle />

            <main className="relative pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-[#B46CFF]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Contacto</h1>
                            <p className="text-sm text-white/40 mt-0.5">Tens alguma dúvida? Fala connosco.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mb-4">
                                    <Mail className="w-5 h-5 text-[#B46CFF]" />
                                </div>
                                <h3 className="text-sm font-semibold mb-1">Email</h3>
                                <a href="mailto:geral@ghota.io" className="text-sm text-[#B46CFF] hover:underline">
                                    geral@ghota.io
                                </a>
                            </div>

                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mb-4">
                                    <MessageSquare className="w-5 h-5 text-[#B46CFF]" />
                                </div>
                                <h3 className="text-sm font-semibold mb-1">Tempo de resposta</h3>
                                <p className="text-sm text-white/50">Respondemos geralmente em até 24 horas úteis.</p>
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            {flash?.success ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                                    <p className="text-emerald-400 font-medium">{flash.success}</p>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
                                            O teu email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="geral@ghota.io"
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#B46CFF] focus:border-transparent transition text-white placeholder-white/30"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1.5">
                                            A tua dúvida
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Descreve o teu problema ou dúvida..."
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#B46CFF] focus:border-transparent transition text-white placeholder-white/30 resize-none"
                                        />
                                        {errors.message && (
                                            <p className="text-xs text-red-400 mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#6C3BFF]/20"
                                    >
                                        <Send className="w-4 h-4" />
                                        {processing ? 'A enviar...' : 'Enviar mensagem'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
