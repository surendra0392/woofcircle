<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAdmin
{
    /**
     * Redirect to admin dashboard if already authenticated as admin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::guard('admin')->check()) {
            $admin = Auth::guard('admin')->user();
            if (in_array($admin->role, config('roles.support'))) {
                return redirect('/support/dashboard');
            } elseif (in_array($admin->role, config('roles.hr'))) {
                return redirect('/hr/dashboard');
            } elseif (in_array($admin->role, config('roles.agent'))) {
                return redirect('/agent/dashboard');
            }
            return redirect('/admin/dashboard');
        }

        return $next($request);
    }
}
