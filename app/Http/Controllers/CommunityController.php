<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function leaderboard()
    {
        $users = User::orderBy('karma_points', 'desc')
            ->take(50)
            ->get(['id', 'name', 'avatar', 'karma_points']);

        return Inertia::render('community/leaderboard', [
            'users' => $users,
        ]);
    }
}
