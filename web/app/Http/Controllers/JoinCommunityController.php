<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Membership;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JoinCommunityController extends Controller
{
    private function redirectToApp(Community $community)
    {
        $first = $community->channels()->orderBy('order')->orderBy('id')->first();

        if ($first) {
            return redirect()->route('communities.app', [$community->slug, 'canais', $first->name]);
        }

        return redirect()->route('communities.app', [$community->slug, 'canais']);
    }

    public function __invoke(Request $request, Community $community)
    {
        $existing = Membership::where('community_id', $community->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return $this->redirectToApp($community);
        }

        $defaultRole = $community->getDefaultRole();

        $freePlan = $community->plans()->where('is_free', true)->first();

        if ($freePlan) {
            Membership::create([
                'community_id' => $community->id,
                'user_id' => $request->user()->id,
                'role' => 'member',
                'community_role_id' => $defaultRole->id,
            ]);

            return $this->redirectToApp($community);
        }

        $request->validate(['plan_id' => 'required|exists:community_plans,id']);

        $plan = Plan::findOrFail($request->plan_id);

        if ($plan->price > 0) {
            $owner = $community->owner;

            if (!$owner->stripe_connect_id || $owner->stripe_connect_status !== 'completed') {
                return redirect()->route('communities.show', $community->slug)
                    ->with('error', 'Esta comunidade ainda não configurou os pagamentos. Tenta novamente mais tarde.');
            }

            \Stripe\Stripe::setApiKey(config('stripe.secret'));

            $customer = $this->getOrCreateStripeCustomer($request->user());

            $session = \Stripe\Checkout\Session::create([
                'customer' => $customer->id,
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => $plan->name,
                            'description' => $plan->description,
                        ],
                        'recurring' => ['interval' => 'month'],
                        'unit_amount' => (int) ($plan->price * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'metadata' => [
                    'community_id' => $community->id,
                    'user_id' => $request->user()->id,
                    'plan_id' => $plan->id,
                ],
                'subscription_data' => [
                    'transfer_data' => [
                        'destination' => $owner->stripe_connect_id,
                    ],
                ],
                'success_url' => route('communities.payment.success', $community->slug) . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('communities.join', $community->slug),
            ]);

            Subscription::create([
                'community_id' => $community->id,
                'user_id' => $request->user()->id,
                'plan_id' => $plan->id,
                'plan_type' => $plan->name,
                'status' => 'pending',
                'stripe_session_id' => $session->id,
                'starts_at' => null,
            ]);

            return Inertia::location($session->url);
        }

        Membership::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'member',
            'community_role_id' => $defaultRole->id,
        ]);

        return $this->redirectToApp($community);
    }

    private function getOrCreateStripeCustomer($user): \Stripe\Customer
    {
        \Stripe\Stripe::setApiKey(config('stripe.secret'));

        if ($user->stripe_customer_id) {
            try {
                return \Stripe\Customer::retrieve($user->stripe_customer_id);
            } catch (\Stripe\Exception\InvalidRequestException) {
                // customer was deleted on Stripe side, create a new one
            }
        }

        $customer = \Stripe\Customer::create([
            'email' => $user->email,
            'name' => $user->name,
            'metadata' => ['user_id' => $user->id],
        ]);

        $user->update(['stripe_customer_id' => $customer->id]);

        return $customer;
    }
}
