import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ChevronLeft, Clock, Paperclip, Send, ShieldCheck, User, XCircle, Activity, ArrowLeft } from 'lucide-react';

interface UserType {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface AdminType {
    id: number;
    name: string;
    avatar?: string;
}

interface Reply {
    id: number;
    user_id?: number;
    admin_id?: number;
    user?: UserType;
    admin?: AdminType;
    message: string;
    attachment_path?: string;
    created_at: string;
}

interface Ticket {
    id: number;
    user_id: number;
    user: UserType;
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    message: string;
    attachment_path?: string;
    created_at: string;
    escalated_to_hr_at?: string | null;
    returned_to_queue_at?: string | null;
    last_transferred_at?: string | null;
    replies: Reply[];
}

interface PageProps {
    ticket: Ticket;
}

function formatRelativeTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

export default function AdminTicketShow({ ticket }: PageProps) {
    const { data, setData, post, processing, reset, errors } = useForm({ 
        message: '', 
        attachment: null as File | null, 
        status: ticket.status 
    });

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
                return (
                    <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Critical
                    </span>
                );
            case 'high':
                return (
                    <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        High
                    </span>
                );
            case 'medium':
                return (
                    <span className="rounded-full bg-[#fcfbf9] text-woof-charcoal border border-[#e8ded1] px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Medium
                    </span>
                );
            case 'low':
                return (
                    <span className="rounded-full bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Low
                    </span>
                );
            default:
                return null;
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.support-tickets.reply', ticket.id), {
            forceFormData: true,
            onSuccess: () => { 
                toast.success('Reply submitted successfully'); 
                reset('message', 'attachment'); 
            },
        });
    };

    const updateStatus = (newStatus: string) => {
        router.patch(route('admin.support-tickets.update-status', ticket.id), { status: newStatus }, {
            onSuccess: () => toast.success('Ticket status updated')
        });
    };

    return (
        <AdminLayout title={`Ticket #${ticket.id}`}>
            <Head title={`Ticket #${ticket.id}: ${ticket.subject} - Admin`} />

            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.support-tickets.index')}
                            className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl font-bold tracking-tight text-woof-charcoal">Ticket #{ticket.id}</h1>
                                {getStatusBadge(ticket.status)} 
                                {getPriorityBadge(ticket.priority)}
                            </div>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5">{ticket.subject}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={ticket.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-1 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Conversation Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Original Message Card */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                    <User className="h-5 w-5" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-woof-charcoal">{ticket.user.name}</span>
                                        <span className="text-[11px] text-woof-charcoal/50">
                                            {new Date(ticket.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="text-xs text-woof-charcoal/50 block">{ticket.user.email}</span>

                                    <div 
                                        className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-xs font-medium leading-relaxed text-woof-charcoal prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: ticket.message }}
                                    />

                                    {ticket.attachment_path && (
                                        <div className="pt-2">
                                            <a
                                                href={`/storage/${ticket.attachment_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-woof-gold hover:underline"
                                            >
                                                <Paperclip className="h-3.5 w-3.5" /> View Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thread Replies */}
                        <div className="space-y-4">
                            {ticket.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className={`rounded-3xl border p-6 shadow-xs ${
                                        reply.admin_id 
                                            ? 'bg-[#fcfbf9] border-[#e8ded1] ml-6' 
                                            : 'border-[#e8ded1] bg-white mr-6'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border shadow-2xs ${
                                                reply.admin_id 
                                                    ? 'bg-woof-charcoal text-white border-woof-charcoal' 
                                                    : 'bg-[#fcfbf9] text-woof-gold border-[#e8ded1]'
                                            }`}
                                        >
                                            {reply.admin_id ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>

                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-woof-charcoal">
                                                        {reply.admin_id ? reply.admin?.name : reply.user?.name}
                                                    </span>
                                                    {reply.admin_id && (
                                                        <span className="rounded-full bg-woof-charcoal text-white px-2 py-0.2 text-[9px] font-bold uppercase">STAFF</span>
                                                    )}
                                                </div>

                                                <span className="text-[10px] text-woof-charcoal/50">
                                                    {new Date(reply.created_at).toLocaleString()}
                                                </span>
                                            </div>

                                            <div
                                                className="text-xs font-medium leading-relaxed text-woof-charcoal prose max-w-none pt-1"
                                                dangerouslySetInnerHTML={{ __html: reply.message }}
                                            />

                                            {reply.attachment_path && (
                                                <div className="pt-2">
                                                    <a
                                                        href={`/storage/${reply.attachment_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-woof-gold hover:underline"
                                                    >
                                                        <Paperclip className="h-3.5 w-3.5" /> View Attachment
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form Card */}
                        {ticket.status !== 'closed' ? (
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="message" className="text-xs font-bold text-woof-charcoal">
                                            Post Reply
                                        </Label>

                                        <Textarea
                                            id="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Write your response to the user here..."
                                            className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                            required
                                        />
                                        {errors.message && <p className="text-xs text-rose-500">{errors.message}</p>}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="attachment"
                                                    onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full border-[#e8ded1] bg-[#fcfbf9] text-xs font-bold text-woof-charcoal hover:bg-white"
                                                >
                                                    <Paperclip className="mr-1.5 h-3.5 w-3.5 text-woof-gold" />
                                                    {data.attachment ? data.attachment.name : 'Attach File'}
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="reply_status" className="text-xs font-bold text-woof-charcoal/60">
                                                    Set Status:
                                                </Label>

                                                <select
                                                    id="reply_status"
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value as any)}
                                                    className="h-8 rounded-xl border border-[#e8ded1] bg-[#fcfbf9] px-2.5 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                                >
                                                    <option value="open">Keep Open</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Mark Resolved</option>
                                                    <option value="closed">Close Ticket</option>
                                                </select>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-10 rounded-full px-6 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                                        >
                                            {processing ? 'Sending...' : 'Post Reply'} <Send className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 text-center space-y-3">
                                <p className="text-xs font-bold text-woof-charcoal/60">This ticket is currently closed. Reopen it to post further replies.</p>
                                <Button
                                    type="button"
                                    onClick={() => updateStatus('open')}
                                    className="h-9 px-5 rounded-full border border-[#e8ded1] bg-white text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                                >
                                    Reopen Ticket
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info Column */}
                    <div className="space-y-6">
                        {/* User Details */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal border-b border-[#e8ded1] pb-3 uppercase tracking-wider">
                                Requester Details
                            </h3>

                            <div className="space-y-4 pt-3">
                                <div>
                                    <Label className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Name</Label>
                                    <p className="text-xs font-bold text-woof-charcoal mt-0.5">{ticket.user.name}</p>
                                </div>

                                <div>
                                    <Label className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Email</Label>
                                    <p className="text-xs font-medium text-woof-charcoal mt-0.5">{ticket.user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Info */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal border-b border-[#e8ded1] pb-3 uppercase tracking-wider">
                                Ticket Attributes
                            </h3>

                            <div className="space-y-4 pt-3">
                                <div>
                                    <Label className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Category</Label>
                                    <p className="text-xs font-bold text-woof-charcoal uppercase tracking-wide mt-0.5">{ticket.category}</p>
                                </div>

                                <div>
                                    <Label className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Priority Level</Label>
                                    <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                                </div>

                                <div>
                                    <Label className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Submitted</Label>
                                    <p className="text-xs text-woof-charcoal/70 mt-0.5">{new Date(ticket.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Audit History */}
                        {(ticket.escalated_to_hr_at || ticket.returned_to_queue_at || ticket.last_transferred_at) && (
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                                <h3 className="text-xs font-bold text-woof-charcoal flex items-center gap-2 border-b border-[#e8ded1] pb-3 uppercase tracking-wider">
                                    <Activity className="h-3.5 w-3.5 text-woof-gold" />
                                    Audit Trail
                                </h3>
                                <div className="space-y-3 pt-3">
                                    {ticket.escalated_to_hr_at && (
                                        <div className="flex items-start gap-2.5">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                                                <span className="text-[10px]">🔺</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-amber-800">
                                                    Escalated to HR
                                                </p>
                                                <p className="text-[10px] text-woof-charcoal/50">
                                                    {formatRelativeTime(ticket.escalated_to_hr_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {ticket.returned_to_queue_at && (
                                        <div className="flex items-start gap-2.5">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                                                <span className="text-[10px]">🔄</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-emerald-800">
                                                    Returned to Queue
                                                </p>
                                                <p className="text-[10px] text-woof-charcoal/50">
                                                    {formatRelativeTime(ticket.returned_to_queue_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {ticket.last_transferred_at && (
                                        <div className="flex items-start gap-2.5">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fcfbf9] border border-[#e8ded1]">
                                                <span className="text-[10px]">↗️</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-woof-charcoal">
                                                    Transferred
                                                </p>
                                                <p className="text-[10px] text-woof-charcoal/50">
                                                    {formatRelativeTime(ticket.last_transferred_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
