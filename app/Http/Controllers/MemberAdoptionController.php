<?php

namespace App\Http\Controllers;

use App\Models\Adoption;
use App\Models\AdoptionImage;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\State;
use App\Models\TrainerProfile;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MemberAdoptionController
{
    /**
     * Display a listing of the user's adoptions.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $adoptions = Adoption::where('user_id', $user->id)
            ->with(['breed', 'state', 'city', 'images'])
            ->latest()
            ->paginate(12);

        $adoptions->getCollection()->transform(function ($adoption) {
            $adoption->featured_image_url = $adoption->featured_image_path ? Storage::url($adoption->featured_image_path) : null;

            return $adoption;
        });

        return Inertia::render('dashboard/adoptions/index', [
            'adoptions' => $adoptions,
        ]);
    }

    /**
     * Show the form for creating a new adoption.
     */
    public function create()
    {
        if (! auth()->user()->canCreateListing()) {
            return redirect()->route('dashboard.adoptions.index')->with('error', 'You have reached your listing limit. Please upgrade your tier to post more adoptions.');
        }

        return Inertia::render('dashboard/adoptions/form', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'profiles' => $this->getMemberProfiles(auth()->user()),
        ]);
    }

    /**
     * Store a newly created adoption.
     */
    public function store(Request $request)
    {
        if (! auth()->user()->canCreateListing()) {
            return redirect()->route('dashboard.adoptions.index')->with('error', 'You have reached your listing limit. Please upgrade your tier to post more adoptions.');
        }

        $user = $request->user();

        $validated = $request->validate([
            'breed_id' => 'required|exists:breeds,id',
            'gender' => 'required|string|in:male,female',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
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

        try {
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\AdoptionCreatedMail($user->name, $adoption->load(['breed', 'city', 'state'])));

            // WhatsApp & Push to rescuer / poster
            try {
                $whatsAppService = app(\App\Services\WhatsAppService::class);
                if ($whatsAppService->isEnabled() && !empty($user->mobile_number)) {
                    $whatsAppService->sendTextMessage(
                        $user->mobile_number,
                        "🐾 *WoofCircle Adoption Listing Submitted*\n\nYour adoption listing for *'{$adoption->title}'* has been submitted for review. You will receive an alert once approved!"
                    );
                }
                $pushService = app(\App\Services\PushNotificationService::class);
                if ($pushService->isEnabled()) {
                    $pushService->sendToUser(
                        $user->id,
                        "Adoption Listing Submitted 🐾",
                        "Your listing '{$adoption->title}' is being verified by our team.",
                        route('dashboard.adoptions.index')
                    );
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('WhatsApp/Push adoption created error: ' . $e->getMessage());
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send adoption created email: ' . $e->getMessage());
        }

        return redirect()->route('dashboard.adoptions.index')->with('success', 'Adoption listing created and pending approval.');
    }

    /**
     * Show the form for editing the specified adoption.
     */
    public function edit(Adoption $adoption)
    {
        $this->authorizeOwner($adoption);

        $adoption->load(['images']);
        $adoption->featured_image_url = $adoption->featured_image_path ? Storage::url($adoption->featured_image_path) : null;
        $adoption->images->each(function ($image) {
            $image->image_url = Storage::url($image->image_path);
        });

        return Inertia::render('dashboard/adoptions/form', [
            'adoption' => $adoption,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
            'profiles' => $this->getMemberProfiles(auth()->user()),
        ]);
    }

    /**
     * Update the specified adoption.
     */
    public function update(Request $request, Adoption $adoption)
    {
        $this->authorizeOwner($adoption);

        $validated = $request->validate([
            'breed_id' => 'required|exists:breeds,id',
            'gender' => 'required|string|in:male,female',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:100',
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

        if ($adoption->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
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

        return redirect()->route('dashboard.adoptions.index')->with('success', 'Adoption listing updated.');
    }

    /**
     * Remove the specified adoption.
     */
    public function destroy(Adoption $adoption)
    {
        $this->authorizeOwner($adoption);

        if ($adoption->featured_image_path) {
            Storage::disk('public')->delete($adoption->featured_image_path);
        }

        foreach ($adoption->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $adoption->delete();

        return back()->with('success', 'Adoption listing removed successfully.');
    }

    /**
     * Delete a specific image.
     */
    public function deleteImage(AdoptionImage $image)
    {
        $adoption = $image->adoption;
        $this->authorizeOwner($adoption);

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

        // Add others if needed (Vet, Trainer, etc.)
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
     * Ensure user owns the adoption.
     */
    protected function authorizeOwner(Adoption $adoption)
    {
        if ($adoption->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
