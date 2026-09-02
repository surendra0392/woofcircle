import { formatDate, timeAgo } from '@/lib/time';

type RelativeTimeProps = {
    /** Date string to display */
    date: string;
    /** Optional className forwarded to the span */
    className?: string;
    /**
     * Display mode:
     * - `"relative"` (default): shows "5m ago" visibly, absolute date on hover
     * - `"absolute"`: shows "Jul 28, 2026, 2:30 PM" visibly, relative time on hover
     */
    format?: 'relative' | 'absolute';
};

/**
 * Renders a timestamp with a native HTML tooltip showing the opposite format.
 * Default (`format="relative"`) shows relative time (e.g. "2h ago") with
 * absolute date on hover. `format="absolute"` shows the absolute date with
 * relative time on hover.
 *
 * Uses the shared `timeAgo` and `formatDate` helpers from `@/lib/time`.
 *
 * @example
 * ```tsx
 * <RelativeTime date={ticket.created_at} />
 * <RelativeTime date={ticket.created_at} format="absolute" />
 * <RelativeTime date={ticket.updated_at} className="text-xs text-gray-500" format="absolute" />
 * ```
 */
export function RelativeTime({ date, className, format = 'relative' }: RelativeTimeProps) {
    const isRelative = format === 'relative';
    return (
        <span className={className} title={isRelative ? formatDate(date) : timeAgo(date)}>
            {isRelative ? timeAgo(date) : formatDate(date)}
        </span>
    );
}
