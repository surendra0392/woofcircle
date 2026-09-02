<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\Pet;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMedicalRecordController
{
    /**
     * Display a global listing of medical records.
     */
    public function index(Request $request)
    {
        $query = MedicalRecord::with(['pet.user', 'pet.breed'])
            ->orderBy('created_at', 'desc');

        // Search/Filter by Title or Pet Name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('pet', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by Record Type
        if ($request->filled('record_type')) {
            $query->where('record_type', $request->record_type);
        }

        // Filter by Diagnosis Date Range
        if ($request->filled('date_from')) {
            $query->where('diagnosis_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('diagnosis_date', '<=', $request->date_to);
        }

        return Inertia::render('admin/medical-records', [
            'records' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'record_type', 'date_from', 'date_to']),
            'recordTypes' => ['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general'],
        ]);
    }

    /**
     * Show the form for creating a new medical record.
     */
    public function create()
    {
        return Inertia::render('admin/medical-records/create', [
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
            'recordTypes' => ['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general'],
        ]);
    }

    /**
     * Store a new medical record (Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'record_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'diagnosis_date' => 'nullable|date',
            'doctor_name' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'prescription' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        MedicalRecord::create($validated);

        return redirect()->route('admin.medical-records.index')->with('success', 'Medical record created successfully.');
    }

    /**
     * Show the form for editing a medical record.
     */
    public function edit(MedicalRecord $medical_record)
    {
        return Inertia::render('admin/medical-records/edit', [
            'record' => $medical_record->load('pet'),
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
            'recordTypes' => ['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general'],
        ]);
    }

    /**
     * Update a medical record (Admin).
     */
    public function update(Request $request, MedicalRecord $medical_record)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'record_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'diagnosis_date' => 'nullable|date',
            'doctor_name' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'prescription' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $medical_record->update($validated);

        return redirect()->route('admin.medical-records.index')->with('success', 'Medical record updated successfully.');
    }

    /**
     * Remove a medical record (Admin).
     */
    public function destroy(MedicalRecord $medical_record)
    {
        $medical_record->delete();

        return redirect()->route('admin.medical-records.index')->with('success', 'Medical record deleted successfully.');
    }
}
