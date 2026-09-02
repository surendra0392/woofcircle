import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Heart, Pencil, Plus, Trash2, CheckCircle2, XCircle, X, Eye, Check } from 'lucide-react';
import { useState } from 'react';

interface Breed {
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

interface Adoption {
    id: number;
    title: string;
    slug: string;
    description: string;
    gender: 'male' | 'female';
    age: string | null;
    fee: number | null;
    is_negotiable: boolean;
    is_vaccinated: boolean;
    is_available: boolean;
    is_approved: boolean;
    is_active: boolean;
    status: 'draft' | 'published' | 'available' | 'unavailable';
    featured_image_url: string | null;
    breed: Breed;
    state: State;
    city: City;
    user: { id: number; name: string; email: string };
    profile?: { id: number; name: string };
}

interface PageProps {
    adoptions: { data: Adoption[]; links: any[]; current_page: number; last_page: number; total: number };
    breeds: Breed[];
    states: State[];
    cities: City[];
    filters: {
        is_approved?: string;
        is_available?: string;
        breed_id?: string;
        state_id?: string;
        city_id?: string;
        gender?: string;
        status?: string;
        is_active?: string;
    };
}

export default function AdoptionsPage({ adoptions, breeds = [], states = [], cities = [], filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(adoptions?.data || adoptions, 'adoptions');

    const [deleteAdoption, setDeleteAdoption] = useState<Adoption | null>(null);

    // Filters states
    const [filterStatus, setFilterStatus] = useState<string>(filters.status || '');
    const [filterIsActive, setFilterIsActive] = useState<string>(filters.is_active || '');
    const [filterIsApproved, setFilterIsApproved] = useState<string>(filters.is_approved || '');
    const [filterIsAvailable, setFilterIsAvailable] = useState<string>(filters.is_available || '');
    const [filterBreedId, setFilterBreedId] = useState<string>(filters.breed_id || '');
    const [filterStateId, setFilterStateId] = useState<string>(filters.state_id || '');
    const [filterCityId, setFilterCityId] = useState<string>(filters.city_id || '');
    const [filterGender, setFilterGender] = useState<string>(filters.gender || '');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = {
            ...filters,
            status: filterStatus,
            is_active: filterIsActive,
            is_approved: filterIsApproved,
            is_available: filterIsAvailable,
            breed_id: filterBreedId,
            state_id: filterStateId,
            city_id: filterCityId,
            gender: filterGender,
            [key]: value === 'all' ? '' : value
        };

        if (key === 'state_id') {
            setFilterStateId(value === 'all' ? '' : value);
            setFilterCityId('');
            newFilters.city_id = '';
        } else if (key === 'city_id') {
            setFilterCityId(value === 'all' ? '' : value);
        } else if (key === 'breed_id') {
            setFilterBreedId(value === 'all' ? '' : value);
        } else if (key === 'status') {
            setFilterStatus(value === 'all' ? '' : value);
        } else if (key === 'is_active') {
            setFilterIsActive(value === 'all' ? '' : value);
        } else if (key === 'is_approved') {
            setFilterIsApproved(value === 'all' ? '' : value);
        } else if (key === 'is_available') {
            setFilterIsAvailable(value === 'all' ? '' : value);
        } else if (key === 'gender') {
            setFilterGender(value === 'all' ? '' : value);
        }

        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) delete newFilters[k as keyof typeof newFilters];
        });

        router.get(route('admin.adoptions.index'), newFilters, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteAdoption) {
            router.delete(route('admin.adoptions.destroy', deleteAdoption.id), {
                onSuccess: () => {
                    toast.success('Adoption listing deleted successfully.');
                    setDeleteAdoption(null);
                }
            });
        }
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.adoptions.toggle-active', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status updated successfully')
        });
    };

    const toggleApproval = (id: number) => {
        router.patch(route('admin.adoptions.toggle-approval', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Approval status updated successfully')
        });
    };

    return (
        <AdminLayout title="Pet Adoptions">
            <Head title="Pet Adoptions - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Heart className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Pet Adoptions</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Manage rescue and rehoming listings, verification approvals, and adopter requests
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
                            href={route('admin.adoptions.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Listing
                        </Link>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filterBreedId}
                        onChange={(e) => handleFilterChange('breed_id', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Breeds</option>
                        {breeds.map(b => (
                            <option key={b.id} value={b.id.toString()}>{b.name}</option>
                        ))}
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
                        value={filterGender}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <select
                        value={filterIsApproved}
                        onChange={(e) => handleFilterChange('is_approved', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Approvals</option>
                        <option value="true">Approved</option>
                        <option value="false">Pending Approval</option>
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

                    {(filterStateId || filterCityId || filterBreedId || filterGender || filterIsApproved || filterIsActive || filterStatus) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFilterStateId('');
                                setFilterCityId('');
                                setFilterBreedId('');
                                setFilterGender('');
                                setFilterIsApproved('');
                                setFilterIsActive('');
                                setFilterStatus('');
                                router.get(route('admin.adoptions.index'));
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
                                    <th className="px-6 py-4">Pet Listing</th>
                                    <th className="px-6 py-4">Breed & Gender</th>
                                    <th className="px-6 py-4">Adoption Fee</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Owner / Shelter</th>
                                    <th className="px-6 py-4">Approval</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {adoptions?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Heart className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No adoption listings found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    adoptions?.data?.map((pet) => (
                                        <tr key={pet.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(pet.id)} onCheckedChange={() => toggleItem(pet.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {pet.featured_image_url ? (
                                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={pet.featured_image_url} alt={pet.title} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <Heart className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{pet.title}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">
                                                            {pet.age ? `Age: ${pet.age}` : 'Adoption Listing'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{pet.breed?.name || 'Mixed Breed'}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 capitalize">{pet.gender}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">
                                                    {pet.fee ? `₹${pet.fee}` : 'Free Adoption'}
                                                </div>
                                                <div className="text-[11px] text-woof-charcoal/50">
                                                    {pet.is_negotiable ? 'Negotiable' : 'Fixed'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{pet.city?.name || 'N/A'}, {pet.state?.name || ''}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{pet.user?.name || 'Admin'}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{pet.profile?.name || pet.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleApproval(pet.id)}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        pet.is_approved 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                                                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                                    }`}
                                                >
                                                    {pet.is_approved ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {pet.is_approved ? 'Approved' : 'Pending'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(pet.id)}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        pet.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {pet.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {pet.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.adoptions.edit', pet.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Listing"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteAdoption(pet)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Listing"
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
                    {adoptions?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={adoptions.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteAdoption} onOpenChange={(open) => !open && setDeleteAdoption(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Adoption Listing</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteAdoption?.title}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteAdoption(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
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
