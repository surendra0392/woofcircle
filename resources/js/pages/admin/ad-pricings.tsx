import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Coins } from 'lucide-react';

export default function AdPricings({ pricings }: any) {
    return (
        <AdminLayout title="Ad Pricing Management">
            <Head title="Ad Pricing Management" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                        <Coins className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Ad Pricing</h2>
                        <p className="text-xs text-woof-charcoal/60">Manage the fixed prices for each Ad Tier and Duration combination. Agents will be forced to use these prices when booking ads.</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#e8ded1] bg-white overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-[11px] text-woof-charcoal/60 uppercase tracking-wider bg-[#fcfbf9] border-b border-[#e8ded1] font-bold">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Tier</th>
                                    <th className="px-6 py-4 font-bold">Duration</th>
                                    <th className="px-6 py-4 font-bold">Price (₹)</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {pricings.map((pricing: any) => (
                                    <PricingRow key={pricing.id} pricing={pricing} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function PricingRow({ pricing }: { pricing: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, patch, processing } = useForm({
        price: pricing.price
    });

    const handleSave = () => {
        patch(`/admin/ad-pricings/${pricing.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Price updated successfully');
            }
        });
    };

    return (
        <tr className="hover:bg-[#fcfbf9] transition-colors">
            <td className="px-6 py-4 text-woof-charcoal font-bold capitalize">{pricing.tier}</td>
            <td className="px-6 py-4 text-woof-charcoal/70">{pricing.duration.toUpperCase()}</td>
            <td className="px-6 py-4 text-woof-charcoal font-bold">
                {isEditing ? (
                    <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className="w-32 h-9 bg-[#fcfbf9] border-[#e8ded1] rounded-2xl text-xs text-woof-charcoal focus-visible:ring-woof-gold/20"
                    />
                ) : (
                    `₹${parseFloat(pricing.price).toLocaleString('en-IN')}`
                )}
            </td>
            <td className="px-6 py-4 text-right">
                {isEditing ? (
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 rounded-full border-[#e8ded1] text-woof-charcoal text-xs hover:bg-[#fcfbf9]"
                            onClick={() => {
                                setIsEditing(false);
                                setData('price', pricing.price);
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            size="sm"
                            className="h-8 rounded-full bg-woof-charcoal text-white hover:bg-woof-forest text-xs shadow-xs"
                            onClick={handleSave}
                            disabled={processing}
                        >
                            Save
                        </Button>
                    </div>
                ) : (
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 rounded-full border-[#e8ded1] text-woof-charcoal hover:bg-[#fcfbf9] text-xs font-bold"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Price
                    </Button>
                )}
            </td>
        </tr>
    );
}
