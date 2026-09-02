/**
 * Format a date string into a human-readable absolute timestamp.
 * Example: "Jul 28, 2026, 2:30 PM"
 */
export function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(dateString));
}

/**
 * Format a date string into a date-only format (no time).
 * Example: "Jul 28, 2026"
 */
export function formatDateShort(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(dateString));
}

/**
 * Format a date string into a human-readable relative timestamp.
 * Shows relative time (just now, Nm ago, Nh ago, Nd ago) and
 * falls back to `formatDate` for dates older than 30 days.
 *
 * Examples: "just now", "5m ago", "3h ago", "2d ago", "Jul 1, 2026"
 */
export function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
}

/**
 * Alias for `timeAgo`. Returns the same relative timestamp.
 * Provided so every display mode has a parallel named export:
 * `formatDate` (absolute), `formatDateShort` (date-only), `formatRelative` (relative).
 *
 * Examples: "just now", "5m ago", "3h ago", "2d ago", "Jul 1, 2026"
 */
export function formatRelative(dateString: string): string {
    return timeAgo(dateString);
}
