<?php

namespace App\Providers;

use App\Models\Community;
use App\Policies\CommunityPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Community::class => CommunityPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
