/**
 * Permission helpers for admin role-based assignment UI.
 *
 * Maps each entity type (ticket, profile, payout) to the admin roles
 * that can assign/transfer it.  These lists MUST stay in sync with
 * the `config('roles.*')` arrays defined in config/roles.php.
 *
 * Use `can()` as a plain function when you already have the props,
 * or `useCan()` as a React hook that reads auth + eligibleTargets
 * from the Inertia page props automatically.
 *
 * @example
 * ```tsx
 * // Plain function (you pass eligibleTargets yourself)
 * {can('assign', 'ticket', eligibleTargets) && <TransferForm />}
 *
 * // Hook (reads auth.admin.role + eligibleTargets from page props)
 * const { canAssign } = useCan('assign', 'ticket');
 * {canAssign && <TransferForm />}
 * ```
 */

export type EntityType = 'ticket' | 'profile' | 'payout';

// ──────────────────────────────────────────────
// Role  →  Entity mapping
// ──────────────────────────────────────────────
// Keep in sync with config/roles.php

const ENTITY_ROLES: Record<EntityType, string[]> = {
    ticket: [
        'superadmin',
        'support_agent',
        'support_team_leader',
        'support_manager',
    ],
    profile: [
        'superadmin',
        'state_head',
        'district_head',
        'area_manager',
        'team_leader',
        'field_agent',
    ],
    payout: [
        'superadmin',
        'hr_director',
        'hr_manager',
        'hr_executive',
    ],
};

// ──────────────────────────────────────────────
// Plain function  —  use when you already have targets
// ──────────────────────────────────────────────

/**
 * Check whether an admin with the given role is permitted to assign
 * `entityType`, optionally verifying that eligible targets exist.
 *
 * @param role      The admin's role string (from auth.admin.role).
 * @param entityType The entity type to check.
 * @param eligibleTargets Optional — pass the array to also require at least one target.
 */
export function can(
    role: string | undefined | null,
    entityType: EntityType,
    eligibleTargets?: unknown[],
): boolean {
    if (!role) return false;

    const allowedRoles = ENTITY_ROLES[entityType];
    if (!allowedRoles.includes(role)) return false;

    // If targets were explicitly provided, require at least one
    if (Array.isArray(eligibleTargets)) {
        return eligibleTargets.length > 0;
    }

    return true;
}
