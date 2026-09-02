<?php

namespace App\Http\Controllers;

use App\Models\Adoption;
use App\Models\Article;
use App\Models\BoardingProfile;
use App\Models\BreederProfile;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\GalleryLike;
use App\Models\Litter;
use App\Models\Pet;
use App\Models\PetShopProfile;
use App\Models\Review;
use App\Models\Role;
use App\Models\StudService;
use App\Models\TrainerProfile;
use App\Models\User;
use App\Models\VetProfile;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\Relation;
use Inertia\Inertia;

class UserDashboardController
{
    /** Gallery titles excluded from community stats (demo/placeholder content). */
    private const DEMO_GALLERY_TITLES = ['Puppy Training Session', 'Dog Show 2025 Highlights'];

    public function index(Request $request)
    {
        $user = $request->user()->load(['roles', 'breederProfile', 'vetProfile', 'trainerProfile', 'boardingProfile', 'welfareProfile', 'petShopProfile']);
        
        // Check and award achievements
        app(\App\Services\AchievementService::class)->checkAndAward($user);
        $user->load('badges');

        $roles = $user->roles->pluck('slug')->toArray();

        $data = ['roles' => $roles, 'stats' => [], 'badges' => $user->badges];

        if (in_array('user', $roles)) {
            $this->getPetOwnerData($user, $data);
        }
        if (in_array('breeder', $roles)) {
            $this->getBreederData($user, $data);
        }
        if (in_array('stud-service-provider', $roles)) {
            $data['stats']['stud'] = ['total_studs' => $user->studServices()->count(), 'active_studs' => $user->studServices()->where('is_available', true)->count()];
        }
        if (in_array('vet', $roles)) {
            $data['stats']['vet'] = ['has_profile' => (bool) $user->vetProfile, 'status' => $user->vetProfile?->is_active ? 'Approved' : 'Pending Approval'];
        }
        if (in_array('trainer', $roles)) {
            $data['stats']['trainer'] = ['has_profile' => (bool) $user->trainerProfile, 'status' => $user->trainerProfile?->is_active ? 'Approved' : 'Pending Approval'];
        }
        if (in_array('boarding', $roles)) {
            $data['stats']['boarding'] = ['has_profile' => (bool) $user->boardingProfile, 'status' => $user->boardingProfile?->is_active ? 'Approved' : 'Pending Approval'];
        }
        if (in_array('pet-shop', $roles)) {
            $data['stats']['pet-shop'] = ['has_profile' => (bool) $user->petShopProfile, 'status' => $user->petShopProfile?->is_active ? 'Active' : 'Inactive'];
        }
        if (in_array('welfare', $roles)) {
            $this->getWelfareData($user, $data);
        }

        $tier = $user->subscription_tier;
        $listingCount = $user->total_listings_count;
        $petCount = $user->pets()->count();
        $maxPets = $user->maxPetsAllowed();

        $data['membership'] = [
            'tier_id' => $tier->id,
            'tier_name' => $tier->name,
            'is_subscribed' => $user->isSubscribed(),
            'is_connoisseur' => $user->isConnoisseur(),
            'is_elite' => $user->isElite(),
            'pet_usage' => [
                'count' => $petCount,
                'max' => $maxPets,
                'is_unlimited' => $maxPets > 100,
            ],
            'listing_usage' => [
                'current_listings' => $listingCount,
                'max_listings' => $tier->max_listings,
                'is_unlimited' => $tier->max_listings === -1,
            ],
        ];

        $data['listing_usage'] = [
            'tier_name' => $tier->name,
            'max_listings' => $tier->max_listings,
            'current_listings' => $listingCount,
        ];

        $data['recent_articles'] = Article::with('category')->where('is_published', true)->latest()->take(3)->get();
        $data['upcoming_events_global'] = Event::where('is_active', true)->where('start_date', '>=', now())->orderBy('start_date')->take(3)->get();

        $demoGalleryIds = Gallery::whereIn('title', self::DEMO_GALLERY_TITLES)->pluck('id');
        $data['gallery_stats'] = [
            'total_likes' => \DB::table('gallery_likes')->whereNotIn('gallery_id', $demoGalleryIds)->count(),
            'total_shares' => Gallery::whereNotIn('title', self::DEMO_GALLERY_TITLES)->sum('shares_count') ?? 0,
            'total_exports' => Gallery::whereNotIn('title', self::DEMO_GALLERY_TITLES)->sum('exports_count') ?? 0,
            'user_likes' => GalleryLike::where('user_id', $user->id)->whereNotIn('gallery_id', $demoGalleryIds)->count(),
        ];

        // Profile Views for the last 30 days
        $profiles = [
            $user->vetProfile,
            $user->trainerProfile,
            $user->boardingProfile,
            $user->welfareProfile,
            $user->petShopProfile,
            $user->breederProfile,
        ];
        
        $profileViewsQuery = \App\Models\ProfileView::query();
        $hasProfile = false;

        $profileViewsQuery->where(function($query) use ($profiles, &$hasProfile) {
            foreach ($profiles as $profile) {
                if ($profile) {
                    $hasProfile = true;
                    $query->orWhere(function($q) use ($profile) {
                        $q->where('viewable_type', get_class($profile))
                          ->where('viewable_id', $profile->id);
                    });
                }
            }
        });

        $profileViewsData = [];
        if ($hasProfile) {
            $views = $profileViewsQuery->where('created_at', '>=', now()->subDays(29)->startOfDay())
                ->selectRaw('DATE(created_at) as date, count(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('count', 'date');

            for ($i = 29; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $profileViewsData[] = [
                    'date' => $date,
                    'views' => $views->get($date, 0),
                ];
            }
        }
        $data['profile_views'] = $profileViewsData;

        // The rest of the index method logic for saved_listings etc.

        $savedListings = [
            'puppies' => [],
            'adoptions' => [],
            'studs' => [],
            'directory' => [],
            'articles' => [],
            'galleries' => [],
            'events' => [],
        ];

        $savedCounts = [
            'puppies' => 0,
            'adoptions' => 0,
            'studs' => 0,
            'directory' => 0,
            'articles' => 0,
            'galleries' => 0,
            'events' => 0,
        ];

        $recentLimit = 4;

        // Fetch User's Bookmarked Articles
        $savedArticlesQuery = $user->savedArticles()->with('category')->latest();
        $savedCounts['articles'] = $savedArticlesQuery->count();
        $savedListings['articles'] = $savedArticlesQuery->take($recentLimit)->get()->map(function ($article) {
            $article->image_url = $article->featured_image_url;
            $article->is_saved = true;

            return $article;
        })->all();

        // Fetch User's Liked Galleries
        $likedGalleriesQuery = $user->likedGalleries()->with(['category', 'user'])->latest();
        $savedCounts['galleries'] = $likedGalleriesQuery->count();
        $savedListings['galleries'] = $likedGalleriesQuery->take($recentLimit)->get()->map(function ($gallery) {
            $gallery->is_saved = true;

            return $gallery;
        })->all();

        $savedItems = $user->savedItems()->latest()->get();
        $grouped = $savedItems->groupBy('saved_item_type');

        foreach ($grouped as $type => $items) {
            $count = $items->count();

            if ($type === Litter::class) {
                $savedCounts['puppies'] = $count;
                $ids = $items->pluck('saved_item_id')->take($recentLimit);
                $litterModels = Litter::with(['breed', 'state', 'city', 'images', 'profile'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($litter) {
                        $litter->is_saved = true;
                        if ($litter->profile && $litter->profile_type === BreederProfile::class) {
                            $litter->breeder_name = $litter->profile->kennel_name;
                        }

                        return $litter;
                    });
                $savedListings['puppies'] = $litterModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } elseif ($type === Adoption::class) {
                $savedCounts['adoptions'] = $count;
                $ids = $items->pluck('saved_item_id')->take($recentLimit);
                $adoptionModels = Adoption::with(['breed', 'state', 'city'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($a) {
                        $a->featured_image_url = $a->featured_image_path ? Storage::url($a->featured_image_path) : null;
                        $a->is_saved = true;

                        return $a;
                    });
                $savedListings['adoptions'] = $adoptionModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } elseif ($type === StudService::class) {
                $savedCounts['studs'] = $count;
                $ids = $items->pluck('saved_item_id')->take($recentLimit);
                $studModels = StudService::with(['breed', 'state', 'city', 'images'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($s) {
                        $s->is_saved = true;

                        return $s;
                    });
                $savedListings['studs'] = $studModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } elseif ($type === Event::class) {
                $savedCounts['events'] = $count;
                $ids = $items->pluck('saved_item_id')->take($recentLimit);
                $eventModels = Event::with(['city', 'state', 'eventType'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($e) {
                        $e->is_saved = true;

                        return $e;
                    });
                $savedListings['events'] = $eventModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } else {
                $dirMap = [
                    BreederProfile::class => 'breeder', VetProfile::class => 'vet', TrainerProfile::class => 'trainer',
                    BoardingProfile::class => 'boarding', WelfareProfile::class => 'welfare', PetShopProfile::class => 'pet-shop',
                ];
                $actualClass = Relation::getMorphedModel($type) ?? $type;
                if (isset($dirMap[$actualClass])) {
                    $savedCounts['directory'] += $count;
                    $ids = $items->pluck('saved_item_id')->take($recentLimit);
                    $profiles = $actualClass::with(['state', 'city'])->whereIn('id', $ids)->get()->map(function ($profile) use ($dirMap, $actualClass) {
                        $profile->is_saved = true;
                        $profile->directory_type = $dirMap[$actualClass];
                        return $profile;
                    });
                    $sortedProfiles = $profiles->sortBy(function ($model) use ($ids) {
                        return array_search($model->id, $ids->toArray());
                    })->values();
                    $savedListings['directory'] = collect($savedListings['directory'])->concat($sortedProfiles)->values()->all();
                }
            }
        }

        // Sort directory items chronologically based on user's save orders
        $directoryTypes = ['breeder', 'vet', 'trainer', 'boarding', 'welfare', 'pet-shop', BreederProfile::class, VetProfile::class, TrainerProfile::class, BoardingProfile::class, WelfareProfile::class, PetShopProfile::class];
        $directorySaveOrder = $savedItems->filter(function ($item) use ($directoryTypes) {
            return in_array($item->saved_item_type, $directoryTypes);
        })->values();

        $savedListings['directory'] = collect($savedListings['directory'])->sortBy(function ($profile) use ($directorySaveOrder) {
            $class = get_class($profile);
            $match = $directorySaveOrder->first(function ($item) use ($profile, $class) {
                return $item->saved_item_type === $class && $item->saved_item_id === $profile->id;
            });
            if ($match) {
                $idx = $directorySaveOrder->search($match);

                return $idx !== false ? $idx : 99999;
            }

            return 99999;
        })->values()->take($recentLimit)->all();

        $data['saved_listings'] = $savedListings;
        $data['saved_counts'] = $savedCounts;

        return Inertia::render('dashboard', $data);
    }

    public function savedListings(Request $request)
    {
        $user = $request->user()->load(['roles']);
        $roles = $user->roles->pluck('slug')->toArray();

        $savedListings = [
            'puppies' => [],
            'adoptions' => [],
            'studs' => [],
            'directory' => [],
            'articles' => [],
            'galleries' => [],
            'events' => [],
        ];

        $savedCounts = [
            'puppies' => 0,
            'adoptions' => 0,
            'studs' => 0,
            'directory' => 0,
            'articles' => 0,
            'galleries' => 0,
            'events' => 0,
        ];

        // Fetch User's Bookmarked Articles (All)
        $savedArticlesQuery = $user->savedArticles()->with('category')->latest();
        $savedCounts['articles'] = $savedArticlesQuery->count();
        $savedListings['articles'] = $savedArticlesQuery->get()->map(function ($article) {
            $article->image_url = $article->featured_image_url;
            $article->is_saved = true;

            return $article;
        })->all();

        // Fetch User's Liked Galleries (All)
        $likedGalleriesQuery = $user->likedGalleries()->with(['category', 'user'])->latest();
        $savedCounts['galleries'] = $likedGalleriesQuery->count();
        $savedListings['galleries'] = $likedGalleriesQuery->get()->map(function ($gallery) {
            $gallery->is_saved = true;

            return $gallery;
        })->all();

        $savedItems = $user->savedItems()->latest()->get();
        $grouped = $savedItems->groupBy('saved_item_type');

        foreach ($grouped as $type => $items) {
            $ids = $items->pluck('saved_item_id');
            $count = $items->count();

            if ($type === Litter::class) {
                $savedCounts['puppies'] = $count;
                $litterModels = Litter::with(['breed', 'state', 'city', 'images', 'profile'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($litter) {
                        $litter->is_saved = true;
                        if ($litter->profile && $litter->profile_type === BreederProfile::class) {
                            $litter->breeder_name = $litter->profile->kennel_name;
                        }

                        return $litter;
                    });
                $savedListings['puppies'] = $litterModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } elseif ($type === Adoption::class) {
                $savedCounts['adoptions'] = $count;
                $adoptionModels = Adoption::with(['breed', 'state', 'city'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($a) {
                        $a->featured_image_url = $a->featured_image_path ? Storage::url($a->featured_image_path) : null;
                        $a->is_saved = true;

                        return $a;
                    });
                $savedListings['adoptions'] = $adoptionModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } elseif ($type === StudService::class) {
                $savedCounts['studs'] = $count;
                $studModels = StudService::with(['breed', 'state', 'city', 'images'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($s) {
                        $s->is_saved = true;

                        return $s;
                    });
                $savedListings['studs'] = $studModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } elseif ($type === Event::class) {
                $savedCounts['events'] = $count;
                $eventModels = Event::with(['city', 'state', 'eventType'])
                    ->whereIn('id', $ids)
                    ->get()
                    ->map(function ($e) {
                        $e->is_saved = true;

                        return $e;
                    });
                $savedListings['events'] = $eventModels->sortBy(function ($model) use ($ids) {
                    return array_search($model->id, $ids->toArray());
                })->values()->all();
            } else {
                $dirMap = [
                    BreederProfile::class => 'breeder', VetProfile::class => 'vet', TrainerProfile::class => 'trainer',
                    BoardingProfile::class => 'boarding', WelfareProfile::class => 'welfare', PetShopProfile::class => 'pet-shop',
                ];
                $actualClass = Relation::getMorphedModel($type) ?? $type;
                if (isset($dirMap[$actualClass])) {
                    $savedCounts['directory'] += $count;
                    $profiles = $actualClass::with(['state', 'city'])->whereIn('id', $ids)->get()->map(function ($profile) use ($dirMap, $actualClass) {
                        $profile->is_saved = true;
                        $profile->directory_type = $dirMap[$actualClass];
                        return $profile;
                    });
                        $sortedProfiles = $profiles->sortBy(function ($model) use ($ids) {
                            return array_search($model->id, $ids->toArray());
                        })->values();
                        $savedListings['directory'] = collect($savedListings['directory'])->concat($sortedProfiles)->values()->all();
                    }
                }
            }

        // Sort directory items chronologically based on user's save orders
        $directoryTypes = ['breeder', 'vet', 'trainer', 'boarding', 'welfare', 'pet-shop', BreederProfile::class, VetProfile::class, TrainerProfile::class, BoardingProfile::class, WelfareProfile::class, PetShopProfile::class];
        $directorySaveOrder = $savedItems->filter(function ($item) use ($directoryTypes) {
            return in_array($item->saved_item_type, $directoryTypes);
        })->values();

        $savedListings['directory'] = collect($savedListings['directory'])->sortBy(function ($profile) use ($directorySaveOrder) {
            $class = get_class($profile);
            $match = $directorySaveOrder->first(function ($item) use ($profile, $class) {
                return $item->saved_item_type === $class && $item->saved_item_id === $profile->id;
            });
            if ($match) {
                $idx = $directorySaveOrder->search($match);

                return $idx !== false ? $idx : 99999;
            }

            return 99999;
        })->values()->all();

        return Inertia::render('dashboard/saved', [
            'roles' => $roles,
            'saved_listings' => $savedListings,
            'saved_counts' => $savedCounts,
        ]);
    }

    public function reviews(Request $request)
    {
        $user = $request->user()->load(['roles']);
        $roles = $user->roles->pluck('slug')->toArray();

        $reviewsQuery = Review::where('user_id', $user->id)
            ->with(['reviewable'])
            ->latest();

        // Apply filters
        $filters = $request->only(['rating', 'type']);

        if ($request->filled('rating') && in_array($request->rating, [1, 2, 3, 4, 5])) {
            $reviewsQuery->where('rating', $request->rating);
        }

        if ($request->filled('type')) {
            $reviewsQuery->where('reviewable_type', $request->type);
        }

        $reviews = $reviewsQuery->paginate(5)
            ->withQueryString()
            ->through(function ($review) {
                $reviewable = $review->reviewable;
                $itemType = 'unknown';
                $itemName = 'Unknown Item';
                $itemUrl = '#';

                if ($reviewable) {
                    if ($reviewable instanceof VetProfile) {
                        $itemType = 'vet';
                        $itemName = $reviewable->clinic_name;
                        $itemUrl = route('directory.vets.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof TrainerProfile) {
                        $itemType = 'trainer';
                        $itemName = $reviewable->name;
                        $itemUrl = route('directory.trainers.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof BoardingProfile) {
                        $itemType = 'boarding';
                        $itemName = $reviewable->name;
                        $itemUrl = route('directory.boarding.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof WelfareProfile) {
                        $itemType = 'welfare';
                        $itemName = $reviewable->organization_name;
                        $itemUrl = route('directory.welfare.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof PetShopProfile) {
                        $itemType = 'pet-shop';
                        $itemName = $reviewable->shop_name;
                        $itemUrl = route('directory.pet-shops.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof BreederProfile) {
                        $itemType = 'breeder';
                        $itemName = $reviewable->kennel_name;
                        $itemUrl = route('marketplace.breeders.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof Adoption) {
                        $itemType = 'adoption';
                        $itemName = $reviewable->title;
                        $itemUrl = route('marketplace.adoption.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof Litter) {
                        $itemType = 'litter';
                        $itemName = $reviewable->title;
                        $itemUrl = route('marketplace.litters.show', ['slug' => $reviewable->slug]);
                    } elseif ($reviewable instanceof StudService) {
                        $itemType = 'stud';
                        $itemName = $reviewable->title;
                        $itemUrl = route('marketplace.studs.show', ['slug' => $reviewable->slug]);
                    }
                }

                $review->item_type = $itemType;
                $review->item_name = $itemName;
                $review->item_url = $itemUrl;

                return $review;
            });

        return Inertia::render('dashboard/reviews', [
            'roles' => $roles,
            'reviews' => $reviews,
            'filters' => [
                'rating' => $filters['rating'] ?? '',
                'type' => $filters['type'] ?? '',
            ],
        ]);
    }

    private function getPetOwnerData(User $user, array &$data)
    {
        $data['stats']['pet_owner'] = [
            'total_pets' => $user->pets()->count(),
            'upcoming_appointments' => $user->appointments()->where('appointment_date', '>=', now())->count(),
            'pending_vaccinations' => $user->vaccinations()->where('next_due_date', '>=', now())->count(),
        ];

        $totalVaccinations = $user->vaccinations()->count();
        $overdueVaccinations = $user->vaccinations()->where('next_due_date', '<', now())->count();
        $totalMedicalRecords = $user->medicalRecords()->count();
        
        $healthScore = 50 + min($totalVaccinations * 10, 30) - ($overdueVaccinations * 20) + min($totalMedicalRecords * 10, 20);
        $healthScore = max(0, min(100, $healthScore));

        $data['analytics'] = [
            'health_score' => $healthScore,
            'vaccination_timeline' => collect(range(5, 0))->map(function ($monthsAgo) use ($user) {
                $date = now()->subMonths($monthsAgo);
                return [
                    'month' => $date->format('M'),
                    'count' => $user->vaccinations()->whereYear('vaccination_date', $date->year)->whereMonth('vaccination_date', $date->month)->count(),
                ];
            }),
            'overdue_count' => $overdueVaccinations
        ];

        $data['recent_pets'] = $user->pets()->with('breed')->latest()->take(3)->get();

        $upcoming_appointments = $user->appointments()->with('pet')->where('appointment_date', '>=', now())->orderBy('appointment_date')->take(5)->get()->map(fn($a) => ['id' => $a->id, 'type' => 'appointment', 'title' => $a->title, 'date' => $a->appointment_date, 'pet_name' => $a->pet->name]);
        $upcoming_vaccinations = $user->vaccinations()->with('pet')->where('next_due_date', '>=', now())->orderBy('next_due_date')->take(5)->get()->map(fn($v) => ['id' => $v->id, 'type' => 'vaccination', 'title' => $v->vaccine_name, 'date' => $v->next_due_date, 'pet_name' => $v->pet->name]);
        $data['upcoming_events'] = collect($upcoming_appointments)->concat($upcoming_vaccinations)->sortBy('date')->take(5)->values();

        $recent_medical = $user->medicalRecords()->with('pet')->latest()->take(5)->get()->map(fn($m) => ['id' => $m->id, 'type' => 'medical', 'title' => $m->title, 'date' => $m->diagnosis_date, 'pet_name' => $m->pet->name]);
        $recent_vaccinations = $user->vaccinations()->with('pet')->latest()->take(5)->get()->map(fn($v) => ['id' => $v->id, 'type' => 'vaccination', 'title' => $v->vaccine_name, 'date' => $v->vaccination_date, 'pet_name' => $v->pet->name]);
        $data['recent_activity'] = collect($recent_medical)->concat($recent_vaccinations)->sortByDesc('date')->take(5)->values();
    }

    private function getBreederData(User $user, array &$data)
    {
        $data['stats']['breeder'] = [
            'total_litters' => $user->litters()->count(),
            'active_litters' => $user->litters()->where('status', 'available')->count(),
            'total_adoptions' => $user->adoptions()->count(),
            'active_adoptions' => $user->adoptions()->where('is_available', true)->where('is_approved', true)->count(),
            'pending_adoptions' => $user->adoptions()->where('is_approved', false)->count(),
            'pending_health_tasks' => $user->puppyHealthRecords()->where('next_due_date', '>=', now())->count(),
        ];
        $data['recent_litters'] = $user->litters()->with('breed')->latest()->take(3)->get();

        $breeder_upcoming = $user->puppyHealthRecords()->with('litter')->where('next_due_date', '>=', now())->orderBy('next_due_date')->take(5)->get()->map(fn($r) => ['id' => $r->id, 'type' => 'health_task', 'title' => $r->title.' ('.ucfirst($r->record_type).')', 'date' => $r->next_due_date, 'pet_name' => $r->litter->title]);
        $data['upcoming_events'] = collect($data['upcoming_events'] ?? [])->concat($breeder_upcoming)->sortBy('date')->take(5)->values();

        $breeder_recent = $user->puppyHealthRecords()->with('litter')->latest()->take(5)->get()->map(fn($r) => ['id' => $r->id, 'type' => 'health_record', 'title' => $r->title, 'date' => $r->administered_date, 'pet_name' => $r->litter->title]);
        $data['recent_activity'] = collect($data['recent_activity'] ?? [])->concat($breeder_recent)->sortByDesc('date')->take(5)->values();

        if (!isset($data['recent_adoptions'])) {
            $data['recent_adoptions'] = $user->adoptions()->with(['breed', 'state', 'city'])->latest()->take(3)->get()->map(function ($a) {
                $a->featured_image_url = $a->featured_image_path ? \Storage::url($a->featured_image_path) : null;
                return $a;
            });
        }
    }

    private function getWelfareData(User $user, array &$data)
    {
        $data['stats']['welfare'] = [
            'has_profile' => (bool) $user->welfareProfile,
            'status' => $user->welfareProfile?->is_active ? 'Approved' : 'Pending Approval',
            'total_adoptions' => $user->adoptions()->count(),
            'active_adoptions' => $user->adoptions()->where('is_available', true)->where('is_approved', true)->count(),
            'pending_adoptions' => $user->adoptions()->where('is_approved', false)->count(),
            'pending_health_tasks' => $user->adoptionHealthRecords()->where('next_due_date', '>=', now())->count(),
        ];
        $data['recent_adoptions'] = $user->adoptions()->with(['breed', 'state', 'city'])->latest()->take(3)->get()->map(function ($a) {
            $a->featured_image_url = $a->featured_image_path ? \Storage::url($a->featured_image_path) : null;
            return $a;
        });

        $welfare_upcoming = $user->adoptionHealthRecords()->with('adoption')->where('next_due_date', '>=', now())->orderBy('next_due_date')->take(5)->get()->map(fn($r) => ['id' => $r->id, 'type' => 'health_task', 'title' => $r->title.' ('.ucfirst($r->record_type).')', 'date' => $r->next_due_date, 'pet_name' => $r->adoption->title]);
        $data['upcoming_events'] = collect($data['upcoming_events'] ?? [])->concat($welfare_upcoming)->sortBy('date')->take(5)->values();

        $welfare_recent = $user->adoptionHealthRecords()->with('adoption')->latest()->take(5)->get()->map(fn($r) => ['id' => $r->id, 'type' => 'health_record', 'title' => $r->title, 'date' => $r->administered_date, 'pet_name' => $r->adoption->title]);
        $data['recent_activity'] = collect($data['recent_activity'] ?? [])->concat($welfare_recent)->sortByDesc('date')->take(5)->values();
    }

}
