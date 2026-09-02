<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $admin = $request->user('admin');
        $subordinates = $admin->allSubordinates()->loadCount('onboardedProfiles')->values();

        return inertia('Agent/Team/Index', [
            'subordinates' => $subordinates,
        ]);
    }
}
