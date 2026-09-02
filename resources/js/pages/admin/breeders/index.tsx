import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Pencil, Plus, Trash2, CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Filter, Users, Award } from 'lucide-react';
import { useState } from 'react';

export default function BreedersPage({ breeders, states, cities, availableUsers, filters }: any) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(breeders?.data || breeders, 'breeders');

    const [deleteItem, setDeleteItem] = useState<any>(null);
    const [filterActive, setFilterActive] = useState(filters?.is_active || 'all');
    const [filterVerified, setFilterVerified] = useState(filters?.is_verified || 'all');

    const applyFilters = () => {
        router.get(
            route('admin.breeders.index'),
            { is_active: filterActive, is_verified: filterVerified },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AdminLayout title="Breeders">
            <Head title="Breeders" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Breeders Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Moderate certified breeders, evaluate kennel registries, and authorize listings</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Link href={route('admin.breeders.create')} className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Add Breeder
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-3xl border border-[#e8ded1] bg-white p-5 shadow-xs">
                    <div className="mb-3 flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-woof-gold" />
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Filter Breeders</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                            <Label className="mb-1 block text-xs font-bold text-woof-charcoal">Status</Label>
                            <Select value={filterActive} onValueChange={(v) => { setFilterActive(v); }}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-1 block text-xs font-bold text-woof-charcoal">Verified</Label>
                            <Select value={filterVerified} onValueChange={(v) => { setFilterVerified(v); }}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Verified</SelectItem>
                                    <SelectItem value="false">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                onClick={applyFilters}
                                className="h-10 flex-1 rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs"
                            >
                                Apply Filter
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => { setFilterActive('all'); setFilterVerified('all'); router.get(route('admin.breeders.index')); }}
                                className="h-10 rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                            >
                                Reset
                            </Button>
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
                                    <th className="px-6 py-4">Kennel</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Verification</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {breeders?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Users className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No breeders found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    breeders?.data?.map((breeder: any) => (
                                        <tr key={breeder.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(breeder.id)} onCheckedChange={() => toggleItem(breeder.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {breeder.logo ? (
                                                        <div className="h-9 w-9 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={`/storage/${breeder.logo}`} alt={breeder.kennel_name} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <Award className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{breeder.kennel_name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/60">Owner: {breeder.user?.name || 'Unassigned'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-woof-charcoal font-medium">{breeder.email}</div>
                                                <div className="text-[11px] text-woof-charcoal/60">{breeder.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/70">
                                                {breeder.city?.name ? `${breeder.city.name}, ${breeder.state?.name || ''}` : 'Location N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${breeder.is_verified ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                                                    {breeder.is_verified ? <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> : <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />} {breeder.is_verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${breeder.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                                    {breeder.is_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />} {breeder.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={route('admin.breeders.edit', breeder.id)} className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button onClick={() => setDeleteItem(breeder)} className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
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
                    {breeders?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={breeders.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Breeder</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.kennel_name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                router.delete(route('admin.breeders.destroy', deleteItem.id), {
                                    onSuccess: () => { toast.success('Breeder deleted successfully'); setDeleteItem(null); }
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
