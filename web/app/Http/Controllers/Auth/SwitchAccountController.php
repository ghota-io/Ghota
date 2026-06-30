<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SavedAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SwitchAccountController extends Controller
{
    public function switch(Request $request): RedirectResponse
    {
        $request->validate([
            'login_token' => 'required|string|size:60',
        ]);

        $hashed = hash('sha256', $request->login_token);

        $saved = SavedAccount::where('login_token', $hashed)->first();

        if (! $saved) {
            return redirect()->back()->with('error', 'Sessão expirada. Faz login novamente.');
        }

        Auth::login($saved->user);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
