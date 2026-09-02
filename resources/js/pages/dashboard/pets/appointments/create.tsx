import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Building2, Clock, Stethoscope, Info, FileText, Syringe, Heart, Scissors, GraduationCap, ArrowLeft, Save } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Pet {
    id: number;
    name: string;
    breed: { name: string };
    profile_image_url: string | null;
}

interface Vet {
    id: number;
    clinic_name: string;
}

interface PageProps {
    pet: Pet;
    appointmentTypes: string[];
    statuses: string[];
    vets: Vet[];
}

export default function CreateAppointment({ pet, appointmentTypes, statuses, vets }: PageProps) {
    const [isCustomClinic, setIsCustomClinic] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        appointment_type: 'checkup',
        appointment_date: '',
        vet_profile_id: '',
        doctor_name: '',
        clinic_name: '',
        notes: '',
        status: 'scheduled',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            vet_profile_id: isCustomClinic ? '' : data.vet_profile_id,
        }));
        post(route('pets.appointments.store', pet.id), {
            onSuccess: () => {
                toast.success('Appointment scheduled successfully.');
            }
        });
    };

    const breadcrumbs = [
        { title: 'My Pets', href: route('pets.index') },
        { title: pet.name, href: route('pets.index') },
        { title: 'Appointments', href: route('pets.appointments.index', pet.id) },
        { title: 'Schedule Visit', href: '#' },
    ];

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Schedule Appointment"
            subtitle={`Plan a new clinical or service visit for ${pet.name}`}
            actions={
                <div className="flex items-center gap-3">
                    <Link href={route('pets.appointments.index', pet.id)}>
                        <Button
                            variant="custom"
                            className="border border-[#e8ded1] hover:bg-[#fcfbf9] h-10 rounded-full px-5 text-xs font-bold transition-all text-woof-charcoal shadow-2xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        form="create-appointment-form"
                        variant="custom"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-10 rounded-full px-6 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Saving...
                            </div>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Schedule Visit
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <Head title={`Schedule Appointment - ${pet.name}`} />

            <div className="pb-16 max-w-4xl mx-auto space-y-6">
                <form id="create-appointment-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Section: Timing & Type */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Timing & Type</h3>
                                <p className="text-xs text-woof-charcoal/60">Choose date, time, and appointment category</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Type */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Appointment Category <span className="text-rose-600">*</span>
                                </Label>
                                <Select value={data.appointment_type} onValueChange={(v) => setData('appointment_type', v)}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {appointmentTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="capitalize">
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.appointment_type && (
                                    <p className="text-xs font-bold text-rose-500">{errors.appointment_type}</p>
                                )}
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-2">
                                <Label htmlFor="appointment_date" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Schedule Date & Time <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="appointment_date"
                                    type="datetime-local"
                                    value={data.appointment_date}
                                    onChange={(e) => setData('appointment_date', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    required
                                />
                                {errors.appointment_date && (
                                    <p className="text-xs font-bold text-rose-500">{errors.appointment_date}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Facility Details */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Facility Details</h3>
                                    <p className="text-xs text-woof-charcoal/60">Where and with whom is this appointment scheduled?</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomClinic(!isCustomClinic);
                                    setData((prev) => ({
                                        ...prev,
                                        vet_profile_id: '',
                                        clinic_name: '',
                                    }));
                                }}
                                className="text-woof-gold text-xs font-bold hover:underline cursor-pointer"
                            >
                                {isCustomClinic ? 'Select Partner Vet' : 'Enter Manually'}
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Clinic / Vet Selection */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Clinical Center</Label>
                                {!isCustomClinic ? (
                                    <Select
                                        value={data.vet_profile_id}
                                        onValueChange={(v) => {
                                            setData((prev) => {
                                                const vet = vets.find((vet) => vet.id.toString() === v);
                                                return {
                                                    ...prev,
                                                    vet_profile_id: v,
                                                    clinic_name: vet ? vet.clinic_name : '',
                                                };
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                            <SelectValue placeholder="Choose clinic from directory" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                            {vets.map((v) => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.clinic_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={data.clinic_name}
                                        onChange={(e) => setData('clinic_name', e.target.value)}
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                        placeholder="Enter clinic name manually"
                                    />
                                )}
                                {errors.clinic_name && (
                                    <p className="text-xs font-bold text-rose-500">{errors.clinic_name}</p>
                                )}
                            </div>

                            {/* Doctor Name */}
                            <div className="space-y-2">
                                <Label htmlFor="doctor_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Practitioner / Doctor Name</Label>
                                <Input
                                    id="doctor_name"
                                    value={data.doctor_name}
                                    onChange={(e) => setData('doctor_name', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    placeholder="Dr. Smith (Optional)"
                                />
                                {errors.doctor_name && (
                                    <p className="text-xs font-bold text-rose-500">{errors.doctor_name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Additional Information */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Additional Information</h3>
                                <p className="text-xs text-woof-charcoal/60">Extra notes and status of the visit</p>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Visit Notes / Instructions</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[100px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                                placeholder="Specific instructions, checkup symptoms, or dietary prep..."
                            />
                            {errors.notes && (
                                <p className="text-xs font-bold text-rose-500">{errors.notes}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Initial Status</Label>
                            <div className="flex flex-wrap gap-2.5">
                                {statuses.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setData('status', s)}
                                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                            data.status === s
                                                ? 'bg-woof-charcoal text-white shadow-xs'
                                                : 'border border-[#e8ded1] text-woof-charcoal/60 hover:border-woof-gold bg-[#fcfbf9]'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {errors.status && (
                                <p className="text-xs font-bold text-rose-500">{errors.status}</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
