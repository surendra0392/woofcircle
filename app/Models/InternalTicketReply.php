<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternalTicketReply extends Model
{
    protected $fillable = [
        'internal_ticket_id',
        'admin_id',
        'message',
    ];

    public function ticket()
    {
        return $this->belongsTo(InternalTicket::class, 'internal_ticket_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
