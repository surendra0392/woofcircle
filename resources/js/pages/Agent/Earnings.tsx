import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { IndianRupee, Clock, CreditCard, ArrowDownToLine, X } from 'lucide-react';

interface Payout {
    id: number;
    amount: number;
    status: 'paid' | 'pending';
    created_at: string;
}

interface EarningsProps {
    payouts: Payout[];
    totalEarned: number;
    totalPending: number;
}

export default function Earnings({ payouts, totalEarned, totalPending }: EarningsProps) {
    const [isRequesting, setIsRequesting] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agent.earnings.request'), {
            onSuccess: () => {
                setIsRequesting(false);
                reset();
            }
        });
    };

    return (
        <AgentLayout>
            <Head title="Agent Earnings" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Agent Earnings & Disbursements</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Track your onboarding commissions, ad booking royalties, and payout schedules.</p>
                    </div>
                    <button 
                        onClick={() => setIsRequesting(true)}
                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                        <ArrowDownToLine className="size-3.5" /> Request Withdrawal
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-woof-charcoal/50 uppercase tracking-wider">Total Disbursed</p>
                            <p className="text-3xl font-black text-woof-charcoal tracking-tight mt-0.5">{formatCurrency(totalEarned)}</p>
                            <span className="text-[10px] font-bold text-emerald-600">Paid to Account</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-woof-gold/10 border border-woof-gold/30 text-woof-gold flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-woof-charcoal/50 uppercase tracking-wider">Pending Payout</p>
                            <p className="text-3xl font-black text-woof-charcoal tracking-tight mt-0.5">{formatCurrency(totalPending)}</p>
                            <span className="text-[10px] font-bold text-woof-gold">Awaiting Clearance</span>
                        </div>
                    </div>
                </div>

                {/* Payouts Table */}
                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e8ded1] flex items-center justify-between bg-[#fcfbf9]">
                        <h2 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-woof-gold" />
                            Disbursement Ledger
                        </h2>
                    </div>
                    
                    {payouts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#fcfbf9] text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider border-b border-[#e8ded1]">
                                        <th className="px-6 py-3.5">Disbursement Date</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8ded1] text-xs">
                                    {payouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 text-woof-charcoal font-medium whitespace-nowrap">
                                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(payout.created_at))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    payout.status === 'paid' 
                                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                }`}>
                                                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-black text-sm text-woof-charcoal">
                                                {formatCurrency(payout.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <p className="text-xs text-woof-charcoal/50 font-normal">No payout history recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Withdrawal Modal */}
            {isRequesting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-woof-charcoal/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-[#e8ded1] max-w-md w-full p-6 sm:p-8">
                        <div className="flex items-center justify-between pb-4 border-b border-[#e8ded1]">
                            <div>
                                <h3 className="text-lg font-bold text-woof-charcoal tracking-tight">Request Payout Withdrawal</h3>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">Minimum withdrawal requirement is ₹500.</p>
                            </div>
                            <button onClick={() => setIsRequesting(false)} className="text-woof-charcoal/40 hover:text-woof-charcoal rounded-full p-1 transition-colors cursor-pointer">
                                <X className="size-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleRequest} className="mt-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">Amount (₹)</label>
                                <input
                                    type="number"
                                    min="500"
                                    step="1"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="e.g. 5000"
                                    required
                                    className="w-full h-11 px-4 text-xs font-mono border border-[#e8ded1] rounded-2xl bg-[#fcfbf9] text-woof-charcoal placeholder:text-woof-charcoal/40 focus:outline-none focus:ring-2 focus:ring-woof-gold/20 focus:border-woof-gold"
                                />
                                {errors.amount && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.amount}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRequesting(false)}
                                    className="px-4 py-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-charcoal rounded-full transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white text-xs font-bold rounded-full transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? 'Submitting...' : 'Confirm Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AgentLayout>
    );
}
