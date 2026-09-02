/**
 * Static application configuration constants.
 *
 * Separated from bootstrap.ts so runtime init (route fetch, Echo setup, admin
 * theme) and static config (progress bar color, feature flags, defaults) live
 * in distinct files — easier to test and reason about independently.
 */

/**
 * Inertia page-navigation progress bar configuration.
 *
 * The woof-gold (#bb8b62) accent matches the brand palette defined in
 * resources/css/app.css. This value is read-only and safe to import from
 * any module without triggering bootstrap.ts's top-level await.
 *
 * @see resources/js/bootstrap.ts
 * @see resources/css/app.css --brand-palette
 */
export const inertiaProgress = { color: '#bb8b62' } as const;
