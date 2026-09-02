import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Ban, CheckCircle2, Plus, Search, Trash2, ShieldCheck, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
}

interface PageProps {
    roles: Role[];
    filters: { search?: string };
    flash: { success?: string; error?: string };
}

export default function AdminRoles({ roles, filters, flash }: PageProps) {
    const { selectedIds, isAllSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(roles, 'roles');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: true as boolean,
    });

    useEffect(() => {
        if (editRole) {
            setData({ name: editRole.name, slug: editRole.slug, description: editRole.description || '', is_active: editRole.is_active });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    }, [editRole, isAddOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('admin.roles.index'), { search: searchTerm }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editRole) {
            put(route('admin.roles.update', editRole.id), { 
                onSuccess: () => { 
                    toast.success('Role updated successfully'); 
                    setEditRole(null); 
                } 
            });
        } else {
            post(route('admin.roles.store'), { 
                onSuccess: () => { 
                    toast.success('Role created successfully'); 
                    setIsAddOpen(false); 
                } 
            });
        }
    };

    const handleDelete = () => {
        if (!deleteRole) return;
        router.delete(route('admin.roles.destroy', deleteRole.id), { 
            onSuccess: () => { 
                toast.success('Role deleted successfully'); 
                setDeleteRole(null); 
            } 
        });
    };

    return (
        <AdminLayout title="Role Management">
            <Head title="Admin - Roles" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header Identity */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Roles Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Configure administrative system roles, authorization scopes, and permissions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button onClick={() => setIsAddOpen(true)} className="bg-woof-charcoal hover:bg-woof-forest transition-colors h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs">
                            <Plus className="mr-2 h-4 w-4" /> Add Role
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-woof-charcoal/40" />
                    <Input
                        placeholder="Search roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 w-full pl-10 text-xs text-woof-charcoal rounded-2xl border-[#e8ded1] bg-white placeholder:text-woof-charcoal/40 focus-visible:ring-woof-gold/20"
                    />
                </div>

                {flash?.success && <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-xs font-medium"> {flash.success} </div>}
                {flash?.error && <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-800"> {flash.error} </div>}

                {/* Table List */}
                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#fcfbf9] border-b border-[#e8ded1] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10 text-center">
                                    <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
                                </th>
                                <th className="px-6 py-4">Role Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e8dc]">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-[#fcfbf9] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                        <Checkbox checked={selectedIds.includes(role.id)} onCheckedChange={() => toggleItem(role.id)} />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-woof-charcoal">{role.name}</td>
                                    <td className="px-6 py-4 text-woof-charcoal/70 font-mono text-[11px]">{role.slug}</td>
                                    <td className="px-6 py-4">
                                        {role.is_active ? (
                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                                                <Ban className="h-3.5 w-3.5" /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button 
                                                onClick={() => setEditRole(role)}
                                                className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                title="Edit Role"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteRole(role)}
                                                className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                title="Delete Role"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Role Modal */}
                <Dialog open={isAddOpen || !!editRole} onOpenChange={(open) => !open && (setIsAddOpen(false), setEditRole(null))}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[425px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">{editRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Role Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="slug" className="text-xs font-bold text-woof-charcoal">Slug (Optional)</Label>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" />
                            </div>
                            <div className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9]">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Role is Active</Label>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => (setIsAddOpen(false), setEditRole(null))} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs">
                                    {editRole ? 'Update Role' : 'Create Role'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteRole} onOpenChange={(open) => !open && setDeleteRole(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Role</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Are you sure you want to delete this role? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteRole(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
