<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = auth('admin')->user();

        if (!$admin) {
            return redirect()->route('admin.login');
        }

        // Superadmin can access everything
        if ($admin->role === 'superadmin') {
            return $next($request);
        }

        // Non-admin roles should use their own portal
        if (!in_array($admin->role, config('roles.admin'))) {
            // Determine which portal this user belongs to and redirect.
            // Note: superadmin is excluded from these portal-redirect lists
            // because it's handled by the early return above.
            $hrRoles = array_diff(config('roles.hr'), ['superadmin']);
            $supportRoles = array_diff(config('roles.support'), ['superadmin']);
            $agentRoles = array_diff(config('roles.agent'), ['superadmin']);

            if (in_array($admin->role, $hrRoles)) {
                return redirect('/hr')->with('error', 'Please use the HR Portal.');
            }
            if (in_array($admin->role, $supportRoles)) {
                return redirect('/support')->with('error', 'Please use the Support Portal.');
            }
            if (in_array($admin->role, $agentRoles)) {
                return redirect('/agent')->with('error', 'Please use the Agent Portal.');
            }

            // Unknown role, log out
            auth('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('admin.login')->with('error', 'Unauthorized access.');
        }

        return $next($request);
    }
}
