import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { router, Link, Head } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Home, Pencil, Plus, Trash2, X, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Boarding {
    id: number;
    user_id: number | null;
    user?: User;
    name: string;
    description: string | null;
    phone: string;
    email: string | null;
    service_type: 'boarding' | 'daycare' | 'both';
    price_per_day: number | null;
    capacity: number | null;
    state_id: number;
    city_id: number;
    state: State;
    city: City;
    address: string;
    logo: string | null;
    is_active: boolean;
}

interface PageProps extends AdminSharedData {
    boardingProfiles: { data: Boarding[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number; total: number };
    states: State[];
    cities: City[];
    filters: { is_active?: string; state_id?: string; city_id?: string; service_type?: string };
}

export default function AdminBoarding({ boardingProfiles, states, cities, filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(boardingProfiles?.data || boardingProfiles, 'boarding');

    const [deleteBoarding, setDeleteBoarding] = useState<Boarding | null>(null);

    /* Filter handling */
    const [filterStateId, setFilterStateId] = useState<string>(filters.state_id || '');
    const [filterCityId, setFilterCityId] = useState<string>(filters.city_id || '');
    const [filterServiceType, setFilterServiceType] = useState<string>(filters.service_type || '');
    const [filterIsActive, setFilterIsActive] = useState<string>(filters.is_active || '');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { 
            ...filters, 
            state_id: filterStateId, 
            city_id: filterCityId, 
            service_type: filterServiceType,
            is_active: filterIsActive,
            [key]: value === 'all' ? '' : value 
        };

        if (key === 'state_id') {
            setFilterStateId(value === 'all' ? '' : value);
            setFilterCityId('');
            newFilters.city_id = '';
        } else if (key === 'city_id') {
            setFilterCityId(value === 'all' ? '' : value);
        } else if (key === 'service_type') {
            setFilterServiceType(value === 'all' ? '' : value);
        } else if (key === 'is_active') {
            setFilterIsActive(value === 'all' ? '' : value);
        }
        
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) delete newFilters[k as keyof typeof newFilters];
        });

        router.get(route('admin.boarding.index'), newFilters, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteBoarding) {
            router.delete(route('admin.boarding.destroy', deleteBoarding.id), {
                onSuccess: () => {
                    toast.success('Boarding profile deleted successfully.');
                    setDeleteBoarding(null);
                }
            });
        }
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.boarding.toggle-active', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status updated successfully')
        });
    };

    return (
        <AdminLayout title="Boarding & Daycare">
            <Head title="Boarding & Daycare - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Home className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Boarding & Daycare</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Manage pet resorts, daycare kennels, and overnight lodging accommodations
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
                            href={route('admin.boarding.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Facility
                        </Link>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filterServiceType}
                        onChange={(e) => handleFilterChange('service_type', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Services</option>
                        <option value="boarding">Overnight Boarding</option>
                        <option value="daycare">Daycare</option>
                        <option value="both">Both Boarding & Daycare</option>
                    </select>

                    <select
                        value={filterStateId}
                        onChange={(e) => handleFilterChange('state_id', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All States</option>
                        {states.map(s => (
                            <option key={s.id} value={s.id.toString()}>{s.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterCityId}
                        disabled={!filterStateId}
                        onChange={(e) => handleFilterChange('city_id', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50"
                    >
                        <option value="">All Cities</option>
                        {cities
                            .filter(c => !filterStateId || c.state_id.toString() === filterStateId)
                            .map(c => (
                                <option key={c.id} value={c.id.toString()}>{c.name}</option>
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

                    {(filterStateId || filterCityId || filterServiceType || filterIsActive) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFilterStateId('');
                                setFilterCityId('');
                                setFilterServiceType('');
                                setFilterIsActive('');
                                router.get(route('admin.boarding.index'));
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
                                    <th className="px-6 py-4">Facility Details</th>
                                    <th className="px-6 py-4">Service & Pricing</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Owner / User</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {boardingProfiles?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Home className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No boarding facilities found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    boardingProfiles?.data?.map((profile) => (
                                        <tr key={profile.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(profile.id)} onCheckedChange={() => toggleItem(profile.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {profile.logo ? (
                                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={profile.logo} alt={profile.name} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <Home className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{profile.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">
                                                            {profile.capacity ? `Capacity: ${profile.capacity} pets` : 'Facility'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal capitalize">{profile.service_type}</div>
                                                <div className="text-[11px] text-woof-gold font-semibold">
                                                    {profile.price_per_day ? `₹${profile.price_per_day}/day` : 'Custom Pricing'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{profile.city?.name || 'N/A'}, {profile.state?.name || ''}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 truncate max-w-xs">{profile.address}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{profile.phone}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{profile.email || 'No email provided'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {profile.user ? (
                                                    <div>
                                                        <div className="font-medium text-woof-charcoal">{profile.user.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">{profile.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-woof-charcoal/40">Unassigned (Admin managed)</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(profile.id)}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        profile.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {profile.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {profile.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.boarding.edit', profile.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Facility"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteBoarding(profile)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Facility"
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
                    {boardingProfiles?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={boardingProfiles.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteBoarding} onOpenChange={(open) => !open && setDeleteBoarding(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Boarding Profile</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteBoarding?.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteBoarding(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
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
