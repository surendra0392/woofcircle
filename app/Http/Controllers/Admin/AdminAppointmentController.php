<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Pet;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAppointmentController
{
    /**
     * Display a global listing of appointments.
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['pet.user', 'pet.breed', 'vetProfile'])
            ->orderBy('appointment_date', 'desc');

        // Search/Filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('clinic_name', 'like', "%{$search}%")
                    ->orWhere('doctor_name', 'like', "%{$search}%")
                    ->orWhereHas('pet', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('appointment_type')) {
            $query->where('appointment_type', $request->appointment_type);
        }

        return Inertia::render('admin/appointments', [
            'appointments' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'appointment_type']),
            'appointmentTypes' => ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'],
            'statuses' => ['scheduled', 'completed', 'cancelled'],
        ]);
    }

    /**
     * Show the form for creating a new appointment.
     */
    public function create()
    {
        return Inertia::render('admin/appointments/create', [
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
            'appointmentTypes' => ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'],
            'statuses' => ['scheduled', 'completed', 'cancelled'],
        ]);
    }

    /**
     * Store a new appointment (Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'appointment_type' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'vet_profile_id' => 'nullable|exists:vet_profiles,id',
            'doctor_name' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:scheduled,completed,cancelled',
        ]);

        Appointment::create($validated);

        return redirect()->route('admin.appointments.index')->with('success', 'Appointment created successfully.');
    }

    /**
     * Show the form for editing an appointment.
     */
    public function edit(Appointment $appointment)
    {
        return Inertia::render('admin/appointments/edit', [
            'appointment' => $appointment->load('pet'),
            'pets' => Pet::with(['user', 'breed'])->orderBy('name')->get(),
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
            'appointmentTypes' => ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'],
            'statuses' => ['scheduled', 'completed', 'cancelled'],
        ]);
    }

    /**
     * Update an appointment (Admin).
     */
    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'appointment_type' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'vet_profile_id' => 'nullable|exists:vet_profiles,id',
            'doctor_name' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:scheduled,completed,cancelled',
        ]);

        $appointment->update($validated);

        return redirect()->route('admin.appointments.index')->with('success', 'Appointment updated successfully.');
    }

    /**
     * Remove an appointment (Admin).
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->route('admin.appointments.index')->with('success', 'Appointment deleted successfully.');
    }
}
