import { Head, Link, useForm } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { CalendarDays, ArrowLeft, Ban, ShieldAlert, Sparkles, Clock } from 'lucide-react';

interface Props {
    usedLeave: number;
    maxLeave: number;
}

export default function LeavesCreate({ usedLeave, maxLeave }: Props) {
    const remaining = maxLeave - usedLeave;

    const { data, setData, post, processing, errors } = useForm({
        type: 'vacation' as string,
        start_date: '',
        end_date: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.leaves.store'));
    };

    return (
        <HrLayout title="Submit Leave Application">
            <Head title="Request Leave" />

            <div className="space-y-6 max-w-5xl">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('hr.leaves.index')}
                        className="inline-flex items-center gap-1.5 size-9 rounded-full bg-white border border-[#e8ded1] justify-center text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Request Leave</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Submit a time off application for HR management review and authorization.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">
                                        Leave Category <span className="text-rose-600">*</span>
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs font-medium text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                    >
                                        <option value="vacation">Vacation / Paid Time Off</option>
                                        <option value="sick">Sick Leave / Medical</option>
                                        <option value="unpaid">Unpaid Leave</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">
                                            Commencement Date <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                            required
                                        />
                                        {errors.start_date && <p className="mt-1 text-xs text-rose-600">{errors.start_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">
                                            Conclusion Date <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                            required
                                        />
                                        {errors.end_date && <p className="mt-1 text-xs text-rose-600">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">
                                        Justification / Operational Notes (Optional)
                                    </label>
                                    <textarea
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold resize-none"
                                        placeholder="Briefly describe handoff notes, reason for absence, or coverage plan..."
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e8ded1]">
                                    <Link
                                        href={route('hr.leaves.index')}
                                        className="px-5 py-2.5 border border-[#e8ded1] text-woof-charcoal rounded-full text-xs font-bold hover:bg-[#fcfbf9] transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Leave Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar: Leave Balance */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-4 border-b border-[#e8ded1] pb-3">Available Balance</h3>
                            <div className="text-center py-2">
                                <div className="text-5xl font-black text-woof-charcoal tracking-tight mb-1">{remaining}</div>
                                <p className="text-xs text-woof-charcoal/60 mb-1">paid days remaining</p>
                                <div className="w-full bg-[#fcfbf9] border border-[#e8ded1] rounded-full h-3 mt-4 overflow-hidden p-0.5">
                                    <div
                                        className="bg-woof-gold h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (remaining / maxLeave) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider mt-2">
                                    <span>{usedLeave} used</span>
                                    <span>{maxLeave} total</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-3xl p-6 shadow-xs">
                            <div className="flex items-start gap-3">
                                <Ban className="size-4 text-woof-gold shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">Leave Policy Guidelines</h4>
                                    <ul className="text-[11px] text-woof-charcoal/70 space-y-1.5 list-disc list-inside">
                                        <li>Vacation requests require at least 24 hours advance notice.</li>
                                        <li>Sick leave can be reported on the effective date.</li>
                                        <li>HR executive review turns around within 24–48 hours.</li>
                                        <li>Unpaid leave is subject to departmental approval.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
