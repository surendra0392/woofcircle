import { Head, Link, useForm } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { Store, ArrowLeft } from 'lucide-react';
import { LEAD_STATUS_OPTIONS } from '@/lib/constants';

export default function LeadsEdit({ lead }: any) {
    const { data, setData, put, processing, errors } = useForm({
        business_name: lead.business_name || '',
        contact_person: lead.contact_person || '',
        phone: lead.phone || '',
        status: lead.status || 'new',
        notes: lead.notes || '',
        next_follow_up_date: lead.next_follow_up_date || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('agent.leads.update', lead.id));
    };

    return (
        <AgentLayout title={`Edit Lead: ${lead.business_name}`}>
            <Head title={`Edit ${lead.business_name}`} />

            <div className="mb-6">
                <Link
                    href={route('agent.leads.index')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-gold transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Leads CRM
                </Link>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#e8ded1]">
                        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                            <Store className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-woof-charcoal">Edit Prospect Record</h1>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5">{lead.business_name}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                Business Name <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.business_name}
                                onChange={e => setData('business_name', e.target.value)}
                                className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                required
                            />
                            {errors.business_name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.business_name}</p>}
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
                                <div className="flex shadow-2xs">
                                    <span className="inline-flex items-center rounded-l-2xl border border-r-0 border-[#e8ded1] bg-[#fcfbf9] px-3.5 text-xs text-woof-charcoal font-bold">
                                        +91
                                    </span>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={data.phone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setData('phone', val);
                                        }}
                                        className="w-full h-11 px-4 text-xs rounded-r-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold font-mono"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                    Pipeline Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                >
                                    {LEAD_STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                    Next Follow-up Date
                                </label>
                                <input
                                    type="date"
                                    value={data.next_follow_up_date}
                                    onChange={e => setData('next_follow_up_date', e.target.value)}
                                    className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                                Notes & Follow-up History
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                rows={4}
                                className="w-full p-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8ded1]">
                            <Link
                                href={route('agent.leads.index')}
                                className="px-5 py-2.5 text-xs font-bold text-woof-charcoal/70 hover:text-woof-charcoal rounded-full transition-colors"
                            >
                                Cancel
                            </Link>
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
        </AgentLayout>
    );
}
