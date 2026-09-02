import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export function PushNotificationToggle() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if service workers and push messaging are supported
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        } else {
            setIsLoading(false);
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Error checking subscription:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const urlB64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribe = async () => {
        setIsLoading(true);
        try {
            const permission = await Notification.requestPermission();
            
            if (permission !== 'granted') {
                toast.error('Notification permission denied.');
                setIsLoading(false);
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const applicationServerKey = urlB64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '');
            
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });

            // Send subscription to backend
            const key = subscription.getKey ? subscription.getKey('p256dh') : '';
            const auth = subscription.getKey ? subscription.getKey('auth') : '';
            
            const parsedSub = JSON.parse(JSON.stringify(subscription));

            await fetch('/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    keys: {
                        auth: parsedSub.keys?.auth,
                        p256dh: parsedSub.keys?.p256dh,
                    }
                })
            });

            setIsSubscribed(true);
            toast.success('Push notifications enabled!');
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Failed to enable push notifications.');
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        setIsLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
                
                // Notify backend
                await fetch('/push/unsubscribe', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({ endpoint: subscription.endpoint })
                });
                
                setIsSubscribed(false);
                toast.success('Push notifications disabled.');
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
            toast.error('Failed to disable push notifications.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = () => {
        if (isSubscribed) {
            unsubscribe();
        } else {
            subscribe();
        }
    };

    if (!isSupported) {
        return (
            <div className="flex items-center space-x-3 text-sm text-gray-500">
                <BellOff className="h-5 w-5" />
                <span>Push notifications are not supported in your browser.</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="rounded-full bg-woof-gold/10 p-2">
                    {isSubscribed ? (
                        <Bell className="h-5 w-5 text-woof-gold" />
                    ) : (
                        <BellOff className="h-5 w-5 text-gray-400" />
                    )}
                </div>
                <div>
                    <Label htmlFor="push-notifications" className="text-base font-medium text-gray-900">
                        Browser Push Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                        Receive important updates even when you're not actively using the app.
                    </p>
                </div>
            </div>
            <Switch 
                id="push-notifications" 
                checked={isSubscribed} 
                onCheckedChange={handleToggle} 
                disabled={isLoading}
                className="data-[state=checked]:bg-woof-gold"
            />
        </div>
    );
}
