<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $fillable = [
        'user_id',
        'subject',
        'category',
        'priority',
        'message',
        'status',
        'attachment_path',
        'assigned_to',
        'escalated_to_hr_at',
        'returned_to_queue_at',
        'last_transferred_at',
        'due_at',
    ];

    protected $casts = [
        'escalated_to_hr_at' => 'datetime',
        'returned_to_queue_at' => 'datetime',
        'last_transferred_at' => 'datetime',
        'due_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(SupportTicketReply::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(Admin::class, 'assigned_to');
    }

    public function internalNotes()
    {
        return $this->hasMany(InternalNote::class);
    }

    /**
     * Scope to find tickets that need management attention.
     *
     * Identifies stalled handoffs:
     * 1. Escalated to HR but never returned (ticket is stuck in HR purgatory)
     * 2. Returned from HR but unclaimed for over 24 hours (no agent picked it up)
     * 3. Transferred or escalated and still unresolved after 7+ days (bouncing between teams)
     */
    public function scopeNeedsAttention($query)
    {
        return $query->where(function ($q) {
            // 1. Stalled in HR — escalated, never returned, still open
            $q->whereNotNull('escalated_to_hr_at')
                ->whereNull('returned_to_queue_at')
                ->whereNotIn('status', ['resolved', 'closed']);
        })->orWhere(function ($q) {
            // 2. Stalled after return — returned to queue but unclaimed for 24+ hours
            $q->whereNotNull('returned_to_queue_at')
                ->whereNull('assigned_to')
                ->whereNotIn('status', ['resolved', 'closed'])
                ->where('returned_to_queue_at', '<', now()->subHours(24));
        })->orWhere(function ($q) {
            // 3. Chronic handoffs — transferred or escalated 7+ days ago and still open
            $q->where(function ($handoff) {
                $handoff->whereNotNull('last_transferred_at')
                    ->orWhereNotNull('escalated_to_hr_at');
            })->whereNotIn('status', ['resolved', 'closed'])
                ->where(function ($stale) {
                    $stale->where('last_transferred_at', '<', now()->subDays(7))
                        ->orWhere('escalated_to_hr_at', '<', now()->subDays(7));
                });
        });
    }

    /**
     * Tag this ticket with its stall category, matching the frontend
     * ATTENTION_CATEGORIES map and the scopeNeedsAttention conditions.
     *
     * @return string  One of: 'stalled_in_hr', 'stalled_after_return', 'chronic_handoff'
     */
    public function attentionCategory(): string
    {
        if ($this->escalated_to_hr_at && ! $this->returned_to_queue_at) {
            return 'stalled_in_hr';
        }
        if ($this->returned_to_queue_at && ! $this->assigned_to) {
            return 'stalled_after_return';
        }
        return 'chronic_handoff';
    }
}
