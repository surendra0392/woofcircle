<?php

namespace App\Http\Controllers;

use App\Models\AdPlacement;
use App\Services\AdInjectionService;
use Illuminate\Http\Request;

class PublicAdController
{
    /**
     * Fetch the active visual display banner for a given slot.
     */
    public function getBanner(Request $request, string $slot, AdInjectionService $adService)
    {
        $banner = $adService->getDisplayBanner($slot, $request);
        $isAdFree = $adService->isUserAdFree($request);

        return response()->json([
            'banner' => $banner,
            'is_ad_free' => $isAdFree,
        ]);
    }

    /**
     * Track an ad banner impression.
     */
    public function trackImpression(AdPlacement $adPlacement)
    {
        $adPlacement->increment('impressions_count');

        return response()->json(['success' => true]);
    }

    /**
     * Track an ad banner click and safely redirect to destination URL.
     */
    public function trackClick(AdPlacement $adPlacement)
    {
        $adPlacement->increment('clicks_count');

        $destination = $adPlacement->target_url;

        if (! $destination || ! filter_var($destination, FILTER_VALIDATE_URL)) {
            return redirect()->route('home');
        }

        return redirect()->away($destination);
    }
}
