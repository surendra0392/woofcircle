import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Pencil, Plus, Trash2, ShoppingBag, CheckCircle2, XCircle, X } from 'lucide-react';
import { useState } from 'react';

interface State { id: number; name: string; }
interface City { id: number; name: string; state_id: number; }
interface PetShop {
    id: number;
    shop_name: string;
    slug: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
    state_id: number;
    city_id: number;
    address: string;
    is_active: boolean;
    logo: string | null;
    state: State;
    city: City;
}

interface PageProps extends AdminSharedData {
    petShops: { data: PetShop[]; links: any[]; current_page: number; last_page: number; total: number };
    states: State[];
    cities: City[];
    filters: { state_id?: string; city_id?: string; search?: string; is_active?: string };
    flash: { success?: string; error?: string };
}

export default function AdminPetShops({ petShops, states, cities, filters, flash }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(petShops?.data || petShops, 'pet_shops');

    const [deleteItem, setDeleteItem] = useState<PetShop | null>(null);

    /* Filter handling */
    const [filterStateId, setFilterStateId] = useState<string>(filters.state_id || '');
    const [filterIsActive, setFilterIsActive] = useState<string>(filters.is_active || '');

    const handleFilterChange = (key: string, val: string) => {
        setFilterStateId(key === 'state_id' ? val : filterStateId);
        setFilterIsActive(key === 'is_active' ? val : filterIsActive);
        const newFilters: Record<string, string> = {};
        if (key === 'state_id') newFilters.state_id = val;
        else if (key === 'is_active') newFilters.is_active = val;
        
        if (key !== 'state_id' && filterStateId) newFilters.state_id = filterStateId;
        if (key !== 'is_active' && filterIsActive) newFilters.is_active = filterIsActive;
        router.get(route('admin.pet-shops.index'), newFilters, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteItem) {
            router.delete(route('admin.pet-shops.destroy', deleteItem.id), { onSuccess: () => { toast.success('Pet Shop deleted successfully'); setDeleteItem(null); } });
        }
    };

    const toggleActive = (id: number) => {
        router.patch(route('admin.pet-shops.toggle-active', id), {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Pet Shops">
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Page header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Pet Shops</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Manage registered pet shops, retail store profiles, and regional partner directories
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
                            href={route('admin.pet-shops.create')} 
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Pet Shop
                        </Link>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filterStateId}
                        onChange={(e) => handleFilterChange('state_id', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All States</option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterIsActive}
                        onChange={(e) => handleFilterChange('is_active', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    {(filterStateId || filterIsActive) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFilterStateId('');
                                setFilterIsActive('');
                                router.get(route('admin.pet-shops.index'));
                            }}
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                        </Button>
                    )}
                </div>

                {/* Content Table */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} />
                                    </th>
                                    <th className="px-6 py-4">Shop Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {petShops?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <ShoppingBag className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No pet shops found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    petShops?.data?.map((shop) => (
                                        <tr key={shop.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(shop.id)} onCheckedChange={() => toggleItem(shop.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {shop.logo ? (
                                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={`/storage/${shop.logo}`} alt={shop.shop_name} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <ShoppingBag className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{shop.shop_name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">{shop.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{shop.city?.name || 'N/A'}, {shop.state?.name || ''}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 truncate max-w-xs">{shop.address}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{shop.phone}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{shop.email || shop.website || 'No email provided'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleActive(shop.id)}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        shop.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {shop.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {shop.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.pet-shops.edit', shop.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Pet Shop"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteItem(shop)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Shop"
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
                    {petShops?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={petShops.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Pet Shop</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.shop_name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
