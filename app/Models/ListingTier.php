<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingTier extends Model
{
    protected $fillable = [
        'name',
        'max_listings',
        'price',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
