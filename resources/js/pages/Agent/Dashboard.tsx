import AgentLayout from '@/layouts/AgentLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Users, IndianRupee, Store, TrendingUp, UserPlus, Megaphone, LifeBuoy, ArrowUpRight } from 'lucide-react';
import { can } from '@/lib/permissions';

interface Props {
    onboardedCount: number;
    adRevenue: number;
    recentProfiles: any[];
    eligibleTargets?: any[];
    leadCount?: number;
    upcomingFollowUps?: any[];
}

export default function Dashboard({ onboardedCount, adRevenue, recentProfiles, eligibleTargets, leadCount = 0, upcomingFollowUps = [] }: Props) {
    const { props } = usePage();
    const { auth } = props as any;
    const role = auth?.admin?.role || auth?.admin?.data?.role;
    const targets = eligibleTargets ?? [];
    const canTransfer = can(role, 'profile', targets);
    const flash = props.flash as { success?: string; error?: string };

    return (
        <AgentLayout title="Field Overview">
            <Head title="Agent Dashboard" />
            
            {flash.success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <p>{flash.success}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Field Intelligence Hub</h1>
                    <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Real-time telemetry on profile onboardings, advertising revenue, and lead pipeline.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('agent.onboarding.create')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-woof-charcoal text-white text-xs font-bold hover:bg-woof-gold hover:text-woof-charcoal transition-all shadow-xs"
                    >
                        <UserPlus className="size-3.5" /> Onboard Business
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-woof-gold/10 border border-woof-gold/30 text-woof-gold flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-woof-charcoal/50 font-bold uppercase tracking-wider">Total Onboarded</p>
                        <h3 className="text-3xl font-black text-woof-charcoal tracking-tight mt-0.5">{onboardedCount}</h3>
                        <span className="text-[10px] font-bold text-emerald-600">Active Accounts</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-woof-forest/10 border border-woof-forest/20 text-woof-forest flex items-center justify-center shrink-0">
                        <IndianRupee className="w-6 h-6 text-woof-gold" />
                    </div>
                    <div>
                        <p className="text-xs text-woof-charcoal/50 font-bold uppercase tracking-wider">Ad Revenue Generated</p>
                        <h3 className="text-3xl font-black text-woof-charcoal tracking-tight mt-0.5">₹{(adRevenue || 0).toLocaleString()}</h3>
                        <span className="text-[10px] font-bold text-woof-gold">Gross Ad Booking</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-woof-charcoal/50 font-bold uppercase tracking-wider">Active Pipeline</p>
                        <h3 className="text-3xl font-black text-woof-charcoal tracking-tight mt-0.5">{leadCount}</h3>
                        <span className="text-[10px] font-bold text-amber-600">Prospect Leads</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider mb-4">Operations Suite</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link href={route('agent.onboarding.create')} className="bg-white p-5 rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col justify-center items-center text-center hover:border-woof-gold hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] group-hover:border-woof-gold/40 flex items-center justify-center mb-3 transition-colors text-woof-gold">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-woof-charcoal tracking-tight">Onboard Entity</span>
                        <span className="text-[10px] text-woof-charcoal/50 mt-0.5">Vet, Trainer, Breeder</span>
                    </Link>
                    <Link href={route('agent.book-ad.create')} className="bg-white p-5 rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col justify-center items-center text-center hover:border-woof-gold hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] group-hover:border-woof-gold/40 flex items-center justify-center mb-3 transition-colors text-woof-gold">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-woof-charcoal tracking-tight">Book Placement</span>
                        <span className="text-[10px] text-woof-charcoal/50 mt-0.5">Promote Listing</span>
                    </Link>
                    <Link href={route('agent.earnings.index')} className="bg-white p-5 rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col justify-center items-center text-center hover:border-woof-gold hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] group-hover:border-woof-gold/40 flex items-center justify-center mb-3 transition-colors text-woof-gold">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-woof-charcoal tracking-tight">Commissions</span>
                        <span className="text-[10px] text-woof-charcoal/50 mt-0.5">Disbursement Ledger</span>
                    </Link>
                    <Link href={route('agent.support.index')} className="bg-white p-5 rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col justify-center items-center text-center hover:border-woof-gold hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] group-hover:border-woof-gold/40 flex items-center justify-center mb-3 transition-colors text-woof-gold">
                            <LifeBuoy className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-woof-charcoal tracking-tight">Field Support</span>
                        <span className="text-[10px] text-woof-charcoal/50 mt-0.5">Internal Tickets</span>
                    </Link>
                </div>
            </div>

            {/* Follow-ups */}
            {upcomingFollowUps.length > 0 && (
                <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-[#e8ded1] flex justify-between items-center bg-[#fcfbf9]">
                        <h2 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider">Scheduled Follow-ups</h2>
                        <Link href={route('agent.leads.index')} className="text-xs text-woof-gold font-bold hover:underline">
                            View CRM Pipeline &rarr;
                        </Link>
                    </div>
                    <div className="divide-y divide-[#e8ded1]">
                        {upcomingFollowUps.map(lead => (
                            <div key={lead.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fcfbf9] transition-colors">
                                <div>
                                    <Link href={route('agent.leads.show', lead.id)} className="font-bold text-sm text-woof-charcoal capitalize hover:text-woof-gold">
                                        {lead.business_name}
                                    </Link>
                                    <p className="text-xs text-woof-charcoal/60 capitalize mt-0.5">{lead.contact_person || 'No Contact Person'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-right">
                                        <span className="block text-woof-charcoal/50 font-medium">Follow-up Due:</span>
                                        <span className={`font-bold ${new Date(lead.next_follow_up_date) <= new Date() ? 'text-rose-600' : 'text-amber-600'}`}>
                                            {new Date(lead.next_follow_up_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Onboarded Profiles */}
            <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#e8ded1] flex justify-between items-center bg-[#fcfbf9]">
                    <h2 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider">Recent Onboardings</h2>
                    <Link href={route('agent.onboarding.create')} className="text-xs text-woof-gold font-bold hover:underline">
                        + New Onboarding
                    </Link>
                </div>
                <div className="divide-y divide-[#e8ded1]">
                    {recentProfiles.length === 0 ? (
                        <div className="p-8 text-center text-xs text-woof-charcoal/50">
                            No service profiles onboarded yet.
                        </div>
                    ) : (
                        recentProfiles.map(profile => (
                            <div key={profile.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fcfbf9] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center shadow-2xs shrink-0">
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-woof-charcoal capitalize">{profile.name}</p>
                                        <span className="inline-block text-[10px] font-bold text-woof-gold uppercase tracking-wider">{profile.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-right">
                                        <span className="block text-woof-charcoal/50 font-medium">Assigned Agent:</span>
                                        <span className="font-bold text-woof-charcoal">{profile.agent ? profile.agent.name : 'Unassigned'}</span>
                                    </div>
                                    {canTransfer && (
                                        <form 
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const select = (e.target as HTMLFormElement).agent_id;
                                                if (select.value) {
                                                    router.post(route('agent.profiles.transfer', profile.id), { agent_id: select.value });
                                                }
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            <select name="agent_id" className="text-xs border-[#e8ded1] rounded-2xl bg-white px-3 py-1.5 text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold" defaultValue="" required>
                                                <option value="" disabled>Transfer to...</option>
                                                {targets.map((t) => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <button type="submit" className="text-xs bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer">
                                                Transfer
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AgentLayout>
    );
}
