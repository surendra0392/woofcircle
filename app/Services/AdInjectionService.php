<?php

namespace App\Services;

use App\Models\AdPlacement;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class AdInjectionService
{
    /**
     * Check if the requesting user has an ad-free subscription privilege.
     */
    public function isUserAdFree(Request $request): bool
    {
        $user = $request->user();
        if (! $user) {
            return false;
        }

        return $user->isConnoisseur() || $user->isElite() || $user->isSubscribed();
    }

    /**
     * Inject tier-based ads into a paginated collection.
     *
     * @param LengthAwarePaginator $paginator
     * @param string $promotableType
     * @param Request $request
     * @return LengthAwarePaginator
     */
    public function injectAds(LengthAwarePaginator $paginator, string $promotableType, Request $request): LengthAwarePaginator
    {
        // 100% Ad-Free experience for Connoisseur and Sovereign Elite members
        if ($this->isUserAdFree($request)) {
            return $paginator;
        }

        // Only inject ads on the first page
        if ($paginator->currentPage() !== 1) {
            return $paginator;
        }

        $cityId = $request->input('city_id');
        $stateId = $request->input('state_id');
        
        $query = AdPlacement::with('promotable')
            ->active()
            ->where(function ($q) {
                $q->where('placement_slot', 'listing_boost')
                    ->orWhereNull('placement_slot');
            })
            ->where('promotable_type', $promotableType);
            
        // Filter by location if specified in the request
        if ($cityId && $cityId !== 'all') {
            $query->where(function($q) use ($cityId) {
                $q->whereJsonContains('targeted_city_ids', (int)$cityId)
                  ->orWhereNull('targeted_city_ids');
            });
        }
        if ($stateId && $stateId !== 'all') {
            $query->where(function($q) use ($stateId) {
                $q->whereJsonContains('targeted_state_ids', (int)$stateId)
                  ->orWhereNull('targeted_state_ids');
            });
        }
        
        $ads = $query->get();
        
        // Apply Tier Logic: Platinum(1), Gold(2), Silver(2), Bronze(2), Featured(3)
        $groupedAds = [
            'platinum' => $ads->where('tier', 'platinum')->shuffle()->take(1),
            'gold'     => $ads->where('tier', 'gold')->shuffle()->take(2),
            'silver'   => $ads->where('tier', 'silver')->shuffle()->take(2),
            'bronze'   => $ads->where('tier', 'bronze')->shuffle()->take(2),
            'featured' => $ads->where('tier', 'featured')->shuffle()->take(3),
        ];
        
        $promotedItems = collect();
        foreach ($groupedAds as $tier => $tierAds) {
            foreach ($tierAds as $ad) {
                if ($ad->promotable) {
                    $item = $ad->promotable;
                    $item->is_sponsored_tier = $tier;
                    $item->is_sponsored = true;
                    $item->ad_placement_id = $ad->id;
                    $promotedItems->push($item);
                }
            }
        }
        
        // Remove these promoted items from the normal paginator results to avoid duplicates
        $promotedIds = $promotedItems->pluck('id')->toArray();
        
        $normalItems = $paginator->getCollection()->reject(function ($item) use ($promotedIds) {
            return in_array($item->id, $promotedIds);
        });
        
        // Prepend promoted items to the normal items
        $finalCollection = collect();
        foreach ($promotedItems as $item) {
            $finalCollection->push($item);
        }
        foreach ($normalItems as $item) {
            $finalCollection->push($item);
        }
        
        $paginator->setCollection($finalCollection);
        
        return $paginator;
    }

    /**
     * Retrieve the best matching visual display banner ad for a specific slot.
     */
    public function getDisplayBanner(string $slot, Request $request): ?AdPlacement
    {
        // 100% Ad-Free experience for Connoisseur and Sovereign Elite members
        if ($this->isUserAdFree($request)) {
            return null;
        }

        $cityId = $request->input('city_id');
        $stateId = $request->input('state_id');

        $query = AdPlacement::active()
            ->forSlot($slot);

        if ($cityId && $cityId !== 'all') {
            $query->where(function ($q) use ($cityId) {
                $q->whereJsonContains('targeted_city_ids', (int)$cityId)
                  ->orWhereNull('targeted_city_ids');
            });
        }

        if ($stateId && $stateId !== 'all') {
            $query->where(function ($q) use ($stateId) {
                $q->whereJsonContains('targeted_state_ids', (int)$stateId)
                  ->orWhereNull('targeted_state_ids');
            });
        }

        $banners = $query->get();

        if ($banners->isEmpty()) {
            return null;
        }

        // Tier weighting: pick from top tier available
        foreach (['platinum', 'gold', 'silver', 'bronze', 'featured'] as $tier) {
            $tierBanners = $banners->where('tier', $tier);
            if ($tierBanners->isNotEmpty()) {
                return $tierBanners->random();
            }
        }

        return $banners->random();
    }
}

