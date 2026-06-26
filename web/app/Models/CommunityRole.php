<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunityRole extends Model
{
    protected $table = "community_roles";

    protected $fillable = [
        "community_id",
        "name",
        "is_default",
        "permissions",
    ];

    protected function casts(): array
    {
        return [
            "permissions" => "array",
            "is_default" => "boolean",
        ];
    }

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }
}
