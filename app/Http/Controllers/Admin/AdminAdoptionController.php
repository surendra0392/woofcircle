<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Adoption;
use App\Models\AdoptionImage;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\State;
use App\Models\TrainerProfile;
use App\Models\User;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminAdoptionController
{
    /**
     * Display a listing of the adoptions.
     */
    public function index(Request $request)
    {
        $query = Adoption::with(['user.role', 'profile', 'breed', 'state', 'city', 'images']);

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
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        $adoptions = $query->latest()->paginate(10)->withQueryString();

        // Transform image paths to URLs
        $adoptions->getCollection()->each(function ($adoption) {
            $adoption->featured_image_url = $adoption->featured_image_path ? Storage::url($adoption->featured_image_path) : null;
            $adoption->images->each(function ($image) {
                $image->image_url = Storage::url($image->image_path);
            });

            // Unify profile name
            if ($adoption->profile) {
                if ($adoption->profile_type === BreederProfile::class) {
                    $adoption->profile->name = $adoption->profile->kennel_name;
                } elseif ($adoption->profile_type === VetProfile::class) {
                    $adoption->profile->name = $adoption->profile->clinic_name;
                } elseif ($adoption->profile_type === WelfareProfile::class) {
                    $adoption->profile->name = $adoption->profile->organization_name;
                }
            }
        });

        return Inertia::render('admin/adoptions', [
            'adoptions' => $adoptions,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'filters' => $request->only(['is_approved', 'is_available', 'breed_id', 'state_id', 'city_id', 'gender', 'status', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new adoption.
     */
    public function create()
    {
        $profiles = collect();
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/adoptions/create', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing an adoption listing.
     */
    public function edit(Adoption $adoption)
    {
        $adoptionData = array_merge($adoption->toArray(), [
            'featured_image_url' => $adoption->featured_image_path ? Storage::url($adoption->featured_image_path) : null,
            'images' => $adoption->images->map(function ($img) {
                return [
                    'id' => $img->id,
                    'image' => Storage::url($img->image_path),
                ];
            })->toArray(),
        ]);

        $profiles = collect();
        $profiles = $profiles->concat(BreederProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BreederProfile::class]));
        $profiles = $profiles->concat(VetProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => VetProfile::class]));
        $profiles = $profiles->concat(TrainerProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => TrainerProfile::class]));
        $profiles = $profiles->concat(BoardingProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => BoardingProfile::class]));
        $profiles = $profiles->concat(WelfareProfile::select('id', 'user_id', 'name')->get()->map(fn ($p) => [...$p->toArray(), 'type' => WelfareProfile::class]));

        return Inertia::render('admin/adoptions/edit', [
            'adoption' => $adoptionData,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name', 'email', 'role_id')->with('role')->orderBy('name')->get(),
            'profiles' => $profiles,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created adoption.
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
            'gender' => 'required|string|in:male,female',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:adoptions,slug',
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
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

        $adoption = Adoption::create($validated);

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('adoptions/'.$adoption->id.'/featured', 'public');
            $adoption->update(['featured_image_path' => $path]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('adoptions/'.$adoption->id, 'public');
                $adoption->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.adoptions.index')->with('success', 'Adoption listing created successfully.');
    }

    /**
     * Update the specified adoption.
     */
    public function update(Request $request, Adoption $adoption)
    {
        if ($request->profile_id === 'none') {
            $request->merge(['profile_id' => null, 'profile_type' => null]);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'profile_id' => 'nullable|integer',
            'profile_type' => 'nullable|string',
            'breed_id' => 'required|exists:breeds,id',
            'gender' => 'required|string|in:male,female',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:adoptions,slug,'.$adoption->id,
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
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
            'is_featured' => 'boolean',
            'featured_position' => 'nullable|integer|min:1|max:5',
            'featured_duration' => 'nullable|string|in:1d,3d,7d,15d,30d',
            'images.*' => 'nullable|image|max:2048',
        ]);

        if ($request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['slug']);
        } elseif ($adoption->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        }

        if ($request->filled('featured_duration')) {
            $days = (int) filter_var($validated['featured_duration'], FILTER_SANITIZE_NUMBER_INT);
            $validated['featured_until'] = now()->addDays($days);
        }

        $adoption->update($validated);

        if ($request->hasFile('featured_image')) {
            if ($adoption->featured_image_path) {
                Storage::disk('public')->delete($adoption->featured_image_path);
            }
            $path = $request->file('featured_image')->store('adoptions/'.$adoption->id.'/featured', 'public');
            $adoption->update(['featured_image_path' => $path]);
        }

        if ($request->hasFile('images')) {
            $currentCount = $adoption->images()->count();
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('adoptions/'.$adoption->id, 'public');
                $adoption->images()->create([
                    'image_path' => $path,
                    'sort_order' => $currentCount + $index,
                ]);
            }
        }

        return redirect()->route('admin.adoptions.index')->with('success', 'Adoption listing updated successfully.');
    }

    /**
     * Toggle approval status.
     */
    public function toggleApproval(Adoption $adoption)
    {
        $adoption->update(['is_approved' => ! $adoption->is_approved]);

        if ($adoption->is_approved && $adoption->user && $adoption->user->email) {
            try {
                \Illuminate\Support\Facades\Mail::to($adoption->user->email)
                    ->send(new \App\Mail\ListingApprovedMail(
                        $adoption->user->name,
                        'Adoption',
                        $adoption->title,
                        route('marketplace.adoption.show', $adoption->slug)
                    ));

                // WhatsApp & Push to rescuer / welfare
                try {
                    $whatsAppService = app(\App\Services\WhatsAppService::class);
                    if ($whatsAppService->isEnabled() && !empty($adoption->user->mobile_number)) {
                        $whatsAppService->sendTextMessage(
                            $adoption->user->mobile_number,
                            "🐾 *Your WoofCircle Adoption Listing is Live!*\n\nYour adoption listing for *'{$adoption->title}'* has been approved and published to the rescue network:\n" . route('marketplace.adoption.show', $adoption->slug)
                        );
                    }
                    $pushService = app(\App\Services\PushNotificationService::class);
                    if ($pushService->isEnabled()) {
                        $pushService->sendToUser(
                            $adoption->user->id,
                            "Adoption Listing Approved 🐾",
                            "Your listing for '{$adoption->title}' is now live on the rescue network.",
                            route('marketplace.adoption.show', $adoption->slug)
                        );
                    }
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('WhatsApp/Push adoption approved error: ' . $e->getMessage());
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to send adoption approved email: ' . $e->getMessage());
            }
        }

        return redirect()->route('admin.adoptions.index')->with('success', 'Approval status updated.');
    }

    /**
     * Toggle availability status.
     */
    public function toggleAvailability(Adoption $adoption)
    {
        $adoption->update(['is_available' => ! $adoption->is_available]);

        return redirect()->route('admin.adoptions.index')->with('success', 'Availability status updated.');
    }

    /**
     * Remove the specified adoption.
     */
    public function destroy(Adoption $adoption)
    {
        if ($adoption->featured_image_path) {
            Storage::disk('public')->delete($adoption->featured_image_path);
        }

        foreach ($adoption->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $adoption->delete();

        return redirect()->route('admin.adoptions.index')->with('success', 'Adoption listing removed successfully.');
    }

    /**
     * Delete a specific image.
     */
    public function deleteImage(AdoptionImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image removed.');
    }
}
