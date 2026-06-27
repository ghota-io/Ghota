import { Head } from '@inertiajs/react'
import { Scale } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Termos de Serviço — Ghota" />

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
                            <Scale className="w-5 h-5 text-[#B46CFF]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Termos de Serviço</h1>
                            <p className="text-sm text-white/40 mt-0.5">Última atualização: Junho 2026</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-white/70 text-sm leading-relaxed">
                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
                            <p>Ao acederes ou utilizares a plataforma Ghota, concordas com estes Termos de Serviço. Se não concordares com alguma parte, não deves utilizar o serviço.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">2. Descrição do Serviço</h2>
                            <p>A Ghota é uma plataforma de comunidades que permite a criadores e membros interagirem através de canais de texto, voz, eventos e partilha de conteúdo. Oferecemos planos gratuitos e pagos com funcionalidades adicionais.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">3. Conta de Utilizador</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Deves ter pelo menos 13 anos para criar uma conta</li>
                                <li>É da tua responsabilidade manter a confidencialidade da tua password</li>
                                <li>Apenas podes criar uma conta por pessoa</li>
                                <li>Deves fornecer informações precisas e atualizadas</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">4. Conduta do Utilizador</h2>
                            <p>Concordas em não:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Publicar conteúdo ilegal, ofensivo ou difamatório</li>
                                <li>Assediar, ameaçar ou intimidar outros utilizadores</li>
                                <li>Distribuir spam ou conteúdo malicioso</li>
                                <li>Tentar aceder a contas de outros utilizadores</li>
                                <li>Utilizar a plataforma para atividades ilegais</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">5. Propriedade Intelectual</h2>
                            <p>O conteúdo que publicas na Ghota continua a ser teu. Concedes-nos uma licença para armazenar e exibir esse conteúdo dentro da plataforma. O código, design e marca Ghota são da nossa propriedade.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">6. Pagamentos e Subscrições</h2>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Os planos pagos são cobrados mensalmente de forma recorrente</li>
                                <li>Podes cancelar a qualquer momento — o cancelamento é efetivo no final do período de faturação</li>
                                <li>Os preços podem ser alterados com aviso prévio de 30 dias</li>
                                <li>Reembolsos são analisados caso a caso</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">7. Limitação de Responsabilidade</h2>
                            <p>A Ghota é fornecida &quot;tal como está&quot;. Não nos responsabilizamos por danos indiretos, perda de dados, ou interrupções do serviço. A nossa responsabilidade máxima é limitada ao montante que pagaste nos últimos 12 meses.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">8. Rescisão</h2>
                            <p>Podemos suspender ou cancelar a tua conta se violares estes termos. Podes cancelar a tua conta a qualquer momento nas definições do teu perfil.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">9. Contacto</h2>
                            <p>Para questões relacionadas com estes termos, contacta-nos através do email <a href="mailto:geral@ghota.io" className="text-[#B46CFF] hover:underline">geral@ghota.io</a>.</p>
                        </section>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
