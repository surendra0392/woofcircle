import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Bell, Calendar, Check, Info, Syringe, CheckCheck } from 'lucide-react';

interface Notification {
    id: number;
    type: 'vaccination_due' | 'appointment_upcoming' | 'system';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface Props {
    notifications: { data: Notification[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/dashboard/notifications' },
];

export default function Notifications({ notifications }: Props) {
    const { post } = useForm();
    
    const markAsRead = (id: number) => {
        post(route('notifications.read', id), { preserveScroll: true });
    };
    
    const markAllAsRead = () => {
        post(route('notifications.read-all'), { preserveScroll: true });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'vaccination_due':
                return <Syringe className="text-woof-gold h-5 w-5" />;
            case 'appointment_upcoming':
                return <Calendar className="text-woof-gold h-5 w-5" />;
            default:
                return <Info className="text-woof-gold h-5 w-5" />;
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const unreadCount = notifications.data.filter((n) => !n.is_read).length;

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Notifications"
            subtitle="Stay updated with your pet care reminders and account activity"
            actions={
                unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        className="border-[#e8ded1] bg-white hover:bg-woof-charcoal hover:text-white text-woof-charcoal rounded-full px-5 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                        <CheckCheck className="mr-2 h-4 w-4 text-woof-gold" /> Mark all as read
                    </Button>
                )
            }
        >
            <Head title="Notifications" />

            <div className="flex w-full flex-col gap-6">
                <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                    {notifications.data.length > 0 ? (
                        <div className="divide-y divide-[#e8ded1]">
                            {notifications.data.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-5 sm:p-6 transition-all duration-200 hover:bg-[#fcfbf9] ${
                                        !notification.is_read ? 'bg-woof-gold/[0.04]' : ''
                                    }`}
                                >
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                                            !notification.is_read
                                                ? 'border-woof-gold/30 bg-woof-gold/15 text-woof-gold shadow-2xs'
                                                : 'border-[#e8ded1] text-woof-charcoal/40 bg-[#fcfbf9]'
                                        }`}
                                    >
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <h3
                                                    className={`text-xs font-bold transition-colors ${
                                                        !notification.is_read ? 'text-woof-charcoal font-black' : 'text-woof-charcoal/70'
                                                    }`}
                                                >
                                                    {notification.title}
                                                </h3>
                                                <p className="text-woof-charcoal/70 text-xs leading-relaxed">{notification.message}</p>
                                            </div>
                                            <span className="bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal/50 px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap">
                                                {formatRelativeTime(notification.created_at)}
                                            </span>
                                        </div>

                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-woof-gold hover:text-woof-charcoal inline-flex items-center gap-1.5 pt-1 text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold shadow-2xs">
                                <Bell className="h-7 w-7 text-woof-gold/40" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-woof-charcoal text-sm font-bold">All Caught Up</p>
                                <p className="text-woof-charcoal/60 text-xs">
                                    You have no new notifications or unread alerts.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
