<?php

namespace App\Models;

use App\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Adoption extends Model
{
    protected $table = 'marketplace_listings';

    protected $attributes = [
        'type' => 'adoption',
    ];

    protected static function booted()
    {
        static::addGlobalScope('type', function (Builder $builder) {
            $builder->where('type', 'adoption');
        });
    }

    use HasFactory, Reviewable;

    protected $fillable = [
        'user_id',
        'profile_type',
        'profile_id',
        'breed_id',
        'gender',
        'title',
        'slug',
        'description',
        'price',
        'fee',
        'age',
        'is_champion',
        'awards_count',
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
        'price' => 'decimal:2',
        'fee' => 'decimal:2',
        'is_negotiable' => 'boolean',
        'is_vaccinated' => 'boolean',
        'is_available' => 'boolean',
        'is_approved' => 'boolean',
        'is_featured' => 'boolean',
        'is_champion' => 'boolean',
        'awards_count' => 'integer',
        'featured_until' => 'datetime',
    ];

    protected $appends = ['featured_image_url', 'fee'];

    public function getFeeAttribute()
    {
        return $this->attributes['price'] ?? 0;
    }

    public function setFeeAttribute($value)
    {
        $this->attributes['price'] = $value;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function profile(): MorphTo
    {
        return $this->morphTo();
    }

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(AdoptionImage::class, 'marketplace_listing_id');
    }

    /**
     * Get the health records for the adoption.
     */
    public function healthRecords(): HasMany
    {
        return $this->hasMany(PuppyHealthRecord::class);
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
