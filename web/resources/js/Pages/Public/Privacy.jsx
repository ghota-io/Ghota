import { Head } from '@inertiajs/react'
import { Shield } from 'lucide-react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import GhotaFooter from '@/Components/GhotaFooter'

export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Política de Privacidade — Ghota" />

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
                            <Shield className="w-5 h-5 text-[#B46CFF]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Política de Privacidade</h1>
                            <p className="text-sm text-white/40 mt-0.5">Última atualização: Junho 2026</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-white/70 text-sm leading-relaxed">
                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">1. Informações que recolhemos</h2>
                            <p>Recolhemos as seguintes informações quando utilizas a Ghota:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Informações de registo (nome, email, data de nascimento)</li>
                                <li>Conteúdo que publicas (mensagens, ficheiros, imagens)</li>
                                <li>Dados de utilização (comunidades que segues, canais que visitas)</li>
                                <li>Informações de pagamento (processadas via Stripe — não armazenamos dados de cartão)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">2. Como utilizamos os teus dados</h2>
                            <p>Os teus dados são utilizados para:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Fornecer e melhorar os serviços da Ghota</li>
                                <li>Processar pagamentos e gerir subscrições</li>
                                <li>Enviar notificações e comunicações relacionadas com o serviço</li>
                                <li>Garantir a segurança da plataforma</li>
                                <li>Personalizar a tua experiência</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">3. Partilha de dados</h2>
                            <p>Não vendemos os teus dados pessoais a terceiros. Podemos partilhar informações com:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Processadores de pagamento (Stripe) para processar transações</li>
                                <li>Autoridades legais quando exigido por lei</li>
                                <li>Prestadores de serviços que nos ajudam a operar a plataforma (hosting, CDN, email)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">4. Os teus direitos</h2>
                            <p>Tens direito a:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Aceder aos teus dados pessoais</li>
                                <li>Corrigir dados inexatos</li>
                                <li>Eliminar a tua conta e dados associados</li>
                                <li>Exportar os teus dados</li>
                                <li>Opor-te ao processamento dos teus dados</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">5. Cookies</h2>
                            <p>Utilizamos cookies essenciais para o funcionamento da plataforma, cookies de autenticação para manter a tua sessão, e cookies analíticos para melhorar o serviço. Podes gerir as tuas preferências de cookies nas definições do teu browser.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">6. Segurança</h2>
                            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger os teus dados, incluindo encriptação SSL/TLS, armazenamento seguro de passwords, e acesso restrito a dados sensíveis.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-white mb-3">7. Contacto</h2>
                            <p>Para questões relacionadas com privacidade, contacta-nos através do email <a href="mailto:geral@ghota.io" className="text-[#B46CFF] hover:underline">geral@ghota.io</a>.</p>
                        </section>
                    </div>
                </div>
            </main>

            <GhotaFooter isLanding />
        </div>
    )
}
