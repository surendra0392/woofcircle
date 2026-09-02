<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminProfileController
{
    /**
     * Display the admin's profile form.
     */
    public function edit(Request $request)
    {
        $portal = trim(str_replace('admin', '', $request->route()->getPrefix()), '/') ?: 'admin';
        
        return Inertia::render('admin/profile', [
            'admin' => $request->user('admin'),
            'portal' => $portal,
            'states' => \App\Models\State::orderBy('name')->get(),
            'cities' => \App\Models\City::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the admin's profile information.
     */
    public function update(Request $request)
    {
        $admin = $request->user('admin');

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:admins,email,'.$admin->id],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $admin->name = $request->name;
        $admin->email = $request->email;

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $admin->avatar = '/storage/'.$path;
        }

        $admin->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the admin's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password:admin'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user('admin')->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
