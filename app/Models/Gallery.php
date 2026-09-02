<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Gallery extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'image', // Main/Featured Image
        'category_id',
        'state_id',
        'city_id',
        'is_featured',
        'is_active',
        'shares_count',
        'exports_count',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'shares_count' => 'integer',
        'exports_count' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($gallery) {
            if (empty($gallery->slug)) {
                $letters = 'abcdefghijklmnopqrstuvwxyz';
                $randomLetters = '';
                for ($i = 0; $i < 6; $i++) {
                    $randomLetters .= $letters[rand(0, 25)];
                }
                $gallery->slug = Str::slug($gallery->title).'-'.$randomLetters;
            }
        });
    }

    protected $appends = ['main_image_url', 'featured_image_url'];

    public function category()
    {
        return $this->belongsTo(GalleryCategory::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(GalleryImage::class)->orderBy('sort_order');
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(GalleryLike::class);
    }

    public function getMainImageUrlAttribute()
    {
        if ($this->image) {
            if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
                return $this->image;
            }
            return Storage::url($this->image);
        }

        // Fallback to first gallery image if main is missing
        $first = $this->images->first();

        return $first ? $first->url : null;
    }

    public function getFeaturedImageUrlAttribute()
    {
        return $this->main_image_url;
    }
}
