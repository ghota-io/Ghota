<?php

namespace App\Http\Controllers;

use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\StripeClient;

class ConnectController extends Controller
{
    public function onboarding(Request $request, Community $community)
    {
        $user = $request->user();

        if ($user->id !== $community->owner_id) {
            abort(403);
        }

        $stripe = new StripeClient(config('stripe.secret'));

        if ($user->stripe_connect_id) {
            try {
                $account = @$stripe->accounts->retrieve($user->stripe_connect_id);

                if ($account->charges_enabled) {
                    $user->update(['stripe_connect_status' => 'completed']);
                }

                $link = @$stripe->accountLinks->create([
                    'account' => $user->stripe_connect_id,
                    'refresh_url' => route('communities.connect.onboarding', $community->slug),
                    'return_url' => route('communities.app', [$community->slug, 'planos', 'gerir']),
                    'type' => 'account_onboarding',
                ]);

                return Inertia::location($link->url);
            } catch (\Exception) {
                // account might have been deleted, create a new one
            }
        }

        $account = @$stripe->accounts->create([
            'type' => 'express',
            'country' => 'PT',
            'email' => $user->email,
            'capabilities' => [
                'card_payments' => ['requested' => true],
                'transfers' => ['requested' => true],
            ],
            'business_type' => 'individual',
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        $user->update([
            'stripe_connect_id' => $account->id,
            'stripe_connect_status' => 'pending',
        ]);

        $link = @$stripe->accountLinks->create([
            'account' => $account->id,
            'refresh_url' => route('communities.connect.onboarding', $community->slug),
            'return_url' => route('communities.app', [$community->slug, 'planos', 'gerir']),
            'type' => 'account_onboarding',
        ]);

        return Inertia::location($link->url);
    }

    public function update(Request $request, Community $community)
    {
        $user = $request->user();

        if ($user->id !== $community->owner_id) {
            abort(403);
        }

        if (!$user->stripe_connect_id) {
            return redirect()->route('communities.app', [$community->slug, 'planos', 'gerir'])
                ->with('error', 'Nenhuma conta Stripe ligada.');
        }

        $stripe = new StripeClient(config('stripe.secret'));

        $link = @$stripe->accountLinks->create([
            'account' => $user->stripe_connect_id,
            'refresh_url' => route('communities.connect.update', $community->slug),
            'return_url' => route('communities.app', [$community->slug, 'planos', 'gerir']),
            'type' => 'account_onboarding',
        ]);

        return Inertia::location($link->url);
    }
}
