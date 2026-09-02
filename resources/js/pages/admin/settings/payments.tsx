import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Payments({ paymentGateway }: { paymentGateway: string }) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        payment_gateway: paymentGateway || 'stripe',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('settings.payments.update'));
    };

    return (
        <DashboardLayout breadcrumbs={[{ title: 'Payment Settings', href: '/admin/settings/payments' }]} title="Settings" subtitle="Manage your platform settings">
            <Head title="Payment Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-woof-charcoal">Payment Gateway Configuration</h3>
                        <p className="text-xs text-woof-charcoal/60">Toggle between Stripe and Razorpay.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 max-w-xl">
                        <div className="space-y-1.5">
                            <Label htmlFor="payment_gateway" className="text-xs font-bold text-woof-charcoal">Active Gateway</Label>
                            <select
                                id="payment_gateway"
                                value={data.payment_gateway}
                                onChange={(e) => setData('payment_gateway', e.target.value)}
                                className="mt-1 block w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] py-2.5 pl-3 pr-10 text-xs font-medium text-woof-charcoal focus:border-woof-gold focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                            >
                                <option value="stripe">Stripe</option>
                                <option value="razorpay">Razorpay</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                className="bg-woof-charcoal hover:bg-woof-forest text-white rounded-full text-xs font-bold h-10 px-6 transition-all shadow-xs"
                            >
                                Save Settings
                            </Button>

                            <div className={`transition-opacity duration-300 ease-in-out ${recentlySuccessful ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="text-xs font-medium text-emerald-700">Saved successfully</p>
                            </div>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
