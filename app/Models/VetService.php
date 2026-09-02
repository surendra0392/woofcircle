<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class VetService extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($service) {
            if (! $service->slug) {
                $service->slug = Str::slug($service->name);
            }
        });
    }

    public function vetProfiles(): BelongsToMany
    {
        return $this->belongsToMany(VetProfile::class, 'vet_profile_service');
    }
}
