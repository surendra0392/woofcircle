<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\State;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StateController
{
    public function index(): Response
    {
        $states = State::withCount('cities')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('admin/states', [
            'states' => $states,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:states,name'],
        ]);

        State::create($request->only('name'));

        return back()->with('success', 'State created successfully.');
    }

    public function update(Request $request, State $state): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:states,name,'.$state->id],
        ]);

        $state->update($request->only('name'));

        return back()->with('success', 'State updated successfully.');
    }

    public function destroy(State $state): RedirectResponse
    {
        if ($state->cities()->exists()) {
            return back()->with('error', 'Cannot delete this state because it has cities linked to it.');
        }

        $state->delete();

        return back()->with('success', 'State deleted successfully.');
    }
}
