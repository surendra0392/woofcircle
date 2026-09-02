<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Admin;
use App\Models\Payout;
use App\Models\SupportTicket;
use App\Models\LeaveRequest;
use Inertia\Inertia;

class HrDashboardController extends Controller
{
    public function index()
    {
        $admin = auth('admin')->user();
        $adminId = $admin->id;

        $employeesQuery = Admin::where('is_active', true);
        $payoutsQuery = Payout::where('status', 'pending');

        if ($admin->role !== 'superadmin') {
            if ($admin->city_id) {
                $employeesQuery->where('city_id', $admin->city_id);
                $payoutsQuery->whereHas('admin', function ($q) use ($admin) {
                    $q->where('city_id', $admin->city_id);
                });
            } elseif ($admin->state_id) {
                $employeesQuery->where('state_id', $admin->state_id);
                $payoutsQuery->whereHas('admin', function ($q) use ($admin) {
                    $q->where('state_id', $admin->state_id);
                });
            }
        }

        $totalActiveEmployees = $employeesQuery->count();
        $pendingPayoutsCount = $payoutsQuery->count();
        $pendingPayoutsTotal = (float) $payoutsQuery->sum('amount');
        $ticketsCount = SupportTicket::where('assigned_to', $adminId)
            ->whereIn('status', ['open', 'in_progress'])
            ->count();

        // Pending leave requests count
        $targetIds = auth('admin')->user()->allSubordinates()->pluck('id')->push($adminId);
        $pendingLeavesCount = LeaveRequest::whereIn('admin_id', $targetIds)
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Hr/Dashboard', [
            'kpis' => [
                'totalActiveEmployees' => $totalActiveEmployees,
                'pendingPayoutsCount' => $pendingPayoutsCount,
                'pendingPayoutsTotal' => $pendingPayoutsTotal,
                'ticketsCount' => $ticketsCount,
                'pendingLeavesCount' => $pendingLeavesCount,
            ]
        ]);
    }
}
