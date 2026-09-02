<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $topKarma = User::where('is_active', true)
            ->orderByDesc('karma_points')
            ->take(20)
            ->get(['id', 'first_name', 'last_name', 'avatar', 'karma_points']);

        $topStreaks = User::where('is_active', true)
            ->orderByDesc('highest_login_streak')
            ->take(20)
            ->get(['id', 'first_name', 'last_name', 'avatar', 'highest_login_streak']);

        return Inertia::render('Community/Leaderboard/Index', [
            'topKarma' => $topKarma,
            'topStreaks' => $topStreaks,
        ]);
    }
}
