<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Models\Vaccination;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminVaccinationController
{
    /**
     * Display a listing of all vaccination records.
     */
    public function index(Request $request)
    {
        $query = Vaccination::with(['pet.user', 'pet.breed', 'vet']);

        // Filters
        if ($request->filled('vaccine_name')) {
            $query->where('vaccine_name', 'like', '%'.$request->vaccine_name.'%');
        }

        if ($request->filled('upcoming_only')) {
            $query->where('next_due_date', '>=', now())
                ->orderBy('next_due_date', 'asc');
        } else {
            $query->latest('vaccination_date');
        }

        $vaccinations = $query->paginate(25)->withQueryString();

        return Inertia::render('admin/vaccinations', [
            'vaccinations' => $vaccinations,
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['vaccine_name', 'upcoming_only']),
        ]);
    }

    /**
     * Show the form for registering a new vaccination.
     */
    public function create()
    {
        return Inertia::render('admin/vaccinations/create', [
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created vaccination record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'vaccine_name' => 'required|string|max:255',
            'vaccination_date' => 'required|date',
            'next_due_date' => 'nullable|date|after_or_equal:vaccination_date',
            'vet_id' => 'nullable|exists:vet_profiles,id',
            'vet_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Vaccination::create($validated);

        return redirect()->route('admin.vaccinations.index')->with('success', 'Vaccination record created successfully.');
    }

    /**
     * Show the form for editing a vaccination record.
     */
    public function edit(Vaccination $vaccination)
    {
        return Inertia::render('admin/vaccinations/edit', [
            'vaccination' => $vaccination->load(['pet.user', 'pet.breed', 'vet']),
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified vaccination record.
     */
    public function update(Request $request, Vaccination $vaccination)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'vaccine_name' => 'required|string|max:255',
            'vaccination_date' => 'required|date',
            'next_due_date' => 'nullable|date|after_or_equal:vaccination_date',
            'vet_id' => 'nullable|exists:vet_profiles,id',
            'vet_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $vaccination->update($validated);

        return redirect()->route('admin.vaccinations.index')->with('success', 'Vaccination record updated successfully.');
    }

    /**
     * Remove the specified vaccination record.
     */
    public function destroy(Vaccination $vaccination)
    {
        $vaccination->delete();

        return redirect()->route('admin.vaccinations.index')->with('success', 'Vaccination record deleted successfully.');
    }
}
