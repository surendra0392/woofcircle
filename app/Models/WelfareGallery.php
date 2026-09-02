<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WelfareGallery extends Model
{
    protected $fillable = ['welfare_profile_id', 'image', 'sort_order'];

    public function welfareProfile(): BelongsTo
    {
        return $this->belongsTo(WelfareProfile::class);
    }
}
