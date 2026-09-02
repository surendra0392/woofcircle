<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PuppyHealthRecord extends Model
{
    protected $fillable = [
        'litter_id',
        'record_type',
        'title',
        'description',
        'administered_date',
        'next_due_date',
        'vet_name',
        'notes',
    ];

    protected $casts = [
        'administered_date' => 'date',
        'next_due_date' => 'date',
    ];

    /**
     * Get the litter that owns the health record.
     */
    public function litter(): BelongsTo
    {
        return $this->belongsTo(Litter::class);
    }

    /**
     * Get the adoption that owns the health record.
     */
    public function adoption(): BelongsTo
    {
        return $this->belongsTo(Adoption::class);
    }
}
