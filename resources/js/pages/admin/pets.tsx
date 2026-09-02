import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Calendar, Dog, Pencil, Search, Trash2, X, Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface Breed {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Pet {
    id: number;
    user_id: number;
    breed_id: number;
    name: string;
    gender: 'male' | 'female';
    date_of_birth: string | null;
    color: string | null;
    microchip_number: string | null;
    profile_image_url: string | null;
    notes: string | null;
    created_at: string;
    breed: Breed;
    user: User;
}

interface PageProps {
    pets: { data: Pet[]; links: { url: string | null; label: string; active: boolean }[]; total: number };
    breeds: Breed[];
    users: User[];
    filters: { breed_id?: string; search?: string };
}

export default function AdminPetIndex({ pets, breeds, users, filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(pets?.data || pets, 'pets');

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPetForDelete, setSelectedPetForDelete] = useState<Pet | null>(null);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
        router.get(route('admin.pets.index'), newFilters, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFilterChange('search', formData.get('search') as string);
    };

    const handleDelete = () => {
        if (selectedPetForDelete) {
            router.delete(route('admin.pets.destroy', selectedPetForDelete.id), { 
                onSuccess: () => { 
                    toast.success('Pet Profile deleted successfully'); 
                    setIsDeleteDialogOpen(false); 
                } 
            });
        }
    };

    return (
        <AdminLayout title="Pet Directory">
            <Head title="Admin - Pet Directory" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Dog className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Pets Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Monitor registered pets, verify microchip credentials, and check ownership
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
                        <Link href={route('admin.pets.create')} className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Add Pet
                        </Link>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-woof-charcoal/40" />
                        <Input
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Search by pet name, microchip or owner..."
                            className="h-10 pl-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </form>
                    <div className="flex items-center gap-3">
                        <Select
                            value={filters.breed_id || 'all'}
                            onValueChange={(val) => handleFilterChange('breed_id', val)}
                        >
                            <SelectTrigger className="h-10 w-[200px] rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal">
                                <SelectValue placeholder="All Breeds" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-[#e8ded1]">
                                <SelectItem value="all">All Breeds</SelectItem>
                                {breeds.map((breed) => (
                                    <SelectItem key={breed.id} value={breed.id.toString()}>
                                        {breed.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(filters.search || filters.breed_id) && (
                            <Button
                                variant="ghost"
                                onClick={() => router.get(route('admin.pets.index'))}
                                className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4"
                            >
                                <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                            </Button>
                        )}
                    </div>
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
                                    <th className="px-6 py-4">Breed & Gender</th>
                                    <th className="px-6 py-4">Owner Profile</th>
                                    <th className="px-6 py-4">Microchip / DOB</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {pets?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Dog className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No registered pets found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pets?.data?.map((pet) => (
                                        <tr key={pet.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(pet.id)} onCheckedChange={() => toggleItem(pet.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {pet.profile_image_url ? (
                                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={pet.profile_image_url} alt={pet.name} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <Dog className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{pet.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">{pet.color || 'Standard color'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{pet.breed?.name || 'Unknown Breed'}</div>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                                                    pet.gender === 'male' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                                                }`}>
                                                    {pet.gender}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{pet.user?.name || 'N/A'}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{pet.user?.email || ''}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs font-bold text-woof-charcoal">
                                                    {pet.microchip_number || <span className="text-woof-charcoal/40 font-sans font-normal">Unchipped</span>}
                                                </div>
                                                {pet.date_of_birth && (
                                                    <div className="flex items-center gap-1 text-[11px] text-woof-charcoal/60 mt-0.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(pet.date_of_birth).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.pets.edit', pet.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Pet Profile"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedPetForDelete(pet);
                                                            setIsDeleteDialogOpen(true);
                                                        }} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Pet"
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
                    {pets?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={pets.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Pet Profile</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to remove <span className="font-bold text-woof-charcoal">{selectedPetForDelete?.name}</span>? This will also remove associated medical and vaccination records.
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
