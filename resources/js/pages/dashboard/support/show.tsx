import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Download, FileText, LifeBuoy, Paperclip, Send, ShieldCheck, User, XCircle, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Reply {
    id: number;
    user_id: number | null;
    admin_id: number | null;
    message: string;
    attachment_path: string | null;
    created_at: string;
    user?: { name: string };
    admin?: { name: string };
}

interface Ticket {
    id: number;
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    message: string;
    attachment_path: string | null;
    created_at: string;
    replies: Reply[];
}

interface PageProps {
    ticket: Ticket;
}

export default function SupportShow({ ticket }: PageProps) {
    const [fileName, setFileName] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Support', href: '/dashboard/support' },
        { title: `Ticket #${ticket.id}`, href: '#' },
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        attachment: null as File | null,
    });

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.support.update', ticket.id), {
            onSuccess: () => {
                reset();
                setFileName(null);
                toast.success('Reply submitted successfully.');
            },
            onError: () => {
                toast.error('Failed to submit reply. Please try again.');
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('attachment', file);
        setFileName(file ? file.name : null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-[10px] font-bold tracking-wider text-emerald-800 uppercase px-2.5 py-0.5">
                        <AlertCircle className="mr-1 h-3 w-3" /> Open
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge className="rounded-full border border-amber-200 bg-amber-50 text-[10px] font-bold tracking-wider text-amber-800 uppercase px-2.5 py-0.5">
                        <Clock className="mr-1 h-3 w-3" /> In Progress
                    </Badge>
                );
            case 'resolved':
                return (
                    <Badge className="rounded-full border border-sky-200 bg-sky-50 text-[10px] font-bold tracking-wider text-sky-800 uppercase px-2.5 py-0.5">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Solved
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] text-[10px] font-bold tracking-wider text-woof-charcoal/60 uppercase px-2.5 py-0.5">
                        <XCircle className="mr-1 h-3 w-3" /> Closed
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title={`Ticket #${ticket.id}`}
            subtitle={ticket.subject}
            actions={
                <Link href={route('dashboard.support.index')}>
                    <Button
                        variant="outline"
                        className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-woof-charcoal text-xs font-bold px-5 h-10 transition-all shadow-2xs cursor-pointer"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets
                    </Button>
                </Link>
            }
        >
            <Head title={`Ticket #${ticket.id} - ${ticket.subject}`} />

            <div className="mx-auto max-w-5xl space-y-8 pb-16">
                {/* Ticket Meta Header Card */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ded1] pb-4">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-xs font-bold text-woof-gold">Ticket #{ticket.id}</span>
                            {getStatusBadge(ticket.status)}
                            <span className="text-xs font-bold text-woof-charcoal/60 bg-[#fcfbf9] border border-[#e8ded1] rounded-full px-2.5 py-0.5">
                                {ticket.category}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">
                                Priority: {ticket.priority}
                            </span>
                        </div>
                        <span className="text-xs text-woof-charcoal/50 font-medium">
                            Created {new Date(ticket.created_at).toLocaleString()}
                        </span>
                    </div>

                    <h2 className="text-lg font-bold text-woof-charcoal">{ticket.subject}</h2>
                    <p className="text-xs text-woof-charcoal/80 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>

                    {ticket.attachment_path && (
                        <div className="pt-2">
                            <a
                                href={`/storage/${ticket.attachment_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2 text-xs font-bold text-woof-charcoal hover:bg-white transition-all shadow-2xs"
                            >
                                <Paperclip className="h-3.5 w-3.5 text-woof-gold" />
                                View Initial Attachment
                            </a>
                        </div>
                    )}
                </div>

                {/* Conversation Thread */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider px-1">
                        Discussion History ({ticket.replies.length})
                    </h3>

                    {ticket.replies.map((reply) => {
                        const isAdmin = !!reply.admin_id;
                        return (
                            <div
                                key={reply.id}
                                className={`rounded-3xl border p-6 shadow-xs space-y-3 ${
                                    isAdmin
                                        ? 'bg-amber-50/40 border-amber-200 ml-4 sm:ml-8'
                                        : 'bg-white border-[#e8ded1] mr-4 sm:mr-8'
                                }`}
                            >
                                <div className="flex items-center justify-between border-b border-[#e8ded1]/60 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                                            isAdmin
                                                ? 'bg-amber-100 border border-amber-300 text-amber-900'
                                                : 'bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold'
                                        }`}>
                                            {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-woof-charcoal">
                                                {isAdmin ? (reply.admin?.name || 'Support Staff') : (reply.user?.name || 'You')}
                                            </h4>
                                            <p className="text-[10px] text-woof-charcoal/50">
                                                {isAdmin ? 'Official Staff Response' : 'Requester'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-woof-charcoal/40 font-medium">
                                        {new Date(reply.created_at).toLocaleString()}
                                    </span>
                                </div>

                                <p className="text-xs text-woof-charcoal/80 leading-relaxed whitespace-pre-wrap">
                                    {reply.message}
                                </p>

                                {reply.attachment_path && (
                                    <div className="pt-2">
                                        <a
                                            href={`/storage/${reply.attachment_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-[#e8ded1] bg-white px-3 py-1.5 text-xs font-medium text-woof-charcoal hover:border-woof-gold transition-all"
                                        >
                                            <Paperclip className="h-3.5 w-3.5 text-woof-gold" />
                                            Attachment
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Reply Form */}
                {ticket.status !== 'closed' ? (
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-2">
                            <Send className="h-4 w-4 text-woof-gold" /> Add Reply
                        </h3>

                        <form onSubmit={submitReply} className="space-y-4">
                            <Textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Type your message to support staff..."
                                className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[120px] rounded-2xl p-4 text-xs font-medium text-woof-charcoal"
                                required
                            />
                            {errors.message && <p className="text-xs font-bold text-rose-500">{errors.message}</p>}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                <div>
                                    <input
                                        type="file"
                                        id="reply-file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="reply-file"
                                        className="inline-flex items-center gap-2 rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white px-4 py-2 text-xs font-bold text-woof-charcoal cursor-pointer transition-colors shadow-2xs"
                                    >
                                        <Paperclip className="h-3.5 w-3.5 text-woof-gold" />
                                        {fileName ? `Attached: ${fileName}` : 'Attach File'}
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 text-xs font-bold shadow-xs transition-all cursor-pointer"
                                >
                                    {processing ? 'Submitting...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 text-center">
                        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                        <h4 className="text-sm font-bold text-woof-charcoal">Ticket Resolved & Closed</h4>
                        <p className="text-xs text-woof-charcoal/60 mt-1">This support ticket has been closed. To ask another question, please open a new ticket.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
