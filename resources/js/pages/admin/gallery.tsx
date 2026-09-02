import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { 
    CheckCircle2, 
    Download, 
    Pencil, 
    Heart, 
    ImageIcon, 
    MapPin, 
    Plus, 
    Search, 
    Share2, 
    Star, 
    Tag, 
    Trash2, 
    User, 
    XCircle,
    X
} from 'lucide-react';
import { useState } from 'react';

interface GalleryImage {
    id: number;
    url: string;
    caption: string | null;
}

interface GalleryItem {
    id: number;
    title: string | null;
    description: string | null;
    image: string | null;
    main_image_url: string | null;
    category_id: number | null;
    category?: { id: number; name: string };
    state_id: number | null;
    city_id: number | null;
    state?: { id: number; name: string };
    city?: { id: number; name: string };
    is_featured: boolean;
    is_active: boolean;
    images: GalleryImage[];
    created_at: string;
    likes_count?: number;
    shares_count?: number;
    exports_count?: number;
    user?: { id: number; name: string; email: string };
}

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

interface PageProps {
    items: {
        data: GalleryItem[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    states: State[];
    cities: City[];
    filters: { search?: string; category_id?: string; state_id?: string; city_id?: string; is_featured?: string; is_active?: string };
}

export default function Gallery({ items, categories, states, cities, filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(items?.data || items, 'gallery');

    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [filterCategory, setFilterCategory] = useState(filters.category_id ?? 'all');
    const [filterState, setFilterState] = useState(filters.state_id ?? 'all');
    const [filterCity, setFilterCity] = useState(filters.city_id ?? 'all');
    const [filterFeatured, setFilterFeatured] = useState(filters.is_featured ?? 'all');

    const filterDependentCities = filterState === 'all' 
        ? [] 
        : cities.filter((city) => city.state_id === parseInt(filterState));

    const handleCategoryChange = (val: string) => {
        setFilterCategory(val);
        router.get(
            route('admin.gallery.index'),
            { search: searchTerm, category_id: val, state_id: filterState, city_id: filterCity, is_featured: filterFeatured },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleStateChange = (val: string) => {
        setFilterState(val);
        setFilterCity('all');
        router.get(
            route('admin.gallery.index'),
            { search: searchTerm, category_id: filterCategory, state_id: val, city_id: 'all', is_featured: filterFeatured },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleCityChange = (val: string) => {
        setFilterCity(val);
        router.get(
            route('admin.gallery.index'),
            { search: searchTerm, category_id: filterCategory, state_id: filterState, city_id: val, is_featured: filterFeatured },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleFeaturedChange = (val: string) => {
        setFilterFeatured(val);
        router.get(
            route('admin.gallery.index'),
            { search: searchTerm, category_id: filterCategory, state_id: filterState, city_id: filterCity, is_featured: val },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterCategory('all');
        setFilterState('all');
        setFilterCity('all');
        setFilterFeatured('all');
        router.get(
            route('admin.gallery.index'),
            {},
            { preserveScroll: true, replace: true }
        );
    };

    const toggleFeatured = (id: number) => {
        router.patch(route('admin.gallery.toggle-featured', id), {}, { 
            preserveScroll: true, 
            onSuccess: () => toast.success('Featured status updated successfully.') 
        });
    };

    const toggleActive = (id: number) => {
        router.patch(route('admin.gallery.toggle-active', id), {}, { 
            preserveScroll: true, 
            onSuccess: () => toast.success('Active status updated successfully.') 
        });
    };

    const deleteItem = (id: number) => {
        if (confirm('Are you sure you want to delete this gallery entry and all associated images?')) {
            router.delete(route('admin.gallery.destroy', id), { 
                preserveScroll: true, 
                onSuccess: () => toast.success('Gallery item deleted successfully.') 
            });
        }
    };

    return (
        <AdminLayout title="Gallery">
            <Head title="Gallery - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Page Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Media Gallery</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Manage community showcases, featured albums, and visual highlights
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button 
                                onClick={() => bulkDelete()} 
                                disabled={isProcessing} 
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs"
                            >
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Link 
                            href={route('admin.gallery.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create Album
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input
                            placeholder="Search gallery..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.get(route('admin.gallery.index'), { search: searchTerm, category_id: filterCategory, state_id: filterState, city_id: filterCity, is_featured: filterFeatured }, { preserveState: true });
                                }
                            }}
                            className="h-10 w-48 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </div>

                    <select
                        value={filterCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id.toString()}>{c.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All States</option>
                        {states.map((s) => (
                            <option key={s.id} value={s.id.toString()}>{s.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        disabled={filterState === 'all'}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50"
                    >
                        <option value="all">All Cities</option>
                        {filterDependentCities.map((c) => (
                            <option key={c.id} value={c.id.toString()}>{c.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterFeatured}
                        onChange={(e) => handleFeaturedChange(e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">Any Feature Status</option> 
                        <option value="true">Featured</option>
                        <option value="false">Standard</option>
                    </select>

                    {(searchTerm || filterCategory !== 'all' || filterState !== 'all' || filterCity !== 'all' || filterFeatured !== 'all') && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResetFilters}
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4 cursor-pointer"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                        </Button>
                    )}
                </div>

                {/* Gallery List Table */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} />
                                    </th>
                                    <th className="px-6 py-4">Cover Visual</th> 
                                    <th className="px-6 py-4">Album Details</th>
                                    <th className="px-6 py-4">Publisher</th> 
                                    <th className="px-6 py-4">Engagement</th>
                                    <th className="px-6 py-4">Category</th> 
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {items?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <ImageIcon className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No gallery albums found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    items?.data?.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] shadow-2xs">
                                                    {item.main_image_url ? (
                                                        <img
                                                            src={item.main_image_url}
                                                            alt={item.title || ''}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-woof-charcoal/30">
                                                            <ImageIcon className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div className="absolute right-1 bottom-1 rounded-md bg-black/75 text-white px-1.5 py-0.2 text-[8px] font-bold">
                                                        {item.images?.length + (item.image ? 1 : 0)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{item.title || 'Untitled Album'}</div>
                                                <div className="flex items-center gap-1 text-[11px] text-woof-charcoal/50 mt-0.5">
                                                    <MapPin className="h-3 w-3 text-woof-gold" />
                                                    {item.city?.name ? `${item.city.name}, ${item.state?.name}` : item.state?.name || 'All Locations'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.user ? (
                                                    <div>
                                                        <div className="font-medium text-woof-charcoal">{item.user.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">{item.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs font-medium text-woof-charcoal/50">Admin Publisher</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 text-woof-charcoal/60">
                                                    <div className="flex items-center gap-1" title={`${item.likes_count ?? 0} Likes`}>
                                                        <Heart className="h-3.5 w-3.5 text-amber-600 fill-amber-500/20" />
                                                        <span className="font-bold">{item.likes_count ?? 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1" title={`${item.shares_count ?? 0} Shares`}>
                                                        <Share2 className="h-3.5 w-3.5 text-sky-600" />
                                                        <span className="font-bold">{item.shares_count ?? 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1" title={`${item.exports_count ?? 0} Downloads`}>
                                                        <Download className="h-3.5 w-3.5 text-woof-gold" />
                                                        <span className="font-bold">{item.exports_count ?? 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal">
                                                    <Tag className="h-3 w-3 text-woof-gold" /> {item.category?.name || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => toggleActive(item.id)}
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer w-fit ${
                                                            item.is_active 
                                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                        }`}
                                                    >
                                                        {item.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                        {item.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleFeatured(item.id)}
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer w-fit ${
                                                            item.is_featured 
                                                                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                                                : 'bg-[#fcfbf9] text-woof-charcoal/50 border border-[#e8ded1]'
                                                        }`}
                                                    >
                                                        <Star className={`h-3 w-3 ${item.is_featured ? 'fill-current' : ''}`} />
                                                        {item.is_featured ? 'Featured' : 'Standard'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.gallery.edit', item.id)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Album"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteItem(item.id)}
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Album"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {items?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={items.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
