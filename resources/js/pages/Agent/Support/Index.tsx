import { Head, Link, router } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { LifeBuoy, Plus, MessageSquare, AlertCircle } from 'lucide-react';

const ATTENTION_CATEGORIES: Record<string, { label: string; description: string; bg: string; text: string; dot: string }> = {
    stalled_after_return: {
        label: 'Stalled — Unassigned',
        description: 'Created 24+ hours ago, still unassigned',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
    },
    chronic_handoff: {
        label: 'Chronic Handoff',
        description: 'Transferred 7+ days ago, still unresolved',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        dot: 'bg-rose-500',
    },
};

interface Ticket {
    id: number;
    subject: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'closed';
    created_at: string;
    admin: { name: string };
    assigned_to?: { name: string };
    attention_category?: string | null;
}

interface PageProps {
    tickets: Ticket[];
    filters?: {
        filter: string;
    };
}

const FILTER_TABS = [
    { value: 'all', label: 'All Tickets' },
    { value: 'assigned_to_me', label: 'Assigned to Me' },
    { value: 'needs_attention', label: 'Needs Attention' },
] as const;

export default function SupportIndex({ tickets, filters = { filter: 'all' } }: PageProps) {
    const activeFilter = filters.filter || 'all';

    const handleFilter = (value: string) => {
        router.get(
            route('agent.support.index'),
            { filter: value === 'all' ? '' : value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return 'bg-sky-50 text-sky-800 border-sky-200';
            case 'in_progress': return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'closed': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'medium': return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'high': return 'bg-rose-50 text-rose-800 border-rose-200';
            default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
        }
    };

    return (
        <AgentLayout title="Field Support Desk">
            <Head title="Support Desk" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Agent Support Desk</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Report operational hurdles, listing disputes, and coordinate technical assistance.</p>
                    </div>
                    <Link
                        href={route('agent.support.create')}
                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                        <Plus className="size-3.5" /> Create Support Ticket
                    </Link>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleFilter(tab.value)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                activeFilter === tab.value
                                    ? 'bg-woof-charcoal text-white shadow-xs'
                                    : 'bg-white border border-[#e8ded1] text-woof-charcoal/70 hover:text-woof-charcoal hover:border-woof-gold'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tickets Table Card */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                    {tickets.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center mx-auto mb-3">
                                <LifeBuoy className="size-6" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal mb-1">No Tickets Found</h3>
                            <p className="text-xs text-woof-charcoal/60">
                                {activeFilter === 'needs_attention'
                                    ? 'No tickets currently need attention. All handoffs are flowing normally.'
                                    : 'No support tickets found in this view.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-[#fcfbf9] text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider border-b border-[#e8ded1]">
                                        <th className="py-3.5 px-5">Ticket ID</th>
                                        <th className="py-3.5 px-5">Subject</th>
                                        <th className="py-3.5 px-5">Status</th>
                                        <th className="py-3.5 px-5">Priority</th>
                                        <th className="py-3.5 px-5">Raised By</th>
                                        <th className="py-3.5 px-5 text-right">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8ded1] text-xs">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="py-4 px-5 font-mono text-woof-charcoal/60 font-medium">#{ticket.id}</td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-2">
                                                    <Link href={route('agent.support.show', ticket.id)} className="text-woof-charcoal hover:text-woof-gold font-bold transition-colors">
                                                        {ticket.subject}
                                                    </Link>
                                                    {ticket.attention_category && (
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border ${ATTENTION_CATEGORIES[ticket.attention_category]?.bg} ${ATTENTION_CATEGORIES[ticket.attention_category]?.text}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${ATTENTION_CATEGORIES[ticket.attention_category]?.dot}`} />
                                                            {ATTENTION_CATEGORIES[ticket.attention_category]?.label}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(ticket.status)}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-woof-charcoal font-medium">{ticket.admin.name}</td>
                                            <td className="py-4 px-5 text-woof-charcoal/50 text-right whitespace-nowrap">
                                                <RelativeTime date={ticket.created_at} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AgentLayout>
    );
}
