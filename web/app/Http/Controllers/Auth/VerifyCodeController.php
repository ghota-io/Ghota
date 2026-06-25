<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\VerificationCode;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VerifyCodeController extends Controller
{
    public function create(): Response|RedirectResponse
    {
        $userId = session('verification_user_id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user || $user->hasVerifiedEmail()) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerifyCode', [
            'email' => $user->email,
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $userId = session('verification_user_id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user || $user->hasVerifiedEmail()) {
            return redirect()->route('login');
        }

        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        if (! $user->verificationCodeIsValid($request->code)) {
            return back()->withErrors([
                'code' => 'Código inválido ou expirado. Pede um novo código.',
            ]);
        }

        $user->markEmailAsVerified();
        $user->verification_code = null;
        $user->verification_code_expires_at = null;
        $user->save();

        session()->forget('verification_user_id');

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function resend(Request $request): RedirectResponse
    {
        $userId = session('verification_user_id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = User::find($userId);

        if (! $user || $user->hasVerifiedEmail()) {
            return redirect()->route('login');
        }

        $user->generateVerificationCode();
        $user->save();

        $user->notify(new VerificationCode($user->verification_code));

        return back()->with('status', 'Código reenviado para o teu email.');
    }
}
