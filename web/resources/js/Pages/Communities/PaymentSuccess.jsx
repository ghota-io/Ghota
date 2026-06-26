import { Head, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentSuccess({ community }) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const check = setInterval(() => {
            router.visit(route('communities.payment.success', community.slug), {
                preserveState: true,
                preserveScroll: true,
                only: ['membership'],
                onSuccess: (page) => {
                    if (page.props.membership) {
                        clearInterval(check);
                        setChecked(true);
                        setTimeout(() => {
                            window.location.href = route('communities.app', [
                                community.slug, 'canais',
                                page.props.firstChannel ?? 'geral',
                            ]);
                        }, 800);
                    }
                },
            });
        }, 2000);

        return () => clearInterval(check);
    }, []);

    return (
        <>
            <Head title="Pagamento confirmado" />

            <div className="min-h-screen bg-gray-50 dark:bg-[#1e1f22] flex items-center justify-center">
                <div className="text-center max-w-sm animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-6">
                        {checked ? (
                            <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-popIn" />
                        ) : (
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>

                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                        {checked ? 'Pagamento confirmado!' : 'A confirmar pagamento…'}
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {checked
                            ? 'Vais ser redirecionado para a comunidade.'
                            : 'A aguardar confirmação do Stripe. Isto leva apenas alguns segundos.'}
                    </p>

                    {!checked && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-6">
                            Se não fores redirecionado em 30 segundos,{' '}
                            <a
                                href={route('communities.show', community.slug)}
                                className="text-violet-600 dark:text-violet-400 underline"
                            >
                                clica aqui
                            </a>.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
