import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    BadgeCheck,
    CheckCircle2,
    Clock,
    Dog,
    Edit2,
    Image as ImageIcon,
    Images,
    IndianRupee,
    MapPin,
    Plus,
    ShieldCheck,
    Syringe,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface LitterImage {
    id: number;
    image_url: string;
}

interface Litter {
    id: number;
    title: string;
    description: string;
    price: string | null;
    price_min: string | null;
    price_max: string | null;
    age: string | null;
    kci_registered: boolean;
    is_vaccinated: boolean;
    is_negotiable: boolean;
    status: string;
    is_available: boolean;
    is_approved: boolean;
    featured_image_url: string | null;
    breed: { name: string };
    state: { name: string };
    city: { name: string };
    images: LitterImage[];
}

interface PageProps {
    litters: Litter[];
}

export default function BreederLittersIndex({ litters }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedLitter, setSelectedLitter] = useState<Litter | null>(null);

    const handleDelete = () => {
        if (selectedLitter) {
            router.delete(route('breeder.litters.destroy', selectedLitter.id), {
                onSuccess: () => setIsDeleteDialogOpen(false),
            });
        }
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Litters', href: '/dashboard/breeder/litters' },
            ]}
            title="My Litters"
            subtitle="Manage your puppy marketplace listings and health passports"
            actions={
                <Link href={route('breeder.litters.create')}>
                    <Button className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-11 px-6 transition-all shadow-xs cursor-pointer flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Post New Litter
                    </Button>
                </Link>
            }
        >
            <Head title="My Litter Listings" />

            <div className="space-y-8 pb-16">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {litters.map((litter) => (
                        <div
                            key={litter.id}
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs transition-all hover:shadow-md hover:border-woof-gold/40"
                        >
                            {/* Status Badges Overlay */}
                            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                                {!litter.is_approved ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-bold text-amber-800 shadow-2xs backdrop-blur-xs">
                                        <Clock className="h-3 w-3" /> Pending Review
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold text-emerald-800 shadow-2xs backdrop-blur-xs">
                                        <CheckCircle2 className="h-3 w-3" /> Approved
                                    </span>
                                )}

                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-2xs border ${
                                        litter.status === 'published'
                                            ? 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]'
                                            : litter.status === 'draft'
                                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                                              : litter.status === 'reserved'
                                                ? 'bg-amber-100 text-amber-900 border-amber-200'
                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                                >
                                    {litter.status}
                                </span>

                                {!litter.is_available && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[10px] font-bold text-rose-700 shadow-2xs">
                                        <XCircle className="h-3 w-3" /> Sold Out
                                    </span>
                                )}
                            </div>

                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#fcfbf9] border-b border-[#e8ded1]">
                                {litter.featured_image_url ? (
                                    <img
                                        src={litter.featured_image_url}
                                        alt={litter.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : litter.images.length > 0 ? (
                                    <img
                                        src={litter.images[0].image_url}
                                        alt={litter.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-woof-charcoal/30">
                                        <ImageIcon className="h-12 w-12 opacity-30" />
                                    </div>
                                )}

                                {litter.images.length > 1 && (
                                    <div className="absolute right-3.5 bottom-3.5 flex items-center gap-1 rounded-full bg-woof-charcoal/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-2xs backdrop-blur-xs">
                                        <Images className="h-3 w-3" /> +{litter.images.length - 1} Photos
                                    </div>
                                )}

                                <div className="absolute bottom-3.5 left-3.5 flex gap-1.5">
                                    {litter.kci_registered && (
                                        <div className="rounded-full bg-woof-cream border border-[#e8ded1] p-1.5 shadow-2xs" title="KCI Registered Lineage">
                                            <BadgeCheck className="h-4 w-4 text-woof-gold" />
                                        </div>
                                    )}

                                    {litter.is_vaccinated && (
                                        <div className="rounded-full bg-emerald-50 border border-emerald-200 p-1.5 shadow-2xs" title="Vaccinated">
                                            <Syringe className="h-4 w-4 text-emerald-700" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6 space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold">
                                        {litter.breed.name}
                                    </span>
                                    <h3 className="line-clamp-1 text-base font-bold text-woof-charcoal mt-0.5 group-hover:text-woof-gold transition-colors">
                                        {litter.title}
                                    </h3>
                                </div>

                                <div className="space-y-2 border-t border-[#e8ded1] pt-3">
                                    <div className="flex items-center justify-between text-xs text-woof-charcoal/60">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-woof-gold" />
                                            <span>{litter.city.name}, {litter.state.name}</span>
                                        </div>

                                        {litter.age && (
                                            <span className="text-[10px] font-bold uppercase text-woof-charcoal/50 bg-[#fcfbf9] px-2 py-0.5 rounded-full border border-[#e8ded1]">
                                                {litter.age}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-1 text-base font-bold text-woof-charcoal">
                                            <IndianRupee className="h-4 w-4 text-woof-gold" />
                                            <span>
                                                {litter.price_min ? parseFloat(litter.price_min).toLocaleString('en-IN') : 'TBD'} -{' '}
                                                {litter.price_max ? parseFloat(litter.price_max).toLocaleString('en-IN') : 'TBD'}
                                            </span>
                                        </div>

                                        {litter.is_negotiable && (
                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                Negotiable
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-2 pt-3 border-t border-[#e8ded1]">
                                    <Link href={route('breeder.litters.health-records.index', litter.id)} className="block">
                                        <Button
                                            variant="outline"
                                            className="h-10 w-full rounded-full border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-xs font-bold text-woof-charcoal shadow-2xs transition-all gap-1.5 cursor-pointer"
                                        >
                                            <ShieldCheck className="h-3.5 w-3.5 text-woof-gold" /> Puppy Health Passport
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <Link href={route('breeder.litters.edit', litter.id)} className="flex-1">
                                            <Button
                                                className="h-10 w-full rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white text-xs font-bold shadow-xs transition-all gap-1.5 cursor-pointer"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" /> Edit Listing
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                                            onClick={() => {
                                                setSelectedLitter(litter);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {litters.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#e8ded1] bg-white py-20 px-6 text-center shadow-xs">
                            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold mb-4">
                                <Dog className="h-8 w-8" />
                            </div>
                            <h3 className="text-base font-bold text-woof-charcoal">No Active Litters</h3>
                            <p className="mt-1 text-xs text-woof-charcoal/60 max-w-sm">
                                Create your first puppy listing to showcase your breed lineage, medical passports, and pricing to verified families.
                            </p>

                            <Link href={route('breeder.litters.create')} className="mt-6">
                                <Button className="h-11 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-8 text-xs font-bold shadow-xs transition-all cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" /> Create First Listing
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 max-w-md shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-rose-700">Delete Listing?</DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/70 mt-2">
                            Are you sure you want to delete <span className="font-bold text-woof-charcoal">{selectedLitter?.title}</span>? This will permanently remove this litter from the WoofCircle marketplace.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-6 flex gap-3 border-t border-[#e8ded1]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-full border-[#e8ded1] bg-[#fcfbf9] text-xs font-bold text-woof-charcoal h-10 px-5"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-10 px-6 cursor-pointer"
                        >
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
