import { Head, Link, router } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { Store, User, Plus, ExternalLink, Calendar, Search } from 'lucide-react';
import { LEAD_STATUS_CONFIG as STATUS_CONFIG, LEAD_STATUS_LABELS as STATUS_LABELS } from '@/lib/constants';
import { RelativeTime } from '@/components/ui/RelativeTime';

interface Lead {
    id: number;
    business_name: string;
    contact_person: string | null;
    phone: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    next_follow_up_date?: string | null;
    agent: { name: string };
}

interface Props {
    leads: Lead[];
    statusCounts: Record<string, number>;
    filters: { status: string };
}

export default function LeadsIndex({ leads, statusCounts, filters }: Props) {
    const activeStatus = filters.status || 'all';
    const totalLeads = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    const handleStatusFilter = (status: string) => {
        router.get(
            route('agent.leads.index'),
            { status: status === 'all' ? '' : status },
            { preserveState: true, replace: true },
        );
    };

    const handleQuickStatus = (leadId: number, newStatus: string) => {
        router.post(route('agent.leads.status', leadId), {
            status: newStatus,
        }, { preserveScroll: true });
    };

    return (
        <AgentLayout title="Leads CRM Pipeline">
            <Head title="Leads CRM" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Leads & Prospects Pipeline</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Manage outbound prospecting, schedule follow-ups, and convert leads to directory listings.</p>
                    </div>
                    <Link
                        href={route('agent.leads.create')}
                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                        <Plus className="size-3.5" /> Add Prospect Lead
                    </Link>
                </div>

                {/* Pipeline status tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => handleStatusFilter('all')}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeStatus === 'all'
                                ? 'bg-woof-charcoal text-white shadow-xs'
                                : 'bg-white border border-[#e8ded1] text-woof-charcoal/70 hover:text-woof-charcoal hover:border-woof-gold'
                        }`}
                    >
                        All Leads ({totalLeads})
                    </button>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => handleStatusFilter(key)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                activeStatus === key
                                    ? 'bg-woof-charcoal text-white shadow-xs'
                                    : 'bg-white border border-[#e8ded1] text-woof-charcoal/70 hover:text-woof-charcoal hover:border-woof-gold'
                            }`}
                        >
                            <span className={`inline-block h-2 w-2 rounded-full ${STATUS_CONFIG[key]?.dot || 'bg-zinc-400'}`} />
                            {label} ({statusCounts[key] || 0})
                        </button>
                    ))}
                </div>

                {leads.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-12 text-center shadow-xs">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                            <Store className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-bold text-woof-charcoal mb-1">
                            {activeStatus === 'all' ? 'No Leads in Pipeline' : 'No Leads with Selected Status'}
                        </h3>
                        <p className="text-xs text-woof-charcoal/60 max-w-md mx-auto mb-6 font-normal">
                            {activeStatus === 'all'
                                ? 'Start building your sales pipeline by adding prospective pet businesses and service providers.'
                                : 'Try selecting a different status filter or create a new lead.'}
                        </p>
                        <Link
                            href={route('agent.leads.create')}
                            className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-6 py-2.5 rounded-full font-bold text-xs transition-all shadow-xs"
                        >
                            <Plus className="size-3.5" /> Create First Lead
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {leads.map((lead) => {
                            const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                            return (
                                <div
                                    key={lead.id}
                                    className="bg-white rounded-3xl border border-[#e8ded1] p-5 shadow-xs hover:border-woof-gold/60 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5 min-w-0">
                                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center shrink-0 shadow-2xs">
                                                <Store className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <Link href={route('agent.leads.show', lead.id)} className="font-bold text-sm text-woof-charcoal hover:text-woof-gold transition-colors block truncate">
                                                    {lead.business_name}
                                                </Link>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-woof-charcoal/60 mt-0.5">
                                                    {lead.contact_person && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="size-3 text-woof-charcoal/40" />
                                                            {lead.contact_person}
                                                        </span>
                                                    )}
                                                    {lead.phone && (
                                                        <span className="font-mono text-woof-charcoal/70">{lead.phone}</span>
                                                    )}
                                                    {lead.next_follow_up_date && (
                                                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                                                            <Calendar className="size-3" />
                                                            Follow-up: {new Date(lead.next_follow_up_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleQuickStatus(lead.id, e.target.value)}
                                                className="text-xs rounded-full border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal font-bold px-3 py-1.5 cursor-pointer focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                            >
                                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>

                                            <Link
                                                href={route('agent.leads.show', lead.id)}
                                                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:border-woof-gold hover:text-woof-gold transition-colors"
                                            >
                                                Details <ExternalLink className="size-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}
