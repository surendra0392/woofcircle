<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminGalleryCategoryController
{
    public function index()
    {
        return Inertia::render('admin/gallery-categories', [
            'categories' => GalleryCategory::withCount('galleries')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Ensure unique slug
        $original = $validated['slug'];
        $count = 1;
        while (GalleryCategory::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $original.'-'.$count++;
        }

        GalleryCategory::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, GalleryCategory $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        if ($validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $original = $validated['slug'];
            $count = 1;
            while (GalleryCategory::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
                $validated['slug'] = $original.'-'.$count++;
            }
        }

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(GalleryCategory $category)
    {
        if ($category->galleries()->exists()) {
            return back()->with('error', 'Cannot delete category with associated gallery items.');
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
