<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFieldAgent
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = auth('admin')->user();

        if (!$admin || !in_array($admin->role, config('roles.agent'))) {
            // If logged in but wrong role, log them out and redirect to Agent login
            if ($admin) {
                auth('admin')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            return redirect('/agent/login')->with('error', 'Please log in with a Field Agent account.');
        }

        return $next($request);
    }
}
