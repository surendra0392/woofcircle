import { Head, Link, router, usePage } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { CalendarDays, AlertCircle, Plus, Sparkles, Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';
import { LEAVE_TYPE_LABELS, LEAVE_TYPE_DOTS, LEAVE_STATUS_BADGES } from '@/lib/constants';

interface LeaveRequest {
    id: number;
    type: string;
    status: string;
    start_date: string;
    end_date: string;
    reason: string | null;
    created_at: string;
    admin: { id: number; name: string };
}

interface Props {
    leaves: LeaveRequest[];
    isHr: boolean;
    pendingCount: number;
    filters: { status: string };
}

export default function LeavesIndex({ leaves, isHr, pendingCount, filters }: Props) {
    const { auth } = usePage().props as any;
    const isHrUser = auth?.admin?.role && ['hr_director', 'hr_manager', 'hr_executive', 'superadmin'].includes(auth.admin.role);

    const handleStatusFilter = (status: string) => {
        router.get(
            route('hr.leaves.index'),
            { status: status === 'all' ? '' : status },
            { preserveState: true, replace: true },
        );
    };

    const getDuration = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return `${diff} day${diff !== 1 ? 's' : ''}`;
    };

    return (
        <HrLayout title={isHrUser ? 'Staff Leave Requests' : 'My Leave Requests'}>
            <Head title={isHrUser ? 'Leave Requests' : 'My Leaves'} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">
                            {isHrUser ? 'Staff Leave Desk' : 'My Leave Management'}
                        </h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">
                            {isHrUser
                                ? `Review and approve departmental time off requests (${pendingCount} pending)`
                                : 'Submit and monitor leave applications and annual balance.'}
                        </p>
                    </div>
                    <Link
                        href={route('hr.leaves.create')}
                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                        <Plus className="size-4 stroke-[3]" /> Request Time Off
                    </Link>
                </div>

                {/* Pending attention banner (HR only) */}
                {isHrUser && pendingCount > 0 && (
                    <div className="rounded-3xl border border-amber-300 bg-amber-50/50 p-5 shadow-xs flex items-center gap-3.5">
                        <div className="size-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-800 shrink-0">
                            <AlertCircle className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pending Management Approvals</h4>
                            <p className="text-xs text-amber-800/80 mt-0.5">
                                You have {pendingCount} staff leave request{pendingCount !== 1 ? 's' : ''} awaiting review and authorization.
                            </p>
                        </div>
                    </div>
                )}

                {/* Status filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((status) => {
                        const active = (filters.status || 'all') === status;
                        const badge = status === 'pending' ? pendingCount : undefined;
                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                                    active
                                        ? 'bg-woof-charcoal text-white border-woof-charcoal shadow-xs'
                                        : 'bg-white text-woof-charcoal/60 border-[#e8ded1] hover:border-woof-gold/60 hover:text-woof-charcoal'
                                }`}
                            >
                                {status}
                                {badge !== undefined && badge > 0 && (
                                    <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[8px] font-black text-white">
                                        {badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {leaves.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-[#e8ded1] bg-white p-16 text-center shadow-xs">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                            <CalendarDays className="size-6" />
                        </div>
                        <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider">No Leave Requests Found</h3>
                        <p className="mt-1 text-xs text-woof-charcoal/60 max-w-sm mx-auto">
                            There are currently no leave requests recorded for this filter category.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leaves.map((leave) => {
                            const StatusIcon = LEAVE_STATUS_BADGES[leave.status]?.icon || Clock;
                            const badge = LEAVE_STATUS_BADGES[leave.status] || LEAVE_STATUS_BADGES.pending;
                            return (
                                <div
                                    key={leave.id}
                                    className="group rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs transition-all hover:border-woof-gold/60"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <span className={`inline-block size-2 rounded-full ${LEAVE_TYPE_DOTS[leave.type] || 'bg-gray-400'}`} />
                                                <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/50 font-mono">
                                                    #{leave.id}
                                                </span>
                                                <span className="text-woof-charcoal/20">•</span>
                                                <span className="text-[11px] font-bold text-woof-charcoal uppercase tracking-wider">
                                                    {LEAVE_TYPE_LABELS[leave.type] || leave.type}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-woof-charcoal tracking-tight">
                                                {getDuration(leave.start_date, leave.end_date)}
                                            </h3>
                                            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-woof-charcoal/60">
                                                <span className="font-medium">
                                                    {new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    {' — '}
                                                    {new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                {isHrUser && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="font-bold text-woof-charcoal">{leave.admin?.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            {leave.reason && (
                                                <p className="mt-2 text-xs text-woof-charcoal/70 line-clamp-2 bg-[#fcfbf9] border border-[#e8ded1] p-3 rounded-2xl">
                                                    {leave.reason}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                                leave.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : leave.status === 'rejected'
                                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                            }`}>
                                                <StatusIcon className="size-3" />
                                                {badge.label}
                                            </span>
                                            <Link
                                                href={route('hr.leaves.show', leave.id)}
                                                className="inline-flex items-center bg-[#fcfbf9] hover:bg-woof-charcoal hover:text-white text-woof-charcoal border border-[#e8ded1] px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                {isHrUser && leave.status === 'pending' ? 'Review' : 'Details'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </HrLayout>
    );
}
