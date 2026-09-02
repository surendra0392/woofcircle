<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\Event;
use App\Models\GalleryImage;
use App\Models\Litter;
use App\Models\State;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController
{
    /**
     * Display the public homepage with aggregated data.
     */
    public function index()
    {
        // 1. Featured Litters
        $litters = Litter::with(['breed', 'state', 'city', 'profile'])
            ->where('is_approved', true)
            ->where('status', 'published')
            ->where('is_available', true)
            ->latest()
            ->take(9)
            ->get();

        $litters->each(function ($litter) {
            $litter->featured_image_url = $litter->featured_image_path ? Storage::url($litter->featured_image_path) : null;
            if ($litter->profile && $litter->profile_type === BreederProfile::class) {
                $litter->breeder_name = $litter->profile->kennel_name;
            }
        });

        // 2. Featured Breeds
        $breeds = Breed::latest()->take(8)->get();
        $breeds->each(function ($breed) {
            $breed->image_url = $breed->image ? (str_starts_with($breed->image, 'http') ? $breed->image : Storage::url($breed->image)) : null;
        });

        // 3. Upcoming Events
        $events = Event::where('start_date', '>=', now())
            ->where('is_active', true)
            ->orderBy('start_date', 'asc')
            ->take(3)
            ->get();
        $events->each(function ($event) {
            $event->image_url = $event->banner_path ? Storage::url($event->banner_path) : null;
        });

        // 4. Latest Articles
        $articles = Article::with('category')
            ->where('is_published', true)
            ->latest()
            ->take(4)
            ->get();
        $articles->each(function ($article) {
            $article->image_url = $article->featured_image_path ? Storage::url($article->featured_image_path) : null;
        });

        // 5. Gallery Items
        $gallery = GalleryImage::latest()->take(6)->get();
        $gallery->each(function ($image) {
            $image->image_url = Storage::url($image->image_path);
        });

        return Inertia::render('home/index', [
            'litters' => $litters,
            'breeds' => $breeds,
            'events' => $events,
            'articles' => $articles,
            'gallery' => $gallery,
            'states' => State::select('id', 'name')->orderBy('name')->get(),
        ]);
    }
}
