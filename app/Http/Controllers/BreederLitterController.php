<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\Litter;
use App\Models\LitterImage;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BreederLitterController
{
    /**
     * Display a listing of the breeder's litters.
     */
    public function index()
    {
        $user = Auth::user();

        $litters = Litter::with(['breed', 'state', 'city', 'images'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('breeder/litters/index', [
            'litters' => $litters,
        ]);
    }

    /**
     * Show the form for creating a new litter.
     */
    public function create()
    {
        if (! Auth::user()->canCreateListing()) {
            return redirect()->route('breeder.litters.index')->with('error', 'You have reached your listing limit. Please upgrade your tier to post more litters.');
        }

        return Inertia::render('breeder/litters/form', [
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created litter in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (! $user->canCreateListing()) {
            return redirect()->route('breeder.litters.index')->with('error', 'You have reached your listing limit. Please upgrade your tier to post more litters.');
        }

        $profile = BreederProfile::where('user_id', $user->id)->first();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:litters,slug',
            'description' => 'required|string',
            'breed_id' => 'required|exists:breeds,id',
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
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'kci_images.*' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $validated['user_id'] = $user->id;
        $validated['profile_id'] = $profile?->id;
        $validated['profile_type'] = $profile ? get_class($profile) : null;
        $validated['is_approved'] = false;

        if (! $request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
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

        try {
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\LitterCreatedMail($user->name, $litter->load(['breed', 'city', 'state'])));

            // WhatsApp & Push to breeder
            try {
                $whatsAppService = app(\App\Services\WhatsAppService::class);
                if ($whatsAppService->isEnabled() && !empty($user->mobile_number)) {
                    $whatsAppService->sendTextMessage(
                        $user->mobile_number,
                        "🐾 *WoofCircle Litter Listing Submitted*\n\nYour listing *'{$litter->title}'* has been submitted and is currently under verification. You will be notified as soon as it goes live!"
                    );
                }
                $pushService = app(\App\Services\PushNotificationService::class);
                if ($pushService->isEnabled()) {
                    $pushService->sendToUser(
                        $user->id,
                        "Litter Submitted for Review 🐾",
                        "Your listing '{$litter->title}' is being verified by our team.",
                        route('breeder.litters.index')
                    );
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('WhatsApp/Push litter created error: ' . $e->getMessage());
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send litter created email: ' . $e->getMessage());
        }

        return redirect()->route('breeder.litters.index')->with('success', 'Litter listing created and pending approval.');
    }

    /**
     * Show the form for editing the specified litter.
     */
    public function edit(Litter $litter)
    {
        $user = Auth::user();

        if ($litter->user_id !== $user->id) {
            abort(403);
        }

        $litter->load('images');

        return Inertia::render('breeder/litters/form', [
            'litter' => $litter,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'cities' => City::select('id', 'name', 'state_id')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified litter in storage.
     */
    public function update(Request $request, Litter $litter)
    {
        $user = Auth::user();

        if ($litter->user_id !== $user->id) {
            abort(403);
        }

        $profile = BreederProfile::where('user_id', $user->id)->first();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:litters,slug,'.$litter->id,
            'description' => 'required|string',
            'breed_id' => 'required|exists:breeds,id',
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
            'is_champion' => 'boolean',
            'awards_count' => 'nullable|integer|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'kci_images.*' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
        ]);

        if ($request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['slug']);
        } elseif ($litter->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);
        }

        $validated['profile_id'] = $profile?->id;
        $validated['profile_type'] = $profile ? get_class($profile) : null;
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
            $currentCount = $litter->images()->where('image_type', 'gallery')->count();
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('litters/'.$litter->id, 'public');
                $litter->images()->create([
                    'image_path' => $path,
                    'image_type' => 'gallery',
                    'sort_order' => $currentCount + $index,
                ]);
            }
        }

        return redirect()->route('breeder.litters.index')->with('success', 'Litter listing updated.');
    }

    /**
     * Remove the specified litter from storage.
     */
    public function destroy(Litter $litter)
    {
        $user = Auth::user();

        if ($litter->user_id !== $user->id) {
            abort(403);
        }

        // Delete featured image
        if ($litter->featured_image_path) {
            Storage::disk('public')->delete($litter->featured_image_path);
        }

        // Delete associated images from storage
        foreach ($litter->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $litter->delete();

        return back()->with('success', 'Litter listing deleted.');
    }

    /**
     * Delete a specific image from a litter.
     */
    public function deleteImage(LitterImage $image)
    {
        $user = Auth::user();
        $litter = $image->litter;

        if ($litter->user_id !== $user->id) {
            abort(403);
        }

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image removed.');
    }
}
