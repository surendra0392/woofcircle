<?php

namespace App\Http\Controllers;

use App\Models\BoardingProfile;
use App\Models\PetShopProfile;
use App\Models\State;
use App\Models\TrainerProfile;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use App\Models\BreederProfile;
use App\Models\Litter;
use App\Models\StudService;
use App\Models\Adoption;
use App\Models\Pet;
use App\Models\Appointment;
use App\Models\Conversation;
use App\Models\Message;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicDirectoryController
{
    /**
     * Get featured marketplace discovery items for directory sidebars.
     */
    private function getDirectoryFeaturedData(): array
    {
        return [
            'featuredLitters' => Litter::with(['breed', 'city', 'state'])
                ->where('is_approved', true)
                ->where('status', 'published')
                ->where('is_available', true)
                ->latest()
                ->take(5)
                ->get(),
            'featuredBreeders' => BreederProfile::with(['city', 'state'])
                ->where('is_active', true)
                ->latest()
                ->take(5)
                ->get(),
            'featuredStuds' => StudService::with(['breed', 'city', 'state'])
                ->where('is_approved', true)
                ->where('is_available', true)
                ->latest()
                ->take(5)
                ->get(),
            'featuredAdoptions' => Adoption::with(['breed', 'city', 'state'])
                ->where('is_approved', true)
                ->where('status', 'available')
                ->latest()
                ->take(5)
                ->get(),
        ];
    }
    /**
     * Display the main directory landing page.
     */
    public function index()
    {
        $vetsCount = VetProfile::where('is_active', true)->count();
        $trainersCount = TrainerProfile::where('is_active', true)->count();
        $boardingCount = BoardingProfile::where('is_active', true)->count();
        $welfareCount = WelfareProfile::where('is_active', true)->count();
        $petShopsCount = PetShopProfile::where('is_active', true)->count();

        $featuredVets = VetProfile::with(['city', 'state'])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        $featuredTrainers = TrainerProfile::with(['city', 'state'])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        $featuredBoarding = BoardingProfile::with(['city', 'state'])
            ->withAvg(['reviews as average_rating' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('directory/index', [
            'counts' => [
                'vets' => $vetsCount,
                'trainers' => $trainersCount,
                'boarding' => $boardingCount,
                'welfare' => $welfareCount,
                'petShops' => $petShopsCount,
                'total' => $vetsCount + $trainersCount + $boardingCount + $welfareCount + $petShopsCount,
            ],
            'states' => State::orderBy('name')->get(['id', 'name']),
            'featuredVets' => $featuredVets,
            'featuredTrainers' => $featuredTrainers,
            'featuredBoarding' => $featuredBoarding,
        ]);
    }

    /**
     * Helper to apply common directory filters.
     */
    private function applyDirectoryFilters($query, Request $request, string $searchColumn = 'name')
    {
        $query->where('is_active', true);

        if ($request->filled('state_id') && $request->state_id !== 'all') {
            $query->where('state_id', $request->state_id);
        }
        if ($request->filled('city_id') && $request->city_id !== 'all') {
            $query->where('city_id', $request->city_id);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request, $searchColumn) {
                $q->where($searchColumn, 'like', '%'.$request->search.'%')
                    ->orWhereHas('state', function ($sq) use ($request) {
                        $sq->where('name', 'like', '%'.$request->search.'%');
                    })
                    ->orWhereHas('city', function ($cq) use ($request) {
                        $cq->where('name', 'like', '%'.$request->search.'%');
                    });
            });
        }
        if ($request->boolean('is_verified')) {
            $query->where('is_verified', true);
        }

        // Location filtering removed.


        $query->withAvg(['reviews as average_rating' => function ($q) {
            $q->where('status', 'approved');
        }], 'rating')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->withCount(['adPlacements as is_sponsored' => function ($q) {
                $q->where('status', 'active')
                  ->where('starts_at', '<=', now())
                  ->where('ends_at', '>=', now());
            }]);

        // Apply Ordering
        // orderByDesc('is_sponsored') removed in favor of AdInjectionService on page 1
        
        $orderby = $request->input('orderby', 'latest');
        switch ($orderby) {
            case 'rating':
                $query->orderByDesc('average_rating');
                break;
            case 'alphabetical':
                $query->orderBy($searchColumn, 'asc');
                break;
            case 'latest':
            default:
                $query->latest();
                break;
        }

        $showingFallback = false;
        return ['query' => $query, 'showingFallback' => $showingFallback];
    }

    /**
     * Display veterinary clinics.
     */
    public function vets(Request $request)
    {
        $query = VetProfile::with(['state', 'city', 'services']);
        $result = $this->applyDirectoryFilters($query, $request, 'name');
        $query = $result['query'];
        $showingFallback = $result['showingFallback'];

        $vets = $query->paginate(12)->withQueryString();
        $vets = app(\App\Services\AdInjectionService::class)->injectAds($vets, VetProfile::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', VetProfile::class)->pluck('saved_item_id')->toArray()
            : [];

        $vets->getCollection()->transform(function ($vet) use ($savedIds) {
            $vet->is_saved = in_array($vet->id, $savedIds);

            return $vet;
        });

        return Inertia::render('directory/vets', array_merge([
            'vets' => $vets,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['state_id', 'city_id', 'search', 'is_verified', 'orderby', 'view']),
            'showingFallback' => $showingFallback,
        ], $this->getDirectoryFeaturedData()));
    }

    /**
     * Display a specific veterinary clinic.
     */
    public function vetShow(string $slug)
    {
        $vet = VetProfile::with([
            'state',
            'city',
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
            ->where('slug', $slug)->where('is_active', true)->firstOrFail();
        $vet->logo_url = $vet->logo ? Storage::url($vet->logo) : null;

        \App\Models\ProfileView::create([
            'viewable_type' => get_class($vet),
            'viewable_id' => $vet->id,
            'ip_address' => request()->ip(),
        ]);

        $vet->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', VetProfile::class)->where('saved_item_id', $vet->id)->exists()
            : false;

        $pets = auth()->check() ? auth()->user()->pets()->select('id', 'name')->get() : [];

        return Inertia::render('directory/vets/show', [
            'vet' => $vet,
            'pets' => $pets,
        ]);
    }

    /**
     * Book an appointment with a specific veterinary clinic.
     */
    public function bookAppointment(Request $request, VetProfile $vet)
    {
        if (!auth()->check()) {
            return back()->with('error', 'You must be logged in to book an appointment.');
        }

        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'appointment_type' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $pet = $request->user()->pets()->findOrFail($validated['pet_id']);

        $appointment = $pet->appointments()->create([
            'vet_profile_id' => $vet->id,
            'clinic_name' => $vet->clinic_name,
            'appointment_type' => $validated['appointment_type'],
            'appointment_date' => $validated['appointment_date'],
            'notes' => $validated['notes'],
            'status' => 'scheduled'
        ]);

        if ($vet->user_id && $vet->user_id !== auth()->id()) {
            $currentUserId = auth()->id();
            $targetUserId = $vet->user_id;
            
            $conversation = Conversation::whereHas('users', function ($q) use ($currentUserId) {
                $q->where('users.id', $currentUserId);
            })->whereHas('users', function ($q) use ($targetUserId) {
                $q->where('users.id', $targetUserId);
            })->first();

            if (! $conversation) {
                $conversation = Conversation::create();
                $conversation->users()->attach([$currentUserId, $targetUserId]);
            }

            Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $currentUserId,
                'body' => $validated['notes'] ? "New appointment request: {$validated['notes']}" : 'New appointment request.',
            ]);
        }

        try {
            // Confirmation to pet parent
            \Illuminate\Support\Facades\Mail::to($request->user()->email)
                ->send(new \App\Mail\AppointmentBookedMail(
                    $request->user()->name,
                    $vet->name ?? $vet->clinic_name ?? 'Veterinary Clinic',
                    $pet->name,
                    $validated['appointment_type'],
                    \Carbon\Carbon::parse($validated['appointment_date'])->format('M d, Y h:i A'),
                    $validated['notes']
                ));

            // Alert to Vet
            $vetEmail = $vet->user?->email ?? $vet->email;
            if ($vetEmail) {
                \Illuminate\Support\Facades\Mail::to($vetEmail)
                    ->send(new \App\Mail\AppointmentReceivedMail(
                        $vet->name ?? $vet->clinic_name ?? 'Veterinary Clinic',
                        $request->user()->name,
                        $request->user()->email,
                        $pet->name,
                        $validated['appointment_type'],
                        \Carbon\Carbon::parse($validated['appointment_date'])->format('M d, Y h:i A'),
                        $validated['notes']
                    ));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send appointment emails: ' . $e->getMessage());
        }

        return back()->with('success', 'Appointment request sent successfully!');
    }


    /**
     * Display dog trainers.
     */
    public function trainers(Request $request)
    {
        $query = TrainerProfile::with(['state', 'city', 'specializations']);
        $result = $this->applyDirectoryFilters($query, $request, 'name');
        $query = $result['query'];
        $showingFallback = $result['showingFallback'];

        $trainers = $query->paginate(12)->withQueryString();
        $trainers = app(\App\Services\AdInjectionService::class)->injectAds($trainers, TrainerProfile::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', TrainerProfile::class)->pluck('saved_item_id')->toArray()
            : [];

        $trainers->getCollection()->transform(function ($trainer) use ($savedIds) {
            $trainer->is_saved = in_array($trainer->id, $savedIds);

            return $trainer;
        });

        return Inertia::render('directory/trainers', array_merge([
            'trainers' => $trainers,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['state_id', 'city_id', 'search', 'is_verified', 'orderby', 'view']),
        ], $this->getDirectoryFeaturedData()));
    }

    /**
     * Display a specific trainer.
     */
    public function trainerShow(string $slug)
    {
        $trainer = TrainerProfile::with([
            'state',
            'city',
            'specializations',
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
            ->where('slug', $slug)->where('is_active', true)->firstOrFail();
        $trainer->logo_url = $trainer->logo ? Storage::url($trainer->logo) : null;

        \App\Models\ProfileView::create([
            'viewable_type' => get_class($trainer),
            'viewable_id' => $trainer->id,
            'ip_address' => request()->ip(),
        ]);

        $trainer->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', TrainerProfile::class)->where('saved_item_id', $trainer->id)->exists()
            : false;

        $pets = auth()->check() ? auth()->user()->pets()->select('id', 'name')->get() : [];

        return Inertia::render('directory/trainers/show', [
            'trainer' => $trainer,
            'pets' => $pets,
        ]);
    }

    /**
     * Book a mastery session with a specific trainer.
     */
    public function bookMastery(Request $request, TrainerProfile $trainer)
    {
        if (!auth()->check()) {
            return back()->with('error', 'You must be logged in to book a training session.');
        }

        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'session_type' => 'required|string|max:255',
            'session_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $pet = $request->user()->pets()->findOrFail($validated['pet_id']);

        $session = $pet->trainingSessions()->create([
            'trainer_profile_id' => $trainer->id,
            'session_type' => $validated['session_type'],
            'session_date' => $validated['session_date'],
            'notes' => $validated['notes'],
            'status' => 'pending'
        ]);

        if ($trainer->user_id && $trainer->user_id !== auth()->id()) {
            $currentUserId = auth()->id();
            $targetUserId = $trainer->user_id;
            
            $conversation = Conversation::whereHas('users', function ($q) use ($currentUserId) {
                $q->where('users.id', $currentUserId);
            })->whereHas('users', function ($q) use ($targetUserId) {
                $q->where('users.id', $targetUserId);
            })->first();

            if (! $conversation) {
                $conversation = Conversation::create();
                $conversation->users()->attach([$currentUserId, $targetUserId]);
            }

            Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $currentUserId,
                'body' => $validated['notes'] ? "New training session request: {$validated['notes']}" : 'New training session request.',
            ]);
        }

        try {
            // Confirmation to pet parent
            \Illuminate\Support\Facades\Mail::to($request->user()->email)
                ->send(new \App\Mail\AppointmentBookedMail(
                    $request->user()->name,
                    $trainer->name ?? 'Professional Trainer',
                    $pet->name,
                    'Training: ' . $validated['session_type'],
                    \Carbon\Carbon::parse($validated['session_date'])->format('M d, Y h:i A'),
                    $validated['notes']
                ));

            // Alert to Trainer
            $trainerEmail = $trainer->user?->email ?? $trainer->email;
            if ($trainerEmail) {
                \Illuminate\Support\Facades\Mail::to($trainerEmail)
                    ->send(new \App\Mail\AppointmentReceivedMail(
                        $trainer->name ?? 'Professional Trainer',
                        $request->user()->name,
                        $request->user()->email,
                        $pet->name,
                        'Training: ' . $validated['session_type'],
                        \Carbon\Carbon::parse($validated['session_date'])->format('M d, Y h:i A'),
                        $validated['notes']
                    ));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send trainer booking emails: ' . $e->getMessage());
        }

        return back()->with('success', 'Training session request sent successfully!');
    }

    /**
     * Display boarding & daycare.
     */
    public function boarding(Request $request)
    {
        $query = BoardingProfile::with(['state', 'city']);
        $result = $this->applyDirectoryFilters($query, $request, 'name');
        $query = $result['query'];
        $showingFallback = $result['showingFallback'];

        $boarding = $query->paginate(12)->withQueryString();
        $boarding = app(\App\Services\AdInjectionService::class)->injectAds($boarding, BoardingProfile::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', BoardingProfile::class)->pluck('saved_item_id')->toArray()
            : [];

        $boarding->getCollection()->transform(function ($item) use ($savedIds) {
            $item->is_saved = in_array($item->id, $savedIds);

            return $item;
        });

        return Inertia::render('directory/boarding', array_merge([
            'boardings' => $boarding,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['state_id', 'city_id', 'search', 'is_verified', 'orderby', 'view']),
        ], $this->getDirectoryFeaturedData()));
    }

    /**
     * Display a specific boarding.
     */
    public function boardingShow(string $slug)
    {
        $boarding = BoardingProfile::with([
            'state',
            'city',
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
            ->where('slug', $slug)->where('is_active', true)->firstOrFail();
        $boarding->logo_url = $boarding->logo ? Storage::url($boarding->logo) : null;

        \App\Models\ProfileView::create([
            'viewable_type' => get_class($boarding),
            'viewable_id' => $boarding->id,
            'ip_address' => request()->ip(),
        ]);

        $boarding->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', BoardingProfile::class)->where('saved_item_id', $boarding->id)->exists()
            : false;

        $pets = auth()->check() ? auth()->user()->pets()->select('id', 'name')->get() : [];

        return Inertia::render('directory/boarding/show', [
            'boarding' => $boarding,
            'pets' => $pets,
        ]);
    }

    /**
     * Book a stay with a specific boarding facility.
     */
    public function bookBoarding(Request $request, BoardingProfile $boarding)
    {
        if (!auth()->check()) {
            return back()->with('error', 'You must be logged in to book a boarding stay.');
        }

        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'notes' => 'nullable|string',
        ]);

        $pet = $request->user()->pets()->findOrFail($validated['pet_id']);

        $reservation = $pet->boardingReservations()->create([
            'boarding_profile_id' => $boarding->id,
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'notes' => $validated['notes'],
            'status' => 'pending'
        ]);

        if ($boarding->user_id && $boarding->user_id !== auth()->id()) {
            $currentUserId = auth()->id();
            $targetUserId = $boarding->user_id;
            
            $conversation = Conversation::whereHas('users', function ($q) use ($currentUserId) {
                $q->where('users.id', $currentUserId);
            })->whereHas('users', function ($q) use ($targetUserId) {
                $q->where('users.id', $targetUserId);
            })->first();

            if (! $conversation) {
                $conversation = Conversation::create();
                $conversation->users()->attach([$currentUserId, $targetUserId]);
            }

            Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $currentUserId,
                'body' => $validated['notes'] ? "New boarding reservation request: {$validated['notes']}" : 'New boarding reservation request.',
            ]);
        }

        try {
            // Confirmation to pet parent
            \Illuminate\Support\Facades\Mail::to($request->user()->email)
                ->send(new \App\Mail\AppointmentBookedMail(
                    $request->user()->name,
                    $boarding->name ?? 'Boarding & Daycare Sanctuary',
                    $pet->name,
                    'Boarding / Daycare Stay',
                    \Carbon\Carbon::parse($validated['check_in_date'])->format('M d, Y') . ' to ' . \Carbon\Carbon::parse($validated['check_out_date'])->format('M d, Y'),
                    $validated['notes']
                ));

            // Alert to Boarding facility
            $boardingEmail = $boarding->user?->email ?? $boarding->email;
            if ($boardingEmail) {
                \Illuminate\Support\Facades\Mail::to($boardingEmail)
                    ->send(new \App\Mail\AppointmentReceivedMail(
                        $boarding->name ?? 'Boarding & Daycare Sanctuary',
                        $request->user()->name,
                        $request->user()->email,
                        $pet->name,
                        'Boarding / Daycare Stay',
                        \Carbon\Carbon::parse($validated['check_in_date'])->format('M d, Y') . ' to ' . \Carbon\Carbon::parse($validated['check_out_date'])->format('M d, Y'),
                        $validated['notes']
                    ));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send boarding booking emails: ' . $e->getMessage());
        }

        return back()->with('success', 'Boarding reservation request sent successfully!');
    }

    /**
     * Display welfare & rescue organizations.
     */
    public function welfare(Request $request)
    {
        $query = WelfareProfile::with(['state', 'city']);
        $result = $this->applyDirectoryFilters($query, $request, 'name');
        $query = $result['query'];
        $showingFallback = $result['showingFallback'];

        $welfare = $query->paginate(12)->withQueryString();
        $welfare = app(\App\Services\AdInjectionService::class)->injectAds($welfare, WelfareProfile::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', WelfareProfile::class)->pluck('saved_item_id')->toArray()
            : [];

        $welfare->getCollection()->transform(function ($item) use ($savedIds) {
            $item->is_saved = in_array($item->id, $savedIds);

            return $item;
        });

        return Inertia::render('directory/welfare', array_merge([
            'welfares' => $welfare,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['state_id', 'city_id', 'search', 'is_verified', 'orderby', 'view']),
        ], $this->getDirectoryFeaturedData()));
    }

    /**
     * Display a specific welfare.
     */
    public function welfareShow(string $slug)
    {
        $welfare = WelfareProfile::with([
            'state',
            'city',
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
            ->where('slug', $slug)->where('is_active', true)->firstOrFail();
        $welfare->logo_url = $welfare->logo ? Storage::url($welfare->logo) : null;

        \App\Models\ProfileView::create([
            'viewable_type' => get_class($welfare),
            'viewable_id' => $welfare->id,
            'ip_address' => request()->ip(),
        ]);

        $welfare->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', WelfareProfile::class)->where('saved_item_id', $welfare->id)->exists()
            : false;

        return Inertia::render('directory/welfare/show', [
            'welfare' => $welfare,
        ]);
    }

    /**
     * Display pet shops.
     */
    public function petShops(Request $request)
    {
        $query = PetShopProfile::with(['state', 'city']);
        $result = $this->applyDirectoryFilters($query, $request, 'name');
        $query = $result['query'];
        $showingFallback = $result['showingFallback'];

        $petShops = $query->paginate(12)->withQueryString();
        $petShops = app(\App\Services\AdInjectionService::class)->injectAds($petShops, PetShopProfile::class, $request);

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', PetShopProfile::class)->pluck('saved_item_id')->toArray()
            : [];

        $petShops->getCollection()->transform(function ($shop) use ($savedIds) {
            $shop->logo_url = $shop->logo ? Storage::url($shop->logo) : null;
            $shop->is_saved = in_array($shop->id, $savedIds);

            return $shop;
        });

        return Inertia::render('directory/pet-shops', array_merge([
            'petShops' => $petShops,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['state_id', 'city_id', 'search', 'is_verified', 'orderby', 'view']),
        ], $this->getDirectoryFeaturedData()));
    }

    /**
     * Display a specific pet shop.
     */
    public function petShopShow(string $slug)
    {
        $petShop = PetShopProfile::with([
            'state',
            'city',
            'gallery',
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
            ->where('slug', $slug)->where('is_active', true)->firstOrFail();

        \App\Models\ProfileView::create([
            'viewable_type' => get_class($petShop),
            'viewable_id' => $petShop->id,
            'ip_address' => request()->ip(),
        ]);

        $isSaved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', PetShopProfile::class)->where('saved_item_id', $petShop->id)->exists()
            : false;

        $petShop = array_merge($petShop->toArray(), [
            'logo_url' => $petShop->logo ? Storage::url($petShop->logo) : null,
            'is_saved' => $isSaved,
            'gallery' => $petShop->gallery->map(function ($img) {
                return [
                    'id' => $img->id,
                    'image' => Storage::url($img->image),
                ];
            }),
        ]);

        return Inertia::render('directory/pet-shops/show', [
            'petShop' => $petShop,
        ]);
    }

    /**
     * Fetch cities by state ID for dynamic filters.
     */
    public function citiesByState(State $state)
    {
        return response()->json(
            $state->cities()->select('id', 'name')->orderBy('name')->get()
        );
    }

    /**
     * Submit an inquiry to a pet shop owner.
     */
    public function inquirePetShop(Request $request, PetShopProfile $petShop)
    {
        if (!auth()->check()) {
            return back()->with('error', 'You must be logged in to send an inquiry.');
        }

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        if ($petShop->user_id && $petShop->user_id !== auth()->id()) {
            $currentUserId = auth()->id();
            $targetUserId = $petShop->user_id;
            
            $conversation = Conversation::whereHas('users', function ($q) use ($currentUserId) {
                $q->where('users.id', $currentUserId);
            })->whereHas('users', function ($q) use ($targetUserId) {
                $q->where('users.id', $targetUserId);
            })->first();

            if (! $conversation) {
                $conversation = Conversation::create();
                $conversation->users()->attach([$currentUserId, $targetUserId]);
            }

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $currentUserId,
                'body' => "Inquiry regarding " . ($petShop->name ?? $petShop->shop_name) . ":\n\n" . $validated['message'],
            ]);

            try {
                $shopEmail = $petShop->user?->email ?? $petShop->email;
                if ($shopEmail) {
                    \Illuminate\Support\Facades\Mail::to($shopEmail)
                        ->send(new \App\Mail\PetShopInquiryMail(
                            $petShop->name ?? $petShop->shop_name ?? 'Pet Shop',
                            $request->user()->name,
                            $request->user()->email,
                            $validated['message']
                        ));
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to send pet shop inquiry email: ' . $e->getMessage());
            }

            return redirect()->route('dashboard.messages.index', ['conversation' => $message->conversation_id])
                             ->with('success', 'Your inquiry has been sent.');
        }

        return back()->with('error', 'This pet shop does not have an active owner account to receive inquiries.');
    }
}
