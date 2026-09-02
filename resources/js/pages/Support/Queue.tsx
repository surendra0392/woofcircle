import React, { useEffect, useState } from 'react';
import SupportLayout from '@/layouts/SupportLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { Inbox } from 'lucide-react';


// Category labels and styling for the Needs Attention view
const ATTENTION_CATEGORIES: Record<string, { label: string; description: string; bg: string; text: string; dot: string }> = {
    stalled_in_hr: {
        label: 'Stalled in HR',
        description: 'Escalated to HR but never returned',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
    },
    stalled_after_return: {
        label: 'Stalled After Return',
        description: 'Returned to queue but unclaimed for 24+ hours',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
    },
    chronic_handoff: {
        label: 'Chronic Handoff',
        description: 'Transferred / escalated 7+ days ago, still unresolved',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        dot: 'bg-rose-500',
    },
};

const FILTER_TABS = [
    { value: 'all', label: 'All Tickets' },
    { value: 'external', label: 'External' },
    { value: 'internal', label: 'Internal' },
    { value: 'needs_attention', label: 'Needs Attention' },
] as const;


export default function Queue({ tickets, filter }: { tickets: any[], filter: string }) {
    const { auth } = usePage().props as any;
    const initialUnassignedCount = auth?.admin?.unassigned_tickets_count ?? 0;
    const [unassignedCount, setUnassignedCount] = useState(initialUnassignedCount);

    // Subscribe to real-time unassigned ticket count updates
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private('support-ticket-queue');
        channel.listen('UnassignedTicketsCountChanged', (e: any) => {
            if (typeof e.count === 'number') {
                setUnassignedCount(e.count);
            }
        });

        return () => {
            channel.stopListening('UnassignedTicketsCountChanged');
        };
    }, []);

    // Sync with Inertia page navigations
    useEffect(() => {
        setUnassignedCount(initialUnassignedCount);
    }, [initialUnassignedCount]);

    return (
        <SupportLayout>
            <Head title="Ticket Queue" />
            <div className="max-w-7xl mx-auto">
                {/* Live stat card — updates via Echo */}
                <div className="mb-6 flex items-center gap-4 rounded-3xl border border-[#e8ded1] bg-white px-6 py-4 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                        <Inbox className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-[#61584a] uppercase">Currently Unassigned</p>
                        <p className="text-lg font-black text-[#24221c]">
                            {unassignedCount} {unassignedCount === 1 ? 'ticket' : 'tickets'} to review
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#24221c]">Ticket Queue</h2>
                    <div className="flex gap-1 rounded-full border border-[#e8ded1] bg-[#f9f6f2] p-1">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => router.get(route('support.queue.index'), { filter: tab.value }, { preserveState: true })}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition ${
                                    filter === tab.value
                                        ? 'bg-[#24221c] text-white shadow-sm'
                                        : 'text-[#61584a] hover:text-[#24221c] hover:bg-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow-sm overflow-hidden rounded-2xl border border-[#e8ded1]">
                    <ul role="list" className="divide-y divide-[#e8ded1]">
                        {tickets.length === 0 ? (
                            <li className="px-6 py-12 text-center text-[#61584a]">
                                {filter === 'needs_attention'
                                    ? 'No tickets currently need attention. All handoffs are flowing normally.'
                                    : 'No tickets found.'}
                            </li>
                        ) : (
                            tickets.map((ticket) => (
                                <li key={`${ticket.type}-${ticket.id}`}>
                                    <Link href={route('support.tickets.show', { type: ticket.type, id: ticket.id })} className="block hover:bg-[#f9f6f2] transition duration-150 ease-in-out">
                                        <div className="px-5 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {/* Type badge */}
                                                    <span className={`px-3 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${ticket.type === 'internal' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-[#f9f6f2] text-[#24221c] border border-[#e8ded1]'}`}>
                                                        {ticket.type.toUpperCase()}
                                                    </span>

                                                    {/* Attention category badge (needs_attention filter only) */}
                                                    {ticket.attention_category && (
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${ATTENTION_CATEGORIES[ticket.attention_category]?.bg} ${ATTENTION_CATEGORIES[ticket.attention_category]?.text}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${ATTENTION_CATEGORIES[ticket.attention_category]?.dot}`} />
                                                            {ATTENTION_CATEGORIES[ticket.attention_category]?.label}
                                                        </span>
                                                    )}

                                                    <p className="text-sm font-medium truncate text-[#24221c]">
                                                        {ticket.subject}
                                                    </p>
                                                    
                                                    {/* SLA Timer */}
                                                    {ticket.due_at && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                        <span className={`px-3 py-0.5 inline-flex text-[10px] uppercase font-bold tracking-widest rounded-full ${
                                                            new Date(ticket.due_at) < new Date() 
                                                                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                                                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                        }`}>
                                                            {new Date(ticket.due_at) < new Date() ? 'SLA BREACHED' : 'Due '} 
                                                            <RelativeTime date={ticket.due_at} />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className={`px-3 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        ticket.status === 'open' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                                        ticket.status === 'resolved' ? 'bg-[#f9f6f2] text-[#61584a] border border-[#e8ded1]' :
                                                        'bg-amber-50 text-amber-800 border border-amber-200'
                                                    }`}>
                                                        {ticket.status.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-[#61584a]">
                                                        Requester: {ticket.requester_name}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-[#61584a] sm:mt-0">
                                                    <p>
                                                        {ticket.assigned_to ? `Assigned to: ${ticket.assigned_to}` : 'Unassigned'} &bull; Created <RelativeTime date={ticket.created_at} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </SupportLayout>
    );
}
