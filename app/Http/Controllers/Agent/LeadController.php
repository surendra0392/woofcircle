<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a list of the agent's leads with optional status filtering.
     */
    public function index(Request $request)
    {
        $agent = auth('admin')->user();

        // Get leads for this agent and their subordinates
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        $query = Lead::with('agent')->whereIn('agent_id', $targetIds);

        // Optional status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $leads = $query->latest()->get();
        $statusCounts = Lead::whereIn('agent_id', $targetIds)
            ->selectRaw("status, COUNT(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Agent/Leads/Index', [
            'leads' => $leads,
            'statusCounts' => $statusCounts,
            'filters' => [
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    /**
     * Show the form to create a new lead.
     */
    public function create()
    {
        return Inertia::render('Agent/Leads/Create');
    }

    /**
     * Store a newly created lead.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'status' => 'required|in:new,contacted,interested,follow_up,converted,rejected',
            'notes' => 'nullable|string',
            'next_follow_up_date' => 'nullable|date',
        ]);

        Lead::create([
            'agent_id' => auth('admin')->id(),
            'business_name' => $validated['business_name'],
            'contact_person' => $validated['contact_person'],
            'phone' => $validated['phone'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'next_follow_up_date' => $validated['next_follow_up_date'],
        ]);

        return redirect()->route('agent.leads.index')
            ->with('success', 'Lead created successfully.');
    }

    /**
     * Display a single lead's details.
     */
    public function show(Lead $lead)
    {
        // Ensure the agent can only view their own leads or subordinates' leads
        $agent = auth('admin')->user();
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        if (! $targetIds->contains($lead->agent_id)) {
            abort(403);
        }

        $lead->load('agent');

        return Inertia::render('Agent/Leads/Show', [
            'lead' => $lead,
        ]);
    }

    /**
     * Update the lead's status in-place (quick action from Index).
     */
    public function updateStatus(Request $request, Lead $lead)
    {
        $agent = auth('admin')->user();
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        if (! $targetIds->contains($lead->agent_id)) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:new,contacted,interested,follow_up,converted,rejected',
        ]);

        $lead->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Lead status updated.');
    }

    /**
     * Update lead details (notes, contact info).
     */
    public function update(Request $request, Lead $lead)
    {
        $agent = auth('admin')->user();
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        if (! $targetIds->contains($lead->agent_id)) {
            abort(403);
        }

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'status' => 'required|in:new,contacted,interested,follow_up,converted,rejected',
            'notes' => 'nullable|string',
            'next_follow_up_date' => 'nullable|date',
        ]);

        $lead->update($validated);

        return redirect()->back()->with('success', 'Lead updated successfully.');
    }

    public function edit(Lead $lead)
    {
        $agent = auth('admin')->user();
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        if (! $targetIds->contains($lead->agent_id)) {
            abort(403);
        }

        return Inertia::render('Agent/Leads/Edit', [
            'lead' => $lead,
        ]);
    }

    public function convertToProfile(Lead $lead)
    {
        $agent = auth('admin')->user();
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        if (! $targetIds->contains($lead->agent_id)) {
            abort(403);
        }

        $lead->update(['status' => 'converted']);

        return redirect()->route('agent.onboarding.create', [
            'lead_id' => $lead->id,
            'business_name' => $lead->business_name,
            'contact_person' => $lead->contact_person,
            'phone' => $lead->phone,
        ])->with('success', 'Lead converted! Please complete the onboarding profile.');
    }

    /**
     * Delete a lead.
     */
    public function destroy(Lead $lead)
    {
        $agent = auth('admin')->user();
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = \App\Models\Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        if (! $targetIds->contains($lead->agent_id)) {
            abort(403);
        }

        $lead->delete();

        return redirect()->route('agent.leads.index')
            ->with('success', 'Lead deleted.');
    }
}
