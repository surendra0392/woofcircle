<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LocationController
{
    public function search(Request $request)
    {
        $query = $request->input('q');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $searchQuery = explode(',', $query)[0];
        $searchQuery = trim($searchQuery);
        
        $cities = DB::table('cities')
            ->join('states', 'cities.state_id', '=', 'states.id')
            ->where('cities.name', 'like', '%' . $searchQuery . '%')
            ->select('cities.id', 'cities.name', 'states.name as state')
            ->take(10)
            ->get();
            
        return response()->json($cities);
    }
    
    public function set(Request $request)
    {
        if ($request->has('city_id')) {
            $city = DB::table('cities')->where('id', $request->input('city_id'))->first();
            if ($city) {
                session(['user_location' => [
                    'type' => 'city',
                    'city_id' => $city->id,
                    'name' => $city->name,
                ]]);
            }
        } elseif ($request->has('latitude') && $request->has('longitude')) {
            $lat = $request->input('latitude');
            $lng = $request->input('longitude');
            
            $name = null;
            try {
                $url = "https://nominatim.openstreetmap.org/reverse?format=json&lat={$lat}&lon={$lng}&zoom=14&addressdetails=1";
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'User-Agent' => 'WoofCircle/1.0 (contact@woofcircle.com)'
                ])->timeout(3)->get($url);
                
                if ($response->successful() && isset($response->json()['address'])) {
                    $addr = $response->json()['address'];
                    
                    $suburb = $addr['suburb'] ?? $addr['city_district'] ?? $addr['city'] ?? $addr['town'] ?? null;
                    if ($suburb) {
                        $suburb = preg_replace('/^Ward\s+\d+\s+/i', '', $suburb);
                        $suburb = trim($suburb);
                    }

                    $neighbourhood = $addr['neighbourhood'] ?? $addr['residential'] ?? null;
                    
                    if ($neighbourhood && $suburb && $neighbourhood !== $suburb) {
                        $name = $neighbourhood . ', ' . $suburb;
                    } else {
                        $name = $suburb;
                    }
                }
            } catch (\Exception $e) {
                // Ignore exception and fallback
            }

            if (!$name) {
                $closest = DB::table('cities')
                    ->selectRaw('*, ( 3959 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance', [$lat, $lng, $lat])
                    ->orderBy('distance')
                    ->first();
                $name = $closest ? $closest->name : 'My Location';
            }

            session(['user_location' => [
                'type' => 'coordinates',
                'latitude' => $lat,
                'longitude' => $lng,
                'name' => $name,
            ]]);
        }
        
        return back();
    }

    public function nearby(Request $request)
    {
        $userLocation = session('user_location');
        if (!$userLocation) {
            return response()->json([]);
        }

        $lat = null;
        $lng = null;

        if (isset($userLocation['latitude']) && isset($userLocation['longitude'])) {
            $lat = $userLocation['latitude'];
            $lng = $userLocation['longitude'];
        } elseif (isset($userLocation['city_id'])) {
            $city = DB::table('cities')->where('id', $userLocation['city_id'])->first();
            if ($city) {
                $lat = $city->latitude;
                $lng = $city->longitude;
            }
        }

        if (!$lat || !$lng) {
            return response()->json([]);
        }

        $nearby = DB::table('cities')
            ->join('states', 'cities.state_id', '=', 'states.id')
            ->selectRaw('cities.id, cities.name, states.name as state, ( 3959 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance', [$lat, $lng, $lat])
            ->where('cities.id', '!=', $userLocation['city_id'] ?? 0)
            ->orderBy('distance')
            ->take(6)
            ->get();

        return response()->json($nearby);
    }
}
