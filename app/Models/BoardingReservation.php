<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardingReservation extends Model
{
    protected $fillable = [
        'pet_id',
        'boarding_profile_id',
        'check_in_date',
        'check_out_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
    ];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function boardingProfile()
    {
        return $this->belongsTo(BoardingProfile::class);
    }
}
