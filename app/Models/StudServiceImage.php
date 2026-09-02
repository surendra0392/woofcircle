<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class StudServiceImage extends Model
{
    protected $table = 'listing_images';

    protected $fillable = [
        'marketplace_listing_id',
        'image_path',
        'image_type',
        'sort_order',
    ];

    protected $appends = ['image_url'];

    public function studService()
    {
        return $this->belongsTo(StudService::class, 'marketplace_listing_id');
    }

    /**
     * Get the image URL.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }
}
