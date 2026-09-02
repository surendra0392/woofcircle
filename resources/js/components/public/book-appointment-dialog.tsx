import { FormEvent } from 'react';
import { useForm, Link } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface Pet {
    id: number;
    name: string;
}

interface Vet {
    id: number;
    clinic_name: string;
}

interface BookAppointmentDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    vet: Vet;
    pets: Pet[];
}

export default function BookAppointmentDialog({ isOpen, setIsOpen, vet, pets }: BookAppointmentDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        pet_id: '',
        appointment_type: 'checkup',
        appointment_date: '',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        post(route('directory.vets.book-appointment', vet.id), {
            onSuccess: () => {
                toast.success('Appointment request sent successfully!');
                setIsOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="border-woof-charcoal/10 bg-white p-0 sm:max-w-md rounded-none">
                <DialogHeader className="bg-woof-charcoal p-6">
                    <DialogTitle className="text-woof-gold font-black tracking-widest uppercase flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Book Appointment
                    </DialogTitle>
                    <DialogDescription className="text-white/70">
                        Schedule a visit at {vet.clinic_name} for your pet.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6">
                    {pets.length === 0 ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="mx-auto bg-white border border-[#e8ded1] shadow-2xs h-12 w-12 flex items-center justify-center rounded-2xl mb-4">
                                <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                            </div>
                            <h3 className="font-black text-woof-charcoal uppercase tracking-widest text-sm">No Pets Found</h3>
                            <p className="text-xs text-woof-charcoal/60">
                                You need to add a pet to your profile before you can book an appointment.
                            </p>
                            <Button asChild className="w-full bg-woof-gold hover:bg-woof-gold/90 text-woof-charcoal rounded-none uppercase font-black tracking-widest mt-4">
                                <Link href={route('pets.index')}>
                                    Add a Pet Now
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">
                                    Select Pet <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.pet_id}
                                    onChange={(e) => setData('pet_id', e.target.value)}
                                    className="flex h-10 w-full rounded-none border border-woof-charcoal/20 bg-white px-3 py-2 text-sm text-woof-charcoal ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-woof-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="" disabled>Choose a pet...</option>
                                    {pets.map(pet => (
                                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                                    ))}
                                </select>
                                {errors.pet_id && <p className="text-xs text-rose-500">{errors.pet_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">
                                    Appointment Type <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.appointment_type}
                                    onChange={(e) => setData('appointment_type', e.target.value)}
                                    className="flex h-10 w-full rounded-none border border-woof-charcoal/20 bg-white px-3 py-2 text-sm text-woof-charcoal ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-woof-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="vaccination">Vaccination</option>
                                    <option value="checkup">Checkup</option>
                                    <option value="surgery">Surgery</option>
                                    <option value="grooming">Grooming</option>
                                    <option value="training">Training</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.appointment_type && <p className="text-xs text-rose-500">{errors.appointment_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">
                                    Date & Time <span className="text-rose-500">*</span>
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={data.appointment_date}
                                    onChange={(e) => setData('appointment_date', e.target.value)}
                                    className="rounded-none border-woof-charcoal/20 focus-visible:ring-woof-gold"
                                    required
                                />
                                {errors.appointment_date && <p className="text-xs text-rose-500">{errors.appointment_date}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">
                                    Notes (Optional)
                                </label>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Any specific symptoms or reasons for visit?"
                                    className="rounded-none border-woof-charcoal/20 focus-visible:ring-woof-gold min-h-[80px]"
                                />
                                {errors.notes && <p className="text-xs text-rose-500">{errors.notes}</p>}
                            </div>

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
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-gold hover:bg-woof-gold/90 text-woof-charcoal rounded-none font-black uppercase tracking-widest text-xs"
                                >
                                    {processing ? 'Booking...' : 'Book Now'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
