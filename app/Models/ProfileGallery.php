<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProfileGallery extends Model
{
    protected $table = 'profile_galleries';

    protected $fillable = [
        'directory_profile_id',
        'image',
        'sort_order',
    ];

    protected $appends = ['image_url'];

    public function directoryProfile(): BelongsTo
    {
        return $this->belongsTo(DirectoryProfile::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }
}
