import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useForm } from '@inertiajs/react';
import { Bell, Calendar, Check, Info, Syringe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
    id: number;
    type: 'vaccination_due' | 'appointment_upcoming' | 'system';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { post } = useForm();

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/notifications/latest');
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 2 minutes
        const interval = setInterval(fetchNotifications, 120000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = (id: number) => {
        post(route('notifications.read', id), {
            preserveScroll: true,
            onSuccess: () => fetchNotifications(),
        });
    };

    const markAllAsRead = () => {
        post(route('notifications.read-all'), {
            preserveScroll: true,
            onSuccess: () => fetchNotifications(),
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'vaccination_due':
                return <Syringe className="text-woof-gold h-4 w-4" />;
            case 'appointment_upcoming':
                return <Calendar className="h-4 w-4 text-green-500" />;
            default:
                return <Info className="text-woof-gold h-4 w-4" />;
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const diffInSeconds = Math.floor((new Date(dateString).getTime() - Date.now()) / 1000);
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'narrow' });
        
        if (Math.abs(diffInSeconds) < 60) return 'just now';
        if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.round(diffInSeconds / 60), 'minute');
        if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
        return rtf.format(Math.round(diffInSeconds / 86400), 'day');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="group relative h-9 w-9 cursor-pointer">
                    <Bell className="!size-5 opacity-80 transition-opacity group-hover:opacity-100" />
                    {unreadCount > 0 && (
                        <span className="animate-in fade-in zoom-in absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-none bg-red-500 text-[10px] font-medium text-white ring-2 ring-white duration-300">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 overflow-hidden p-0" align="end">
                <div className="flex items-center justify-between border-b p-4">
                    <DropdownMenuLabel className="p-0 font-bold">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-woof-gold flex items-center gap-1 text-xs font-medium transition-colors hover:text-blue-700"
                        >
                            <Check className="h-3 w-3" /> Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex cursor-pointer flex-col items-start gap-1 border-b p-4 last:border-0 ${
                                    !notification.is_read ? 'bg-woof-gold/10/50' : ''
                                }`}
                                onClick={() => !notification.is_read && markAsRead(notification.id)}
                            >
                                <div className="flex w-full items-center gap-2">
                                    {getIcon(notification.type)}
                                    <span className={`truncate text-sm font-semibold ${!notification.is_read ? 'text-blue-900' : ''}`}>
                                        {notification.title}
                                    </span>
                                    <span className="ml-auto text-[10px] whitespace-nowrap text-neutral-500">
                                        {formatRelativeTime(notification.created_at)}
                                    </span>
                                </div>
                                <p className="line-clamp-2 pl-6 text-xs text-neutral-600">{notification.message}</p>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-neutral-500">
                            <Bell className="h-8 w-8 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    )}
                </div>
                <DropdownMenuSeparator className="m-0" />
                <Link
                    href={route('notifications.index')}
                    className="text-woof-gold flex w-full items-center justify-center p-3 text-sm font-medium transition-colors hover:bg-neutral-50"
                >
                    View all notifications
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
