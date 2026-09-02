import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Syringe, User, Building2, FileText, Info, ArrowLeft, Save } from 'lucide-react';
import * as React from 'react';
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

interface Vaccination {
    id: number;
    pet_id: number;
    vet_id: number | null;
    vaccine_name: string;
    vaccination_date: string;
    next_due_date: string | null;
    vet_name: string | null;
    notes: string | null;
}

interface PageProps {
    pet: Pet;
    vaccination: Vaccination;
    vets: Vet[];
}

export default function EditVaccination({ pet, vaccination, vets }: PageProps) {
    const { data, setData, post, processing, errors, transform } = useForm({
        vaccine_name: vaccination.vaccine_name,
        vaccination_date: vaccination.vaccination_date,
        next_due_date: vaccination.next_due_date || '',
        vet_id: vaccination.vet_id?.toString() || (vaccination.vet_name ? 'other' : ''),
        vet_name: vaccination.vet_name || '',
        notes: vaccination.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            vet_id: data.vet_id === 'other' ? '' : data.vet_id,
        }));
        post(route('pets.vaccinations.update', [pet.id, vaccination.id]), {
            onSuccess: () => {
                toast.success('Vaccination record updated successfully.');
            }
        });
    };

    const breadcrumbs = [
        { title: 'My Pets', href: route('pets.index') },
        { title: pet.name, href: route('pets.index') },
        { title: 'Vaccinations', href: route('pets.vaccinations.index', pet.id) },
        { title: 'Edit Record', href: '#' },
    ];

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Edit Vaccination"
            subtitle={`Update immunization record for ${pet.name}`}
            actions={
                <div className="flex items-center gap-3">
                    <Link href={route('pets.vaccinations.index', pet.id)}>
                        <Button
                            variant="custom"
                            className="border border-[#e8ded1] hover:bg-[#fcfbf9] h-10 rounded-full px-5 text-xs font-bold transition-all text-woof-charcoal shadow-2xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        form="edit-vaccination-form"
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
            <Head title={`Edit Vaccination - ${pet.name}`} />

            <div className="pb-16 max-w-4xl mx-auto space-y-6">
                <form id="edit-vaccination-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Vaccine Information */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Syringe className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Vaccine Details</h3>
                                <p className="text-xs text-woof-charcoal/60">Immunization name, administration date and booster schedule</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="vaccine_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Vaccine Name <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="vaccine_name"
                                    value={data.vaccine_name}
                                    onChange={(e) => setData('vaccine_name', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    placeholder="e.g. Rabies (1-Year), DHPP, Bordetella"
                                    required
                                />
                                {errors.vaccine_name && (
                                    <p className="text-xs font-bold text-rose-500">{errors.vaccine_name}</p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="vaccination_date" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                        Date Administered <span className="text-rose-600">*</span>
                                    </Label>
                                    <Input
                                        id="vaccination_date"
                                        type="date"
                                        value={data.vaccination_date}
                                        onChange={(e) => setData('vaccination_date', e.target.value)}
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                        required
                                    />
                                    {errors.vaccination_date && (
                                        <p className="text-xs font-bold text-rose-500">{errors.vaccination_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="next_due_date" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                        Next Due Date / Booster
                                    </Label>
                                    <Input
                                        id="next_due_date"
                                        type="date"
                                        value={data.next_due_date}
                                        onChange={(e) => setData('next_due_date', e.target.value)}
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    />
                                    {errors.next_due_date && (
                                        <p className="text-xs font-bold text-rose-500">{errors.next_due_date}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Veterinary Clinic & Notes */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Provider & Notes</h3>
                                <p className="text-xs text-woof-charcoal/60">Veterinary provider details and batch/lot numbers</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Partner Veterinary Clinic</Label>
                                    <Select
                                        value={data.vet_id}
                                        onValueChange={(v) => {
                                            setData('vet_id', v);
                                            if (v !== 'other') {
                                                const selected = vets.find((vet) => vet.id.toString() === v);
                                                setData((prev) => ({
                                                    ...prev,
                                                    vet_id: v,
                                                    vet_name: selected ? selected.clinic_name : '',
                                                }));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                            <SelectValue placeholder="Choose clinic or other" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                            {vets.map((v) => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.clinic_name}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="other">Other / Independent Clinic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vet_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                        Provider / Clinic Name
                                    </Label>
                                    <Input
                                        id="vet_name"
                                        value={data.vet_name}
                                        onChange={(e) => setData('vet_name', e.target.value)}
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                        placeholder="e.g. Dr. Jane Smith / Metro Animal Care"
                                    />
                                    {errors.vet_name && (
                                        <p className="text-xs font-bold text-rose-500">{errors.vet_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Notes & Batch Number</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[90px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                                    placeholder="Batch/Lot #, manufacturer, reaction notes..."
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
