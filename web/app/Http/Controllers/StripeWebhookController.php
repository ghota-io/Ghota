<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityRole;
use App\Models\Membership;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Event;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        \Stripe\Stripe::setApiKey(config('stripe.secret'));

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('stripe.webhook.secret')
            );
        } catch (\UnexpectedValueException) {
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException) {
            return response('Invalid signature', 400);
        }

        if ($event->type === Event::CHECKOUT_SESSION_COMPLETED) {
            $this->handleCheckoutCompleted($event->data->object);
        }

        return response('OK', 200);
    }

    private function handleCheckoutCompleted(\Stripe\Checkout\Session $session): void
    {
        $metadata = $session->metadata;
        $communityId = $metadata->community_id;
        $userId = $metadata->user_id;
        $planId = $metadata->plan_id;

        $subscription = Subscription::where('stripe_session_id', $session->id)->first();

        if ($subscription) {
            $subscription->update([
                'status' => 'active',
                'stripe_payment_intent' => $session->payment_intent,
                'starts_at' => now(),
            ]);
        } else {
            $plan = \App\Models\Plan::find($planId);
            Subscription::create([
                'community_id' => $communityId,
                'user_id' => $userId,
                'plan_id' => $planId,
                'plan_type' => $plan?->name ?? 'paid',
                'status' => 'active',
                'stripe_session_id' => $session->id,
                'stripe_payment_intent' => $session->payment_intent,
                'starts_at' => now(),
            ]);
        }

        $community = Community::find($communityId);
        $defaultRole = $community?->getDefaultRole();

        Membership::firstOrCreate([
            'community_id' => $communityId,
            'user_id' => $userId,
        ], [
            'role' => 'member',
            'community_role_id' => $defaultRole?->id,
        ]);
    }
}
