import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Button } from '@/components/ui/button';
import {
    Check,
    ShieldCheck,
    Zap,
    Crown,
    CreditCard,
    Loader2,
    Sparkles,
    ChevronDown,
    Lock,
    RefreshCw,
    HelpCircle,
    ArrowRight,
    Award,
    QrCode,
} from 'lucide-react';
import React, { useState } from 'react';

interface PageProps {
    settings?: Record<string, string>;
    razorpayKey?: string;
    auth: { user: any | null };
    [key: string]: any;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function Pricing() {
    const { settings = {}, razorpayKey = '', auth } = usePage<PageProps>().props;
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const premiumMonthly = settings['pricing_premium_monthly'] || '499';
    const premiumYearly = settings['pricing_premium_yearly'] || '4,799';
    const eliteMonthly = settings['pricing_elite_monthly'] || '1,499';
    const eliteYearly = settings['pricing_elite_yearly'] || '14,399';

    const premiumPrice = billing === 'monthly' ? premiumMonthly : premiumYearly;
    const elitePrice = billing === 'monthly' ? eliteMonthly : eliteYearly;

    const handleSubscribe = async (plan: 'premium' | 'elite') => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        setLoadingPlan(plan);

        // Map plan and billing to Stripe Price ID
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
                        amount: data.amount || (plan === 'elite' ? (billing === 'monthly' ? 149900 : 1439900) : (billing === 'monthly' ? 49900 : 479900)),
                        currency: 'INR',
                        name: 'WoofCircle',
                        description: `WoofCircle ${plan === 'elite' ? 'Sovereign Elite' : 'Connoisseur'} Membership`,
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
                                    window.location.href = verifyData.redirect || route('subscription.index');
                                } else {
                                    window.location.href = route('subscription.index');
                                }
                            } catch (e) {
                                window.location.href = route('subscription.index');
                            }
                        },
                        modal: {
                            ondismiss: function () {
                                setLoadingPlan(null);
                            },
                        },
                    };
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
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
            console.error('Checkout error:', error);
            setLoadingPlan(null);
        }
    };

    const comparisonFeatures = [
        {
            category: 'Canine Identity & Heritage',
            items: [
                { name: 'Tamper-Proof Digital Passports', patron: '2 Pets', connoisseur: 'Unlimited', sovereign: 'Unlimited' },
                { name: 'Pedigree Tree Generation', patron: 'Basic (1-Gen)', connoisseur: 'Verified (5-Gen)', sovereign: 'Master Heritage' },
                { name: 'Vaccination & Medical Vault', patron: 'Standard', connoisseur: 'Advanced Analytics', sovereign: 'Full Clinical Sync' },
                { name: 'Microchip & Instant QR Scan', patron: true, connoisseur: true, sovereign: true },
            ],
        },
        {
            category: 'Marketplace & Directory Exposure',
            items: [
                { name: 'Directory Search Visibility', patron: 'Standard', connoisseur: 'Priority Placement', sovereign: 'Top Spotlight Tier' },
                { name: 'Verified Breeder / Clinic Shield', patron: false, connoisseur: false, sovereign: true },
                { name: 'Featured Litter & Stud Listings', patron: false, connoisseur: '2 / month', sovereign: 'Unlimited' },
                { name: 'Ad-Free Browsing Experience', patron: false, connoisseur: true, sovereign: true },
            ],
        },
        {
            category: 'Support & Concierge',
            items: [
                { name: 'Lost Pet Instant Radius Alert', patron: 'Community Feed', connoisseur: 'Priority Push Broadcast', sovereign: 'Geo-Targeted Surge' },
                { name: 'Client Booking & Inquiry Engine', patron: false, connoisseur: 'Standard', sovereign: 'Priority Instant Desk' },
                { name: 'Direct Concierge Advisor', patron: false, connoisseur: 'Email (24h)', sovereign: 'Dedicated Manager (1h)' },
            ],
        },
    ];

    const faqs = [
        {
            q: 'Can I upgrade or downgrade my tier at any time?',
            a: 'Yes, absolutely. You can change or cancel your subscription at any moment directly from your dashboard. Upgrades take effect immediately with pro-rated billing.',
        },
        {
            q: 'How does the Tamper-Proof Digital Passport work?',
            a: 'Each pet registered under your account receives a cryptographically signed QR passport link containing verified pedigree records, vaccine certificates, and owner credentials.',
        },
        {
            q: 'What is required for the Verified Breeder / Clinic Shield?',
            a: 'Sovereign Elite members undergo a thorough credentials check (KCI / Veterinary registration documents) before receiving the official Gold Shield badge on all listings.',
        },
        {
            q: 'Which payment methods do you accept?',
            a: 'We accept all major Credit/Debit Cards, UPI, Net Banking via Razorpay, as well as international cards through Stripe with 256-bit bank-grade encryption.',
        },
    ];

    return (
        <PublicLayout>
            <Head>
                <title>Membership Privileges & Tiers | WoofCircle</title>
                <meta
                    name="description"
                    content="Explore WoofCircle membership tiers. Unlock tamper-proof digital passports, verified pedigree trees, priority directory placements, and executive kennel management."
                />
            </Head>

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0e0d0a] via-[#14120e] to-[#0e0d0a] pt-32 pb-24 text-white border-b border-white/5">
                {/* Radial Gold Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 h-[500px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-woof-gold/10 blur-[140px] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#bb8b62_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.03] pointer-events-none" />

                <div className="container-wide relative z-10 mx-auto px-4 text-center">
                    {/* Brand Pill */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 backdrop-blur-md">
                        <img src="/images/favicon.png" alt="WoofCircle" className="h-4 w-4 object-contain" />
                        <span className="text-woof-gold text-[10px] font-black tracking-[0.25em] uppercase">
                            Membership & Privileges
                        </span>
                    </div>

                    <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
                        Elevate Your <span className="text-woof-gold">Canine Legacy</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-normal leading-relaxed text-white/70">
                        Bespoke privileges designed for discerning pet parents, champion kennel breeders, and accredited veterinary sanctuaries.
                    </p>

                    {/* Billing Switcher */}
                    <div className="mt-8 inline-flex items-center rounded-full border border-woof-gold/30 bg-[#24221c]/90 p-1.5 shadow-2xl backdrop-blur-md">
                        <button
                            onClick={() => setBilling('monthly')}
                            className={`rounded-full px-6 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                                billing === 'monthly'
                                    ? 'bg-woof-gold text-[#24221c] shadow-md'
                                    : 'text-white/70 hover:text-white'
                            }`}
                        >
                            Monthly Billing
                        </button>
                        <button
                            onClick={() => setBilling('yearly')}
                            className={`flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                                billing === 'yearly'
                                    ? 'bg-woof-gold text-[#24221c] shadow-md'
                                    : 'text-white/70 hover:text-white'
                            }`}
                        >
                            <span>Annual Billing</span>
                            <span className="rounded-full bg-[#14120e] px-2 py-0.5 text-[9px] font-black tracking-wider text-woof-gold border border-woof-gold/40">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PRICING CARDS --- */}
            <div className="container-wide relative z-20 mx-auto -mt-12 px-4 pb-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-stretch">
                    
                    {/* Tier 1: Patron (Free) */}
                    <div className="flex flex-col rounded-[28px] border border-[#e8ded1] bg-white p-8 shadow-md transition-all duration-300 hover:border-woof-gold/40 hover:shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-woof-cream shadow-2xs">
                                <ShieldCheck className="h-6 w-6 text-woof-gold" />
                            </div>
                            <span className="rounded-full bg-woof-cream px-3 py-1 text-[10px] font-bold tracking-wider text-woof-charcoal/60 uppercase border border-[#e8ded1]">
                                Community Pass
                            </span>
                        </div>

                        <h3 className="font-sans text-2xl font-black uppercase tracking-tight text-woof-charcoal">
                            Patron
                        </h3>
                        <p className="mt-1 min-h-[44px] text-xs font-medium text-woof-charcoal/60 leading-relaxed">
                            Essential digital records and official registry access for every pet parent.
                        </p>

                        <div className="my-6 border-y border-[#e8ded1] py-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tight text-woof-charcoal">Free</span>
                                <span className="text-xs font-bold text-woof-charcoal/40 uppercase">/ Forever</span>
                            </div>
                        </div>

                        <div className="mb-8 flex-1 space-y-3.5">
                            {[
                                'Up to 2 Pet Passports',
                                'Instant Microchip QR Verification',
                                'Official Canine Registry Lookup',
                                'Community Forum Participation',
                                'Standard Lost Pet Broadcast',
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-medium text-woof-charcoal/80">
                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-woof-gold/15 text-woof-gold">
                                        <Check className="h-2.5 w-2.5" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            disabled
                            className="h-12 w-full rounded-2xl border-[#e8ded1] bg-woof-cream/40 text-xs font-bold tracking-widest text-woof-charcoal/50 uppercase cursor-not-allowed"
                        >
                            Current Active Pass
                        </Button>
                    </div>

                    {/* Tier 2: Connoisseur (Featured Flagship) */}
                    <div className="relative flex flex-col rounded-[32px] border-2 border-woof-gold bg-gradient-to-b from-[#1c1917] to-[#14120e] p-8 text-white shadow-2xl transition-all duration-300 md:-translate-y-4">
                        {/* Top Badge */}
                        <div className="absolute -top-4 inset-x-0 flex justify-center">
                            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-woof-gold via-woof-champagne to-woof-gold px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#24221c] shadow-lg">
                                <Sparkles className="h-3 w-3" /> Most Preferred Tier
                            </span>
                        </div>

                        <div className="mb-6 flex items-center justify-between mt-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-woof-gold/40 bg-woof-gold/15 shadow-inner">
                                <Zap className="h-6 w-6 text-woof-gold" />
                            </div>
                            <span className="rounded-full bg-woof-gold/10 px-3 py-1 text-[10px] font-bold tracking-wider text-woof-gold uppercase border border-woof-gold/30">
                                Premium Privilege
                            </span>
                        </div>

                        <h3 className="font-sans text-2xl font-black uppercase tracking-tight text-white">
                            Connoisseur
                        </h3>
                        <p className="mt-1 min-h-[44px] text-xs font-medium text-white/70 leading-relaxed">
                            Comprehensive heritage tracing and priority placement for dedicated canine families.
                        </p>

                        <div className="my-6 border-y border-white/10 py-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tight text-white">₹{premiumPrice}</span>
                                <span className="text-xs font-bold text-white/50 uppercase">
                                    / {billing === 'monthly' ? 'Month' : 'Year'}
                                </span>
                            </div>
                            {billing === 'yearly' && (
                                <p className="mt-1 text-[10px] font-semibold text-woof-gold">
                                    Billed annually (Equivalent to ₹{Math.round(4799 / 12)}/mo)
                                </p>
                            )}
                        </div>

                        <div className="mb-8 flex-1 space-y-3.5">
                            {[
                                'Unlimited Tamper-Proof Pet Passports',
                                '5-Generation Verified Pedigree Tree',
                                'Priority Directory Search Placement',
                                'Complete Medical & Vaccine Vault',
                                'Priority Push Notification for Lost Pet Alerts',
                                '100% Ad-Free Clean Experience',
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-medium text-white/90">
                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-woof-gold text-[#24221c]">
                                        <Check className="h-2.5 w-2.5 font-bold" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => handleSubscribe('premium')}
                            disabled={loadingPlan !== null}
                            className="h-12 w-full rounded-2xl bg-woof-gold text-xs font-black tracking-widest text-[#24221c] uppercase shadow-lg transition-all hover:bg-woof-champagne active:scale-95 cursor-pointer"
                        >
                            {loadingPlan === 'premium' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <CreditCard className="h-4 w-4" /> Subscribe to Connoisseur
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Tier 3: Sovereign Elite (Professional Suite) */}
                    <div className="flex flex-col rounded-[28px] border border-woof-gold/40 bg-gradient-to-b from-[#14120e] to-[#0e0d0a] p-8 text-white shadow-xl transition-all duration-300 hover:border-woof-gold">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-woof-gold/30 bg-woof-gold/10">
                                <Crown className="h-6 w-6 text-woof-gold" />
                            </div>
                            <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold tracking-wider text-woof-pearl uppercase border border-woof-gold/20">
                                Professional Suite
                            </span>
                        </div>

                        <h3 className="font-sans text-2xl font-black uppercase tracking-tight text-white">
                            Sovereign Elite
                        </h3>
                        <p className="mt-1 min-h-[44px] text-xs font-medium text-white/70 leading-relaxed">
                            Enterprise toolkit tailored for certified breeders, registered sanctuaries, and clinics.
                        </p>

                        <div className="my-6 border-y border-white/10 py-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tight text-white">₹{elitePrice}</span>
                                <span className="text-xs font-bold text-white/50 uppercase">
                                    / {billing === 'monthly' ? 'Month' : 'Year'}
                                </span>
                            </div>
                            {billing === 'yearly' && (
                                <p className="mt-1 text-[10px] font-semibold text-woof-gold">
                                    Billed annually (Equivalent to ₹{Math.round(14399 / 12)}/mo)
                                </p>
                            )}
                        </div>

                        <div className="mb-8 flex-1 space-y-3.5">
                            {[
                                'Everything in Connoisseur Tier',
                                'Official Verified Gold Shield Badge',
                                'Top Featured Spotlights on Marketplace',
                                'Direct Client Inquiries & Booking Engine',
                                'Tamper-Proof Registry API Access',
                                'Dedicated Concierge Account Advisor',
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-medium text-white/90">
                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-woof-gold/20 text-woof-gold border border-woof-gold/40">
                                        <Check className="h-2.5 w-2.5" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => handleSubscribe('elite')}
                            disabled={loadingPlan !== null}
                            className="h-12 w-full rounded-2xl border border-woof-gold bg-transparent text-xs font-black tracking-widest text-woof-gold uppercase transition-all hover:bg-woof-gold hover:text-[#24221c] active:scale-95 cursor-pointer"
                        >
                            {loadingPlan === 'elite' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Crown className="h-4 w-4" /> Join Sovereign Elite
                                </span>
                            )}
                        </Button>
                    </div>

                </div>
            </div>

            {/* --- PRIVILEGE GUARANTEES BAR --- */}
            <div className="border-y border-[#e8ded1] bg-woof-cream/40 py-10">
                <div className="container-wide mx-auto px-4">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e8ded1] text-woof-gold shadow-2xs">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">256-Bit Security</h4>
                                <p className="text-[11px] text-woof-charcoal/60">Bank-grade encrypted checkout</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e8ded1] text-woof-gold shadow-2xs">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Instant Access</h4>
                                <p className="text-[11px] text-woof-charcoal/60">Immediate privilege activation</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e8ded1] text-woof-gold shadow-2xs">
                                <RefreshCw className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Cancel Anytime</h4>
                                <p className="text-[11px] text-woof-charcoal/60">Zero lock-in or hidden fees</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e8ded1] text-woof-gold shadow-2xs">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Concierge Desk</h4>
                                <p className="text-[11px] text-woof-charcoal/60">Dedicated canine registry advisory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DETAILED FEATURE MATRIX --- */}
            <div className="container-wide mx-auto px-4 py-20">
                <div className="mb-12 text-center">
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-woof-gold">
                        Granular Analysis
                    </span>
                    <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-woof-charcoal mt-1">
                        Compare Privilege Tiers
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm font-medium text-woof-charcoal/60">
                        Detailed breakdown of attributes, digital records, and visibility allocations across all tiers.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-[#e8ded1] bg-woof-cream/60">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-woof-charcoal w-2/5">
                                        Features & Privileges
                                    </th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-woof-charcoal/70 text-center w-1/5">
                                        Patron
                                    </th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-woof-gold text-center w-1/5 bg-woof-gold/5">
                                        Connoisseur
                                    </th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-woof-charcoal text-center w-1/5">
                                        Sovereign Elite
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((group, groupIdx) => (
                                    <React.Fragment key={groupIdx}>
                                        <tr className="bg-[#fcfbf9] border-b border-[#e8ded1]">
                                            <th colSpan={4} className="py-3 px-6 text-[11px] font-black uppercase tracking-wider text-woof-gold">
                                                {group.category}
                                            </th>
                                        </tr>
                                        {group.items.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="border-b border-[#e8ded1]/60 hover:bg-woof-cream/20 transition-colors">
                                                <td className="py-3.5 px-6 text-xs font-medium text-woof-charcoal">
                                                    {item.name}
                                                </td>
                                                <td className="py-3.5 px-6 text-xs text-center border-l border-[#e8ded1]/50 text-woof-charcoal/70">
                                                    {typeof item.patron === 'boolean' ? (
                                                        item.patron ? (
                                                            <Check className="h-4 w-4 text-woof-gold mx-auto" />
                                                        ) : (
                                                            <span className="text-woof-charcoal/30 font-bold">—</span>
                                                        )
                                                    ) : (
                                                        item.patron
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-6 text-xs font-bold text-center border-l border-[#e8ded1]/50 bg-woof-gold/5 text-woof-charcoal">
                                                    {typeof item.connoisseur === 'boolean' ? (
                                                        item.connoisseur ? (
                                                            <Check className="h-4 w-4 text-woof-gold mx-auto font-bold" />
                                                        ) : (
                                                            <span className="text-woof-charcoal/30 font-bold">—</span>
                                                        )
                                                    ) : (
                                                        item.connoisseur
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-6 text-xs font-bold text-center border-l border-[#e8ded1]/50 text-woof-charcoal">
                                                    {typeof item.sovereign === 'boolean' ? (
                                                        item.sovereign ? (
                                                            <Check className="h-4 w-4 text-woof-gold mx-auto font-bold" />
                                                        ) : (
                                                            <span className="text-woof-charcoal/30 font-bold">—</span>
                                                        )
                                                    ) : (
                                                        item.sovereign
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- FAQ SECTION --- */}
            <div className="border-t border-[#e8ded1] bg-white py-20">
                <div className="container-wide mx-auto max-w-3xl px-4">
                    <div className="mb-12 text-center">
                        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-woof-gold">
                            Clear Guidance
                        </span>
                        <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-woof-charcoal mt-1">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="overflow-hidden rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] transition-all"
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-bold uppercase tracking-wide text-woof-charcoal cursor-pointer"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-woof-gold transition-transform duration-300 ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="border-t border-[#e8ded1] p-5 pt-3 text-xs text-woof-charcoal/70 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

