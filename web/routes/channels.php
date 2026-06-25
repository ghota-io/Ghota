<?php

use App\Models\Channel;
use App\Models\Membership;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{channelId}', function ($user, $channelId) {
    return Channel::where('id', $channelId)
        ->whereHas('community.memberships', fn ($q) => $q->where('user_id', $user->id))
        ->exists();
});
