<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardingGallery extends Model
{
    protected $fillable = ['boarding_profile_id', 'image', 'sort_order'];

    public function boardingProfile(): BelongsTo
    {
        return $this->belongsTo(BoardingProfile::class);
    }
}
