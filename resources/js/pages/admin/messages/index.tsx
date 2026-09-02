import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { MessageCircle, Search, Eye, Mail, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminMessagesIndex({ conversations, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const [unread, setUnread] = useState(filters?.unread === '1' || filters?.unread === true);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters?.search || '') || unread !== (filters?.unread === '1' || filters?.unread === true)) {
                router.get(route('admin.messages.index'), {
                    search,
                    unread: unread ? 1 : 0
                }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, unread]);

    return (
        <AdminLayout title="Messages & Moderation">
            <Head title="Messages - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Conversations</h2>
                            <p className="text-xs text-woof-charcoal/60">Monitor active private chat logs and communications between platform users</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                        <Input
                            type="text"
                            placeholder="Search participant name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-72 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-9 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </div>

                    <div 
                        onClick={() => setUnread(!unread)}
                        className={`flex items-center gap-2 px-3.5 h-10 border cursor-pointer transition-all rounded-2xl ${
                            unread ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                        }`}
                    >
                        <Checkbox 
                            id="unread-only" 
                            checked={unread}
                            onCheckedChange={(checked) => setUnread(!!checked)}
                        />
                        <label htmlFor="unread-only" className="text-xs font-bold text-woof-charcoal cursor-pointer">
                            Unread Only
                        </label>
                    </div>

                    {(search || unread) && (
                        <Button 
                            variant="ghost" 
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4 cursor-pointer"
                            onClick={() => { setSearch(''); setUnread(false); }}
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
                                    <th className="px-6 py-4">Participants</th>
                                    <th className="px-6 py-4">Latest Message</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Updated At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {conversations?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <MessageCircle className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No conversations found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    conversations?.data?.map((conv: any) => {
                                        const latestMessage = conv.messages?.[0];
                                        const hasUnread = conv.unread_count > 0;
                                        
                                        return (
                                            <tr key={conv.id} className="hover:bg-[#fcfbf9] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        {conv.users?.map((u: any) => (
                                                            <div key={u.id} className="font-bold text-woof-charcoal">
                                                                {u.name} <span className="text-[11px] font-normal text-woof-charcoal/50">({u.email})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-woof-charcoal max-w-md line-clamp-1">
                                                        {latestMessage?.body || (latestMessage?.attachments?.length ? 'Sent an attachment' : 'No messages yet')}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {hasUnread ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                            Unread
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal/60 uppercase">
                                                            All Read
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-woof-charcoal/60 whitespace-nowrap">
                                                    {new Date(conv.updated_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link 
                                                        href={route('admin.messages.show', conv.id)}
                                                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-woof-gold" /> Inspect Log
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {conversations?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={conversations.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
