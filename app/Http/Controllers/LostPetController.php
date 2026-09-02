<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Notification;
use App\Notifications\LostPetAlertNotification;
use Illuminate\Support\Facades\DB;

class LostPetController extends Controller
{
    public function index(Request $request)
    {
        $query = Pet::with(['user', 'breed'])
            ->where('is_lost', true)
            ->whereNotNull('lost_at')
            ->orderByDesc('lost_at');

        if ($request->filled('state')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('state_id', $request->state);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('lost_location', 'like', "%{$search}%")
                    ->orWhere('lost_description', 'like', "%{$search}%")
                    ->orWhereHas('breed', fn($b) => $b->where('name', 'like', "%{$search}%"));
            });
        }

        $lostPets = $query->paginate(12)->through(fn($pet) => [
            'id' => $pet->id,
            'name' => $pet->name,
            'passport_number' => $pet->passport_number,
            'gender' => $pet->gender,
            'color' => $pet->color,
            'profile_image_url' => $pet->profile_image_url,
            'lost_at' => $pet->lost_at?->format('Y-m-d'),
            'lost_location' => $pet->lost_location,
            'lost_description' => $pet->lost_description,
            'lost_lat' => $pet->lost_lat,
            'lost_lng' => $pet->lost_lng,
            'days_missing' => $pet->lost_at ? $pet->lost_at->diffInDays(now()) : 0,
            'breed' => $pet->breed ? ['name' => $pet->breed->name] : null,
            'owner' => $pet->user ? [
                'name' => $pet->user->name,
                'id' => $pet->user->id,
            ] : null,
        ]);

        $states = State::orderBy('name')->get(['id', 'name']);
        $totalLostCount = Pet::where('is_lost', true)->count();

        return Inertia::render('lost-pets/index', [
            'lost_pets' => $lostPets,
            'states' => $states,
            'total_lost_count' => $totalLostCount,
            'filters' => $request->only(['state', 'search']),
        ]);
    }

    public function reportLost(Request $request, Pet $pet)
    {
        $this->authorize('update', $pet);

        $request->validate([
            'lost_location' => 'required|string|max:255',
            'lost_description' => 'nullable|string|max:1000',
        ]);

        $lat = null;
        $lng = null;
        if ($request->lost_location) {
            try {
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'User-Agent' => 'WoofCircle/1.0'
                ])->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $request->lost_location,
                    'format' => 'json',
                    'limit' => 1
                ]);
                if ($response->successful() && !empty($response->json())) {
                    $data = $response->json()[0];
                    $lat = $data['lat'] ?? null;
                    $lng = $data['lon'] ?? null;
                }
            } catch (\Exception $e) {}
        }

        $pet->update([
            'is_lost' => true,
            'lost_at' => now(),
            'lost_location' => $request->lost_location,
            'lost_description' => $request->lost_description,
            'lost_lat' => $lat,
            'lost_lng' => $lng,
        ]);

        if ($lat && $lng) {
            $radius = 5; // 5 km
            $users = User::select('users.*')
                ->leftJoin('cities', 'users.city_id', '=', 'cities.id')
                ->selectRaw('
                    ( 6371 * acos( cos( radians(?) ) *
                      cos( radians( COALESCE(users.latitude, cities.latitude) ) ) *
                      cos( radians( COALESCE(users.longitude, cities.longitude) ) - radians(?) ) +
                      sin( radians(?) ) *
                      sin( radians( COALESCE(users.latitude, cities.latitude) ) ) )
                    ) AS distance
                ', [$lat, $lng, $lat])
                ->where('users.id', '!=', $pet->user_id)
                ->having('distance', '<=', $radius)
                ->get();

            if ($users->isNotEmpty()) {
                Notification::send($users, new LostPetAlertNotification($pet));
            }
        }

        return back()->with('success', $pet->name . ' has been reported as missing. We hope they are found soon.');
    }

    public function markFound(Pet $pet)
    {
        $this->authorize('update', $pet);

        $pet->update([
            'is_lost' => false,
            'lost_at' => null,
            'lost_location' => null,
            'lost_description' => null,
            'lost_lat' => null,
            'lost_lng' => null,
        ]);

        return back()->with('success', 'Great news! ' . $pet->name . ' has been marked as found.');
    }
}
