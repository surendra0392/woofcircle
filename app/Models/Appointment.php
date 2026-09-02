<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'pet_id',
        'appointment_type',
        'appointment_date',
        'vet_profile_id',
        'doctor_name',
        'clinic_name',
        'notes',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
    ];

    protected $appends = [
        'title',
    ];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function vetProfile()
    {
        return $this->belongsTo(VetProfile::class);
    }

    public function getTitleAttribute()
    {
        $type = ucfirst(str_replace('_', ' ', $this->appointment_type ?? 'Appointment'));
        $doc = $this->doctor_name ?? 'Vet';
        $clinic = $this->clinic_name ?? 'Clinic';

        return "{$type} with {$doc} at {$clinic}";
    }
}
