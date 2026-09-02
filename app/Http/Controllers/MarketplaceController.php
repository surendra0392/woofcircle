<?php

namespace App\Http\Controllers;

use App\Models\Adoption;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\Litter;
use App\Models\MedicalRecord;
use App\Models\Notification;
use App\Models\Pet;
use App\Models\State;
use App\Models\StudService;

use App\Models\TransferRequest;
use App\Models\Vaccination;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController
{
    use \App\Traits\MarketplaceFilters;

    /**
     * Display the public marketplace for litters (Puppies).
     */
    public function index(Request $request)
    {
        $query = Litter::with(['breed', 'state', 'city', 'images', 'profile'])
            ->where('is_approved', true)
            ->where('status', 'published')
            ->where('is_available', true);

        $this->applyMarketplaceFilters($query, $request, 'title');
        if ($request->filled('price_max')) { $query->where('price', '<=', $request->price_max); }

        // Location filtering removed.


        // Apply Ordering
        switch ($request->get('orderby')) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->join('breeder_profiles', 'litters.profile_id', '=', 'breeder_profiles.id')
                    ->where('litters.profile_type', BreederProfile::class)
                    ->withAvg(['reviews as average_rating' => function ($q) {
                        $q->where('status', 'approved');
                    }], 'rating')
                    ->orderBy('average_rating', 'desc');
                break;
            default:
                $query->latest();
                break;
        }

        $showingFallback = false;

        $litters = $query->paginate(12)->withQueryString();
        $litters = app(\App\Services\AdInjectionService::class)->injectAds($litters, Litter::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', Litter::class)->pluck('saved_item_id')->toArray()
            : [];

        $litters->getCollection()->transform(function ($litter) use ($savedIds) {
            if ($litter->profile && $litter->profile_type === BreederProfile::class) {
                $litter->breeder_name = $litter->profile->kennel_name;
            }
            $litter->is_saved = in_array($litter->id, $savedIds);

            return $litter;
        });

        $featuredBreeders = BreederProfile::with(['city', 'state'])
            ->where('is_active', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredStuds = StudService::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('is_available', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredAdoptions = Adoption::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('status', 'available')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('marketplace/puppies/index', [
            'litters' => $litters,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['breed_id', 'state_id', 'city_id', 'price_max', 'search', 'kci_registered', 'is_champion', 'orderby', 'view']),
            'showingFallback' => $showingFallback ?? false,
            'featuredBreeders' => $featuredBreeders,
            'featuredStuds' => $featuredStuds,
            'featuredAdoptions' => $featuredAdoptions,
        ]);
    }

    /**
     * Display a specific litter details.
     */
    public function show(string $slug)
    {
        $litter = Litter::with([
            'breed',
            'state',
            'city',
            'images',
            'profile.city',
            'profile.state',
            'puppyHealthRecords',
            'reviews' => function ($q) {
                $q->where('status', 'approved')->with('user')->orderBy('created_at', 'desc')->take(5);
            },
        ])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->where('slug', $slug)
            ->where('is_approved', true)
            ->firstOrFail();

        if ($litter->profile && $litter->profile_type === BreederProfile::class) {
            $litter->breeder_name = $litter->profile->kennel_name;
            $cityName = $litter->profile->city?->name;
            $stateName = $litter->profile->state?->name;
            $litter->breeder_location = $cityName && $stateName ? "$cityName, $stateName" : ($cityName ?: $stateName ?: null);
        }

        $litter->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', Litter::class)->where('saved_item_id', $litter->id)->exists()
            : false;

        $existingRequest = auth()->check()
            ? TransferRequest::where('litter_id', $litter->id)
                ->where('buyer_id', auth()->id())
                ->whereIn('status', ['pending_breeder', 'pending_admin', 'approved'])
                ->first()
            : null;

        return Inertia::render('marketplace/puppies/show', [
            'litter' => $litter,
            'healthRecords' => $litter->puppyHealthRecords()->orderBy('administered_date', 'desc')->get(),
            'hasHealthRecords' => $litter->puppyHealthRecords()->exists(),
            'existingRequest' => $existingRequest,
        ]);
    }

    /**
     * Display the public list of breeders.
     */
    public function breeders(Request $request)
    {
        $query = BreederProfile::with(['state', 'city'])
            ->where('is_active', true);

        $this->applyMarketplaceFilters($query, $request, 'name');
        if ($request->boolean('is_verified')) { $query->where('is_verified', true); }

        // Location filtering removed.


        $query->withAvg(['reviews as average_rating' => function ($q) {
            $q->where('status', 'approved');
        }], 'rating')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('status', 'approved');
            }]);

        // Apply Ordering
        switch ($request->get('orderby')) {
            case 'rating':
                $query->orderBy('average_rating', 'desc');
                break;
            case 'alphabetical':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->latest();
                break;
        }

        $showingFallback = false;

        $breeders = $query->paginate(12)->withQueryString();
        $breeders = app(\App\Services\AdInjectionService::class)->injectAds($breeders, BreederProfile::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', BreederProfile::class)->pluck('saved_item_id')->toArray()
            : [];

        $breeders->getCollection()->transform(function ($breeder) use ($savedIds) {
            $breeder->is_saved = in_array($breeder->id, $savedIds);

            return $breeder;
        });

        $featuredStuds = StudService::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('is_available', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredLitters = Litter::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('status', 'published')
            ->where('is_available', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredAdoptions = Adoption::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('status', 'available')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('marketplace/breeders/index', [
            'breeders' => $breeders,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['state_id', 'city_id', 'is_verified', 'search', 'orderby', 'view']),
            'showingFallback' => $showingFallback ?? false,
            'featuredStuds' => $featuredStuds,
            'featuredLitters' => $featuredLitters,
            'featuredAdoptions' => $featuredAdoptions,
        ]);
    }

    /**
     * Display breeder profile details.
     */
    public function breederShow(string $slug)
    {
        $breeder = BreederProfile::with([
            'state',
            'city',
            'gallery',
            'litters.breed',
            'reviews' => function ($q) {
                $q->where('status', 'approved')->with('user')->orderBy('created_at', 'desc')->take(5);
            },
        ])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->where('slug', $slug)
            ->firstOrFail();

        \App\Models\ProfileView::create([
            'viewable_type' => get_class($breeder),
            'viewable_id' => $breeder->id,
            'ip_address' => request()->ip(),
        ]);

        $breeder->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', BreederProfile::class)->where('saved_item_id', $breeder->id)->exists()
            : false;

        return Inertia::render('marketplace/breeders/show', [
            'breeder' => $breeder,
        ]);
    }

    /**
     * Display stud services.
     */
    public function studs(Request $request)
    {
        $query = StudService::with(['breed', 'state', 'city', 'profile'])
            ->where('is_approved', true)
            ->where('is_available', true);

        $this->applyMarketplaceFilters($query, $request, 'title');

        // Location filtering removed.


        // Apply Ordering
        match ($request->get('orderby')) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'rating' => $query->join('breeder_profiles', 'stud_services.profile_id', '=', 'breeder_profiles.id')
                ->where('stud_services.profile_type', BreederProfile::class)
                ->withAvg(['reviews as average_rating' => function ($q) {
                    $q->where('status', 'approved');
                }], 'rating')
                ->orderBy('average_rating', 'desc'),
            default => $query->latest(),
        };

        $showingFallback = false;

        $studs = $query->paginate(12)->withQueryString();
        $studs = app(\App\Services\AdInjectionService::class)->injectAds($studs, StudService::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', StudService::class)->pluck('saved_item_id')->toArray()
            : [];

        $studs->getCollection()->transform(function ($stud) use ($savedIds) {
            $stud->is_saved = in_array($stud->id, $savedIds);

            return $stud;
        });

        $featuredBreeders = BreederProfile::with(['city', 'state'])
            ->where('is_active', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredLitters = Litter::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('status', 'published')
            ->where('is_available', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredAdoptions = Adoption::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('status', 'available')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('marketplace/studs/index', [
            'studs' => $studs,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['breed_id', 'state_id', 'city_id', 'is_champion', 'search', 'orderby', 'view']),
            'showingFallback' => $showingFallback ?? false,
            'featuredBreeders' => $featuredBreeders,
            'featuredLitters' => $featuredLitters,
            'featuredAdoptions' => $featuredAdoptions,
        ]);
    }

    /**
     * Display stud service details.
     */
    public function studShow(string $slug)
    {
        $stud = StudService::with([
            'breed',
            'state',
            'city',
            'profile',
            'reviews' => function ($q) {
                $q->where('status', 'approved')->with('user')->orderBy('created_at', 'desc')->take(5);
            },
        ])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->where('slug', $slug)
            ->where('is_approved', true)
            ->firstOrFail();

        if ($stud->profile && $stud->profile_type === BreederProfile::class) {
            $stud->breeder_name = $stud->profile->kennel_name;
            $stud->breeder_location = $stud->profile->city->name.', '.$stud->profile->state->name;
        }

        $stud->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', StudService::class)->where('saved_item_id', $stud->id)->exists()
            : false;

        return Inertia::render('marketplace/studs/show', [
            'stud' => $stud,
        ]);
    }

    /**
     * Display adoption listing details.
     */
    public function adoptionShow(string $slug)
    {
        $listing = Adoption::with([
            'breed',
            'state',
            'city',
            'profile',
            'user',
            'reviews' => function ($q) {
                $q->where('status', 'approved')->with('user')->orderBy('created_at', 'desc')->take(5);
            },
        ])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->where('slug', $slug)
            ->where('is_approved', true)
            ->firstOrFail();

        if ($listing->profile) {
            $listing->profile_url = match ($listing->profile_type) {
                \App\Models\BreederProfile::class => route('marketplace.breeders.show', $listing->profile->slug),
                \App\Models\WelfareProfile::class => route('directory.welfare.show', $listing->profile->slug),
                \App\Models\VetProfile::class => route('directory.vets.show', $listing->profile->slug),
                \App\Models\TrainerProfile::class => route('directory.trainers.show', $listing->profile->slug),
                \App\Models\BoardingProfile::class => route('directory.boarding.show', $listing->profile->slug),
                \App\Models\PetShopProfile::class => route('directory.pet-shops.show', $listing->profile->slug),
                default => null,
            };

            if ($listing->profile_type === \App\Models\BreederProfile::class) {
                $listing->breeder_name = $listing->profile->kennel_name;
            } elseif ($listing->profile_type === \App\Models\WelfareProfile::class) {
                $listing->breeder_name = $listing->profile->organization_name;
            } else {
                $listing->breeder_name = $listing->profile->business_name ?? $listing->profile->clinic_name ?? $listing->profile->name ?? 'Verified Profile';
            }

            if ($listing->profile->city && $listing->profile->state) {
                $listing->breeder_location = $listing->profile->city->name.', '.$listing->profile->state->name;
            }
        }

        $listing->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', Adoption::class)->where('saved_item_id', $listing->id)->exists()
            : false;

        return Inertia::render('marketplace/adoption/show', [
            'listing' => $listing,
        ]);
    }

    /**
     * Display adoption listings.
     */
    public function adoption(Request $request)
    {
        $query = Adoption::with(['breed', 'state', 'city'])
            ->where('is_approved', true)
            ->where('is_available', true);

        $this->applyMarketplaceFilters($query, $request, 'title');

        // Location filtering removed.


        // Apply Ordering
        match ($request->get('orderby')) {
            'alphabetical' => $query->orderBy('title', 'asc'),
            default => $query->latest(),
        };

        $showingFallback = false;

        $listings = $query->paginate(12)->withQueryString();
        $listings = app(\App\Services\AdInjectionService::class)->injectAds($listings, Adoption::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', Adoption::class)->pluck('saved_item_id')->toArray()
            : [];

        $listings->getCollection()->transform(function ($listing) use ($savedIds) {
            $listing->is_saved = in_array($listing->id, $savedIds);

            return $listing;
        });

        $featuredBreeders = BreederProfile::with(['city', 'state'])
            ->where('is_active', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredLitters = Litter::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('status', 'published')
            ->where('is_available', true)
            ->latest()
            ->take(5)
            ->get();

        $featuredStuds = StudService::with(['breed', 'city', 'state'])
            ->where('is_approved', true)
            ->where('is_available', true)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('marketplace/adoption/index', [
            'listings' => $listings,
            'breeds' => Breed::select('id', 'name')->orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['breed_id', 'state_id', 'city_id', 'is_champion', 'search', 'orderby', 'view']),
            'featuredBreeders' => $featuredBreeders,
            'featuredLitters' => $featuredLitters,
            'featuredStuds' => $featuredStuds,
        ]);
    }

    /**
     * Convert a marketplace litter entry into a personal pet profile with health history transfer.
     */
    public function convertToPet(Request $request, Litter $litter)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'nullable|date',
        ]);

        $pet = Pet::create([
            'user_id' => $user->id,
            'breed_id' => $litter->breed_id,
            'name' => $validated['name'],
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? now()->subWeeks(8),
            'notes' => 'Acquired from '.($litter->profile->kennel_name ?? 'Marketplace'),
            'profile_image_path' => $litter->featured_image_path,
        ]);

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

        return redirect()->route('pets.index')->with('success', "Congratulations! {$pet->name} has been added to your dashboard with all health records transferred.");
    }

    /**
     * Request secure puppy transfer for a marketplace litter entry.
     */
    public function requestTransfer(Request $request, Litter $litter)
    {
        $user = auth()->user();

        // 1. Check if breeder is trying to request transfer to themselves
        if ($litter->user_id === $user->id) {
            return redirect()->back()->with('error', 'You cannot request a puppy transfer from your own litter.');
        }

        // 2. Validate input
        $validated = $request->validate([
            'pet_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'nullable|date',
        ]);

        // 3. Check for existing active transfer requests
        $existing = TransferRequest::where('litter_id', $litter->id)
            ->where('buyer_id', $user->id)
            ->whereIn('status', ['pending_breeder', 'pending_admin', 'approved'])
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'You already have an active transfer request for this puppy.');
        }

        // 4. Create transfer request
        $transferRequest = TransferRequest::create([
            'litter_id' => $litter->id,
            'buyer_id' => $user->id,
            'breeder_id' => $litter->user_id,
            'pet_name' => $validated['pet_name'],
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? now()->subWeeks(8),
            'status' => 'pending_breeder',
        ]);

        // 5. Add log entry
        $transferRequest->addLog($user, 'Buyer requested secure puppy transfer.');

        // 6. Create system notification for breeder
        Notification::create([
            'user_id' => $litter->user_id,
            'type' => 'system',
            'title' => 'New Secure Puppy Request',
            'message' => "{$user->name} has requested to secure puppy {$validated['pet_name']} from your litter: {$litter->title}.",
        ]);

        return redirect()->back()->with('success', "Your secure transfer request has been sent to the breeder. Waiting for breeder's approval.");
    }
}
