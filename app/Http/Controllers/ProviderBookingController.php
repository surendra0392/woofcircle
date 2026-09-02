<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Booking;
use App\Models\ProviderAvailability;
use App\Models\DirectoryProfile;

class ProviderBookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get all profile IDs for this user from directory_profiles
        $profiles = DirectoryProfile::where('user_id', $user->id)->get();
        
        if ($profiles->isEmpty()) {
            return Inertia::render('dashboard/business/bookings', [
                'bookings' => [],
                'profiles' => [],
            ]);
        }
        
        $profileIds = $profiles->pluck('id')->toArray();
        $profileTypes = [
            'vet', 'trainer', 'boarding', 'welfare', 'pet-shop', 'breeder',
            'App\Models\DirectoryProfile', 'App\Models\VetProfile', 'App\Models\TrainerProfile', 
            'App\Models\BoardingProfile', 'App\Models\WelfareProfile', 'App\Models\PetShopProfile', 'App\Models\BreederProfile'
        ];

        // Retrieve bookings for the provider's profiles
        $bookings = Booking::with('user:id,name,email,mobile_number')
            ->whereIn('provider_id', $profileIds)
            ->whereIn('provider_type', $profileTypes)
            ->orderBy('start_time', 'asc')
            ->paginate(15);

        return Inertia::render('dashboard/business/bookings', [
            'bookings' => $bookings,
            'profiles' => $profiles->map(fn($p) => ['id' => $p->id, 'name' => $p->name ?? $p->clinic_name ?? 'Profile', 'type' => $p->type])
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $user = $request->user();
        $profiles = DirectoryProfile::where('user_id', $user->id)->pluck('id')->toArray();
        
        // Ensure this booking belongs to one of the user's profiles
        if (!in_array($booking->provider_id, $profiles)) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:scheduled,completed,cancelled'
        ]);

        $booking->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Booking status updated successfully.');
    }

    public function availabilityIndex(Request $request)
    {
        $user = $request->user();
        $profiles = DirectoryProfile::where('user_id', $user->id)->get();
        
        if ($profiles->isEmpty()) {
            return Inertia::render('dashboard/business/availability', [
                'availabilities' => [],
                'profiles' => [],
            ]);
        }

        $profileIds = $profiles->pluck('id')->toArray();
        $profileTypes = [
            'vet', 'trainer', 'boarding', 'welfare', 'pet-shop', 'breeder',
            'App\Models\DirectoryProfile', 'App\Models\VetProfile', 'App\Models\TrainerProfile', 
            'App\Models\BoardingProfile', 'App\Models\WelfareProfile', 'App\Models\PetShopProfile', 'App\Models\BreederProfile'
        ];

        $availabilities = ProviderAvailability::whereIn('provider_id', $profileIds)
            ->whereIn('provider_type', $profileTypes)
            ->orderBy('day_of_week', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return Inertia::render('dashboard/business/availability', [
            'availabilities' => $availabilities,
            'profiles' => $profiles->map(fn($p) => ['id' => $p->id, 'name' => $p->name ?? $p->clinic_name ?? 'Profile', 'type' => $p->type])
        ]);
    }

    public function storeAvailability(Request $request)
    {
        $user = $request->user();
        $profiles = DirectoryProfile::where('user_id', $user->id)->pluck('id')->toArray();

        $request->validate([
            'provider_type' => 'required|string',
            'provider_id' => 'required|integer|in:' . implode(',', $profiles),
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'slot_duration_minutes' => 'required|integer|min:15|max:240'
        ]);

        ProviderAvailability::create($request->all());

        return back()->with('success', 'Availability slot added.');
    }

    public function destroyAvailability(Request $request, ProviderAvailability $availability)
    {
        $user = $request->user();
        $profiles = DirectoryProfile::where('user_id', $user->id)->pluck('id')->toArray();
        
        // Ensure this availability belongs to one of the user's profiles
        if (!in_array($availability->provider_id, $profiles)) {
            abort(403);
        }

        $availability->delete();

        return back()->with('success', 'Availability slot removed.');
    }
}
