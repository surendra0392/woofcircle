<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\InternalTicket;

class SupportQueueController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'all');

        $admin = auth('admin')->user();

        // ── Needs Attention mode — only external tickets with stalled handoffs ──
        if ($filter === 'needs_attention') {
            $query = SupportTicket::with(['user', 'assignedTo'])
                ->needsAttention()
                ->latest();

            if ($admin->role !== 'superadmin') {
                if ($admin->city_id) {
                    $query->whereHas('user', fn($q) => $q->where('city_id', $admin->city_id));
                } elseif ($admin->state_id) {
                    $query->whereHas('user', fn($q) => $q->where('state_id', $admin->state_id));
                }
            }

            $tickets = $query->get()
                ->map(function ($ticket) {
                    return [
                        'id' => $ticket->id,
                        'type' => 'external',
                        'subject' => $ticket->subject,
                        'priority' => $ticket->priority,
                        'created_at' => $ticket->created_at->toISOString(),
                        'due_at' => $ticket->due_at?->toISOString(),
                        'requester_name' => $ticket->user->name,
                        'assigned_to' => $ticket->assignedTo ? $ticket->assignedTo->name : null,
                        'attention_category' => $ticket->attentionCategory(),
                    ];
                });

            return inertia('Support/Queue', [
                'tickets' => $tickets,
                'filter' => $filter,
            ]);
        }

        // ── Standard modes: all / external / internal ──
        $supportTickets = collect();
        if (in_array($filter, ['all', 'external'])) {
            $supportQuery = SupportTicket::with(['user', 'assignedTo'])
                ->where(function ($q) {
                    $q->whereNull('assigned_to')
                      ->orWhereHas('assignedTo', function ($sub) {
                          $sub->whereIn('role', config('roles.support'));
                      });
                })
                ->orderBy('created_at', 'desc');
            
            if ($admin->role !== 'superadmin') {
                if ($admin->city_id) {
                    $supportQuery->whereHas('user', fn($q) => $q->where('city_id', $admin->city_id));
                } elseif ($admin->state_id) {
                    $supportQuery->whereHas('user', fn($q) => $q->where('state_id', $admin->state_id));
                }
            }
                
            $supportTickets = $supportQuery->get()
                ->map(function ($ticket) {
                    return [
                        'id' => $ticket->id,
                        'type' => 'external',
                        'subject' => $ticket->subject,
                        'priority' => $ticket->priority,
                        'status' => $ticket->status,
                        'due_at' => $ticket->due_at?->toISOString(),
                        'created_at' => $ticket->created_at->toISOString(),
                        'requester_name' => $ticket->user->name,
                        'assigned_to' => $ticket->assignedTo ? $ticket->assignedTo->name : null,
                    ];
                });
        }

        $internalTickets = collect();
        if (in_array($filter, ['all', 'internal'])) {
            $internalQuery = InternalTicket::with(['admin', 'assignedTo'])
                ->where(function ($q) {
                    $q->whereNull('assigned_to')
                      ->orWhereHas('assignedTo', function ($sub) {
                          $sub->whereIn('role', config('roles.support'));
                      });
                })
                ->orderBy('created_at', 'desc');

            if ($admin->role !== 'superadmin') {
                if ($admin->city_id) {
                    $internalQuery->whereHas('creator', fn($q) => $q->where('city_id', $admin->city_id));
                } elseif ($admin->state_id) {
                    $internalQuery->whereHas('creator', fn($q) => $q->where('state_id', $admin->state_id));
                }
            }
                
            $internalTickets = $internalQuery->get()
                ->map(function ($ticket) {
                    return [
                        'id' => $ticket->id,
                        'type' => 'internal',
                        'subject' => $ticket->subject,
                        'priority' => $ticket->priority,
                        'status' => $ticket->status,
                        'created_at' => $ticket->created_at->toISOString(),
                        'requester_name' => $ticket->admin->name,
                        'assigned_to' => $ticket->assignedTo ? $ticket->assignedTo->name : null,
                    ];
                });
        }

        $allTickets = $supportTickets->concat($internalTickets)->sortByDesc('created_at')->values();

        return inertia('Support/Queue', [
            'tickets' => $allTickets,
            'filter' => $filter,
        ]);
    }

}
