import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Briefcase, Pencil, Plus, Trash2, CheckCircle2, XCircle, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function PositionsIndex({ positions, departments, filters }: any) {
    const [deleteItem, setDeleteItem] = useState<any>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || 'all');
    const [isActive, setIsActive] = useState(filters.is_active || 'all');

    const handleSearch = () => {
        router.get(route('admin.career-positions.index'), {
            search,
            department,
            is_active: isActive
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const queryParams: any = {
            search,
            department,
            is_active: isActive,
            [key]: value
        };
        
        router.get(route('admin.career-positions.index'), queryParams, {
            preserveState: true
        });
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.career-positions.toggle-active', id), {}, {
            onSuccess: () => toast.success('Position status updated successfully'),
            preserveScroll: true
        });
    };

    const handleDelete = () => {
        if (!deleteItem) return;
        router.delete(route('admin.career-positions.destroy', deleteItem.id), {
            onSuccess: () => {
                toast.success('Career position deleted successfully');
                setDeleteItem(null);
            }
        });
    };

    return (
        <AdminLayout title="Career Positions">
            <Head title="Career Positions - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Career Positions</h2>
                            <p className="text-xs text-woof-charcoal/60">Create and manage active jobs displayed on the careers page</p>
                        </div>
                    </div>
                    <div>
                        <Link 
                            href={route('admin.career-positions.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Position
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-10 w-64 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </div>

                    <select
                        value={department}
                        onChange={(e) => {
                            setDepartment(e.target.value);
                            handleFilterChange('department', e.target.value);
                        }}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Departments</option>
                        {departments?.map((dept: string) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <select
                        value={isActive}
                        onChange={(e) => {
                            setIsActive(e.target.value);
                            handleFilterChange('is_active', e.target.value);
                        }}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Statuses</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>

                    {(search || department !== 'all' || isActive !== 'all') && (
                        <Button 
                            onClick={() => {
                                setSearch('');
                                setDepartment('all');
                                setIsActive('all');
                                router.get(route('admin.career-positions.index'));
                            }} 
                            variant="ghost" 
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4 cursor-pointer"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Title & Department</th>
                                    <th className="px-6 py-4">Location & Type</th>
                                    <th className="px-6 py-4 text-center">Applications</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {positions?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Briefcase className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No career positions found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    positions?.data?.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{item.title}</div>
                                                <div className="text-[11px] font-medium text-woof-charcoal/50">{item.department}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal">{item.location}</div>
                                                <div className="text-[11px] text-woof-charcoal/50 capitalize">{item.type?.replace('-', ' ')}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-woof-charcoal">
                                                <span className="inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2.5 py-0.5 text-xs text-woof-charcoal">
                                                    {item.applications_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(item.id)}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        item.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                    }`}
                                                >
                                                    {item.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {item.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.career-positions.edit', item.id)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Position"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteItem(item)}
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Position"
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
                    {positions?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={positions.links} />
                        </div>
                    )}
                </div>

                {/* Delete Modal */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Career Position</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteItem?.title}</span>? All related applicant submissions may be affected.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                onClick={handleDelete} 
                                className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
