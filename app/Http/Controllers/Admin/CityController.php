<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\State;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CityController
{
    public function index(Request $request): Response
    {
        $query = City::with('state');

        // Apply state filter if provided
        if ($request->filled('state_id')) {
            $query->where('state_id', $request->state_id);
        }

        // Order by state name then city name
        $cities = $query->leftJoin('states', 'cities.state_id', '=', 'states.id')
            ->select('cities.*')
            ->orderBy('states.name')
            ->orderBy('cities.name')
            ->paginate(10)
            ->withQueryString();

        // Need states for the dropdowns (both Add/Edit modal and the Filter)
        $states = State::orderBy('name')->get();

        return Inertia::render('admin/cities', [
            'cities' => $cities,
            'states' => $states,
            'filters' => $request->only(['state_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'state_id' => ['required', 'exists:states,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cities')->where(function ($query) use ($request) {
                    return $query->where('state_id', $request->state_id);
                }),
            ],
        ], [
            'name.unique' => 'The city name has already been added for the selected state.',
        ]);

        City::create($request->only(['name', 'state_id']));

        return back()->with('success', 'City created successfully.');
    }

    public function update(Request $request, City $city): RedirectResponse
    {
        $request->validate([
            'state_id' => ['required', 'exists:states,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cities')->where(function ($query) use ($request) {
                    return $query->where('state_id', $request->state_id);
                })->ignore($city->id),
            ],
        ], [
            'name.unique' => 'The city name has already been added for the selected state.',
        ]);

        $city->update($request->only(['name', 'state_id']));

        return back()->with('success', 'City updated successfully.');
    }

    public function destroy(City $city): RedirectResponse
    {
        // Future: Check if city is used in listings, profiles, events, etc.
        // For now: allow delete safely.

        $city->delete();

        return back()->with('success', 'City deleted successfully.');
    }
}
