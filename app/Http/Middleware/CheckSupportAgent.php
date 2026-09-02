<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSupportAgent
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = auth('admin')->user();

        if (!$admin || !in_array($admin->role, config('roles.support'))) {
            // If logged in but wrong role, log them out and redirect to Support login
            if ($admin) {
                auth('admin')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            return redirect('/support/login')->with('error', 'Please log in with a Support account.');
        }

        return $next($request);
    }
}
