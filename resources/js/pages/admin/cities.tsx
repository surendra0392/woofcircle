import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Building2, Filter, Pencil, Plus, Trash2, MapPin } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    slug: string;
    state_id: number;
    state: State;
    created_at: string;
    updated_at: string;
}

interface PageProps extends AdminSharedData {
    cities: { data: City[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number; total: number };
    states: State[];
    filters: { state_id?: string };
    flash: { success?: string; error?: string };
}

export default function AdminCities({ cities, states, filters, flash }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(cities?.data || cities, 'cities');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editCity, setEditCity] = useState<City | null>(null);
    const [deleteCity, setDeleteCity] = useState<City | null>(null);
    const [filterStateId, setFilterStateId] = useState<string>(filters.state_id || '');

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setFilterStateId(val);
        router.get(route('admin.cities.index'), { state_id: val }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({ name: '', state_id: '' });

    useEffect(() => {
        if (editCity) {
            setData({ name: editCity.name || '', state_id: editCity.state_id.toString() });
            clearErrors();
        } else if (!isAddOpen) {
            reset();
            clearErrors();
        }
    }, [editCity, isAddOpen]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editCity) {
            put(route('admin.cities.update', editCity.id), { onSuccess: () => { toast.success('City updated successfully'); setEditCity(null); } });
        } else {
            post(route('admin.cities.store'), {
                onSuccess: () => { 
                    toast.success('City created successfully'); 
                    setIsAddOpen(false);
                    reset(); 
                },
            });
        }
    };

    const handleDelete = () => {
        if (deleteCity) {
            destroy(route('admin.cities.destroy', deleteCity.id), { onSuccess: () => { toast.success('City deleted successfully'); setDeleteCity(null); } });
        }
    };

    return (
        <AdminLayout title="Cities">
            <div className="mx-auto max-w-full space-y-6">
                {/* Page header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Cities Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage municipal registries, postal mapping, and local directory listings</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                        {/* State Filter */}
                        <div className="flex items-center gap-2">
                            <select
                                value={filterStateId}
                                onChange={handleFilterChange}
                                className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3.5 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                            >
                                <option value="">All States</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id.toString()}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-woof-charcoal hover:bg-woof-forest transition-colors h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs">
                                    <Plus className="mr-2 h-4 w-4" /> Add City
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl sm:max-w-[440px]">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-bold text-woof-charcoal">Add New City</DialogTitle>
                                        <DialogDescription className="text-xs text-woof-charcoal/60">Create a new city and associate it with a state.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3 py-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">
                                                State
                                            </Label>
                                            <select
                                                id="state_id"
                                                value={data.state_id}
                                                onChange={(e) => setData('state_id', e.target.value)}
                                                className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                                required
                                            >
                                                <option value="">Select a state</option>
                                                {states.map((state) => (
                                                    <option key={state.id} value={state.id.toString()}>
                                                        {state.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">
                                                City Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. Los Angeles"
                                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                                required
                                            />
                                            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-2">
                                        <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing} className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs">
                                            Create City
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {flash?.success && <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-xs font-medium">{flash.success}</div>}
                {flash?.error && <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl p-4 text-xs font-medium">{flash.error}</div>}

                {/* Cities Table */}
                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center"><Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} /></th>
                                    <th className="px-6 py-4">City</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4">State</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {cities.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center gap-2">
                                                <Building2 className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No cities found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    cities.data.map((city) => (
                                        <tr key={city.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(city.id)} onCheckedChange={() => toggleItem(city.id)} />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-woof-charcoal">{city.name}</td>
                                            <td className="px-6 py-4 text-woof-charcoal/70 font-mono text-[11px]">{city.slug}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal uppercase">
                                                    {city.state?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setEditCity(city)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteCity(city)}
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
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
                    {cities.last_page > 1 && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={cities.links} />
                        </div>
                    )}
                </div>

                {/* Edit City Modal */}
                <Dialog open={!!editCity} onOpenChange={(open) => !open && setEditCity(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl sm:max-w-[440px]">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit City</DialogTitle>
                                <DialogDescription className="text-xs text-woof-charcoal/60">Update the city details.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 py-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_state_id" className="text-xs font-bold text-woof-charcoal">
                                        State
                                    </Label>
                                    <select
                                        id="edit_state_id"
                                        value={data.state_id}
                                        onChange={(e) => setData('state_id', e.target.value)}
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                        required
                                    >
                                        <option value="">Select a state</option>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.id.toString()}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_name" className="text-xs font-bold text-woof-charcoal">
                                        City Name
                                    </Label>
                                    <Input
                                        id="edit_name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditCity(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete City Confirmation */}
                <Dialog open={!!deleteCity} onOpenChange={(open) => !open && setDeleteCity(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete City</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteCity?.name}</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteCity(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete City
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
