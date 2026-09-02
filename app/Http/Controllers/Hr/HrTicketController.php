<?php

namespace App\Http\Controllers\Hr;

use App\Events\TicketAssignedToHr;
use App\Events\TicketReturnedFromHr;
use App\Events\UnassignedTicketsCountChanged;
use App\Http\Controllers\Controller;
use App\Models\InternalNote;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HrTicketController extends Controller
{
    /**
     * Show support tickets assigned to the current HR admin.
     * HR cannot be assigned InternalTicket — only SupportTicket — because
     * the SupportTicketController::transfer() now validates roles server-side.
     * This view catches any pre-existing or edge-case assignments.
     */
    public function index()
    {
        $adminId = auth('admin')->id();

        $supportTickets = SupportTicket::with(['user', 'assignedTo'])
            ->where('assigned_to', $adminId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'type' => 'external',
                    'subject' => $ticket->subject,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'created_at' => $ticket->created_at->toISOString(),
                    'requester_name' => $ticket->user->name,
                ];
            });

        $internalTickets = \App\Models\InternalTicket::with(['admin', 'assignedTo'])
            ->where('assigned_to', $adminId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'type' => 'internal',
                    'subject' => $ticket->subject,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'created_at' => $ticket->created_at->toISOString(),
                    'requester_name' => $ticket->admin->name,
                ];
            });

        $tickets = $supportTickets->concat($internalTickets)->sortByDesc('created_at')->values();

        return Inertia::render('Hr/Tickets/Index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show a single support ticket (read-only) so HR can review before
     * deciding to return it to the support queue.
     */
    public function show(Request $request, $id)
    {
        $adminId = auth('admin')->id();
        $type = $request->query('type', 'external');

        if ($type === 'internal') {
            $ticket = \App\Models\InternalTicket::with(['admin', 'replies.admin', 'assignedTo'])
                ->where('assigned_to', $adminId)
                ->findOrFail($id);

            $formatted = [
                'id' => $ticket->id,
                'type' => 'internal',
                'subject' => $ticket->subject,
                'message' => $ticket->message,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at->toISOString(),
                'requester' => [
                    'name' => $ticket->admin->name,
                    'email' => $ticket->admin->email,
                ],
                'assigned_to' => $ticket->assignedTo ? $ticket->assignedTo->name : null,
                'replies' => $ticket->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'message' => $reply->message,
                        'created_at' => $reply->created_at->toISOString(),
                        'author' => $reply->admin ? $reply->admin->name : 'System',
                        'is_admin' => true,
                        'is_internal_note' => false,
                    ];
                }),
                'internal_notes' => [],
            ];
        } else {
            $ticket = SupportTicket::with(['user', 'replies.admin', 'replies.user', 'assignedTo', 'internalNotes.admin'])
                ->where('assigned_to', $adminId)
                ->findOrFail($id);

            $formatted = [
                'id' => $ticket->id,
                'type' => 'external',
                'subject' => $ticket->subject,
                'message' => $ticket->message,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at->toISOString(),
                'requester' => [
                    'name' => $ticket->user->name,
                    'email' => $ticket->user->email,
                ],
                'assigned_to' => $ticket->assignedTo ? $ticket->assignedTo->name : null,
                'replies' => $ticket->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'message' => $reply->message,
                        'created_at' => $reply->created_at->toISOString(),
                        'author' => $reply->admin
                            ? $reply->admin->name
                            : ($reply->user ? $reply->user->name : 'System'),
                        'is_admin' => $reply->admin_id !== null,
                        'is_internal_note' => false,
                    ];
                }),
                'internal_notes' => $ticket->internalNotes->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'message' => $note->message,
                        'created_at' => $note->created_at->toISOString(),
                        'author' => $note->admin ? $note->admin->name : 'System',
                    ];
                }),
            ];
        }

        return Inertia::render('Hr/Tickets/Show', [
            'ticket' => $formatted,
        ]);
    }

    /**
     * Return the ticket to the unassigned support queue so any available
     * support agent can claim it.  An optional private note is attached
     * as an internal note — visible only to admins (HR + support), never
     * to the end user who created the ticket.
     */
    public function unassign(Request $request, $id)
    {
        $adminId = auth('admin')->id();
        $type = $request->query('type', 'external');

        if ($type === 'internal') {
            $ticket = \App\Models\InternalTicket::where('assigned_to', $adminId)->findOrFail($id);
            $ticket->update(['assigned_to' => null]);
            
            // Re-dispatch internal count
            $freshCount = \App\Models\InternalTicket::whereNull('assigned_to')->where('status', 'open')->count();
            \App\Events\InternalTicketsUnassignedCountChanged::dispatch($freshCount);
        } else {
            $ticket = SupportTicket::where('assigned_to', $adminId)
                ->findOrFail($id);

            $ticket->update([
                'assigned_to' => null,
                'returned_to_queue_at' => now(),
            ]);

            $note = trim($request->input('note', ''));

            if ($note) {
                InternalNote::create([
                    'support_ticket_id' => $ticket->id,
                    'admin_id' => $adminId,
                    'message' => $note,
                ]);
            }

            // Always leave a system note so support knows the ticket was reviewed
            SupportTicketReply::create([
                'support_ticket_id' => $ticket->id,
                'admin_id' => $adminId,
                'message' => 'System Note: Ticket returned to the general support queue by HR.',
            ]);

            // Broadcast updated unassigned count to all support agents so their
            // sidebar badge refreshes immediately when a ticket returns to queue.
            $freshUnassignedCount = SupportTicket::whereNull('assigned_to')
                ->where('status', 'open')
                ->count();
            UnassignedTicketsCountChanged::dispatch($freshUnassignedCount);
            
            // Notify original agent
            $originalAgent = SupportTicketReply::where('support_ticket_id', $ticket->id)
                ->whereNotNull('admin_id')
                ->where('admin_id', '!=', $adminId)
                ->where('message', 'like', 'System Note: Ticket%')
                ->latest()
                ->first();

            if ($originalAgent) {
                TicketReturnedFromHr::dispatch(
                    $originalAgent->admin_id,
                    $ticket->id,
                    $ticket->subject,
                );
            }
        }

        // Broadcast the decremented count to the HR admin's own badge so it
        // updates in real-time even if they navigated away while the ticket
        // was being returned.
        $freshHrCount = SupportTicket::where('assigned_to', $adminId)->whereIn('status', ['open', 'in_progress'])->count() 
                      + \App\Models\InternalTicket::where('assigned_to', $adminId)->whereIn('status', ['open', 'in_progress'])->count();
        TicketAssignedToHr::dispatch($adminId, $freshHrCount);

        return redirect()->route('hr.tickets.index')
            ->with('success', 'Ticket returned to the support queue.');
    }

    /**
     * Add a reply or internal note to the ticket.
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
            'is_internal' => 'boolean',
        ]);

        $adminId = auth('admin')->id();
        $type = $request->query('type', 'external');
        $isInternal = $request->boolean('is_internal');

        if ($type === 'internal') {
            $ticket = \App\Models\InternalTicket::where('assigned_to', $adminId)->findOrFail($id);
            
            \App\Models\InternalTicketReply::create([
                'internal_ticket_id' => $ticket->id,
                'admin_id' => $adminId,
                'message' => $request->message,
            ]);
        } else {
            $ticket = SupportTicket::where('assigned_to', $adminId)->findOrFail($id);
            
            if ($isInternal) {
                InternalNote::create([
                    'support_ticket_id' => $ticket->id,
                    'admin_id' => $adminId,
                    'message' => $request->message,
                ]);
            } else {
                SupportTicketReply::create([
                    'support_ticket_id' => $ticket->id,
                    'admin_id' => $adminId,
                    'message' => $request->message,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Reply added successfully.');
    }
}
