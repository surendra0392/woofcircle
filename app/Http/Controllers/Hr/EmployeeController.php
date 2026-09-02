<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Admin;
use App\Models\State;
use App\Models\City;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');
        $query = Admin::with(['state', 'city']);
        $admin = auth('admin')->user();

        if ($admin->role !== 'superadmin') {
            if ($admin->city_id) {
                $query->where('city_id', $admin->city_id);
            } elseif ($admin->state_id) {
                $query->where('state_id', $admin->state_id);
            }
        }

        if ($role) {
            $query->where('role', $role);
        }

        $employees = $query->paginate(15);
        $states = State::orderBy('name')->get();
        $cities = City::orderBy('name')->get();

        return Inertia::render('Hr/Employees/Index', [
            'employees' => $employees,
            'states' => $states,
            'cities' => $cities,
            'filters' => $request->only(['role'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Hr/Employees/Create', [
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
        ]);
    }

    public function show(Admin $employee)
    {
        $employee->load(['payouts', 'documents']);
        
        $stats = [];
        if (in_array($employee->role, ['field_agent', 'support_agent', 'marketing', 'sales'])) {
            $stats['onboarded_profiles'] = $employee->onboardedProfiles()->count();
            $stats['ad_placements_sold'] = $employee->adPlacements()->count();
            $stats['resolved_internal_tickets'] = $employee->resolvedInternalTickets()->count();
            $stats['resolved_support_tickets'] = $employee->resolvedSupportTickets()->count();
        }

        return Inertia::render('Hr/Employees/Show', [
            'employee' => $employee,
            'stats' => $stats,
            'payouts' => $employee->payouts()->orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:superadmin,admin,hr_manager,hr_executive,field_agent,support_agent,finance,marketing,sales',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = true;

        $authUser = auth('admin')->user();
        if (in_array($validated['role'], ['hr_manager', 'hr_executive']) && !in_array($authUser->role, ['admin', 'superadmin'])) {
            $validated['state_id'] = null;
            $validated['city_id'] = null;
        }

        Admin::create($validated);

        return redirect()->route('hr.employees.index')->with('success', 'Employee created successfully.');
    }

    public function edit(Admin $employee)
    {
        return Inertia::render('Hr/Employees/Edit', [
            'employee' => $employee,
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Admin $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('admins')->ignore($employee->id)],
            'role' => 'required|string',
            'is_active' => 'boolean',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $authUser = auth('admin')->user();
        if (in_array($employee->role, ['hr_manager', 'hr_executive']) && !in_array($authUser->role, ['admin', 'superadmin'])) {
            $validated['state_id'] = $employee->state_id;
            $validated['city_id'] = $employee->city_id;
        }

        $employee->update($validated);

        return redirect()->back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(Admin $employee)
    {
        $employee->update(['is_active' => false]);
        return redirect()->back()->with('success', 'Employee deactivated successfully.');
    }

    public function uploadDocument(Request $request, Admin $employee)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
        ]);

        $path = $request->file('file')->store('employee_documents', 'public');

        $employee->documents()->create([
            'name' => $request->name,
            'file_path' => $path,
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully.');
    }

    public function deleteDocument(Admin $employee, \App\Models\EmployeeDocument $document)
    {
        if ($document->admin_id !== $employee->id) {
            abort(403);
        }

        \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'Document deleted.');
    }
}
