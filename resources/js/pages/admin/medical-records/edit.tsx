import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Calendar, FileText, Activity } from 'lucide-react';

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

interface MedicalRecord {
    id: number;
    pet_id: number;
    record_type: string;
    title: string;
    description: string | null;
    diagnosis_date: string | null;
    doctor_name: string | null;
    clinic_name: string | null;
    prescription: string | null;
    notes: string | null;
}

interface PageProps {
    record: MedicalRecord;
    pets: Pet[];
    vets: Vet[];
    recordTypes: string[];
}

export default function MedicalRecordEditPage({ record, pets = [], vets = [], recordTypes = [] }: PageProps) {
    const { data, setData, post, errors, processing, transform } = useForm({
        pet_id: record.pet_id?.toString() || '',
        record_type: record.record_type || '',
        title: record.title || '',
        description: record.description || '',
        diagnosis_date: record.diagnosis_date || '',
        doctor_name: record.doctor_name || '',
        clinic_name: record.clinic_name || '',
        prescription: record.prescription || '',
        notes: record.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Transform clinic_name if predefined clinic is selected
        transform((data) => {
            const selectedVet = vets.find(v => v.id.toString() === data.clinic_name);
            return {
                ...data,
                clinic_name: selectedVet ? selectedVet.clinic_name : data.clinic_name
            };
        });

        // We use POST since file uploads or Inertia forms usually use POST to simulate update on multipart requests
        post(route('admin.medical-records.update', record.id), {
            onSuccess: () => {
                toast.success('Medical record updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update medical record. Please check validation errors.');
            }
        });
    };

    return (
        <AdminLayout title="Edit Medical Record">
            <Head title={`Edit Record - ${record.title}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.medical-records.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Medical Record: {record.title}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update clinical observation, diagnosis, and prescription</p>
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
                            Select the target pet from the registry for this medical record dossier.
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

                {/* 2. Diagnosis & Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Activity className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Diagnosis & Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the clinical report title, select the diagnosis type, and specify the onset date.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Report Title *</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. Chronic Otitis, Fracture repair" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="record_type" className="text-xs font-bold text-woof-charcoal">Record Type *</Label>
                                <select 
                                    id="record_type" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 capitalize" 
                                    value={data.record_type} 
                                    onChange={e => setData('record_type', e.target.value)}
                                >
                                    <option value="">Select Type...</option>
                                    {recordTypes.map((type) => (
                                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                                {errors.record_type && <p className="text-xs text-rose-500">{errors.record_type}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="diagnosis_date" className="text-xs font-bold text-woof-charcoal">Diagnosis Date</Label>
                                <Input 
                                    id="diagnosis_date" 
                                    type="date"
                                    value={data.diagnosis_date} 
                                    onChange={e => setData('diagnosis_date', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.diagnosis_date && <p className="text-xs text-rose-500">{errors.diagnosis_date}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Clinical Description</Label>
                            <Textarea 
                                id="description" 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                placeholder="Describe symptoms, diagnostic observations, or procedure outlines..." 
                                className="min-h-24 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Provider & Clinical Context */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Clinician Context</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Link to clinic partners or input manual hospital and veterinary specialist names.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="clinic_select" className="text-xs font-bold text-woof-charcoal">Veterinary Clinic</Label>
                                <select 
                                    id="clinic_select" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={vets.some(v => v.clinic_name === data.clinic_name) ? vets.find(v => v.clinic_name === data.clinic_name)?.id.toString() : (data.clinic_name ? 'other' : '')} 
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val === 'other') {
                                            setData('clinic_name', '');
                                        } else {
                                            const v = vets.find(x => x.id.toString() === val);
                                            setData('clinic_name', v ? v.clinic_name : '');
                                        }
                                    }}
                                >
                                    <option value="">Select Clinic...</option>
                                    <option value="other">Manual Entry / Other</option>
                                    {vets?.map((v: any) => (
                                        <option key={v.id} value={v.id.toString()}>{v.clinic_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="doctor_name" className="text-xs font-bold text-woof-charcoal">Attending Doctor / Vet</Label>
                                <Input 
                                    id="doctor_name" 
                                    value={data.doctor_name} 
                                    onChange={e => setData('doctor_name', e.target.value)} 
                                    placeholder="Dr. John Doe" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.doctor_name && <p className="text-xs text-rose-500">{errors.doctor_name}</p>}
                            </div>
                        </div>

                        {(!vets.some(v => v.clinic_name === data.clinic_name) && data.clinic_name !== '') || (data.clinic_name === '' && !vets.some(v => v.clinic_name === '')) ? (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label htmlFor="clinic_name" className="text-xs font-bold text-woof-charcoal">Manual Clinic Name</Label>
                                <Input 
                                    id="clinic_name" 
                                    value={data.clinic_name} 
                                    onChange={e => setData('clinic_name', e.target.value)} 
                                    placeholder="Enter clinic name manually..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.clinic_name && <p className="text-xs text-rose-500">{errors.clinic_name}</p>}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* 4. Treatment & Medication */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <FileText className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Treatments & Remarks</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Document prescribed medications, dosage frequency, and general recovery instructions.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="prescription" className="text-xs font-bold text-woof-charcoal">Prescription Details</Label>
                            <Textarea 
                                id="prescription" 
                                value={data.prescription} 
                                onChange={e => setData('prescription', e.target.value)} 
                                placeholder="e.g. Amoxicillin 250mg - 1 tablet every 12 hours for 10 days" 
                                className="min-h-24 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.prescription && <p className="text-xs text-rose-500">{errors.prescription}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal">Internal Remarks</Label>
                            <Textarea 
                                id="notes" 
                                value={data.notes} 
                                onChange={e => setData('notes', e.target.value)} 
                                placeholder="Add follow-up timeline details or specific animal handling notes..." 
                                className="min-h-24 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.notes && <p className="text-xs text-rose-500">{errors.notes}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.medical-records.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Update Record
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
