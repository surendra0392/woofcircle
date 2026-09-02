import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { Head, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface State {
    id: number;
    name: string;
    slug: string;
    cities_count: number;
    created_at: string;
    updated_at: string;
}

interface PageProps extends AdminSharedData {
    states: { data: State[]; links: any[]; current_page: number; last_page: number; total: number };
    flash: { success?: string; error?: string };
}

export default function AdminStates({ states, flash }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(states?.data || states, 'states');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editState, setEditState] = useState<State | null>(null);
    const [deleteState, setDeleteState] = useState<State | null>(null);
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({ name: '' });

    useEffect(() => {
        if (editState) {
            setData('name', editState.name || '');
            clearErrors();
        } else if (!isAddOpen) {
            reset();
            clearErrors();
        }
    }, [editState, isAddOpen]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editState) {
            put(route('admin.states.update', editState.id), { onSuccess: () => { toast.success('State updated successfully'); setEditState(null); } });
        } else {
            post(route('admin.states.store'), {
                onSuccess: () => { 
                    toast.success('State created successfully'); 
                    setIsAddOpen(false);
                    reset(); 
                },
            });
        }
    };

    const handleDelete = () => {
        if (deleteState) {
            destroy(route('admin.states.destroy', deleteState.id), { onSuccess: () => { toast.success('State deleted successfully'); setDeleteState(null); } });
        }
    };

    return (
        <AdminLayout title="States">
            <Head title="Admin - States Management" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">States Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage regional states, territories, and geographic division indexes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-woof-charcoal hover:bg-woof-forest transition-colors h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs">
                                    <Plus className="mr-2 h-4 w-4" /> Add State
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl sm:max-w-[440px]">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-bold text-woof-charcoal">Add New State</DialogTitle>
                                        <DialogDescription className="text-xs text-woof-charcoal/60">Create a new state to be used in the platform.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3 py-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">
                                                State Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. California"
                                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                                required
                                            />
                                            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddOpen(false)}
                                            className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs"
                                        >
                                            Save State
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {flash?.success && (
                    <div className="border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-2xl p-4 text-xs font-medium">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">{flash.error}</div>
                )}

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center"><Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} /></th>
                                    <th className="px-6 py-4">State Name</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4">Linked Cities</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {states.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <MapPin className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No states found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    states.data.map((state) => (
                                        <tr key={state.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(state.id)} onCheckedChange={() => toggleItem(state.id)} />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-woof-charcoal">
                                                {state.name}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-[11px] text-woof-charcoal/70">{state.slug}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal uppercase">
                                                    {state.cities_count} Cities
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button onClick={() => setEditState(state)} className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => setDeleteState(state)} className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
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
                    {states.data.length > 0 && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={states.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={!!editState} onOpenChange={(open) => !open && setEditState(null)}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl sm:max-w-[440px]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit State</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">Update the details of the state.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name" className="text-xs font-bold text-woof-charcoal">
                                    State Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. California"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditState(null)}
                                className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs"
                            >
                                Update State
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={!!deleteState} onOpenChange={(open) => !open && setDeleteState(null)}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-rose-600">Delete State</DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/60">
                            Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteState?.name}</span>? This action is permanent.
                        </DialogDescription>
                    </DialogHeader>
                    {deleteState?.cities_count && deleteState.cities_count > 0 ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">
                            <p>Action Blocked</p>
                            <p className="text-[11px] font-normal opacity-90 mt-0.5">
                                You cannot delete this state because it has {deleteState.cities_count} linked cities. Delete or reassign those cities first.
                            </p>
                        </div>
                    ) : null}
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteState(null)}
                            className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing || (deleteState?.cities_count ?? 0) > 0}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
                        >
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
