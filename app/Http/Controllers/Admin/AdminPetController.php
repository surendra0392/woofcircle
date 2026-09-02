<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Breed;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminPetController
{
    /**
     * Display a listing of all pets.
     */
    public function index(Request $request)
    {
        $query = Pet::with(['user', 'breed']);

        // Filters
        if ($request->filled('breed_id')) {
            $query->where('breed_id', $request->breed_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $pets = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/pets', [
            'pets' => $pets,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
            'filters' => $request->only(['breed_id', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new pet.
     */
    public function create()
    {
        return Inertia::render('admin/pets/create', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created pet in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'breed_id' => 'required|exists:breeds,id',
            'gender' => 'required|string|in:male,female',
            'date_of_birth' => 'nullable|date',
            'color' => 'nullable|string|max:255',
            'microchip_number' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_image')) {
            $validated['profile_image_path'] = $request->file('profile_image')->store('pets/profiles', 'public');
        }

        Pet::create($validated);

        return redirect()->route('admin.pets.index')->with('success', 'Pet created successfully.');
    }

    /**
     * Show the form for editing the specified pet.
     */
    public function edit(Pet $pet)
    {
        return Inertia::render('admin/pets/edit', [
            'pet' => $pet,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified pet in storage.
     */
    public function update(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'breed_id' => 'required|exists:breeds,id',
            'gender' => 'required|string|in:male,female',
            'date_of_birth' => 'nullable|date',
            'color' => 'nullable|string|max:255',
            'microchip_number' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_image')) {
            if ($pet->profile_image_path) {
                Storage::disk('public')->delete($pet->profile_image_path);
            }
            $validated['profile_image_path'] = $request->file('profile_image')->store('pets/profiles', 'public');
        }

        $pet->update($validated);

        return redirect()->route('admin.pets.index')->with('success', 'Pet updated successfully.');
    }

    /**
     * Remove the specified pet from storage.
     */
    public function destroy(Pet $pet)
    {
        if ($pet->profile_image_path) {
            Storage::disk('public')->delete($pet->profile_image_path);
        }

        $pet->delete();

        return back()->with('success', 'Pet deleted successfully.');
    }
}
