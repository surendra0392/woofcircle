import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Dog, Pencil, Plus, Trash2, CheckCircle2, XCircle, Filter, Activity } from 'lucide-react';
import { useState } from 'react';

export default function LittersPage({ litters, filters }: any) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(litters?.data || litters, 'litters');

    const [deleteItem, setDeleteItem] = useState<any>(null);

    const [filterStatus, setFilterStatus] = useState<string>(filters?.status || '');
    const [filterIsActive, setFilterIsActive] = useState<string>(filters?.is_active || '');

    const applyFilters = (newStatus?: string, newActive?: string) => {
        router.get(route('admin.litters.index'), {
            status: newStatus ?? filterStatus,
            is_active: newActive ?? filterIsActive,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.litters.toggle-active', id), {}, { onSuccess: () => toast.success('Litter status updated successfully') });
    };

    return (
        <AdminLayout title="Litters">
            <Head title="Litters" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Dog className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Puppy Litters</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage verified litters, lineage registrations, and breeder listings</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    applyFilters(e.target.value);
                                }}
                                className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                            >
                                <option value="">All Statuses</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="reserved">Reserved</option>
                                <option value="soldout">Sold Out</option>
                            </select>
                            <select
                                value={filterIsActive}
                                onChange={(e) => {
                                    setFilterIsActive(e.target.value);
                                    applyFilters(undefined, e.target.value);
                                }}
                                className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                            >
                                <option value="">All Active</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedIds.length > 0 && (
                                <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                    Delete Selected ({selectedIds.length})
                                </Button>
                            )}
                            <Link href={route('admin.litters.create')} className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all">
                                <Plus className="mr-2 h-4 w-4" /> Add Litter
                            </Link>
                        </div>
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
                                    <th className="px-6 py-4">Litter Info</th>
                                    <th className="px-6 py-4">Breed</th>
                                    <th className="px-6 py-4">Breeder/Owner</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {litters?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Dog className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No litters found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    litters?.data?.map((litter: any) => (
                                        <tr key={litter.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(litter.id)} onCheckedChange={() => toggleItem(litter.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {litter.featured_image_url ? (
                                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] shadow-2xs shrink-0">
                                                            <img src={litter.featured_image_url} alt={litter.title} className="h-full w-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                            <Dog className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{litter.title}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">Age: {litter.age || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal font-medium">
                                                {litter.breed?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{litter.user?.name || 'Platform'}</div>
                                                {litter.profile && <div className="text-[11px] text-woof-gold font-semibold">{litter.profile?.kennel_name || litter.profile?.business_name}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {litter.price ? (
                                                    <span className="font-bold text-woof-charcoal">₹{Number(litter.price).toLocaleString('en-IN')}</span>
                                                ) : litter.price_min && litter.price_max ? (
                                                    <span className="font-bold text-woof-charcoal">₹{Number(litter.price_min).toLocaleString('en-IN')} - ₹{Number(litter.price_max).toLocaleString('en-IN')}</span>
                                                ) : (
                                                    <span className="text-woof-charcoal/50">On Request</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        litter.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        litter.status === 'reserved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                        litter.status === 'soldout' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                        'bg-slate-50 text-slate-700 border border-slate-200'
                                                    }`}>
                                                        {litter.status}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleStatus(litter.id)}
                                                        className={`inline-flex items-center gap-1 text-[10px] font-bold ${litter.is_active ? 'text-emerald-700 hover:underline' : 'text-slate-400 hover:underline'} cursor-pointer`}
                                                    >
                                                        {litter.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} {litter.is_active ? 'Active' : 'Hidden'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.litters.health-records.index', litter.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold hover:bg-white transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Health & Vaccination Records"
                                                    >
                                                        <Activity className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <Link 
                                                        href={route('admin.litters.edit', litter.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Litter"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteItem(litter)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Litter"
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
                    {litters?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={litters.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Litter</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.title}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                router.delete(route('admin.litters.destroy', deleteItem.id), {
                                    onSuccess: () => { toast.success('Litter deleted successfully'); setDeleteItem(null); }
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
