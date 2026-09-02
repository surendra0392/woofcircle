import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';

interface UseMessageNotificationsOptions {
    /** The authenticated user's ID. Subscribes to `App.Models.User.{id}`. */
    userId: number | string;
    /**
     * Given a conversation ID, return `true` if the user is already viewing
     * that conversation so the notification can be suppressed.
     */
    isViewingConversation: (conversationId: number | string) => boolean;
    /**
     * Called when the user clicks "View" on a toast notification.
     * Return the URL to navigate to.
     */
    getConversationUrl: (conversationId: number | string) => string;
    /**
     * A setter for the unread-message badge count shown in the sidebar.
     * Receives the new incremented count.
     */
    onUnreadCountChange?: Dispatch<SetStateAction<number>>;
}

/**
 * Subscribe to the `MessageSent` broadcast event on the authenticated user's
 * private Echo channel. When a new message arrives while the user is *not*
 * viewing that conversation, increment the unread badge and show a toast.
 *
 * Usage is identical in both admin-layout and dashboard-layout — only the
 * conversation-URL logic differs.
 */
export function useMessageNotifications({
    userId,
    isViewingConversation,
    getConversationUrl,
    onUnreadCountChange,
}: UseMessageNotificationsOptions): void {
    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !window.Echo) return;

        const channelName = `App.Models.User.${userId}`;

        window.Echo.private(channelName).listen('MessageSent', (e: any) => {
            const conversationId = e.message?.conversation_id;

            if (!conversationId || isViewingConversation(conversationId)) {
                return;
            }

            onUnreadCountChange?.(
                (prev: number) => (prev ?? 0) + 1,
            );

            toast.info(
                `New message from ${e.message?.sender?.name || 'Someone'}`,
                {
                    description: e.message?.body || 'Attachment sent',
                    action: {
                        label: 'View',
                        onClick: () => {
                            window.location.href = getConversationUrl(conversationId);
                        },
                    },
                },
            );
        });

        return () => {
            window.Echo?.leave(channelName);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
}
