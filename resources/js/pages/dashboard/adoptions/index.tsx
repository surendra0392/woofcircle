import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Dog, Edit2, Heart, Image as ImageIcon, IndianRupee, MapPin, MoreVertical, Plus, ShieldCheck, Trash2 } from 'lucide-react';

interface AdoptionImage {
    id: number;
    image_url: string;
}

interface Adoption {
    id: number;
    title: string;
    slug: string;
    breed: { name: string };
    state: { name: string };
    city: { name: string };
    gender: 'male' | 'female';
    status: string;
    is_approved: boolean;
    is_available: boolean;
    fee: string | null;
    featured_image_url: string | null;
    created_at: string;
    images: AdoptionImage[];
}

interface Props {
    adoptions: { data: Adoption[]; links: any[]; total: number };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Adoptions', href: '/dashboard/adoptions' },
];

export default function AdoptionIndex({ adoptions }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this adoption listing?')) {
            router.delete(route('dashboard.adoptions.destroy', id));
        }
    };

    const getStatusBadge = (adoption: Adoption) => {
        if (!adoption.is_approved) {
            return (
                <Badge className="border-amber-200 bg-amber-50 text-amber-800 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Pending Approval
                </Badge>
            );
        }
        if (!adoption.is_available) {
            return (
                <Badge className="border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal/60 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Adopted / Found Home
                </Badge>
            );
        }
        return (
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Active Listing
            </Badge>
        );
    };

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="My Adoptions"
            subtitle="Manage your adoption listings and find loving homes for companions"
            actions={
                <Link href={route('dashboard.adoptions.create')}>
                    <Button className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-6 text-xs font-bold text-white shadow-xs transition-all cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" /> List for Adoption
                    </Button>
                </Link>
            }
        >
            <Head title="My Adoptions" />

            <div className="flex w-full flex-col gap-8 pb-16">
                {adoptions.data.length > 0 ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {adoptions.data.map((adoption: any) => (
                                <div
                                    key={adoption.id}
                                    className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="bg-[#fcfbf9] relative aspect-[4/3] w-full overflow-hidden border-b border-[#e8ded1]">
                                            {adoption.featured_image_url ? (
                                                <img
                                                    src={adoption.featured_image_url}
                                                    alt={adoption.title}
                                                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="text-woof-charcoal/20 flex h-full w-full flex-col items-center justify-center">
                                                    <ImageIcon className="mb-2 h-10 w-10 text-woof-gold/30" />
                                                    <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/40">No photo uploaded</span>
                                                </div>
                                            )}

                                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">{getStatusBadge(adoption)}</div>

                                            <div className="absolute top-4 right-4 z-10">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-woof-charcoal hover:bg-white h-8 w-8 rounded-full border border-[#e8ded1] bg-white/90 shadow-xs backdrop-blur-md transition-all cursor-pointer"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="border-[#e8ded1] rounded-2xl p-1.5 bg-white shadow-md min-w-40"
                                                    >
                                                        <DropdownMenuItem asChild className="rounded-xl py-2 text-xs font-bold cursor-pointer text-woof-charcoal">
                                                            <Link
                                                                href={route('dashboard.adoptions.edit', adoption.id)}
                                                                className="flex items-center gap-2.5"
                                                            >
                                                                <Edit2 className="h-3.5 w-3.5 text-woof-gold" />
                                                                Edit Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl py-2 text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                                                            onClick={() => handleDelete(adoption.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                                                            Remove Listing
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="absolute bottom-4 left-4">
                                                <div className="text-woof-charcoal flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-md border border-[#e8ded1]">
                                                    <Dog className="text-woof-gold h-3.5 w-3.5" />
                                                    {adoption.breed.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-6">
                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold text-woof-charcoal group-hover:text-woof-gold line-clamp-1 transition-colors">
                                                    {adoption.title}
                                                </h3>
                                                <div className="text-xs text-woof-charcoal/60 flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-woof-gold" /> {adoption.city.name}, {adoption.state.name}
                                                </div>
                                            </div>

                                            <div className="border-[#e8ded1] flex items-center justify-between border-t pt-4">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/40">
                                                        Adoption Fee
                                                    </span>
                                                    <div className="text-sm font-bold text-woof-charcoal flex items-center gap-1">
                                                        {adoption.fee && parseFloat(adoption.fee) > 0 ? (
                                                            <>
                                                                <IndianRupee className="text-woof-gold h-3.5 w-3.5" />
                                                                <span>{parseFloat(adoption.fee).toLocaleString('en-IN')}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-emerald-700 font-bold">Complimentary</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end space-y-0.5">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/40">
                                                        Gender
                                                    </span>
                                                    <span
                                                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                                            adoption.gender === 'male'
                                                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                                                        }`}
                                                    >
                                                        {adoption.gender}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0">
                                        <Link href={route('dashboard.adoptions.edit', adoption.id)} className="block">
                                            <Button
                                                variant="outline"
                                                className="border-[#e8ded1] hover:border-woof-gold hover:bg-[#fcfbf9] text-woof-charcoal w-full rounded-full py-2 text-xs font-bold transition-all"
                                            >
                                                Manage Listing <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-[#e8ded1] flex justify-center border-t pt-8">
                            <Pagination links={adoptions.links} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                            <Heart className="h-8 w-8 text-woof-gold/40" />
                        </div>
                        <h3 className="text-woof-charcoal text-base font-bold">No adoption listings yet</h3>
                        <p className="text-woof-charcoal/60 mt-1 mb-6 text-xs max-w-sm">
                            Help a dog in need by creating a free adoption listing and connecting with responsible adopters.
                        </p>
                        <Link href={route('dashboard.adoptions.create')}>
                            <Button className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-6 text-xs font-bold text-white transition-all shadow-xs cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" /> Create First Listing
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
