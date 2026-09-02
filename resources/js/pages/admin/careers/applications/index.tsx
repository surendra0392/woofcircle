import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Users, Eye, Trash2, Download, FileSpreadsheet, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function ApplicationsIndex({ applications, positions, filters }: any) {
    const [deleteItem, setDeleteItem] = useState<any>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [positionId, setPositionId] = useState(filters.position_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get(route('admin.career-applications.index'), {
            search,
            position_id: positionId,
            status
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const queryParams: any = {
            search,
            position_id: positionId,
            status,
            [key]: value
        };
        
        router.get(route('admin.career-applications.index'), queryParams, {
            preserveState: true
        });
    };

    const handleExport = () => {
        const queryParams = new URLSearchParams({
            position_id: positionId,
            status,
            search
        }).toString();
        
        window.location.href = route('admin.career-applications.export') + '?' + queryParams;
    };

    const handleDelete = () => {
        if (!deleteItem) return;
        router.delete(route('admin.career-applications.destroy', deleteItem.id), {
            onSuccess: () => {
                toast.success('Application deleted successfully');
                setDeleteItem(null);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'shortlisted':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'reviewed':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'rejected':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            default:
                return 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]';
        }
    };

    return (
        <AdminLayout title="Job Applications">
            <Head title="Job Applications - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Job Applications</h2>
                            <p className="text-xs text-woof-charcoal/60">Review candidate submissions, qualifications, and download applicant resumes</p>
                        </div>
                    </div>
                    <div>
                        <Button 
                            onClick={handleExport}
                            className="bg-woof-charcoal hover:bg-woof-forest text-white h-10 rounded-full px-5 text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <FileSpreadsheet className="h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input
                            placeholder="Search name, email, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-10 w-64 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </div>

                    <select
                        value={positionId}
                        onChange={(e) => {
                            setPositionId(e.target.value);
                            handleFilterChange('position_id', e.target.value);
                        }}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Positions</option>
                        {positions.map((pos: any) => (
                            <option key={pos.id} value={pos.id}>{pos.title}</option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            handleFilterChange('status', e.target.value);
                        }}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    {(search || positionId !== 'all' || status !== 'all') && (
                        <Button 
                            onClick={() => {
                                setSearch('');
                                setPositionId('all');
                                setStatus('all');
                                router.get(route('admin.career-applications.index'));
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
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Target Position</th>
                                    <th className="px-6 py-4 text-center">Exp (Yrs)</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Applied Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {applications.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Users className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No job applications found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    applications.data.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{item.full_name}</div>
                                                <div className="text-[11px] text-woof-charcoal/50">{item.email} • {item.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">{item.position_title}</div>
                                                <div className="text-[10px] text-woof-charcoal/50 uppercase">{item.position_department}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-woof-charcoal text-center">
                                                {item.experience_years ?? '0'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-woof-charcoal/70">
                                                {item.current_company ?? '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60 whitespace-nowrap">
                                                {new Date(item.created_at || item.applied_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.career-applications.show', item.id)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="View Application"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setDeleteItem(item)}
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Application"
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
                    {applications?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={applications.links} />
                        </div>
                    )}
                </div>

                {/* Delete Modal */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Application</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete the job application from <span className="font-bold text-woof-charcoal">{deleteItem?.full_name}</span>?
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
