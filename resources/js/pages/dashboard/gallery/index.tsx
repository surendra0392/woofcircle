import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Camera, Edit2, FolderOpen, Heart, Image as ImageIcon, MapPin, MoreVertical, Plus, Share2, Download, Trash2, X, AlertCircle, Search } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
}

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface GalleryImage {
    id: number;
    url: string;
    caption: string | null;
}

interface Gallery {
    id: number;
    slug: string;
    title: string | null;
    description: string | null;
    image: string | null;
    main_image_url: string;
    category_id: number | null;
    state_id: number | null;
    city_id: number | null;
    is_active: boolean;
    likes_count: number;
    shares_count: number;
    exports_count: number;
    category?: Category;
    state?: State;
    city?: City;
    images: GalleryImage[];
}

interface PageProps {
    items: {
        data: Gallery[];
        links: any[];
        meta?: any;
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    states: State[];
    cities: City[];
    filters: {
        search?: string;
        category_id?: string;
        state_id?: string;
        city_id?: string;
    };
}

export default function GalleryIndex({ items, categories, states, cities, filters }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedGalleryForDelete, setSelectedGalleryForDelete] = useState<Gallery | null>(null);

    // Filtered Cities list based on selected state
    const [filteredCities, setFilteredCities] = useState<City[]>(cities);

    // Filters form
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [catFilter, setCatFilter] = useState(filters.category_id || 'all');
    const [stateFilter, setStateFilter] = useState(filters.state_id || 'all');
    const [cityFilter, setCityFilter] = useState(filters.city_id || 'all');

    React.useEffect(() => {
        if (stateFilter && stateFilter !== 'all') {
            setFilteredCities(cities.filter(c => c.state_id.toString() === stateFilter));
        } else {
            setFilteredCities(cities);
        }
    }, [stateFilter, cities]);

    const handleFilterChange = (key: string, value: string) => {
        const queryParams: any = {
            search: searchVal,
            category_id: catFilter,
            state_id: stateFilter,
            city_id: cityFilter,
        };

        queryParams[key] = value;

        router.get(route('dashboard.gallery.index'), queryParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteGallery = () => {
        if (selectedGalleryForDelete) {
            router.delete(route('dashboard.gallery.destroy', selectedGalleryForDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    toast.success('Gallery deleted successfully.');
                },
            });
        }
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Galleries', href: '/dashboard/gallery' },
            ]}
            title="My Galleries"
            subtitle="Showcase your dogs, albums, and memorable moments with the community"
            actions={
                <Link
                    href={route('dashboard.gallery.create')}
                    title="Create a new gallery showcase"
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white h-10 rounded-full px-6 text-xs font-bold shadow-xs transition-all inline-flex items-center justify-center cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Gallery
                </Link>
            }
        >
            <Head title="My Galleries" />

