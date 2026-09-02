import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    Building2,
    Calendar,
    ClipboardList,
    Edit2,
    FileText,
    History,
    Microscope,
    Pill,
    Plus,
    Scissors,
    ShieldCheck,
    Stethoscope,
    Thermometer,
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
    metadata: Record<string, unknown> | null;
    created_at: string;
}
interface PageProps {
    pet: Pet;
    records: MedicalRecord[];
    recordTypes: string[];
    vets: Vet[];
}

export default function MedicalRecordsIndex({ pet, records, recordTypes, vets }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<MedicalRecord | null>(null);

    const handleDelete = () => {
        if (selectedForDelete) {
            router.delete(route('pets.medical-records.destroy', [pet.id, selectedForDelete.id]), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    toast.success('Medical record deleted successfully.');
                },
            });
        }
    };

    const getRecordIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'injury':
                return <AlertTriangle className="h-5 w-5" />;
            case 'surgery':
                return <Scissors className="h-5 w-5" />;
            case 'illness':
                return <Thermometer className="h-5 w-5" />;
            case 'allergy':
                return <Activity className="h-5 w-5" />;
            case 'treatment':
                return <Pill className="h-5 w-5" />;
            case 'general':
                return <ClipboardList className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    const getRecordBadge = (type: string) => {
        switch (type.toLowerCase()) {
            case 'injury':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            case 'surgery':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'illness':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'allergy':
                return 'bg-orange-50 text-orange-800 border-orange-200';
            case 'treatment':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            default:
                return 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]';
        }
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'My Pets', href: route('pets.index') },
                { title: pet.name, href: route('pets.index') },
                { title: 'Medical Records', href: '#' },
            ]}
            title={`${pet.name}'s Medical Records`}
            subtitle="Comprehensive health timeline and clinical history."
            actions={
                <Button
                    asChild
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                    <Link href={route('pets.medical-records.create', pet.id)}>
                        <Plus className="h-4 w-4" />
                        New Record
                    </Link>
                </Button>
            }
        >
            <Head title={`${pet.name} - Medical Records`} />

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
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold">
                                    Clinical Dossier
                                </span>
                                <span className="text-woof-charcoal/30">•</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Verified Registry
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">{pet.name}'s Records</h1>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5 font-medium">{pet.breed.name}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center min-w-44">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50 mb-1">Total Entries</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-woof-charcoal">{records.length}</span>
                            <History className="text-woof-gold h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* Medical Records List */}
                <div className="space-y-4">
                    {records.length === 0 ? (
                        <div className="bg-white border border-[#e8ded1] rounded-3xl p-16 text-center shadow-xs flex flex-col items-center">
                            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                                <ClipboardList className="h-8 w-8 text-woof-gold/40" />
                            </div>
                            <h2 className="text-base font-bold text-woof-charcoal mb-1">No Medical Records Yet</h2>
                            <p className="text-xs text-woof-charcoal/60 mb-6 max-w-md">
                                Build a lifetime medical registry for {pet.name}. Track surgical interventions, illnesses, allergies, and prescriptions.
                            </p>
                            <Button
                                asChild
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 py-2.5 text-xs font-bold transition-all shadow-xs"
                            >
                                <Link href={route('pets.medical-records.create', pet.id)}>
                                    Register First Entry
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {records.map((record) => (
                                <div
                                    key={record.id}
                                    className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all flex flex-col gap-4"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                                                {getRecordIcon(record.record_type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRecordBadge(record.record_type)}`}>
                                                        {record.record_type}
                                                    </span>
                                                    {record.diagnosis_date && (
                                                        <span className="text-xs text-woof-charcoal/50 flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5 text-woof-gold" />
                                                            {new Date(record.diagnosis_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-woof-charcoal mt-1">
                                                    {record.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <Link
                                                href={route('pets.medical-records.edit', [pet.id, record.id])}
                                                title="Edit medical record"
                                                className="text-woof-charcoal bg-[#fcfbf9] hover:bg-woof-charcoal hover:text-white border border-[#e8ded1] h-9 w-9 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedForDelete(record);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                title="Delete record"
                                                className="h-9 w-9 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-2 pt-2 border-t border-[#e8ded1]">
                                        <div className="space-y-2">
                                            <p className="text-xs text-woof-charcoal/80 leading-relaxed font-normal">
                                                {record.description || 'No detailed notes provided.'}
                                            </p>
                                            {(record.doctor_name || record.clinic_name) && (
                                                <div className="flex flex-wrap gap-2 pt-1 text-xs text-woof-charcoal/60">
                                                    {record.clinic_name && (
                                                        <span className="flex items-center gap-1 bg-[#fcfbf9] border border-[#e8ded1] px-3 py-1 rounded-full">
                                                            <Building2 className="h-3.5 w-3.5 text-woof-gold" />
                                                            {record.clinic_name}
                                                        </span>
                                                    )}
                                                    {record.doctor_name && (
                                                        <span className="flex items-center gap-1 bg-[#fcfbf9] border border-[#e8ded1] px-3 py-1 rounded-full">
                                                            <Stethoscope className="h-3.5 w-3.5 text-woof-gold" />
                                                            Dr. {record.doctor_name}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 space-y-2">
                                            <div className="text-woof-gold flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                                                <Pill className="h-3.5 w-3.5" /> Prescription & Medications
                                            </div>
                                            <p className="text-xs text-woof-charcoal font-medium">
                                                {record.prescription || 'No active prescriptions recorded.'}
                                            </p>
                                            {record.notes && (
                                                <p className="text-xs text-woof-charcoal/60 pt-1 border-t border-[#e8ded1]/50">
                                                    "{record.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl border border-[#e8ded1] bg-white p-8 shadow-xl">
                    <DialogTitle className="text-lg font-bold text-woof-charcoal flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                        Delete Medical Record?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-woof-charcoal/60 mt-1">
                        This clinical history entry will be permanently removed from {pet.name}'s passport.
                    </DialogDescription>
                    <div className="flex justify-end gap-2.5 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 shadow-xs"
                        >
                            Delete Record
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
