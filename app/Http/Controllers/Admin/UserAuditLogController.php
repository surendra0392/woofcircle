<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserAuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserAuditLogController
{
    /**
     * Display a listing of user audit logs.
     */
    public function index(Request $request)
    {
        $query = UserAuditLog::with(['user.role', 'user.roles'])->latest();

        // Search Filter
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('action', 'like', '%'.$request->search.'%')
                    ->orWhere('ip_address', 'like', '%'.$request->search.'%')
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->where('name', 'like', '%'.$request->search.'%')
                            ->orWhere('email', 'like', '%'.$request->search.'%');
                    });
            });
        }

        // Method Filter
        if ($request->filled('method')) {
            $query->where('method', $request->method);
        }

        // Role Filter
        if ($request->filled('role')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role_id', $request->role)
                  ->orWhereHas('roles', function ($q2) use ($request) {
                      $q2->where('roles.id', $request->role);
                  });
            });
        }

        // Date Range Filter
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $logs = $query->paginate(50)->withQueryString();
        $roles = \App\Models\Role::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('admin/user-audit-logs', [
            'logs' => $logs,
            'roles' => $roles,
            'filters' => $request->only(['search', 'method', 'role', 'start_date', 'end_date']),
        ]);
    }
}
