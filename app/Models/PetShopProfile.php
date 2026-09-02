<?php

namespace App\Models;

use App\Traits\Reviewable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PetShopProfile extends Model
{
    protected $table = 'directory_profiles';

    protected $attributes = [
        'type' => 'pet_shop',
    ];

    protected static function booted()
    {
        static::addGlobalScope('type', function (Builder $builder) {
            $builder->where('type', 'pet_shop');
        });
    }

    use Reviewable;

    protected $fillable = [
        'user_id',
        'name',
        'shop_name',
        'slug',
        'description',
        'phone',
        'email',
        'website',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'youtube_url',
        'state_id',
        'city_id',
        'address',
        'logo',
        'is_verified',
        'is_active',
    ];

    protected $appends = ['logo_url', 'shop_name'];

    protected $casts = [
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::saving(function ($profile) {
            if (! $profile->slug || $profile->isDirty('name')) {
                $profile->slug = Str::slug($profile->name).'-'.Str::lower(Str::random(6));
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(\App\Models\ProfileGallery::class, 'directory_profile_id')->orderBy('sort_order');
    }

    public function getLogoUrlAttribute()
    {
        return $this->logo ? Storage::url($this->logo) : null;
    }

    public function getShopNameAttribute()
    {
        return $this->name;
    }

    public function setShopNameAttribute($value)
    {
        $this->attributes['name'] = $value;
    }
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'agent_id');
    }

    public function adPlacements(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(AdPlacement::class, 'promotable');
    }
}
