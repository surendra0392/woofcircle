import React, { useState, useEffect } from 'react';
import { StickyNote, Send, ArrowUpRight, Shield, Globe } from 'lucide-react';
import { RelativeTime } from '@/components/ui/RelativeTime';
import SupportLayout from '@/layouts/SupportLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

const can = (_role?: string, _action?: string, targets?: any[]) => {
    return Array.isArray(targets) && targets.length > 0;
};

const Section = ({ title, open, accent, children }: { title: string, open?: boolean, accent?: string, children: React.ReactNode }) => (
    <details open={open} className={`bg-white rounded-2xl shadow-sm border border-[#e8ded1] overflow-hidden ${accent || ''}`}>
        <summary className="p-3 bg-[#f9f6f2] font-bold text-sm text-[#24221c] cursor-pointer select-none hover:bg-[#f5f0e8] transition-colors rounded-t-2xl">
            {title}
        </summary>
        <div className="p-4 border-t border-[#e8ded1]">
            {children}
        </div>
    </details>
);

export default function Workspace({ ticket, eligibleTargets = [], hrTargets = [], globalHrTargets = [], globalSupportTargets = [] }: { ticket: any, eligibleTargets?: any[], hrTargets?: any[], globalHrTargets?: any[], globalSupportTargets?: any[] }) {
    const { auth } = usePage().props as any;
    const currentAdminId = auth?.admin?.data?.id || auth?.admin?.id || auth?.user?.id;
    const role = auth?.admin?.role || auth?.admin?.data?.role || auth?.user?.role;
    const isAssignedToMe = ticket.assigned_to && ticket.assigned_to.id === currentAdminId;
    const isSuperadmin = auth?.admin?.role === 'superadmin' || auth?.admin?.data?.role === 'superadmin';
    const canTransfer = can(role, 'ticket', eligibleTargets);
    const canEscalate = can(role, 'ticket', hrTargets);

    const hasAuditHistory = !!(ticket.escalated_to_hr_at || ticket.returned_to_queue_at || ticket.last_transferred_at);
    const isExternal = ticket.type === 'external';

    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const [cannedResponses, setCannedResponses] = useState<any[]>([]);

    useEffect(() => {
        fetch(route('support.canned-responses.index'))
            .then(res => res.json())
            .then(data => setCannedResponses(data))
            .catch(console.error);
    }, []);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('support.tickets.reply', { type: ticket.type, id: ticket.id }), {
            onSuccess: () => reset('message'),
        });
    };

    const handleStatusChange = (newStatus: string) => {
        router.put(
            route('support.tickets.updateStatus', { type: ticket.type, id: ticket.id }),
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const { data: escalateData, setData: setEscalateData, post: escalatePost, processing: escalateProcessing } = useForm({
        assigned_to: '',
        note: '',
    });

    const { data: globalEscalateData, setData: setGlobalEscalateData, post: globalEscalatePost, processing: globalEscalateProcessing } = useForm({
        assigned_to: '',
        note: '',
    });

    const { data: globalTransferData, setData: setGlobalTransferData, post: globalTransferPost, processing: globalTransferProcessing } = useForm({
        assigned_to: '',
    });

    const handleClaim = () => {
        post(route('support.tickets.claim', { type: ticket.type, id: ticket.id }));
    };

    const handleEscalate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!escalateData.assigned_to) return;
        escalatePost(route('support.tickets.escalate', { type: ticket.type, id: ticket.id }), {
            onSuccess: () => setEscalateData({ assigned_to: '', note: '' }),
        });
    };

    const handleGlobalEscalate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!globalEscalateData.assigned_to) return;
        globalEscalatePost(route('support.tickets.escalate', { type: ticket.type, id: ticket.id }), {
            onSuccess: () => setGlobalEscalateData({ assigned_to: '', note: '' }),
        });
    };

    const handleGlobalTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!globalTransferData.assigned_to) return;
        globalTransferPost(route('support.tickets.globalTransfer', { type: ticket.type, id: ticket.id }), {
            onSuccess: () => setGlobalTransferData({ assigned_to: '' }),
        });
    };

    return (
        <SupportLayout>
            <Head title={`Ticket #${ticket.id} - ${ticket.subject}`} />
            <div className="max-w-5xl mx-auto flex gap-6 h-[calc(100vh-8rem)]">
                
                {/* Left Column: Thread */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-[#e8ded1] overflow-hidden">
                    <div className="p-4 border-b border-[#e8ded1] bg-[#f9f6f2] flex justify-between items-center rounded-t-3xl">
                        <div>
                            <div className="text-xs font-bold text-[#61584a] uppercase tracking-wider mb-1">
                                {ticket.type} Ticket #{ticket.id}
                            </div>
                            <h2 className="text-xl font-bold text-[#24221c]">{ticket.subject}</h2>
                        </div>
                        <div className="flex gap-2">
                            <select 
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="text-sm rounded-2xl border-[#e8ded1] bg-white focus:border-[#bb8b62] focus:ring-[#bb8b62]"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fcfbf9]">
                        {/* Original Message */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f9f6f2] flex items-center justify-center font-bold text-[#bb8b62] border border-[#e8ded1]">
                                {ticket.requester.name.charAt(0)}
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-[#e8ded1]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-[#24221c]">{ticket.requester.name}</span>
                                    <RelativeTime date={ticket.created_at} className="text-xs text-[#61584a]" />
                                </div>
                                <div className="text-[#24221c] whitespace-pre-wrap">{ticket.message}</div>
                            </div>
                        </div>

                        {/* Replies */}
                        {ticket.replies.map((reply: any) => (
                            <div key={reply.id} className="flex gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                                    reply.is_admin ? 'bg-[#24221c] text-[#bb8b62] border-[#24221c]' : 'bg-[#f9f6f2] text-[#bb8b62] border-[#e8ded1]'
                                }`}>
                                    {reply.author.charAt(0)}
                                </div>
                                <div className={`flex-1 p-4 rounded-2xl shadow-sm border ${
                                    reply.is_admin ? 'bg-amber-50/80 border-[#deb893]' : 'bg-white border-[#e8ded1]'
                                }`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-[#24221c]">
                                            {reply.author}
                                            {reply.is_admin && <span className="ml-2 text-xs bg-[#bb8b62] text-white px-2 py-0.5 rounded-full font-bold">Staff</span>}
                                        </span>
                                        <RelativeTime date={reply.created_at} className="text-xs text-[#61584a]" />
                                    </div>
                                    <div className="text-[#24221c] whitespace-pre-wrap">{reply.message}</div>
                                </div>
                            </div>
                        ))}

                        {/* Internal Notes */}
                        {ticket.internal_notes && ticket.internal_notes.length > 0 && (
                            <>
                                <div className="flex items-center gap-3 pt-4">
                                    <div className="h-px flex-1 bg-[#deb893]" />
                                    <span className="text-[10px] font-black tracking-widest text-[#bb8b62] uppercase">
                                        Internal Notes ({ticket.internal_notes.length})
                                    </span>
                                    <div className="h-px flex-1 bg-[#deb893]" />
                                </div>
                                {ticket.internal_notes.map((note: any) => (
                                    <div key={`note-${note.id}`} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#bb8b62] text-white font-bold">
                                            <StickyNote className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 p-4 rounded-2xl shadow-sm border bg-amber-50 border-[#deb893]">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-[#24221c]">
                                                    {note.author}
                                                    <span className="ml-2 text-xs bg-[#bb8b62] text-white px-2 py-0.5 rounded-full font-bold">Internal Note</span>
                                                </span>
                                                <RelativeTime date={note.created_at} className="text-xs text-[#61584a]" />
                                            </div>
                                            <div className="text-[#24221c] whitespace-pre-wrap">{note.message}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Reply Form */}
                    <div className="p-4 bg-white border-t border-[#e8ded1]">
                        <div className="mb-2">
                            <select
                                className="text-sm rounded-2xl border-[#e8ded1] w-1/3 bg-[#fcfbf9] focus:border-[#bb8b62] focus:ring-[#bb8b62]"
                                onChange={(e) => {
                                    const response = cannedResponses.find(r => r.id === parseInt(e.target.value));
                                    if (response) {
                                        setData('message', (data.message ? data.message + '\n\n' : '') + response.content);
                                    }
                                    e.target.value = ''; // Reset select
                                }}
                            >
                                <option value="">Select a canned response...</option>
                                {cannedResponses.map(cr => (
                                    <option key={cr.id} value={cr.id}>{cr.title}</option>
                                ))}
                            </select>
                        </div>
                        <form onSubmit={handleReply}>
                            <textarea
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                className="w-full rounded-2xl border-[#e8ded1] shadow-sm focus:border-[#bb8b62] focus:ring-[#bb8b62] sm:text-sm resize-none bg-[#fcfbf9]"
                                rows={4}
                                placeholder="Type your reply here..."
                                required
                            />
                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 justify-center py-2.5 px-5 shadow-sm text-sm font-bold rounded-full text-white bg-[#24221c] hover:bg-[#061d10] transition disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Metadata */}
                <div className="w-64 flex flex-col gap-4">
                    <Section
                        title="Ticket Details"
                        open={true}
                    >
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-[#61584a] text-xs font-medium">Requester</div>
                                <div className="font-medium text-[#24221c]">{ticket.requester.name}</div>
                                <div className="text-[#61584a] truncate">{ticket.requester.email}</div>
                            </div>
                            <div>
                                <div className="text-[#61584a] text-xs font-medium">Priority</div>
                                <div className="font-medium text-[#24221c] capitalize">{ticket.priority}</div>
                            </div>
                            {ticket.due_at && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                <div>
                                    <div className="text-[#61584a] text-xs font-medium">SLA Deadline</div>
                                    <div className={`font-bold ${new Date(ticket.due_at) < new Date() ? 'text-rose-600' : 'text-amber-600'}`}>
                                        {new Date(ticket.due_at) < new Date() ? 'Breached ' : 'Due '} 
                                        <RelativeTime date={ticket.due_at} />
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="text-[#61584a] text-xs font-medium">Assigned To</div>
                                {ticket.assigned_to ? (
                                    <div className="font-medium text-[#24221c]">{ticket.assigned_to.name}</div>
                                ) : (
                                    <div className="text-[#61584a] font-medium">Unassigned</div>
                                )}
                            </div>
                        </div>

                        {!isAssignedToMe && (
                            <button
                                onClick={handleClaim}
                                className="mt-6 w-full inline-flex justify-center py-2.5 px-4 shadow-sm text-sm font-bold rounded-full text-white bg-[#24221c] hover:bg-[#061d10] transition"
                            >
                                Claim Ticket
                            </button>
                        )}
                    </Section>
                    
                    {/* Audit History */}
                    {hasAuditHistory && (
                        <Section
                            title="Audit History"
                            open={true}
                        >
                            <div className="space-y-2">
                                {ticket.escalated_to_hr_at && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#61584a]">Escalated to HR</span>
                                        <RelativeTime date={ticket.escalated_to_hr_at} className="text-[#24221c] font-medium" />
                                    </div>
                                )}
                                {ticket.returned_to_queue_at && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#61584a]">Returned to Queue</span>
                                        <RelativeTime date={ticket.returned_to_queue_at} className="text-[#24221c] font-medium" />
                                    </div>
                                )}
                                {ticket.last_transferred_at && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#61584a]">Last Transferred</span>
                                        <RelativeTime date={ticket.last_transferred_at} className="text-[#24221c] font-medium" />
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}
                    
                    {canTransfer && (
                        <Section
                            title="Transfer Ticket"
                            open={canTransfer && isAssignedToMe}
                        >
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const select = form.elements.namedItem('assigned_to') as HTMLSelectElement;
                                    if (select.value) {
                                        router.post(route('support.tickets.transfer', { type: ticket.type, id: ticket.id }), {
                                            assigned_to: select.value,
                                        });
                                    }
                                }}
                            >
                                <select 
                                    name="assigned_to" 
                                    className="w-full text-sm rounded-2xl border-[#e8ded1] mb-3 bg-[#fcfbf9] focus:border-[#bb8b62] focus:ring-[#bb8b62]"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select team member...</option>
                                    {eligibleTargets.map((target: any) => (
                                        <option key={target.id} value={target.id}>
                                            {target.name} ({target.role.replace('_', ' ')})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex justify-center py-2.5 px-4 shadow-sm text-sm font-bold rounded-full text-[#bb8b62] bg-[#24221c] hover:bg-[#061d10] transition disabled:opacity-50"
                                >
                                    Transfer Ticket
                                </button>
                            </form>
                        </Section>
                    )}

                    {/* Escalate to HR — hierarchy-based, for all support agents */}
                    {ticket.type === 'external' && isAssignedToMe && canEscalate && (
                        <Section
                            title="Escalate to HR"
                            open={true}
                            accent="border-l-4 border-[#bb8b62]"
                        >
                            <form onSubmit={handleEscalate}>
                                <select
                                    value={escalateData.assigned_to}
                                    onChange={e => setEscalateData('assigned_to', e.target.value)}
                                    className="w-full text-sm rounded-2xl border-[#e8ded1] mb-3 bg-[#fcfbf9] focus:border-[#bb8b62] focus:ring-[#bb8b62]"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select HR team member...</option>
                                    {hrTargets.map((target: any) => (
                                        <option key={target.id} value={target.id}>
                                            {target.name} ({target.role.replace('_', ' ')})
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    value={escalateData.note}
                                    onChange={e => setEscalateData('note', e.target.value)}
                                    placeholder="Explain why this needs HR attention..."
                                    rows={3}
                                    className="w-full text-sm rounded-2xl border-[#e8ded1] mb-3 resize-none bg-[#fcfbf9] focus:border-[#bb8b62] focus:ring-[#bb8b62]"
                                />
                                <button
                                    type="submit"
                                    disabled={escalateProcessing || !escalateData.assigned_to}
                                    className="w-full inline-flex items-center gap-2 justify-center py-2.5 px-4 shadow-sm text-sm font-bold rounded-full text-white bg-[#bb8b62] hover:bg-[#c89d74] transition disabled:opacity-50"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                    Escalate to HR
                                </button>
                            </form>
                        </Section>
                    )}

                    {/* Global Escalate — superadmins only, bypasses hierarchy to reach any HR admin */}
                    {ticket.type === 'external' && isSuperadmin && globalHrTargets && globalHrTargets.length > 0 && (
                        <Section
                            title="Global Escalate"
                            open={false}
                            accent="border-l-4 border-emerald-500"
                        >
                            <p className="text-xs text-[#61584a] mb-3">
                                Bypass hierarchy — assign to any HR admin across the organization.
                            </p>
                            <form onSubmit={handleGlobalEscalate}>
                                <div className="mb-3">
                                    <SearchableSelect
                                        options={(globalHrTargets || []).map((t: any) => ({
                                            value: String(t.id),
                                            label: `${t.name} (${t.role.replace(/_/g, ' ')})`,
                                        }))}
                                        value={globalEscalateData.assigned_to}
                                        onChange={(v: string) => setGlobalEscalateData('assigned_to', v)}
                                        placeholder="Search HR admin..."
                                        compact
                                    />
                                </div>
                                <textarea
                                    value={globalEscalateData.note}
                                    onChange={e => setGlobalEscalateData('note', e.target.value)}
                                    placeholder="Explain why this needs HR attention..."
                                    rows={3}
                                    className="w-full text-sm rounded-2xl border-[#e8ded1] mb-3 resize-none bg-[#fcfbf9] focus:border-[#bb8b62] focus:ring-[#bb8b62]"
                                />
                                <button
                                    type="submit"
                                    disabled={globalEscalateProcessing || !globalEscalateData.assigned_to}
                                    className="w-full inline-flex items-center gap-2 justify-center py-2.5 px-4 shadow-sm text-sm font-bold rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    <Shield className="w-4 h-4" />
                                    Global Escalate
                                </button>
                            </form>
                        </Section>
                    )}

                    {/* Global Transfer — superadmins only, bypasses hierarchy to reach any support agent */}
                    {isSuperadmin && globalSupportTargets && globalSupportTargets.length > 0 && (
                        <Section
                            title="Global Transfer"
                            open={false}
                            accent="border-l-4 border-[#24221c]"
                        >
                            <p className="text-xs text-[#61584a] mb-3">
                                Bypass hierarchy — assign to any support agent across the organization.
                            </p>
                            <form onSubmit={handleGlobalTransfer}>
                                <div className="mb-3">
                                    <SearchableSelect
                                        options={(globalSupportTargets || []).map((t: any) => ({
                                            value: String(t.id),
                                            label: `${t.name} (${t.role.replace(/_/g, ' ')})`,
                                        }))}
                                        value={globalTransferData.assigned_to}
                                        onChange={(v: string) => setGlobalTransferData('assigned_to', v)}
                                        placeholder="Search support agent..."
                                        compact
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={globalTransferProcessing || !globalTransferData.assigned_to}
                                    className="w-full inline-flex items-center gap-2 justify-center py-2.5 px-4 shadow-sm text-sm font-bold rounded-full text-white bg-[#24221c] hover:bg-[#061d10] transition disabled:opacity-50"
                                >
                                    <Globe className="w-4 h-4" />
                                    Global Transfer
                                </button>
                            </form>
                        </Section>
                    )}
                </div>

            </div>
        </SupportLayout>
    );
}
