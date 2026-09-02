<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DirectoryProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\State;
use App\Models\City;

class AgentOnboardingController extends Controller
{
    public function create()
    {
        return Inertia::render('Agent/OnboardingForm', [
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'vet_services' => \App\Models\VetService::orderBy('name')->get(),
            'trainer_specializations' => \App\Models\TrainerSpecialization::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'owner_name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|unique:users,email',
            'business_name' => 'required|string|max:255',
            'type' => 'required|in:vet,pet_shop,breeder,trainer,boarding,welfare',
            'phone' => ['required', 'string', 'digits:10'],
            'address' => 'required|string',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'description' => 'nullable|string',
            'experience_years' => 'nullable|integer',
            'website' => 'nullable|url|max:255',
            'service_type' => 'nullable|in:boarding,daycare,both',
            'capacity' => 'nullable|integer|min:1',
            'price_per_day' => 'nullable|numeric|min:0',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'logo' => 'nullable|image|max:5120',
            'gallery.*' => 'nullable|image|max:5120',
            'services' => 'nullable|array',
            'services.*' => 'exists:vet_services,id',
            'specializations' => 'nullable|array',
            'specializations.*' => 'exists:trainer_specializations,id',
        ]);

        $user = User::create([
            'first_name' => explode(' ', $validated['owner_name'])[0],
            'last_name' => count(explode(' ', $validated['owner_name'])) > 1 ? explode(' ', $validated['owner_name'], 2)[1] : '',
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(12)),
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('directory/logos', 'public');
        }

        $profile = DirectoryProfile::create([
            'user_id' => $user->id,
            'agent_id' => auth('admin')->id(),
            'type' => $validated['type'],
            'name' => $validated['business_name'],
            'phone' => '+91 ' . $validated['phone'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'state_id' => $validated['state_id'],
            'city_id' => $validated['city_id'],
            'description' => $validated['description'] ?? null,
            'experience_years' => $validated['experience_years'] ?? null,
            'website' => $validated['website'] ?? null,
            'service_type' => $validated['service_type'] ?? null,
            'capacity' => $validated['capacity'] ?? null,
            'price_per_day' => $validated['price_per_day'] ?? null,
            'facebook_url' => $validated['facebook_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'twitter_url' => $validated['twitter_url'] ?? null,
            'youtube_url' => $validated['youtube_url'] ?? null,
            'logo' => $logoPath,
            'is_active' => true,
        ]);

        if ($validated['type'] === 'vet' && !empty($validated['services'])) {
            $profile->services()->sync($validated['services']);
        }

        if ($validated['type'] === 'trainer' && !empty($validated['specializations'])) {
            $profile->specializations()->sync($validated['specializations']);
        }

        if ($request->hasFile('gallery')) {
            $currentCount = 0;
            foreach ($request->file('gallery') as $image) {
                if ($currentCount >= 10) break;
                $path = $image->store('directory/gallery', 'public');
                $profile->gallery()->create(['image' => $path]);
                $currentCount++;
            }
        }

        return redirect()->route('agent.dashboard')->with('success', 'Profile onboarded successfully.');
    }
}
