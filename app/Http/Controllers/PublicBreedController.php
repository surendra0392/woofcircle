<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\Litter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicBreedController
{
    /**
     * Display a listing of breeds.
     */
    public function index(Request $request)
    {
        $query = Breed::where('is_active', true);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('breed_group') && $request->breed_group !== 'all') {
            $query->where('breed_group', $request->breed_group);
        }
        if ($request->filled('size') && $request->size !== 'all') {
            $query->where('size', $request->size);
        }
        if ($request->boolean('is_indian')) {
            $query->where('is_indian', true);
        }

        $sortField = 'name';
        $sortOrder = 'asc';

        if ($request->filled('orderby')) {
            switch ($request->orderby) {
                case 'newest':
                    $sortField = 'created_at';
                    $sortOrder = 'desc';
                    break;
                case 'a-z':
                    $sortField = 'name';
                    $sortOrder = 'asc';
                    break;
                case 'z-a':
                    $sortField = 'name';
                    $sortOrder = 'desc';
                    break;
            }
        }

        $breeds = $query->orderBy($sortField, $sortOrder)->paginate(12)->withQueryString();

        $breeds->getCollection()->each(function ($breed) {
            $breed->image_url = $breed->image ? (str_starts_with($breed->image, 'http') ? $breed->image : Storage::url($breed->image)) : null;
        });

        return Inertia::render('breeds/index', [
            'breeds' => $breeds,
            'breedGroups' => Breed::whereNotNull('breed_group')->distinct()->pluck('breed_group'),
            'filters' => $request->only(['breed_group', 'size', 'is_indian', 'search', 'orderby', 'view']),
        ]);
    }

    /**
     * Display the specified breed details.
     */
    public function show(string $slug)
    {
        $breed = Breed::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $breed->image_url = $breed->image ? (str_starts_with($breed->image, 'http') ? $breed->image : Storage::url($breed->image)) : null;

        // Fetch related litters for this breed
        $relatedLitters = Litter::with(['state', 'city', 'profile'])
            ->where('breed_id', $breed->id)
            ->where('is_approved', true)
            ->where('status', 'published')
            ->latest()
            ->take(4)
            ->get();

        $relatedLitters->each(function ($litter) {
            $litter->featured_image_url = $litter->featured_image_path ? (str_starts_with($litter->featured_image_path, 'http') ? $litter->featured_image_path : Storage::url($litter->featured_image_path)) : null;
            if ($litter->profile && $litter->profile_type === BreederProfile::class) {
                $litter->breeder_name = $litter->profile->kennel_name;
            }
        });

        return Inertia::render('breeds/show', [
            'breed' => $breed,
            'relatedLitters' => $relatedLitters,
        ]);
    }
}
