<?php

namespace App\Http\Controllers\Agent;

use App\Events\InternalTicketsUnassignedCountChanged;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\InternalTicket;

class InternalTicketController extends Controller
{
    /**
     * Role lists are defined in config/roles.php — the single source of truth.
     * Inline config() calls ensure zero drift from CheckFieldAgent middleware.
     */

    public function index(Request $request)
    {
        $admin = $request->user('admin');
        $subordinateIds = $admin->allSubordinates()->pluck('id')->toArray();
        $filter = $request->filter ?? 'all';

        if ($filter === 'assigned_to_me') {
            $tickets = InternalTicket::with(['admin', 'assignedTo'])
                ->where('assigned_to', $admin->id)
                ->latest()
                ->get();
        } elseif ($filter === 'needs_attention') {
            $tickets = InternalTicket::with(['admin', 'assignedTo'])
                ->needsAttention()
                ->latest()
                ->get()
                ->map(function ($ticket) {
                    // Map computed attention categories for the frontend badges
                    if ($ticket->transferred_at && $ticket->transferred_at->lt(now()->subDays(7))) {
                        $ticket->attention_category = 'chronic_handoff';
                    } elseif (!$ticket->assigned_to) {
                        $ticket->attention_category = 'stalled_after_return';
                    }
                    return $ticket;
                });
        } else {
            $tickets = InternalTicket::with(['admin', 'assignedTo'])
                ->where('admin_id', $admin->id)
                ->orWhereIn('admin_id', $subordinateIds)
                ->orWhere('assigned_to', $admin->id)
                ->orWhereIn('assigned_to', $subordinateIds)
                ->latest()
                ->get();
        }

        return inertia('Agent/Support/Index', [
            'tickets' => $tickets,
            'filters' => [
                'filter' => $filter,
            ],
        ]);
    }

    public function create()
    {
        return inertia('Agent/Support/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'message' => 'required|string',
        ]);

        $ticket = InternalTicket::create([
            'admin_id' => $request->user('admin')->id,
            'subject' => $validated['subject'],
            'priority' => $validated['priority'],
            'message' => $validated['message'],
            'status' => 'open',
        ]);

        // Broadcast updated unassigned count — new tickets start unassigned
        $freshCount = InternalTicket::whereNull('assigned_to')->where('status', 'open')->count();
        InternalTicketsUnassignedCountChanged::dispatch($freshCount);

        return redirect()->route('agent.support.show', $ticket)->with('success', 'Ticket created successfully.');
    }

    public function show(Request $request, InternalTicket $ticket)
    {
        $ticket->load(['admin', 'assignedTo', 'replies.admin']);

        // Build eligible transfer targets — subordinates + manager, filtered by agent-role
        $admin = $request->user('admin');
        $validTargets = $admin->allSubordinates();
        if ($admin->manager_id && $admin->manager) {
            $validTargets->push($admin->manager);
        }

        $eligibleTargets = $validTargets->filter(fn($target) => in_array($target->role, config('roles.agent')))
            ->map(fn($target) => [
                'id' => $target->id,
                'name' => $target->name,
                'role' => $target->role,
            ])->values();

        return inertia('Agent/Support/Show', [
            'ticket' => $ticket,
            'eligibleTargets' => $eligibleTargets,
        ]);
    }

    public function claim(Request $request, InternalTicket $ticket)
    {
        // Self-assignment on claim — not a transfer between agents.
        // Only set assigned_to without transferred_at to keep the
        // audit trail semantically accurate.
        $ticket->update(['assigned_to' => $request->user('admin')->id]);

        // Broadcast updated unassigned count — claiming decreases the queue
        $freshCount = InternalTicket::whereNull('assigned_to')->where('status', 'open')->count();
        InternalTicketsUnassignedCountChanged::dispatch($freshCount);

        return redirect()->back()->with('success', 'Ticket claimed successfully.');
    }

    public function transfer(Request $request, InternalTicket $ticket)
    {
        $request->validate(['assigned_to' => 'required|exists:admins,id']);

        $admin = $request->user('admin');

        // Verify hierarchy — can transfer to subordinates or manager
        $validTargets = $admin->allSubordinates()->pluck('id');
        if ($admin->manager_id) {
            $validTargets->push($admin->manager_id);
        }

        if (!$validTargets->contains($request->assigned_to)) {
            return redirect()->back()->withErrors([
                'assigned_to' => 'You cannot transfer a ticket to this user.',
            ]);
        }

        // Verify the target has an agent role — prevent tickets from leaving
        // the agent team (same pattern as the Support portal's role guard).
        $targetAdmin = \App\Models\Admin::findOrFail($request->assigned_to);
        if (!in_array($targetAdmin->role, config('roles.agent'))) {
            return redirect()->back()->withErrors([
                'assigned_to' => 'This user is not eligible to receive internal tickets. Only agent-role users can be assigned tickets.',
            ]);
        }

        $ticket->update([
            'assigned_to' => $request->assigned_to,
            'transferred_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Ticket transferred successfully.');
    }
}
