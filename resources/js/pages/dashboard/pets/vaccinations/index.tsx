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
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    FileText,
    History,
    Plus,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Trash2,
    User,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { formatDateShort } from '@/lib/time';

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
interface Vaccination {
    id: number;
    pet_id: number;
    vet_id: number | null;
    vaccine_name: string;
    vaccination_date: string;
    next_due_date: string | null;
    vet_name: string | null;
    notes: string | null;
    created_at: string;
    vet?: Vet;
}
interface PageProps {
    pet: Pet;
    vaccinations: Vaccination[];
    vets: Vet[];
}

export default function VaccinationIndex({ pet, vaccinations, vets }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<Vaccination | null>(null);

    const handleDelete = () => {
        if (selectedForDelete) {
            router.delete(route('pets.vaccinations.destroy', [pet.id, selectedForDelete.id]), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    toast.success('Vaccination record deleted successfully.');
                }
            });
        }
    };

    const isUpcoming = (dateStr: string | null) => {
        if (!dateStr) return false;
        return new Date(dateStr) > new Date();
    };
    const upcomingCount = vaccinations.filter((v) => isUpcoming(v.next_due_date)).length;

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'My Pets', href: route('pets.index') },
                { title: pet.name, href: route('pets.index') },
                { title: 'Vaccinations', href: '#' },
            ]}
            title={`${pet.name}'s Vaccinations`}
            subtitle="Immunization history, rabies records, and upcoming booster dates."
            actions={
                <Button
                    asChild
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                    <Link href={route('pets.vaccinations.create', pet.id)}>
                        <Plus className="h-4 w-4" />
                        Log Vaccine
                    </Link>
                </Button>
            }
        >
            <Head title={`${pet.name} - Vaccinations`} />

            <div className="mx-auto max-w-5xl space-y-8 pb-16">
                {/* Hero Profile Header */}
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
                                    Immunization Shield
                                </span>
                                <span className="text-woof-charcoal/30">•</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Active Protection
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">{pet.name}'s Vaccines</h1>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5 font-medium">{pet.breed.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center min-w-32">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50 mb-1">Total Logs</p>
                            <span className="text-2xl font-bold text-woof-charcoal">{vaccinations.length}</span>
                        </div>
                        <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center min-w-32">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">Due Soon</p>
                            <span className="text-2xl font-bold text-amber-700">{upcomingCount}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {vaccinations.length === 0 ? (
                    <div className="bg-white border border-[#e8ded1] rounded-3xl p-16 text-center shadow-xs flex flex-col items-center">
                        <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                            <Syringe className="h-8 w-8 text-woof-gold/40" />
                        </div>
                        <h2 className="text-base font-bold text-woof-charcoal mb-1">No Vaccine Records Yet</h2>
                        <p className="text-xs text-woof-charcoal/60 mb-6 max-w-md">
                            Keep {pet.name} safe against Parvovirus, Rabies, Distemper, and Kennel Cough. Automated reminders will notify you when boosters are due.
                        </p>
                        <Button
                            asChild
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 py-2.5 text-xs font-bold transition-all shadow-xs"
                        >
                            <Link href={route('pets.vaccinations.create', pet.id)}>
                                Log First Vaccine <ArrowRight className="ml-2 h-4 w-4 inline" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-2">
                                <History className="text-woof-gold h-4 w-4" /> Immunization Timeline
                            </h3>
                            <span className="text-xs text-woof-charcoal/50">{vaccinations.length} records</span>
                        </div>

                        <div className="grid gap-4">
                            {vaccinations.map((v) => (
                                <div
                                    key={v.id}
                                    className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                                            <Syringe className="h-5 w-5" />
                                        </div>

                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h4 className="text-base font-bold text-woof-charcoal">
                                                    {v.vaccine_name}
                                                </h4>
                                                {v.next_due_date && (
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                            isUpcoming(v.next_due_date)
                                                                ? 'border-amber-200 bg-amber-50 text-amber-800'
                                                                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                                        }`}
                                                    >
                                                        {isUpcoming(v.next_due_date) ? (
                                                            <>Next Due: {formatDateShort(v.next_due_date)}</>
                                                        ) : (
                                                            <>Immunized</>
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-woof-charcoal/60 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5 text-woof-gold" />
                                                    Administered: {formatDateShort(v.vaccination_date)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="h-3.5 w-3.5 text-woof-gold" />
                                                    {v.vet?.clinic_name || v.vet_name || 'Generic Clinic'}
                                                </span>
                                            </div>

                                            {v.notes && (
                                                <p className="text-xs text-woof-charcoal/70 bg-[#fcfbf9] rounded-2xl p-3 border border-[#e8ded1] mt-2">
                                                    "{v.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <Link
                                            href={route('pets.vaccinations.edit', [pet.id, v.id])}
                                            title="Edit record"
                                            className="text-woof-charcoal bg-[#fcfbf9] hover:bg-woof-charcoal hover:text-white border border-[#e8ded1] h-9 w-9 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedForDelete(v);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                            title="Delete vaccination"
                                            className="h-9 w-9 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl border border-[#e8ded1] bg-white p-8 shadow-xl">
                    <DialogTitle className="text-lg font-bold text-woof-charcoal flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                        Delete Vaccine Record?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-woof-charcoal/60 mt-1">
                        This vaccination history entry will be permanently deleted from {pet.name}'s records.
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
