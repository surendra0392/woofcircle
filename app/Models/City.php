<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class City extends Model
{
    protected $fillable = [
        'name',
        'state_id',
        'latitude',
        'longitude',
        'slug',
    ];

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    /**
     * Scope a query to only include cities within a given distance (km) from a point.
     */
    public function scopeWithinDistance($query, float $lat, float $lng, int $radius = 25)
    {
        return $query->whereRaw('( 6371 * acos( cos( radians(?) ) *
            cos( radians( latitude ) )
            * cos( radians( longitude ) - radians(?)
            ) + sin( radians(?) ) *
            sin( radians( latitude ) ) )
            ) <= ?', [$lat, $lng, $lat, $radius]);
    }
}
