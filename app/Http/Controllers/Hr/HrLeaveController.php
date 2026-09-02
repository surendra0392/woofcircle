<?php

namespace App\Http\Controllers\Hr;

use App\Events\LeaveRequestStatusChanged;
use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HrLeaveController extends Controller
{
    /**
     * Global role lists for leave processing.
     */
    const HR_LEAVE_ROLES = ['hr_director', 'hr_manager', 'hr_executive', 'superadmin'];

    /**
     * List all leave requests (HR view: all employees; employee view: their own).
     */
    public function index(Request $request)
    {
        $admin = auth('admin')->user();
        $isHr = in_array($admin->role, self::HR_LEAVE_ROLES);

        if ($isHr) {
            // HR sees all leave requests within their hierarchy
            $targetIds = $admin->allSubordinates()->pluck('id')->push($admin->id);
            $leaves = LeaveRequest::with('admin')
                ->whereIn('admin_id', $targetIds)
                ->latest()
                ->get();
        } else {
            // Non-HR employees see only their own requests
            $leaves = LeaveRequest::with('admin')
                ->where('admin_id', $admin->id)
                ->latest()
                ->get();
        }

        // Count pending leaves for HR dashboard integration
        $pendingCount = LeaveRequest::whereIn('admin_id', function ($q) use ($admin) {
            $targetIds = $admin->allSubordinates()->pluck('id')->push($admin->id);
            $q->select('id')->from('admins')->whereIn('id', $targetIds);
        })->where('status', 'pending')->count();

        return Inertia::render('Hr/Leaves/Index', [
            'leaves' => $leaves,
            'isHr' => $isHr,
            'pendingCount' => $pendingCount,
            'filters' => [
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    /**
     * Show the form to create a new leave request.
     */
    public function create()
    {
        $admin = auth('admin')->user();
        // Pre-calculate remaining leave balance for this year
        $yearStart = now()->startOfYear();
        $usedLeave = LeaveRequest::where('admin_id', $admin->id)
            ->whereIn('status', ['approved', 'pending'])
            ->whereYear('start_date', now()->year)
            ->count();

        return Inertia::render('Hr/Leaves/Create', [
            'usedLeave' => $usedLeave,
            'maxLeave' => config('leave.max_days', 15),
        ]);
    }

    /**
     * Store a new leave request (employee self-service).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:sick,vacation,unpaid',
            'reason' => 'nullable|string|max:1000',
        ]);

        $leave = LeaveRequest::create([
            'admin_id' => auth('admin')->id(),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return redirect()->route('hr.leaves.index')
            ->with('success', 'Leave request submitted successfully. Awaiting HR approval.');
    }

    /**
     * Show a single leave request (for HR to approve/reject).
     */
    public function show(LeaveRequest $leave)
    {
        $admin = auth('admin')->user();
        $isHr = in_array($admin->role, self::HR_LEAVE_ROLES);

        if ($leave->admin_id !== $admin->id && ! $isHr) {
            abort(403);
        }

        // Count remaining balance for this employee
        $usedLeave = LeaveRequest::where('admin_id', $leave->admin_id)
            ->whereIn('status', ['approved'])
            ->whereYear('start_date', now()->year)
            ->count();

        $leave->load('admin');

        return Inertia::render('Hr/Leaves/Show', [
            'leave' => $leave,
            'isHr' => $isHr,
            'usedLeave' => $usedLeave,
            'maxLeave' => config('leave.max_days', 15),
        ]);
    }

    /**
     * Approve a leave request (HR only).
     */
    public function approve(LeaveRequest $leave)
    {
        $admin = auth('admin')->user();
        if (! in_array($admin->role, self::HR_LEAVE_ROLES)) {
            abort(403);
        }

        $leave->update(['status' => 'approved']);

        // Notify the employee in real-time
        LeaveRequestStatusChanged::dispatch(
            $leave->admin_id,
            $leave->id,
            'approved',
            $leave->type,
        );

        return redirect()->back()->with('success', 'Leave request approved.');
    }

    /**
     * Reject a leave request with reason (HR only).
     */
    public function reject(Request $request, LeaveRequest $leave)
    {
        $admin = auth('admin')->user();
        if (! in_array($admin->role, self::HR_LEAVE_ROLES)) {
            abort(403);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $leave->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Notify the employee in real-time
        LeaveRequestStatusChanged::dispatch(
            $leave->admin_id,
            $leave->id,
            'rejected',
            $leave->type,
        );

        return redirect()->back()->with('success', 'Leave request rejected.');
    }

    /**
     * Cancel a pending leave request (employee only).
     */
    public function cancel(LeaveRequest $leave)
    {
        $admin = auth('admin')->user();

        if ($leave->admin_id !== $admin->id) {
            abort(403);
        }

        if ($leave->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending requests can be cancelled.');
        }

        $leave->update(['status' => 'cancelled']);

        return redirect()->back()->with('success', 'Leave request cancelled.');
    }
}
