<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Breed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminBreedController
{
    public function index(Request $request)
    {
        $query = Breed::query();

        // Apply filters
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        if ($request->filled('size')) {
            $query->where('size', $request->size);
        }
        if ($request->filled('breed_group')) {
            $query->where('breed_group', $request->breed_group);
        }
        if ($request->filled('is_indian')) {
            $query->where('is_indian', $request->is_indian === 'true' || $request->is_indian === '1');
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        $breeds = $query->orderBy('name')->paginate(10)->withQueryString();

        $groups = Breed::whereNotNull('breed_group')
            ->where('breed_group', '!=', '')
            ->distinct()
            ->orderBy('breed_group')
            ->pluck('breed_group');

        return Inertia::render('admin/breeds/index', [
            'breeds' => $breeds,
            'groups' => $groups,
            'filters' => $request->only(['search', 'size', 'breed_group', 'is_indian', 'is_active']),
        ]);
    }

    public function create()
    {
        $groups = Breed::whereNotNull('breed_group')
            ->where('breed_group', '!=', '')
            ->distinct()
            ->orderBy('breed_group')
            ->pluck('breed_group');

        return Inertia::render('admin/breeds/create', [
            'groups' => $groups,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:breeds,name',
            'slug' => 'nullable|string|max:255|unique:breeds,slug',
            'description' => 'nullable|string',
            'history' => 'nullable|string',
            'other_names' => 'nullable|string',
            'naming' => 'nullable|string',
            'variants' => 'nullable|string',
            'appearance' => 'nullable|string',
            'health' => 'nullable|string',
            'temperament' => 'nullable|string|max:255',
            'behavior' => 'nullable|string',
            'intelligence' => 'nullable|string',
            'use' => 'nullable|string',
            'origin' => 'nullable|string|max:255',
            'life_span' => 'nullable|string|max:255',
            'male_height' => 'nullable|string|max:255',
            'female_height' => 'nullable|string|max:255',
            'male_weight' => 'nullable|string|max:255',
            'female_weight' => 'nullable|string|max:255',
            'size' => 'required|in:small,medium,large,giant',
            'breed_group' => 'nullable|string|max:255',
            'coat_type' => 'nullable|string|max:255',
            'colors' => 'nullable|string',
            'energy_level' => 'nullable|string|max:255',
            'is_indian' => 'boolean',
            'is_active' => 'boolean',
            'image_file' => 'nullable|image|max:2048', // Virtual field for upload
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($request->hasFile('image_file')) {
            $data['image'] = $request->file('image_file')->store('breeds', 'public');
        }

        unset($data['image_file']); // Remove virtual field before mass assignment

        Breed::create($data);

        return redirect()->route('admin.breeds.index')->with('success', 'Breed created successfully.');
    }

    public function edit(Breed $breed)
    {
        $groups = Breed::whereNotNull('breed_group')
            ->where('breed_group', '!=', '')
            ->distinct()
            ->orderBy('breed_group')
            ->pluck('breed_group');

        return Inertia::render('admin/breeds/edit', [
            'breed' => $breed,
            'groups' => $groups,
        ]);
    }

    public function update(Request $request, Breed $breed)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:breeds,name,'.$breed->id,
            'slug' => 'required|string|max:255|unique:breeds,slug,'.$breed->id,
            'description' => 'nullable|string',
            'history' => 'nullable|string',
            'other_names' => 'nullable|string',
            'naming' => 'nullable|string',
            'variants' => 'nullable|string',
            'appearance' => 'nullable|string',
            'health' => 'nullable|string',
            'temperament' => 'nullable|string|max:255',
            'behavior' => 'nullable|string',
            'intelligence' => 'nullable|string',
            'use' => 'nullable|string',
            'origin' => 'nullable|string|max:255',
            'life_span' => 'nullable|string|max:255',
            'male_height' => 'nullable|string|max:255',
            'female_height' => 'nullable|string|max:255',
            'male_weight' => 'nullable|string|max:255',
            'female_weight' => 'nullable|string|max:255',
            'size' => 'required|in:small,medium,large,giant',
            'breed_group' => 'nullable|string|max:255',
            'coat_type' => 'nullable|string|max:255',
            'colors' => 'nullable|string',
            'energy_level' => 'nullable|string|max:255',
            'is_indian' => 'boolean',
            'is_active' => 'boolean',
            'image_file' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image_file')) {
            // Delete old image if exists
            if ($breed->image) {
                Storage::disk('public')->delete($breed->image);
            }
            $data['image'] = $request->file('image_file')->store('breeds', 'public');
        }

        unset($data['image_file']);

        $breed->update($data);

        return redirect()->route('admin.breeds.index')->with('success', 'Breed updated successfully.');
    }

    public function destroy(Breed $breed)
    {
        // Safety requirement: Toggle is_active instead of hard delete
        $breed->update(['is_active' => ! $breed->is_active]);

        $status = $breed->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Breed successfully {$status}.");
    }
}
