<?php

namespace App\Http\Controllers;

use App\Events\UnassignedTicketsCountChanged;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportTicketController
{
    public function index()
    {
        $tickets = SupportTicket::where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('dashboard/support/index', [
            'tickets' => $tickets,
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        // Ensure the ticket belongs to the user
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        // Internal notes are now stored in a separate internal_notes table and
        // never loaded here — only public replies are visible to the end user.
        $ticket->load(['replies.user', 'replies.admin']);

        return Inertia::render('dashboard/support/show', [
            'ticket' => $ticket,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        $dueHours = match($validated['priority']) {
            'critical' => 1,
            'high' => 4,
            'medium' => 24,
            'low' => 72,
            default => 24,
        };

        $ticket = SupportTicket::create([
            'user_id' => auth()->id(),
            'subject' => $validated['subject'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'message' => $validated['message'],
            'status' => 'open',
            'due_at' => now()->addHours($dueHours),
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('support/attachments', 'public');
            $ticket->update(['attachment_path' => $path]);
        }

        // Broadcast updated unassigned count — new tickets start unassigned,
        // so the support portal's queue badge should reflect this immediately.
        try {
            $freshUnassignedCount = SupportTicket::whereNull('assigned_to')
                ->where('status', 'open')
                ->count();
            UnassignedTicketsCountChanged::dispatch($freshUnassignedCount);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to broadcast unassigned tickets count: ' . $e->getMessage());
        }

        try {
            $user = auth()->user();
            if ($user && $user->email) {
                \Illuminate\Support\Facades\Mail::to($user->email)
                    ->send(new \App\Mail\SupportTicketCreatedMail($user->name, $ticket));

                $supportStaffEmail = config('mail.support_username', 'support@woofcircle.in');
                \Illuminate\Support\Facades\Mail::to($supportStaffEmail)
                    ->send(new \App\Mail\SupportTicketStaffAlertMail($user->name, $user->email, $ticket));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send support ticket emails: ' . $e->getMessage());
        }

        return redirect()->route('dashboard.support.show', $ticket->id)
            ->with('success', 'Your support ticket has been created successfully.');
    }

    public function update(Request $request, SupportTicket $ticket)
    {
        // Ensure the ticket belongs to the user
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $reply = SupportTicketReply::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('support/attachments', 'public');
            $reply->update(['attachment_path' => $path]);
        }

        // If ticket was resolved/closed, reopen it when user replies?
        // Usually, we just keep it as is or change to 'open' if it was 'resolved'
        if ($ticket->status === 'resolved') {
            $ticket->update(['status' => 'open']);
        }

        return back()->with('success', 'Reply sent successfully.');
    }
}
