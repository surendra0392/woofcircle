import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Building2, Calendar, Clock, Dog, Pencil, Search, ShieldCheck, Trash2, X, Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface Pet {
    id: number;
    name: string;
    breed: { name: string };
    user: { name: string; email: string };
}

interface Vet {
    id: number;
    clinic_name: string;
}

interface Vaccination {
    id: number;
    pet_id: number;
    vet_id: number | null;
    vaccine_name: string;
    vaccination_date: string;
    next_due_date: string | null;
    vet_name: string | null;
    notes: string | null;
    pet: Pet;
    vet?: Vet;
}

interface PageProps {
    vaccinations: { data: Vaccination[]; links: { url: string | null; label: string; active: boolean }[]; total: number };
    pets: Pet[];
    vets: Vet[];
    filters: { vaccine_name?: string; upcoming_only?: string };
}

export default function AdminVaccinationIndex({ vaccinations, pets, vets, filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(vaccinations?.data || vaccinations, 'vaccinations');

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<Vaccination | null>(null);

    const handleFilterChange = (key: string, value: string | undefined) => {
        const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
        router.get(route('admin.vaccinations.index'), newFilters, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFilterChange('vaccine_name', formData.get('vaccine_name') as string);
    };

    const handleDelete = () => {
        if (selectedForDelete) {
            router.delete(route('admin.vaccinations.destroy', selectedForDelete.id), { 
                onSuccess: () => { 
                    toast.success('Vaccination record deleted successfully'); 
                    setIsDeleteDialogOpen(false); 
                } 
            });
        }
    };

    const isUpcoming = (dateStr: string | null) => {
        if (!dateStr) return false;
        return new Date(dateStr) > new Date();
    };

    return (
        <AdminLayout title="Vaccination Records">
            <Head title="Admin - Vaccinations" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Vaccinations Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Monitor clinical immunizations, booster records, and pet health status
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
                            href={route('admin.vaccinations.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Record
                        </Link>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <form onSubmit={handleSearch} className="relative min-w-[240px] flex-1 sm:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-woof-charcoal/40" />
                        <Input
                            name="vaccine_name"
                            defaultValue={filters.vaccine_name || ''}
                            placeholder="Search by vaccine name (e.g. Rabies, DHPP)..."
                            className="pl-9 h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </form>

                    <select
                        value={filters.upcoming_only || 'all'}
                        onChange={(e) => handleFilterChange('upcoming_only', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Records</option>
                        <option value="true">Upcoming Booster Due</option>
                    </select>

                    {(filters.vaccine_name || filters.upcoming_only) && (
                        <Button
                            variant="ghost"
                            onClick={() => router.get(route('admin.vaccinations.index'))}
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
                                    <th className="px-6 py-4">Pet Details</th>
                                    <th className="px-6 py-4">Vaccine Administered</th>
                                    <th className="px-6 py-4">Given Date</th>
                                    <th className="px-6 py-4">Next Due Date</th>
                                    <th className="px-6 py-4">Clinic / Vet</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {vaccinations?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <ShieldCheck className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No vaccination records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    vaccinations?.data?.map((vaccination) => (
                                        <tr key={vaccination.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(vaccination.id)} onCheckedChange={() => toggleItem(vaccination.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                        <Dog className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{vaccination.pet?.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">
                                                            {vaccination.pet?.breed?.name || 'Pet'} &bull; Owner: {vaccination.pet?.user?.name || 'Admin'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{vaccination.vaccine_name}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 truncate max-w-xs">
                                                    {vaccination.notes || 'Routine immunization'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3 text-woof-charcoal/40" />
                                                    {vaccination.vaccination_date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {vaccination.next_due_date ? (
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        isUpcoming(vaccination.next_due_date) 
                                                            ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                                            : 'bg-[#fcfbf9] text-woof-charcoal/60 border border-[#e8ded1]'
                                                    }`}>
                                                        <Clock className="h-3 w-3" />
                                                        {vaccination.next_due_date}
                                                    </span>
                                                ) : (
                                                    <span className="text-woof-charcoal/40 text-[11px]">No booster date</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal flex items-center gap-1">
                                                    <Building2 className="h-3 w-3 text-woof-gold shrink-0" />
                                                    {vaccination.vet?.clinic_name || vaccination.vet_name || 'Independent Clinic'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.vaccinations.edit', vaccination.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Vaccination Record"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedForDelete(vaccination);
                                                            setIsDeleteDialogOpen(true);
                                                        }} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Record"
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
                    {vaccinations?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={vaccinations.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Vaccination Record</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete vaccination record <span className="font-bold text-woof-charcoal">{selectedForDelete?.vaccine_name}</span> for {selectedForDelete?.pet?.name}? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
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
