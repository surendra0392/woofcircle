<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCareerPositionController
{
    public function index(Request $request)
    {
        $positions = CareerPosition::query()
            ->withCount('applications')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('department', 'like', '%' . $request->search . '%');
            })
            ->when($request->filled('department') && $request->department !== 'all', function ($q) use ($request) {
                $q->where('department', $request->department);
            })
            ->when($request->has('is_active') && $request->is_active !== 'all', function ($q) use ($request) {
                $q->where('is_active', $request->is_active === '1');
            })
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->through(function ($position) {
                return array_merge($position->toArray(), [
                    'created_at_formatted' => $position->created_at->format('M d, Y'),
                ]);
            });

        $departments = CareerPosition::distinct()->pluck('department')->sort()->values();

        return Inertia::render('admin/careers/positions/index', [
            'positions' => $positions,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/careers/positions/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:full-time,part-time,contract'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        CareerPosition::create($validated);

        return redirect()->route('admin.career-positions.index')->with('success', 'Career position created successfully.');
    }

    public function edit(CareerPosition $careerPosition)
    {
        return Inertia::render('admin/careers/positions/edit', [
            'position' => $careerPosition,
        ]);
    }

    public function update(Request $request, CareerPosition $careerPosition)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:full-time,part-time,contract'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $careerPosition->update($validated);

        return redirect()->route('admin.career-positions.index')->with('success', 'Career position updated successfully.');
    }

    public function destroy(CareerPosition $careerPosition)
    {
        $careerPosition->delete();

        return redirect()->route('admin.career-positions.index')->with('success', 'Career position deleted successfully.');
    }

    public function toggleActive(CareerPosition $careerPosition)
    {
        $careerPosition->update(['is_active' => !$careerPosition->is_active]);

        return back()->with('success', 'Position status updated.');
    }
}
