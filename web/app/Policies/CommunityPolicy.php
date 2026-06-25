<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\User;

class CommunityPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(?User $user, Community $community): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Community $community): bool
    {
        return $user->id === $community->owner_id;
    }

    public function delete(User $user, Community $community): bool
    {
        return $user->id === $community->owner_id;
    }
}
