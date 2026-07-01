<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Community;
use App\Models\CommunityRole;
use App\Models\Membership;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\StripeClient;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('search');

        $communities = Community::where('is_visible', true)
            ->where('is_private', false)
            ->with('owner')
            ->with('plans')
            ->withCount('memberships')
            ->when($query, function ($q) use ($query) {
                $q->where(function ($q) use ($query) {
                    $q->where('name', 'ilike', "%{$query}%")
                      ->orWhere('description', 'ilike', "%{$query}%")
                      ->orWhereHas('owner', fn($q) => $q->where('name', 'ilike', "%{$query}%"));
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $memberCommunityIds = [];
        if ($request->user()) {
            $memberCommunityIds = \App\Models\Membership::where('user_id', $request->user()->id)
                ->pluck('community_id')
                ->toArray();
        }

        return Inertia::render('Communities/Index', [
            'communities' => $communities,
            'search' => $query,
            'memberCommunityIds' => $memberCommunityIds,
        ]);
    }

    public function create()
    {
        return Inertia::render('Communities/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner' => 'nullable|image|max:2048',
            'is_visible' => 'boolean',
            'is_private' => 'boolean',
            'plans' => 'required|array|min:1',
            'plans.*.name' => 'required|string|max:255',
            'plans.*.price' => 'required|numeric|min:0',
            'plans.*.description' => 'nullable|string',
            'plans.*.is_free' => 'boolean',
        ]);

        $community = Community::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'is_visible' => $validated['is_visible'] ?? true,
            'is_private' => $validated['is_private'] ?? false,
            'owner_id' => $request->user()->id,
        ]);

        Membership::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
        ]);

        foreach ($validated['plans'] as $i => $plan) {
            Plan::create([
                'community_id' => $community->id,
                'name' => $plan['name'],
                'price' => $plan['price'],
                'description' => $plan['description'] ?? null,
                'is_free' => $plan['is_free'] ?? false,
                'sort_order' => $i + 1,
            ]);
        }

        Channel::create([
            'community_id' => $community->id,
            'name' => 'boas-vindas',
            'type' => 'text',
            'order' => 1,
        ]);

        Channel::create([
            'community_id' => $community->id,
            'name' => 'geral',
            'type' => 'text',
            'order' => 2,
        ]);

        return redirect()->route('communities.show', $community);
    }

    public function show(Community $community, Request $request)
    {
        $user = $request->user();
        $isMember = false;

        if ($user) {
            $isMember = Membership::where('community_id', $community->id)
                ->where('user_id', $user->id)
                ->exists();

            if ($isMember) {
                $firstChannel = $community->channels()->orderBy('order')->orderBy('id')->first();
                if ($firstChannel) {
                    return redirect()->route('communities.app', [$community->slug, 'canais', $firstChannel->name]);
                }
            }
        }

        if ($community->isPrivate() && !$isMember) {
            $providedCode = $request->query('code');
            if (!$providedCode || $providedCode !== $community->code) {
                abort(404);
            }
        }

        $community->load('owner', 'plans');
        $community->loadCount('memberships');

        return Inertia::render('Communities/Show', [
            'community' => $community,
        ]);
    }

    public function channel(Community $community, string $canal)
    {
        $channel = $community->channels()->where('name', $canal)->first();

        if (!$channel) {
            return redirect()->route('communities.app', [$community->slug, 'canais']);
        }

        return redirect()->route('communities.app', [$community->slug, 'canais', $canal]);
    }

    public function edit(Community $community)
    {
        if (request()->user()->id !== $community->owner_id) {
            abort(403);
        }

        $community->load('plans');

        return Inertia::render('Communities/Create', [
            'community' => $community,
        ]);
    }

    public function update(Request $request, Community $community)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner' => 'nullable|image|max:2048',
            'is_visible' => 'boolean',
            'is_private' => 'boolean',
            'plans' => 'required|array|min:1',
            'plans.*.name' => 'required|string|max:255',
            'plans.*.price' => 'required|numeric|min:0',
            'plans.*.description' => 'nullable|string',
            'plans.*.is_free' => 'boolean',
            'plans.*.id' => 'nullable|exists:community_plans,id',
        ]);

        $community->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'is_visible' => $validated['is_visible'] ?? true,
            'is_private' => $validated['is_private'] ?? false,
        ]);

        $existingIds = collect($validated['plans'])->pluck('id')->filter();

        $plansToDelete = $community->plans()->whereNotIn('id', $existingIds)->get();
        foreach ($plansToDelete as $plan) {
            if (Subscription::where('plan_id', $plan->id)->where('status', 'active')->exists()) {
                return redirect()->back()->with('error', "O plano \"{$plan->name}\" tem assinantes ativos e não pode ser removido.");
            }
        }

        $community->plans()->whereNotIn('id', $existingIds)->delete();

        $stripe = null;

        foreach ($validated['plans'] as $i => $plan) {
            $data = [
                'name' => $plan['name'],
                'price' => $plan['price'],
                'description' => $plan['description'] ?? null,
                'is_free' => $plan['is_free'] ?? false,
                'sort_order' => $i + 1,
            ];

            if (!empty($plan['id'])) {
                $oldPlan = Plan::find($plan['id']);
                Plan::where('id', $plan['id'])->where('community_id', $community->id)->update($data);

                if ($oldPlan && (float) $oldPlan->price !== (float) $plan['price'] && empty($plan['is_free'])) {
                    $activeSubscriptions = Subscription::where('plan_id', $plan['id'])
                        ->where('status', 'active')
                        ->whereNotNull('stripe_subscription_id')
                        ->get();

                    if ($activeSubscriptions->isNotEmpty()) {
                        $stripe ??= new StripeClient(config('stripe.secret'));

                        foreach ($activeSubscriptions as $subscription) {
                            try {
                                $stripeSub = @$stripe->subscriptions->retrieve($subscription->stripe_subscription_id);
                                if (!empty($stripeSub->items->data)) {
                                    $itemId = $stripeSub->items->data[0]->id;
                                    $productId = $stripeSub->items->data[0]->price->product;

                                    @$stripe->subscriptionItems->update($itemId, [
                                        'price_data' => [
                                            'currency' => 'eur',
                                            'product' => $productId,
                                            'recurring' => ['interval' => 'month'],
                                            'unit_amount' => (int) ($plan['price'] * 100),
                                        ],
                                        'proration_behavior' => 'none',
                                    ]);
                                }
                            } catch (\Exception $e) {
                                Log::warning("Failed to sync Stripe price for subscription {$subscription->id}: {$e->getMessage()}");
                            }
                        }
                    }
                }
            } else {
                Plan::create(['community_id' => $community->id, ...$data]);
            }
        }

        return redirect()->back();
    }

    public function destroy(Request $request, Community $community)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        $community->delete();

        return redirect()->route('communities.index');
    }

    public function app(Request $request, Community $community, string $section = 'canais', ?string $sub = null)
    {
        $user = $request->user();

        if (!$user || !Membership::where('community_id', $community->id)->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        if ($user->id === $community->owner_id && $user->stripe_connect_id && $user->stripe_connect_status !== 'completed') {
            try {
                $stripe = new StripeClient(config('stripe.secret'));
                $account = @$stripe->accounts->retrieve($user->stripe_connect_id);
                if ($account->charges_enabled) {
                    $user->update(['stripe_connect_status' => 'completed']);
                }
            } catch (\Exception) {
                // account deleted on Stripe, ignore
            }
        }

        $data = [
            'community' => $community,
            'section' => $section,
        ];

        $community->load('categories.channels', 'plans');

        if ($section === 'canais') {
            $channelName = $sub ?? $community->channels()->orderBy('order')->orderBy('id')->value('name');
            if (!$channelName) {
                return redirect()->route('communities.app', [$community->slug, 'gerir']);
            }
            if (!$sub) {
                return redirect()->route('communities.app', [$community->slug, 'canais', $channelName]);
            }
            $channel = $community->channels()->where('name', $channelName)->firstOrFail();

            $messages = $channel->messages()
                ->with('user')
                ->orderBy('id', 'desc')
                ->limit(100)
                ->get()
                ->reverse()
                ->values();

            $data['channel'] = $channel;
            $data['messages'] = $messages;
        } elseif ($section === 'gerir') {
            if ($user->id !== $community->owner_id) {
                abort(403);
            }
            $community->load(['plans', 'channels', 'members.user']);
            $data['initialTab'] = $sub ?? 'settings';
        } elseif ($section === 'membros') {
            $community->load(['members.user', 'members.communityRole']);

            $userIds = $community->members->pluck('user_id');
            $subscriptions = Subscription::where('community_id', $community->id)
                ->whereIn('user_id', $userIds)
                ->where('status', 'active')
                ->with('plan')
                ->get()
                ->keyBy('user_id');

            $data['membersList'] = $community->members->map(function ($member) use ($subscriptions) {
                $sub = $subscriptions->get($member->user_id);
                return [
                    'id' => $member->id,
                    'role' => $member->role,
                    'user' => $member->user,
                    'plan_name' => $sub?->plan?->name ?? ($member->role === 'owner' ? '—' : 'Grátis'),
                    'community_role_id' => $member->community_role_id,
                    'community_role_name' => $member->communityRole?->name ?? ($member->role === 'owner' ? 'Owner' : '—'),
                    'joined_at' => $member->created_at,
                ];
            });

            $community->getDefaultRole();
            $community->load('roles');
            $data['membersSub'] = $sub ?? 'lista';
        } elseif ($section === 'planos') {
            $data['planosSub'] = $sub ?? 'gerir';
        }

        return Inertia::render('Communities/AppLayout', $data);
    }

    public function manage(Community $community)
    {
        if (request()->user()->id !== $community->owner_id) {
            abort(403);
        }

        return redirect()->route('communities.app', [
            $community->slug,
            'gerir',
            request()->query('tab', 'settings'),
        ]);
    }

    public function removeMember(Community $community, \App\Models\User $user)
    {
        if (request()->user()->id !== $community->owner_id) {
            abort(403);
        }

        if ($user->id === $community->owner_id) {
            abort(422, 'Não podes remover-te a ti próprio.');
        }

        Membership::where('community_id', $community->id)
            ->where('user_id', $user->id)
            ->delete();

        return redirect()->back();
    }

    public function changeMemberRole(Request $request, Community $community, \App\Models\User $user)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        if ($user->id === $community->owner_id) {
            abort(422, 'Não podes alterar o cargo do owner.');
        }

        $data = $request->validate([
            'community_role_id' => 'nullable|exists:community_roles,id',
        ]);

        Membership::where('community_id', $community->id)
            ->where('user_id', $user->id)
            ->update(['community_role_id' => $data['community_role_id']]);

        return redirect()->back();
    }

    public function storeRole(Request $request, Community $community)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
        ]);

        $role = $community->roles()->create([
            'name' => $data['name'],
            'permissions' => $data['permissions'] ?? [],
        ]);

        return redirect()->back();
    }

    public function updateRole(Request $request, Community $community, CommunityRole $role)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        if ($role->community_id !== $community->id) {
            abort(404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
        ]);

        $role->update([
            'name' => $data['name'],
            'permissions' => $data['permissions'] ?? [],
        ]);

        return redirect()->back();
    }

    public function destroyRole(Request $request, Community $community, CommunityRole $role)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        if ($role->community_id !== $community->id) {
            abort(404);
        }

        $role->delete();

        return redirect()->back();
    }

    public function joinForm(Community $community)
    {
        $community->load('owner', 'plans');
        $community->loadCount('memberships');

        $existing = null;
        if (request()->user()) {
            $existing = Membership::where('community_id', $community->id)
                ->where('user_id', request()->user()->id)
                ->first();
        }

        return Inertia::render('Communities/Subscribe', [
            'community' => $community,
            'isMember' => $existing !== null,
        ]);
    }

    public function paymentSuccess(Community $community, Request $request)
    {
        $user = $request->user();

        $membership = Membership::where('community_id', $community->id)
            ->where('user_id', $user->id)
            ->first();

        $firstChannel = $community->channels()
            ->orderBy('order')
            ->orderBy('id')
            ->value('name');

        $community->loadCount('memberships');

        return Inertia::render('Communities/PaymentSuccess', [
            'community' => $community,
            'membership' => $membership ? true : false,
            'firstChannel' => $firstChannel ?? 'geral',
        ]);
    }

}
