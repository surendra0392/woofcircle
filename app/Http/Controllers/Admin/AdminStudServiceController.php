<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\State;
use App\Models\StudService;
use App\Models\StudServiceImage;
use App\Models\TrainerProfile;
use App\Models\User;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminStudServiceController
{
    /**
     * Display a listing of the stud services.
     */
    public function index(Request $request)
    {
        $query = StudService::with(['user.role', 'profile', 'breed', 'state', 'city', 'images']);

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

        $studServices = $query->latest()->paginate(10)->withQueryString();

        // Transform image paths to URLs for the current page items
        $studServices->getCollection()->each(function ($studService) {
            $studService->featured_image_url = $studService->featured_image_path ? Storage::url($studService->featured_image_path) : null;
            $studService->images->each(function ($image) {
                $image->image_url = Storage::url($image->image_path);
            });

            // Unify profile name for different roles
            if ($studService->profile) {
                if ($studService->profile_type === BreederProfile::class) {
                    $studService->profile->name = $studService->profile->kennel_name;
                } elseif ($studService->profile_type === VetProfile::class) {
                    $studService->profile->name = $studService->profile->clinic_name;
                } elseif ($studService->profile_type === WelfareProfile::class) {
                    $studService->profile->name = $studService->profile->organization_name;
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

        return Inertia::render('admin/stud-services', [
            'studServices' => $studServices,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'filters' => $request->only(['is_approved', 'is_available', 'breed_id', 'state_id', 'city_id', 'status', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new stud service.
     */
    public function create()
    {
        $profiles = collect();
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/stud-services/create', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified stud service.
     */
    public function edit(StudService $studService)
    {
        $studService->load(['images']);
        $studService->featured_image_url = $studService->featured_image_path ? Storage::url($studService->featured_image_path) : null;
        $studService->images->each(function ($image) {
            $image->image_url = Storage::url($image->image_path);
        });

        $profiles = collect();
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/stud-services/edit', [
            'studService' => $studService,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created stud service.
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
            'stud_dog_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:stud_services,slug',
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
            'kci_registered' => 'boolean',
            'sire_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'dam_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'status' => 'required|string|in:draft,published,available,unavailable',
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

        $studService = StudService::create($validated);

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('stud_services/'.$studService->id.'/featured', 'public');
            $studService->update(['featured_image_path' => $path]);
        }

        if ($request->hasFile('kci_images')) {
            foreach ($request->file('kci_images') as $index => $image) {
                $path = $image->store('stud_services/'.$studService->id.'/kci', 'public');
                $studService->images()->create([
                    'image_path' => $path,
                    'image_type' => 'kci',
                    'sort_order' => $index,
                ]);
            }
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('stud_services/'.$studService->id, 'public');
                $studService->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.stud-services.index')->with('success', 'Stud service listing created successfully.');
    }

    /**
     * Update the specified stud service.
     */
    public function update(Request $request, StudService $studService)
    {
        if ($request->profile_id === 'none') {
            $request->merge(['profile_id' => null, 'profile_type' => null]);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'profile_id' => 'nullable|integer',
            'profile_type' => 'nullable|string',
            'breed_id' => 'required|exists:breeds,id',
            'stud_dog_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:stud_services,slug,'.$studService->id,
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
            'kci_registered' => 'boolean',
            'sire_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'dam_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'status' => 'required|string|in:draft,published,available,unavailable',
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
        } elseif ($studService->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        }

        if ($request->filled('featured_duration')) {
            $days = (int) filter_var($validated['featured_duration'], FILTER_SANITIZE_NUMBER_INT);
            $validated['featured_until'] = now()->addDays($days);
        }

        $studService->update($validated);

        if ($request->hasFile('featured_image')) {
            if ($studService->featured_image_path) {
                Storage::disk('public')->delete($studService->featured_image_path);
            }
            $path = $request->file('featured_image')->store('stud_services/'.$studService->id.'/featured', 'public');
            $studService->update(['featured_image_path' => $path]);
        }

        if ($request->hasFile('kci_images')) {
            $currentKciCount = $studService->images()->where('image_type', 'kci')->count();
            foreach ($request->file('kci_images') as $index => $image) {
                $path = $image->store('stud_services/'.$studService->id.'/kci', 'public');
                $studService->images()->create([
                    'image_path' => $path,
                    'image_type' => 'kci',
                    'sort_order' => $currentKciCount + $index,
                ]);
            }
        }

        if ($request->hasFile('images')) {
            $currentCount = $studService->images()->count();
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('stud_services/'.$studService->id, 'public');
                $studService->images()->create([
                    'image_path' => $path,
                    'sort_order' => $currentCount + $index,
                ]);
            }
        }

        return redirect()->route('admin.stud-services.index')->with('success', 'Stud service listing updated successfully.');
    }

    /**
     * Toggle the approval status.
     */
    public function toggleApproval(StudService $studService)
    {
        $studService->update(['is_approved' => ! $studService->is_approved]);

        if ($studService->is_approved && $studService->user && $studService->user->email) {
            try {
                \Illuminate\Support\Facades\Mail::to($studService->user->email)
                    ->send(new \App\Mail\ListingApprovedMail(
                        $studService->user->name,
                        'Stud Service',
                        $studService->title,
                        route('marketplace.studs.show', $studService->slug)
                    ));

                // WhatsApp & Push to owner
                try {
                    $whatsAppService = app(\App\Services\WhatsAppService::class);
                    if ($whatsAppService->isEnabled() && !empty($studService->user->mobile_number)) {
                        $whatsAppService->sendTextMessage(
                            $studService->user->mobile_number,
                            "🎉 *Your WoofCircle Stud Listing is Live!*\n\nYour Stud Service listing *'{$studService->title}'* has been approved and published to the registry:\n" . route('marketplace.studs.show', $studService->slug)
                        );
                    }
                    $pushService = app(\App\Services\PushNotificationService::class);
                    if ($pushService->isEnabled()) {
                        $pushService->sendToUser(
                            $studService->user->id,
                            "Stud Listing Approved 🎉",
                            "Your listing '{$studService->title}' is now live on the registry.",
                            route('marketplace.studs.show', $studService->slug)
                        );
                    }
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('WhatsApp/Push stud approved error: ' . $e->getMessage());
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to send stud approved email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Approval status updated.');
    }

    /**
     * Toggle the availability status.
     */
    public function toggleAvailability(StudService $studService)
    {
        $studService->update(['is_available' => ! $studService->is_available]);

        return back()->with('success', 'Availability status updated.');
    }

    /**
     * Remove the specified stud service.
     */
    public function destroy(StudService $studService)
    {
        // Delete featured image
        if ($studService->featured_image_path) {
            Storage::disk('public')->delete($studService->featured_image_path);
        }

        // Delete associated images from storage
        foreach ($studService->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $studService->delete();

        return back()->with('success', 'Stud service listing removed successfully.');
    }

    /**
     * Delete a specific image from a stud service.
     */
    public function deleteImage(StudServiceImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image removed.');
    }
}
