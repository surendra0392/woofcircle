<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferRequest extends Model
{
    protected $fillable = [
        'litter_id',
        'buyer_id',
        'breeder_id',
        'pet_name',
        'gender',
        'date_of_birth',
        'status',
        'logs',
    ];

    protected $casts = [
        'logs' => 'array',
        'date_of_birth' => 'date',
    ];

    /**
     * Get the litter associated with the transfer request.
     */
    public function litter(): BelongsTo
    {
        return $this->belongsTo(Litter::class);
    }

    /**
     * Get the buyer associated with the transfer request.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Get the breeder associated with the transfer request.
     */
    public function breeder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'breeder_id');
    }

    /**
     * Append a log entry to the request audit trail.
     */
    public function addLog(?User $user, string $action, ?string $ip = null, ?string $userAgent = null): void
    {
        $currentLogs = $this->logs ?? [];
        $currentLogs[] = [
            'timestamp' => now()->toIso8601String(),
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->name : 'System',
            'user_email' => $user ? $user->email : null,
            'action' => $action,
            'ip' => $ip ?? request()->ip(),
            'user_agent' => $userAgent ?? request()->userAgent(),
        ];
        $this->logs = $currentLogs;
        $this->save();
    }
}
