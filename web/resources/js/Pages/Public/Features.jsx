import { Head } from '@inertiajs/react'
import {
    Shield, MessageSquare, Mic, Calendar, FileText, Users,
    Crown, Globe, Zap, Lock, BarChart3,
    Bell, Image, Search, Smartphone, Server, Code2
} from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'

const categories = [
    {
        title: 'Comunicação',
        items: [
            { icon: MessageSquare, title: 'Canais de texto', desc: 'Cria canais organizados por tópico. Cada canal tem o seu propósito, mantendo as conversas focadas e fáceis de seguir.' },
            { icon: Mic, title: 'Canais de voz', desc: 'Comunicação em tempo real com canais de voz de alta qualidade. Perfeito para reuniões, eventos e conversas em grupo.' },
            { icon: Image, title: 'Partilha de multimédia', desc: 'Partilha imagens, vídeos, áudio e documentos diretamente nos canais. Tudo fica organizado e acessível.' },
            { icon: Bell, title: 'Notificações inteligentes', desc: 'Recebe notificações personalizadas por canal. Controla o que queres ver e quando queres ser notificado.' },
        ],
    },
    {
        title: 'Organização',
        items: [
            { icon: Users, title: 'Membros e cargos', desc: 'Atribui cargos e permissões aos membros. Controla quem pode ver, escrever e administrar cada canal.' },
            { icon: FileText, title: 'Categorias', desc: 'Agrupa canais por categorias para uma navegação mais intuitiva. Mantém a tua comunidade organizada.' },
            { icon: Calendar, title: 'Eventos ao vivo', desc: 'Cria e gere eventos ao vivo com data, hora e descrição. Os membros podem confirmar presença.' },
            { icon: Search, title: 'Pesquisa global', desc: 'Encontra qualquer mensagem, ficheiro ou membro rapidamente. Pesquisa poderosa em toda a comunidade.' },
        ],
    },
    {
        title: 'Monetização',
        items: [
            { icon: Crown, title: 'Planos de subscrição', desc: 'Cria planos grátis e pagos para a tua comunidade. Define preços e benefícios diferentes para cada nível.' },
            { icon: Globe, title: 'Pagamentos integrados', desc: 'Pagamentos processados via Stripe, um dos sistemas mais seguros do mundo. Sem complicações.' },
            { icon: BarChart3, title: 'Analíticas', desc: 'Acompanha o crescimento da tua comunidade com métricas detalhadas: membros, receitas e engagement.' },
            { icon: Zap, title: 'Checkout otimizado', desc: 'Experiência de pagamento rápida e sem atritos. Os membros entram na comunidade em segundos.' },
        ],
    },
    {
        title: 'Personalização',
        items: [
            { icon: Lock, title: 'Privacidade total', desc: 'Comunidades privadas por defeito. Tu controlas quem entra e o que é visível para cada membro.' },
            { icon: Smartphone, title: 'Experiência mobile', desc: 'Plataforma totalmente responsiva. Acede à tua comunidade de qualquer dispositivo, em qualquer lugar.' },
            { icon: Server, title: 'Performance', desc: 'Infraestrutura otimizada com Redis e PostgreSQL. Respostas rápidas mesmo com milhares de membros ativos.' },
            { icon: Code2, title: 'API e Webhooks', desc: 'Integra a Ghota com as tuas ferramentas favoritas através da API REST e webhooks em tempo real.' },
        ],
    },
]

const highlights = [
    { icon: Shield, stat: '100%', label: 'Privacidade garantida' },
    { icon: Zap, stat: '< 100ms', label: 'Tempo de resposta' },
    { icon: Server, stat: '99.9%', label: 'Uptime' },
    { icon: Crown, stat: 'Grátis', label: 'Para começar' },
]

export default function Features() {
    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Recursos — Ghota" />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#6C3BFF] opacity-20 blur-[120px]" />
                <div className="absolute top-[30%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#B46CFF] opacity-15 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#6C3BFF] opacity-10 blur-[80px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />
            </div>

            <GhotaNavbar landingStyle />

            <main className="relative pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-5">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            Tudo o que precisas para{' '}
                            <span className="bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">
                                crescer
                            </span>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Da comunicação à monetização, a Ghota oferece as ferramentas que precisas para construir
                            e escalar a tua comunidade.
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                        {highlights.map((h, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mx-auto mb-3">
                                    <h.icon className="w-5 h-5 text-[#B46CFF]" />
                                </div>
                                <div className="text-2xl font-extrabold bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">{h.stat}</div>
                                <div className="text-sm text-white/40 mt-0.5">{h.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Feature categories */}
                    {categories.map((cat, i) => (
                        <section key={i} className="mb-16">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6C3BFF] to-[#B46CFF]" />
                                {cat.title}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {cat.items.map((feat, j) => (
                                    <div
                                        key={j}
                                        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <feat.icon className="w-5 h-5 text-[#B46CFF]" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold mb-1.5">{feat.title}</h3>
                                                <p className="text-sm text-white/50 leading-relaxed">{feat.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-[#6C3BFF]/10 to-[#B46CFF]/10 border border-[#6C3BFF]/20 rounded-2xl p-10 text-center">
                        <h2 className="text-2xl font-bold mb-3">Pronto para criar a tua comunidade?</h2>
                        <p className="text-white/50 mb-6 max-w-lg mx-auto">
                            Junta-te a milhares de criadores que já escolheram a Ghota para construir comunidades com propósito.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href={route('register')} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#6C3BFF]/20">
                                Criar conta grátis
                            </a>
                            <a href={route('pricing')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/5 transition-all">
                                Ver planos
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
