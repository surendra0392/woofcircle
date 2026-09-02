import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import CalendarSlotPicker from './calendar-slot-picker';

interface BookSlotDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    providerType: string;
    providerId: number;
    providerName: string;
}

export default function BookSlotDialog({ isOpen, setIsOpen, providerType, providerId, providerName }: BookSlotDialogProps) {
    const [bookingData, setBookingData] = useState<{ date: string; start_time: string; end_time: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSlotSelect = (date: string, start: string, end: string) => {
        setBookingData({ date, start_time: start, end_time: end });
    };

    const handleBook = async () => {
        if (!bookingData) return;

        setLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    provider_type: providerType,
                    provider_id: providerId,
                    date: bookingData.date,
                    start_time: bookingData.start_time,
                    end_time: bookingData.end_time,
                })
            });
            if (!res.ok) {
                const data = await res.json();
                throw { response: { data } };
            }
            fetch('/api/track-interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ viewable_type: providerType, viewable_id: providerId, interaction_type: 'booking_click' })
            }).catch(() => {});
            toast.success('Slot booked successfully!');
            setIsOpen(false);
            setBookingData(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to book slot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="border-woof-charcoal/10 bg-white p-0 sm:max-w-md rounded-none">
                <DialogHeader className="bg-woof-charcoal p-6">
                    <DialogTitle className="text-woof-gold font-black tracking-widest uppercase flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Book Slot
                    </DialogTitle>
                    <DialogDescription className="text-white/70">
                        Schedule a visit at {providerName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <CalendarSlotPicker
                        providerType={providerType}
                        providerId={providerId}
                        onSlotSelect={handleSlotSelect}
                    />

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="rounded-none font-bold uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBook}
                            disabled={loading || !bookingData}
                            className="bg-woof-gold hover:bg-woof-gold/90 text-woof-charcoal rounded-none font-black uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Booking...' : 'Book Now'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
