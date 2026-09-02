<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'business_name',
        'contact_person',
        'phone',
        'status',
        'notes',
        'next_follow_up_date',
    ];

    protected $casts = [
        'next_follow_up_date' => 'date',
    ];

    public function agent()
    {
        return $this->belongsTo(Admin::class, 'agent_id');
    }
}
