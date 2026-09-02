<?php

namespace App\Http\Controllers\Admin;

use App\Support\DashboardStats;
use Inertia\Inertia;

class AdminDashboardController
{
    public function index()
    {
        $stats = DashboardStats::all();
        $recent = DashboardStats::recentActivity();
        $topStates = DashboardStats::topStates();

        return Inertia::render('admin/dashboard', array_merge(
            $stats,
            $recent,
            ['top_states' => $topStates],
        ));
    }
}
