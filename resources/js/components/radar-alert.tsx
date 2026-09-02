
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SharedData } from '@/types';

interface RadarAlertNotification {
    id: string;
    type: string;
    pet_id: number;
    message: string;
    url: string;
}

export function RadarAlert() {
    const { auth } = usePage<SharedData>().props;
    const [alert, setAlert] = useState<RadarAlertNotification | null>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Fetch from existing unread notifications first
        const fetchInitial = async () => {
            try {
                const response = await fetch('/notifications/latest');
                const data = await response.json();
                const radarNotification = data.notifications?.find(
                    (n: any) => n.type === 'App\\Notifications\\LostPetAlertNotification' && !n.is_read
                );
                
                if (radarNotification) {
                    setAlert({
                        id: radarNotification.id,
                        type: radarNotification.type,
                        pet_id: radarNotification.data?.pet_id || radarNotification.pet_id,
                        message: radarNotification.data?.message || radarNotification.message,
                        url: radarNotification.data?.url || radarNotification.url || route('lost-pets.index'),
                    });
                    setShow(true);
                }
            } catch (error) {
                console.error('Failed to fetch radar alerts', error);
            }
        };

        if (auth.user) {
            fetchInitial();

            // Listen for broadcasts if Echo is configured
            if (window.Echo) {
                window.Echo.private(`App.Models.User.${auth.user.id}`)
                    .notification((notification: any) => {
                        if (notification.type === 'App\\Notifications\\LostPetAlertNotification' || notification.type === 'radar_alert') {
                            setAlert({
                                id: notification.id,
                                type: notification.type,
                                pet_id: notification.pet_id,
                                message: notification.message,
                                url: notification.url || route('lost-pets.index'),
                            });
                            setShow(true);
                        }
                    });
            }
        }
        
        return () => {
            if (window.Echo && auth.user) {
                window.Echo.leave(`App.Models.User.${auth.user.id}`);
            }
        };
    }, [auth.user]);

    const handleClose = () => {
        setShow(false);
        if (alert?.id) {
            fetch(route('notifications.read', alert.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });
        }
    };

    if (!show || !alert) return null;

    return (
        <div className="absolute top-16 left-0 right-0 z-50 flex justify-center px-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-red-500 text-white w-full max-w-2xl px-6 py-3 flex items-center justify-between shadow-xl ring-1 ring-red-600/50">
                <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 animate-pulse" />
                    <div>
                        <p className="font-bold text-sm uppercase tracking-widest">{alert.message}</p>
                        <Link href={alert.url} className="text-xs font-black underline hover:text-red-100 transition-colors">
                            VIEW DETAILS
                        </Link>
                    </div>
                </div>
                <button onClick={handleClose} className="p-1 hover:bg-red-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
