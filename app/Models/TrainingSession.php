<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingSession extends Model
{
    protected $fillable = [
        'pet_id',
        'trainer_profile_id',
        'session_type',
        'session_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'session_date' => 'datetime',
    ];

    protected $appends = [
        'title',
    ];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function trainerProfile()
    {
        return $this->belongsTo(TrainerProfile::class);
    }

    public function getTitleAttribute()
    {
        $type = ucfirst(str_replace('_', ' ', $this->session_type ?? 'Training Session'));
        $trainer = $this->trainerProfile ? $this->trainerProfile->name : 'Trainer';

        return "{$type} with {$trainer}";
    }
}
