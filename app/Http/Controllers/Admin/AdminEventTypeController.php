<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminEventTypeController
{
    public function index()
    {
        return Inertia::render('admin/event-types', [
            'eventTypes' => EventType::withCount('events')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:event_types,name',
            'is_active' => 'boolean',
        ]);

        EventType::create($validated);

        return back()->with('success', 'Event type created successfully.');
    }

    public function update(Request $request, EventType $eventType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:event_types,name,'.$eventType->id,
            'is_active' => 'boolean',
        ]);

        // If name changed, update slug
        if ($eventType->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $original = $slug;
            $count = 1;
            while (EventType::where('slug', $slug)->where('id', '!=', $eventType->id)->exists()) {
                $slug = $original.'-'.$count++;
            }
            $validated['slug'] = $slug;
        }

        $eventType->update($validated);

        return back()->with('success', 'Event type updated successfully.');
    }

    public function toggleActive(EventType $eventType)
    {
        $eventType->update(['is_active' => ! $eventType->is_active]);

        return back()->with('success', 'Event type status updated.');
    }

    public function destroy(EventType $eventType)
    {
        if ($eventType->events()->exists()) {
            return back()->with('error', 'Cannot delete event type because it is assigned to events.');
        }

        $eventType->delete();

        return back()->with('success', 'Event type deleted successfully.');
    }
}
