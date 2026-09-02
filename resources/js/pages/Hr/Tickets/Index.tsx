import { Head, Link, router, usePage } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { TicketCheck, ArrowRight, ArrowLeftFromLine, Clock, CheckCircle2, AlertCircle, XCircle, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useHrTicketCount } from '@/hooks/useHrTicketCount';

interface Ticket {
    id: number;
    subject: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
    requester_name: string;
}

interface Props {
    tickets: Ticket[];
}

export default function HrTicketsIndex({ tickets }: Props) {
    const { auth } = usePage().props as any;
    const adminId = auth?.admin?.id;
    const { count: assignedCount } = useHrTicketCount(
        adminId,
        auth?.admin?.hr_assigned_tickets ?? 0,
    );

    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleUnassign = (ticketId: number, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Return this ticket to the general support queue? Support agents will be able to claim it.')) return;
        
        setProcessingId(ticketId);
        router.post(route('hr.tickets.unassign', ticketId), {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                        <AlertCircle className="size-3" /> Open
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                        <Clock className="size-3" /> In Progress
                    </span>
                );
            case 'resolved':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800 border border-sky-200">
                        <CheckCircle2 className="size-3" /> Resolved
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700 border border-zinc-200">
                        <XCircle className="size-3" /> Closed
                    </span>
                );
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            critical: 'bg-rose-50 text-rose-800 border-rose-200',
            high: 'bg-amber-50 text-amber-800 border-amber-200',
            medium: 'bg-blue-50 text-blue-800 border-blue-200',
            low: 'bg-zinc-50 text-zinc-700 border-zinc-200',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${colors[priority] || colors.low}`}>
                {priority}
            </span>
        );
    };

    return (
        <HrLayout title="Assigned Tickets Desk">
            <Head title="Assigned Tickets" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Assigned Tickets Desk</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">
                            Support tickets escalated or transferred to your jurisdiction. Review, resolve, or return them to the queue.
                        </p>
                    </div>
                    <div className="size-11 rounded-2xl bg-white border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-xs shrink-0">
                        <TicketCheck className="size-5" />
                    </div>
                </div>

                {/* Live stat card */}
                <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                        <Users className="size-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-widest text-woof-charcoal/50 uppercase">Active Case Load</p>
                        <div className="flex items-center gap-2.5 mt-0.5">
                            <span className="text-3xl font-black text-woof-charcoal tracking-tight">{assignedCount}</span>
                            <span className="text-xs text-woof-charcoal/60">
                                {assignedCount === 1 ? 'ticket' : 'tickets'} currently assigned to your queue
                            </span>
                        </div>
                    </div>
                </div>

                {tickets.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-[#e8ded1] bg-white p-16 text-center shadow-xs">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                            <TicketCheck className="size-6" />
                        </div>
                        <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider">No Assigned Tickets</h3>
                        <p className="mt-1 text-xs text-woof-charcoal/60 max-w-md mx-auto">
                            No support cases are currently assigned to you. If support specialists escalate an employee inquiry, it will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="group rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs transition-all hover:border-woof-gold/60"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/50 font-mono">
                                                #{ticket.id}
                                            </span>
                                            <span className="text-woof-charcoal/20">•</span>
                                            {getPriorityBadge(ticket.priority)}
                                            {getStatusBadge(ticket.status)}
                                        </div>
                                        <h3 className="text-base font-bold text-woof-charcoal truncate">
                                            {ticket.subject}
                                        </h3>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-woof-charcoal/60">
                                            <span>From: <span className="font-bold text-woof-charcoal">{ticket.requester_name}</span></span>
                                            <span>•</span>
                                            <span>{new Date(ticket.created_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                            })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                                        <Link
                                            href={route('hr.tickets.show', { id: ticket.id, type: (ticket as any).type })}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-4 py-2 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                                        >
                                            Review Case <ArrowRight className="size-3.5" />
                                        </Link>
                                        <button
                                            onClick={(e) => handleUnassign(ticket.id, e)}
                                            disabled={processingId === ticket.id}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8ded1] bg-white px-4 py-2 text-xs font-bold text-woof-charcoal hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            {processingId === ticket.id ? (
                                                'Returning...'
                                            ) : (
                                                <>
                                                    <ArrowLeftFromLine className="size-3.5" />
                                                    Return to Queue
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HrLayout>
    );
}
