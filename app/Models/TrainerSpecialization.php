<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class TrainerSpecialization extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($specialization) {
            if (! $specialization->slug) {
                $specialization->slug = Str::slug($specialization->name);
            }
        });
    }

    public function trainerProfiles(): BelongsToMany
    {
        return $this->belongsToMany(TrainerProfile::class, 'trainer_profile_specialization');
    }
}
