import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, Archive, Eye, Mail, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
}

interface PageProps {
    messages: { data: ContactMessage[]; links: any[]; total: number };
    filters: { status?: string; search?: string };
}

export default function AdminContactMessagesIndex({ messages, filters }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.contact-messages.index'),
                { search: searchTerm, status: statusFilter === 'all' ? '' : statusFilter },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                        <AlertCircle className="h-3 w-3" /> New
                    </span>
                );
            case 'read':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal uppercase">
                        <Eye className="h-3 w-3 text-woof-gold" /> Read
                    </span>
                );
            case 'replied':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                        <Mail className="h-3 w-3" /> Replied
                    </span>
                );
            case 'archived':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        <Archive className="h-3 w-3" /> Archived
                    </span>
                );
            default:
                return null;
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(route('admin.contact-messages.destroy', id));
        }
    };

    return (
        <AdminLayout title="Contact Messages">
            <Head title="Contact Messages - Admin" />
            <div className="mx-auto max-w-full space-y-6">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Contact Messages</h2>
                            <p className="text-xs text-woof-charcoal/60">Review and reply to user inquiries submitted via the public contact forms</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input
                            placeholder="Search name, email, subject..."
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
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                    </select>

                    {(searchTerm || statusFilter !== 'all') && (
                        <Button 
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
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
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Sender</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#f0e8dc]">
                                {messages.data.length > 0 ? (
                                    messages.data.map((message) => (
                                        <tr
                                            key={message.id}
                                            className={`hover:bg-[#fcfbf9] transition-colors ${message.status === 'new' ? 'bg-emerald-50/20' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-woof-charcoal/60 whitespace-nowrap">
                                                {new Date(message.created_at).toLocaleString()}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="font-bold text-woof-charcoal">
                                                    {message.name}
                                                </div>
                                                <div className="text-[11px] text-woof-charcoal/50">{message.email}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-medium text-woof-charcoal line-clamp-1">{message.subject}</span>
                                            </td>
                                            <td className="px-6 py-4"> {getStatusBadge(message.status)} </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.contact-messages.show', message.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Link>

                                                    <button 
                                                        onClick={() => handleDelete(message.id)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="Delete Message"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Mail className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No contact messages found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {messages.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={messages.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
