<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function show()
    {
        return Inertia::render('Public/Contact');
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'message' => 'required|min:10|max:5000',
        ]);

        Mail::to('geral@ghota.io')->send(
            new ContactMail($validated['email'], $validated['message'])
        );

        return back()->with('success', 'Mensagem enviada com sucesso! Entraremos em contacto em breve.');
    }
}
