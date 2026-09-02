<?php

use Illuminate\Support\Facades\Route;

/**
 * Ensures every route defined in a portal route file (support, hr, agent, admin)
 * resolves with the correct prefix applied by bootstrap/app.php.
 *
 * Each portal route file is loaded inside a group like:
 *   ->prefix('support')->name('support.')
 *
 * A route named 'dashboard' inside routes/support.php becomes 'support.dashboard'.
 * Calling it as route('dashboard') — missing the prefix — would throw a
 * Ziggy error or a 404 at runtime.
 *
 * This test iterates all registered routes, groups them by URL prefix,
 * and asserts that their computed names follow the expected convention.
 */
test('all portal route names start with their service-provider prefix', function () {
    $routes = Route::getRoutes();

    // Define the expected prefixes for each portal route file.
    // The URL prefix is set via ->prefix() in bootstrap/app.php and the
    // name prefix is set via ->name(). Both must be consistent.
    $portalConfig = [
        'support.' => [
            'urlPrefix' => 'support',
            'file' => 'routes/support.php',
            'note' => "Defined in bootstrap/app.php: ->prefix('support')->name('support.')->group(base_path('routes/support.php'))",
        ],
        'hr.' => [
            'urlPrefix' => 'hr',
            'file' => 'routes/hr.php',
            'note' => "Defined in bootstrap/app.php: ->prefix('hr')->name('hr.')->group(base_path('routes/hr.php'))",
        ],
        'agent.' => [
            'urlPrefix' => 'agent',
            'file' => 'routes/agent.php',
            'note' => "Defined in bootstrap/app.php: ->prefix('agent')->name('agent.')->group(base_path('routes/agent.php'))",
        ],
        'admin.' => [
            'urlPrefix' => 'admin',
            'file' => 'routes/admin.php',
            'note' => "Defined in bootstrap/app.php: ->prefix('admin')->name('admin.')->group(base_path('routes/admin.php'))",
        ],
    ];

    $errors = [];

    foreach ($routes as $route) {
        $uri = $route->uri();
        $name = $route->getName();

        // Skip routes without names (they can't be used with route() anyway)
        if ($name === null) {
            continue;
        }

        foreach ($portalConfig as $expectedNamePrefix => $config) {
            $urlPrefix = $config['urlPrefix'];

            // Check if this route's URI starts with the portal URL prefix
            if (str_starts_with($uri, $urlPrefix . '/') || $uri === $urlPrefix) {
                // This is a portal route — it MUST have a name starting with the expected prefix
                if (!str_starts_with($name, $expectedNamePrefix)) {
                    $errors[] = sprintf(
                        "[MISSING PREFIX] Route '%s' (URI: /%s) belongs to the %s portal but its name does not start with '%s'.\n"
                        . "  Expected full name: %s\n"
                        . "  Fix: Add ->name('%s...') in %s, or change route() calls to use route('%s...').\n"
                        . "  %s",
                        $name,
                        $uri,
                        $config['file'],
                        $expectedNamePrefix,
                        $expectedNamePrefix . $name,
                        $expectedNamePrefix,
                        $config['file'],
                        $expectedNamePrefix,
                        $config['note']
                    );
                }

                // Sanity check: ensure the name doesn't have a doubled prefix
                // e.g. 'support.support.dashboard' — this would mean the prefix was
                // already present in the route file's ->name() call
                if (str_starts_with($name, $expectedNamePrefix . $expectedNamePrefix)) {
                    $errors[] = sprintf(
                        "[DOUBLED PREFIX] Route '%s' (URI: /%s) has a doubled prefix '%s%s'.\n"
                        . "  The ->name('%s...') call in %s is redundant — the service provider\n"
                        . "  already adds the '%s' prefix. Use ->name('%s') instead.\n"
                        . "  Correct full name would be: %s",
                        $name,
                        $uri,
                        $expectedNamePrefix,
                        $expectedNamePrefix,
                        $expectedNamePrefix,
                        $config['file'],
                        $expectedNamePrefix,
                        substr($name, strlen($expectedNamePrefix)),
                        $name
                    );
                }

                // Once matched, move to the next route
                continue 2;
            }
        }

        // Check for routes whose names start with a portal prefix
        // but whose URIs are outside the portal URL namespace
        foreach ($portalConfig as $expectedNamePrefix => $config) {
            $urlPrefix = $config['urlPrefix'];
            if (str_starts_with($name, $expectedNamePrefix) &&
                !str_starts_with($uri, $urlPrefix . '/') &&
                $uri !== $urlPrefix) {
                $errors[] = sprintf(
                    "[WRONG LOCATION] Route name '%s' starts with '%s' but URI '/%s' is outside the %s URL prefix.\n"
                    . "  Either: (a) move the route definition into %s, or\n"
                    . "  (b) rename it so it doesn't use the '%s' prefix.\n"
                    . "  %s",
                    $name,
                    $expectedNamePrefix,
                    $uri,
                    $config['urlPrefix'],
                    $config['file'],
                    $expectedNamePrefix,
                    $config['note']
                );
            }
        }
    }

    // Also validate the login/logout routes defined in web.php
    // These use the portal prefix but are defined at the top level of web.php
    $webPortalRoutes = [
        'hr.login' => '/hr/login',
        'hr.logout' => 'hr/logout',  // POST route
        'agent.login' => '/agent/login',
        'agent.logout' => 'agent/logout',
        'support.login' => '/support/login',
        'support.logout' => 'support/logout',
    ];

    foreach ($webPortalRoutes as $expectedName => $expectedUri) {
        $matched = false;
        foreach ($routes as $route) {
            if ($route->getName() === $expectedName) {
                $matched = true;
                break;
            }
        }
        if (!$matched) {
            $errors[] = sprintf(
                "[MISSING PORTAL LOGIN] Expected route '%s' (URI: %s) was not found.\n"
                . "  This route is defined in routes/web.php and should map to\n"
                . "  App\\Http\\Controllers\\Admin\\PortalAuthController.",
                $expectedName,
                $expectedUri
            );
        }
    }

    // If any errors were found, fail the test with a clear message
    if (!empty($errors)) {
        $message = "Route name prefix validation failed:\n\n" . implode("\n\n", $errors);
        test()->fail($message);
    }

    // If we got here, all portal routes have correct prefixes
    // Count them for informative output
    $portalCount = 0;
    $webCount = 0;
    foreach ($routes as $route) {
        $name = $route->getName();
        if ($name === null) continue;
        foreach ($portalConfig as $expectedNamePrefix => $_) {
            if (str_starts_with($name, $expectedNamePrefix)) {
                $portalCount++;
                continue 2;
            }
        }
        if (isset($webPortalRoutes[$name])) {
            $webCount++;
        }
    }

    expect(true)->toBeTrue(
        sprintf(
            'All %d portal route names validated correctly (%d in portal files + %d in web.php).',
            $portalCount + $webCount,
            $portalCount,
            $webCount
        )
    );
});

