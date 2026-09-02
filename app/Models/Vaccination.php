<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vaccination extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'vet_id',
        'vaccine_name',
        'vaccination_date',
        'next_due_date',
        'vet_name',
        'notes',
    ];

    protected $casts = [
        'vaccination_date' => 'date',
        'next_due_date' => 'date',
    ];

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function vet(): BelongsTo
    {
        return $this->belongsTo(VetProfile::class, 'vet_id');
    }
}
