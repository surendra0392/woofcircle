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

        try {
            $user = $ticket->user;
            if ($user && $user->email) {
                \Illuminate\Support\Facades\Mail::to($user->email)
                    ->send(new \App\Mail\SupportTicketReplyMail(
                        $user->name,
                        $ticket,
                        $request->message,
                        auth('admin')->user()->name ?? 'Support Concierge'
                    ));
            }

            // WhatsApp & Push to user
            try {
                $whatsAppService = app(\App\Services\WhatsAppService::class);
                if ($whatsAppService->isEnabled() && !empty($user?->mobile_number)) {
                    $whatsAppService->sendTextMessage(
                        $user->mobile_number,
                        "💬 *WoofCircle Support Ticket #{$ticket->id} Update*\n\nOur concierge team has replied to: *{$ticket->subject}*\n\"" . \Illuminate\Support\Str::limit(strip_tags($request->message), 140) . "\"\n\nView conversation: " . route('dashboard.support.show', $ticket->id)
                    );
                }
                $pushService = app(\App\Services\PushNotificationService::class);
                if ($pushService->isEnabled() && $user) {
                    $pushService->sendToUser(
                        $user->id,
                        "Support Ticket #{$ticket->id} Reply 💬",
                        "New reply from concierge: " . \Illuminate\Support\Str::limit(strip_tags($request->message), 80),
                        route('dashboard.support.show', $ticket->id)
                    );
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('WhatsApp/Push ticket reply error: ' . $e->getMessage());
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send ticket reply notifications: ' . $e->getMessage());
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
