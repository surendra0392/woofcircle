import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle, CheckCircle2, Clock, Clock3, LifeBuoy, MessageSquare, Plus, Search, XCircle } from 'lucide-react';

interface Ticket {
    id: number;
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
}

interface PageProps {
    tickets: { data: Ticket[]; links: any[]; total: number };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Support Tickets', href: '/dashboard/support' },
];

export default function SupportIndex({ tickets }: PageProps) {
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
                        <CheckCircle className="mr-1 h-3 w-3" /> Solved
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'text-rose-700 bg-rose-50 border-rose-200';
            case 'high':
                return 'text-amber-800 bg-amber-50 border-amber-200';
            case 'medium':
                return 'text-sky-800 bg-sky-50 border-sky-200';
            default:
                return 'text-woof-charcoal/60 bg-[#fcfbf9] border-[#e8ded1]';
        }
    };

    const stats = [
        {
            label: 'Total Tickets',
            value: tickets.total,
            icon: MessageSquare,
            color: 'text-woof-gold',
        },
        {
            label: 'Active Cases',
            value: tickets.data.filter((t) => t.status === 'open' || t.status === 'in_progress').length,
            icon: Clock3,
            color: 'text-emerald-700',
        },
        {
            label: 'Resolved Issues',
            value: tickets.data.filter((t) => t.status === 'resolved' || t.status === 'closed').length,
            icon: CheckCircle2,
            color: 'text-sky-700',
        },
    ];

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Support Tickets"
            subtitle="Get assistance from the WoofCircle support & compliance desk"
            actions={
                <Button
                    asChild
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                    <Link href="/help" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Open New Ticket
                    </Link>
                </Button>
            }
        >
            <Head title="Support Tickets" />

            <div className="mx-auto max-w-7xl space-y-8 pb-16">
                {/* Stats Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-woof-charcoal">{stat.value}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ticket Ledger */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                    <div className="p-6 border-b border-[#e8ded1] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <LifeBuoy className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Your Inquiries</h3>
                                <p className="text-xs text-woof-charcoal/60">Tickets submitted to WoofCircle support</p>
                            </div>
                        </div>
                        <span className="text-xs text-woof-charcoal/50">{tickets.total} total cases</span>
                    </div>

                    {tickets.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                                <LifeBuoy className="h-8 w-8 text-woof-gold/40" />
                            </div>
                            <h3 className="text-base font-bold text-woof-charcoal">No Support Tickets</h3>
                            <p className="text-xs text-woof-charcoal/60 mt-1 mb-6 max-w-sm">
                                You don't have any support inquiries. If you have questions or need assistance, open a ticket.
                            </p>
                            <Button asChild className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-6 text-xs font-bold text-white shadow-xs">
                                <Link href="/help">
                                    <Plus className="mr-1.5 h-4 w-4" /> Open Ticket
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e8ded1]">
                            {tickets.data.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={route('dashboard.support.show', ticket.id)}
                                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fcfbf9] transition-colors group block"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="text-xs font-bold text-woof-gold">#{ticket.id}</span>
                                            {getStatusBadge(ticket.status)}
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-xs font-bold text-woof-charcoal/60 bg-[#fcfbf9] border border-[#e8ded1] rounded-full px-2.5 py-0.5">
                                                {ticket.category}
                                            </span>
                                        </div>

                                        <h4 className="text-base font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors line-clamp-1">
                                            {ticket.subject}
                                        </h4>
                                        <p className="text-xs text-woof-charcoal/50">
                                            Submitted on {new Date(ticket.created_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-woof-charcoal self-end sm:self-center">
                                        <span>View Discussion</span>
                                        <ArrowRight className="h-4 w-4 text-woof-gold transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {tickets.data.length > 0 && (
                    <div className="flex justify-center pt-4">
                        <Pagination links={tickets.links} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
