<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdPricing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAdPricingController extends Controller
{
    public function index()
    {
        $pricings = AdPricing::orderBy('tier')->orderBy('duration')->get();
        return Inertia::render('admin/ad-pricings', [
            'pricings' => $pricings
        ]);
    }

    public function update(Request $request, AdPricing $pricing)
    {
        $validated = $request->validate([
            'price' => 'required|numeric|min:0'
        ]);

        $pricing->update(['price' => $validated['price']]);

        return back()->with('success', 'Pricing updated successfully.');
    }
}
