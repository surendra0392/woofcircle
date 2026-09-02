<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CareerApplication extends Model
{
    protected $fillable = [
        'career_position_id',
        'full_name',
        'email',
        'phone',
        'cover_letter',
        'resume_path',
        'experience_years',
        'current_company',
        'linkedin_url',
        'portfolio_url',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'experience_years' => 'integer',
    ];

    protected $appends = ['resume_url'];

    // ─── Relationships ───────────────────────────────────────────────────────────

    public function position(): BelongsTo
    {
        return $this->belongsTo(CareerPosition::class, 'career_position_id');
    }

    // ─── Accessors ───────────────────────────────────────────────────────────────

    public function getResumeUrlAttribute(): ?string
    {
        return $this->resume_path ? Storage::url($this->resume_path) : null;
    }
}
