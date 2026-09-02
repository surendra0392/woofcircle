import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, User, Building2, FileText, ClipboardList, Info, Stethoscope, Pill, ArrowLeft, Save } from 'lucide-react';
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
    pet: Pet;
    medicalRecord: MedicalRecord;
    recordTypes: string[];
    vets: Vet[];
}

export default function EditMedicalRecord({ pet, medicalRecord, recordTypes, vets }: PageProps) {
    const isPredefined = recordTypes.includes(medicalRecord.record_type);
    const [isCustomClinic, setIsCustomClinic] = useState(
        !vets.find((v) => v.clinic_name === medicalRecord.clinic_name) && !!medicalRecord.clinic_name
    );
    const [isCustomTreatment, setIsCustomTreatment] = useState(!isPredefined);

    const { data, setData, post, processing, errors, transform } = useForm({
        record_type: isPredefined ? medicalRecord.record_type : 'others',
        custom_record_type: isPredefined ? '' : medicalRecord.record_type,
        title: medicalRecord.title,
        description: medicalRecord.description || '',
        diagnosis_date: medicalRecord.diagnosis_date || '',
        doctor_name: medicalRecord.doctor_name || '',
        clinic_name: medicalRecord.clinic_name || '',
        prescription: medicalRecord.prescription || '',
        notes: medicalRecord.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => {
            const finalData = { ...data };
            if (isCustomTreatment && data.custom_record_type) {
                finalData.record_type = data.custom_record_type;
            }
            return finalData;
        });
        post(route('pets.medical-records.update', [pet.id, medicalRecord.id]), {
            onSuccess: () => {
                toast.success('Medical record updated successfully.');
            }
        });
    };

    const breadcrumbs = [
        { title: 'My Pets', href: route('pets.index') },
        { title: pet.name, href: route('pets.index') },
        { title: 'Medical Records', href: route('pets.medical-records.index', pet.id) },
        { title: 'Edit Entry', href: '#' },
    ];

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Edit Medical Record"
            subtitle={`Update clinical history for ${pet.name}`}
            actions={
                <div className="flex items-center gap-3">
                    <Link href={route('pets.medical-records.index', pet.id)}>
                        <Button
                            variant="custom"
                            className="border border-[#e8ded1] hover:bg-[#fcfbf9] h-10 rounded-full px-5 text-xs font-bold transition-all text-woof-charcoal shadow-2xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        form="edit-medical-record-form"
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
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <Head title={`Edit Medical Record - ${pet.name}`} />

            <div className="pb-16 max-w-4xl mx-auto space-y-6">
                <form id="edit-medical-record-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Section: Record Type & Basic Info */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Medical Classification</h3>
                                    <p className="text-xs text-woof-charcoal/60">Select the category and nature of diagnosis</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomTreatment(!isCustomTreatment);
                                    setData((prev) => ({
                                        ...prev,
                                        record_type: isCustomTreatment ? 'general' : 'others',
                                        custom_record_type: '',
                                    }));
                                }}
                                className="text-woof-gold text-xs font-bold hover:underline cursor-pointer"
                            >
                                {isCustomTreatment ? 'Standard Categories' : 'Custom Category'}
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Record Type Selection */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Record Type <span className="text-rose-600">*</span>
                                </Label>
                                {!isCustomTreatment ? (
                                    <Select value={data.record_type} onValueChange={(v) => setData('record_type', v)}>
                                        <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                            {recordTypes.map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={data.custom_record_type}
                                        onChange={(e) => setData('custom_record_type', e.target.value)}
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                        placeholder="e.g. Dental Surgery, Hydrotherapy"
                                        required
                                    />
                                )}
                                {errors.record_type && (
                                    <p className="text-xs font-bold text-rose-500">{errors.record_type}</p>
                                )}
                            </div>

                            {/* Diagnosis Date */}
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis_date" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Diagnosis / Procedure Date
                                </Label>
                                <Input
                                    id="diagnosis_date"
                                    type="date"
                                    value={data.diagnosis_date}
                                    onChange={(e) => setData('diagnosis_date', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                />
                                {errors.diagnosis_date && (
                                    <p className="text-xs font-bold text-rose-500">{errors.diagnosis_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                Condition / Procedure Title <span className="text-rose-600">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                placeholder="e.g. Annual Dental Cleaning & Scaling, Fracture Cast"
                                required
                            />
                            {errors.title && (
                                <p className="text-xs font-bold text-rose-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Clinical Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[90px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                                placeholder="Describe symptoms, test results, diagnoses, and medical findings..."
                            />
                            {errors.description && (
                                <p className="text-xs font-bold text-rose-500">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Section: Medical Practitioner & Clinic */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Veterinary Clinic & Provider</h3>
                                    <p className="text-xs text-woof-charcoal/60">Hospital or practitioner who managed treatment</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomClinic(!isCustomClinic);
                                    setData((prev) => ({
                                        ...prev,
                                        clinic_name: '',
                                    }));
                                }}
                                className="text-woof-gold text-xs font-bold hover:underline cursor-pointer"
                            >
                                {isCustomClinic ? 'Select Directory Clinic' : 'Enter Manually'}
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Clinic Selection */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Clinical Hospital</Label>
                                {!isCustomClinic ? (
                                    <Select
                                        value={data.clinic_name}
                                        onValueChange={(v) => setData('clinic_name', v)}
                                    >
                                        <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                            <SelectValue placeholder="Choose clinic from directory" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                            {vets.map((v) => (
                                                <SelectItem key={v.id} value={v.clinic_name}>
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
                                        placeholder="e.g. City Animal Referral Hospital"
                                    />
                                )}
                                {errors.clinic_name && (
                                    <p className="text-xs font-bold text-rose-500">{errors.clinic_name}</p>
                                )}
                            </div>

                            {/* Doctor Name */}
                            <div className="space-y-2">
                                <Label htmlFor="doctor_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Veterinarian / Specialist</Label>
                                <Input
                                    id="doctor_name"
                                    value={data.doctor_name}
                                    onChange={(e) => setData('doctor_name', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    placeholder="Dr. Johnson (Optional)"
                                />
                                {errors.doctor_name && (
                                    <p className="text-xs font-bold text-rose-500">{errors.doctor_name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Prescription & Care Plan */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Pill className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Prescriptions & Care Plan</h3>
                                <p className="text-xs text-woof-charcoal/60">Medications, dosages, and postoperative follow-up</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="prescription" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Prescribed Medications & Dosages</Label>
                                <Textarea
                                    id="prescription"
                                    value={data.prescription}
                                    onChange={(e) => setData('prescription', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[80px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                                    placeholder="e.g. Amoxicillin 250mg 2x daily for 7 days, Ear drops 3 drops morning/night..."
                                />
                                {errors.prescription && (
                                    <p className="text-xs font-bold text-rose-500">{errors.prescription}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Additional Provider Remarks</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[80px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                                    placeholder="Follow-up scheduled in 14 days, cone required for 5 days..."
                                />
                                {errors.notes && (
                                    <p className="text-xs font-bold text-rose-500">{errors.notes}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
