<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\InternalTicket;

class InternalTicketReplyController extends Controller
{
    public function store(Request $request, InternalTicket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $ticket->replies()->create([
            'admin_id' => $request->user('admin')->id,
            'message' => $validated['message'],
        ]);

        return back()->with('success', 'Reply added successfully.');
    }
}
