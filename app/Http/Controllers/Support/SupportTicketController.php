<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HasTransferValidation;
use App\Events\TicketAssignedToHr;
use App\Events\UnassignedTicketsCountChanged;
use App\Models\Admin;
use App\Models\AdminAuditLog;
use App\Models\SupportTicket;
use App\Models\InternalTicket;
use App\Models\SupportTicketReply;
use App\Models\InternalTicketReply;
use App\Models\InternalNote;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    use HasTransferValidation;

    /**
     * Role lists are defined in config/roles.php — the single source of truth.
     * Inline config() calls ensure zero drift from the middleware that gates
     * each portal (CheckSupportAgent, CheckHr, etc.).
     */
    public function show($type, $id)
    {
        if ($type === 'external') {
            // Load all replies AND internal notes — support agents need to
            // see HR annotations to understand why a ticket was returned.
            $ticket = SupportTicket::with(['user', 'replies.admin', 'replies.user', 'assignedTo', 'internalNotes.admin'])->findOrFail($id);
            $formattedTicket = [
                'id' => $ticket->id,
                'type' => 'external',
                'subject' => $ticket->subject,
                'message' => $ticket->message,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'due_at' => $ticket->due_at?->toISOString(),
                'created_at' => $ticket->created_at->toISOString(),
                'requester' => [
                    'name' => $ticket->user->name,
                    'email' => $ticket->user->email,
                ],
                'assigned_to' => $ticket->assignedTo,
                'replies' => $ticket->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'message' => $reply->message,
                        'created_at' => $reply->created_at->toISOString(),
                        'author' => $reply->admin ? $reply->admin->name : ($reply->user ? $reply->user->name : 'System'),
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
            
            $admin = auth('admin')->user();
            if ($admin->role !== 'superadmin') {
                if ($admin->city_id && $admin->city_id !== $ticket->user->city_id) {
                    abort(403, 'Unauthorized location access');
                } elseif (!$admin->city_id && $admin->state_id && $admin->state_id !== $ticket->user->state_id) {
                    abort(403, 'Unauthorized location access');
                }
            }
        } else {
            $ticket = InternalTicket::with(['admin', 'replies.admin', 'assignedTo'])->findOrFail($id);
            $formattedTicket = [
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
                'assigned_to' => $ticket->assignedTo,
                'replies' => $ticket->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'message' => $reply->message,
                        'created_at' => $reply->created_at->toISOString(),
                        'author' => $reply->admin ? $reply->admin->name : 'Unknown',
                        'is_admin' => true,
                    ];
                }),
            ];
            
            $admin = auth('admin')->user();
            if ($admin->role !== 'superadmin') {
                if ($admin->city_id && $admin->city_id !== $ticket->admin->city_id) {
                    abort(403, 'Unauthorized location access');
                } elseif (!$admin->city_id && $admin->state_id && $admin->state_id !== $ticket->admin->state_id) {
                    abort(403, 'Unauthorized location access');
                }
            }
        }

        $eligibleTargets = $this->eligibleTargets(config('roles.support'));

        // Compute HR-role targets from the hierarchy for the standard Escalate
        // to HR flow — only admins in the current user's reporting tree.
        $hrTargets = $type === 'external'
            ? $this->eligibleTargets(array_diff(config('roles.hr'), ['superadmin']))
            : collect();

        // For superadmins only: query ALL HR-role admins across the org,
        // bypassing the hierarchy restriction. This lets a superadmin
        // escalate to any HR admin regardless of reporting tree.
        $globalHrTargets = $admin->role === 'superadmin' && $type === 'external'
            ? \App\Models\Admin::whereIn('role', array_diff(config('roles.hr'), ['superadmin']))
                ->where('is_active', true)
                ->get(['id', 'name', 'role'])
                ->map(fn($target) => [
                    'id' => $target->id,
                    'name' => $target->name,
                    'role' => $target->role,
                ])
            : collect();

        // For superadmins only: query ALL support-role admins across the org,
        // bypassing the hierarchy restriction. This lets a superadmin transfer
        // a ticket to any support agent regardless of reporting tree.
        $globalSupportTargets = $admin->role === 'superadmin'
            ? \App\Models\Admin::whereIn('role', config('roles.support'))
                ->where('is_active', true)
                ->get(['id', 'name', 'role'])
                ->map(fn($target) => [
                    'id' => $target->id,
                    'name' => $target->name,
                    'role' => $target->role,
                ])
            : collect();

        return inertia('Support/Workspace', [
            'ticket' => $formattedTicket,
            'eligibleTargets' => $eligibleTargets,
            'hrTargets' => $hrTargets,
            'globalHrTargets' => $globalHrTargets,
            'globalSupportTargets' => $globalSupportTargets,
        ]);
    }

    public function claim($type, $id)
    {
        $adminId = auth('admin')->id();

        if ($type === 'external') {
            $ticket = SupportTicket::findOrFail($id);
            $ticket->update(['assigned_to' => $adminId]);
        } else {
            $ticket = InternalTicket::findOrFail($id);
            $ticket->update(['assigned_to' => $adminId]);
        }

        // Broadcast updated unassigned count to all support agents — claiming
        // a ticket decreases the queue size and the sidebar badge should reflect
        // that immediately without needing a page refresh.
        $freshUnassignedCount = SupportTicket::whereNull('assigned_to')
            ->where('status', 'open')
            ->count();
        UnassignedTicketsCountChanged::dispatch($freshUnassignedCount);

        return redirect()->back()->with('success', 'Ticket claimed successfully.');
    }

    public function updateStatus(Request $request, $type, $id)
    {
        $request->validate(['status' => 'required|string']);

        if ($type === 'external') {
            $ticket = SupportTicket::findOrFail($id);
            $ticket->update(['status' => $request->status]);
        } else {
            $ticket = InternalTicket::findOrFail($id);
            $ticket->update(['status' => $request->status]);
        }

        return redirect()->back()->with('success', 'Ticket status updated.');
    }

    public function reply(Request $request, $type, $id)
    {
        $request->validate(['message' => 'required|string']);

        if ($type === 'external') {
            SupportTicketReply::create([
                'support_ticket_id' => $id,
                'admin_id' => auth('admin')->id(),
                'message' => $request->message,
            ]);
        } else {
            InternalTicketReply::create([
                'internal_ticket_id' => $id,
                'admin_id' => auth('admin')->id(),
                'message' => $request->message,
            ]);
        }

        return redirect()->back()->with('success', 'Reply added.');
    }

    public function escalate(Request $request, $type, $id)
    {
        $request->validate([
            'assigned_to' => 'required|exists:admins,id',
            'note' => 'nullable|string|max:5000',
        ]);

        // Only external (user-facing) tickets can be escalated to HR.
        // Internal admin tickets stay within the support team.
        if ($type !== 'external') {
            return redirect()->back()->withErrors([
                'assigned_to' => 'Only external tickets can be escalated to HR.',
            ]);
        }

        $admin = auth('admin')->user();

        // Hierarchy check — superadmins can escalate to ANY HR admin across
        // the org (bypassed when the registered global_escalate route is used).
        // Regular support agents must escalate within their reporting tree.
        $isSuperadmin = $admin->role === 'superadmin';
        if (!$isSuperadmin) {
            $validTargets = $admin->allSubordinates()->pluck('id');
            if ($admin->manager_id) {
                $validTargets->push($admin->manager_id);
            }

            if (!$validTargets->contains($request->assigned_to)) {
                return redirect()->back()->withErrors([
                    'assigned_to' => 'You cannot escalate a ticket outside your team hierarchy.',
                ]);
            }
        }

        // Validate that the target has an HR role — this is the key difference
        // from the standard transfer() which only allows support roles.
        $targetAdmin = \App\Models\Admin::findOrFail($request->assigned_to);
        if (!in_array($targetAdmin->role, array_diff(config('roles.hr'), ['superadmin']))) {
            return redirect()->back()->withErrors([
                'assigned_to' => 'This user is not in HR. Use Transfer to assign to a support team member.',
            ]);
        }

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'assigned_to' => $request->assigned_to,
            'escalated_to_hr_at' => now(),
        ]);

        // Create an internal note explaining why the ticket is being escalated.
        $noteText = trim($request->input('note', ''));
        if ($noteText) {
            InternalNote::create([
                'support_ticket_id' => $ticket->id,
                'admin_id' => $admin->id,
                'message' => '[Escalated to HR] ' . $noteText,
            ]);
        }

        // Leave a system note so both HR and support know the ticket changed hands.
        SupportTicketReply::create([
            'support_ticket_id' => $ticket->id,
            'admin_id' => $admin->id,
            'message' => 'System Note: Ticket escalated to HR (' . $targetAdmin->name . ') by ' . $admin->name . '.' .
                ($noteText ? ' Reason: ' . $noteText : ''),
        ]);

        // Broadcast real-time update to the HR admin so their sidebar badge refreshes.
        $count = SupportTicket::where('assigned_to', $targetAdmin->id)
            ->whereIn('status', ['open', 'in_progress'])
            ->count();
        TicketAssignedToHr::dispatch($targetAdmin->id, $count);

        // If a superadmin escalated outside their hierarchy, record a dedicated
        // audit log entry so support managers can review escalation patterns.
        if ($isSuperadmin) {
            AdminAuditLog::create([
                'admin_id' => $admin->id,
                'action' => 'Global Escalate — bypassed hierarchy',
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'payload' => [
                    'ticket_id' => (int) $ticket->id,
                    'ticket_subject' => $ticket->subject,
                    'target_admin_id' => (int) $targetAdmin->id,
                    'target_admin_name' => $targetAdmin->name,
                    'target_admin_role' => $targetAdmin->role,
                    'note' => $noteText ?: null,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return redirect()->back()->with('success', 'Ticket escalated to HR successfully.');
    }

    public function transfer(Request $request, $type, $id)
    {
        $request->validate(['assigned_to' => 'required|exists:admins,id']);
        
        $admin = auth('admin')->user();

        // Hierarchy + role validation (reusable trait)
        $redirect = $this->validateTransferTarget(
            $request->assigned_to, config('roles.support'), 'assigned_to', 'ticket',
        );
        if ($redirect) {
            return $redirect;
        }

        $targetAdmin = Admin::findOrFail($request->assigned_to);

        if ($type === 'external') {
            $ticket = SupportTicket::findOrFail($id);
            $ticket->update([
                'assigned_to' => $request->assigned_to,
                'last_transferred_at' => now(),
            ]);

        SupportTicketReply::create([
            'support_ticket_id' => $id,
            'admin_id' => $admin->id,
            'message' => 'System Note: Ticket transferred to a new agent.',
        ]);

            // If target is HR, broadcast a real-time update so their sidebar badge refreshes.
            if (in_array($targetAdmin->role, array_diff(config('roles.hr'), ['superadmin']))) {
                $count = SupportTicket::where('assigned_to', $targetAdmin->id)
                    ->whereIn('status', ['open', 'in_progress'])
                    ->count();
                TicketAssignedToHr::dispatch($targetAdmin->id, $count);
            }
        } else {
            $ticket = InternalTicket::findOrFail($id);
            $ticket->update(['assigned_to' => $request->assigned_to]);
            
            InternalTicketReply::create([
                'internal_ticket_id' => $id,
                'admin_id' => $admin->id,
                'message' => 'System Note: Ticket transferred to a new agent.',
            ]);
        }

        return redirect()->back()->with('success', 'Ticket transferred successfully.');
    }

    public function globalTransfer(Request $request, $type, $id)
    {
        $request->validate(['assigned_to' => 'required|exists:admins,id']);

        $admin = auth('admin')->user();

        // Only superadmins can use global transfer — bypasses hierarchy
        // restrictions but still validates role.
        if ($admin->role !== 'superadmin') {
            return redirect()->back()->withErrors([
                'assigned_to' => 'Only superadmins can use global transfer.',
            ]);
        }

        // Role validation — target must be a support-role admin
        $targetAdmin = Admin::findOrFail($request->assigned_to);
        if (!in_array($targetAdmin->role, config('roles.support'))) {
            return redirect()->back()->withErrors([
                'assigned_to' => 'This user is not eligible to receive support tickets. Only support-role and superadmin users can be assigned tickets.',
            ]);
        }

        if ($type === 'external') {
            $ticket = SupportTicket::findOrFail($id);
            $ticket->update([
                'assigned_to' => $request->assigned_to,
                'last_transferred_at' => now(),
            ]);

            SupportTicketReply::create([
                'support_ticket_id' => $id,
                'admin_id' => $admin->id,
                'message' => 'System Note: Ticket globally transferred to ' . $targetAdmin->name . ' by ' . $admin->name . ' (bypassed hierarchy).',
            ]);

            // If target is HR, broadcast a real-time update so their sidebar badge refreshes.
            if (in_array($targetAdmin->role, array_diff(config('roles.hr'), ['superadmin']))) {
                $count = SupportTicket::where('assigned_to', $targetAdmin->id)
                    ->whereIn('status', ['open', 'in_progress'])
                    ->count();
                TicketAssignedToHr::dispatch($targetAdmin->id, $count);
            }
        } else {
            $ticket = InternalTicket::findOrFail($id);
            $ticket->update(['assigned_to' => $request->assigned_to]);

            InternalTicketReply::create([
                'internal_ticket_id' => $id,
                'admin_id' => $admin->id,
                'message' => 'System Note: Ticket globally transferred to ' . $targetAdmin->name . ' by ' . $admin->name . ' (bypassed hierarchy).',
            ]);
        }

        // Audit log — record every global transfer for management review
        AdminAuditLog::create([
            'admin_id' => $admin->id,
            'action' => 'Global Transfer — bypassed hierarchy',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'payload' => [
                'ticket_id' => (int) ($ticket->id ?? $id),
                'target_admin_id' => (int) $targetAdmin->id,
                'target_admin_name' => $targetAdmin->name,
                'target_admin_role' => $targetAdmin->role,
                'ticket_type' => $type,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Ticket globally transferred successfully.');
    }
}
