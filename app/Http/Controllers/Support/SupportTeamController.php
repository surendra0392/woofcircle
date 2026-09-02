<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SupportTeamController extends Controller
{
    public function index()
    {
        $admin = auth('admin')->user();

        $subordinates = $admin->allSubordinates()->values()->map(function ($sub) {
            $supportTicketsAssigned = \App\Models\SupportTicket::where('assigned_to', $sub->id)->get();
            $internalTicketsAssigned = \App\Models\InternalTicket::where('assigned_to', $sub->id)->get();

            $open = $supportTicketsAssigned->where('status', 'open')->count() + $internalTicketsAssigned->where('status', 'open')->count();
            $resolved = $supportTicketsAssigned->where('status', 'resolved')->count() + $internalTicketsAssigned->where('status', 'resolved')->count();

            return [
                'id' => $sub->id,
                'name' => $sub->name,
                'email' => $sub->email,
                'role' => $sub->role,
                'performance' => [
                    'open_tickets' => $open,
                    'resolved_tickets' => $resolved,
                    'total_assigned' => $supportTicketsAssigned->count() + $internalTicketsAssigned->count(),
                ]
            ];
        });

        return inertia('Support/Team/Index', [
            'team' => $subordinates,
        ]);
    }
}
