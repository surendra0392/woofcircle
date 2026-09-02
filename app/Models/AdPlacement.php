<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AdPlacement extends Model
{
    protected $fillable = [
        'promotable_type',
        'promotable_id',
        'agent_id',
        'tier',
        'placement_slot',
        'title',
        'subtitle',
        'banner_image_path',
        'target_url',
        'cta_text',
        'duration',
        'targeted_state_ids',
        'targeted_city_ids',
        'amount_collected',
        'discount_requested',
        'discount_type',
        'discount_reason',
        'starts_at',
        'ends_at',
        'status',
        'approval_status',
        'impressions_count',
        'clicks_count',
    ];

    protected $appends = [
        'banner_image_url',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'targeted_state_ids' => 'array',
            'targeted_city_ids' => 'array',
            'amount_collected' => 'decimal:2',
            'impressions_count' => 'integer',
            'clicks_count' => 'integer',
        ];
    }

    public function getBannerImageUrlAttribute(): ?string
    {
        if (! $this->banner_image_path) {
            return null;
        }

        if (str_starts_with($this->banner_image_path, 'http://') || str_starts_with($this->banner_image_path, 'https://')) {
            return $this->banner_image_path;
        }

        return Storage::url($this->banner_image_path);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('approval_status')
                    ->orWhere('approval_status', 'approved');
            })
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now());
    }

    public function scopeForSlot($query, string $slot)
    {
        return $query->where('placement_slot', $slot);
    }

    public function promotable()
    {
        return $this->morphTo();
    }

    public function agent()
    {
        return $this->belongsTo(Admin::class, 'agent_id');
    }
}

