import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { router, useForm, Head } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Activity, Pencil, Plus, Trash2, Heart, CheckCircle2, XCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface VetService {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PageProps extends AdminSharedData {
    services: VetService[];
    flash: { success?: string; error?: string };
}

export default function AdminVetServices({ services, flash }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(services, 'vet_services');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editService, setEditService] = useState<VetService | null>(null);
    const [deleteService, setDeleteService] = useState<VetService | null>(null);

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
    } = useForm({ 
        name: '', 
        description: '', 
        is_active: true as boolean 
    });

    useEffect(() => {
        if (editService) {
            setData({ 
                name: editService.name || '', 
                description: editService.description || '', 
                is_active: editService.is_active 
            });
            clearErrors();
        } else if (!isAddOpen) {
            reset();
            clearErrors();
        }
    }, [editService, isAddOpen]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editService) {
            put(route('admin.vet-services.update', editService.id), { 
                onSuccess: () => { 
                    toast.success('Clinical Service updated successfully'); 
                    setEditService(null); 
                } 
            });
        } else {
            post(route('admin.vet-services.store'), {
                onSuccess: () => { 
                    toast.success('Clinical Service created successfully'); 
                    setIsAddOpen(false);
                    reset(); 
                },
            });
        }
    };

    const handleDelete = () => {
        if (deleteService) {
            destroy(route('admin.vet-services.destroy', deleteService.id), { 
                onSuccess: () => { 
                    toast.success('Clinical Service deleted successfully'); 
                    setDeleteService(null); 
                } 
            });
        }
    };

    return (
        <AdminLayout title="Vet Services">
            <Head title="Clinical Services - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Heart className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Clinical Services</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage specialized clinical treatments, veterinary services, and price lists</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button 
                            onClick={() => setIsAddOpen(true)}
                            className="bg-woof-charcoal hover:bg-woof-forest transition-colors h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Service
                        </Button>
                    </div>
                </div>

                {/* Content Table */}
                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} />
                                    </th>
                                    <th className="px-6 py-4">Service Name</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {services.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Activity className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No clinical services found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    services.map((service) => (
                                        <tr key={service.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(service.id)} onCheckedChange={() => toggleItem(service.id)} />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-woof-charcoal">
                                                {service.name}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-woof-charcoal/60">
                                                {service.slug}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    service.is_active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                }`}>
                                                    {service.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => setEditService(service)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="Edit Service"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteService(service)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="Delete Service"
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
                </div>

                {/* Add Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl max-w-lg">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-woof-charcoal">Add New Clinical Service</DialogTitle>
                                <DialogDescription className="text-xs text-woof-charcoal/60">Create a new veterinary clinical service entry.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Service Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Vaccination, X-Ray Diagnostics"
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                    <RichTextEditor value={data.description || ""} onChange={(val: string) => setData("description", val)} />
                                    {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                                </div>
                                <div className="flex items-center space-x-2 pt-1">
                                    <Checkbox 
                                        id="is_active" 
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active</Label>
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                    Save Service
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={!!editService} onOpenChange={(open) => !open && setEditService(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl max-w-lg">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit Service</DialogTitle>
                                <DialogDescription className="text-xs text-woof-charcoal/60">Update the clinical service details.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-name" className="text-xs font-bold text-woof-charcoal">Service Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Vaccination"
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                    <RichTextEditor value={data.description || ""} onChange={(val: string) => setData("description", val)} />
                                    {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                                </div>
                                <div className="flex items-center space-x-2 pt-1">
                                    <Checkbox 
                                        id="edit-is_active" 
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="edit-is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active</Label>
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditService(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                    Update Service
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={!!deleteService} onOpenChange={(open) => !open && setDeleteService(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Service</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteService?.name}</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setDeleteService(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleDelete} disabled={processing} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
