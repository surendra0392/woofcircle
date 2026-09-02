import { Head, Link, usePage } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { Users, CreditCard, IndianRupee, TicketCheck, CalendarDays, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useHrTicketCount } from '@/hooks/useHrTicketCount';

interface Props {
    kpis: {
        totalActiveEmployees: number;
        pendingPayoutsCount: number;
        pendingPayoutsTotal: number;
        ticketsCount: number;
        pendingLeavesCount: number;
    };
}

export default function Dashboard({ kpis }: Props) {
    const { auth } = usePage().props as any;
    const adminId = auth?.admin?.data?.id || auth?.admin?.id || auth?.user?.id;
    const { count: ticketsCount } = useHrTicketCount(adminId, kpis.ticketsCount);

    const kpiCards = [
        { 
            title: 'Active Employees', 
            value: kpis.totalActiveEmployees, 
            icon: Users, 
            iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
            href: route('hr.employees.index'),
            description: 'Verified staff members'
        },
        { 
            title: 'Pending Disbursements', 
            value: kpis.pendingPayoutsCount, 
            icon: CreditCard, 
            iconBg: 'bg-amber-50 text-amber-700 border-amber-200', 
            href: route('hr.payouts.index'),
            description: 'Payout requests queued'
        },
        { 
            title: 'Pending Payout Volume', 
            value: `₹${kpis.pendingPayoutsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            icon: IndianRupee, 
            iconBg: 'bg-sky-50 text-sky-700 border-sky-200', 
            href: null,
            description: 'Total settlement value'
        },
        {
            title: 'Pending Leave Approvals',
            value: kpis.pendingLeavesCount,
            icon: CalendarDays,
            iconBg: kpis.pendingLeavesCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-[#fcfbf9] text-woof-charcoal/40 border-[#e8ded1]',
            href: route('hr.leaves.index'),
            description: kpis.pendingLeavesCount > 0 ? 'Requires management review' : 'No pending requests',
            accent: kpis.pendingLeavesCount > 0,
        },
        {
            title: 'Assigned HR Tickets',
            value: ticketsCount,
            icon: TicketCheck,
            iconBg: ticketsCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-[#fcfbf9] text-woof-charcoal/40 border-[#e8ded1]',
            href: route('hr.tickets.index'),
            description: ticketsCount > 0 ? 'Actionable inquiries' : 'Queue clear',
            accent: ticketsCount > 0,
        },
    ];

    return (
        <HrLayout title="HR Executive Dashboard">
            <Head title="HR Dashboard" />
            
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">HR Executive Overview</h1>
                    <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Real-time telemetry on personnel roster, payroll queue, and departmental inquiries.</p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {kpiCards.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        const card = (
                            <div
                                key={idx}
                                className={`bg-white rounded-3xl p-5 border shadow-xs transition-all h-full flex flex-col justify-between ${
                                    kpi.accent
                                        ? 'border-amber-300 ring-1 ring-amber-300/50 bg-amber-50/20'
                                        : 'border-[#e8ded1] hover:border-woof-gold/60'
                                } ${kpi.href ? 'cursor-pointer' : ''}`}
                            >
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-[10px] font-bold text-woof-charcoal/60 uppercase tracking-wider line-clamp-1">{kpi.title}</span>
                                    <div className={`size-10 rounded-2xl flex items-center justify-center border shrink-0 ${kpi.iconBg}`}>
                                        <Icon className="size-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-woof-charcoal tracking-tight">
                                        {kpi.value}
                                    </p>
                                    <p className="text-[11px] text-woof-charcoal/50 mt-1 line-clamp-1">
                                        {kpi.description}
                                    </p>
                                </div>
                            </div>
                        );

                        return kpi.href ? (
                            <Link key={idx} href={kpi.href}>
                                {card}
                            </Link>
                        ) : (
                            card
                        );
                    })}
                </div>

                {/* Quick Operations */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Operational Portals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href={route('hr.employees.index')}
                            className="group bg-white rounded-3xl border border-[#e8ded1] p-5 shadow-xs hover:border-woof-gold/60 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="size-11 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold group-hover:scale-105 transition-transform">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-woof-charcoal group-hover:text-woof-gold transition-colors">Staff Directory</h3>
                                    <p className="text-[11px] text-woof-charcoal/50 mt-0.5">Manage personnel records</p>
                                </div>
                            </div>
                            <div className="size-7 rounded-full bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-charcoal/40 group-hover:text-woof-gold group-hover:border-woof-gold transition-colors">
                                <ArrowRight className="size-3.5" />
                            </div>
                        </Link>

                        <Link
                            href={route('hr.payouts.index')}
                            className="group bg-white rounded-3xl border border-[#e8ded1] p-5 shadow-xs hover:border-woof-gold/60 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="size-11 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold group-hover:scale-105 transition-transform">
                                    <CreditCard className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-woof-charcoal group-hover:text-woof-gold transition-colors">Payouts & Payroll</h3>
                                    <p className="text-[11px] text-woof-charcoal/50 mt-0.5">Process agent disbursements</p>
                                </div>
                            </div>
                            <div className="size-7 rounded-full bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-charcoal/40 group-hover:text-woof-gold group-hover:border-woof-gold transition-colors">
                                <ArrowRight className="size-3.5" />
                            </div>
                        </Link>

                        <Link
                            href={route('hr.leaves.index')}
                            className="group bg-white rounded-3xl border border-[#e8ded1] p-5 shadow-xs hover:border-woof-gold/60 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="size-11 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold group-hover:scale-105 transition-transform">
                                    <CalendarDays className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-woof-charcoal group-hover:text-woof-gold transition-colors">Leave Management</h3>
                                    <p className="text-[11px] text-woof-charcoal/50 mt-0.5">Approve employee leaves</p>
                                </div>
                            </div>
                            <div className="size-7 rounded-full bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-charcoal/40 group-hover:text-woof-gold group-hover:border-woof-gold transition-colors">
                                <ArrowRight className="size-3.5" />
                            </div>
                        </Link>

                        <Link
                            href={route('hr.profile.edit')}
                            className="group bg-white rounded-3xl border border-[#e8ded1] p-5 shadow-xs hover:border-woof-gold/60 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="size-11 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold group-hover:scale-105 transition-transform">
                                    <UserCheck className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-woof-charcoal group-hover:text-woof-gold transition-colors">HR Credentials</h3>
                                    <p className="text-[11px] text-woof-charcoal/50 mt-0.5">Account & security settings</p>
                                </div>
                            </div>
                            <div className="size-7 rounded-full bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-charcoal/40 group-hover:text-woof-gold group-hover:border-woof-gold transition-colors">
                                <ArrowRight className="size-3.5" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
