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
import { Users, Pencil, Plus, Trash2, CheckCircle2, XCircle, Clock, Search, Shield, X } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage({ users, roles, listingTiers, filters }: any) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(users?.data || users, 'users');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [deleteItem, setDeleteItem] = useState<any>(null);
    const [suspendItem, setSuspendItem] = useState<any>(null);

    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role_id || '');
    const [statusFilter, setStatusFilter] = useState(filters?.is_active || '');

    const handleSearch = () => {
        router.get(route('admin.users.index'), {
            search,
            role_id: roleFilter,
            is_active: statusFilter
        }, { preserveState: true });
    };

    const { data: suspendData, setData: setSuspendData, patch: suspendPatch, processing: suspendProcessing, reset: suspendReset } = useForm({
        duration: 24,
    });

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        name: '',
        email: '',
        mobile_number: '',
        password: '',
        role_ids: [] as number[],
        listing_tier_id: 1 as number | null,
        is_active: true as boolean
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => { 
                toast.success('User created successfully'); 
                setIsAddOpen(false); 
                reset(); 
                clearErrors(); 
            }
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', editItem.id), {
            onSuccess: () => { 
                toast.success('User updated successfully'); 
                setEditItem(null); 
                reset(); 
                clearErrors(); 
            }
        });
    };

    const handleSuspend = (e: React.FormEvent) => {
        e.preventDefault();
        suspendPatch(route('admin.users.suspend', suspendItem.id), {
            onSuccess: () => { 
                toast.success(suspendData.duration === 0 ? 'User unsuspended' : 'User suspended successfully'); 
                setSuspendItem(null); 
                suspendReset(); 
            }
        });
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.users.toggle-active', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('User status updated')
        });
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users Management - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Users Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage registered user accounts, membership tiers, and role assignments</p>
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
                        <Button 
                            onClick={() => { reset(); clearErrors(); setIsAddOpen(true); }} 
                            className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add User
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input 
                            placeholder="Search users..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-10 w-48 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            router.get(route('admin.users.index'), { search, role_id: e.target.value, is_active: statusFilter }, { preserveState: true });
                        }}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Roles</option>
                        {roles?.map((r: any) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get(route('admin.users.index'), { search, role_id: roleFilter, is_active: e.target.value }, { preserveState: true });
                        }}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>

                    {(search || roleFilter || statusFilter) && (
                        <Button 
                            onClick={() => {
                                setSearch('');
                                setRoleFilter('');
                                setStatusFilter('');
                                router.get(route('admin.users.index'));
                            }} 
                            variant="ghost" 
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4 cursor-pointer"
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
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Mobile</th>
                                    <th className="px-6 py-4">Registered</th>
                                    <th className="px-6 py-4">Roles</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {users?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Users className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No users found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users?.data?.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{item.name}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{item.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-woof-charcoal/70">
                                                {item.mobile_number || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60">
                                                {(() => {
                                                    const d = new Date(item.created_at);
                                                    return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
                                                })()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.roles && item.roles.length > 0 ? (
                                                        item.roles.map((r: any) => (
                                                            <span key={r.id} className="inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2 py-0.5 text-[10px] font-bold text-woof-charcoal">
                                                                {r.name}
                                                            </span>
                                                        ))
                                                    ) : item.role ? (
                                                        <span className="inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2 py-0.5 text-[10px] font-bold text-woof-charcoal">
                                                            {item.role.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-woof-charcoal/40 text-xs">User</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <button 
                                                        onClick={() => toggleStatus(item.id)} 
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                            item.is_active 
                                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                        }`}
                                                    >
                                                        {item.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                        {item.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                    {item.suspended_until && new Date(item.suspended_until) > new Date() && (
                                                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200" title={`Suspended until ${new Date(item.suspended_until).toLocaleString()}`}>
                                                            <Clock className="h-3 w-3" /> Suspended
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => { setSuspendItem(item); suspendReset(); }} 
                                                        className="h-8 w-8 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Suspend User"
                                                    >
                                                        <Clock className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => { 
                                                            setEditItem(item); 
                                                            setData({
                                                                name: item.name,
                                                                email: item.email,
                                                                mobile_number: item.mobile_number || '',
                                                                password: '',
                                                                role_ids: item.roles?.map((r: any) => r.id) || (item.role_id ? [item.role_id] : []),
                                                                listing_tier_id: item.listing_tier_id || 1,
                                                                is_active: item.is_active === 1 || item.is_active === true
                                                            });
                                                        }} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit User"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteItem(item)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete User"
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
                    {users?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={users.links} />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Add User Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[420px] p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-woof-charcoal">Add User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4 pt-2">
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Name *</Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal">Email *</Label>
                                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mobile_number" className="text-xs font-bold text-woof-charcoal">Mobile Number</Label>
                                <Input 
                                    id="mobile_number" 
                                    value={data.mobile_number} 
                                    onChange={e => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        val = val.substring(0, 15);
                                        setData('mobile_number', val);
                                    }} 
                                    placeholder="XXXXX XXXXX"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.mobile_number && <p className="text-xs text-rose-500">{errors.mobile_number}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-bold text-woof-charcoal">Password *</Label>
                                <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="role_ids" className="text-xs font-bold text-woof-charcoal">Roles (Hold Ctrl/Cmd to select multiple)</Label>
                                <select 
                                    id="role_ids" 
                                    multiple
                                    className="flex min-h-[90px] w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                    value={data.role_ids.map(String)} 
                                    onChange={e => {
                                        const options = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                        setData('role_ids', options);
                                    }}
                                >
                                    {roles?.map((r: any) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                {errors.role_ids && <p className="text-xs text-rose-500">{errors.role_ids}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="listing_tier_id" className="text-xs font-bold text-woof-charcoal">Listing Tier</Label>
                                <select 
                                    id="listing_tier_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                    value={data.listing_tier_id || ''} 
                                    onChange={e => setData('listing_tier_id', e.target.value ? parseInt(e.target.value) : null)}
                                >
                                    <option value="">Select Tier...</option>
                                    {listingTiers?.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.max_listings === -1 ? 'Unlimited' : `${t.max_listings} listings`})</option>
                                    ))}
                                </select>
                                {errors.listing_tier_id && <p className="text-xs text-rose-500">{errors.listing_tier_id}</p>}
                            </div>
                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', !!c)} />
                                <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active Account</Label>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                Save User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[420px] p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 pt-2">
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name" className="text-xs font-bold text-woof-charcoal">Name *</Label>
                                <Input id="edit-name" value={data.name} onChange={e => setData('name', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-email" className="text-xs font-bold text-woof-charcoal">Email *</Label>
                                <Input id="edit-email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" required />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-mobile_number" className="text-xs font-bold text-woof-charcoal">Mobile Number</Label>
                                <Input 
                                    id="edit-mobile_number" 
                                    value={data.mobile_number} 
                                    onChange={e => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        val = val.substring(0, 15);
                                        setData('mobile_number', val);
                                    }} 
                                    placeholder="XXXXX XXXXX"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.mobile_number && <p className="text-xs text-rose-500">{errors.mobile_number}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-password" className="text-xs font-bold text-woof-charcoal">Password (Leave blank to keep current)</Label>
                                <Input id="edit-password" type="password" value={data.password || ''} onChange={e => setData('password', e.target.value)} className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" />
                                {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-role_ids" className="text-xs font-bold text-woof-charcoal">Roles (Hold Ctrl/Cmd to select multiple)</Label>
                                <select 
                                    id="edit-role_ids" 
                                    multiple
                                    className="flex min-h-[90px] w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                    value={data.role_ids.map(String)} 
                                    onChange={e => {
                                        const options = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                        setData('role_ids', options);
                                    }}
                                >
                                    {roles?.map((r: any) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                {errors.role_ids && <p className="text-xs text-rose-500">{errors.role_ids}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-listing_tier_id" className="text-xs font-bold text-woof-charcoal">Listing Tier</Label>
                                <select 
                                    id="edit-listing_tier_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                    value={data.listing_tier_id || ''} 
                                    onChange={e => setData('listing_tier_id', e.target.value ? parseInt(e.target.value) : null)}
                                >
                                    <option value="">Select Tier...</option>
                                    {listingTiers?.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.max_listings === -1 ? 'Unlimited' : `${t.max_listings} listings`})</option>
                                    ))}
                                </select>
                                {errors.listing_tier_id && <p className="text-xs text-rose-500">{errors.listing_tier_id}</p>}
                            </div>
                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox id="edit_is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', !!c)} />
                                <Label htmlFor="edit_is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active Account</Label>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setEditItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                Update User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-rose-600">Delete User</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <p className="text-xs text-woof-charcoal/70">Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.name}</span>?</p>
                        <p className="mt-1 text-[11px] font-bold text-rose-500">This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={() => {
                                destroy(route('admin.users.destroy', deleteItem.id), {
                                    onSuccess: () => { toast.success('User deleted successfully'); setDeleteItem(null); }
                                });
                            }} 
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend User Dialog */}
            <Dialog open={!!suspendItem} onOpenChange={(open) => !open && setSuspendItem(null)}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-woof-charcoal">Suspend User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSuspend} className="space-y-4 pt-2">
                        <div className="space-y-3">
                            <p className="text-xs text-woof-charcoal/70">
                                Suspending <span className="font-bold text-woof-charcoal">{suspendItem?.name}</span> will temporarily or indefinitely revoke platform authentication access.
                            </p>
                            <div className="space-y-1.5">
                                <Label htmlFor="suspend_duration" className="text-xs font-bold text-woof-charcoal">Suspension Duration</Label>
                                <select 
                                    id="suspend_duration"
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                    value={suspendData.duration} 
                                    onChange={e => setSuspendData('duration', parseInt(e.target.value))}
                                >
                                    <option value={1}>1 Hour</option>
                                    <option value={24}>24 Hours</option>
                                    <option value={168}>7 Days</option>
                                    <option value={720}>30 Days</option>
                                    <option value={87600}>Indefinitely (10 Years)</option>
                                    <option value={0}>Unsuspend (Active Immediately)</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setSuspendItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={suspendProcessing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                Apply
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
