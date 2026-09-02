<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\VetProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserAppointmentController
{
    /**
     * Display a listing of appointments for a specific pet.
     */
    public function index(Pet $pet)
    {
        if ($pet->user_id !== Auth::id()) {
            abort(403);
        }

        $appointments = $pet->appointments()
            ->with('vetProfile')
            ->orderBy('appointment_date', 'asc')
            ->get();

        return Inertia::render('dashboard/pets/appointments/index', [
            'pet' => $pet->load('breed'),
            'appointments' => $appointments,
            'appointmentTypes' => ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'],
            'statuses' => ['scheduled', 'completed', 'cancelled'],
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Show form to create appointment.
     */
    public function create(Pet $pet)
    {
        if ($pet->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/appointments/create', [
            'pet' => $pet->load('breed'),
            'appointmentTypes' => ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'],
            'statuses' => ['scheduled', 'completed', 'cancelled'],
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created appointment.
     */
    public function store(Request $request, Pet $pet)
    {
        if ($pet->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'appointment_type' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'vet_profile_id' => 'nullable|exists:vet_profiles,id',
            'doctor_name' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:scheduled,completed,cancelled',
        ]);

        $pet->appointments()->create($validated);

        return redirect()->route('pets.appointments.index', $pet->id)->with('success', 'Appointment scheduled successfully.');
    }

    /**
     * Show form to edit appointment.
     */
    public function edit(Pet $pet, Appointment $appointment)
    {
        if ($pet->user_id !== Auth::id() || $appointment->pet_id !== $pet->id) {
            abort(403);
        }

        return Inertia::render('dashboard/pets/appointments/edit', [
            'pet' => $pet->load('breed'),
            'appointment' => $appointment,
            'appointmentTypes' => ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'],
            'statuses' => ['scheduled', 'completed', 'cancelled'],
            'vets' => VetProfile::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified appointment.
     */
    public function update(Request $request, Pet $pet, Appointment $appointment)
    {
        if ($pet->user_id !== Auth::id() || $appointment->pet_id !== $pet->id) {
            abort(403);
        }

        $validated = $request->validate([
            'appointment_type' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'vet_profile_id' => 'nullable|exists:vet_profiles,id',
            'doctor_name' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:scheduled,completed,cancelled',
        ]);

        $appointment->update($validated);

        return redirect()->route('pets.appointments.index', $pet->id)->with('success', 'Appointment updated successfully.');
    }

    /**
     * Remove the specified appointment.
     */
    public function destroy(Pet $pet, Appointment $appointment)
    {
        if ($pet->user_id !== Auth::id() || $appointment->pet_id !== $pet->id) {
            abort(403);
        }

        $appointment->delete();

        return back()->with('success', 'Appointment removed successfully.');
    }
}
