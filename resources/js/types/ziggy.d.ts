/**
 * Type declaration for the global `route()` function.
 *
 * In `resources/js/bootstrap.ts`, `route` is imported from `ziggy-js` and
 * assigned to `globalThis.route` so components can call `route('name')`
 * without importing ziggy-js in every file. This type makes TypeScript
 * aware of the global.
 *
 * With `skip-route-function: true` in config/ziggy.php, the Blade @routes
 * directive no longer injects the inline route() function. Instead, the
 * function is provided by the ziggy-js npm package and assigned to
 * globalThis in bootstrap.ts. Route data (window.Ziggy) is fetched via
 * `/api/ziggy/public` before React renders.
 */
import { route as ziggyRoute } from 'ziggy-js';

declare global {
    /**
     * Resolve a named route to a URL.
     * @param name - The route name (e.g. 'home', 'marketplace.index')
     * @param params - Route parameters (optional)
     * @param absolute - Whether to return an absolute URL (default: true)
     */
    var route: typeof ziggyRoute;
}
