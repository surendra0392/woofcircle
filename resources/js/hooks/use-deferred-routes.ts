import { useEffect, useState } from 'react';

declare global {
    interface Window {
        Ziggy?: { routes: Record<string, unknown> };
    }
}

interface DeferredRouteState {
    loaded: boolean;
    error: Error | null;
}

/**
 * Fetches a named route group from the Ziggy API and merges its definitions
 * into `window.Ziggy.routes`. Used by dashboard and admin layouts to load
 * their route definitions on demand, deferring them from the initial bundle.
 *
 * Usage:
 *   const { loaded } = useDeferredRoutes('dashboard');
 *   if (!loaded) return <LoadingSkeleton />;
 */
export function useDeferredRoutes(group: string): DeferredRouteState {
    const [state, setState] = useState<DeferredRouteState>({ loaded: false, error: null });

    useEffect(() => {
        let cancelled = false;

        fetch(`/api/ziggy/${group}?v=v16`)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load ${group} routes: ${res.status}`);
                return res.json();
            })
            .then((data: { routes: Record<string, unknown> }) => {
                if (cancelled) return;
                if (data?.routes && window.Ziggy) {
                    Object.assign(window.Ziggy.routes, data.routes);
                }
                setState({ loaded: true, error: null });
            })
            .catch((err: Error) => {
                if (!cancelled) setState({ loaded: false, error: err });
            });

        return () => {
            cancelled = true;
        };
    }, [group]);

    return state;
}
