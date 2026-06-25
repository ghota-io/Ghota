import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import GhotaNavbar from '@/Components/GhotaNavbar';
import InputError from '@/Components/InputError';

export default function VerifyCode({ email, status }) {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    const handleDigitChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        setData('code', newDigits.join(''));

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newDigits = [...digits];
        for (let i = 0; i < paste.length; i++) {
            newDigits[i] = paste[i];
        }
        setDigits(newDigits);
        setData('code', newDigits.join(''));
        const nextIndex = Math.min(paste.length, 5);
        inputsRef.current[nextIndex]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.code.length !== 6) return;
        post(route('verification.code.store'), {
            preserveScroll: true,
        });
    };

    const handleResend = (e) => {
        e.preventDefault();
        setData('code', '');
        setDigits(['', '', '', '', '', '']);
        post(route('verification.code.resend'), {
            preserveScroll: true,
        });
    };

    const codeComplete = digits.every((d) => d !== '');

    return (
        <>
            <Head title="Verificar Email" />

            <div className="min-h-screen bg-white dark:bg-[#1e1f22]">
                <GhotaNavbar />

                <div className="flex items-center justify-center px-5 pt-16 pb-24">
                    <div className="w-full max-w-sm">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                Verifica o teu email
                            </h1>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Enviámos um código de 6 dígitos para
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {email}
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg px-4 py-3">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-2 justify-center mb-8">
                                {digits.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleDigitChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2b2d31] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <InputError message={errors.code} className="mb-4 text-center" />

                            <button
                                type="submit"
                                disabled={processing || !codeComplete}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40 shadow-lg shadow-gray-900/10"
                            >
                                {processing ? 'A verificar…' : 'Verificar código'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleResend}
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500 transition disabled:opacity-40"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reenviar código
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Voltar ao login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
