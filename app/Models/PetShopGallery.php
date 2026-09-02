<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PetShopGallery extends Model
{
    protected $fillable = [
        'pet_shop_profile_id',
        'image',
        'sort_order',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(PetShopProfile::class, 'pet_shop_profile_id');
    }
}
