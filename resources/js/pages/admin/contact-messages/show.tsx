import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, Archive, ArrowLeft, Eye, Mail, Reply, Tag, Trash2, User } from 'lucide-react';

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
    message: ContactMessage;
}

export default function AdminContactMessageShow({ message }: PageProps) {
    const { delete: destroy, processing } = useForm();

    const updateStatus = (status: string) => {
        router.patch(route('admin.contact-messages.update-status', message.id), { status }, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this message?')) {
            destroy(route('admin.contact-messages.destroy', message.id));
        }
    };

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

    return (
        <AdminLayout title="Message Details">
            <Head title={`Message from ${message.name} - Admin`} />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href={route('admin.contact-messages.index')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-charcoal transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Messages
                    </Link>

                    <div className="flex items-center gap-2">
                        <select
                            value={message.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            disabled={processing}
                            className="h-9 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-1 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                        >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                        </select>

                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="h-9 px-3 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    {/* Header */}
                    <div className="border-b border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-xl font-bold text-woof-charcoal">
                                        {message.subject}
                                    </h1>
                                    {getStatusBadge(message.status)}
                                </div>
                                <p className="text-xs text-woof-charcoal/60">
                                    Submitted on {new Date(message.created_at).toLocaleString()}
                                </p>
                            </div>

                            <a
                                href={`mailto:${message.email}`}
                                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-woof-charcoal hover:bg-woof-forest text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                                <Reply className="h-4 w-4" /> Reply via Email
                            </a>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 border-b border-[#e8ded1] sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#e8ded1]">
                        <div className="flex items-center gap-3.5 p-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Full Name</p>
                                <p className="text-sm font-bold text-woof-charcoal">{message.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 p-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Email Address</p>
                                <p className="text-sm font-bold text-woof-charcoal">{message.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="p-6 sm:p-8 space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-woof-gold" />
                            <span className="text-[10px] font-bold text-woof-charcoal/60 uppercase tracking-wider">Message Content</span>
                        </div>

                        <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-5">
                            <p className="text-xs font-medium text-woof-charcoal leading-relaxed whitespace-pre-wrap">
                                {message.message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