/**
 * Edge case: routes with no name at all should exist only in routes/web.php
 * (unnamed POST routes for login forms are acceptable there).
 * Portal route files should never have unnamed routes because they can't
 * be referenced via route() in the frontend.
 *
 * Note: 'admin.login' POST is intentionally unnamed (the GET is named),
 * so we make an exception for that.
 */
test('all portal routes have a name', function () {
    $routes = Route::getRoutes();
    $unnamedPortalRoutes = [];

    foreach ($routes as $route) {
        $uri = $route->uri();
        $name = $route->getName();

        if ($name !== null) {
            continue;
        }

        // Check if this is a portal route (matches any portal URL prefix)
        $portalPrefixes = ['support', 'hr', 'agent', 'admin'];
        foreach ($portalPrefixes as $prefix) {
            if (str_starts_with($uri, $prefix . '/') || $uri === $prefix) {
                // Routes intentionally without names:
                // - admin.login POST (the GET variant carries the name)
                // - hr/agent/support login POST (same reason)
                // - admin root redirect (just a redirect to admin.dashboard, no route() call needed)
                $unnamedExceptions = ['admin/login', 'admin', 'hr/login', 'agent/login', 'support/login'];
                if (in_array($uri, $unnamedExceptions, true)) {
                    continue 2;
                }

                $unnamedPortalRoutes[] = sprintf(
                    "Route with URI '/%s' has no name. Add ->name('...') to its definition so it can be used with route().",
                    $uri
                );
                continue 2;
            }
        }
    }

    if (!empty($unnamedPortalRoutes)) {
        test()->fail(
            "Portal routes without names found:\n\n" . implode("\n\n", $unnamedPortalRoutes)
        );
    }

    expect($unnamedPortalRoutes)->toBeEmpty('All portal routes have a name.');
});
