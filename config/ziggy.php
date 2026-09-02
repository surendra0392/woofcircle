<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Skip Route Function
    |--------------------------------------------------------------------------
    |
    | When true, the `@routes` Blade directive won't inject the inline route()
    | JavaScript function. The function comes from the `ziggy-js` npm package
    | and is assigned to `globalThis.route` in `resources/js/bootstrap.ts`.
    |
    | The `skip-route-function: true` setting keeps the inline JS snippet out
    | of the HTML entirely — the route() function is provided by the JS bundle,
    | and route data (window.Ziggy) is fetched via the `/api/ziggy/{group}`
    | endpoint rather than injected via Blade.
    |
    | @see resources/js/bootstrap.ts
    |
    */
    'skip-route-function' => true,

    /*
    |--------------------------------------------------------------------------
    | Route Groups
    |--------------------------------------------------------------------------
    |
    | Named groups for on-demand loading via the `/api/ziggy/{group}` endpoint.
    |
    | The **public** group is fetched on every page load by `initRoutes()` in
    | `resources/js/bootstrap.ts` (top-level await before React renders). It
    | replaces the old `@routes('public')` Blade injection — route data is now
    | delivered via a fetch to `/api/ziggy/public` instead of embedded in the
    | HTML `<head>`.
    |
    | The **dashboard** group is fetched by `useDeferredRoutes('dashboard')`
    | when the dashboard layout mounts in `dashboard-layout.tsx`.
    |
    | The **admin** group is fetched by `useDeferredRoutes('admin')` when the
    | admin layout mounts in `admin-layout.tsx`.
    |
    | Groups are additive: dashboard merges into the existing public routes,
    | and admin merges into everything. Only the *additional* routes beyond
    | what the visitor already has are listed here.
    |
    | @see resources/js/bootstrap.ts::initRoutes()
    | @see resources/js/hooks/use-deferred-routes.ts
    |
    */
    'groups' => [
        'public' => [
            'home',
            'about',
            'help-center',
            'privacy-policy',
            'terms-and-ethics',
            'careers',
            'careers.apply',
            'contact',
            'contact.store',
            'breeds.*',
            'marketplace.*',
            'directory.*',
            'community.*',
            'reviews.index',
            'reviews.store',
            'register',
            'login',
            'password.*',
            'verification.*',
            'logout',
            'api.*',
            'storage.*',
            'save-item.toggle',
            'pets.*',
            'admin.*',
            'forum.*',
            'subscription.*',
            'lost-pets.*',
            'newsletter.*',
            'hr.*',
            'agent.*',
            'support.*',
            'dashboard',
            'profile.*',
            'breeder.*',
        ],

        'dashboard' => [
            'dashboard',
            'dashboard.*',
            'chat.*',
            'breeder.*',
            'trainer.*',
            'vet.*',
            'boarding.*',
            'welfare.*',
            'pet-shop.*',
            'pets.*',
            'notifications.*',
            'reviews.update',
            'reviews.destroy',
            'help-center.tickets.*',
            'profile.*',
            'password.edit',
            'password.update',
            'marketplace.litters.convert',
            'marketplace.litters.request-transfer',
            'marketplace.adoption.express-interest',
            'marketplace.studs.book-consultation',
            'breeder.litters.transfer-requests.*',
        ],

        'admin' => [
            'admin.*',
        ],
    ],
];