            <div className="pb-16 max-w-7xl mx-auto space-y-6">
                {/* Search & Filters Card */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="search-input" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Search Title</Label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-woof-gold" />
                                <Input
                                    id="search-input"
                                    placeholder="Filter by title..."
                                    value={searchVal}
                                    onChange={(e) => {
                                        setSearchVal(e.target.value);
                                        handleFilterChange('search', e.target.value);
                                    }}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl pl-10 text-xs text-woof-charcoal font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Category</Label>
                            <Select
                                value={catFilter}
                                onValueChange={(val) => {
                                    setCatFilter(val);
                                    handleFilterChange('category_id', val);
                                }}
                            >
                                <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl text-xs text-woof-charcoal font-medium">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">State</Label>
                            <Select
                                value={stateFilter}
                                onValueChange={(val) => {
                                    setStateFilter(val);
                                    handleFilterChange('state_id', val);
                                }}
                            >
                                <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl text-xs text-woof-charcoal font-medium">
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                    <SelectItem value="all">All States</SelectItem>
                                    {states.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">City</Label>
                            <Select
                                value={cityFilter}
                                onValueChange={(val) => {
                                    setCityFilter(val);
                                    handleFilterChange('city_id', val);
                                }}
                            >
                                <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl text-xs text-woof-charcoal font-medium">
                                    <SelectValue placeholder="All Cities" />
                                </SelectTrigger>
                                <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {filteredCities.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Galleries Grid */}
                {items.data.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col items-center justify-center py-24 px-6 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                            <FolderOpen className="h-8 w-8 text-woof-gold/40" />
                        </div>
                        <h3 className="text-woof-charcoal text-base font-bold">No Galleries Found</h3>
                        <p className="text-woof-charcoal/60 mt-1 mb-6 text-xs max-w-sm">
                            Create your first photo gallery showcase to highlight your companions, dog shows, and moments.
                        </p>
                        <Link
                            href={route('dashboard.gallery.create')}
                            title="Create your first gallery album"
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 py-2.5 text-xs font-bold transition-all shadow-xs inline-flex items-center justify-center cursor-pointer"
                        >
                            Create Your First Gallery
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.data.map((gallery) => (
                            <div
                                key={gallery.id}
                                className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
                            >
                                <div>
                                    {/* Thumbnail Header */}
                                    <div className="bg-[#fcfbf9] relative aspect-[4/3] overflow-hidden border-b border-[#e8ded1]">
                                        {gallery.main_image_url ? (
                                            <img
                                                src={gallery.main_image_url}
                                                alt={gallery.title || ''}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="text-woof-gold/30 flex h-full w-full items-center justify-center">
                                                <ImageIcon className="h-16 w-16" />
                                            </div>
                                        )}

                                        <div className="from-woof-charcoal/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-70" />

                                        {/* Action Dropdown Menu */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Open gallery menu"
                                                        className="text-woof-charcoal hover:bg-white h-8 w-8 rounded-full border border-[#e8ded1] bg-white/90 shadow-xs backdrop-blur-md transition-all cursor-pointer"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="border-[#e8ded1] rounded-2xl p-1.5 bg-white shadow-md min-w-40">
                                                    <DropdownMenuItem asChild className="rounded-xl py-2 text-xs font-bold cursor-pointer text-woof-charcoal">
                                                        <Link href={route('dashboard.gallery.edit', gallery.id)}>
                                                            <Edit2 className="mr-2 h-3.5 w-3.5 text-woof-gold" /> Edit Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {gallery.is_active && (
                                                        <DropdownMenuItem asChild className="rounded-xl py-2 text-xs font-bold cursor-pointer text-woof-charcoal">
                                                            <Link href={`/community/gallery/${gallery.slug}`}>
                                                                <ImageIcon className="mr-2 h-3.5 w-3.5 text-woof-gold" /> View Public Page
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedGalleryForDelete(gallery);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                        className="rounded-xl py-2 text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Gallery
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Meta status badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <Badge
                                                className={`rounded-full border-none px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${gallery.is_active ? 'bg-emerald-600 text-white shadow-xs' : 'bg-amber-500 text-white shadow-xs'}`}
                                            >
                                                {gallery.is_active ? 'Live & Published' : 'Pending Review'}
                                            </Badge>
                                        </div>

                                        {/* Category and Title */}
                                        <div className="absolute right-5 bottom-5 left-5 text-white">
                                            {gallery.category && (
                                                <span className="mb-1.5 inline-block bg-white/20 backdrop-blur-md text-white rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                                    {gallery.category.name}
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold tracking-tight text-white line-clamp-1">{gallery.title || 'Untitled Album'}</h3>
                                        </div>
                                    </div>

                                    {/* Details Body */}
                                    <div className="p-6 space-y-4">
                                        <p className="text-xs text-woof-charcoal/70 leading-relaxed line-clamp-2">
                                            {gallery.description || 'No description provided for this album.'}
                                        </p>

                                        {(gallery.state || gallery.city) && (
                                            <div className="flex items-center gap-1.5 text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider">
                                                <MapPin className="h-3.5 w-3.5 text-woof-gold" />
                                                <span>
                                                    {[gallery.city?.name, gallery.state?.name].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 pt-0 border-t border-[#e8ded1] mt-4 pt-4">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-[#fcfbf9] border border-[#e8ded1] py-2 rounded-2xl flex flex-col items-center justify-center gap-0.5">
                                            <Heart className="h-3.5 w-3.5 text-rose-500" />
                                            <span className="text-xs font-bold text-woof-charcoal">{gallery.likes_count}</span>
                                            <span className="text-[8px] text-woof-charcoal/40 font-bold uppercase tracking-wider">Likes</span>
                                        </div>
                                        <div className="bg-[#fcfbf9] border border-[#e8ded1] py-2 rounded-2xl flex flex-col items-center justify-center gap-0.5">
                                            <Share2 className="h-3.5 w-3.5 text-sky-500" />
                                            <span className="text-xs font-bold text-woof-charcoal">{gallery.shares_count}</span>
                                            <span className="text-[8px] text-woof-charcoal/40 font-bold uppercase tracking-wider">Shares</span>
                                        </div>
                                        <div className="bg-[#fcfbf9] border border-[#e8ded1] py-2 rounded-2xl flex flex-col items-center justify-center gap-0.5">
                                            <Download className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="text-xs font-bold text-woof-charcoal">{gallery.exports_count}</span>
                                            <span className="text-[8px] text-woof-charcoal/40 font-bold uppercase tracking-wider">Exports</span>
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
                <DialogContent className="max-w-md rounded-3xl border border-[#e8ded1] bg-white p-8 shadow-xl">
                    <DialogTitle className="text-lg font-bold text-woof-charcoal flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                        Delete Gallery Showcase?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-woof-charcoal/60 mt-1">
                        This album ({selectedGalleryForDelete?.title || 'Untitled'}) and its {selectedGalleryForDelete?.images.length || 0} photos will be permanently deleted.
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
                            onClick={handleDeleteGallery}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 shadow-xs"
                        >
                            Delete Gallery
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
