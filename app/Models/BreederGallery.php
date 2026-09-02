<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BreederGallery extends Model
{
    protected $fillable = [
        'breeder_profile_id',
        'image',
        'sort_order',
    ];

    protected $appends = ['image_url'];

    public function breederProfile()
    {
        return $this->belongsTo(BreederProfile::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? \Illuminate\Support\Facades\Storage::url($this->image) : null;
    }
}
