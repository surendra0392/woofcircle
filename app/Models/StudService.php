<?php

namespace App\Models;

use App\Traits\Reviewable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class StudService extends Model
{
    protected $table = 'marketplace_listings';

    protected $attributes = [
        'type' => 'stud',
    ];

    protected static function booted()
    {
        static::addGlobalScope('type', function (Builder $builder) {
            $builder->where('type', 'stud');
        });
    }

    use Reviewable;

    protected $fillable = [
        'user_id',
        'profile_id',
        'profile_type',
        'breed_id',
        'stud_dog_name',
        'title',
        'slug',
        'description',
        'fee',
        'age',
        'is_champion',
        'awards_count',
        'kci_registered',
        'sire_name',
        'dam_name',
        'state_id',
        'city_id',
        'status',
        'is_negotiable',
        'is_vaccinated',
        'is_available',
        'is_approved',
        'featured_image_path',
        'is_featured',
        'featured_position',
        'featured_until',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'is_approved' => 'boolean',
        'kci_registered' => 'boolean',
        'is_negotiable' => 'boolean',
        'is_vaccinated' => 'boolean',
        'is_featured' => 'boolean',
        'is_champion' => 'boolean',
        'awards_count' => 'integer',
        'featured_until' => 'datetime',
        'fee' => 'decimal:2',
    ];

    protected $appends = ['featured_image_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profile()
    {
        return $this->morphTo();
    }

    public function breed()
    {
        return $this->belongsTo(Breed::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function images()
    {
        return $this->hasMany(StudServiceImage::class, 'marketplace_listing_id');
    }

    /**
     * Get the featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (! $this->featured_image_path) {
            return null;
        }

        if (str_starts_with($this->featured_image_path, 'http://') || str_starts_with($this->featured_image_path, 'https://')) {
            return $this->featured_image_path;
        }

        return Storage::url($this->featured_image_path);
    }

    public function adPlacements(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(AdPlacement::class, 'promotable');
    }
}
