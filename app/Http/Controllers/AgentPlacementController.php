<?php

namespace App\Http\Controllers;

use App\Models\AdPlacement;
use App\Models\DirectoryProfile;
use App\Models\Pet;
use App\Models\Adoption;
use App\Models\Litter;
use App\Models\StudService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentPlacementController extends Controller
{
    public function create()
    {
        // Also fetch states for targeting
        $states = \App\Models\State::orderBy('name')->get();
        // Fetch cities as well to pass to frontend for target selection
        $cities = \App\Models\City::orderBy('name')->get();

        return Inertia::render('Agent/BookAd', [
            'profiles' => [], // Removed eager loading of all entities, now loaded via search API
            'states' => $states,
            'cities' => $cities,
        ]);
    }

    public function searchEntities(Request $request)
    {
        $agent = auth('admin')->user();
        $query = $request->input('q', '');
        $category = $request->input('category', '');
        $searchStateId = $request->input('search_state_id', '');
        $searchCityId = $request->input('search_city_id', '');

        $filterQuery = function($q) use ($agent, $searchStateId, $searchCityId) {
            if ($agent->role !== 'superadmin') {
                if ($agent->city_id) {
                    $q->where('city_id', $agent->city_id);
                } elseif ($agent->state_id) {
                    $q->where('state_id', $agent->state_id);
                }
            }
            if ($searchCityId) {
                $q->where('city_id', $searchCityId);
            } elseif ($searchStateId) {
                $q->where('state_id', $searchStateId);
            }
            return $q;
        };

        $results = collect();

        // If category is a directory profile type
        $profileTypes = ['vet', 'trainer', 'boarding', 'welfare', 'pet_shop', 'breeder'];
        if (in_array($category, $profileTypes) || empty($category)) {
            $profilesQ = DirectoryProfile::with(['city:id,name', 'state:id,name'])
                ->where('is_active', true)
                ->select('id', 'name', 'type', 'city_id', 'state_id', 'logo');
            if ($category) {
                $profilesQ->where('type', $category);
            }
            if ($query) {
                $profilesQ->where('name', 'like', "%{$query}%");
            }
            $filterQuery($profilesQ);
            $results = $results->concat($profilesQ->limit(50)->get()->map(fn($item) => [
                'id' => $item->id, 'name' => $item->name, 'type' => $item->type, 'promotable_type' => DirectoryProfile::class,
                'image_url' => $item->logo_url,
                'location' => ($item->city ? $item->city->name . ', ' : '') . ($item->state ? $item->state->name : '')
            ]));
        }

        if ($category === 'adoption' || empty($category)) {
            $adoptionsQ = Adoption::with(['city:id,name', 'state:id,name'])
                ->select('id', 'title as name', 'city_id', 'state_id', 'featured_image_path');
            if ($query) {
                $adoptionsQ->where('title', 'like', "%{$query}%");
            }
            $filterQuery($adoptionsQ);
            $results = $results->concat($adoptionsQ->limit(20)->get()->map(fn($item) => [
                'id' => $item->id, 'name' => $item->name, 'type' => 'adoption', 'promotable_type' => Adoption::class,
                'image_url' => $item->featured_image_url,
                'location' => ($item->city ? $item->city->name . ', ' : '') . ($item->state ? $item->state->name : '')
            ]));
        }

        if ($category === 'litter' || empty($category)) {
            $littersQ = Litter::with(['city:id,name', 'state:id,name'])
                ->select('id', 'title as name', 'city_id', 'state_id', 'featured_image_path');
            if ($query) {
                $littersQ->where('title', 'like', "%{$query}%");
            }
            $filterQuery($littersQ);
            $results = $results->concat($littersQ->limit(20)->get()->map(fn($item) => [
                'id' => $item->id, 'name' => $item->name, 'type' => 'litter', 'promotable_type' => Litter::class,
                'image_url' => $item->featured_image_url,
                'location' => ($item->city ? $item->city->name . ', ' : '') . ($item->state ? $item->state->name : '')
            ]));
        }

        if ($category === 'stud_service' || empty($category)) {
            $studsQ = StudService::with(['city:id,name', 'state:id,name'])
                ->select('id', 'title as name', 'city_id', 'state_id', 'featured_image_path');
            if ($query) {
                $studsQ->where('title', 'like', "%{$query}%");
            }
            $filterQuery($studsQ);
            $results = $results->concat($studsQ->limit(20)->get()->map(fn($item) => [
                'id' => $item->id, 'name' => $item->name, 'type' => 'stud_service', 'promotable_type' => StudService::class,
                'image_url' => $item->featured_image_url,
                'location' => ($item->city ? $item->city->name . ', ' : '') . ($item->state ? $item->state->name : '')
            ]));
        }

        if ($agent->role === 'superadmin' && ($category === 'pet' || empty($category))) {
            $petsQ = Pet::select('id', 'name', 'profile_image_path');
            if ($query) {
                $petsQ->where('name', 'like', "%{$query}%");
            }
            $results = $results->concat($petsQ->limit(20)->get()->map(fn($item) => [
                'id' => $item->id, 'name' => $item->name, 'type' => 'pet', 'promotable_type' => Pet::class,
                'image_url' => $item->profile_image_url,
                'location' => 'Global'
            ]));
        }

        // Sort by name
        $sorted = $results->sortBy('name')->values();

        return response()->json($sorted);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'placement_slot' => 'nullable|string|in:listing_boost,header_leaderboard,sidebar_square,in_article',
            'promotable_type' => 'nullable|string',
            'promotable_id' => 'nullable|integer',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'target_url' => 'nullable|url|max:1000',
            'cta_text' => 'nullable|string|max:50',
            'banner_image' => 'nullable|image|max:4096',
            'tier' => 'required|string|in:platinum,gold,silver,bronze,featured',
            'duration' => 'required|string|in:7d,15d,1m,3m,6m,1y',
            'starts_at' => 'required|date',
            'targeted_state_ids' => 'nullable|array',
            'targeted_state_ids.*' => 'exists:states,id',
            'targeted_city_ids' => 'nullable|array',
            'targeted_city_ids.*' => 'exists:cities,id',
            'request_discount' => 'nullable|boolean',
            'discount_type' => 'nullable|string|in:fixed,percentage',
            'discount_amount' => 'nullable|numeric|min:1',
            'discount_reason' => 'nullable|string|max:255',
        ]);

        $slot = $validated['placement_slot'] ?? 'listing_boost';
        $agent = auth('admin')->user();
        
        // If it is a listing boost, verify promotable entity
        if ($slot === 'listing_boost' && !empty($validated['promotable_type'])) {
            $modelClass = $validated['promotable_type'];
            if (!class_exists($modelClass)) {
                abort(400, 'Invalid entity type.');
            }
            $entity = $modelClass::findOrFail($validated['promotable_id']);

            if ($agent && $agent->role !== 'superadmin' && $modelClass !== Pet::class) {
                if ($agent->city_id && $entity->city_id !== $agent->city_id) {
                    abort(403, 'This entity is outside your assigned city.');
                } elseif ($agent->state_id && $entity->state_id !== $agent->state_id) {
                    abort(403, 'This entity is outside your assigned state.');
                }
            }
        }

        $startsAt = \Carbon\Carbon::parse($validated['starts_at']);
        $endsAt = match ($validated['duration']) {
            '7d' => $startsAt->copy()->addDays(7),
            '15d' => $startsAt->copy()->addDays(15),
            '1m' => $startsAt->copy()->addMonth(),
            '3m' => $startsAt->copy()->addMonths(3),
            '6m' => $startsAt->copy()->addMonths(6),
            '1y' => $startsAt->copy()->addYear(),
            default => $startsAt->copy()->addMonth(),
        };

        // Check availability logic
        $tierLimits = [
            'platinum' => 1,
            'gold' => 2,
            'silver' => 2,
            'bronze' => 2,
            'featured' => 3,
        ];
        $limit = $tierLimits[$validated['tier']] ?? 1;

        $overlappingAds = AdPlacement::where('tier', $validated['tier'])
            ->where('placement_slot', $slot)
            ->whereIn('status', ['active', 'pending_approval'])
            ->where(function ($q) use ($startsAt, $endsAt) {
                $q->where('starts_at', '<', $endsAt)
                  ->where('ends_at', '>', $startsAt);
            })
            ->get()
            ->filter(function ($ad) use ($validated) {
                $myStates = $validated['targeted_state_ids'] ?? [];
                $myCities = $validated['targeted_city_ids'] ?? [];
                $theirStates = $ad->targeted_state_ids ?? [];
                $theirCities = $ad->targeted_city_ids ?? [];

                $myNational = empty($myStates) && empty($myCities);
                $theirNational = empty($theirStates) && empty($theirCities);

                if ($myNational || $theirNational) return true;

                if (!empty(array_intersect($myStates, $theirStates))) return true;
                if (!empty(array_intersect($myCities, $theirCities))) return true;

                return false;
            });

        if ($overlappingAds->count() >= $limit) {
            $dateStrings = $overlappingAds->map(fn($ad) => $ad->starts_at->format('d-m-Y') . ' to ' . $ad->ends_at->format('d-m-Y'))->implode(', ');
            $maxEndsAt = $overlappingAds->max('ends_at');
            $nextAvailable = $maxEndsAt ? $maxEndsAt->copy()->addDay()->format('Y-m-d') : '';
            
            throw \Illuminate\Validation\ValidationException::withMessages([
                'starts_at' => "The {$validated['tier']} tier is full for the selected dates and locations. Existing bookings: {$dateStrings}. You can schedule this ad to start on or after {$nextAvailable}."
            ]);
        }

        // Look up the official price from the centralized pricing table
        $pricing = \App\Models\AdPricing::where('tier', $validated['tier'])
            ->where('duration', $validated['duration'])
            ->first();
            
        if (!$pricing) {
            return back()->with('error', 'Pricing not configured for this tier and duration.');
        }
        $price = $pricing ? $pricing->price : 0;
        
        $approvalStatus = 'approved';
        if (!empty($validated['request_discount']) && !empty($validated['discount_amount'])) {
            $discountType = $validated['discount_type'] ?? 'fixed';
            $discountValue = (float)$validated['discount_amount'];

            if ($discountType === 'percentage') {
                if ($discountValue > 100) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'discount_amount' => 'Percentage discount cannot exceed 100%.'
                    ]);
                }
                $calculatedDiscount = ($price * $discountValue) / 100;
            } else {
                if ($discountValue >= $price) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'discount_amount' => 'Discount amount cannot be equal to or greater than the ad price.'
                    ]);
                }
                $calculatedDiscount = $discountValue;
            }

            $price = max(0, $price - $calculatedDiscount);
            $status = 'pending_approval';
            $approvalStatus = 'pending';
        } else {
            $status = 'active';
            $approvalStatus = 'approved';
        }

        // Handle uploaded banner image if present
        $bannerImagePath = null;
        if ($request->hasFile('banner_image')) {
            $bannerImagePath = $request->file('banner_image')->store('ad_banners', 'public');
        }

        AdPlacement::create([
            'promotable_type' => $validated['promotable_type'] ?? null,
            'promotable_id' => $validated['promotable_id'] ?? null,
            'agent_id' => auth('admin')->id(),
            'tier' => $validated['tier'],
            'placement_slot' => $slot,
            'title' => $validated['title'] ?? null,
            'subtitle' => $validated['subtitle'] ?? null,
            'banner_image_path' => $bannerImagePath,
            'target_url' => $validated['target_url'] ?? null,
            'cta_text' => $validated['cta_text'] ?? 'Learn More',
            'starts_at' => $startsAt->toDateString(),
            'ends_at' => $endsAt->toDateString(),
            'amount_collected' => max(0, $price),
            'discount_requested' => !empty($validated['request_discount']) ? $validated['discount_amount'] : null,
            'discount_type' => !empty($validated['request_discount']) ? ($validated['discount_type'] ?? 'fixed') : 'fixed',
            'discount_reason' => !empty($validated['request_discount']) ? $validated['discount_reason'] : null,
            'approval_status' => $approvalStatus,
            'duration' => $validated['duration'],
            'targeted_state_ids' => $validated['targeted_state_ids'] ?? null,
            'targeted_city_ids' => $validated['targeted_city_ids'] ?? null,
            'status' => $status,
        ]);

        if ($approvalStatus === 'pending') {
            return redirect()->route('agent.dashboard')->with('success', 'Ad discount requested. It will become active once approved by an administrator.');
        }

        return redirect()->route('agent.dashboard')->with('success', 'Ad booked successfully.');
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'tier' => 'required|string',
            'duration' => 'required|string|in:7d,15d,1m,3m,6m,1y',
            'starts_at' => 'required|date',
            'targeted_state_ids' => 'nullable|array',
            'targeted_city_ids' => 'nullable|array',
        ]);

        $startsAt = \Carbon\Carbon::parse($validated['starts_at']);
        $endsAt = match ($validated['duration']) {
            '7d' => $startsAt->copy()->addDays(7),
            '15d' => $startsAt->copy()->addDays(15),
            '1m' => $startsAt->copy()->addMonth(),
            '3m' => $startsAt->copy()->addMonths(3),
            '6m' => $startsAt->copy()->addMonths(6),
            '1y' => $startsAt->copy()->addYear(),
            default => $startsAt->copy()->addMonth(),
        };

        // Fetch official price
        $pricing = \App\Models\AdPricing::where('tier', $validated['tier'])
            ->where('duration', $validated['duration'])
            ->first();

        $price = $pricing ? $pricing->price : null;

        $tierLimits = [
            'platinum' => 1,
            'gold' => 2,
            'silver' => 2,
            'bronze' => 2,
            'featured' => 3,
        ];
        $limit = $tierLimits[$validated['tier']] ?? 1;

        $overlappingAds = AdPlacement::where('tier', $validated['tier'])
            ->whereIn('status', ['active', 'pending_approval'])
            ->where(function ($q) use ($startsAt, $endsAt) {
                $q->where('starts_at', '<', $endsAt)
                  ->where('ends_at', '>', $startsAt);
            })
            ->get()
            ->filter(function ($ad) use ($validated) {
                $myStates = $validated['targeted_state_ids'] ?? [];
                $myCities = $validated['targeted_city_ids'] ?? [];
                $theirStates = $ad->targeted_state_ids ?? [];
                $theirCities = $ad->targeted_city_ids ?? [];

                $myNational = empty($myStates) && empty($myCities);
                $theirNational = empty($theirStates) && empty($theirCities);

                if ($myNational || $theirNational) return true;

                if (!empty(array_intersect($myStates, $theirStates))) return true;
                if (!empty(array_intersect($myCities, $theirCities))) return true;

                return false;
            });

        if ($overlappingAds->count() >= $limit) {
            $dateStrings = $overlappingAds->map(fn($ad) => $ad->starts_at->format('d-m-Y') . ' to ' . $ad->ends_at->format('d-m-Y'))->implode(', ');
            $maxEndsAt = $overlappingAds->max('ends_at');
            $nextAvailable = $maxEndsAt ? $maxEndsAt->copy()->addDay()->format('Y-m-d') : '';
            
            return response()->json([
                'available' => false,
                'message' => "The {$validated['tier']} tier is full for the selected dates and locations. Existing bookings: {$dateStrings}. You can schedule this ad to start on or after {$nextAvailable}.",
                'next_available_date' => $nextAvailable,
                'price' => $price
            ]);
        }

        return response()->json([
            'available' => true,
            'message' => "The {$validated['tier']} tier is available for the selected dates and locations.",
            'price' => $price
        ]);
    }
}
