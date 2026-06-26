<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Community;
use App\Models\Membership;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                    return redirect()->route('communities.channel', [$community, $firstChannel->name]);
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
        $channel = $community->channels()->where('name', $canal)->firstOrFail();

        $user = request()->user();
        if (!$user || !Membership::where('community_id', $community->id)->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        $community->load('categories.channels', 'plans');

        $messages = $channel->messages()
            ->with('user')
            ->latest()
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return Inertia::render('Communities/ShowChannel', [
            'community' => $community,
            'channel' => $channel,
            'messages' => $messages,
        ]);
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
        $community->plans()->whereNotIn('id', $existingIds)->delete();

        foreach ($validated['plans'] as $i => $plan) {
            $data = [
                'name' => $plan['name'],
                'price' => $plan['price'],
                'description' => $plan['description'] ?? null,
                'is_free' => $plan['is_free'] ?? false,
                'sort_order' => $i + 1,
            ];

            if (!empty($plan['id'])) {
                Plan::where('id', $plan['id'])->where('community_id', $community->id)->update($data);
            } else {
                Plan::create(['community_id' => $community->id, ...$data]);
            }
        }

        return redirect()->route('communities.show', $community);
    }

    public function destroy(Request $request, Community $community)
    {
        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        $community->delete();

        return redirect()->route('communities.index');
    }

    public function manage(Community $community)
    {
        if (request()->user()->id !== $community->owner_id) {
            abort(403);
        }

        $community->load(['plans', 'channels', 'members.user']);

        return Inertia::render('Communities/Manage', [
            'community' => $community,
            'initialTab' => request()->query('tab', 'settings'),
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
