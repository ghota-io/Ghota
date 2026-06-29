<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Membership;
use App\Models\Subscription;
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

        match ($event->type) {
            Event::CHECKOUT_SESSION_COMPLETED => $this->handleCheckoutCompleted($event->data->object),
            Event::INVOICE_PAID => $this->handleInvoicePaid($event->data->object),
            Event::CUSTOMER_SUBSCRIPTION_UPDATED => $this->handleSubscriptionUpdated($event->data->object),
            Event::CUSTOMER_SUBSCRIPTION_DELETED => $this->handleSubscriptionDeleted($event->data->object),
            default => null,
        };

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
                'stripe_subscription_id' => $session->subscription,
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
                'stripe_subscription_id' => $session->subscription,
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

    private function handleInvoicePaid(\Stripe\Invoice $invoice): void
    {
        $subscriptionId = $invoice->subscription;
        if (!$subscriptionId) return;

        $subscription = Subscription::where('stripe_subscription_id', $subscriptionId)->first();
        if (!$subscription) return;

        $amountPaid = $invoice->amount_paid ?? 0;
        $applicationFee = (int) round($amountPaid * 0.20);

        if ($applicationFee > 0) {
            try {
                \Stripe\Invoice::update($invoice->id, [
                    'application_fee_amount' => $applicationFee,
                ]);
            } catch (\Exception $e) {
                logger()->error("Failed to set application fee on invoice {$invoice->id}: {$e->getMessage()}");
            }
        }

        $subscription->update([
            'status' => 'active',
            'starts_at' => now(),
        ]);
    }

    private function handleSubscriptionUpdated(\Stripe\Subscription $stripeSubscription): void
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription->id)->first();
        if (!$subscription) return;

        $statusMap = [
            'active' => 'active',
            'past_due' => 'past_due',
            'canceled' => 'cancelled',
            'unpaid' => 'unpaid',
            'incomplete' => 'incomplete',
            'incomplete_expired' => 'incomplete_expired',
            'paused' => 'paused',
            'trialing' => 'trialing',
        ];

        $newStatus = $statusMap[$stripeSubscription->status] ?? 'active';

        $subscription->update(['status' => $newStatus]);
    }

    private function handleSubscriptionDeleted(\Stripe\Subscription $stripeSubscription): void
    {
        Subscription::where('stripe_subscription_id', $stripeSubscription->id)
            ->update(['status' => 'cancelled', 'ends_at' => now()]);
    }
}
