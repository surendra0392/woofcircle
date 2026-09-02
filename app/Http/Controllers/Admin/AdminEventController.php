<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Event;
use App\Models\EventGallery;
use App\Models\EventType;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminEventController
{
    public function index(Request $request)
    {
        $query = Event::with(['state', 'city', 'eventType', 'gallery'])->withCount('registrations');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }
        if ($request->has('is_featured') && $request->is_featured !== 'all') {
            $query->where('is_featured', $request->is_featured === 'true');
        }
        if ($request->filled('event_type_id') && $request->event_type_id !== 'all') {
            $query->where('event_type_id', $request->event_type_id);
        }
        if ($request->filled('state_id')) {
            $query->where('state_id', $request->state_id);
        }
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $events = $query->orderBy('start_date', 'asc')->paginate(10)->withQueryString();

        // Transform collection items
        $events->getCollection()->transform(function ($event) {
            return array_merge($event->toArray(), [
                'banner_image' => $event->banner_url,
                'start_date' => $event->start_date?->format('Y-m-d'),
                'end_date' => $event->end_date?->format('Y-m-d'),
                'gallery' => $event->gallery->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                    ];
                }),
            ]);
        });

        return Inertia::render('admin/events', [
            'events' => $events,
            'eventTypes' => EventType::orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'filters' => $request->only(['is_active', 'is_featured', 'event_type_id', 'state_id', 'city_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/events/create', [
            'eventTypes' => EventType::orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
        ]);
    }

    public function edit(Event $event)
    {
        $eventData = array_merge($event->toArray(), [
            'banner_image' => $event->banner_url,
            'start_date' => $event->start_date?->format('Y-m-d'),
            'end_date' => $event->end_date?->format('Y-m-d'),
            'gallery' => $event->gallery->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->url,
                ];
            })->toArray(),
        ]);

        return Inertia::render('admin/events/edit', [
            'event' => $eventData,
            'eventTypes' => EventType::orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_type_id' => ['required', 'exists:event_types,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'start_time' => ['nullable', 'string'],
            'state_id' => ['required', 'exists:states,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'venue_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'organizer_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'banner_image' => ['nullable', 'image', 'max:2048'],
            'gallery' => ['nullable', 'array', 'max:10'],
            'gallery.*' => ['image', 'max:2048'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('events/banners', 'public');
        }

        unset($validated['gallery']);

        $validated['slug'] = Str::slug($validated['title']);
        $original = $validated['slug'];
        $count = 1;
        while (Event::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $original.'-'.$count++;
        }

        $event = Event::create($validated);

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $index => $image) {
                $path = $image->store('events/gallery', 'public');
                $event->gallery()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_type_id' => ['required', 'exists:event_types,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'start_time' => ['nullable', 'string'],
            'state_id' => ['required', 'exists:states,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'venue_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'organizer_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'banner_image' => ['nullable', 'image', 'max:2048'],
            'gallery' => ['nullable', 'array', 'max:10'],
            'gallery.*' => ['image', 'max:2048'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        if ($request->hasFile('banner_image')) {
            if ($event->banner_image) {
                Storage::disk('public')->delete($event->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')->store('events/banners', 'public');
        } else {
            unset($validated['banner_image']);
        }

        unset($validated['gallery']);

        $event->update($validated);

        if ($request->hasFile('gallery')) {
            $currentMaxOrder = $event->gallery()->max('sort_order') ?? -1;
            foreach ($request->file('gallery') as $index => $image) {
                $path = $image->store('events/gallery', 'public');
                $event->gallery()->create([
                    'image_path' => $path,
                    'sort_order' => $currentMaxOrder + 1 + $index,
                ]);
            }
        }

        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
    }

    public function toggleActive(Event $event)
    {
        $event->update(['is_active' => ! $event->is_active]);

        return redirect()->route('admin.events.index')->with('success', 'Event status updated.');
    }

    public function toggleFeatured(Event $event)
    {
        $event->update(['is_featured' => ! $event->is_featured]);

        return redirect()->route('admin.events.index')->with('success', 'Featured status updated.');
    }

    public function destroy(Event $event)
    {
        if ($event->banner_image) {
            Storage::disk('public')->delete($event->banner_image);
        }

        foreach ($event->gallery as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $event->delete();

        return redirect()->route('admin.events.index')->with('success', 'Event deleted permanently.');
    }

    public function deleteGalleryImage(EventGallery $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image deleted from gallery.');
    }

    public function registrations(Event $event)
    {
        $registrations = $event->registrations()->with('user:id,name,email')->latest()->get();
        return response()->json($registrations);
    }
}
