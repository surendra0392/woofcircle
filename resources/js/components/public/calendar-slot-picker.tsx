import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Slot {
    start_time: string;
    end_time: string;
}

interface CalendarSlotPickerProps {
    providerType: string;
    providerId: number;
    onSlotSelect: (date: string, start: string, end: string) => void;
}

export default function CalendarSlotPicker({ providerType, providerId, onSlotSelect }: CalendarSlotPickerProps) {
    const [date, setDate] = useState<string>('');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    useEffect(() => {
        if (!date) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    provider_type: providerType,
                    provider_id: providerId.toString(),
                    date: date
                }).toString();
                const response = await fetch(`/api/bookings/slots?${query}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(res => res.json());
                setSlots(response.slots || []);
            } catch (error) {
                console.error("Failed to fetch slots", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
        setSelectedSlot(null);
    }, [date, providerType, providerId]);

    const handleSlotClick = (slot: Slot) => {
        setSelectedSlot(slot);
        onSlotSelect(date, slot.start_time, slot.end_time);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">
                    Select Date
                </label>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-none border-woof-charcoal/20 focus-visible:ring-woof-gold"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            {date && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">
                        Available Slots
                    </label>
                    {loading ? (
                        <div className="text-sm text-woof-charcoal/50">Loading slots...</div>
                    ) : slots.length === 0 ? (
                        <div className="text-sm text-woof-charcoal/50">No slots available for this date.</div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {slots.map((slot, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSlotClick(slot)}
                                    className={`py-2 px-3 text-xs font-bold rounded-none border transition-colors ${
                                        selectedSlot?.start_time === slot.start_time 
                                            ? 'bg-woof-gold text-woof-charcoal border-woof-gold' 
                                            : 'bg-white text-woof-charcoal border-woof-charcoal/20 hover:border-woof-gold'
                                    }`}
                                >
                                    {slot.start_time} - {slot.end_time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
