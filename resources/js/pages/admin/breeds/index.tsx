import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Dog, Pencil, Plus, Trash2, CheckCircle2, XCircle, Filter, Search } from 'lucide-react';
import { useState } from 'react';

export default function BreedsPage({ breeds, groups, filters }: any) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(breeds?.data || breeds, 'breeds');

    const [deleteItem, setDeleteItem] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterSize, setFilterSize] = useState(filters?.size || 'all');
    const [filterGroup, setFilterGroup] = useState(filters?.breed_group || 'all');
    const [filterActive, setFilterActive] = useState(filters?.is_active || 'all');

    const applyFilters = () => {
        router.get(
            route('admin.breeds.index'),
            { search: searchTerm, size: filterSize, breed_group: filterGroup, is_active: filterActive },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AdminLayout title="Breeds">
            <Head title="Breeds" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Dog className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Breeds Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage standard canine breeds, groups, classifications, and breed information</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Link href={route('admin.breeds.create')} className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Add Breed
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-3xl border border-[#e8ded1] bg-white p-5 shadow-xs">
                    <div className="mb-3 flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-woof-gold" />
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Filter Breeds</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <div>
                            <Label className="mb-1 block text-xs font-bold text-woof-charcoal">Search</Label>
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                                <Input
                                    placeholder="Search breeds..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus-visible:ring-woof-gold/20"
                                />
                            </form>
                        </div>
                        <div>
                            <Label className="mb-1 block text-xs font-bold text-woof-charcoal">Size</Label>
                            <Select value={filterSize} onValueChange={(v) => { setFilterSize(v); setTimeout(applyFilters, 0); }}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Sizes" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All Sizes</SelectItem>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="giant">Giant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-1 block text-xs font-bold text-woof-charcoal">Group</Label>
                            <Select value={filterGroup} onValueChange={(v) => { setFilterGroup(v); setTimeout(applyFilters, 0); }}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Groups" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All Groups</SelectItem>
                                    {groups?.map((g: string) => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-1 block text-xs font-bold text-woof-charcoal">Status</Label>
                            <Select value={filterActive} onValueChange={(v) => { setFilterActive(v); setTimeout(applyFilters, 0); }}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="1">Active Only</SelectItem>
                                    <SelectItem value="0">Inactive Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center"><Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} /></th>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Breed Name</th>
                                    <th className="px-6 py-4">Group</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {breeds?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Dog className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No breeds found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    breeds?.data?.map((breed: any) => (
                                        <tr key={breed.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(breed.id)} onCheckedChange={() => toggleItem(breed.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                {breed.image ? (
                                                    <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs">
                                                        <img src={`/storage/${breed.image}`} alt={breed.name} className="h-full w-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold">
                                                        <Dog className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{breed.name}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 font-mono">/{breed.slug}</div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/70">
                                                {breed.breed_group || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="capitalize inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal">
                                                    {breed.size}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${breed.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                                    {breed.is_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />} {breed.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={route('admin.breeds.edit', breed.id)} className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button onClick={() => setDeleteItem(breed)} className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
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
                    {breeds?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={breeds.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Breed</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                router.delete(route('admin.breeds.destroy', deleteItem.id), {
                                    onSuccess: () => { toast.success('Breed deleted successfully'); setDeleteItem(null); }
                                });
                            }} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
