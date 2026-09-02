<?php

namespace App\Http\Controllers;

use App\Models\Litter;
use App\Models\MedicalRecord;
use App\Models\Notification;
use App\Models\Pet;
use App\Models\PuppyHealthRecord;
use App\Models\TransferRequest;
use App\Models\User;
use App\Models\Vaccination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BreederHealthRecordController
{
    /**
     * Display a listing of health records for a specific litter.
     */
    public function index(Litter $litter)
    {
        // Ensure the litter belongs to the authenticated breeder
        if ($litter->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('breeder/litters/health-records/index', [
            'litter' => $litter->load('breed'),
            'records' => $litter->puppyHealthRecords()->orderBy('administered_date', 'desc')->get(),
            'recordTypes' => ['vaccination', 'deworming', 'health_check', 'other'],
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
            'transferRequests' => $litter->transferRequests()->with('buyer')->latest()->get(),
        ]);
    }

    /**
     * Store a newly created health record.
     */
    public function store(Request $request, Litter $litter)
    {
        if ($litter->user_id !== Auth::id()) {
            abort(403);
        }

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
        if ($litter->user_id !== Auth::id() || $record->litter_id !== $litter->id) {
            abort(403);
        }

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
        if ($litter->user_id !== Auth::id() || $record->litter_id !== $litter->id) {
            abort(403);
        }

        $record->delete();

        return back()->with('success', 'Health record deleted successfully.');
    }

    /**
     * Transfer litter health records to a new owner's pet dashboard.
     */
    public function transfer(Request $request, Litter $litter)
    {
        if ($litter->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pet_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'nullable|date',
        ]);

        // 1. Create the Pet record for the target user
        $pet = Pet::create([
            'user_id' => $validated['user_id'],
            'breed_id' => $litter->breed_id,
            'name' => $validated['pet_name'],
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? now()->subWeeks(8),
            'notes' => 'Transferred from litter: '.$litter->title.' by Breeder.',
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

        return back()->with('success', "Success! Health records for '{$pet->name}' have been transferred to the new owner.");
    }

    /**
     * Approve a transfer request by the Breeder.
     */
    public function approveTransferRequest(Request $request, TransferRequest $transferRequest)
    {
        // 1. Ensure the authenticated user is the breeder for this request
        if ($transferRequest->breeder_id !== Auth::id()) {
            abort(403);
        }

        // 2. Ensure request is in pending_breeder status
        if ($transferRequest->status !== 'pending_breeder') {
            return back()->with('error', 'This transfer request cannot be approved in its current status.');
        }

        // 3. Update status to pending_admin
        $transferRequest->update([
            'status' => 'pending_admin',
        ]);

        // 4. Add log entry
        $transferRequest->addLog(Auth::user(), 'Breeder approved transfer. Sent to admin for final approval.');

        // 5. Create notification for the buyer
        Notification::create([
            'user_id' => $transferRequest->buyer_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Breeder Approved',
            'message' => "The breeder has approved the transfer of puppy '{$transferRequest->pet_name}'. Waiting for Admin's final approval.",
        ]);

        // 6. Create system notification (visible to admin)
        Notification::create([
            'user_id' => $transferRequest->breeder_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Pending Admin Approval',
            'message' => "A transfer request for puppy '{$transferRequest->pet_name}' is pending admin approval.",
        ]);

        return back()->with('success', 'Transfer request approved. It is now waiting for Admin approval.');
    }

    /**
     * Reject a transfer request by the Breeder.
     */
    public function rejectTransferRequest(Request $request, TransferRequest $transferRequest)
    {
        // 1. Ensure the authenticated user is the breeder for this request
        if ($transferRequest->breeder_id !== Auth::id()) {
            abort(403);
        }

        // 2. Ensure request is in pending_breeder status
        if ($transferRequest->status !== 'pending_breeder') {
            return back()->with('error', 'This transfer request cannot be rejected in its current status.');
        }

        // 3. Update status to rejected
        $transferRequest->update([
            'status' => 'rejected',
        ]);

        // 4. Add log entry
        $transferRequest->addLog(Auth::user(), 'Breeder rejected transfer request.');

        // 5. Create notification for the buyer
        Notification::create([
            'user_id' => $transferRequest->buyer_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Request Rejected',
            'message' => "The breeder has rejected your transfer request for puppy '{$transferRequest->pet_name}'.",
        ]);

        return back()->with('success', 'Transfer request rejected.');
    }
}
