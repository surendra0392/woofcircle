import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Calendar, FileText, Clock } from 'lucide-react';
import { useState } from 'react';

interface Pet {
    id: number;
    name: string;
    breed?: { name: string };
    user?: { name: string };
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
    status: string;
    doctor_name: string | null;
    clinic_name: string | null;
    notes: string | null;
    vet_profile_id: number | null;
}

interface PageProps {
    appointment: Appointment;
    pets: Pet[];
    vets: Vet[];
    appointmentTypes: string[];
    statuses: string[];
}

export default function AppointmentEditPage({ appointment, pets = [], vets = [], appointmentTypes = [], statuses = [] }: PageProps) {
    const [isCustomClinic, setIsCustomClinic] = useState(!appointment.vet_profile_id && !!appointment.clinic_name);
    
    // Format timestamp for datetime-local input
    const formattedDate = appointment.appointment_date 
        ? appointment.appointment_date.split('.')[0].slice(0, 16).replace(' ', 'T')
        : '';

    const { data, setData, post, errors, processing, transform } = useForm({
        pet_id: appointment.pet_id?.toString() || '',
        appointment_type: appointment.appointment_type || 'checkup',
        appointment_date: formattedDate,
        vet_profile_id: appointment.vet_profile_id?.toString() || '',
        doctor_name: appointment.doctor_name || '',
        clinic_name: appointment.clinic_name || '',
        notes: appointment.notes || '',
        status: appointment.status || 'scheduled',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Transform if preset partner clinic is selected
        transform((data) => {
            const selectedVet = vets.find(v => v.id.toString() === data.vet_profile_id);
            return {
                ...data,
                clinic_name: selectedVet ? selectedVet.clinic_name : data.clinic_name
            };
        });

        // We use POST since file uploads or Inertia forms usually use POST to simulate update on multipart requests
        post(route('admin.appointments.update', appointment.id), {
            onSuccess: () => {
                toast.success('Appointment updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update appointment. Please check validation errors.');
            }
        });
    };

    return (
        <AdminLayout title="Edit Appointment Schedule">
            <Head title="Edit Appointment - Admin" />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.appointments.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Schedule Entry</h2>
                    <p className="text-xs text-woof-charcoal/60">Update appointment details, timing, clinician, and status</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* 1. Pet Selection Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Pet Selection</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select the target pet from the registry for this scheduled appointment.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="pet_id" className="text-xs font-bold text-woof-charcoal">Target Pet *</Label>
                            <SearchableSelect 
                                options={[
                                    { value: '', label: 'Select Target Pet...' },
                                    ...(pets?.map((p: any) => ({
                                        value: p.id.toString(),
                                        label: `${p.name} (${p.breed?.name || 'Unknown Breed'}) - ${p.user?.name || 'No Owner'}`
                                    })) || [])
                                ]}
                                value={data.pet_id || ''}
                                onChange={(val) => setData('pet_id', val)}
                                placeholder="Search pet by name, breed, or owner..."
                                className="w-full h-10 border-[#e8ded1] bg-[#fcfbf9] rounded-2xl text-xs font-medium"
                            />
                            {errors.pet_id && <p className="text-xs text-rose-500">{errors.pet_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Schedule Timing & Type */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Timing & Category</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Choose the visit category, specific timestamp, and current schedule workflow status.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="appointment_type" className="text-xs font-bold text-woof-charcoal">Visit Category *</Label>
                                <select 
                                    id="appointment_type" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer capitalize" 
                                    value={data.appointment_type} 
                                    onChange={e => setData('appointment_type', e.target.value)}
                                >
                                    {appointmentTypes.map((type) => (
                                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                                {errors.appointment_type && <p className="text-xs text-rose-500">{errors.appointment_type}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status" className="text-xs font-bold text-woof-charcoal">Registry Status *</Label>
                                <select 
                                    id="status" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer capitalize" 
                                    value={data.status} 
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                                {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="appointment_date" className="text-xs font-bold text-woof-charcoal">Schedule Date & Time *</Label>
                                <Input 
                                    id="appointment_date" 
                                    type="datetime-local"
                                    value={data.appointment_date} 
                                    onChange={e => setData('appointment_date', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.appointment_date && <p className="text-xs text-rose-500">{errors.appointment_date}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Clinician & Vet Provider */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Vet Clinician</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Link this schedule occurrence to partner clinics, or check manual entry.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Clinic Linking Mode</span>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsCustomClinic(!isCustomClinic);
                                    setData(d => ({ ...d, vet_profile_id: '', clinic_name: '' }));
                                }}
                                className="text-woof-gold hover:underline text-xs font-bold cursor-pointer"
                            >
                                {isCustomClinic ? 'Select Partner Clinic' : 'Switch to Manual Entry'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!isCustomClinic ? (
                                <div className="space-y-1.5">
                                    <Label htmlFor="vet_profile_id" className="text-xs font-bold text-woof-charcoal">Partner Clinic</Label>
                                    <select 
                                        id="vet_profile_id" 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer" 
                                        value={data.vet_profile_id} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            setData('vet_profile_id', val);
                                            const v = vets.find(x => x.id.toString() === val);
                                            setData('clinic_name', v ? v.clinic_name : '');
                                        }}
                                    >
                                        <option value="">Select Clinic Partner...</option>
                                        {vets?.map((v: any) => (
                                            <option key={v.id} value={v.id.toString()}>{v.clinic_name}</option>
                                        ))}
                                    </select>
                                    {errors.vet_profile_id && <p className="text-xs text-rose-500">{errors.vet_profile_id}</p>}
                                </div>
                            ) : (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                    <Label htmlFor="clinic_name" className="text-xs font-bold text-woof-charcoal">Hospital / Clinic Name</Label>
                                    <Input 
                                        id="clinic_name" 
                                        value={data.clinic_name} 
                                        onChange={e => setData('clinic_name', e.target.value)} 
                                        placeholder="Enter clinical center manually..." 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                    />
                                    {errors.clinic_name && <p className="text-xs text-rose-500">{errors.clinic_name}</p>}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="doctor_name" className="text-xs font-bold text-woof-charcoal">Attending Doctor / Vet</Label>
                                <Input 
                                    id="doctor_name" 
                                    value={data.doctor_name} 
                                    onChange={e => setData('doctor_name', e.target.value)} 
                                    placeholder="Dr. Smith" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.doctor_name && <p className="text-xs text-rose-500">{errors.doctor_name}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Notes & Remarks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <FileText className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Schedule Notes</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Record specific booking instructions, medical concerns, or scheduling comments.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal">Administrative Remarks</Label>
                            <Textarea 
                                id="notes" 
                                value={data.notes} 
                                onChange={e => setData('notes', e.target.value)} 
                                placeholder="Add appointment complaints, clinical notes, or booking references..." 
                                className="min-h-24 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.notes && <p className="text-xs text-rose-500">{errors.notes}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.appointments.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Update Schedule
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
