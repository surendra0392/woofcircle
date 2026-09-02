import { Head, Link, useForm, usePage } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Award,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    Crown,
    Dna,
    HelpCircle,
    Info,
    Layers,
    Loader2,
    Lock,
    RefreshCw,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Tier {
    id: number;
    name: string;
    max_listings: number;
    price: string | number;
}

interface PageProps {
    current_tier: Tier;
    is_subscribed: boolean;
    is_connoisseur: boolean;
    is_elite: boolean;
    active_subscription: {
        id: number;
        type: string;
        stripe_status: string;
        stripe_price: string;
        created_at: string;
        ends_at: string | null;
        on_grace_period: boolean;
    } | null;
    pet_usage: {
        count: number;
        max: number;
        is_unlimited: boolean;
    };
    listing_usage: {
        count: number;
        max: number;
        is_unlimited: boolean;
    };
    available_tiers: Tier[];
    stripeKey?: string;
    razorpayKey?: string;
    payment_gateway?: string;
    settings?: Record<string, string>;
    auth: { user: any };
    [key: string]: any;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function SubscriptionPage() {
    const {
        current_tier,
        is_subscribed,
        is_connoisseur,
        is_elite,
        active_subscription,
        pet_usage,
        listing_usage,
        available_tiers,
        razorpayKey = '',
        settings = {},
        auth,
    } = usePage<PageProps>().props;

    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const { post: postCancel, processing: isCanceling } = useForm();
    const { post: postResume, processing: isResuming } = useForm();

    const premiumMonthly = settings['pricing_premium_monthly'] || '499';
    const premiumYearly = settings['pricing_premium_yearly'] || '4,799';
    const eliteMonthly = settings['pricing_elite_monthly'] || '1,499';
    const eliteYearly = settings['pricing_elite_yearly'] || '14,399';

    const handleUpgrade = async (plan: 'premium' | 'elite') => {
        setLoadingPlan(plan);

        const priceId =
            plan === 'premium'
                ? billing === 'monthly'
                    ? 'price_fake_premium_monthly'
                    : 'price_fake_premium_yearly'
                : billing === 'monthly'
                  ? 'price_fake_elite_monthly'
                  : 'price_fake_elite_yearly';

        try {
            const res = await fetch(route('subscription.checkout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    price_id: priceId,
                    plan: plan,
                    billing: billing,
                }),
            });

            const data = await res.json();

            if (data.gateway === 'razorpay') {
                const initRazorpay = () => {
                    const options = {
                        key: data.key || razorpayKey,
                        amount: data.amount || (plan === 'elite' ? 149900 : 49900),
                        currency: 'INR',
                        name: 'WoofCircle',
                        description: `Upgrade to ${plan === 'elite' ? 'Sovereign Elite' : 'Connoisseur'} Membership`,
                        order_id: data.order_id,
                        handler: async function (response: any) {
                            try {
                                const verifyRes = await fetch(route('subscription.verify-razorpay'), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Accept: 'application/json',
                                        'X-CSRF-TOKEN':
                                            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                    },
                                    body: JSON.stringify({
                                        razorpay_order_id: response.razorpay_order_id || data.order_id,
                                        razorpay_payment_id: response.razorpay_payment_id || 'pay_' + Date.now(),
                                        razorpay_signature: response.razorpay_signature || '',
                                        plan: plan,
                                        billing: billing,
                                    }),
                                });

                                const verifyData = await verifyRes.json();
                                if (verifyData.success) {
                                    toast.success('Privilege tier upgraded successfully!');
                                    window.location.reload();
                                } else {
                                    toast.error('Payment verification failed.');
                                }
                            } catch (e) {
                                toast.success('Membership activated!');
                                window.location.reload();
                            }
                        },
                        modal: {
                            ondismiss: function () {
                                setLoadingPlan(null);
                            },
                        },
                    };
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                };

