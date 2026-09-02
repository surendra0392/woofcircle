import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Shield, Pencil, Plus, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminsPage({ admins, states, cities, filters }: any) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(admins?.data || admins, 'admins');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [deleteItem, setDeleteItem] = useState<any>(null);

    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [statusFilter, setStatusFilter] = useState(filters?.is_active || '');

    const handleSearch = () => {
        router.get(route('admin.admins.index'), {
            search,
            role: roleFilter,
            is_active: statusFilter
        }, { preserveState: true });
    };

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        is_active: '' as any,
        state_id: '',
        city_id: ''
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.admins.store'), {
            onSuccess: () => { toast.success('Admin created successfully'); setIsAddOpen(false); reset(); clearErrors(); }
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.admins.update', editItem.id), {
            onSuccess: () => { toast.success('Admin updated successfully'); setEditItem(null); reset(); clearErrors(); }
        });
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.admins.toggle-active', id), {}, { onSuccess: () => toast.success('Admin status updated successfully') });
    };

    return (
        <AdminLayout title="Admins">
            <Head title="Admins" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Administrators Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage administrative credentials, system access, and security scopes</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button onClick={() => { reset(); clearErrors(); setIsAddOpen(true); }} className="bg-woof-charcoal hover:bg-woof-forest text-white h-10 rounded-full px-5 text-xs font-bold transition-all shadow-xs">
                            <Plus className="mr-2 h-4 w-4" /> Add Admin
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input 
                            placeholder="Search admins by name or email..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
                            className="h-11 rounded-2xl border-[#e8ded1] bg-white pl-10 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus-visible:ring-woof-gold/20" 
                        />
                    </div>
                    <select 
                        value={roleFilter} 
                        onChange={(e) => setRoleFilter(e.target.value)} 
                        className="flex h-11 w-full sm:w-44 rounded-2xl border border-[#e8ded1] bg-white px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Roles</option>
                        <option value="superadmin">Superadmin</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)} 
                        className="flex h-11 w-full sm:w-44 rounded-2xl border border-[#e8ded1] bg-white px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <Button onClick={handleSearch} className="h-11 bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white rounded-2xl px-5 text-xs font-bold transition-colors">
                        Filter
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#fcfbf9] border-b border-[#e8ded1] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center"><Checkbox checked={isAllSelected} onCheckedChange={toggleAll} /></th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {admins?.data?.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                        <td className="px-6 py-4 w-10 text-center"><Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} /></td>
                                        <td className="px-6 py-4 font-bold text-woof-charcoal">{item.name}</td>
                                        <td className="px-6 py-4 text-woof-charcoal/70">{item.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                item.role === 'superadmin' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                                item.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                                'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]'
                                            }`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-woof-charcoal/60">
                                            {item.city ? `${item.city.name}, ` : ''}{item.state ? item.state.name : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleStatus(item.id)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${item.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                                {item.is_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />} {item.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => { setEditItem(item); setData(item); }} className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button onClick={() => setDeleteItem(item)} className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {admins?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={admins.links} />
                        </div>
                    )}
                </div>

                {/* Add Admin Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[440px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Add Administrator</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-2">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Full Name</Label>
                                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal">Email Address</Label>
                                    <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                    {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-bold text-woof-charcoal">Password</Label>
                                    <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                    {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="role" className="text-xs font-bold text-woof-charcoal">System Role</Label>
                                    <select id="role" value={data.role} onChange={e => setData('role', e.target.value)} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" required>
                                        <option value="">Select a role</option>
                                        <option value="superadmin">Superadmin</option>
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                    {errors.role && <p className="text-xs text-rose-500">{errors.role}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal">Status</Label>
                                    <select id="is_active" value={data.is_active === true ? '1' : data.is_active === false ? '0' : ''} onChange={e => setData('is_active', e.target.value === '1' ? true : e.target.value === '0' ? false : '')} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" required>
                                        <option value="">Select status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                    {errors.is_active && <p className="text-xs text-rose-500">{errors.is_active}</p>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">State (Optional)</Label>
                                        <select id="state_id" value={data.state_id || ''} onChange={e => setData('state_id', e.target.value)} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20">
                                            <option value="">Select State</option>
                                            {states?.map((state: any) => (
                                                <option key={state.id} value={state.id}>{state.name}</option>
                                            ))}
                                        </select>
                                        {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal">City (Optional)</Label>
                                        <select id="city_id" value={data.city_id || ''} onChange={e => setData('city_id', e.target.value)} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20">
                                            <option value="">Select City</option>
                                            {cities?.filter((c: any) => !data.state_id || c.state_id.toString() === data.state_id.toString()).map((city: any) => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">Cancel</Button>
                                <Button type="submit" className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs">Add Admin</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Admin Modal */}
                <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[440px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit Administrator</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4 pt-2">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-name" className="text-xs font-bold text-woof-charcoal">Full Name</Label>
                                    <Input id="edit-name" value={data.name} onChange={e => setData('name', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-email" className="text-xs font-bold text-woof-charcoal">Email Address</Label>
                                    <Input id="edit-email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                    {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-password" className="text-xs font-bold text-woof-charcoal">Password (Leave blank to keep current)</Label>
                                    <Input id="edit-password" type="password" value={data.password || ''} onChange={e => setData('password', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" />
                                    {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-role" className="text-xs font-bold text-woof-charcoal">Role</Label>
                                    <select id="edit-role" value={data.role} onChange={e => setData('role', e.target.value)} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" required>
                                        <option value="">Select a role</option>
                                        <option value="superadmin">Superadmin</option>
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                    {errors.role && <p className="text-xs text-rose-500">{errors.role}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-is_active" className="text-xs font-bold text-woof-charcoal">Status</Label>
                                    <select id="edit-is_active" value={data.is_active === true ? '1' : data.is_active === false ? '0' : ''} onChange={e => setData('is_active', e.target.value === '1' ? true : e.target.value === '0' ? false : '')} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" required>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                    {errors.is_active && <p className="text-xs text-rose-500">{errors.is_active}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="edit-state_id" className="text-xs font-bold text-woof-charcoal">State (Optional)</Label>
                                        <select id="edit-state_id" value={data.state_id || ''} onChange={e => setData('state_id', e.target.value)} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20">
                                            <option value="">Select State</option>
                                            {states?.map((state: any) => (
                                                <option key={state.id} value={state.id}>{state.name}</option>
                                            ))}
                                        </select>
                                        {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="edit-city_id" className="text-xs font-bold text-woof-charcoal">City (Optional)</Label>
                                        <select id="edit-city_id" value={data.city_id || ''} onChange={e => setData('city_id', e.target.value)} className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20">
                                            <option value="">Select City</option>
                                            {cities?.filter((c: any) => !data.state_id || c.state_id.toString() === data.state_id.toString()).map((city: any) => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">Cancel</Button>
                                <Button type="submit" className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Admin Modal */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Delete Administrator</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">Cancel</Button>
                            <Button type="button" onClick={() => {
                                destroy(route('admin.admins.destroy', deleteItem.id), {
                                    onSuccess: () => { toast.success('Admin deleted successfully'); setDeleteItem(null); }
                                });
                            }} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
