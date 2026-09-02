<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PortalAuthController extends Controller
{
    public function showHrLogin(): Response
    {
        return Inertia::render('Hr/Login');
    }

    public function hrLogin(Request $request)
    {
        return $this->processLogin($request, 'hr');
    }

    public function hrLogout(Request $request)
    {
        return $this->processLogout($request, 'hr');
    }

    public function showSupportLogin(): Response
    {
        return Inertia::render('Support/Login');
    }

    public function supportLogin(Request $request)
    {
        return $this->processLogin($request, 'support');
    }

    public function supportLogout(Request $request)
    {
        return $this->processLogout($request, 'support');
    }

    public function showAgentLogin(): Response
    {
        return Inertia::render('Agent/Login');
    }

    public function agentLogin(Request $request)
    {
        return $this->processLogin($request, 'agent');
    }

    public function agentLogout(Request $request)
    {
        return $this->processLogout($request, 'agent');
    }

    private function processLogin(Request $request, string $portal)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('admin')->attempt($credentials)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        $admin = Auth::guard('admin')->user();

        if (! $admin->is_active) {
            Auth::guard('admin')->logout();

            return back()->withErrors([
                'email' => 'Your account has been deactivated.',
            ])->onlyInput('email');
        }

        // Check correct role
        if ($portal === 'hr' && !in_array($admin->role, ['hr_director', 'hr_manager', 'hr_executive', 'superadmin'])) {
            Auth::guard('admin')->logout();
            return back()->withErrors(['email' => 'Unauthorized access. HR role required.']);
        }
        if ($portal === 'support' && !in_array($admin->role, ['support_manager', 'support_team_leader', 'support_agent', 'superadmin'])) {
            Auth::guard('admin')->logout();
            return back()->withErrors(['email' => 'Unauthorized access. Support role required.']);
        }
        if ($portal === 'agent' && !in_array($admin->role, ['state_head', 'district_head', 'area_manager', 'team_leader', 'field_agent', 'superadmin'])) {
            Auth::guard('admin')->logout();
            return back()->withErrors(['email' => 'Unauthorized access. Field Agent role required.']);
        }

        $request->session()->regenerate();

        return redirect()->intended("/{$portal}");
    }

    private function processLogout(Request $request, string $portal)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect("/{$portal}/login");
    }
}
