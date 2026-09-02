import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Pencil, Plus, Save, Trash2, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Specialization {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
}

interface PageProps {
    specializations: Specialization[];
}

export default function AdminTrainerSpecializations({ specializations }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(specializations, 'trainer_specializations');

    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [editingSpec, setEditingSpec] = useState<Specialization | null>(null);
    const [deleteSpec, setDeleteSpec] = useState<Specialization | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({ name: '', description: '', is_active: true as boolean });

    const openAddDialog = () => {
        setEditingSpec(null);
        reset();
        setIsFormDialogOpen(true);
    };

    const openEditDialog = (spec: Specialization) => {
        setEditingSpec(spec);
        setData({ name: spec.name, description: spec.description || '', is_active: spec.is_active });
        setIsFormDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSpec) {
            put(route('admin.trainer-specializations.update', editingSpec.id), {
                onSuccess: () => {
                    toast.success('Specialization updated successfully');
                    setIsFormDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.trainer-specializations.store'), {
                onSuccess: () => {
                    toast.success('Specialization created successfully');
                    setIsFormDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deleteSpec) {
            router.delete(route('admin.trainer-specializations.destroy', deleteSpec.id), {
                onSuccess: () => {
                    toast.success('Specialization deleted successfully');
                    setDeleteSpec(null);
                }
            });
        }
    };

    return (
        <AdminLayout title="Training Specializations">
            <Head title="Trainer Specializations - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Specializations Catalog</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage canine training specializations, domains, and capabilities</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button
                            onClick={openAddDialog}
                            className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Specialization
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {specializations.map((spec) => (
                        <div
                            key={spec.id}
                            className="group relative overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-woof-gold/50 flex flex-col justify-between"
                        >
                            <div>
                                <div className="mb-3 flex items-start justify-between">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                            spec.is_active 
                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                                        }`}
                                    >
                                        {spec.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                        {spec.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditDialog(spec)}
                                            className="h-8 w-8 rounded-full border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white hover:border-woof-gold flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                                            title="Edit Specialization"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteSpec(spec)}
                                            className="h-8 w-8 rounded-full border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                                            title="Delete Specialization"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-woof-charcoal">{spec.name}</h3>
                                <p className="line-clamp-2 text-xs text-woof-charcoal/60 mt-1">
                                    {spec.description || 'No description provided.'}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#e8ded1] flex items-center justify-between text-[11px] text-woof-charcoal/50">
                                <span className="font-mono bg-[#fcfbf9] px-2 py-0.5 rounded-lg border border-[#e8ded1]">{spec.slug}</span>
                            </div>
                        </div>
                    ))}
                    {specializations.length === 0 && (
                        <div className="col-span-full rounded-3xl border-2 border-dashed border-[#e8ded1] py-16 text-center bg-[#fcfbf9]">
                            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-woof-charcoal/30" />
                            <p className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/50">Specializations catalog is empty</p>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="max-w-lg rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">
                                {editingSpec ? 'Edit Specialization' : 'Add Specialization'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Obedience, Aggression, Therapy, or Agility specializations
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="spec-name" className="text-xs font-bold text-woof-charcoal">Specialization Name *</Label>
                                <Input
                                    id="spec-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    placeholder="e.g. Behavioral Therapy"
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="spec-desc" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                <Textarea
                                    id="spec-desc"
                                    value={data.description || ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="min-h-[90px] rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    placeholder="Describe the scope of training expertise..."
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="spec-active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="spec-active" className="text-xs font-bold text-woof-charcoal cursor-pointer">
                                    Active (Visible to trainers)
                                </Label>
                            </div>
                            <DialogFooter className="gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsFormDialogOpen(false)}
                                    className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-6 text-xs font-bold text-white shadow-xs"
                                >
                                    <Save className="mr-1.5 h-4 w-4" /> {processing ? 'Saving...' : editingSpec ? 'Update Specialization' : 'Save Specialization'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteSpec} onOpenChange={(open) => !open && setDeleteSpec(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Specialization</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteSpec?.name}</span>? This will affect all trainers associated with this category.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteSpec(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
