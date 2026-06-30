<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'csrf_token' => csrf_token(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => $request->user(),
            ],
            'login_token' => fn () => $request->session()->get('login_token'),
            'myCommunities' => $request->user()
                ? $request->user()->memberships()
                    ->with('community.owner')
                    ->get()
                    ->pluck('community')
                    ->unique('id')
                    ->values()
                : [],
        ];
    }
}
