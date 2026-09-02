<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserPetController
{
    public function index()
    {
        $user = auth()->user();
        $pets = Pet::where('user_id', $user->id)
            ->with('breed')
            ->latest()
            ->get();

        return Inertia::render('dashboard/pets/index', [
            'pets' => $pets,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'tier_info' => [
                'tier_name' => $user->subscription_tier->name ?? 'Free',
                'pet_count' => $pets->count(),
                'max_pets' => $user->maxPetsAllowed(),
                'can_add_pet' => $user->canAddPet(),
                'is_unlimited' => $user->maxPetsAllowed() > 100,
            ],
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        if (! $user->canAddPet()) {
            return redirect()->route('pets.index')->with('error', "You have reached the limit of {$user->maxPetsAllowed()} pets on the {$user->subscription_tier->name} tier. Upgrade to Connoisseur for unlimited pet profiles.");
        }

        return Inertia::render('dashboard/pets/create', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'tier_info' => [
                'tier_name' => $user->subscription_tier->name ?? 'Free',
                'pet_count' => Pet::where('user_id', $user->id)->count(),
                'max_pets' => $user->maxPetsAllowed(),
                'is_unlimited' => $user->maxPetsAllowed() > 100,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (! $user->canAddPet()) {
            return redirect()->route('pets.index')->with('error', 'Pet limit reached for your current tier. Please upgrade to add more pets.');
        }

        $validated = $request->validate([
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

        $validated['user_id'] = $user->id;

        if ($request->hasFile('profile_image')) {
            $validated['profile_image_path'] = $request->file('profile_image')->store('pets/profiles', 'public');
        }

        $pet = Pet::create($validated);
        
        // Award karma points
        $user->increment('karma_points', 10);

        try {
            if ($user->email) {
                \Illuminate\Support\Facades\Mail::to($user->email)
                    ->send(new \App\Mail\PetAddedMail($user->name, $pet));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send pet added email: ' . $e->getMessage());
        }

        return redirect()->route('pets.index')->with('success', 'Pet added successfully.');
    }

    public function edit(Pet $pet)
    {
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/edit', [
            'pet' => $pet,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Pet $pet)
    {
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
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

        return redirect()->route('pets.index')->with('success', 'Pet updated successfully.');
    }

    public function destroy(Pet $pet)
    {
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        if ($pet->profile_image_path) {
            Storage::disk('public')->delete($pet->profile_image_path);
        }

        $pet->delete();

        return back()->with('success', 'Pet removed successfully.');
    }
}
