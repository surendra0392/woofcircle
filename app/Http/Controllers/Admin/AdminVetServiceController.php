<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VetService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminVetServiceController
{
    public function index()
    {
        return Inertia::render('admin/vet-services', [
            'services' => VetService::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        VetService::create($validated);

        return back()->with('success', 'Service created successfully.');
    }

    public function update(Request $request, VetService $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $service->update($validated);

        return back()->with('success', 'Service updated successfully.');
    }

    public function destroy(VetService $service)
    {
        $service->delete();

        return back()->with('success', 'Service deleted successfully.');
    }
}
