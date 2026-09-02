<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HrTeamController extends Controller
{
    public function index()
    {
        $admin = Auth::guard('admin')->user();
        $team = $admin->allSubordinates()->loadCount('subordinates')->values();

        return Inertia::render('Hr/Team/Index', [
            'team' => $team
        ]);
    }
}
