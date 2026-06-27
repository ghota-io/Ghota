import { Head, Link } from '@inertiajs/react'
import { Check, Crown, ArrowRight, Sliders } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'

const plans = [
    {
        name: 'Gratuito',
        price: '€0',
        period: '/mês',
        desc: 'Para quem está a começar e quer explorar a plataforma.',
        features: [
            'Comunidade de até 50 membros',
            'Canais de texto ilimitados',
            'Até 3 categorias',
            'Convites por link',
            'Suporte por email',
        ],
        cta: 'Começar grátis',
        highlight: false,
    },
    {
        name: 'Criador',
        price: '€9',
        period: '/mês',
        desc: 'Para criadores que querem crescer a sério.',
        features: [
            'Membros ilimitados',
            'Canais de texto e voz',
            'Categorias ilimitadas',
            'Planos de subscrição (grátis/pagos)',
            'Eventos ao vivo',
            'Partilha de ficheiros',
            'Suporte prioritário',
        ],
        cta: 'Escolher Criador',
        highlight: false,
    },
    {
        name: 'Profissional',
        price: '€29',
        period: '/mês',
        desc: 'Para comunidades profissionais com necessidades avançadas.',
        features: [
            'Tudo do plano Criador',
            'Múltiplos administradores',
            'Webhooks e APIs',
            'Integração com Stripe',
            'Analíticas avançadas',
            'Domínio personalizado',
            'Suporte dedicado 24/7',
        ],
        cta: 'Escolher Profissional',
        highlight: false,
    },
    {
        name: 'Personalizado',
        price: 'Sob medida',
        period: '',
        desc: 'Para comunidades com necessidades específicas. Define os teus próprios limites.',
        features: [
            'Membros personalizável',
            'Canais de texto e voz',
            'Categorias personalizável',
            'Planos de subscrição próprios',
            'Armazenamento personalizável',
            'Eventos ao vivo',
            'Suporte prioritário',
        ],
        cta: 'Personalizar plano',
        highlight: false,
        custom: true,
    },
]

const faq = [
    { q: 'Posso mudar de plano a qualquer momento?', a: 'Sim! Podes fazer upgrade ou downgrade do teu plano quando quiseres. As alterações são aplicadas no próximo ciclo de faturação.' },
    { q: 'O plano gratuito tem limite de tempo?', a: 'Não, o plano gratuito é para sempre. Se precisares de mais funcionalidades, podes fazer upgrade a qualquer altura.' },
    { q: 'Como funcionam os pagamentos?', a: 'Os pagamentos são processados mensalmente através do Stripe, um dos processadores mais seguros do mundo. Aceitamos cartões de crédito e débito.' },
    { q: 'Posso cancelar a minha subscrição?', a: 'Sim, podes cancelar a qualquer momento. A tua comunidade continuará ativa até ao final do período de faturação.' },
]

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Preços — Ghota" />

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
                <div className="max-w-5xl mx-auto px-5">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                            Preços para a tua{' '}
                            <span className="bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">
                                comunidade
                            </span>
                        </h1>
                        <p className="text-white/50 text-lg max-w-xl mx-auto">
                            Escolhe o plano ideal para o teu projeto. Começa grátis e faz upgrade quando precisares.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className="relative rounded-2xl p-6 border border-white/[0.06] bg-white/[0.03] hover:scale-105 hover:shadow-xl hover:shadow-[#6C3BFF]/20 hover:border-[#6C3BFF]/40 transition-all duration-300 flex flex-col"
                            >

                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mb-4">
                                    {plan.custom ? <Sliders className="w-5 h-5 text-[#B46CFF]" /> : <Crown className="w-5 h-5 text-[#B46CFF]" />}
                                </div>

                                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                                <p className="text-sm text-white/50 mb-4">{plan.desc}</p>

                                <div className="flex items-baseline gap-0.5 mb-6">
                                    <span className={`${plan.custom ? 'text-lg font-bold' : 'text-3xl font-extrabold'}`}>{plan.price}</span>
                                    {plan.period && <span className="text-sm text-white/40">{plan.period}</span>}
                                </div>

                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {plan.custom ? (
                                    <Link
                                        href={route('pricing.customize')}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/5 transition-all mt-auto"
                                    >
                                        {plan.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <a
                                        href={route('register')}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/5 transition-all mt-auto"
                                    >
                                        {plan.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-lg font-semibold text-center mb-6">Perguntas Frequentes</h2>
                        <div className="space-y-2">
                            {faq.map((item, i) => (
                                <details
                                    key={i}
                                    className="group bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium cursor-pointer hover:bg-white/[0.03] transition-colors list-none">
                                        {item.q}
                                        <span className="shrink-0 ml-4 text-white/30 group-open:rotate-180 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/[0.06] pt-3">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
