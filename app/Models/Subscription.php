<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'razorpay_subscription_id',
        'razorpay_plan_id',
        'plan_name',
        'status',
        'current_start',
        'current_end',
        'ended_at',
    ];

    protected $casts = [
        'current_start' => 'datetime',
        'current_end' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
