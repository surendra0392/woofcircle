<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait MarketplaceFilters
{
    protected function applyMarketplaceFilters($query, Request $request, string $titleField = 'title')
    {
        if ($request->filled('breed_id') && $request->breed_id !== 'all') {
            $query->where('breed_id', $request->breed_id);
        }
        if ($request->filled('state_id') && $request->state_id !== 'all') {
            $query->where('state_id', $request->state_id);
        }
        if ($request->filled('city_id') && $request->city_id !== 'all') {
            $query->where('city_id', $request->city_id);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request, $titleField) {
                $q->where($titleField, 'like', '%' . $request->search . '%')
                    ->orWhereHas('state', function ($sq) use ($request) {
                        $sq->where('name', 'like', '%' . $request->search . '%');
                    })
                    ->orWhereHas('city', function ($cq) use ($request) {
                        $cq->where('name', 'like', '%' . $request->search . '%');
                    });
                
                if ($titleField === 'title') {
                    $q->orWhereHas('breed', function ($bq) use ($request) {
                        $bq->where('name', 'like', '%' . $request->search . '%');
                    });
                }
            });
        }
        if ($request->boolean('kci_registered')) {
            $query->where('kci_registered', true);
        }
        if ($request->boolean('is_champion')) {
            $query->where('is_champion', true);
        }

        return $query;
    }
}
