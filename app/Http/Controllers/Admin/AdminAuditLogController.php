<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AdminAuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAuditLogController
{
    /**
     * Display a listing of admin audit logs.
     */
    public function index(Request $request)
    {
        $query = AdminAuditLog::with('admin')->latest();

        // Search Filter
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('action', 'like', '%'.$request->search.'%')
                    ->orWhere('ip_address', 'like', '%'.$request->search.'%')
                    ->orWhereHas('admin', function ($q) use ($request) {
                        $q->where('name', 'like', '%'.$request->search.'%');
                    });
            });
        }

        // Admin Filter
        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->admin_id);
        }

        // Method Filter
        if ($request->filled('method')) {
            $query->where('method', $request->method);
        }

        // Date Range Filter
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $logs = $query->paginate(50)->withQueryString();
        $admins = Admin::select('id', 'name')->get();

        return Inertia::render('admin/audit-logs', [
            'logs' => $logs,
            'admins' => $admins,
            'filters' => $request->only(['search', 'admin_id', 'method', 'start_date', 'end_date']),
        ]);
    }
}
