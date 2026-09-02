import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

/**
 * A drop-in replacement for `useState` that persists the value to
 * `sessionStorage`.  The stored value survives Inertia page navigations
 * within the same tab session but is cleared when the tab is closed.
 *
 * @param key    Storage key (scoped by component, e.g. `'admin_sidebar_group_marketplace'`)
 * @param defaultValue  Fallback when no stored value exists (or a lazy initializer)
 *
 * @returns `[value, setValue]` — identical API to `useState`
 *
 * @example
 * ```ts
 * const [open, setOpen] = usePersistedState('admin_sidebar_group_marketplace', true);
 * ```
 *
 * @example
 * ```ts
 * const [count, setCount] = usePersistedState('dashboard_scroll_position', 0);
 * ```
 */
export function usePersistedState<T>(
    key: string,
    defaultValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
        }
        try {
            const stored = sessionStorage.getItem(key);
            if (stored !== null) {
                return JSON.parse(stored) as T;
            }
        } catch {
            // Stored value is corrupt or unparseable — fall through to default
        }
        return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
    });

    // Persist to sessionStorage whenever the value changes.
    // Stale closures are avoided via the functional form of setValue.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch {
            // sessionStorage may be full or disabled — silently ignore
        }
    }, [key, value]);

    return [value, setValue];
}
