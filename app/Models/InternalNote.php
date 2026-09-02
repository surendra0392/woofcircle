<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternalNote extends Model
{
    protected $fillable = [
        'support_ticket_id',
        'admin_id',
        'message',
    ];

    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
