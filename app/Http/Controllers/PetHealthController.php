<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Pet;
use App\Models\Vaccination;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PetHealthController
{
    /**
     * Display a listing of the medical records for a specific pet.
     */
    public function indexMedicalRecords(Pet $pet)
    {
        if ($pet->user_id !== Auth::id()) {
            abort(403);
        }

        $records = $pet->medicalRecords()
            ->orderBy('diagnosis_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('dashboard/pets/medical-records/index', [
            'pet' => $pet->load('breed'),
            'records' => $records,
            'recordTypes' => ['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general'],
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Show form to log medical record.
     */
    public function createMedicalRecord(Pet $pet)
    {
        if ($pet->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/medical-records/create', [
            'pet' => $pet->load('breed'),
            'recordTypes' => ['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general'],
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created medical record.
     */
    public function storeMedicalRecord(Request $request, Pet $pet)
    {
        if ($pet->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'record_type' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'diagnosis_date' => ['nullable', 'date'],
            'doctor_name' => ['nullable', 'string', 'max:255'],
            'clinic_name' => ['nullable', 'string', 'max:255'],
            'prescription' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $pet->medicalRecords()->create($validated);

        return redirect()->route('pets.medical-records.index', $pet->id)->with('success', 'Medical record added successfully.');
    }

    /**
     * Show form to edit medical record.
     */
    public function editMedicalRecord(Pet $pet, MedicalRecord $medicalRecord)
    {
        if ($pet->user_id !== Auth::id() || $medicalRecord->pet_id !== $pet->id) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/medical-records/edit', [
            'pet' => $pet->load('breed'),
            'medicalRecord' => $medicalRecord,
            'recordTypes' => ['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general'],
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified medical record.
     */
    public function updateMedicalRecord(Request $request, Pet $pet, MedicalRecord $medicalRecord)
    {
        if ($pet->user_id !== Auth::id() || $medicalRecord->pet_id !== $pet->id) {
            abort(403);
        }

        $validated = $request->validate([
            'record_type' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'diagnosis_date' => ['nullable', 'date'],
            'doctor_name' => ['nullable', 'string', 'max:255'],
            'clinic_name' => ['nullable', 'string', 'max:255'],
            'prescription' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $medicalRecord->update($validated);

        return redirect()->route('pets.medical-records.index', $pet->id)->with('success', 'Medical record updated successfully.');
    }

    /**
     * Remove the specified medical record.
     */
    public function destroyMedicalRecord(Pet $pet, MedicalRecord $medicalRecord)
    {
        if ($pet->user_id !== Auth::id() || $medicalRecord->pet_id !== $pet->id) {
            abort(403);
        }

        $medicalRecord->delete();

        return back()->with('success', 'Medical record deleted successfully.');
    }

    /**
     * Display a listing of vaccinations for a specific pet.
     */
    public function indexVaccinations(Pet $pet)
    {
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        $vaccinations = $pet->vaccinations()
            ->with('vet')
            ->orderBy('vaccination_date', 'desc')
            ->get();

        return Inertia::render('dashboard/pets/vaccinations/index', [
            'pet' => $pet->load('breed'),
            'vaccinations' => $vaccinations,
            'vets' => VetProfile::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form to log a vaccination.
     */
    public function createVaccination(Pet $pet)
    {
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/vaccinations/create', [
            'pet' => $pet->load('breed'),
            'vets' => VetProfile::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created vaccination record.
     */
    public function storeVaccination(Request $request, Pet $pet)
    {
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'vaccine_name' => 'required|string|max:255',
            'vaccination_date' => 'required|date',
            'next_due_date' => 'nullable|date|after_or_equal:vaccination_date',
            'vet_id' => 'nullable|exists:vet_profiles,id',
            'vet_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $pet->vaccinations()->create($validated);

        return redirect()->route('pets.vaccinations.index', $pet->id)->with('success', 'Vaccination record added successfully.');
    }

    /**
     * Show the form to edit a vaccination record.
     */
    public function editVaccination(Pet $pet, Vaccination $vaccination)
    {
        if ($pet->user_id !== auth()->id() || $vaccination->pet_id !== $pet->id) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/vaccinations/edit', [
            'pet' => $pet->load('breed'),
            'vaccination' => $vaccination,
            'vets' => VetProfile::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified vaccination record.
     */
    public function updateVaccination(Request $request, Pet $pet, Vaccination $vaccination)
    {
        if ($pet->user_id !== auth()->id() || $vaccination->pet_id !== $pet->id) {
            abort(403);
        }

        $validated = $request->validate([
            'vaccine_name' => 'required|string|max:255',
            'vaccination_date' => 'required|date',
            'next_due_date' => 'nullable|date|after_or_equal:vaccination_date',
            'vet_id' => 'nullable|exists:vet_profiles,id',
            'vet_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $vaccination->update($validated);

        return redirect()->route('pets.vaccinations.index', $pet->id)->with('success', 'Vaccination record updated successfully.');
    }

    /**
     * Remove the specified vaccination record.
     */
    public function destroyVaccination(Pet $pet, Vaccination $vaccination)
    {
        if ($pet->user_id !== auth()->id() || $vaccination->pet_id !== $pet->id) {
            abort(403);
        }

        $vaccination->delete();

        return back()->with('success', 'Vaccination record removed successfully.');
    }
}
