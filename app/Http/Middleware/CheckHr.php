<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckHr
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = auth('admin')->user();

        if (!$admin || !in_array($admin->role, config('roles.hr'))) {
            // If logged in but wrong role, log them out and redirect to HR login
            if ($admin) {
                auth('admin')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            return redirect('/hr/login')->with('error', 'Please log in with an HR account.');
        }

        return $next($request);
    }
}
