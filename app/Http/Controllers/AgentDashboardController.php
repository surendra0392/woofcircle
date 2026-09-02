<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasTransferValidation;
use App\Models\AdPlacement;
use App\Models\Admin;
use App\Models\DirectoryProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentDashboardController extends Controller
{
    use HasTransferValidation;

    /**
     * Role lists are defined in config/roles.php — the single source of truth.
     * Inline config() calls ensure zero drift from CheckFieldAgent middleware.
     */

    public function index(Request $request)
    {
        $agent = auth('admin')->user();

        // Get agent and their subordinates
        $targetIds = $agent->allSubordinates()->pluck('id')->push($agent->id);

        if ($agent->role !== 'superadmin') {
            if ($agent->city_id) {
                $targetIds = Admin::whereIn('id', $targetIds)->where('city_id', $agent->city_id)->pluck('id');
            } elseif ($agent->state_id) {
                $targetIds = Admin::whereIn('id', $targetIds)->where('state_id', $agent->state_id)->pluck('id');
            }
        }

        $onboardedCount = DirectoryProfile::whereIn('agent_id', $targetIds)->count();
        $adRevenue = AdPlacement::whereIn('agent_id', $targetIds)
            ->where('status', 'active')
            ->sum('amount_collected');

        $recentProfiles = DirectoryProfile::with('agent')
            ->whereIn('agent_id', $targetIds)
            ->latest()
            ->take(10)
            ->get();

        $eligibleTargets = $this->eligibleTargets(config('roles.agent'));

        // CRM Lead count for dashboard KPI
        $leadCount = \App\Models\Lead::whereIn('agent_id', $targetIds)
            ->whereIn('status', ['new', 'contacted', 'interested', 'follow_up'])
            ->count();
            
        $upcomingFollowUps = \App\Models\Lead::whereIn('agent_id', $targetIds)
            ->whereNotNull('next_follow_up_date')
            ->whereIn('status', ['contacted', 'interested', 'follow_up', 'new'])
            ->whereDate('next_follow_up_date', '>=', today())
            ->orderBy('next_follow_up_date', 'asc')
            ->take(5)
            ->get(['id', 'business_name', 'contact_person', 'next_follow_up_date', 'status'])
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'business_name' => $lead->business_name,
                    'contact_person' => $lead->contact_person,
                    'status' => $lead->status,
                    'next_follow_up_date' => $lead->next_follow_up_date->toISOString(),
                ];
            });

        return Inertia::render('Agent/Dashboard', [
            'onboardedCount' => $onboardedCount,
            'adRevenue' => $adRevenue,
            'recentProfiles' => $recentProfiles,
            'eligibleTargets' => $eligibleTargets,
            'leadCount' => $leadCount,
            'upcomingFollowUps' => $upcomingFollowUps,
        ]);
    }

    public function transferProfile(Request $request, $id)
    {
        $request->validate(['agent_id' => 'required|exists:admins,id']);

        $redirect = $this->validateTransferTarget(
            $request->agent_id, config('roles.agent'), 'agent_id', 'profile',
        );
        if ($redirect) {
            return $redirect;
        }

        DirectoryProfile::findOrFail($id)->update(['agent_id' => $request->agent_id]);
        return redirect()->back()->with('success', 'Profile transferred successfully.');
    }
}
