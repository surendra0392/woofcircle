import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { useState } from 'react';
import { can } from '@/lib/permissions';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { ArrowLeft, Send, ShieldCheck, ArrowRightLeft, Clock, MessageSquare, LifeBuoy } from 'lucide-react';

interface Reply {
    id: number;
    message: string;
    created_at: string;
    admin: { name: string, id: number };
}

interface Ticket {
    id: number;
    subject: string;
    priority: string;
    status: string;
    message: string;
    created_at: string;
    admin: { name: string, id: number };
    assigned_to?: { id: number; name: string };
    replies: Reply[];
    escalated_at?: string | null;
    returned_at?: string | null;
    transferred_at?: string | null;
}

interface EligibleTarget {
    id: number;
    name: string;
    role: string;
}

interface Props {
    ticket: Ticket;
    eligibleTargets?: EligibleTarget[];
}

export default function SupportShow({ ticket, eligibleTargets }: Props) {
    const { props } = usePage<any>();
    const currentAdminId = props.auth?.admin?.id;
    const role = props.auth?.admin?.role || props.auth?.admin?.data?.role;
    const targets = eligibleTargets ?? [];
    const canTransfer = can(role, 'ticket', targets);
    const isAssignedToMe = ticket.assigned_to?.id === currentAdminId;

    const [transferProcessing, setTransferProcessing] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agent.support.reply.store', ticket.id), {
            onSuccess: () => reset('message'),
        });
    };

    const handleClaim = () => {
        router.post(route('agent.support.claim', ticket.id));
    };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const select = form.elements.namedItem('assigned_to') as HTMLSelectElement;
        if (!select.value) return;
        setTransferProcessing(true);
        router.post(route('agent.support.transfer', ticket.id), {
            assigned_to: select.value,
        }, {
            onFinish: () => setTransferProcessing(false),
        });
    };

    return (
        <AgentLayout title={`Ticket #${ticket.id}: ${ticket.subject}`}>
            <Head title={`Ticket #${ticket.id} - ${ticket.subject}`} />

            <div className="mb-6">
                <Link
                    href={route('agent.support.index')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-gold transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Support Desk
                </Link>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main: Thread */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8">
                        <div className="border-b border-[#e8ded1] pb-5 mb-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-xl font-bold text-woof-charcoal mb-1 tracking-tight">{ticket.subject}</h1>
                                    <p className="text-xs text-woof-charcoal/60">
                                        Raised by <span className="font-bold text-woof-charcoal">{ticket.admin.name}</span> on <RelativeTime date={ticket.created_at} />
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                                        {ticket.priority} Priority
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            className="prose prose-sm max-w-none text-woof-charcoal font-normal"
                            dangerouslySetInnerHTML={{ __html: ticket.message }}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider">Conversation Timeline</h2>
                        
                        {ticket.replies.map(reply => (
                            <div 
                                key={reply.id} 
                                className={`bg-white rounded-3xl border shadow-xs p-5 sm:p-6 transition-all ${
                                    reply.admin.id === currentAdminId 
                                        ? 'border-woof-gold/50 bg-[#fcfbf9]/60' 
                                        : 'border-[#e8ded1]'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-xs text-woof-charcoal flex items-center gap-1.5">
                                        <MessageSquare className="size-3 text-woof-gold" />
                                        {reply.admin.name}
                                    </span>
                                    <RelativeTime date={reply.created_at} className="text-[11px] text-woof-charcoal/50" />
                                </div>
                                <div 
                                    className="text-xs text-woof-charcoal/80 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: reply.message }}
                                />
                            </div>
                        ))}

                        {ticket.replies.length === 0 && (
                            <div className="text-center py-8 text-xs text-woof-charcoal/50 bg-white rounded-3xl border border-[#e8ded1]">
                                No replies posted to this ticket yet.
                            </div>
                        )}
                    </div>

                    {ticket.status !== 'closed' && (
                        <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8">
                            <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider mb-4">Post a Response</h3>
                            <form onSubmit={submitReply} className="space-y-4">
                                <textarea
                                    rows={4}
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full p-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold resize-none"
                                    placeholder="Type your response update here..."
                                    required
                                />
                                {errors.message && <p className="text-xs text-rose-600 font-medium">{errors.message}</p>}
                                
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        <Send className="size-3.5" />
                                        {processing ? 'Posting...' : 'Post Reply'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar: Actions */}
                <div className="space-y-5">
                    {/* Ticket Details Card */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4 pb-2 border-b border-[#e8ded1]">Ticket Metadata</h3>
                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-woof-charcoal/50 text-[11px] block">Assigned Handler</span>
                                {ticket.assigned_to ? (
                                    <div className="font-bold text-woof-charcoal mt-0.5">{ticket.assigned_to.name}</div>
                                ) : (
                                    <div className="text-amber-700 font-medium mt-0.5">Unassigned Pool</div>
                                )}
                            </div>
                            <div>
                                <span className="text-woof-charcoal/50 text-[11px] block">Raised By</span>
                                <div className="font-bold text-woof-charcoal mt-0.5">{ticket.admin.name}</div>
                            </div>
                            <div>
                                <span className="text-woof-charcoal/50 text-[11px] block">Priority Tier</span>
                                <div className="font-bold text-woof-charcoal capitalize mt-0.5">{ticket.priority} Priority</div>
                            </div>
                        </div>

                        {!isAssignedToMe && ticket.status !== 'closed' && (
                            <button
                                onClick={handleClaim}
                                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold text-white bg-woof-forest hover:bg-woof-charcoal transition-all shadow-xs cursor-pointer"
                            >
                                <ShieldCheck className="size-3.5 text-woof-gold" /> Claim Ticket Assignment
                            </button>
                        )}
                    </div>

                    {/* Audit History */}
                    {(ticket.escalated_at || ticket.returned_at || ticket.transferred_at) && (
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4 pb-2 border-b border-[#e8ded1]">Lifecycle Timeline</h3>
                            <div className="space-y-2.5 text-xs">
                                {ticket.escalated_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-woof-charcoal/60">Escalated</span>
                                        <RelativeTime date={ticket.escalated_at} className="text-woof-charcoal font-bold" />
                                    </div>
                                )}
                                {ticket.returned_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-woof-charcoal/60">Returned</span>
                                        <RelativeTime date={ticket.returned_at} className="text-woof-charcoal font-bold" />
                                    </div>
                                )}
                                {ticket.transferred_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-woof-charcoal/60">Transferred</span>
                                        <RelativeTime date={ticket.transferred_at} className="text-woof-charcoal font-bold" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Transfer Card */}
                    {canTransfer && isAssignedToMe && (
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4 pb-2 border-b border-[#e8ded1]">Transfer Responsibility</h3>
                            <form onSubmit={handleTransfer} className="space-y-3">
                                <select
                                    name="assigned_to"
                                    className="w-full h-11 px-3 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select team colleague...</option>
                                    {targets.map((target) => (
                                        <option key={target.id} value={target.id}>
                                            {target.name} ({target.role.replace('_', ' ')})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={transferProcessing}
                                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold text-white bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    <ArrowRightLeft className="size-3.5" />
                                    {transferProcessing ? 'Transferring...' : 'Transfer Ticket'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AgentLayout>
    );
}
