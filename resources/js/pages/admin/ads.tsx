import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Check, X, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAds({ ads }: any) {
    const handleCancel = (id: number) => {
        if (confirm('Are you sure you want to cancel this ad placement? This action cannot be undone.')) {
            router.delete(`/admin/ads/${id}`, {
                onSuccess: () => toast.success('Ad placement canceled.')
            });
        }
    };

    const handleApprove = (id: number) => {
        if (confirm('Approve this discount request? The ad will become active.')) {
            router.post(`/admin/ads/${id}/approve`, {}, {
                onSuccess: () => toast.success('Ad approved.')
            });
        }
    };

    const handleReject = (id: number) => {
        if (confirm('Reject this discount request? The ad will be canceled.')) {
            router.post(`/admin/ads/${id}/reject`, {}, {
                onSuccess: () => toast.success('Ad discount rejected.')
            });
        }
    };

    return (
        <AdminLayout title="Ad Placements">
            <Head title="Ad Placements" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Ad Placements</h2>
                        <p className="text-xs text-woof-charcoal/60">View and manage all booked ad placements across the platform.</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#e8ded1] bg-white overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-[11px] text-woof-charcoal/60 uppercase tracking-wider bg-[#fcfbf9] border-b border-[#e8ded1] font-bold">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Tier & Duration</th>
                                    <th className="px-6 py-4 font-bold">Agent</th>
                                    <th className="px-6 py-4 font-bold">Amount</th>
                                    <th className="px-6 py-4 font-bold">Schedule</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {ads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-woof-charcoal/50">
                                            No ad placements found.
                                        </td>
                                    </tr>
                                ) : ads.map((ad: any) => {
                                    const now = new Date();
                                    const start = new Date(ad.starts_at);
                                    const end = new Date(ad.ends_at);
                                    
                                    let status = 'upcoming';
                                    if (now >= start && now <= end) status = 'active';
                                    if (now > end) status = 'completed';

                                    return (
                                        <tr key={ad.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-woof-charcoal font-bold capitalize flex items-center gap-2">
                                                    {ad.tier}
                                                </div>
                                                <div className="text-woof-charcoal/60 text-[11px] mt-0.5">
                                                    {ad.duration.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-woof-charcoal font-medium">{ad.agent?.name || 'Unknown'}</div>
                                                <div className="text-woof-charcoal/60 text-[11px]">{ad.agent?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-woof-charcoal font-bold">₹{parseFloat(ad.amount_collected).toLocaleString('en-IN')}</div>
                                                {ad.discount_requested > 0 && (
                                                    <div className="text-[11px] font-medium text-woof-gold mt-0.5" title={ad.discount_reason}>
                                                        Discount: {ad.discount_type === 'percentage' 
                                                            ? `${ad.discount_requested}%` 
                                                            : `₹${parseFloat(ad.discount_requested).toLocaleString('en-IN')}`}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-woof-charcoal text-xs">{start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                <div className="text-woof-charcoal/60 text-[11px] mt-0.5">to {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ad.status === 'pending_approval' ? (
                                                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 rounded-full text-[10px] font-bold uppercase">Pending Approval</Badge>
                                                ) : ad.status === 'cancelled' ? (
                                                    <Badge variant="outline" className="text-rose-700 bg-rose-50 border-rose-200 rounded-full text-[10px] font-bold uppercase">Cancelled</Badge>
                                                ) : (
                                                    <>
                                                        {status === 'active' && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full text-[10px] font-bold uppercase">Active</Badge>}
                                                        {status === 'upcoming' && <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px] font-bold uppercase">Upcoming</Badge>}
                                                        {status === 'completed' && <Badge variant="outline" className="text-woof-charcoal/60 bg-[#fcfbf9] border-[#e8ded1] rounded-full text-[10px] font-bold uppercase">Completed</Badge>}
                                                    </>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    {ad.approval_status === 'pending' && (
                                                        <>
                                                            <button 
                                                                className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                                onClick={() => handleApprove(ad.id)}
                                                                title="Approve Discount"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                className="h-8 w-8 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                                onClick={() => handleReject(ad.id)}
                                                                title="Reject Discount"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    <button 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        onClick={() => handleCancel(ad.id)}
                                                        title="Delete Ad"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
