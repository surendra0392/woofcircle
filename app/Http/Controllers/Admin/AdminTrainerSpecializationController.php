<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainerSpecialization;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminTrainerSpecializationController
{
    public function index()
    {
        return Inertia::render('admin/trainer-specializations', [
            'specializations' => TrainerSpecialization::latest()->get(),
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

        TrainerSpecialization::create($validated);

        return back()->with('success', 'Specialization created successfully.');
    }

    public function update(Request $request, TrainerSpecialization $specialization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $specialization->update($validated);

        return back()->with('success', 'Specialization updated successfully.');
    }

    public function destroy(TrainerSpecialization $specialization)
    {
        $specialization->delete();

        return back()->with('success', 'Specialization deleted successfully.');
    }
}
