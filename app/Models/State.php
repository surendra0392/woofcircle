<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class State extends Model
{
    protected $fillable = [
        'name',
        'code',
        'slug',
    ];

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }

    public function breederProfiles(): HasMany
    {
        return $this->hasMany(BreederProfile::class);
    }

    public function vetProfiles(): HasMany
    {
        return $this->hasMany(VetProfile::class);
    }

    public function trainerProfiles(): HasMany
    {
        return $this->hasMany(TrainerProfile::class);
    }

    public function boardingProfiles(): HasMany
    {
        return $this->hasMany(BoardingProfile::class);
    }

    public function welfareProfiles(): HasMany
    {
        return $this->hasMany(WelfareProfile::class);
    }
}
