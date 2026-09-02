<?php

namespace App\Models;

use App\Traits\Reviewable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VetProfile extends Model
{
    protected $table = 'directory_profiles';

    protected $attributes = [
        'type' => 'vet',
    ];

    protected static function booted()
    {
        static::addGlobalScope('type', function (Builder $builder) {
            $builder->where('type', 'vet');
        });
    }

    use Reviewable;

    protected $fillable = [
        'user_id',
        'name',
        'clinic_name',
        'slug',
        'description',
        'phone',
        'email',
        'state_id',
        'city_id',
        'address',
        'experience_years',
        'logo',
        'is_verified',
        'is_active',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'youtube_url',
        'agent_id',
        'claimed_at',
    ];

    protected $appends = ['logo_url', 'clinic_name'];

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

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(VetService::class, 'profile_service', 'directory_profile_id', 'vet_service_id');
    }

    public function getLogoUrlAttribute()
    {
        return $this->logo ? Storage::url($this->logo) : null;
    }

    public function getClinicNameAttribute()
    {
        return $this->name;
    }

    public function setClinicNameAttribute($value)
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
