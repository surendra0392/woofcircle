<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ListingTier;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'role', 'listingTier']);

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role_id (searching users who have this specific role)
        if ($request->filled('role_id')) {
            $roleId = $request->role_id;
            $query->whereHas('roles', function ($q) use ($roleId) {
                $q->where('roles.id', $roleId);
            });
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        $users = $query->latest()->paginate(10)->withQueryString();
        $roles = Role::where('is_active', true)->orderBy('name')->get();
        $listingTiers = ListingTier::orderBy('name')->get();

        return Inertia::render('admin/users', [
            'users' => $users,
            'roles' => $roles,
            'listingTiers' => $listingTiers,
            'filters' => $request->only(['search', 'role_id', 'is_active']),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'mobile_number' => 'nullable|digits:10',
            'password' => 'required|string|min:8',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
            'listing_tier_id' => 'nullable|exists:listing_tiers,id',
            'is_active' => 'boolean',
        ]);

        // Set primary role_id to the first one selected for backward compatibility
        $data['role_id'] = $data['role_ids'][0];

        $user = User::create($data);
        $user->roles()->sync($data['role_ids']);

        return back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'mobile_number' => 'nullable|digits:10',
            'password' => 'nullable|string|min:8',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
            'listing_tier_id' => 'nullable|exists:listing_tiers,id',
            'is_active' => 'boolean',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        // Update primary role_id for backward compatibility
        $data['role_id'] = $data['role_ids'][0];

        $user->update($data);
        $user->roles()->sync($data['role_ids']);

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * Toggle the active status of a user.
     */
    public function toggleActive(User $user)
    {
        $user->update(['is_active' => ! $user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "User successfully {$status}.");
    }

    /**
     * Suspend the user.
     */
    public function suspend(Request $request, User $user)
    {
        $data = $request->validate([
            'duration' => 'required|integer|min:0',
        ]);

        if ($data['duration'] == 0) {
            $user->update(['suspended_until' => null]);
            return back()->with('success', 'User unsuspended successfully.');
        }

        $suspendedUntil = now()->addHours($data['duration']);
        $user->update(['suspended_until' => $suspendedUntil]);

        return back()->with('success', 'User suspended until ' . $suspendedUntil->format('M d, Y H:i'));
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
