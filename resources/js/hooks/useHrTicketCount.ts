import { useEffect, useState } from 'react';

/**
 * Shared hook for the HR portal's assigned-ticket count.
 *
 * Subscribes to `App.Models.Admin.{adminId}` for the `TicketAssignedToHr`
 * event and returns a live-updating `count` and a boolean `isLive` that
 * indicates whether Pusher is connected.
 *
 * Eliminates the duplicate Echo subscription that previously existed
 * across HrLayout, Hr/Tickets/Index, and Hr/Dashboard — all three
 * now share a single listener per mount.
 *
 * @param adminId   The current admin's ID (used for the private channel).
 * @param initialCount The server-rendered count (from Inertia shared data).
 */
export function useHrTicketCount(
    adminId: number | undefined,
    initialCount: number,
): { count: number; isLive: boolean } {
    const [count, setCount] = useState(initialCount);
    const [isLive, setIsLive] = useState(false);

    // Keep the count in sync with Inertia page navigations
    useEffect(() => {
        setCount(initialCount);
    }, [initialCount]);

    // Subscribe to real-time assignment events
    useEffect(() => {
        if (!adminId) {
            setIsLive(false);
            return;
        }

        if (!window.Echo) {
            setIsLive(false);
            return;
        }

        setIsLive(true);

        const channel = window.Echo.private(`App.Models.Admin.${adminId}`);

        channel.listen('TicketAssignedToHr', (e: any) => {
            if (e.adminId === adminId && typeof e.count === 'number') {
                setCount(e.count);
            }
        });

        return () => {
            channel.stopListening('TicketAssignedToHr');
        };
    }, [adminId]);

    return { count, isLive };
}
