<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class EventType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($type) {
            if (empty($type->slug)) {
                $type->slug = Str::slug($type->name);
                $original = $type->slug;
                $count = 1;
                while (static::where('slug', $type->slug)->exists()) {
                    $type->slug = $original.'-'.$count++;
                }
            }
        });
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
