import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { router, Link, Head } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { HeartHandshake, Pencil, Plus, Trash2, X, CheckCircle2, XCircle } from 'lucide-react';
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

interface Welfare {
    id: number;
    user_id: number | null;
    organization_name: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    state_id: number;
    city_id: number;
    address: string;
    is_active: boolean;
    logo: string | null;
    state: State;
    city: City;
    user: User | null;
}

interface PageProps extends AdminSharedData {
    welfareProfiles: { data: Welfare[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number; total: number };
    states: State[];
    cities: City[];
    filters: { state_id?: string; city_id?: string; is_active?: string };
}

export default function AdminWelfare({ welfareProfiles, states, cities, filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(welfareProfiles?.data || welfareProfiles, 'welfare');

    const [deleteWelfare, setDeleteWelfare] = useState<Welfare | null>(null);

    /* Filter handling */
    const [filterStateId, setFilterStateId] = useState<string>(filters.state_id || '');
    const [filterCityId, setFilterCityId] = useState<string>(filters.city_id || '');
    const [filterIsActive, setFilterIsActive] = useState<string>(filters.is_active || '');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { 
            ...filters, 
            state_id: filterStateId, 
            city_id: filterCityId, 
            is_active: filterIsActive,
            [key]: value === 'all' ? '' : value 
        };

        if (key === 'state_id') {
            setFilterStateId(value === 'all' ? '' : value);
            setFilterCityId('');
            newFilters.city_id = '';
        } else if (key === 'city_id') {
            setFilterCityId(value === 'all' ? '' : value);
        } else if (key === 'is_active') {
            setFilterIsActive(value === 'all' ? '' : value);
        }
        
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) delete newFilters[k as keyof typeof newFilters];
        });

        router.get(route('admin.welfare.index'), newFilters, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteWelfare) {
            router.delete(route('admin.welfare.destroy', deleteWelfare.id), {
                onSuccess: () => {
                    toast.success('Welfare profile deleted successfully.');
                    setDeleteWelfare(null);
                }
            });
        }
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.welfare.toggle-active', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status updated successfully')
        });
    };

    return (
        <AdminLayout title="Animal Welfare Organizations">
            <Head title="Animal Welfare - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <HeartHandshake className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Welfare & NGOs</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Manage registered animal rescue foundations, shelters, and rehabilitation NGOs
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
                            href={route('admin.welfare.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Organization
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

                    {(filterStateId || filterCityId || filterIsActive) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFilterStateId('');
                                setFilterCityId('');
                                setFilterIsActive('');
                                router.get(route('admin.welfare.index'));
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
                                    <th className="px-6 py-4">Organization Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Linked User</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {welfareProfiles?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <HeartHandshake className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No welfare organizations found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    welfareProfiles?.data?.map((org) => (
                                        <tr key={org.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(org.id)} onCheckedChange={() => toggleItem(org.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {org.logo ? (
                                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={org.logo} alt={org.organization_name} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <HeartHandshake className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{org.organization_name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">
                                                            {org.website ? (
                                                                <a href={org.website} target="_blank" rel="noreferrer" className="text-woof-gold hover:underline">
                                                                    {org.website.replace(/^https?:\/\//, '')}
                                                                </a>
                                                            ) : 'Rescue Foundation'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{org.city?.name || 'N/A'}, {org.state?.name || ''}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 truncate max-w-xs">{org.address}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{org.phone}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{org.email || 'No email provided'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {org.user ? (
                                                    <div>
                                                        <div className="font-medium text-woof-charcoal">{org.user.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">{org.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-woof-charcoal/40">Unassigned (Admin managed)</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(org.id)}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        org.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {org.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {org.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.welfare.edit', org.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Organization"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteWelfare(org)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Organization"
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
                    {welfareProfiles?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={welfareProfiles.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteWelfare} onOpenChange={(open) => !open && setDeleteWelfare(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Welfare Profile</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteWelfare?.organization_name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteWelfare(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
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
