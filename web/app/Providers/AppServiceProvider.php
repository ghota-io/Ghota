<?php

namespace App\Providers;

use App\Models\SavedAccount;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Event::listen(function (Login $event) {
            $rawToken = Str::random(60);

            SavedAccount::updateOrCreate(
                ['user_id' => $event->user->id],
                ['login_token' => hash('sha256', $rawToken), 'last_used_at' => now()]
            );

            session()->flash('login_token', $rawToken);
        });
    }
}
