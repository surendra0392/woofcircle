<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminManagementController
{
    /**
     * Display a listing of the admins.
     */
    public function index(Request $request)
    {
        $query = Admin::query();

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        $admins = $query->with(['state', 'city'])->latest()->paginate(10)->withQueryString();

        $states = State::orderBy('name')->get();
        $cities = City::orderBy('name')->get();

        return Inertia::render('admin/admins', [
            'admins' => $admins,
            'states' => $states,
            'cities' => $cities,
            'filters' => $request->only(['search', 'role', 'is_active']),
        ]);
    }

    /**
     * Store a newly created admin in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:superadmin,admin,editor,viewer',
            'is_active' => 'boolean',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
        ]);

        Admin::create($data);

        return back()->with('success', 'Admin account created successfully.');
    }

    /**
     * Update the specified admin in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email,'.$admin->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:superadmin,admin,editor,viewer',
            'is_active' => 'required|boolean',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $admin->update($data);

        return back()->with('success', 'Admin account updated successfully.');
    }

    /**
     * Toggle the active status of an admin.
     */
    public function toggleActive(Admin $admin)
    {
        // Prevent disabling yourself
        if (auth('admin')->id() === $admin->id) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $admin->update(['is_active' => ! $admin->is_active]);

        $status = $admin->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Admin successfully {$status}.");
    }

    /**
     * Remove the specified admin from storage.
     */
    public function destroy(Admin $admin)
    {
        // Prevent deleting yourself
        if (auth('admin')->id() === $admin->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $admin->delete();

        return back()->with('success', 'Admin account deleted successfully.');
    }
}
