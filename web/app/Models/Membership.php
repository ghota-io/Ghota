<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Membership extends Model
{
    protected $table = "community_memberships";

    protected $fillable = [
        "community_id",
        "user_id",
        "role",
        "status",
        "community_role_id",
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function communityRole(): BelongsTo
    {
        return $this->belongsTo(CommunityRole::class, "community_role_id");
    }
}
