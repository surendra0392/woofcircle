import { Head, Link, router } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { ArrowLeft, ArrowLeftFromLine, Clock, CheckCircle2, AlertCircle, XCircle, User, ShieldCheck, TicketCheck, StickyNote, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { RelativeTime } from '@/components/ui/RelativeTime';

interface Reply {
    id: number;
    message: string;
    created_at: string;
    author: string;
    is_admin: boolean;
}

interface InternalNote {
    id: number;
    message: string;
    created_at: string;
    author: string;
}

interface Ticket {
    id: number;
    type: 'internal' | 'external';
    subject: string;
    message: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    created_at: string;
    requester: { name: string; email: string };
    assigned_to: string | null;
    replies: Reply[];
    internal_notes: InternalNote[];
    escalated_at?: string | null;
    returned_at?: string | null;
    transferred_at?: string | null;
}

interface Props {
    ticket: Ticket;
}

export default function HrTicketsShow({ ticket }: Props) {
    const [processing, setProcessing] = useState(false);
    const [note, setNote] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [replyProcessing, setReplyProcessing] = useState(false);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setReplyProcessing(true);
        router.post(
            route('hr.tickets.reply', ticket.id) + `?type=${ticket.type}`,
            {
                message: replyMessage,
                is_internal: isInternal,
            },
            {
                onSuccess: () => {
                    setReplyMessage('');
                    setIsInternal(false);
                },
                onFinish: () => setReplyProcessing(false),
            }
        );
    };

    const handleUnassign = () => {
        if (!confirm('Return this ticket to the support queue? Support agents will be able to claim it.')) return;
        setProcessing(true);
        router.post(route('hr.tickets.unassign', ticket.id), { note }, {
            onFinish: () => {
                setProcessing(false);
                setNote('');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200"><AlertCircle className="size-3" /> Open</span>;
            case 'in_progress':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200"><Clock className="size-3" /> In Progress</span>;
            case 'resolved':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800 border border-sky-200"><CheckCircle2 className="size-3" /> Resolved</span>;
            case 'closed':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700 border border-zinc-200"><XCircle className="size-3" /> Closed</span>;
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
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${colors[ticket.priority] || colors.low}`}>
                {ticket.priority}
            </span>
        );
    };

    return (
        <HrLayout title={`Ticket Case #${ticket.id}`}>
            <Head title={`Ticket #${ticket.id} — ${ticket.subject}`} />

            <div className="space-y-6 max-w-6xl">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('hr.tickets.index')}
                        className="inline-flex items-center gap-1.5 size-9 rounded-full bg-white border border-[#e8ded1] justify-center text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Support Escalation Docket</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Review conversation thread, post internal guidance, or return ticket to operations.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main: Conversation Thread */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/50 font-mono">
                                            Ticket #{ticket.id}
                                        </span>
                                        <span className="text-woof-charcoal/20">•</span>
                                        {getPriorityBadge(ticket.priority)}
                                    </div>
                                    <h2 className="text-xl font-bold text-woof-charcoal">{ticket.subject}</h2>
                                </div>
                                <div className="shrink-0">{getStatusBadge(ticket.status)}</div>
                            </div>
                        </div>

                        {/* Original Message */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <div className="flex items-start gap-4">
                                <div className="size-10 shrink-0 rounded-full bg-woof-pearl/30 border border-[#e8ded1] font-bold text-woof-charcoal flex items-center justify-center text-sm">
                                    {ticket.requester.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-3 border-b border-[#e8ded1] pb-2.5">
                                        <div>
                                            <span className="font-bold text-xs text-woof-charcoal">{ticket.requester.name}</span>
                                            <span className="ml-2 text-[11px] text-woof-charcoal/50">{ticket.requester.email}</span>
                                        </div>
                                        <RelativeTime date={ticket.created_at} className="text-[10px] text-woof-charcoal/50 font-medium" />
                                    </div>
                                    <div className="prose prose-sm max-w-none text-xs text-woof-charcoal/80 leading-relaxed">
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: ticket.message }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Replies */}
                        {ticket.replies.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider px-1">
                                    Conversation Thread ({ticket.replies.length})
                                </h3>
                                {ticket.replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className={`rounded-3xl border p-6 shadow-xs ${
                                            reply.is_admin
                                                ? 'border-[#deb893]/80 bg-[#fcfbf9] ml-4 sm:ml-8'
                                                : 'border-[#e8ded1] bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`size-9 shrink-0 flex items-center justify-center rounded-full font-bold text-xs ${
                                                    reply.is_admin
                                                        ? 'bg-woof-charcoal text-woof-pearl'
                                                        : 'bg-woof-pearl/30 text-woof-charcoal border border-[#e8ded1]'
                                                }`}
                                            >
                                                {reply.is_admin ? <ShieldCheck className="size-4" /> : <User className="size-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-xs text-woof-charcoal flex items-center gap-2">
                                                        {reply.author}
                                                        {reply.is_admin && (
                                                            <span className="inline-flex items-center rounded-full bg-woof-gold/15 px-2.5 py-0.5 text-[9px] font-bold text-woof-charcoal uppercase tracking-wider">
                                                                Staff Specialist
                                                            </span>
                                                        )}
                                                    </span>
                                                    <RelativeTime date={reply.created_at} className="text-[10px] text-woof-charcoal/50" />
                                                </div>
                                                <div 
                                                    className="text-xs text-woof-charcoal/80 leading-relaxed prose max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: reply.message }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Internal Notes */}
                        {ticket.internal_notes && ticket.internal_notes.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pt-4 border-t border-[#e8ded1]">
                                    <div className="h-px flex-1 bg-[#e8ded1]" />
                                    <span className="text-[10px] font-bold tracking-widest text-amber-800 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                        Internal Notes & Dossier Annotations ({ticket.internal_notes.length})
                                    </span>
                                    <div className="h-px flex-1 bg-[#e8ded1]" />
                                </div>
                                {ticket.internal_notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs ml-4 sm:ml-8"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="size-9 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                                                <StickyNote className="size-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-xs text-amber-900">
                                                        {note.author}
                                                        <span className="ml-2 inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-[8px] font-black text-amber-900 uppercase tracking-wider">
                                                            Private Internal Note
                                                        </span>
                                                    </span>
                                                    <RelativeTime date={note.created_at} className="text-[10px] text-amber-700/60" />
                                                </div>
                                                <div 
                                                    className="text-xs text-amber-900 leading-relaxed prose max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: note.message }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Reply Form */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4 border-b border-[#e8ded1] pb-3">
                                Post Dispatch / Advisory Note
                            </h3>
                            <form onSubmit={handleReply} className="space-y-4">
                                <div>
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Draft advisory instructions or user-facing reply..."
                                        rows={4}
                                        className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus:border-woof-gold focus:ring-1 focus:ring-woof-gold resize-none"
                                        required
                                    />
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isInternal}
                                            onChange={(e) => setIsInternal(e.target.checked)}
                                            className="size-4 rounded-md border-[#e8ded1] text-woof-gold focus:ring-woof-gold"
                                        />
                                        <span className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Private Note (Internal Staff Eyes Only)</span>
                                    </label>
                                    
                                    <button
                                        type="submit"
                                        disabled={replyProcessing || !replyMessage.trim()}
                                        className="inline-flex items-center gap-2 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal px-6 py-2.5 text-xs font-bold text-white transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Send className="size-3.5" />
                                        {replyProcessing ? 'Transmitting...' : 'Dispatch Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar: Actions & Details */}
                    <div className="space-y-6">
                        {/* Return with Note Card */}
                        <div className="rounded-3xl border border-amber-300 bg-amber-50/50 p-6 shadow-xs">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                                    <ArrowLeftFromLine className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Return to Operations</h3>
                                    <p className="text-[11px] text-amber-800/80">Reassign back to general support queue pool.</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[10px] font-bold text-amber-900 mb-1.5 uppercase tracking-wider">
                                    <StickyNote className="inline size-3 mr-1 -mt-0.5" />
                                    Handoff Context Note (Optional)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Explain required next steps for support specialists..."
                                    rows={3}
                                    className="w-full rounded-2xl border border-amber-200 bg-white p-3 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none shadow-xs"
                                />
                                <p className="mt-1.5 text-[10px] text-amber-700">
                                    Visible only to internal staff and support administrators.
                                </p>
                            </div>

                            <button
                                onClick={handleUnassign}
                                disabled={processing}
                                className="w-full rounded-full bg-amber-700 hover:bg-amber-800 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {processing ? 'Returning...' : note.trim() ? 'Return with Context' : 'Return to General Queue'}
                            </button>
                        </div>

                        {/* Ticket Details */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <div className="flex items-center gap-2 mb-4 border-b border-[#e8ded1] pb-3">
                                <TicketCheck className="size-4 text-woof-gold" />
                                <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Ticket Telemetry</h3>
                            </div>
                            <div className="space-y-3.5 text-xs">
                                <div className="flex justify-between items-center border-b border-[#e8ded1] pb-2.5">
                                    <span className="text-woof-charcoal/60">Current Status</span>
                                    <span>{getStatusBadge(ticket.status)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#e8ded1] pb-2.5">
                                    <span className="text-woof-charcoal/60">Priority Tier</span>
                                    <span>{getPriorityBadge(ticket.priority)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#e8ded1] pb-2.5">
                                    <span className="text-woof-charcoal/60">Applicant</span>
                                    <span className="font-bold text-woof-charcoal text-right">{ticket.requester.name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#e8ded1] pb-2.5">
                                    <span className="text-woof-charcoal/60">Contact Email</span>
                                    <span className="font-semibold text-woof-charcoal text-right truncate max-w-[170px]">{ticket.requester.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-woof-charcoal/60">Origination Date</span>
                                    <span className="font-semibold text-woof-charcoal">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Audit History */}
                        {(ticket.escalated_at || ticket.returned_at || ticket.transferred_at) && (
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                                <div className="flex items-center gap-2 mb-4 border-b border-[#e8ded1] pb-3">
                                    <Clock className="size-4 text-woof-gold" />
                                    <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Routing Audit History</h3>
                                </div>
                                <div className="space-y-3 text-xs">
                                    {ticket.escalated_at && (
                                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-2.5 last:border-b-0 last:pb-0">
                                            <span className="text-woof-charcoal/60">Escalated to HR</span>
                                            <RelativeTime date={ticket.escalated_at} className="font-semibold text-woof-charcoal" />
                                        </div>
                                    )}
                                    {ticket.returned_at && (
                                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-2.5 last:border-b-0 last:pb-0">
                                            <span className="text-woof-charcoal/60">Returned to Queue</span>
                                            <RelativeTime date={ticket.returned_at} className="font-semibold text-woof-charcoal" />
                                        </div>
                                    )}
                                    {ticket.transferred_at && (
                                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-2.5 last:border-b-0 last:pb-0">
                                            <span className="text-woof-charcoal/60">Specialist Transfer</span>
                                            <RelativeTime date={ticket.transferred_at} className="font-semibold text-woof-charcoal" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
