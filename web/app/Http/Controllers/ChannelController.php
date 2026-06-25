<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Channel;
use App\Models\Community;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:text,page',
            'community_id' => 'required|exists:communities,id',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $community = Community::findOrFail($validated['community_id']);

        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        $name = str_replace(' ', '-', trim($validated['name']));

        $existing = $community->channels()->where('name', $name)->exists();
        if ($existing) {
            return redirect()->back()->withErrors(['name' => 'Já existe um canal com esse nome.']);
        }

        $categoryId = $validated['category_id'] ?? null;

        if (!$categoryId) {
            $defaultCategory = $community->categories()
                ->where('name', $validated['type'] === 'page' ? 'Páginas' : 'Canais de texto')
                ->first();

            if (!$defaultCategory) {
                $defaultCategory = Category::create([
                    'community_id' => $community->id,
                    'name' => $validated['type'] === 'page' ? 'Páginas' : 'Canais de texto',
                    'order' => ($community->categories()->max('order') ?? 0) + 1,
                ]);
            }

            $categoryId = $defaultCategory->id;
        }

        $maxOrder = Channel::where('category_id', $categoryId)->max('order');

        Channel::create([
            'community_id' => $community->id,
            'category_id' => $categoryId,
            'name' => $name,
            'type' => $validated['type'],
            'order' => ($maxOrder ?? 0) + 1,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Channel $channel)
    {
        if ($request->user()->id !== $channel->community->owner_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $name = str_replace(' ', '-', trim($validated['name']));

        $existing = $channel->community->channels()
            ->where('name', $name)
            ->where('id', '!=', $channel->id)
            ->exists();

        if ($existing) {
            return redirect()->back()->withErrors(['name' => 'Já existe um canal com esse nome.']);
        }

        $channel->update(['name' => $name]);

        return redirect()->route('communities.channel', [$channel->community, $name]);
    }

    public function destroy(Request $request, Channel $channel)
    {
        if ($request->user()->id !== $channel->community->owner_id) {
            abort(403);
        }

        $channel->delete();

        return redirect()->back();
    }
}