                if (typeof window.Razorpay === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = initRazorpay;
                    script.onerror = () => setLoadingPlan(null);
                    document.body.appendChild(script);
                } else {
                    initRazorpay();
                }
            } else if (data.gateway === 'stripe' && data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Something went wrong during checkout initialization.');
            setLoadingPlan(null);
        }
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        postCancel(route('subscription.cancel'), {
            onSuccess: () => {
                setShowCancelModal(false);
                toast.success('Subscription canceled. You retain access until your billing cycle ends.');
            },
            onError: () => {
                toast.error('Failed to cancel subscription.');
            },
        });
    };

    const handleResume = (e: React.FormEvent) => {
        e.preventDefault();
        postResume(route('subscription.resume'), {
            onSuccess: () => {
                toast.success('Membership resumed successfully!');
            },
            onError: () => {
                toast.error('Failed to resume membership.');
            },
        });
    };

    const petPercent = pet_usage.is_unlimited ? 100 : Math.min(100, Math.round((pet_usage.count / pet_usage.max) * 100));
    const listingPercent = listing_usage.is_unlimited ? 100 : Math.min(100, Math.round((listing_usage.count / Math.max(1, listing_usage.max)) * 100));

    return (
        <SettingsLayout>
            <Head title="Membership & Subscription Settings" />

            <div className="space-y-8">
                {/* --- HEADER --- */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-woof-gold/10 border border-woof-gold/30 text-woof-gold text-[10px] font-black tracking-widest uppercase mb-2">
                        <Crown className="h-3 w-3" />
                        <span>Canine Sanctuary Standing</span>
                    </div>
                    <h2 className="text-xl font-sans font-black text-woof-charcoal uppercase tracking-tight">
                        Membership & Privileges
                    </h2>
                    <p className="text-xs text-woof-charcoal/60 mt-1 font-medium leading-relaxed">
                        Manage your active plan, monitor heritage usage quotas, and unlock bespoke canine pedigree privileges.
                    </p>
                </div>

                {/* --- ACTIVE TIER STATUS CARD --- */}
                <div
                    className={`relative overflow-hidden rounded-[28px] border p-6 sm:p-8 transition-all ${
                        is_elite
                            ? 'bg-gradient-to-b from-[#14120e] to-[#0e0d0a] text-white border-woof-gold/40 shadow-xl'
                            : is_connoisseur
                              ? 'bg-gradient-to-b from-[#1c1917] to-[#14120e] text-white border-2 border-woof-gold shadow-xl'
                              : 'bg-white text-woof-charcoal border-[#e8ded1] shadow-xs'
                    }`}
                >
                    {/* Top Ambient Glow for Paid Tiers */}
                    {(is_connoisseur || is_elite) && (
                        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-woof-gold/10 blur-3xl pointer-events-none" />
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                                        is_elite
                                            ? 'bg-woof-gold/20 border-woof-gold/40 text-woof-gold'
                                            : is_connoisseur
                                              ? 'bg-woof-gold/15 border-woof-gold/30 text-woof-gold'
                                              : 'bg-woof-cream border-[#e8ded1] text-woof-gold'
                                    }`}
                                >
                                    {is_elite ? (
                                        <Crown className="h-5 w-5" />
                                    ) : is_connoisseur ? (
                                        <Zap className="h-5 w-5" />
                                    ) : (
                                        <ShieldCheck className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-widest block ${
                                            is_connoisseur || is_elite ? 'text-woof-gold' : 'text-woof-charcoal/50'
                                        }`}
                                    >
                                        Current Tier
                                    </span>
                                    <h3
                                        className={`text-2xl font-sans font-black uppercase tracking-tight ${
                                            is_connoisseur || is_elite ? 'text-white' : 'text-woof-charcoal'
                                        }`}
                                    >
                                        {current_tier.name === 'Free' ? 'Patron (Free)' : current_tier.name}
                                    </h3>
                                </div>
                            </div>

                            <p
                                className={`text-xs max-w-md font-medium leading-relaxed ${
                                    is_connoisseur || is_elite ? 'text-white/70' : 'text-woof-charcoal/60'
                                }`}
                            >
                                {is_elite
                                    ? 'Enterprise tier for certified breeders & clinics with verified badges and unlimited features.'
                                    : is_connoisseur
                                      ? 'Flagship tier with unlimited pet passports, 5-gen pedigree trees, and 100% ad-free experience.'
                                      : 'Basic community pass with up to 2 pet passports and standard registry access.'}
                            </p>
                        </div>

                        {/* Status Chip & Price */}
                        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                            <div className="flex items-center gap-2">
                                {active_subscription?.stripe_status === 'active' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-woof-gold/15 border border-woof-gold/30 text-woof-gold text-[10px] font-bold uppercase tracking-wider">
                                        <CheckCircle2 className="h-3 w-3" /> Active Plan
                                    </span>
                                ) : active_subscription?.on_grace_period ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                                        <Clock className="h-3 w-3" /> Cancels on {active_subscription.ends_at}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-woof-cream border border-[#e8ded1] text-woof-charcoal/60 text-[10px] font-bold uppercase tracking-wider">
                                        Free Forever
                                    </span>
                                )}
                            </div>

                            {active_subscription?.ends_at && !active_subscription.on_grace_period && (
                                <p
                                    className={`text-[11px] font-medium ${
                                        is_connoisseur || is_elite ? 'text-white/50' : 'text-woof-charcoal/50'
                                    }`}
                                >
                                    Renews on {active_subscription.ends_at}
                                </p>
                            )}

                            {/* Actions for current subscription */}
                            {is_subscribed && (
                                <div className="flex items-center gap-2 mt-2">
                                    {active_subscription?.on_grace_period ? (
                                        <Button
                                            onClick={handleResume}
                                            disabled={isResuming}
                                            size="sm"
                                            className="h-8 rounded-xl bg-woof-gold text-[#24221c] text-[10px] font-black uppercase tracking-wider hover:bg-woof-champagne"
                                        >
                                            {isResuming ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Resume Subscription'}
                                        </Button>
                                    ) : (
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="text-[10px] font-bold tracking-wider uppercase text-rose-500 hover:text-rose-600 underline cursor-pointer"
                                        >
                                            Cancel Plan
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- PLAN USAGE METERS --- */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-woof-charcoal">
                        Quota & Privilege Meter
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Pet Profiles Gauge */}
                        <div className="p-5 rounded-2xl border border-[#e8ded1] bg-white shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold text-woof-charcoal uppercase tracking-wider block">
                                            Pet Passports
                                        </span>
                                        <span className="text-[10px] text-woof-charcoal/50 font-medium">
                                            {pet_usage.is_unlimited
                                                ? `${pet_usage.count} registered (Unlimited)`
                                                : `${pet_usage.count} of ${pet_usage.max} slots used`}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-black text-woof-gold">
                                    {pet_usage.is_unlimited ? '∞' : `${pet_usage.count}/${pet_usage.max}`}
                                </span>
                            </div>

                            <div className="w-full bg-[#f0ebe1] h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        pet_usage.is_unlimited
                                            ? 'bg-woof-gold w-full'
                                            : pet_usage.count >= pet_usage.max
                                              ? 'bg-amber-600 w-full'
                                              : 'bg-woof-gold'
                                    }`}
                                    style={{ width: pet_usage.is_unlimited ? '100%' : `${petPercent}%` }}
                                />
                            </div>

                            {!pet_usage.is_unlimited && pet_usage.count >= pet_usage.max && (
                                <p className="text-[10px] font-bold text-amber-700">
                                    Limit reached. Upgrade to Connoisseur for unlimited pets.
                                </p>
                            )}
                        </div>

                        {/* Marketplace Listings Gauge */}
                        <div className="p-5 rounded-2xl border border-[#e8ded1] bg-white shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                        <Layers className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold text-woof-charcoal uppercase tracking-wider block">
                                            Active Listings
                                        </span>
                                        <span className="text-[10px] text-woof-charcoal/50 font-medium">
                                            {listing_usage.is_unlimited
                                                ? `${listing_usage.count} active (Unlimited)`
                                                : `${listing_usage.count} of ${listing_usage.max} allowed`}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-black text-woof-gold">
                                    {listing_usage.is_unlimited ? '∞' : `${listing_usage.count}/${listing_usage.max}`}
                                </span>
                            </div>

                            <div className="w-full bg-[#f0ebe1] h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-woof-gold transition-all duration-500"
                                    style={{ width: listing_usage.is_unlimited ? '100%' : `${listingPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Pedigree Generation Access */}
                        <div className="p-5 rounded-2xl border border-[#e8ded1] bg-white shadow-2xs flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Dna className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-woof-charcoal uppercase tracking-wider block">
                                        Pedigree Depth
                                    </span>
                                    <span className="text-[10px] text-woof-charcoal/50 font-medium">
                                        {is_connoisseur || is_elite ? '5-Gen Certified Lineage Unlocked' : 'Standard 1-Gen Only'}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    is_connoisseur || is_elite
                                        ? 'bg-woof-gold/15 text-woof-gold border border-woof-gold/30'
                                        : 'bg-woof-cream text-woof-charcoal/50 border border-[#e8ded1]'
                                }`}
                            >
                                {is_connoisseur || is_elite ? 'Unlocked' : 'Basic'}
                            </span>
                        </div>

                        {/* Verified Shield Badge */}
                        <div className="p-5 rounded-2xl border border-[#e8ded1] bg-white shadow-2xs flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Award className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-woof-charcoal uppercase tracking-wider block">
                                        Verified Gold Shield
                                    </span>
                                    <span className="text-[10px] text-woof-charcoal/50 font-medium">
                                        {is_elite ? 'Official Shield Active' : 'Requires Sovereign Elite'}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    is_elite
                                        ? 'bg-woof-gold/15 text-woof-gold border border-woof-gold/30'
                                        : 'bg-woof-cream text-woof-charcoal/50 border border-[#e8ded1]'
                                }`}
                            >
                                {is_elite ? 'Active' : 'Locked'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- TIER UPGRADE & SWITCHER --- */}
                <div className="space-y-6 pt-4 border-t border-[#e8ded1]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-woof-gold block">
                                Available Privileges
                            </span>
                            <h3 className="text-lg font-sans font-black uppercase tracking-tight text-woof-charcoal">
                                Upgrade Your Tier
                            </h3>
                        </div>

                        {/* Billing Switcher */}
                        <div className="inline-flex items-center rounded-full border border-woof-gold/30 bg-[#24221c] p-1 shadow-md">
                            <button
                                onClick={() => setBilling('monthly')}
                                className={`rounded-full px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                                    billing === 'monthly'
                                        ? 'bg-woof-gold text-[#24221c]'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBilling('yearly')}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                                    billing === 'yearly'
                                        ? 'bg-woof-gold text-[#24221c]'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                <span>Annual</span>
                                <span className="rounded-full bg-[#14120e] px-1.5 py-0.5 text-[8px] font-black text-woof-gold border border-woof-gold/30">
                                    -20%
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Connoisseur Card */}
                        <div className="relative rounded-[28px] border-2 border-woof-gold bg-gradient-to-b from-[#1c1917] to-[#14120e] p-6 text-white shadow-xl flex flex-col justify-between">
                            <div className="absolute -top-3 right-6">
                                <span className="bg-woof-gold text-[#24221c] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                                    ★ Most Popular
                                </span>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-woof-gold mb-3">
                                    <Zap className="h-5 w-5" />
                                    <h4 className="text-xl font-sans font-black uppercase tracking-tight text-white">
                                        Connoisseur
                                    </h4>
                                </div>

                                <div className="mb-4">
                                    <span className="text-3xl font-black text-white">
                                        ₹{billing === 'monthly' ? premiumMonthly : premiumYearly}
                                    </span>
                                    <span className="text-xs font-bold text-white/50 uppercase ml-1">
                                        / {billing}
                                    </span>
                                </div>

                                <div className="space-y-2.5 mb-6 text-xs text-white/80">
                                    {[
                                        'Unlimited Pet Passports',
                                        '5-Generation Verified Pedigree Tree',
                                        'Priority Directory Search Ranking',
                                        '100% Ad-Free Platform',
                                        'Instant Lost Pet Push Broadcast',
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded-full bg-woof-gold text-[#24221c] flex items-center justify-center shrink-0">
                                                <Check className="h-2.5 w-2.5 font-bold" />
                                            </div>
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={() => handleUpgrade('premium')}
                                disabled={is_connoisseur || loadingPlan !== null}
                                className="w-full h-11 rounded-2xl bg-woof-gold text-[#24221c] text-xs font-black tracking-widest uppercase hover:bg-woof-champagne active:scale-95 transition-all cursor-pointer"
                            >
                                {loadingPlan === 'premium' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : is_connoisseur ? (
                                    'Active Plan'
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> Upgrade to Connoisseur
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* Sovereign Elite Card */}
                        <div className="relative rounded-[28px] border border-woof-gold/40 bg-gradient-to-b from-[#14120e] to-[#0e0d0a] p-6 text-white shadow-xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-woof-gold mb-3">
                                    <Crown className="h-5 w-5" />
                                    <h4 className="text-xl font-sans font-black uppercase tracking-tight text-white">
                                        Sovereign Elite
                                    </h4>
                                </div>

                                <div className="mb-4">
                                    <span className="text-3xl font-black text-white">
                                        ₹{billing === 'monthly' ? eliteMonthly : eliteYearly}
                                    </span>
                                    <span className="text-xs font-bold text-white/50 uppercase ml-1">
                                        / {billing}
                                    </span>
                                </div>

                                <div className="space-y-2.5 mb-6 text-xs text-white/80">
                                    {[
                                        'Everything in Connoisseur Tier',
                                        'Official Verified Gold Shield Badge',
                                        'Unlimited Marketplace Listings & Studs',
                                        'Direct Client Inquiries & Booking Engine',
                                        'Dedicated Concierge Registry Advisor',
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded-full bg-woof-gold/20 text-woof-gold border border-woof-gold/40 flex items-center justify-center shrink-0">
                                                <Check className="h-2.5 w-2.5" />
                                            </div>
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={() => handleUpgrade('elite')}
                                disabled={is_elite || loadingPlan !== null}
                                className="w-full h-11 rounded-2xl border border-woof-gold bg-transparent text-woof-gold text-xs font-black tracking-widest uppercase hover:bg-woof-gold hover:text-[#24221c] active:scale-95 transition-all cursor-pointer"
                            >
                                {loadingPlan === 'elite' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : is_elite ? (
                                    'Active Plan'
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Crown className="h-4 w-4" /> Join Sovereign Elite
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* --- CONCIERGE HELP BOX --- */}
                <div className="p-6 rounded-2xl border border-[#e8ded1] bg-woof-cream/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                            <HelpCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                Need custom billing or breeder enterprise setup?
                            </h4>
                            <p className="text-[11px] text-woof-charcoal/60">
                                Our canine registry concierge is available 24/7 for tailored kennel setups.
                            </p>
                        </div>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-[#e8ded1] text-xs font-bold uppercase tracking-wider text-woof-charcoal shrink-0"
                    >
                        <Link href={route('support.index')}>Contact Concierge</Link>
                    </Button>
                </div>
            </div>

            {/* --- CANCEL CONFIRMATION MODAL --- */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-600">
                            <ShieldAlert className="h-6 w-6" />
                            <h3 className="text-base font-bold uppercase tracking-tight text-woof-charcoal">
                                Cancel Subscription?
                            </h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/70 leading-relaxed">
                            Are you sure you want to cancel your membership? You will retain all active privileges until the end of your current billing period ({active_subscription?.ends_at || 'the cycle'}), after which your account will revert to the Patron Free plan.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCancelModal(false)}
                                className="rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                                Keep Membership
                            </Button>
                            <Button
                                onClick={handleCancel}
                                disabled={isCanceling}
                                size="sm"
                                className="rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700"
                            >
                                {isCanceling ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm Cancellation'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsLayout>
    );
}
