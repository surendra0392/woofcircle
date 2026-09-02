import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import { inertiaProgress } from './config';

/**
 * Application-wide Inertia configuration.
 *
 * Extracted from app.tsx so the entry point is a single call:
 *
 *   createInertiaApp(inertiaConfig)
 *
 * This keeps the config testable and the entry point focused on
 * bootstrapping (runtime init + Inertia render).
 *
 * @see resources/js/app.tsx
 */
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export const inertiaConfig = {
    title: (title: string) => `${title} - ${appName}`,
    resolve: (name: string) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')) as Promise<any>,
    setup({ el, App, props }: { el: Element; App: any; props: any }) {
        if (!el) return;
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: inertiaProgress,
};
