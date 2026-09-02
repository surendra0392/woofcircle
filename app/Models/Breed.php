<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Breed extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'history',
        'other_names',
        'naming',
        'variants',
        'appearance',
        'health',
        'temperament',
        'behavior',
        'intelligence',
        'use',
        'origin',
        'life_span',
        'male_height',
        'female_height',
        'male_weight',
        'female_weight',
        'size',
        'breed_group',
        'coat_type',
        'colors',
        'energy_level',
        'is_indian',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_indian' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'cover_image',
    ];

    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image)) {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return Storage::url($this->image);
    }

    public function getCoverImageAttribute(): ?string
    {
        return $this->image_url;
    }

    /**
     * Auto-generate slug from name if not provided.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($breed) {
            if (empty($breed->slug)) {
                $breed->slug = Str::slug($breed->name);
            }
        });
    }
}
