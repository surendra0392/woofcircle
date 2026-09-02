import { Breadcrumbs } from '@/components/breadcrumbs';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Award, CheckCircle2, FileText, Gavel, HelpCircle, Info, Scale, ShieldCheck } from 'lucide-react';

export default function TermsAndEthics() {
    const { settings } = usePage<SharedData>().props;
    const legalSections = [
        {
            id: 'acceptance',
            title: '1. Acceptance of Terms',
            content: `By accessing and using ${settings.site_name}, you agree to be bound by these terms. If you do not agree to all of these terms, do not use the platform. We reserve the right to update these terms at any time.`,
        },
        {
            id: 'conduct',
            title: '2. User Conduct & Eligibility',
            content:
                'Users must be at least 18 years of age. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
        },
        {
            id: 'marketplace',
            title: '3. Marketplace Rules',
            content: `${settings.site_name} provides a venue for users to connect. We do not own, sell, or manage any of the animals listed. All transactions are solely between the buyer and seller.`,
        },
        {
            id: 'safety',
            title: '4. Safety & Disputes',
            content: `While we implement vetting processes, users are encouraged to perform their own due diligence. ${settings.site_name} is not liable for any damages arising from transactions or connections made via the platform.`,
        },
    ];

    return (
        <PublicLayout>
            <Head title={`Terms & Ethics | ${settings.site_name}`} />

            {/* Header */}
            <section className="bg-[#fcfbf9] border-b border-[#e8ded1] pt-36 pb-16 sm:pt-44 sm:pb-20">
                <div className="container-wide px-6 lg:px-12">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: route('home') },
                            { title: 'Terms & Ethics', href: route('terms-and-ethics') },
                        ]}
                        className="mb-6"
                    />

                    <div className="max-w-3xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-woof-gold h-px w-8" />
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Governance</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal">
                            Ethics & Legal Framework
                        </h1>
                        <p className="text-sm sm:text-base text-woof-charcoal/70 leading-relaxed font-normal">
                            Our platform is built on an unwavering foundation of mutual respect, transparency, and canine welfare.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Breeder's Pledge */}
            <section className="bg-white py-16 sm:py-24 border-b border-[#e8ded1]">
                <div className="container-wide max-w-4xl px-6 lg:px-12">
                    <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 sm:p-14 shadow-xs text-center space-y-8 relative overflow-hidden">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center mx-auto shadow-2xs">
                            <Award className="size-8" />
                        </div>

                        <div className="space-y-2">
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Sanctuary Seal of Excellence</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-woof-charcoal tracking-tight">
                                The Breeder's Pledge
                            </h2>
                        </div>

                        <blockquote className="text-base sm:text-lg text-woof-charcoal/90 max-w-2xl mx-auto leading-relaxed font-normal">
                            "I solemnly swear to prioritize the health, happiness, and heritage of every canine soul in my care above all commercial interests."
                        </blockquote>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-6 border-t border-[#e8ded1]">
                            {[
                                'Commitment to Zero-Crate lifetime freedom.',
                                'Mandatory genetic health screening.',
                                'Lifetime return-to-breeder guarantee.',
                                'Transparent communication with all families.',
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#e8ded1]">
                                    <CheckCircle2 className="text-woof-gold mt-0.5 size-4 shrink-0" />
                                    <span className="text-xs text-woof-charcoal/80 font-medium">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-woof-charcoal/15 bg-white px-5 py-2 text-[11px] font-bold text-woof-charcoal uppercase tracking-wider">
                                <Gavel className="size-3.5 text-woof-gold" /> Enforced by Platform Governance
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legal Framework Sections */}
            <section className="bg-[#fcfbf9] py-16 sm:py-24">
                <div className="container-wide max-w-4xl px-6 lg:px-12 space-y-12">
                    <div className="space-y-3 text-center">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Clarity & Terms</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-woof-charcoal tracking-tight">
                            Platform Terms of Service
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {legalSections.map((section) => (
                            <div key={section.id} className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs space-y-2">
                                <div className="text-woof-gold inline-flex items-center gap-2">
                                    <Scale className="size-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Clause {section.id.toUpperCase()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-woof-charcoal">
                                    {section.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-woof-charcoal/70 leading-relaxed font-normal">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 text-center space-y-2">
                        <div className="text-woof-charcoal/40 flex items-center justify-center gap-2">
                            <Info className="size-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Last Updated: May 14, 2026</span>
                        </div>
                        <p className="text-xs text-woof-charcoal/70">
                            If you have questions about our legal framework or wish to report a violation of our Ethics Code, please contact{' '}
                            <a href="mailto:legal@woofcircle.test" className="text-woof-gold font-bold hover:underline">
                                legal@woofcircle.test
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
