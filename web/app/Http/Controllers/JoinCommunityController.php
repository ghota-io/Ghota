<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Membership;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;

class JoinCommunityController extends Controller
{
    private function redirectToChannel(Community $community)
    {
        $first = $community->channels()->orderBy('order')->orderBy('id')->first();

        if ($first) {
            return redirect()->route('communities.channel', [$community, $first->name]);
        }

        return redirect()->route('communities.show', $community);
    }

    public function __invoke(Request $request, Community $community)
    {
        $existing = Membership::where('community_id', $community->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return $this->redirectToChannel($community);
        }

        $freePlan = $community->plans()->where('is_free', true)->first();

        if ($freePlan) {
            Membership::create([
                'community_id' => $community->id,
                'user_id' => $request->user()->id,
                'role' => 'member',
            ]);

            return $this->redirectToChannel($community);
        }

        $request->validate(['plan_id' => 'required|exists:community_plans,id']);

        $plan = Plan::findOrFail($request->plan_id);

        if ($plan->price > 0) {
            // TODO: process payment
            Subscription::create([
                'community_id' => $community->id,
                'user_id' => $request->user()->id,
                'plan_type' => $plan->name,
                'starts_at' => now(),
            ]);
        }

        Membership::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'member',
        ]);

        return $this->redirectToChannel($community);
    }
}
