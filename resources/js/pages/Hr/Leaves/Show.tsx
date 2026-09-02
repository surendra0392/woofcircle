import { Head, Link, router } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { useState } from 'react';
import { ArrowLeft, CalendarDays, Clock, CheckCircle2, XCircle, Ban, ShieldCheck, User } from 'lucide-react';
import { formatDateShort } from '@/lib/time';
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_BADGES } from '@/lib/constants';
const TYPE_LABELS = LEAVE_TYPE_LABELS;

interface LeaveRequest {
    id: number;
    type: string;
    status: string;
    start_date: string;
    end_date: string;
    reason: string | null;
    rejection_reason: string | null;
    created_at: string;
    admin: { id: number; name: string; email: string };
}

interface Props {
    leave: LeaveRequest;
    isHr: boolean;
    usedLeave: number;
    maxLeave: number;
}

const STATUS_CONFIG = LEAVE_STATUS_BADGES;

export default function LeaveShow({ leave, isHr, usedLeave, maxLeave }: Props) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [rejectionModal, setRejectionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const remaining = maxLeave - usedLeave;

    const handleApprove = () => {
        setProcessing('approve');
        router.post(route('hr.leaves.approve', leave.id), {}, {
            onFinish: () => setProcessing(null),
        });
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) return;
        setProcessing('reject');
        router.post(route('hr.leaves.reject', leave.id), {
            rejection_reason: rejectionReason,
        }, {
            onFinish: () => {
                setProcessing(null);
                setRejectionModal(false);
            },
        });
    };

    const handleCancel = () => {
        if (!confirm('Cancel this leave request?')) return;
        setProcessing('cancel');
        router.post(route('hr.leaves.cancel', leave.id), {}, {
            onFinish: () => setProcessing(null),
        });
    };

    const StatusIcon = STATUS_CONFIG[leave.status]?.icon || Clock;
    const badge = STATUS_CONFIG[leave.status] || STATUS_CONFIG.pending;
    const getDuration = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return `${diff} day${diff !== 1 ? 's' : ''}`;
    };

    return (
        <HrLayout title={`Leave Request #${leave.id}`}>
            <Head title={`Leave #${leave.id} — ${TYPE_LABELS[leave.type]}`} />

            <div className="space-y-6 max-w-5xl">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('hr.leaves.index')}
                        className="inline-flex items-center gap-1.5 size-9 rounded-full bg-white border border-[#e8ded1] justify-center text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Leave Application Review</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Audit timeline, balance impact, and adjudicate approval status.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 shrink-0 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                        <CalendarDays className="size-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal/50 font-mono">
                                                Leave #{leave.id}
                                            </span>
                                            <span className="text-woof-charcoal/20">•</span>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                                leave.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : leave.status === 'rejected'
                                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                            }`}>
                                                <StatusIcon className="size-3" />
                                                {badge.label}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-woof-charcoal">
                                            {TYPE_LABELS[leave.type] || leave.type}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-woof-charcoal/50 mb-1">Effective Start</p>
                                    <p className="text-base font-bold text-woof-charcoal">{formatDateShort(leave.start_date)}</p>
                                </div>
                                <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-woof-charcoal/50 mb-1">Effective Conclusion</p>
                                    <p className="text-base font-bold text-woof-charcoal">{formatDateShort(leave.end_date)}</p>
                                </div>
                            </div>

                            <div className="mb-6 bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-woof-charcoal/50">Requested Duration</p>
                                    <p className="text-lg font-bold text-woof-charcoal mt-0.5">{getDuration(leave.start_date, leave.end_date)}</p>
                                </div>
                                <div className="text-[11px] font-medium text-woof-charcoal/60">
                                    Filed: {new Date(leave.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {leave.reason && (
                                <div className="border-t border-[#e8ded1] pt-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-woof-charcoal/50 mb-2">Statement of Reason</p>
                                    <p className="text-xs text-woof-charcoal/80 leading-relaxed bg-[#fcfbf9] border border-[#e8ded1] p-4 rounded-2xl whitespace-pre-wrap">{leave.reason}</p>
                                </div>
                            )}

                            {leave.rejection_reason && (
                                <div className="border-t border-[#e8ded1] pt-6">
                                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-800 mb-1">Administrative Rejection Rationale</p>
                                        <p className="text-xs text-rose-900">{leave.rejection_reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Employee Info */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4 border-b border-[#e8ded1] pb-3">Applicant Dossier</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-woof-pearl/30 border border-[#e8ded1] text-woof-charcoal font-bold text-sm">
                                    {leave.admin?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-woof-charcoal">{leave.admin?.name}</p>
                                    <p className="text-[11px] text-woof-charcoal/60">{leave.admin?.email}</p>
                                </div>
                            </div>

                            <div className="border-t border-[#e8ded1] pt-4 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-woof-charcoal/50 mb-1">Leave Balance Status</p>
                                <p className="text-4xl font-black text-woof-charcoal tracking-tight">{remaining}</p>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">days remaining</p>
                                <div className="w-full bg-[#fcfbf9] border border-[#e8ded1] rounded-full h-2.5 mt-3 overflow-hidden p-0.5">
                                    <div
                                        className="bg-woof-gold h-full rounded-full"
                                        style={{ width: `${Math.min(100, (usedLeave / maxLeave) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider mt-1.5">
                                    <span>{usedLeave} used</span>
                                    <span>{maxLeave} total</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions (HR only when pending) */}
                        {isHr && leave.status === 'pending' && (
                            <div className="space-y-3">
                                <button
                                    onClick={handleApprove}
                                    disabled={processing !== null}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    <CheckCircle2 className="size-4" />
                                    {processing === 'approve' ? 'Approving...' : 'Approve Request'}
                                </button>
                                <button
                                    onClick={() => setRejectionModal(true)}
                                    disabled={processing !== null}
                                    className="w-full inline-flex items-center justify-center gap-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 py-3 rounded-full font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    <XCircle className="size-4" />
                                    Reject Application
                                </button>
                            </div>
                        )}

                        {/* Cancel (employee only, pending only) */}
                        {!isHr && leave.status === 'pending' && (
                            <button
                                onClick={handleCancel}
                                disabled={processing !== null}
                                className="w-full inline-flex items-center justify-center gap-2 border border-[#e8ded1] bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-woof-charcoal py-3 rounded-full font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                <Ban className="size-4" />
                                {processing === 'cancel' ? 'Cancelling...' : 'Cancel Request'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Rejection Modal */}
                {rejectionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setRejectionModal(false)}>
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                                    <XCircle className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Reject Leave Application</h3>
                                    <p className="text-xs text-woof-charcoal/60">State the formal justification for denial.</p>
                                </div>
                            </div>
                            <textarea
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                rows={4}
                                className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-3.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold resize-none mb-6"
                                placeholder="e.g. Schedule conflicts with mandatory team audits, insufficient accrued balances..."
                            />
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => { setRejectionModal(false); setRejectionReason(''); }}
                                    className="px-4 py-2 border border-[#e8ded1] text-woof-charcoal rounded-full text-xs font-bold hover:bg-[#fcfbf9] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectionReason.trim() || processing === 'reject'}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-full font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {processing === 'reject' ? 'Rejecting...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </HrLayout>
    );
}
