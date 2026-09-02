<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSupportTicketController
{
    public function index(Request $request)
    {
        $query = SupportTicket::with('user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('subject', 'like', '%'.$request->search.'%')
                    ->orWhere('message', 'like', '%'.$request->search.'%');
            });
        }

        $tickets = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/support-tickets/index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'priority', 'search']),
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        $ticket->load(['user', 'replies.user', 'replies.admin', 'internalNotes.admin']);

        return Inertia::render('admin/support-tickets/show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $request->validate([
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240',
            'status' => 'nullable|in:open,in_progress,resolved,closed',
        ]);

        $reply = SupportTicketReply::create([
            'support_ticket_id' => $ticket->id,
            'admin_id' => auth('admin')->id(),
            'message' => $request->message,
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('support/attachments', 'public');
            $reply->update(['attachment_path' => $path]);
        }

        if ($request->filled('status')) {
            $ticket->update(['status' => $request->status]);
        } else {
            // Default to in_progress if an admin replies and it's open
            if ($ticket->status === 'open') {
                $ticket->update(['status' => 'in_progress']);
            }
        }

        return back()->with('success', 'Reply sent successfully.');
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        $ticket->update(['status' => $request->status]);

        return back()->with('success', 'Ticket status updated.');
    }
}
