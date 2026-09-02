<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderAvailability extends Model
{
    protected $fillable = [
        'provider_type',
        'provider_id',
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration_minutes',
    ];

    public function provider()
    {
        return $this->morphTo();
    }
}
