import { useEffect, useState } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const MOBILE_BREAKPOINT = 640;  // Tailwind's 'sm'
const TABLET_BREAKPOINT = 1024; // Tailwind's 'lg'

/**
 * Reactive hook that returns the current viewport breakpoint.
 * Re-renders the component when the window crosses a breakpoint threshold.
 *
 * Breakpoints align with Tailwind's default breakpoint scale:
 * - `'mobile'`  (≤ sm):   < 640px
 * - `'tablet'`  (≤ lg):   640px – 1023px
 * - `'desktop'` (≥ lg):   ≥ 1024px
 *
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint();
 * const showBottomNav = breakpoint === 'mobile' || breakpoint === 'tablet';
 * ```
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
        // SSG / SSR guard — default to 'desktop' when window is unavailable
        if (typeof window === 'undefined') return 'desktop';
        return getBreakpoint(window.innerWidth);
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onResize = () => setBreakpoint(getBreakpoint(window.innerWidth));

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return breakpoint;
}

function getBreakpoint(width: number): Breakpoint {
    if (width < MOBILE_BREAKPOINT) return 'mobile';
    if (width < TABLET_BREAKPOINT) return 'tablet';
    return 'desktop';
}
