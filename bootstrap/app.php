<?php

use App\Http\Middleware\HandleAdminInertiaRequests;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LogActions;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function () {
            Route::middleware([
                'web',
                LogActions::class,
                HandleAdminInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
            ])
                ->withoutMiddleware([
                    HandleInertiaRequests::class,
                ])
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));


            Route::middleware([
                'web',
                'auth:admin',
                \App\Http\Middleware\CheckFieldAgent::class,
                LogActions::class,
                HandleAdminInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
            ])
                ->withoutMiddleware([
                    HandleInertiaRequests::class,
                ])
        ->prefix('agent')
                ->name('agent.')
                ->group(base_path('routes/agent.php'));

            Route::middleware([
                'web',
                'auth:admin',
                \App\Http\Middleware\CheckSupportAgent::class,
                LogActions::class,
                HandleAdminInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
            ])
                ->withoutMiddleware([
                    HandleInertiaRequests::class,
                ])
                ->prefix('support')
                ->name('support.')
                ->group(base_path('routes/support.php'));
            Route::middleware([
                'web',
                'auth:admin',
                \App\Http\Middleware\CheckHr::class,
                LogActions::class,
                HandleAdminInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
            ])
                ->withoutMiddleware([
                    HandleInertiaRequests::class,
                ])
                ->prefix('hr')
                ->name('hr.')
                ->group(base_path('routes/hr.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('admin') || $request->is('admin/*')) {
                return route('admin.login');
            }
            if ($request->is('agent') || $request->is('agent/*')) {
                return url('/agent/login');
            }
            if ($request->is('support') || $request->is('support/*')) {
                return url('/support/login');
            }
            if ($request->is('hr') || $request->is('hr/*')) {
                return url('/hr/login');
            }

            return $request->expectsJson() ? null : route('login');
        });


        $middleware->validateCsrfTokens(except: [
            '/api/location/set',
        ]);

        $middleware->web(append: [
            LogActions::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom exception handling is defined in App\Exceptions\Handler
    })->create();
