import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight, Globe, Download, Shield, Building2, TrendingUp,
    Users, UserPlus, MessageSquare, Heart,
    Layers, Quote
} from 'lucide-react';
import GhotaNavbar from '@/Components/GhotaNavbar';

export default function Welcome({ auth, communities }) {
    return (
        <div className="min-h-screen bg-[#12002E] text-white overflow-hidden">
            <Head title="Ghota — Preview Landing Page" />

            {/* Background effects */}
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

            <GhotaNavbar />

            <main>
                {/* Hero */}
                <section className="relative pt-32 pb-20 md:pb-32">
                    <div className="max-w-7xl mx-auto px-5">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                            <div className="relative z-10">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                                    O espaço certo para a{' '}
                                    <span className="bg-gradient-to-r from-[#6C3BFF] via-[#B46CFF] to-[#D98CFF] bg-clip-text text-transparent">
                                        tua comunidade
                                    </span>
                                </h1>

                                <p className="mt-6 text-base sm:text-lg text-white/50 leading-relaxed max-w-lg">
                                    Ghota é onde criadores partilham conhecimento, mentores guiam comunidades e
                                    membros aprendem juntos — tudo num espaço privado e organizado.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <a href="#" className="inline-flex items-center gap-2 bg-white text-[#12002E] px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all shadow-xl shadow-[#6C3BFF]/20">
                                        <Download className="w-4 h-4" />
                                        Download Ghota
                                    </a>
                                    <Link
                                        href={usePage().props.auth?.user ? route('dashboard') : route('communities.index')}
                                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Abrir no browser
                                    </Link>
                                </div>
                            </div>

                            {/* Mockups */}
                            <div className="relative flex items-center justify-center">
                                <div className="relative w-full max-w-[500px] aspect-[4/3] bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl shadow-[#6C3BFF]/10">
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        </div>
                                        <span className="text-xs text-white/40 ml-2">Comunidade Alpha</span>
                                    </div>

                                    <div className="flex h-[calc(100%-40px)]">
                                        <div className="w-[120px] sm:w-[140px] bg-white/5 p-3 border-r border-white/5">
                                            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-medium">
                                                Comunidade Alpha
                                            </div>
                                            {['Eventos', 'Canais', 'Voz', 'Membros'].map(s => (
                                                <div key={s} className="text-xs text-white/50 py-1.5 px-2 rounded hover:bg-white/5 cursor-default">
                                                    {s}
                                                </div>
                                            ))}
                                            <div className="mt-3 pt-3 border-t border-white/5">
                                                {['geral', 'anúncios', 'recursos', 'dúvidas'].map(c => (
                                                    <div key={c} className="text-xs text-white/40 py-1 px-2 rounded hover:bg-white/5 cursor-default flex items-center gap-1">
                                                        <span className="text-white/20">#</span>
                                                        {c}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-3">
                                            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-medium">#geral</div>
                                            <div className="space-y-2.5">
                                                {[
                                                    { user: 'Sara', msg: 'Bem-vindos à comunidade!', color: 'from-pink-400 to-purple-400' },
                                                    { user: 'Tiago', msg: 'Este espaço está incrível!', color: 'from-blue-400 to-cyan-400' },
                                                    { user: 'Mariana', msg: 'Alguém para o evento de amanhã?', color: 'from-green-400 to-emerald-400' },
                                                    { user: 'Pedro', msg: 'Contem comigo!', color: 'from-amber-400 to-orange-400' },
                                                ].map((m, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${m.color} shrink-0 flex items-center justify-center text-[10px] font-bold`}>
                                                            {m.user[0]}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="text-xs font-medium text-white/70">{m.user}</span>
                                                            <p className="text-[11px] text-white/50 leading-relaxed">{m.msg}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 pt-2 border-t border-white/5">
                                                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                                                    <div className="w-3.5 h-3.5 rounded bg-white/10 flex items-center justify-center">
                                                        <span className="text-[8px] text-white/30">+</span>
                                                    </div>
                                                    <span className="text-[10px] text-white/30">Guia de Boas-vindas.pdf</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-8 -right-4 w-[140px] sm:w-[160px] aspect-[9/16] bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl shadow-[#6C3BFF]/10">
                                    <div className="flex items-center justify-center h-8 border-b border-white/10">
                                        <span className="text-[8px] text-white/30">Eventos</span>
                                    </div>
                                    <div className="flex gap-1.5 px-3 pt-2 pb-1 border-b border-white/5">
                                        {['Próximos', 'Passados'].map(t => (
                                            <span key={t} className={`text-[9px] px-2 py-0.5 rounded-full ${t === 'Próximos' ? 'bg-white/10 text-white/70' : 'text-white/30'}`}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="p-2 space-y-2">
                                        {[
                                            { title: 'Como criar conteúdo que conecta', date: 'Sábado' },
                                            { title: 'Tira as tuas dúvidas com os mentores', date: 'Quarta' },
                                        ].map((ev, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-2">
                                                <p className="text-[9px] text-white/60 leading-tight line-clamp-2">{ev.title}</p>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <span className="text-[8px] text-white/30">{ev.date}</span>
                                                    <span className="text-[8px] text-[#B46CFF] font-medium">Participar</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="relative py-16 md:py-24">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
                    <div className="relative max-w-7xl mx-auto px-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { icon: Users, value: '+10K', label: 'Comunidades ativas' },
                                { icon: UserPlus, value: '+250K', label: 'Membros conectados' },
                                { icon: MessageSquare, value: '+1M', label: 'Mensagens trocadas' },
                                { icon: Heart, value: '99.9%', label: 'Uptime e segurança' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 text-center hover:bg-white/[0.06] transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mx-auto mb-4">
                                        <stat.icon className="w-4 h-4 text-[#B46CFF]" />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="relative py-20 md:py-28">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
                    <div className="relative max-w-7xl mx-auto px-5">
                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Privado por padrão',
                                    text: 'A tua comunidade, as tuas regras.',
                                },
                                {
                                    icon: Building2,
                                    title: 'Tudo num só lugar',
                                    text: 'Chats, eventos, conteúdos e membros organizados.',
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Feito para crescer',
                                    text: 'Ferramentas que acompanham o teu projeto.',
                                },
                            ].map((feat, i) => (
                                <div
                                    key={i}
                                    className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3BFF]/20 to-[#B46CFF]/20 border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                        <feat.icon className="w-5 h-5 text-[#B46CFF]" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{feat.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social proof */}
                <section className="relative py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-5 text-center">
                        <p className="text-sm text-white/40 font-medium tracking-wider uppercase mb-10">
                            Confiado por criadores e comunidades em todo o mundo
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                            {['EDUCA+', 'MINDSET', 'Criadores', 'NOMADS', 'INSPIRA'].map((logo, i) => (
                                <span
                                    key={i}
                                    className="text-xl md:text-2xl font-bold text-white/20 hover:text-white/40 transition-colors tracking-tight"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Communities */}
                {communities.length > 0 && (
                    <section className="max-w-6xl mx-auto px-5 py-24">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                <span className="bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">
                                    Comunidades
                                </span>{' '}
                                em destaque
                            </h2>
                            <p className="mt-3 text-white/40">Encontra a comunidade ideal para o teu próximo passo</p>
                        </div>
                        <CommunityCarousel communities={communities} />
                    </section>
                )}

                {/* CTA */}
                <section className="relative py-20 md:py-28">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6C3BFF]/5 to-transparent" />
                    <div className="relative max-w-3xl mx-auto px-5 text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Pronto para criar a{' '}
                            <span className="bg-gradient-to-r from-[#6C3BFF] to-[#B46CFF] bg-clip-text text-transparent">
                                tua comunidade
                            </span>
                            ?
                        </h2>
                        <p className="mt-4 text-white/50 text-lg max-w-lg mx-auto">
                            Junta-te a criadores que já usam Ghota para partilhar conhecimento e crescer.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link href={route('dashboard')} className="inline-flex items-center gap-2 bg-white text-[#12002E] px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all shadow-xl shadow-[#6C3BFF]/20">
                                Criar comunidade
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href={route('communities.index')} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm">
                                Explorar comunidades
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-white/30">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-[8px] font-bold">
                            G
                        </div>
                        Ghota &copy; {new Date().getFullYear()}
                    </div>
                    <div className="flex items-center gap-6 text-xs text-white/30">
                        <a href="#" className="hover:text-white/50 transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white/50 transition-colors">Termos</a>
                        <a href="#" className="hover:text-white/50 transition-colors">Contacto</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CommunityCarousel({ communities }) {
    const [isPaused, setIsPaused] = useState(false);

    if (communities.length === 0) return null;

    const items = [...communities, ...communities];

    return (
        <div
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <style>{`
                @keyframes carousel-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            <div
                className="flex gap-5"
                style={{
                    width: 'max-content',
                    animation: `carousel-scroll ${Math.max(20, communities.length * 5)}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                {items.map((community, i) => (
                    <Link
                        key={i}
                        href={route('communities.show', community.slug)}
                        className="shrink-0 w-72 sm:w-80 bg-white/5 border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all group backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {community.name.charAt(0)}
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-white text-sm truncate group-hover:text-[#B46CFF] transition-colors">
                                    {community.name}
                                </h3>
                                <p className="text-xs text-white/40 truncate">
                                    por {community.owner?.name}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-4">
                            {community.description}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs text-white/40">
                                <Users className="w-3.5 h-3.5" />
                                {community.memberships_count} {community.memberships_count === 1 ? 'membro' : 'membros'}
                            </span>
                            <span className="text-xs font-medium text-[#B46CFF]">
                                {community.plans?.length > 0
                                    ? community.plans.some(p => p.is_free)
                                        ? 'Grátis disponível'
                                        : `A partir de €${Math.min(...community.plans.map(p => Number(p.price)))}`
                                    : 'Ver comunidade'}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function Step({ number, icon, title, text }) {
    return (
        <div className="text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] shadow-lg shadow-[#6C3BFF]/25 mb-6">
                {icon}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[10px] font-bold text-[#B46CFF] tracking-widest">
                PASSO {number}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">{text}</p>
        </div>
    );
}

function TestimonialCard({ quote, author, role }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <Quote className="w-8 h-8 text-[#B46CFF]/30 mb-3" />
            <p className="text-sm text-white/70 leading-relaxed mb-6 italic">
                &ldquo;{quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#B46CFF] flex items-center justify-center text-white text-xs font-bold">
                    {author.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                    <div className="text-sm font-semibold text-white">{author}</div>
                    <div className="text-xs text-white/40">{role}</div>
                </div>
            </div>
        </div>
    );
}
