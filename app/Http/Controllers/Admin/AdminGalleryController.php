<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Gallery;
use App\Models\GalleryCategory;
use App\Models\GalleryImage;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminGalleryController
{
    public function index(Request $request)
    {
        $query = Gallery::with(['category', 'state', 'city', 'images', 'user'])->withCount('likes');

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('state_id') && $request->state_id !== 'all') {
            $query->where('state_id', $request->state_id);
        }

        if ($request->filled('city_id') && $request->city_id !== 'all') {
            $query->where('city_id', $request->city_id);
        }

        if ($request->has('is_featured') && $request->is_featured !== 'all') {
            $query->where('is_featured', $request->is_featured === 'true');
        }

        if ($request->has('is_active') && $request->is_active !== 'all') {
            $query->where('is_active', $request->is_active === 'true');
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        $items = $query->latest()->paginate(24)->through(function ($gallery) {
            return array_merge($gallery->toArray(), [
                'main_image_url' => $gallery->main_image_url,
                'likes_count' => $gallery->likes_count,
                'images' => $gallery->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'caption' => $img->caption,
                ]),
            ]);
        });

        return Inertia::render('admin/gallery', [
            'items' => $items,
            'categories' => GalleryCategory::where('is_active', true)->orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'filters' => $request->only(['search', 'category_id', 'state_id', 'city_id', 'is_featured', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/gallery/create', [
            'categories' => GalleryCategory::where('is_active', true)->orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
        ]);
    }

    public function edit(Gallery $gallery)
    {
        $galleryData = array_merge($gallery->toArray(), [
            'main_image_url' => $gallery->main_image_url,
            'images' => $gallery->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'caption' => $img->caption,
            ])->toArray(),
        ]);

        return Inertia::render('admin/gallery/edit', [
            'gallery' => $galleryData,
            'categories' => GalleryCategory::where('is_active', true)->orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['required', 'image', 'max:5120'], // Main/Featured Image
            'category_id' => ['nullable', 'exists:gallery_categories,id'],
            'state_id' => ['nullable', 'exists:states,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*.file' => ['required_with:gallery_images', 'image', 'max:5120'],
            'gallery_images.*.caption' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('gallery', 'public');
        }

        $gallery = Gallery::create($validated);

        if ($request->has('gallery_images')) {
            foreach ($request->file('gallery_images') as $index => $imageData) {
                if (isset($imageData['file'])) {
                    $path = $imageData['file']->store('gallery/album', 'public');
                    $gallery->images()->create([
                        'image_path' => $path,
                        'caption' => $request->input("gallery_images.$index.caption"),
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.gallery.index')->with('success', 'Gallery entry created successfully.');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
            'category_id' => ['nullable', 'exists:gallery_categories,id'],
            'state_id' => ['nullable', 'exists:states,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'new_gallery_images' => ['nullable', 'array'],
            'new_gallery_images.*.file' => ['required_with:new_gallery_images', 'image', 'max:5120'],
            'new_gallery_images.*.caption' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('image')) {
            if ($gallery->image) {
                Storage::disk('public')->delete($gallery->image);
            }
            $validated['image'] = $request->file('image')->store('gallery', 'public');
        } else {
            unset($validated['image']);
        }

        $gallery->update($validated);

        if ($request->has('new_gallery_images')) {
            $maxOrder = $gallery->images()->max('sort_order') ?? -1;
            foreach ($request->file('new_gallery_images') as $index => $imageData) {
                if (isset($imageData['file'])) {
                    $path = $imageData['file']->store('gallery/album', 'public');
                    $gallery->images()->create([
                        'image_path' => $path,
                        'caption' => $request->input("new_gallery_images.$index.caption"),
                        'sort_order' => $maxOrder + 1 + $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.gallery.index')->with('success', 'Gallery item updated.');
    }

    public function deleteImage(GalleryImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image removed from gallery.');
    }

    public function toggleFeatured(Gallery $gallery)
    {
        $gallery->update(['is_featured' => ! $gallery->is_featured]);

        return redirect()->route('admin.gallery.index')->with('success', 'Featured status updated.');
    }

    public function toggleActive(Gallery $gallery)
    {
        $gallery->update(['is_active' => ! $gallery->is_active]);

        return redirect()->route('admin.gallery.index')->with('success', 'Active status updated.');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image) {
            Storage::disk('public')->delete($gallery->image);
        }
        foreach ($gallery->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $gallery->delete();

        return redirect()->route('admin.gallery.index')->with('success', 'Gallery entry deleted.');
    }
}
