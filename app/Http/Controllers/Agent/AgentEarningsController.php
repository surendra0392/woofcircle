<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentEarningsController extends Controller
{
    public function index(Request $request)
    {
        $agent = auth('admin')->user();
        $payouts = $agent->payouts()->latest()->get();

        $totalEarned = $payouts->where('status', 'paid')->sum('amount');
        $totalPending = $payouts->where('status', 'pending')->sum('amount');

        return Inertia::render('Agent/Earnings', [
            'payouts' => $payouts,
            'totalEarned' => $totalEarned,
            'totalPending' => $totalPending,
        ]);
    }

    public function requestPayout(Request $request)
    {
        $agent = auth('admin')->user();
        
        $validated = $request->validate([
            'amount' => 'required|numeric|min:500',
        ]);

        // Add pending payout record
        $agent->payouts()->create([
            'amount' => $validated['amount'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Payout requested successfully. HR will review it shortly.');
    }
}
