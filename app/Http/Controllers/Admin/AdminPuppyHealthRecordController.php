<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Litter;
use App\Models\MedicalRecord;
use App\Models\Pet;
use App\Models\PuppyHealthRecord;
use App\Models\User;
use App\Models\Vaccination;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPuppyHealthRecordController
{
    /**
     * Display a listing of health records for a specific litter.
     */
    public function index(Litter $litter)
    {
        return Inertia::render('admin/litters/health-records', [
            'litter' => $litter->load(['breed', 'user']),
            'records' => $litter->puppyHealthRecords()->orderBy('administered_date', 'desc')->get(),
            'recordTypes' => ['vaccination', 'deworming', 'health_check', 'other'],
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created health record.
     */
    public function store(Request $request, Litter $litter)
    {
        $validated = $request->validate([
            'record_type' => 'required|string|in:vaccination,deworming,health_check,other',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'administered_date' => 'required|date',
            'next_due_date' => 'nullable|date',
            'vet_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $litter->puppyHealthRecords()->create($validated);

        return back()->with('success', 'Health record added successfully.');
    }

    /**
     * Update the specified health record.
     */
    public function update(Request $request, Litter $litter, PuppyHealthRecord $record)
    {
        $validated = $request->validate([
            'record_type' => 'required|string|in:vaccination,deworming,health_check,other',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'administered_date' => 'required|date',
            'next_due_date' => 'nullable|date',
            'vet_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $record->update($validated);

        return back()->with('success', 'Health record updated successfully.');
    }

    /**
     * Remove the specified health record.
     */
    public function destroy(Litter $litter, PuppyHealthRecord $record)
    {
        $record->delete();

        return back()->with('success', 'Health record deleted successfully.');
    }

    /**
     * Convert a litter puppy into a user's pet and transfer health records.
     */
    public function convertToPet(Request $request, Litter $litter)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pet_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'nullable|date',
        ]);

        // 1. Create the Pet record
        $pet = Pet::create([
            'user_id' => $validated['user_id'],
            'breed_id' => $litter->breed_id,
            'name' => $validated['pet_name'],
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? now()->subWeeks(8),
            'notes' => 'Transferred by Admin from litter: '.$litter->title,
            'profile_image_path' => $litter->featured_image_path,
        ]);

        // 2. Transfer Health Records
        $healthRecords = $litter->puppyHealthRecords;

        foreach ($healthRecords as $record) {
            if ($record->record_type === 'vaccination') {
                Vaccination::create([
                    'pet_id' => $pet->id,
                    'vaccine_name' => $record->title,
                    'vaccination_date' => $record->administered_date,
                    'next_due_date' => $record->next_due_date,
                    'vet_name' => $record->vet_name,
                    'notes' => $record->notes,
                ]);
            } else {
                MedicalRecord::create([
                    'pet_id' => $pet->id,
                    'record_type' => $record->record_type,
                    'title' => $record->title,
                    'description' => $record->description,
                    'diagnosis_date' => $record->administered_date,
                    'doctor_name' => $record->vet_name,
                    'notes' => $record->notes,
                ]);
            }
        }

        return back()->with('success', 'Success! Litter health data transferred to '.User::find($validated['user_id'])->name."'s pet dashboard.");
    }
}
