<?php

namespace App\Http\Controllers;

use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Account;
use Stripe\AccountLink;
use Stripe\Stripe;

class ConnectController extends Controller
{
    public function onboarding(Request $request, Community $community)
    {
        $user = $request->user();

        if ($user->id !== $community->owner_id) {
            abort(403);
        }

        Stripe::setApiKey(config("stripe.secret"));

        if ($user->stripe_connect_id) {
            try {
                $account = Account::retrieve($user->stripe_connect_id);

                if ($account->charges_enabled) {
                    $user->update(["stripe_connect_status" => "completed"]);

                    $link = AccountLink::create([
                        "account" => $user->stripe_connect_id,
                        "refresh_url" => route("communities.connect.onboarding", $community->slug),
                        "return_url" => route("communities.app", [$community->slug, "planos", "gerir"]),
                        "type" => "account_onboarding",
                    ]);

                    return Inertia::location($link->url);
                }
            } catch (\Exception) {
                // account might have been deleted, create a new one
            }
        }

        $account = Account::create([
            "type" => "express",
            "country" => "PT",
            "email" => $user->email,
            "capabilities" => [
                "card_payments" => ["requested" => true],
                "transfers" => ["requested" => true],
            ],
            "business_type" => "individual",
            "metadata" => [
                "user_id" => $user->id,
            ],
        ]);

        $user->update([
            "stripe_connect_id" => $account->id,
            "stripe_connect_status" => "pending",
        ]);

        $link = AccountLink::create([
            "account" => $account->id,
            "refresh_url" => route("communities.connect.onboarding", $community->slug),
            "return_url" => route("communities.app", [$community->slug, "planos", "gerir"]),
            "type" => "account_onboarding",
        ]);

        return Inertia::location($link->url);
    }
}
