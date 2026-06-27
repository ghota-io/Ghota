import { Head } from '@inertiajs/react'
import { LifeBuoy, BookOpen, MessageCircle, Mail, Shield, Search } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'

const faqs = [
    {
        q: 'Como crio uma comunidade?',
        a: 'Vai ao menu "Criar Comunidade" na barra de navegação e preenche o nome, descrição e plano. Podes começar com um plano gratuito e adicionar planos pagos depois.',
    },
    {
        q: 'Como entro numa comunidade?',
        a: 'Navega até à comunidade que te interessa, clica em "Entrar" e escolhe o plano pretendido. Se for gratuito, entras de imediato. Se for pago, serás redirecionado para o Stripe.',
    },
    {
        q: 'Como cancelo a minha subscrição?',
        a: 'Acede à página de gestão da comunidade, onde encontras a opção de cancelar a subscrição. O cancelamento é efetivo no final do período de faturação.',
    },
    {
        q: 'Posso ter vários planos na minha comunidade?',
        a: 'Sim! Podes criar planos gratuitos e pagos com diferentes preços e benefícios. Cada membro pode escolher o plano que melhor se adequa.',
    },
    {
        q: 'Como funcionam os pagamentos?',
        a: 'Os pagamentos são processados via Stripe, um dos processadores de pagamento mais seguros do mundo. Não armazenamos dados de cartão de crédito.',
    },
    {
        q: 'Como recupero a minha password?',
        a: 'No ecrã de login, clica em "Esqueci-me da password". Receberás um email com instruções para redefinir a tua password.',
    },
    {
        q: 'Como elimino a minha conta?',
        a: 'Nas definições do teu perfil, encontras a opção de eliminar conta. Todos os teus dados serão removidos permanentemente.',
    },
    {
        q: 'Como posso contactar o suporte?',
        a: 'Podes enviar-nos uma mensagem através da página de Contacto ou enviar um email diretamente para geral@ghota.io.',
    },
]

const guides = [
    {
        icon: BookOpen,
        title: 'Guia para Criadores',
        desc: 'Aprende a criar e gerir a tua comunidade do zero.',
    },
    {
        icon: MessageCircle,
        title: 'Guia para Membros',
        desc: 'Descobre como participar e tirar o máximo partido das comunidades.',
    },
    {
        icon: Shield,
        title: 'Segurança e Privacidade',
        desc: 'Tudo sobre como protegemos os teus dados.',
    },
]

export default function Help() {
    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Ajuda — Ghota" />

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
                <div className="max-w-4xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center">
                            <LifeBuoy className="w-5 h-5 text-[#B46CFF]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Ajuda</h1>
                            <p className="text-sm text-white/40 mt-0.5">Tira as tuas dúvidas e aprende a usar a Ghota.</p>
                        </div>
                    </div>

                    {/* Guides */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        {guides.map((g, i) => (
                            <div
                                key={i}
                                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] transition-all cursor-default"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mb-3">
                                    <g.icon className="w-4 h-4 text-[#B46CFF]" />
                                </div>
                                <h3 className="text-sm font-semibold mb-1">{g.title}</h3>
                                <p className="text-xs text-white/50 leading-relaxed">{g.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Search className="w-4 h-4 text-[#B46CFF]" />
                            Perguntas Frequentes
                        </h2>
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"
                            >
                                <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium cursor-pointer hover:bg-white/[0.03] transition-colors list-none">
                                    {faq.q}
                                    <span className="shrink-0 ml-4 text-white/30 group-open:rotate-180 transition-transform">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/[0.06] pt-3">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 bg-gradient-to-r from-[#6C3BFF]/10 to-[#B46CFF]/10 border border-[#6C3BFF]/20 rounded-2xl p-8 text-center">
                        <h2 className="text-lg font-semibold mb-2">Não encontraste o que procuravas?</h2>
                        <p className="text-sm text-white/50 mb-5">A nossa equipa está pronta para te ajudar.</p>
                        <a
                            href={route('contact')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#6C3BFF]/20"
                        >
                            <Mail className="w-4 h-4" />
                            Contactar suporte
                        </a>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
