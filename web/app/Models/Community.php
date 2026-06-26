<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Community extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'description',
        'banner',
        'is_visible',
        'is_private',
        'code',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'is_private' => 'boolean',
        ];
    }

    public function isPrivate(): bool
    {
        return $this->is_private;
    }

    protected static function booted(): void
    {
        static::creating(function (self $community) {
            if (empty($community->slug)) {
                $community->slug = Str::slug($community->name);
            }
            $community->code = $community->code ?? Str::random(10);
        });

        static::created(function (self $community) {
            $community->roles()->create([
                'name' => 'Membro',
                'is_default' => true,
                'permissions' => [],
            ]);
        });
    }

    public function getDefaultRole(): CommunityRole
    {
        $role = $this->roles()->where('is_default', true)->first();

        if (!$role) {
            $role = $this->roles()->create([
                'name' => 'Membro',
                'is_default' => true,
                'permissions' => [],
            ]);
        }

        return $role;
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function channels(): HasMany
    {
        return $this->hasMany(Channel::class)->orderBy('order');
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class)->orderBy('order');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(CommunityRole::class);
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class)->orderBy('sort_order');
    }

    public function members(): HasMany
    {
        return $this->hasMany(Membership::class);
    }
}
