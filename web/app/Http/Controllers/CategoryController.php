<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Community;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'community_id' => 'required|exists:communities,id',
        ]);

        $community = Community::findOrFail($validated['community_id']);

        if ($request->user()->id !== $community->owner_id) {
            abort(403);
        }

        $maxOrder = Category::where('community_id', $community->id)->max('order');

        Category::create([
            'community_id' => $community->id,
            'name' => $validated['name'],
            'order' => ($maxOrder ?? 0) + 1,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Category $category)
    {
        if ($request->user()->id !== $category->community->owner_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, Category $category)
    {
        if ($request->user()->id !== $category->community->owner_id) {
            abort(403);
        }

        $category->delete();

        return redirect()->back();
    }
}
