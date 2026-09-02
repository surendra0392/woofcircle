import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
export default function FlashNotifications() {
    const { flash } = usePage<SharedData>().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast(flash.warning, { className: 'bg-woof-gold/10 text-amber-900 border-amber-100' });
        }
        if (flash.info) {
            toast.info(flash.info);
        }
    }, [flash]);
    return null;
}
