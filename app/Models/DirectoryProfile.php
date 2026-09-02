<?php

namespace App\Models;

use App\Traits\Reviewable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DirectoryProfile extends Model
{
    use Reviewable;

    protected $table = 'directory_profiles';

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'slug',
        'description',
        'phone',
        'email',
        'state_id',
        'city_id',
        'address',
        'experience_years',
        'website',
        'service_type',
        'price_per_day',
        'capacity',
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

    protected $appends = ['logo_url'];

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

    public function getLogoUrlAttribute()
    {
        return $this->logo ? Storage::url($this->logo) : null;
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'agent_id');
    }

    public function services(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(VetService::class, 'profile_service', 'directory_profile_id', 'vet_service_id');
    }

    public function specializations(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(TrainerSpecialization::class, 'trainer_profile_specialization', 'directory_profile_id', 'trainer_specialization_id');
    }

    public function adPlacements(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(AdPlacement::class, 'promotable');
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(ProfileGallery::class, 'directory_profile_id');
    }
}
