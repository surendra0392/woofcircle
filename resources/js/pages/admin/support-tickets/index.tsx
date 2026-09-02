import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, Search, XCircle, Activity, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Ticket {
    id: number;
    user_id: number;
    user: User;
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
}

interface PageProps {
    tickets: { data: Ticket[]; links: any[]; total: number };
    filters: { status?: string; priority?: string; search?: string };
}

export default function AdminTicketsIndex({ tickets, filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(tickets.data, 'support-tickets');
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.support-tickets.index'),
                { search: searchTerm, status: statusFilter, priority: priorityFilter },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, priorityFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                        <AlertCircle className="h-3 w-3" /> Open
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                        <Clock className="h-3 w-3" /> In Progress
                    </span>
                );
            case 'resolved':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal uppercase">
                        <CheckCircle2 className="h-3 w-3 text-woof-gold" /> Resolved
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        <XCircle className="h-3 w-3" /> Closed
                    </span>
                );
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical':
                return <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10px] font-bold uppercase">Critical</span>;
            case 'high':
                return <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase">High</span>;
            case 'medium':
                return <span className="inline-flex items-center rounded-full bg-[#fcfbf9] text-woof-charcoal border border-[#e8ded1] px-2 py-0.5 text-[10px] font-bold uppercase">Medium</span>;
            case 'low':
                return <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase">Low</span>;
            default:
                return null;
        }
    };

    return (
        <AdminLayout title="Support Tickets">
            <Head title="Support Tickets - Admin" />

            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Support Tickets</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage helpdesk inquiries, user support queries, and escalations</p>
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
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input
                            placeholder="Search subject or user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-64 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {(searchTerm || statusFilter || priorityFilter) && (
                        <Button 
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('');
                                setPriorityFilter('');
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
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} />
                                    </th>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Requester</th>
                                    <th className="px-6 py-4">Subject & Category</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {tickets.data.length > 0 ? (
                                    tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(ticket.id)} onCheckedChange={() => toggleItem(ticket.id)} />
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-woof-gold text-xs">
                                                #{ticket.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">
                                                    {ticket.user.name}
                                                </div>
                                                <div className="text-[11px] text-woof-charcoal/50">{ticket.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal line-clamp-1">{ticket.subject}</div>
                                                <span className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">
                                                    {ticket.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4"> {getPriorityBadge(ticket.priority)} </td>
                                            <td className="px-6 py-4"> {getStatusBadge(ticket.status)} </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60 whitespace-nowrap">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('admin.support-tickets.show', ticket.id)}
                                                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                                                >
                                                    <MessageSquare className="h-3.5 w-3.5 text-woof-gold" /> View Ticket
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Activity className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No support tickets found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {tickets.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={tickets.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
