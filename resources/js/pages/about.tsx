import { Breadcrumbs } from '@/components/breadcrumbs';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Award, CheckCircle, FileCheck, Globe, Heart, Home, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function About() {
    const { settings } = usePage<SharedData>().props;
    return (
        <PublicLayout>
            <Head title={`About ${settings.site_name}`} />

            {/* Hero Section */}
            <section className="bg-[#fcfbf9] border-b border-[#e8ded1] relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-8">
                            <Breadcrumbs
                                breadcrumbs={[
                                    { title: 'Home', href: route('home') },
                                    { title: `About ${settings.site_name}`, href: route('about') },
                                ]}
                            />

                            <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 backdrop-blur-md">
                                <Sparkles className="size-3.5 text-woof-gold" />
                                <span className="text-[10px] font-bold tracking-wider uppercase text-woof-gold">The Sanctuary Standard</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-woof-charcoal leading-tight">
                                Cultivating Trust & <br />
                                <span className="text-woof-gold">Canine Heritage.</span>
                            </h1>

                            <p className="text-sm sm:text-base text-woof-charcoal/70 max-w-xl leading-relaxed font-normal">
                                {settings.site_name} is more than a directory. It's a curated ecosystem built for the discerning pet parent who treats
                                their companion as cherished family.
                            </p>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-2.5 shadow-lg overflow-hidden">
                                <img
                                    src="/images/platform/about-hero.png"
                                    alt="Premium Lifestyle"
                                    className="w-full h-[380px] sm:h-[440px] object-cover rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="bg-white py-20 sm:py-28 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                                    <div className="bg-woof-gold h-px w-6" />
                                    <span>Our Mission</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-bold text-woof-charcoal tracking-tight">
                                    Quality, Integrity, <br /> & <span className="text-woof-gold">Absolute Trust.</span>
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm text-woof-charcoal/70 leading-relaxed font-normal">
                                <p>
                                    Founded in 2026, {settings.site_name} emerged from a simple realization: finding verified, high-quality care for
                                    our pets shouldn't be a gamble. We set out to build a platform where every listing, every breeder, and every
                                    professional is vetted against the highest standards of ethics and excellence.
                                </p>

                                <p>
                                    Today, we are India's leading premium pet ecosystem, connecting thousands of responsible owners with the resources
                                    they need to ensure their dogs live their healthiest, happiest lives.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#e8ded1]">
                                <div className="space-y-1">
                                    <span className="text-woof-charcoal text-3xl sm:text-4xl font-bold">1,000+</span>
                                    <p className="text-woof-charcoal/60 text-xs font-medium uppercase tracking-wider">Verified Breeders</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-woof-charcoal text-3xl sm:text-4xl font-bold">50k+</span>
                                    <p className="text-woof-charcoal/60 text-xs font-medium uppercase tracking-wider">Happy Companions</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-3xl border border-[#e8ded1] p-2.5 shadow-md">
                                <img
                                    src="/images/platform/about-dog.png"
                                    alt="Community Care"
                                    className="w-full h-[420px] object-cover rounded-2xl"
                                />
                            </div>

                            <div className="bg-woof-charcoal rounded-3xl border border-white/10 p-8 text-white shadow-xl max-w-sm absolute -bottom-8 -left-6 hidden sm:block">
                                <Heart className="size-7 text-woof-gold fill-woof-gold mb-3" />
                                <p className="text-xs leading-relaxed font-medium text-white/90">
                                    "We believe every dog deserves a life of exceptional wellness, nutrition, and love."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The 7-Step Audit */}
            <section className="bg-[#fcfbf9] py-20 sm:py-28 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
                        <div className="space-y-8 lg:col-span-5 lg:sticky lg:top-36">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                                    <div className="bg-woof-gold h-px w-6" />
                                    <span>Trust & Safety</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-bold text-woof-charcoal tracking-tight">
                                    The <span className="text-woof-gold">7-Step</span> <br /> Breeder Audit.
                                </h2>

                                <p className="text-sm text-woof-charcoal/70 leading-relaxed font-normal">
                                    We don't just list breeders; we verify legacies. Every professional on {settings.site_name} undergoes a rigorous
                                    verification protocol before their first listing goes live.
                                </p>
                            </div>

                            <div>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-3 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 h-11 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                                >
                                    Apply as a Professional
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        step: '01',
                                        title: 'Identity Vault',
                                        desc: 'Government ID and legal business registration validation.',
                                        icon: <ShieldCheck className="size-5" />,
                                    },
                                    {
                                        step: '02',
                                        title: 'Kennel Inspection',
                                        desc: 'On-site or digital verification of living conditions.',
                                        icon: <Home className="size-5" />,
                                    },
                                    {
                                        step: '03',
                                        title: 'Health Registry',
                                        desc: 'Validation of veterinary partnerships and health certifications.',
                                        icon: <FileCheck className="size-5" />,
                                    },
                                    {
                                        step: '04',
                                        title: 'Ethics Interview',
                                        desc: 'One-on-one consultation regarding breeding philosophy.',
                                        icon: <Users className="size-5" />,
                                    },
                                    {
                                        step: '05',
                                        title: 'Lineage Check',
                                        desc: 'Verification of parentage and championship records.',
                                        icon: <Award className="size-5" />,
                                    },
                                    {
                                        step: '06',
                                        title: 'Financial Shield',
                                        desc: 'Secure escrow-ready payment setup and transparency.',
                                        icon: <Search className="size-5" />,
                                    },
                                    {
                                        step: '07',
                                        title: 'Continuous Audit',
                                        desc: 'Ongoing community review and performance tracking.',
                                        icon: <CheckCircle className="size-5" />,
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-3xl bg-white border border-[#e8ded1] p-6 shadow-xs hover:border-woof-gold/50 hover:shadow-md transition-all space-y-4 ${i === 6 ? 'sm:col-span-2' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-woof-gold uppercase tracking-wider">
                                                STEP {item.step}
                                            </span>
                                            <div className="w-9 h-9 rounded-2xl bg-woof-cream text-woof-gold flex items-center justify-center border border-[#e8ded1] shadow-2xs">
                                                {item.icon}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-woof-charcoal text-base font-bold tracking-tight">
                                                {item.title}
                                            </h4>
                                            <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-woof-charcoal relative overflow-hidden py-24 sm:py-32 text-white">
                <div className="container-wide relative z-10 px-6 lg:px-12 space-y-16">
                    <div className="max-w-2xl mx-auto space-y-3 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 backdrop-blur-md">
                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">The WoofCircle Way</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            Guided by <span className="text-woof-gold">Principles.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            {
                                icon: <ShieldCheck className="text-woof-gold size-6" />,
                                title: 'Uncompromising Ethics',
                                desc: 'We enforce strict breeding standards and professional codes of conduct to ensure animal welfare is always first.',
                            },
                            {
                                icon: <Users className="text-woof-gold size-6" />,
                                title: 'Community Driven',
                                desc: 'Our platform thrives on shared experiences, reviews, and a mutual love for canine companions.',
                            },
                            {
                                icon: <Globe className="text-woof-gold size-6" />,
                                title: 'National Network',
                                desc: 'Connecting you with top-tier professionals across every major city in India, seamlessly.',
                            },
                        ].map((value, i) => (
                            <div key={i} className="bg-white/5 rounded-3xl border border-white/10 p-8 space-y-6 hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                    {value.icon}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">
                                        {value.title}
                                    </h3>
                                    <p className="text-xs text-white/70 leading-relaxed font-normal">
                                        {value.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats Banner */}
                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-16 md:grid-cols-4">
                        {[
                            { label: 'Active Cities', value: '24+' },
                            { label: 'Expert Partners', value: '450+' },
                            { label: 'Community Rating', value: '4.9/5' },
                            { label: 'Daily Listings', value: '100+' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1 text-center">
                                <span className="block text-3xl sm:text-4xl font-bold text-white">{stat.value}</span>
                                <span className="text-woof-gold text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-20 sm:py-28">
                <div className="container-wide max-w-4xl px-6 text-center space-y-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal">
                        Be part of the <span className="text-woof-gold">Inner circle.</span>
                    </h2>

                    <p className="text-sm text-woof-charcoal/70 max-w-xl mx-auto font-normal">
                        Join our premier network of dedicated pet parents, ethical breeders, and certified specialists today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-8 h-12 flex items-center justify-center text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                        >
                            Join the Community
                        </Link>

                        <Link
                            href={route('marketplace.index')}
                            className="w-full sm:w-auto border border-[#e8ded1] hover:bg-woof-cream/40 text-woof-charcoal rounded-full px-8 h-12 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            View Marketplace
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
