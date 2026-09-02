<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class AdoptionImage extends Model
{
    use HasFactory;

    protected $table = 'listing_images';

    protected $fillable = [
        'marketplace_listing_id',
        'image_path',
        'image_type',
        'sort_order',
    ];

    public function adoption(): BelongsTo
    {
        return $this->belongsTo(Adoption::class, 'marketplace_listing_id');
    }

    /**
     * Get the full image URL.
     */
    public function getImageUrlAttribute(): string
    {
        return $this->image_path ? Storage::url($this->image_path) : '';
    }
}
