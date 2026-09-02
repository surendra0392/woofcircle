<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\Litter;
use App\Models\LitterImage;
use App\Models\MedicalRecord;
use App\Models\Notification;
use App\Models\Pet;
use App\Models\State;
use App\Models\TrainerProfile;
use App\Models\TransferRequest;
use App\Models\User;
use App\Models\Vaccination;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminLitterController
{
    /**
     * Display a listing of the litters.
     */
    public function index(Request $request)
    {
        $query = Litter::with(['user.role', 'profile', 'breed', 'state', 'city', 'images']);

        // Filters
        if ($request->filled('is_approved')) {
            $query->where('is_approved', $request->is_approved === 'true');
        }
        if ($request->filled('is_available')) {
            $query->where('is_available', $request->is_available === 'true');
        }
        if ($request->filled('breed_id')) {
            $query->where('breed_id', $request->breed_id);
        }
        if ($request->filled('state_id')) {
            $query->where('state_id', $request->state_id);
        }
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        $litters = $query->latest()->paginate(10)->withQueryString();

        // Transform image paths to URLs for the current page items
        $litters->getCollection()->each(function ($litter) {
            $litter->featured_image_url = $litter->featured_image_path ? Storage::url($litter->featured_image_path) : null;
            $litter->images->each(function ($image) {
                $image->image_url = Storage::url($image->image_path);
            });

            // Unify profile name for different roles
            if ($litter->profile) {
                if ($litter->profile_type === BreederProfile::class) {
                    $litter->profile->name = $litter->profile->kennel_name;
                } elseif ($litter->profile_type === VetProfile::class) {
                    $litter->profile->name = $litter->profile->clinic_name;
                } elseif ($litter->profile_type === WelfareProfile::class) {
                    $litter->profile->name = $litter->profile->organization_name;
                }
            }
        });

        $profiles = collect();

        // Fetch all profiles and unify them
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/litters', [
            'litters' => $litters,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'filters' => $request->only(['is_approved', 'is_available', 'breed_id', 'state_id', 'city_id', 'status', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new litter.
     */
    public function create()
    {
        $profiles = collect();
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/litters/create', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified litter.
     */
    public function edit(Litter $litter)
    {
        $litter->load(['images']);
        $litter->featured_image_url = $litter->featured_image_path ? Storage::url($litter->featured_image_path) : null;
        $litter->images->each(function ($image) {
            $image->image_url = Storage::url($image->image_path);
        });

        $profiles = collect();
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/litters/edit', [
            'litter' => $litter,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created litter.
     */
    public function store(Request $request)
    {
        if ($request->profile_id === 'none') {
            $request->merge(['profile_id' => null, 'profile_type' => null]);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'profile_id' => 'nullable|integer',
            'profile_type' => 'nullable|string',
            'breed_id' => 'required|exists:breeds,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:litters,slug',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
            'kci_registered' => 'boolean',
            'sire_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'dam_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'status' => 'required|string|in:draft,published,reserved,soldout',
            'is_negotiable' => 'boolean',
            'is_vaccinated' => 'boolean',
            'is_available' => 'boolean',
            'is_approved' => 'boolean',
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'kci_images.*' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'featured_position' => 'nullable|integer|min:1|max:5',
            'featured_duration' => 'nullable|string|in:1d,3d,7d,15d,30d',
            'images.*' => 'nullable|image|max:2048',
        ]);

        if (! $request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        if ($request->filled('featured_duration')) {
            $days = (int) filter_var($validated['featured_duration'], FILTER_SANITIZE_NUMBER_INT);
            $validated['featured_until'] = now()->addDays($days);
        }

        $litter = Litter::create($validated);

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('litters/'.$litter->id.'/featured', 'public');
            $litter->update(['featured_image_path' => $path]);
        }

        if ($request->hasFile('kci_images')) {
            foreach ($request->file('kci_images') as $index => $image) {
                $path = $image->store('litters/'.$litter->id.'/kci', 'public');
                $litter->images()->create([
                    'image_path' => $path,
                    'image_type' => 'kci',
                    'sort_order' => $index,
                ]);
            }
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('litters/'.$litter->id, 'public');
                $litter->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.litters.index')->with('success', 'Litter listing created successfully.');
    }

    /**
     * Update the specified litter.
     */
    public function update(Request $request, Litter $litter)
    {
        if ($request->profile_id === 'none') {
            $request->merge(['profile_id' => null, 'profile_type' => null]);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'profile_id' => 'nullable|integer',
            'profile_type' => 'nullable|string',
            'breed_id' => 'required|exists:breeds,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:litters,slug,'.$litter->id,
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
            'kci_registered' => 'boolean',
            'sire_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'dam_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'status' => 'required|string|in:draft,published,reserved,soldout',
            'is_negotiable' => 'boolean',
            'is_vaccinated' => 'boolean',
            'is_available' => 'boolean',
            'is_approved' => 'boolean',
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'kci_images.*' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'featured_position' => 'nullable|integer|min:1|max:5',
            'featured_duration' => 'nullable|string|in:1d,3d,7d,15d,30d',
            'images.*' => 'nullable|image|max:2048',
        ]);

        if ($request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['slug']);
        } elseif ($litter->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        }

        if ($request->filled('featured_duration')) {
            $days = (int) filter_var($validated['featured_duration'], FILTER_SANITIZE_NUMBER_INT);
            $validated['featured_until'] = now()->addDays($days);
        }

        $litter->update($validated);

        if ($request->hasFile('featured_image')) {
            if ($litter->featured_image_path) {
                Storage::disk('public')->delete($litter->featured_image_path);
            }
            $path = $request->file('featured_image')->store('litters/'.$litter->id.'/featured', 'public');
            $litter->update(['featured_image_path' => $path]);
        }

        if ($request->hasFile('kci_images')) {
            $currentKciCount = $litter->images()->where('image_type', 'kci')->count();
            foreach ($request->file('kci_images') as $index => $image) {
                $path = $image->store('litters/'.$litter->id.'/kci', 'public');
                $litter->images()->create([
                    'image_path' => $path,
                    'image_type' => 'kci',
                    'sort_order' => $currentKciCount + $index,
                ]);
            }
        }

        if ($request->hasFile('images')) {
            $currentCount = $litter->images()->count();
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('litters/'.$litter->id, 'public');
                $litter->images()->create([
                    'image_path' => $path,
                    'sort_order' => $currentCount + $index,
                ]);
            }
        }

        return redirect()->route('admin.litters.index')->with('success', 'Litter listing updated successfully.');
    }

    /**
     * Toggle the approval status.
     */
    public function toggleApproval(Litter $litter)
    {
        $litter->update(['is_approved' => ! $litter->is_approved]);

        return back()->with('success', 'Approval status updated.');
    }

    /**
     * Toggle the availability status.
     */
    public function toggleAvailability(Litter $litter)
    {
        $litter->update(['is_available' => ! $litter->is_available]);

        return back()->with('success', 'Availability status updated.');
    }

    /**
     * Remove the specified litter.
     */
    public function destroy(Litter $litter)
    {
        // Delete featured image
        if ($litter->featured_image_path) {
            Storage::disk('public')->delete($litter->featured_image_path);
        }

        // Delete associated images from storage
        foreach ($litter->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $litter->delete();

        return back()->with('success', 'Litter listing removed successfully.');
    }

    /**
     * Delete a specific image from a litter.
     */
    public function deleteImage(LitterImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image removed.');
    }

    /**
     * Display a listing of all secure transfer requests.
     */
    public function transferRequestsIndex(Request $request)
    {
        $query = TransferRequest::with(['litter.breed', 'buyer', 'breeder']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/transfer-requests/index', [
            'requests' => $requests,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Approve and execute a secure puppy transfer request by the Admin.
     */
    public function approveTransferRequest(Request $request, TransferRequest $transferRequest)
    {
        // 1. Ensure status is pending_admin
        if ($transferRequest->status !== 'pending_admin') {
            return back()->with('error', 'This transfer request is not pending admin approval.');
        }

        $litter = $transferRequest->litter;
        $buyer = $transferRequest->buyer;
        $breeder = $transferRequest->breeder;

        // 2. Perform transaction to create Pet and copy health records
        \DB::transaction(function () use ($transferRequest, $litter) {
            // Create the Pet record
            $pet = Pet::create([
                'user_id' => $transferRequest->buyer_id,
                'breed_id' => $litter->breed_id,
                'name' => $transferRequest->pet_name,
                'gender' => $transferRequest->gender,
                'date_of_birth' => $transferRequest->date_of_birth ?? now()->subWeeks(8),
                'notes' => 'Securely transferred from litter: '.$litter->title.' (Approved by Breeder & Admin).',
                'profile_image_path' => $litter->featured_image_path,
            ]);

            // Copy Health Records
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

            // Update transfer request status and link the created pet
            $transferRequest->update([
                'status' => 'approved',
                'pet_id' => $pet->id,
            ]);
        });

        // 3. Add log entry
        $adminUser = auth()->guard('admin')->user();
        $adminName = $adminUser ? $adminUser->name : 'Admin';

        $transferRequest->addLog($adminUser ?? $buyer, "Admin ($adminName) approved and executed puppy transfer.");

        // 4. Create admin audit log
        AdminAuditLog::create([
            'admin_id' => $adminUser ? $adminUser->id : 1,
            'action' => 'Approved secure puppy transfer request #'.$transferRequest->id,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'payload' => [
                'transfer_request_id' => $transferRequest->id,
                'pet_name' => $transferRequest->pet_name,
                'buyer_id' => $transferRequest->buyer_id,
                'breeder_id' => $transferRequest->breeder_id,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // 5. Notify Breeder & Buyer
        Notification::create([
            'user_id' => $transferRequest->buyer_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Approved',
            'message' => "Congratulations! Admin has approved the secure transfer of puppy '{$transferRequest->pet_name}'. The puppy is now on your pet dashboard.",
        ]);

        Notification::create([
            'user_id' => $transferRequest->breeder_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Completed',
            'message' => "The puppy transfer request for puppy '{$transferRequest->pet_name}' has been approved and completed by Admin.",
        ]);

        return back()->with('success', 'Puppy transfer request approved and puppy profile successfully created.');
    }

    /**
     * Reject a secure puppy transfer request by the Admin.
     */
    public function rejectTransferRequest(Request $request, TransferRequest $transferRequest)
    {
        // 1. Ensure status is pending_admin
        if ($transferRequest->status !== 'pending_admin') {
            return back()->with('error', 'This transfer request is not pending admin approval.');
        }

        // 2. Update status to rejected
        $transferRequest->update([
            'status' => 'rejected',
        ]);

        $adminUser = auth()->guard('admin')->user();
        $adminName = $adminUser ? $adminUser->name : 'Admin';

        // 3. Add log entry
        $transferRequest->addLog($adminUser ?? $transferRequest->buyer, "Admin ($adminName) rejected the puppy transfer request.");

        // 4. Create admin audit log
        AdminAuditLog::create([
            'admin_id' => $adminUser ? $adminUser->id : 1,
            'action' => 'Rejected secure puppy transfer request #'.$transferRequest->id,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'payload' => [
                'transfer_request_id' => $transferRequest->id,
                'pet_name' => $transferRequest->pet_name,
                'buyer_id' => $transferRequest->buyer_id,
                'breeder_id' => $transferRequest->breeder_id,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // 5. Notify Breeder & Buyer
        Notification::create([
            'user_id' => $transferRequest->buyer_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Rejected by Admin',
            'message' => "The admin has rejected the puppy transfer request for puppy '{$transferRequest->pet_name}'.",
        ]);

        Notification::create([
            'user_id' => $transferRequest->breeder_id,
            'type' => 'system',
            'title' => 'Puppy Transfer Rejected by Admin',
            'message' => "The puppy transfer request for puppy '{$transferRequest->pet_name}' has been rejected by Admin.",
        ]);

        return back()->with('success', 'Transfer request rejected by Admin.');
    }
}
