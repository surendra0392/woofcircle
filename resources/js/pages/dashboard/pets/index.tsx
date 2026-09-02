import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Activity, Calendar, Crown, Dog, Edit2, History, MoreVertical, Plus, ShieldCheck, Sparkles, Trash2, FileText, QrCode, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import * as React from 'react';
import PetPassportCard from '@/components/pets/PetPassportCard';
import MedicalRecordExportModal from '@/components/pets/MedicalRecordExportModal';

interface Breed {
    id: number;
    name: string;
}
interface Pet {
    id: number;
    user_id: number;
    breed_id: number;
    name: string;
    gender: 'male' | 'female';
    date_of_birth: string | null;
    color: string | null;
    microchip_number: string | null;
    profile_image_url: string | null;
    passport_number?: string | null;
    notes: string | null;
    is_champion: boolean;
    awards_count: number;
    breed: Breed;
    is_lost?: boolean;
    lost_at?: string | null;
    lost_location?: string | null;
    lost_description?: string | null;
}
interface PageProps {
    pets: Pet[];
    breeds: Breed[];
    tier_info?: {
        tier_name: string;
        pet_count: number;
        max_pets: number;
        can_add_pet: boolean;
        is_unlimited: boolean;
    };
}

export default function PetIndex({ pets, breeds, tier_info }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedPetForDelete, setSelectedPetForDelete] = React.useState<Pet | null>(null);
    const [selectedPetPassport, setSelectedPetPassport] = React.useState<Pet | null>(null);
    const [selectedPetPdf, setSelectedPetPdf] = React.useState<Pet | null>(null);
    const [selectedPetForReportLost, setSelectedPetForReportLost] = React.useState<Pet | null>(null);
    const [lostLocation, setLostLocation] = React.useState('');
    const [lostDescription, setLostDescription] = React.useState('');

    const handleReportLostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPetForReportLost && lostLocation.trim()) {
            router.post(
                `/dashboard/pets/${selectedPetForReportLost.id}/report-lost`,
                {
                    lost_location: lostLocation,
                    lost_description: lostDescription,
                },
                {
                    onSuccess: () => {
                        setSelectedPetForReportLost(null);
                        setLostLocation('');
                        setLostDescription('');
                        toast.success(`${selectedPetForReportLost.name} has been reported as missing. Community alert active.`);
                    },
                }
            );
        }
    };

    const handleMarkFound = (pet: Pet) => {
        router.post(
            `/dashboard/pets/${pet.id}/mark-found`,
            {},
            {
                onSuccess: () => {
                    toast.success(`Great news! ${pet.name} has been marked as found.`);
                },
            }
        );
    };

    const handleDelete = () => {
        if (selectedPetForDelete) {
            router.delete(route('pets.destroy', selectedPetForDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    toast.success('Pet profile deleted successfully.');
                },
            });
        }
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Pets', href: '/dashboard/pets' },
            ]}
            title="My Pets"
            subtitle="Foundation for your dog's health journey"
            actions={
                <div className="flex items-center gap-3">
                    <Link
                        href="/settings/subscription"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-woof-gold/30 bg-woof-cream text-woof-charcoal hover:border-woof-gold hover:text-woof-gold transition-all text-[10px] font-bold uppercase tracking-wider"
                    >
                        <Crown className="h-3.5 w-3.5 text-woof-gold" />
                        <span>
                            {tier_info?.is_unlimited
                                ? `${tier_info.pet_count} Pets (Unlimited)`
                                : `${tier_info?.pet_count || pets.length}/${tier_info?.max_pets || 2} Free Slots`}
                        </span>
                    </Link>
                    {tier_info && !tier_info.can_add_pet ? (
                        <Button
                            asChild
                            variant="custom"
                            className="bg-woof-gold hover:bg-woof-champagne text-[#24221c] h-10 rounded-full px-5 text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                        >
                            <Link href="/settings/subscription">
                                <Crown className="mr-1.5 h-4 w-4" />
                                Upgrade for Unlimited
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            variant="custom"
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-10 rounded-full px-6 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                        >
                            <Link href={route('pets.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Pet
                            </Link>
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="My Pets" />
            <div className="pb-16">
                {pets.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                            <Dog className="h-8 w-8 text-woof-gold/40" />
                        </div>
                        <h3 className="text-woof-charcoal text-base font-bold">No pets added yet</h3>
                        <p className="text-woof-charcoal/60 mt-1 mb-6 text-xs max-w-sm">
                            Start your dog's health journey today by registering their digital profile and medical records.
                        </p>
                        <Button
                            asChild
                            variant="custom"
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-10 rounded-full px-6 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                        >
                            <Link href={route('pets.create')}>Add Your First Pet</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    <div className="bg-[#fcfbf9] relative aspect-[4/5] overflow-hidden border-b border-[#e8ded1]">
                                        {pet.profile_image_url ? (
                                            <img
                                                src={pet.profile_image_url}
                                                alt={pet.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="text-woof-charcoal/20 flex h-full w-full items-center justify-center">
                                                <Dog className="h-16 w-16 text-woof-gold/30" />
                                            </div>
                                        )}
                                        <div className="from-woof-charcoal/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80" />

                                        {pet.is_lost && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <Badge className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold text-white uppercase shadow-md animate-pulse">
                                                    <AlertTriangle className="mr-1 h-3 w-3 inline" /> Missing
                                                </Badge>
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Open actions menu"
                                                        className="text-woof-charcoal hover:bg-white h-8 w-8 rounded-full border border-[#e8ded1] bg-white/90 shadow-xs backdrop-blur-md transition-all cursor-pointer"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="border-[#e8ded1] rounded-2xl p-1.5 bg-white shadow-md min-w-40">
                                                    <DropdownMenuItem
                                                        asChild
                                                        className="rounded-xl py-2 text-xs font-bold cursor-pointer text-woof-charcoal"
                                                    >
                                                        <Link href={route('pets.edit', pet.id)}>
                                                            <Edit2 className="mr-2 h-3.5 w-3.5 text-woof-gold" /> Edit Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedPetForDelete(pet);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                        className="rounded-xl py-2 text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove Pet
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="absolute right-5 bottom-5 left-5 text-white">
                                            <Badge
                                                className={`mb-2 rounded-full border-none px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider ${pet.gender === 'male' ? 'bg-sky-600' : 'bg-rose-500'}`}
                                            >
                                                {pet.gender}
                                            </Badge>
                                            <h3 className="text-xl font-bold tracking-tight">{pet.name}</h3>
                                            <p className="mt-0.5 text-xs font-medium text-white/80">{pet.breed.name}</p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-6 grid grid-cols-2 gap-3">
                                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-3.5 text-center">
                                                <span className="text-woof-charcoal/50 mb-0.5 block text-[10px] font-bold uppercase tracking-wider">
                                                    Age
                                                </span>
                                                <span className="text-woof-charcoal text-xs font-bold">
                                                    {pet.date_of_birth
                                                        ? new Date().getFullYear() - new Date(pet.date_of_birth).getFullYear() + ' Years'
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-3.5 text-center">
                                                <span className="text-woof-charcoal/50 mb-0.5 block text-[10px] font-bold uppercase tracking-wider">
                                                    Color
                                                </span>
                                                <span className="text-woof-charcoal block truncate text-xs font-bold">{pet.color || 'Standard'}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="border-b border-[#e8ded1] flex items-center gap-2 pb-2.5">
                                                <Activity className="text-woof-gold h-4 w-4" />
                                                <span className="text-woof-charcoal text-[10px] font-bold uppercase tracking-wider">
                                                    Health Ecosystem
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <Button
                                                    variant="custom"
                                                    title="View vaccinations"
                                                    className="border border-[#e8ded1] hover:border-woof-gold hover:bg-[#fcfbf9] text-woof-charcoal group flex h-12 flex-col items-center justify-center gap-1 rounded-2xl bg-white p-0 transition-all cursor-pointer shadow-2xs"
                                                    onClick={() => router.get(route('pets.vaccinations.index', pet.id))}
                                                >
                                                    <ShieldCheck className="h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110" />
                                                    <span className="text-[9px] font-bold tracking-wider uppercase">Vaccines</span>
                                                </Button>
                                                <Button
                                                    variant="custom"
                                                    title="View medical records"
                                                    className="border border-[#e8ded1] hover:border-woof-gold hover:bg-[#fcfbf9] text-woof-charcoal group flex h-12 flex-col items-center justify-center gap-1 rounded-2xl bg-white p-0 transition-all cursor-pointer shadow-2xs"
                                                    onClick={() => router.get(route('pets.medical-records.index', pet.id))}
                                                >
                                                    <History className="h-4 w-4 text-amber-600 transition-transform group-hover:scale-110" />
                                                    <span className="text-[9px] font-bold tracking-wider uppercase">Medical</span>
                                                </Button>
                                                <Button
                                                    variant="custom"
                                                    title="View scheduled appointments"
                                                    className="border border-[#e8ded1] hover:border-woof-gold hover:bg-[#fcfbf9] text-woof-charcoal group flex h-12 flex-col items-center justify-center gap-1 rounded-2xl bg-white p-0 transition-all cursor-pointer shadow-2xs"
                                                    onClick={() => router.get(route('pets.appointments.index', pet.id))}
                                                >
                                                    <Calendar className="h-4 w-4 text-sky-600 transition-transform group-hover:scale-110" />
                                                    <span className="text-[9px] font-bold tracking-wider uppercase">Visits</span>
                                                </Button>
                                            </div>

                                            {/* Digital Pet Passport & PDF Export Quick Bar */}
                                            <div className="pt-2 grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="custom"
                                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white text-[10px] font-bold uppercase tracking-wider h-9 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                                    onClick={() => setSelectedPetPassport(pet)}
                                                >
                                                    <QrCode className="h-3.5 w-3.5" /> Passport
                                                </Button>

                                                <Button
                                                    variant="custom"
                                                    className="border border-[#e8ded1] bg-[#fcfbf9] hover:border-woof-gold text-woof-charcoal text-[10px] font-bold uppercase tracking-wider h-9 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedPetPdf(pet)}
                                                >
                                                    <FileText className="h-3.5 w-3.5 text-woof-gold" /> Export PDF
                                                </Button>
                                            </div>

                                            {/* Lost Pet Status Action */}
                                            <div className="pt-1">
                                                {pet.is_lost ? (
                                                    <Button
                                                        variant="custom"
                                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider h-9 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                                        onClick={() => handleMarkFound(pet)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" /> Mark as Found
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="custom"
                                                        className="w-full border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-[10px] font-bold uppercase tracking-wider h-9 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedPetForReportLost(pet);
                                                            setLostLocation('');
                                                            setLostDescription('');
                                                        }}
                                                    >
                                                        <AlertTriangle className="h-4 w-4" /> Report Missing
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="border-[#e8ded1] bg-white max-w-md rounded-3xl p-8 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-woof-charcoal text-xl font-bold tracking-tight">Remove Pet Profile?</DialogTitle>
                        <DialogDescription className="text-woof-charcoal/60 mt-1 text-xs leading-relaxed">
                            This action will permanently delete this pet profile and its associated health data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-4 py-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600">
                            <Trash2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-woof-charcoal font-bold">{selectedPetForDelete?.name}</h4>
                            <p className="text-woof-charcoal/50 text-xs">{selectedPetForDelete?.breed?.name}</p>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2.5">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="border border-[#e8ded1] rounded-full px-5 text-xs font-bold text-woof-charcoal"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="h-10 rounded-full bg-rose-600 px-6 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
                        >
                            Yes, Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Digital Passport Modal Dialog */}
            <Dialog open={!!selectedPetPassport} onOpenChange={(open) => !open && setSelectedPetPassport(null)}>
                <DialogContent className="border-none bg-transparent p-0 max-w-2xl shadow-none">
                    <DialogTitle className="sr-only">Digital Pet Passport</DialogTitle>
                    {selectedPetPassport && (
                        <PetPassportCard
                            pet={{
                                id: selectedPetPassport.id,
                                name: selectedPetPassport.name,
                                passport_number: selectedPetPassport.passport_number || 'WCTG 1578 5792 57985',
                                gender: selectedPetPassport.gender,
                                date_of_birth: selectedPetPassport.date_of_birth || undefined,
                                color: selectedPetPassport.color || undefined,
                                profile_image_url: selectedPetPassport.profile_image_url || undefined,
                                is_champion: selectedPetPassport.is_champion,
                                breed: selectedPetPassport.breed,
                            }}
                            onExportPdf={() => {
                                setSelectedPetPdf(selectedPetPassport);
                                setSelectedPetPassport(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Medical Record PDF Export Modal */}
            {selectedPetPdf && (
                <MedicalRecordExportModal
                    isOpen={!!selectedPetPdf}
                    onClose={() => setSelectedPetPdf(null)}
                    pet={{
                        name: selectedPetPdf.name,
                        passport_number: selectedPetPdf.passport_number || 'WCTG 1578 5792 57985',
                        breed_name: selectedPetPdf.breed.name,
                        gender: selectedPetPdf.gender,
                        date_of_birth: selectedPetPdf.date_of_birth || undefined,
                    }}
                />
            )}

            {/* Report Lost Pet Dialog Modal */}
            <Dialog open={!!selectedPetForReportLost} onOpenChange={(open) => !open && setSelectedPetForReportLost(null)}>
                <DialogContent className="border-[#e8ded1] bg-white max-w-md rounded-3xl p-8 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-woof-charcoal text-lg font-bold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-600" />
                            Report {selectedPetForReportLost?.name} as Missing
                        </DialogTitle>
                        <DialogDescription className="text-woof-charcoal/60 mt-1 text-xs">
                            This will activate a public alert on the Lost Pet Network to notify local community members.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReportLostSubmit} className="space-y-4 py-4">
                        <div>
                            <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block mb-1.5">
                                Last Seen Location <span className="text-rose-600">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-woof-gold" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Sydney Central Park, NSW"
                                    value={lostLocation}
                                    onChange={(e) => setLostLocation(e.target.value)}
                                    className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 pr-4 py-2.5 text-xs text-woof-charcoal focus:border-woof-gold focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block mb-1.5">
                                Additional Details / Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="e.g. Wearing a red collar, microchipped, skittish..."
                                value={lostDescription}
                                onChange={(e) => setLostDescription(e.target.value)}
                                className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs text-woof-charcoal focus:border-woof-gold focus:outline-none"
                            />
                        </div>
                        <DialogFooter className="pt-3 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setSelectedPetForReportLost(null)}
                                className="rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold px-6 shadow-xs"
                            >
                                Submit Report
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
