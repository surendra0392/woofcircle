import '../css/app.css';
import { route as routeFn } from 'ziggy-js';

/**
 * Resilient route() wrapper to prevent crashes when route definitions
 * are still being hydrated or temporarily missing from a group.
 */
const safeRoute: typeof routeFn = ((name?: any, params?: any, absolute?: any, config?: any) => {
    try {
        return (routeFn as any)(name, params, absolute, config);
    } catch (err) {
        if (name && typeof name === 'string') {
            console.warn(`[Ziggy] Route "${name}" not found in current route list, falling back to path.`, err);
            const path = `/${name.replace(/\./g, '/')}`;
            if (params && typeof params === 'object') {
                const query = new URLSearchParams();
                for (const [k, v] of Object.entries(params)) {
                    if (v !== undefined && v !== null) query.append(k, String(v));
                }
                const queryString = query.toString();
                return queryString ? `${path}?${queryString}` : path;
            }
            return path;
        }
        return (routeFn as any)(name, params, absolute, config);
    }
}) as typeof routeFn;

Object.setPrototypeOf(safeRoute, routeFn);
Object.assign(safeRoute, routeFn);

globalThis.route = safeRoute;

// Only load Echo when Pusher credentials are configured — avoids browser
// warnings and keeps pusher-js off the critical path for most visitors.
if (import.meta.env.VITE_PUSHER_APP_KEY) {
    import('./echo').catch(() => {});
}

/** Session-storage key under which route definitions are cached. */
const CACHE_KEY = 'ziggy_routes_v16_public';

/**
 * Fetch public route definitions and populate window.Ziggy.
 */
async function initRoutes(): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    // Clean up any obsolete ziggy cache keys from previous versions
    try {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('ziggy_routes_') && key !== CACHE_KEY) {
                sessionStorage.removeItem(key);
            }
        }
    } catch {}

    if ((window as unknown as Record<string, unknown>).Ziggy) {
        return;
    }

    // Attempt to restore from session cache — instant on repeat visits.
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.routes && Object.keys(parsed.routes).length > 0) {
                (window as unknown as Record<string, unknown>).Ziggy = parsed;
                return;
            }
        }
    } catch {
        // sessionStorage may be unavailable (private browsing, storage full).
    }

    try {
        const res = await fetch(`/api/ziggy/public?v=${CACHE_KEY}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch public routes: ${res.status}`);
        }
        const data = await res.json();

        // Persist for the remainder of this tab session.
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {}

        (window as unknown as Record<string, unknown>).Ziggy = data;
    } catch (err) {
        console.error('[bootstrap] Failed to load route definitions:', err);
        // Provide a minimal fallback so the app doesn't crash entirely.
        (window as unknown as Record<string, unknown>).Ziggy = { url: '', port: null, defaults: [], routes: {} };
    }
}

await initRoutes();

/**
 * Initialize the admin theme by adding a CSS class to <html>.
 *
 * Designed to be used as the return value of a useEffect so the
 * layout component gets proper mount/unmount behavior:
 *
 *   useEffect(() => initAdminTheme(), []);
 *
 * Returns a cleanup function that removes the class when the
 * component unmounts or the effect re-runs.
 */
export function initAdminTheme(): () => void {
    if (typeof document === 'undefined') {
        return () => {};
    }
    document.documentElement.classList.remove('admin-theme', 'dark');
    return () => {};
}
