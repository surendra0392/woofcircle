<?php

namespace App\Http\Controllers;

use App\Models\Adoption;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\BreederProfile;
use App\Models\Event;
use App\Models\EventType;
use App\Models\Gallery;
use App\Models\GalleryCategory;
use App\Models\GalleryImage;
use App\Models\Litter;
use App\Models\State;
use App\Models\StudService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class PublicCommunityController
{
    /** Gallery titles excluded from community stats (demo/placeholder content). */
    private const DEMO_GALLERY_TITLES = ['Puppy Training Session', 'Dog Show 2025 Highlights'];
    /**
     * Display listing of events.
     */
    public function events(Request $request)
    {
        $query = Event::with(['eventType', 'state', 'city'])->withCount('registrations')->where('is_active', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%')
                    ->orWhere('location', 'like', '%'.$request->search.'%')
                    ->orWhereHas('state', function ($sq) use ($request) {
                        $sq->where('name', 'like', '%'.$request->search.'%');
                    })
                    ->orWhereHas('city', function ($cq) use ($request) {
                        $cq->where('name', 'like', '%'.$request->search.'%');
                    });
            });
        }

        if ($request->filled('event_type_id') && $request->event_type_id !== 'all') {
            $query->where('event_type_id', $request->event_type_id);
        }

        if ($request->filled('state_id') && $request->state_id !== 'all') {
            $query->where('state_id', $request->state_id);
        }

        if ($request->filled('city_id') && $request->city_id !== 'all') {
            $query->where('city_id', $request->city_id);
        }

        $orderBy = $request->input('orderby', 'latest');
        if ($orderBy === 'latest') {
            $query->orderBy('start_date', 'asc');
        } else {
            $query->latest();
        }

        $events = $query->paginate(12)->withQueryString();

        $savedIds = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', Event::class)->pluck('saved_item_id')->toArray()
            : [];

        $events->getCollection()->transform(function ($event) use ($savedIds) {
            $event->image_url = $event->banner_url;
            $event->is_saved = in_array($event->id, $savedIds);

            return $event;
        });

        $stats = [
            'total_events' => Event::where('is_active', true)->count(),
            'upcoming_events' => Event::where('is_active', true)->whereDate('start_date', '>=', now()->toDateString())->count(),
            'total_attendees' => \App\Models\EventRegistration::count(),
        ];

        return Inertia::render('community/events/index', array_merge([
            'events' => $events,
            'eventTypes' => EventType::orderBy('name')->get(),
            'states' => State::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['event_type_id', 'state_id', 'city_id', 'search', 'orderby']),
            'stats' => $stats,
        ], $this->getFeaturedSidebarData()));
    }

    /**
     * Display event details.
     */
    public function eventShow(string $slug)
    {
        $event = Event::with(['eventType', 'gallery', 'state', 'city'])->withCount('registrations')->where('slug', $slug)->firstOrFail();

        $event->image_url = $event->banner_url;
        $event->gallery->each(function ($item) {
            $item->image_url = Storage::url($item->image_path);
        });

        $event->is_saved = auth()->check()
            ? auth()->user()->savedItems()->where('saved_item_type', Event::class)->where('saved_item_id', $event->id)->exists()
            : false;

        $isRegistered = auth()->check() 
            ? $event->registrations()->where('user_id', auth()->id())->exists() 
            : false;

        return Inertia::render('community/events/show', [
            'event' => $event,
            'isRegistered' => $isRegistered,
        ]);
    }

    /**
     * Register for an event
     */
    public function registerEvent(Event $event, Request $request)
    {
        if ($event->registrations()->where('user_id', auth()->id())->exists()) {
            return back()->with('error', 'You are already registered for this event.');
        }

        $event->registrations()->create([
            'user_id' => auth()->id(),
            'status' => 'confirmed',
        ]);

        try {
            $user = auth()->user();
            if ($user && $user->email) {
                \Illuminate\Support\Facades\Mail::to($user->email)
                    ->send(new \App\Mail\EventRegistrationConfirmationMail($user->name, $event));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send event registration email: ' . $e->getMessage());
        }

        return back()->with('success', 'You have successfully registered for the event!');
    }

    /**
     * Display listing of articles.
     */
    public function articles(Request $request)
    {
        $query = Article::with('category')->where('is_published', true);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('excerpt', 'like', '%'.$request->search.'%')
                    ->orWhere('content', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        $orderBy = $request->input('orderby', 'latest');
        if ($orderBy === 'featured') {
            $query->where('is_featured', true)->latest();
        } else {
            $query->latest();
        }

        $articles = $query->paginate(12)->withQueryString();

        $articles->getCollection()->each(function ($article) {
            $article->image_url = $article->featured_image_url;
        });

        return Inertia::render('community/articles/index', array_merge([
            'articles' => $articles,
            'categories' => ArticleCategory::orderBy('name')->get(),
            'filters' => $request->only(['category_id', 'search', 'orderby']),
        ], $this->getFeaturedSidebarData()));
    }

    /**
     * Display article details.
     */
    public function articleShow(string $slug)
    {
        $article = Article::with(['category', 'user'])->where('slug', $slug)->firstOrFail();

        $article->image_url = $article->featured_image_url;

        $isSaved = false;
        if (auth()->check()) {
            $isSaved = auth()->user()->savedArticles()->where('article_id', $article->id)->exists();
        }

        $relatedArticles = Article::with('category')
            ->where('is_published', true)
            ->where('id', '!=', $article->id)
            ->when($article->category_id, fn ($q) => $q->where('category_id', $article->category_id))
            ->latest()
            ->take(3)
            ->get();

        if ($relatedArticles->count() < 3) {
            $existingIds = $relatedArticles->pluck('id')->push($article->id)->toArray();
            $more = Article::with('category')
                ->where('is_published', true)
                ->whereNotIn('id', $existingIds)
                ->latest()
                ->take(3 - $relatedArticles->count())
                ->get();
            $relatedArticles = $relatedArticles->concat($more);
        }

        $relatedArticles->each(function ($art) {
            $art->image_url = $art->featured_image_url;
        });

        return Inertia::render('community/articles/show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'isSavedProp' => $isSaved,
        ]);
    }

    /**
     * Save/Unsave an article for later.
     */
    public function articleSave(string $slug)
    {
        $article = Article::where('slug', $slug)->firstOrFail();
        $user = auth()->user();

        $bookmark = $user->savedArticles()->where('article_id', $article->id)->first();
        if ($bookmark) {
            $user->savedArticles()->detach($article->id);
            $saved = false;
        } else {
            $user->savedArticles()->attach($article->id);
            $saved = true;
        }

        return response()->json([
            'saved' => $saved,
        ]);
    }

    /**
     * Display public gallery.
     */
    public function gallery(Request $request)
    {
        $query = GalleryImage::query();

        // Exclude demo gallery images
        $query->whereHas('gallery', function ($gq) {
            $gq->whereNotIn('title', self::DEMO_GALLERY_TITLES);
        });

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('caption', 'like', '%'.$request->search.'%')
                    ->orWhere('author_name', 'like', '%'.$request->search.'%')
                    ->orWhereHas('gallery', function ($gq) use ($request) {
                        $gq->whereHas('state', function ($sq) use ($request) {
                            $sq->where('name', 'like', '%'.$request->search.'%');
                        })->orWhereHas('city', function ($cq) use ($request) {
                            $cq->where('name', 'like', '%'.$request->search.'%');
                        });
                    });
            });
        }

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        $images = $query->with([
            'gallery' => function ($gQuery) {
                $gQuery->withCount('likes')->with(['user', 'category']);
            }
        ])->latest()->paginate(16)->withQueryString();

        $images->getCollection()->each(function ($image) {
            $image->image_url = Storage::url($image->image_path);
            if ($image->gallery) {
                $image->author_name = $image->gallery->user ? $image->gallery->user->name : 'Sanctuary Member';
                $image->category = $image->gallery->category;
                $image->likes_count = $image->gallery->likes_count;
                $image->shares_count = $image->gallery->shares_count;
            }
        });

        $galleries = Gallery::with(['category', 'state', 'city'])
            ->withCount('likes')
            ->whereNotIn('title', self::DEMO_GALLERY_TITLES)
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->limit(8)
            ->get();

        $galleries->each(function ($g) {
            if (empty($g->slug)) {
                $letters = 'abcdefghijklmnopqrstuvwxyz';
                $randomLetters = '';
                for ($i = 0; $i < 6; $i++) {
                    $randomLetters .= $letters[rand(0, 25)];
                }
                $g->slug = Str::slug($g->title).'-'.$randomLetters;
                $g->save();
            }
            $g->image_url = $g->featured_image_url;
        });

        return Inertia::render('community/gallery/index', array_merge([
            'images' => $images,
            'galleries' => $galleries,
            'categories' => GalleryCategory::orderBy('name')->get(),
            'filters' => $request->only(['category_id', 'search', 'orderby']),
        ], $this->getFeaturedSidebarData()));
    }

    /**
     * Display a specific gallery and its images.
     */
    public function galleryShow(string $slug)
    {
        $gallery = Gallery::with(['category', 'state', 'city', 'images', 'user'])->where('slug', $slug)->firstOrFail();
        $gallery->image_url = $gallery->image ? Storage::url($gallery->image) : null;

        $gallery->images->each(function ($img) {
            $img->url = Storage::url($img->image_path);
        });

        $isLiked = false;
        if (auth()->check()) {
            $isLiked = $gallery->likes()->where('user_id', auth()->id())->exists();
        } else {
            $isLiked = $gallery->likes()->where('ip_address', request()->ip())->exists();
        }

        $moreGalleries = Gallery::with(['category', 'state', 'city'])
            ->withCount('likes')
            ->where('id', '!=', $gallery->id)
            ->whereNotIn('title', self::DEMO_GALLERY_TITLES)
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->limit(4)
            ->get();

        $moreGalleries->each(function ($g) {
            $g->image_url = $g->featured_image_url;
        });

        return Inertia::render('community/gallery/show', [
            'gallery' => $gallery,
            'isLiked' => $isLiked,
            'likesCount' => $gallery->likes()->count(),
            'moreGalleries' => $moreGalleries,
        ]);
    }

    /**
     * Toggle like on a gallery collection.
     */
    public function galleryLike(string $slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();
        $ipAddress = request()->ip();
        $sessionId = request()->session()->getId();

        if (auth()->check()) {
            $userId = auth()->id();
            $like = $gallery->likes()->where('user_id', $userId)->first();
            if ($like) {
                $like->delete();
                $liked = false;
            } else {
                $gallery->likes()->create([
                    'user_id' => $userId,
                    'ip_address' => $ipAddress,
                    'session_id' => $sessionId,
                ]);
                $liked = true;
            }
        } else {
            $like = $gallery->likes()->where('ip_address', $ipAddress)->first();
            if ($like) {
                $like->delete();
                $liked = false;
            } else {
                $gallery->likes()->create([
                    'ip_address' => $ipAddress,
                    'session_id' => $sessionId,
                ]);
                $liked = true;
            }
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => $gallery->likes()->count(),
        ]);
    }

    /**
     * Increment share count on a gallery.
     */
    public function galleryShare(string $slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();
        $gallery->increment('shares_count');

        return response()->json([
            'shares_count' => $gallery->shares_count,
        ]);
    }

    /**
     * Increment export count on a gallery.
     */
    public function galleryExport(string $slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();
        $gallery->increment('exports_count');

        return response()->json([
            'exports_count' => $gallery->exports_count,
        ]);
    }

    /**
     * Download entire gallery collection as a ZIP archive.
     */
    public function galleryExportZip(Request $request, ?string $slug = null)
    {
        $gallerySlug = $slug ?: $request->input('slug') ?: $request->input('id');
        if (! $gallerySlug) {
            abort(404, 'Gallery not found.');
        }

        $decodedSlug = urldecode($gallerySlug);

        $gallery = Gallery::with(['category', 'user', 'images'])
            ->where('slug', $gallerySlug)
            ->orWhere('slug', $decodedSlug)
            ->orWhere('id', is_numeric($gallerySlug) ? (int) $gallerySlug : 0)
            ->first();

        if (! $gallery) {
            abort(404, 'Gallery collection not found.');
        }

        $gallery->increment('exports_count');

        $zipFileName = Str::slug($gallery->title ?: 'woofcircle-collection').'-gallery.zip';
        $tempDir = storage_path('app/temp');
        if (! file_exists($tempDir)) {
            @mkdir($tempDir, 0777, true);
        }
        $zipPath = $tempDir.'/'.uniqid('gallery_export_', true).'.zip';

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Unable to create ZIP archive.');
        }

        $photoIndex = 1;

        // Helper to add image file content to ZIP archive
        $addImageToZip = function ($rawPath, $suggestedName) use (&$zip, &$photoIndex) {
            if (empty($rawPath)) {
                return;
            }

            $content = null;
            $ext = pathinfo(parse_url($rawPath, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';

            if (str_starts_with($rawPath, 'http://') || str_starts_with($rawPath, 'https://')) {
                try {
                    $response = Http::timeout(6)->get($rawPath);
                    if ($response->successful()) {
                        $content = $response->body();
                    }
                } catch (\Throwable $e) {
                    // Skip failed remote download
                }
            } elseif (Storage::disk('public')->exists($rawPath)) {
                $content = Storage::disk('public')->get($rawPath);
            } elseif (Storage::exists($rawPath)) {
                $content = Storage::get($rawPath);
            } elseif (file_exists(public_path($rawPath))) {
                $content = @file_get_contents(public_path($rawPath));
            } elseif (file_exists(public_path('storage/'.$rawPath))) {
                $content = @file_get_contents(public_path('storage/'.$rawPath));
            } elseif (file_exists(storage_path('app/public/'.$rawPath))) {
                $content = @file_get_contents(storage_path('app/public/'.$rawPath));
            }

            if ($content !== null && strlen($content) > 0) {
                $filename = sprintf('%02d-%s.%s', $photoIndex++, Str::slug($suggestedName), $ext);
                $zip->addFromString($filename, $content);
            }
        };

        // 1. Add cover image if exists
        if ($gallery->image) {
            $addImageToZip($gallery->image, 'cover-photo');
        }

        // 2. Add all gallery collection photos
        if ($gallery->images && $gallery->images->isNotEmpty()) {
            foreach ($gallery->images as $img) {
                $caption = $img->caption ? Str::limit($img->caption, 35, '') : 'photo-'.$img->id;
                $addImageToZip($img->image_path, $caption);
            }
        }

        // 3. Add branded collection info document
        $curator = $gallery->user ? $gallery->user->name : 'WoofCircle Community';
        $category = $gallery->category ? $gallery->category->name : 'Community Collection';
        $siteName = config('app.name', 'WoofCircle');
        $siteUrl = config('app.url', url('/'));

        $readme = "====================================================\r\n"
            ."{$gallery->title}\r\n"
            ."====================================================\r\n\r\n"
            ."Curated By: {$curator}\r\n"
            ."Category: {$category}\r\n"
            ."Total Photos Exported: ".($photoIndex - 1)."\r\n"
            ."Online Gallery URL: {$siteUrl}/gallery/{$gallery->slug}\r\n\r\n"
            ."Collection Description:\r\n"
            .($gallery->description ?: 'Visual canine moments and memories on '.$siteName)."\r\n\r\n"
            ."Downloaded from {$siteName} Visual Archives.\r\n"
            ."© ".date('Y')." {$siteName}. All rights reserved.\r\n";

        $zip->addFromString('README.txt', $readme);
        $zip->close();

        return response()->download($zipPath, $zipFileName, [
            'Content-Type' => 'application/zip',
            'Content-Disposition' => 'attachment; filename="'.$zipFileName.'"',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Get shared curated featured items for directory/community sidebars.
     */
    private function getFeaturedSidebarData(): array
    {
        return [
            'featuredBreeders' => BreederProfile::with(['city', 'state'])
                ->where('is_active', true)
                ->latest()
                ->take(5)
                ->get(),
            'featuredLitters' => Litter::with(['breed', 'city', 'state'])
                ->where('is_approved', true)
                ->where('status', 'published')
                ->where('is_available', true)
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
}
