import { Head, router, Link } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { Check, CreditCard, ArrowRightLeft, ShieldCheck, Banknote } from 'lucide-react';
import { can } from '@/lib/permissions';
import { usePage } from '@inertiajs/react';

export default function PayoutIndex({ payouts, eligibleTargets }: any) {
    const { props } = usePage() as any;
    const role = props.auth?.admin?.role || props.auth?.admin?.data?.role;
    const canTransfer = can(role, 'payout', eligibleTargets);
    
    const handleMarkPaid = (id: number) => {
        router.put(route('hr.payouts.update', id), { status: 'paid' }, { preserveScroll: true });
    };

    return (
        <HrLayout title="Payroll & Disbursements Ledger">
            <Head title="Payouts Ledger" />
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Disbursements & Commissions Ledger</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Audit field agent commissions, referral payouts, and settle payroll transactions.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[750px]">
                            <thead>
                                <tr className="bg-[#fcfbf9] text-woof-charcoal/50 uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded1]">
                                    <th className="px-6 py-4">Employee / Agent</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Accrual Period</th>
                                    <th className="px-6 py-4 text-right">Settlement</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Handler</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8ded1] text-xs">
                                {payouts.data.map((payout: any) => (
                                    <tr key={payout.id} className="hover:bg-[#fcfbf9] transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={route('hr.employees.show', payout.admin_id)} className="font-bold text-woof-charcoal hover:text-woof-gold transition-colors">
                                                {payout.admin.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-woof-charcoal/70 capitalize">
                                            {payout.type}
                                        </td>
                                        <td className="px-6 py-4 text-woof-charcoal/60">
                                            {new Date(payout.period_start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} - {new Date(payout.period_end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-woof-charcoal font-mono">
                                            ₹{parseFloat(payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                payout.status === 'paid' 
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                            }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-woof-charcoal/70">
                                            {payout.assigned_to ? (
                                                <span className="font-medium">{payout.assigned_to.name}</span>
                                            ) : (
                                                <span className="text-woof-charcoal/40">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payout.status === 'pending' ? (
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <button 
                                                        onClick={() => handleMarkPaid(payout.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full transition-colors border border-emerald-200 font-bold cursor-pointer"
                                                    >
                                                        <Check className="size-3.5 stroke-[3]" /> Settle & Mark Paid
                                                    </button>
                                                    {!payout.assigned_to ? (
                                                        <button 
                                                            onClick={() => router.post(route('hr.payouts.claim', payout.id))}
                                                            className="inline-flex items-center gap-1 text-[11px] bg-[#fcfbf9] text-woof-charcoal hover:text-woof-gold px-3 py-1 rounded-full transition-colors border border-[#e8ded1] font-bold cursor-pointer"
                                                        >
                                                            <ShieldCheck className="size-3" /> Claim Disbursement
                                                        </button>
                                                    ) : (
                                                        <form 
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                const select = (e.target as HTMLFormElement).assigned_to;
                                                                if(select.value) {
                                                                    router.post(route('hr.payouts.transfer', payout.id), { assigned_to: select.value });
                                                                }
                                                            }}
                                                            className="flex gap-1.5 items-center"
                                                        >
                                                            <select name="assigned_to" className="text-xs rounded-xl border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-1 text-woof-charcoal" required defaultValue="">
                                                                <option value="" disabled>Transfer to...</option>
                                                                {eligibleTargets?.map((t: any) => (
                                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                                ))}
                                                            </select>
                                                            <button type="submit" className="text-[11px] font-bold bg-woof-charcoal text-white hover:bg-woof-gold hover:text-woof-charcoal px-3 py-1 rounded-full transition-colors cursor-pointer">Transfer</button>
                                                        </form>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-woof-charcoal/50">
                                                    Paid on {payout.paid_at ? new Date(payout.paid_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payouts.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50 font-medium">
                                            No payout records found matching active query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-[#e8ded1] flex justify-between items-center text-xs text-woof-charcoal/60 bg-[#fcfbf9]">
                        <div>Showing {payouts.from || 0} to {payouts.to || 0} of {payouts.total} disbursement entries</div>
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
