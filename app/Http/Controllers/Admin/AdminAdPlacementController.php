<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdPlacement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAdPlacementController extends Controller
{
    public function index()
    {
        $ads = AdPlacement::with(['agent'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ad) {
                // Ensure state and city names are available if they are stored as JSON IDs
                // In a real application, you might want to fetch names, but for now we just return the raw data
                return $ad;
            });

        return Inertia::render('admin/ads', [
            'ads' => $ads
        ]);
    }

    public function approve(AdPlacement $adPlacement)
    {
        if ($adPlacement->approval_status !== 'pending') {
            return back()->with('error', 'This ad is not pending approval.');
        }

        $adPlacement->update([
            'approval_status' => 'approved',
            'status' => 'active'
        ]);

        return back()->with('success', 'Ad placement and discount approved successfully.');
    }

    public function reject(AdPlacement $adPlacement)
    {
        if ($adPlacement->approval_status !== 'pending') {
            return back()->with('error', 'This ad is not pending approval.');
        }

        $adPlacement->update([
            'approval_status' => 'rejected',
            'status' => 'cancelled' // Or whatever canceled state is appropriate
        ]);

        return back()->with('success', 'Ad placement discount rejected.');
    }

    public function destroy(AdPlacement $adPlacement)
    {
        $adPlacement->delete();
        return back()->with('success', 'Ad canceled successfully.');
    }
}
