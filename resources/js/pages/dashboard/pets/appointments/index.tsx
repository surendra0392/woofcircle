import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    AlertCircle,
    Building2,
    Calendar,
    Check,
    Clock,
    Edit2,
    GraduationCap,
    Heart,
    Info,
    Plus,
    Scissors,
    Stethoscope,
    Syringe,
    Trash2,
    User,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface Pet {
    id: number;
    name: string;
    breed: {
        name: string;
    };
    profile_image_url: string | null;
}

interface Vet {
    id: number;
    clinic_name: string;
}

interface Appointment {
    id: number;
    pet_id: number;
    appointment_type: string;
    appointment_date: string;
    vet_profile_id: number | null;
    doctor_name: string | null;
    clinic_name: string | null;
    notes: string | null;
    status: string;
    vet_profile?: Vet;
    created_at: string;
}

interface PageProps {
    pet: Pet;
    appointments: Appointment[];
    appointmentTypes: string[];
    statuses: string[];
    vets: Vet[];
}

export default function AppointmentsIndex({ pet, appointments, appointmentTypes, statuses, vets }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<Appointment | null>(null);

    const handleDelete = () => {
        if (selectedForDelete) {
            router.delete(route('pets.appointments.destroy', [pet.id, selectedForDelete.id]), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    toast.success('Appointment cancelled successfully.');
                },
            });
        }
    };

    const getAppointmentIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'vaccination':
                return <Syringe className="h-5 w-5" />;
            case 'checkup':
                return <Stethoscope className="h-5 w-5" />;
            case 'surgery':
                return <Scissors className="h-5 w-5" />;
            case 'grooming':
                return <Heart className="h-5 w-5" />;
            case 'training':
                return <GraduationCap className="h-5 w-5" />;
            default:
                return <Calendar className="h-5 w-5" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'completed':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            default:
                return 'bg-[#fcfbf9] text-woof-charcoal/70 border-[#e8ded1]';
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'My Pets', href: route('pets.index') },
                { title: pet.name, href: '#' },
                { title: 'Appointments', href: '#' },
            ]}
            title={`${pet.name}'s Appointments`}
            subtitle="Scheduled visits and clinical timeline."
            actions={
                <Link
                    href={route('pets.appointments.create', pet.id)}
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    Schedule Visit
                </Link>
            }
        >
            <Head title={`${pet.name} - Appointments`} />

            <div className="mx-auto max-w-5xl space-y-8 pb-16">
                {/* Hero Header Card */}
                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] shrink-0">
                            {pet.profile_image_url ? (
                                <img src={pet.profile_image_url} alt={pet.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-woof-gold/40">
                                    <User className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold block mb-0.5">
                                Companion History
                            </span>
                            <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">{pet.name}</h1>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5 font-medium">{pet.breed.name}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center min-w-44">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50 mb-1">Upcoming Visits</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-woof-charcoal">
                                {appointments.filter((a) => a.status === 'scheduled').length}
                            </span>
                            <Clock className="text-woof-gold h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* Appointments Timeline */}
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="bg-white border border-[#e8ded1] rounded-3xl p-16 text-center shadow-xs flex flex-col items-center">
                            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                                <Calendar className="h-8 w-8 text-woof-gold/40" />
                            </div>
                            <h2 className="text-base font-bold text-woof-charcoal mb-1">No Scheduled Appointments</h2>
                            <p className="text-xs text-woof-charcoal/60 mb-6 max-w-md">
                                Keep track of {pet.name}'s health journey by logging veterinary visits, booster shots, grooming, and training sessions.
                            </p>
                            <Link
                                href={route('pets.appointments.create', pet.id)}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 py-2.5 text-xs font-bold transition-all shadow-xs"
                            >
                                Book First Appointment
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map((appointment) => {
                                const dt = formatDateTime(appointment.appointment_date);
                                return (
                                    <div
                                        key={appointment.id}
                                        className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                                                {getAppointmentIcon(appointment.appointment_type)}
                                            </div>

                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center gap-2.5 flex-wrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                    <h3 className="text-sm font-bold text-woof-charcoal capitalize">
                                                        {appointment.appointment_type} Visit
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-woof-charcoal/60 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 text-woof-gold" />
                                                        {dt.date} at {dt.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-3.5 w-3.5 text-woof-gold" />
                                                        {appointment.clinic_name || 'Clinic Not Specified'}
                                                    </span>
                                                    {appointment.doctor_name && (
                                                        <span className="flex items-center gap-1">
                                                            <Stethoscope className="h-3.5 w-3.5 text-woof-gold" />
                                                            Dr. {appointment.doctor_name}
                                                        </span>
                                                    )}
                                                </div>

                                                {appointment.notes && (
                                                    <p className="text-xs text-woof-charcoal/70 bg-[#fcfbf9] rounded-2xl p-3 border border-[#e8ded1] mt-2">
                                                        "{appointment.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {appointment.status === 'scheduled' && (
                                                <Button
                                                    variant="custom"
                                                    size="icon"
                                                    title="Mark as completed"
                                                    onClick={() => {
                                                        const { vet_profile, ...payloadData } = appointment;
                                                        router.post(route('pets.appointments.update', [pet.id, appointment.id]), {
                                                            ...payloadData,
                                                            appointment_date: appointment.appointment_date.split('.')[0].slice(0, 16),
                                                            status: 'completed',
                                                        } as any, {
                                                            onSuccess: () => {
                                                                toast.success('Appointment marked as completed.');
                                                            }
                                                        });
                                                    }}
                                                    className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center cursor-pointer"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Link
                                                href={route('pets.appointments.edit', [pet.id, appointment.id])}
                                                title="Edit appointment"
                                                className="text-woof-charcoal bg-[#fcfbf9] hover:bg-woof-charcoal hover:text-white border border-[#e8ded1] h-9 w-9 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Link>
                                            <Button
                                                variant="custom"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedForDelete(appointment);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                title="Cancel appointment"
                                                className="h-9 w-9 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl border border-[#e8ded1] bg-white p-8 shadow-xl">
                    <DialogTitle className="text-lg font-bold text-woof-charcoal flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                        Cancel Appointment?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-woof-charcoal/60 mt-1">
                        This scheduled visit will be removed from {pet.name}'s calendar.
                    </DialogDescription>
                    <div className="flex justify-end gap-2.5 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal"
                        >
                            Back
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 shadow-xs"
                        >
                            Cancel Visit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
