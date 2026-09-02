<?php

namespace App\Http\Controllers;

use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\State;
use App\Models\StudService;
use App\Models\StudServiceImage;
use App\Models\TrainerProfile;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MemberStudServiceController
{
    /**
     * Display a listing of the user's stud services.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $studServices = StudService::where('user_id', $user->id)
            ->with(['breed', 'state', 'city', 'images'])
            ->latest()
            ->paginate(12);

        $studServices->getCollection()->transform(function ($studService) {
            $studService->featured_image_url = $studService->featured_image_path ? Storage::url($studService->featured_image_path) : null;

            return $studService;
        });

        return Inertia::render('dashboard/stud-services/index', [
            'studServices' => $studServices,
        ]);
    }

    /**
     * Show the form for creating a new stud service.
     */
    public function create()
    {
        if (! auth()->user()->canCreateListing()) {
            return redirect()->route('dashboard.stud-services.index')->with('error', 'You have reached your listing limit. Please upgrade your tier to post more stud services.');
        }

        return Inertia::render('dashboard/stud-services/form', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'profiles' => $this->getMemberProfiles(auth()->user()),
        ]);
    }

    /**
     * Store a newly created stud service.
     */
    public function store(Request $request)
    {
        if (! auth()->user()->canCreateListing()) {
            return redirect()->route('dashboard.stud-services.index')->with('error', 'You have reached your listing limit. Please upgrade your tier to post more stud services.');
        }

        $user = $request->user();

        $validated = $request->validate([
            'breed_id' => 'required|exists:breeds,id',
            'stud_dog_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
            'kci_registered' => 'boolean',
            'sire_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'dam_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'is_negotiable' => 'boolean',
            'is_vaccinated' => 'boolean',
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
            'profile_id' => 'nullable',
            'profile_type' => 'nullable',
        ]);

        if ($request->filled('profile_id') && $request->profile_id !== 'none') {
            $validated['profile_id'] = $request->profile_id;
            $validated['profile_type'] = $request->profile_type;
        } else {
            $validated['profile_id'] = null;
            $validated['profile_type'] = null;
        }

        if ($request->has('fee')) {
            $validated['price'] = $validated['fee'];
            unset($validated['fee']);
        }

        $validated['user_id'] = $user->id;
        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        $validated['status'] = 'published';
        $validated['is_available'] = true;
        $validated['is_approved'] = false;

        $studService = StudService::create($validated);

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('stud_services/'.$studService->id.'/featured', 'public');
            $studService->update(['featured_image_path' => $path]);
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

        try {
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\StudServiceCreatedMail($user->name, $studService->load(['breed', 'city', 'state'])));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send stud service created email: ' . $e->getMessage());
        }

        return redirect()->route('dashboard.stud-services.index')->with('success', 'Stud service listing created and pending approval.');
    }

    /**
     * Show the form for editing the specified stud service.
     */
    public function edit(StudService $studService)
    {
        $this->authorizeOwner($studService);

        $studService->load(['images']);
        $studService->featured_image_url = $studService->featured_image_path ? Storage::url($studService->featured_image_path) : null;
        $studService->images->each(function ($image) {
            $image->image_url = Storage::url($image->image_path);
        });

        return Inertia::render('dashboard/stud-services/form', [
            'studService' => $studService,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'profiles' => $this->getMemberProfiles(auth()->user()),
        ]);
    }

    /**
     * Update the specified stud service.
     */
    public function update(Request $request, StudService $studService)
    {
        $this->authorizeOwner($studService);

        $validated = $request->validate([
            'breed_id' => 'required|exists:breeds,id',
            'stud_dog_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
            'kci_registered' => 'boolean',
            'sire_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'dam_name' => 'nullable|required_if:kci_registered,true|string|max:255',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'is_negotiable' => 'boolean',
            'is_vaccinated' => 'boolean',
            'is_available' => 'boolean',
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
            'profile_id' => 'nullable',
            'profile_type' => 'nullable',
        ]);

        if ($request->filled('profile_id') && $request->profile_id !== 'none') {
            $validated['profile_id'] = $request->profile_id;
            $validated['profile_type'] = $request->profile_type;
        } else {
            $validated['profile_id'] = null;
            $validated['profile_type'] = null;
        }

        if ($studService->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        }

        $studService->update($validated);

        if ($request->hasFile('featured_image')) {
            if ($studService->featured_image_path) {
                Storage::disk('public')->delete($studService->featured_image_path);
            }
            $path = $request->file('featured_image')->store('stud_services/'.$studService->id.'/featured', 'public');
            $studService->update(['featured_image_path' => $path]);
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

        return redirect()->route('dashboard.stud-services.index')->with('success', 'Stud service listing updated.');
    }

    /**
     * Remove the specified stud service.
     */
    public function destroy(StudService $studService)
    {
        $this->authorizeOwner($studService);

        if ($studService->featured_image_path) {
            Storage::disk('public')->delete($studService->featured_image_path);
        }

        foreach ($studService->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $studService->delete();

        return back()->with('success', 'Stud service listing removed successfully.');
    }

    /**
     * Delete a specific image.
     */
    public function deleteImage(StudServiceImage $image)
    {
        $studService = $image->studService;
        $this->authorizeOwner($studService);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image removed.');
    }

    /**
     * Helper to get user profiles.
     */
    protected function getMemberProfiles($user)
    {
        $profiles = collect();

        if ($user->breederProfile) {
            $profiles->push([
                'id' => $user->breederProfile->id,
                'name' => $user->breederProfile->kennel_name,
                'type' => BreederProfile::class,
                'label' => 'Breeder Profile',
            ]);
        }

        if ($user->welfareProfile) {
            $profiles->push([
                'id' => $user->welfareProfile->id,
                'name' => $user->welfareProfile->organization_name,
                'type' => WelfareProfile::class,
                'label' => 'Welfare Profile',
            ]);
        }

        $user->load(['vetProfile', 'trainerProfile', 'boardingProfile']);

        if ($user->vetProfile) {
            $profiles->push(['id' => $user->vetProfile->id, 'name' => $user->vetProfile->clinic_name, 'type' => VetProfile::class, 'label' => 'Vet Profile']);
        }
        if ($user->trainerProfile) {
            $profiles->push(['id' => $user->trainerProfile->id, 'name' => $user->trainerProfile->name, 'type' => TrainerProfile::class, 'label' => 'Trainer Profile']);
        }
        if ($user->boardingProfile) {
            $profiles->push(['id' => $user->boardingProfile->id, 'name' => $user->boardingProfile->name, 'type' => BoardingProfile::class, 'label' => 'Boarding Profile']);
        }

        return $profiles;
    }

    /**
     * Ensure user owns the stud service.
     */
    protected function authorizeOwner(StudService $studService)
    {
        if ($studService->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
