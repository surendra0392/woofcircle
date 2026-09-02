<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BreedComparisonController extends Controller
{
    public function index(Request $request)
    {
        $allBreeds = Breed::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'image']);

        $selectedBreeds = [];
        $breedIds = $request->query('breeds');

        if ($breedIds) {
            $ids = array_filter(explode(',', $breedIds));
            $ids = array_slice($ids, 0, 3);

            $selectedBreeds = Breed::whereIn('id', $ids)
                ->where('is_active', true)
                ->get()
                ->map(function ($breed) {
                    $weight = $breed->male_weight && $breed->female_weight
                        ? ($breed->male_weight == $breed->female_weight ? "{$breed->male_weight} kg" : "{$breed->female_weight} - {$breed->male_weight} kg")
                        : ($breed->male_weight ? "{$breed->male_weight} kg" : ($breed->female_weight ? "{$breed->female_weight} kg" : 'N/A'));

                    $height = $breed->male_height && $breed->female_height
                        ? ($breed->male_height == $breed->female_height ? "{$breed->male_height} cm" : "{$breed->female_height} - {$breed->male_height} cm")
                        : ($breed->male_height ? "{$breed->male_height} cm" : ($breed->female_height ? "{$breed->female_height} cm" : 'N/A'));

                    $exercise = $breed->energy_level
                        ? (is_numeric($breed->energy_level) ? (int)$breed->energy_level : match(strtolower((string)$breed->energy_level)) { 'high' => 5, 'medium' => 3, 'low' => 2, default => 3 })
                        : 3;

                    $grooming = $breed->coat_type
                        ? match(strtolower((string)$breed->coat_type)) { 'long', 'double' => 4, 'wire', 'curly' => 3, 'short', 'smooth' => 2, default => 3 }
                        : 3;

                    $training = $breed->intelligence
                        ? (is_numeric($breed->intelligence) ? (int)$breed->intelligence : match(strtolower((string)$breed->intelligence)) { 'high', 'very high' => 5, 'medium' => 3, 'low' => 2, default => 4 })
                        : 4;

                    return [
                        'id' => $breed->id,
                        'name' => $breed->name,
                        'slug' => $breed->slug,
                        'cover_image' => $breed->image_url,
                        'breed_group' => $breed->breed_group,
                        'size' => $breed->size ? ucfirst($breed->size) : 'Medium',
                        'weight_range' => $weight,
                        'height_range' => $height,
                        'lifespan' => $breed->life_span ? "{$breed->life_span} years" : '10 - 14 years',
                        'temperament' => $breed->temperament,
                        'exercise_needs' => $exercise,
                        'grooming_needs' => $grooming,
                        'trainability' => $training,
                        'good_with_children' => 4,
                        'good_with_pets' => 4,
                        'origin' => $breed->origin,
                        'description' => $breed->description,
                    ];
                });
        }

        return Inertia::render('breeds/compare', [
            'all_breeds' => $allBreeds,
            'selected_breeds' => $selectedBreeds,
            'breed_ids' => $breedIds,
        ]);
    }
}
