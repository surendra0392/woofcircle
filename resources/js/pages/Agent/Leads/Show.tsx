import { Head, Link, router, useForm } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { Store, ArrowLeft, Trash2, Phone, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/time';

interface Lead {
    id: number;
    business_name: string;
    contact_person: string | null;
    phone: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    agent: { name: string };
}

interface Props {
    lead: Lead;
}

export default function LeadShow({ lead }: Props) {
    const { data, setData, put, processing } = useForm({
        business_name: lead.business_name,
        contact_person: lead.contact_person || '',
        phone: lead.phone || '',
        status: lead.status,
        notes: lead.notes || '',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('agent.leads.update', lead.id));
    };

    const handleDelete = () => {
        if (!confirm('Delete this lead? This cannot be undone.')) return;
        router.delete(route('agent.leads.destroy', lead.id));
    };

    const handleStatusQuick = (newStatus: string) => {
        router.post(route('agent.leads.status', lead.id), {
            status: newStatus,
        }, { preserveScroll: true });
    };

    return (
        <AgentLayout title={`Lead: ${lead.business_name}`}>
            <Head title={`${lead.business_name} — Lead`} />

            <div className="mb-6">
                <Link
                    href={route('agent.leads.index')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-gold transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Leads CRM
                </Link>
            </div>

            <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-3">
                {/* Main: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#e8ded1]">
                            <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs shrink-0">
                                <Store className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold text-woof-charcoal truncate">{lead.business_name}</h1>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                    Registered {formatDate(lead.created_at)} by {lead.agent.name}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={data.business_name}
                                    onChange={e => setData('business_name', e.target.value)}
                                    className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_person}
                                        onChange={e => setData('contact_person', e.target.value)}
                                        className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                    Notes & Interactions
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    rows={5}
                                    className="w-full p-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#e8ded1]">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="size-3.5" /> Delete Lead
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Convert Button */}
                    {lead.status !== 'converted' && (
                        <div className="bg-woof-forest rounded-3xl p-6 shadow-md text-white">
                            <h3 className="text-base font-bold mb-1 tracking-tight">Ready to Onboard?</h3>
                            <p className="text-xs text-white/70 mb-4">
                                Convert this prospect directly into an official directory business listing.
                            </p>
                            <Link
                                href={route('agent.leads.convert', lead.id)}
                                method="post"
                                as="button"
                                className="w-full inline-flex items-center justify-center gap-2 bg-woof-gold hover:bg-woof-pearl text-woof-charcoal px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-xs cursor-pointer"
                            >
                                <CheckCircle2 className="size-3.5" /> Convert to Profile
                            </Link>
                        </div>
                    )}

                    {/* Status Card */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4">Pipeline Status</h3>
                        <div className="space-y-2">
                            {Object.entries(LEAD_STATUS_LABELS).map(([key, label]) => {
                                const isActive = lead.status === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleStatusQuick(key)}
                                        disabled={isActive}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-woof-charcoal text-white shadow-xs'
                                                : 'text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal border border-transparent'
                                        }`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${
                                            isActive ? 'bg-woof-gold' : 'bg-zinc-300'
                                        }`} />
                                        {label}
                                        {isActive && (
                                            <span className="ml-auto text-[9px] font-black uppercase tracking-wider text-woof-gold">Active</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4">Quick Details</h3>
                        <div className="space-y-3 text-xs">
                            {lead.contact_person && (
                                <div className="flex items-center gap-2 text-woof-charcoal font-medium">
                                    <Phone className="h-3.5 w-3.5 text-woof-gold" />
                                    {lead.contact_person}
                                </div>
                            )}
                            {lead.phone && (
                                <div className="text-woof-charcoal/70 font-mono pl-5.5">{lead.phone}</div>
                            )}
                            <div className="pt-2 text-[11px] text-woof-charcoal/50 border-t border-[#e8ded1]">
                                Responsible Agent: <span className="font-bold text-woof-charcoal">{lead.agent.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}
