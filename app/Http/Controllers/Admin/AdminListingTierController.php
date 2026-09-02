<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ListingTier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminListingTierController extends Controller
{
    public function index()
    {
        $tiers = ListingTier::orderBy('name')->get();

        return Inertia::render('admin/listing-tiers/index', [
            'tiers' => $tiers,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'max_listings' => 'required|integer|min:-1',
            'price' => 'nullable|numeric|min:0',
        ]);

        if (empty($data['price'])) {
            $data['price'] = 0;
        }

        ListingTier::create($data);

        return redirect()->back()->with('success', 'Listing Tier created successfully.');
    }

    public function update(Request $request, ListingTier $tier)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'max_listings' => 'required|integer|min:-1',
            'price' => 'nullable|numeric|min:0',
        ]);

        if (empty($data['price'])) {
            $data['price'] = 0;
        }

        $tier->update($data);

        return redirect()->back()->with('success', 'Listing Tier updated successfully.');
    }

    public function destroy(ListingTier $tier)
    {
        // Don't allow deleting the Free tier (ID 1 usually) or tiers with users
        if ($tier->id === 1 || $tier->users()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete this tier because it is the default tier or has active users.');
        }

        $tier->delete();

        return redirect()->back()->with('success', 'Listing Tier deleted successfully.');
    }
}
