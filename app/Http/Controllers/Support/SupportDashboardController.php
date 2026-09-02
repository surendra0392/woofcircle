<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SupportDashboardController extends Controller
{
    public function index()
    {
        $admin = auth('admin')->user();
        
        $supportBaseQuery = \App\Models\SupportTicket::where(function ($q) {
            $q->whereNull('assigned_to')->orWhereHas('assignedTo', function ($sub) {
                $sub->whereIn('role', config('roles.support'));
            });
        });

        $internalBaseQuery = \App\Models\InternalTicket::where(function ($q) {
            $q->whereNull('assigned_to')->orWhereHas('assignedTo', function ($sub) {
                $sub->whereIn('role', config('roles.support'));
            });
        });

        if ($admin->role !== 'superadmin') {
            if ($admin->city_id) {
                $supportBaseQuery->whereHas('user', fn($q) => $q->where('city_id', $admin->city_id));
                $internalBaseQuery->whereHas('creator', fn($q) => $q->where('city_id', $admin->city_id));
            } elseif ($admin->state_id) {
                $supportBaseQuery->whereHas('user', fn($q) => $q->where('state_id', $admin->state_id));
                $internalBaseQuery->whereHas('creator', fn($q) => $q->where('state_id', $admin->state_id));
            }
        }

        $openTickets = (clone $supportBaseQuery)->where('status', 'open')->count() +
            (clone $internalBaseQuery)->where('status', 'open')->count();

        $resolvedTickets = (clone $supportBaseQuery)->where('status', 'resolved')->count() +
            (clone $internalBaseQuery)->where('status', 'resolved')->count();

        $myTickets = \App\Models\SupportTicket::where('assigned_to', $admin->id)->count() +
            \App\Models\InternalTicket::where('assigned_to', $admin->id)->count();

        return inertia('Support/Dashboard', [
            'kpis' => [
                'open_tickets' => $openTickets,
                'resolved_tickets' => $resolvedTickets,
                'my_tickets' => $myTickets,
            ]
        ]);
    }
}
