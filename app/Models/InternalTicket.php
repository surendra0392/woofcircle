<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternalTicket extends Model
{
    protected $fillable = [
        'admin_id',
        'assigned_to',
        'subject',
        'priority',
        'status',
        'message',
        'escalated_at',
        'returned_at',
        'transferred_at',
    ];

    protected $casts = [
        'escalated_at' => 'datetime',
        'returned_at' => 'datetime',
        'transferred_at' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(Admin::class, 'assigned_to');
    }

    public function replies()
    {
        return $this->hasMany(InternalTicketReply::class);
    }

    /**
     * Scope to find internal tickets that need agent-team attention.
     *
     * Identifies stalled handoffs:
     * 1. Unclaimed for 24+ hours — created, never assigned, still open
     * 2. Transferred 7+ days ago and still unresolved (bouncing between agents)
     */
    public function scopeNeedsAttention($query)
    {
        return $query->where(function ($q) {
            // 1. Unclaimed — never assigned, created 24+ hours ago
            $q->whereNull('assigned_to')
                ->whereNotIn('status', ['resolved', 'closed'])
                ->where('created_at', '<', now()->subHours(24));
        })->orWhere(function ($q) {
            // 2. Chronic handoffs — transferred 7+ days ago, still unresolved
            $q->whereNotNull('transferred_at')
                ->whereNotIn('status', ['resolved', 'closed'])
                ->where('transferred_at', '<', now()->subDays(7));
        });
    }
}
