<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DirectoryProfile;
use App\Models\ProfileView;
use App\Models\AdPlacement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ProviderAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get all profile IDs for this user from directory_profiles
        $profiles = DirectoryProfile::where('user_id', $user->id)->get();
        $profileIds = $profiles->pluck('id')->toArray();
        
        // Define all possible morph types for directory profiles
        $profileTypes = [
            'vet', 'trainer', 'boarding', 'welfare', 'pet-shop', 'breeder',
            'App\Models\DirectoryProfile', 'App\Models\VetProfile', 'App\Models\TrainerProfile', 
            'App\Models\BoardingProfile', 'App\Models\WelfareProfile', 'App\Models\PetShopProfile', 'App\Models\BreederProfile'
        ];

        // 30 days ago
        $startDate = Carbon::now()->subDays(29)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        // Get views and clicks
        $viewsData = ProfileView::whereIn('viewable_id', $profileIds)
            ->whereIn('viewable_type', $profileTypes)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN interaction_type = "view" THEN 1 ELSE 0 END) as views'),
                DB::raw('SUM(CASE WHEN interaction_type = "phone_click" THEN 1 ELSE 0 END) as phone_clicks'),
                DB::raw('SUM(CASE WHEN interaction_type = "website_click" THEN 1 ELSE 0 END) as website_clicks'),
                DB::raw('SUM(CASE WHEN interaction_type = "booking_click" THEN 1 ELSE 0 END) as booking_clicks')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Prepare data for the chart (fill missing days)
        $chartData = [];
        $totalViews = 0;
        $totalPhoneClicks = 0;
        $totalWebsiteClicks = 0;
        $totalBookingClicks = 0;

        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays(29 - $i)->format('Y-m-d');
            $dataForDay = $viewsData->firstWhere('date', $date);
            
            $views = $dataForDay ? (int) $dataForDay->views : 0;
            $phoneClicks = $dataForDay ? (int) $dataForDay->phone_clicks : 0;
            $websiteClicks = $dataForDay ? (int) $dataForDay->website_clicks : 0;
            $bookingClicks = $dataForDay ? (int) $dataForDay->booking_clicks : 0;

            $chartData[] = [
                'date' => Carbon::parse($date)->format('M d'),
                'views' => $views,
                'phone_clicks' => $phoneClicks,
                'website_clicks' => $websiteClicks,
                'booking_clicks' => $bookingClicks,
            ];

            $totalViews += $views;
            $totalPhoneClicks += $phoneClicks;
            $totalWebsiteClicks += $websiteClicks;
            $totalBookingClicks += $bookingClicks;
        }

        // Calculate CTR
        $phoneCtr = $totalViews > 0 ? round(($totalPhoneClicks / $totalViews) * 100, 2) : 0;
        $websiteCtr = $totalViews > 0 ? round(($totalWebsiteClicks / $totalViews) * 100, 2) : 0;
        $bookingCtr = $totalViews > 0 ? round(($totalBookingClicks / $totalViews) * 100, 2) : 0;

        // Fetch Ad Placements for the profiles
        $ads = AdPlacement::whereIn('promotable_id', $profileIds)
            ->whereIn('promotable_type', $profileTypes)
            ->get();
        $totalSpend = $ads->sum('amount_collected');
        $activeAds = $ads->where('status', 'active')->count();

        // Calculate total views for profiles ONLY when they had an active ad
        $adViews = 0;
        foreach ($ads as $ad) {
            $adViews += ProfileView::where('viewable_id', $ad->promotable_id)
                ->whereIn('viewable_type', $profileTypes)
                ->whereBetween('created_at', [$ad->starts_at, $ad->ends_at])
                ->where('interaction_type', 'view')
                ->count();
        }

        return Inertia::render('dashboard/business/analytics', [
            'chartData' => $chartData,
            'stats' => [
                'totalViews' => $totalViews,
                'totalPhoneClicks' => $totalPhoneClicks,
                'totalWebsiteClicks' => $totalWebsiteClicks,
                'totalBookingClicks' => $totalBookingClicks,
                'phoneCtr' => $phoneCtr,
                'websiteCtr' => $websiteCtr,
                'bookingCtr' => $bookingCtr,
            ],
            'adStats' => [
                'totalSpend' => $totalSpend,
                'totalAdViews' => $adViews,
                'activeAds' => $activeAds
            ],
            'profiles' => $profiles->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name ?? $p->clinic_name ?? 'Profile',
                'type' => $p->type
            ])
        ]);
    }
}
