import { Breadcrumbs } from '@/components/breadcrumbs';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Clock, Cookie, Cpu, Database, Eye, FileText, Layers, Lock, ToggleLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
    const { settings } = usePage<SharedData>().props;
    return (
        <PublicLayout>
            <Head title={`Privacy Policy | ${settings.site_name}`} />

            {/* Header Section */}
            <section className="bg-[#fcfbf9] border-b border-[#e8ded1] pt-36 pb-16 sm:pt-44 sm:pb-20">
                <div className="container-wide px-6 lg:px-12">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: route('home') },
                            { title: 'Privacy Policy', href: route('privacy-policy') },
                        ]}
                        className="mb-6"
                    />

                    <div className="max-w-3xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-woof-gold h-px w-8" />
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Data Protection</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal">
                            Data & Privacy Center
                        </h1>
                        <p className="text-sm sm:text-base text-woof-charcoal/70 leading-relaxed font-normal">
                            At {settings.site_name}, we believe your privacy is a fundamental right. We are committed to transparency in how we handle
                            your data and protecting your digital footprint.
                        </p>
                    </div>
                </div>
            </section>

            {/* Security Stack Section */}
            <section className="bg-woof-charcoal relative overflow-hidden py-24 sm:py-32 text-white">
                <div className="container-wide relative z-10 px-6 lg:px-12 space-y-16">
                    <div className="max-w-2xl mx-auto space-y-3 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 backdrop-blur-md">
                            <ShieldCheck className="size-3.5 text-woof-gold" />
                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">Technical Integrity</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            Our <span className="text-woof-gold">Security</span> Stack.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: '256-Bit Encryption',
                                desc: 'Military-grade AES-256 encryption for all data at rest and in transit.',
                                icon: <Lock className="text-woof-gold size-5" />,
                            },
                            {
                                title: 'Isolated Vaults',
                                desc: 'Sensitive payment info is stored in PCI-compliant hardware vaults.',
                                icon: <Database className="text-woof-gold size-5" />,
                            },
                            {
                                title: 'Neural Defense',
                                desc: 'AI-driven anomaly detection to prevent unauthorized access in real-time.',
                                icon: <Cpu className="text-woof-gold size-5" />,
                            },
                            {
                                title: 'Zero-Trust Architecture',
                                desc: 'Strict verification for every internal access request, no exceptions.',
                                icon: <Layers className="text-woof-gold size-5" />,
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-3xl border border-white/10 p-6 space-y-4 hover:bg-white/10 transition-all">
                                <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                    {item.icon}
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-white">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-white/70 leading-relaxed font-normal">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Data Rights Explorer */}
            <section className="bg-white py-16 sm:py-24 border-b border-[#e8ded1]">
                <div className="container-wide max-w-5xl px-6 lg:px-12 space-y-16">
                    <div className="space-y-3 text-center">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Your Control</span>
                        <h2 className="text-3xl font-bold text-woof-charcoal tracking-tight">
                            Data Rights Explorer
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Right to Erasure',
                                desc: 'Permanently delete your profile and all associated data within 72 hours.',
                                icon: <Eye className="text-woof-gold size-6" />,
                            },
                            {
                                title: 'Data Portability',
                                desc: 'Export your complete platform history in a machine-readable JSON format.',
                                icon: <FileText className="text-woof-gold size-6" />,
                            },
                            {
                                title: 'Preference Control',
                                desc: 'Granular control over marketing, community, and safety notifications.',
                                icon: <ToggleLeft className="text-woof-gold size-6" />,
                            },
                        ].map((right, i) => (
                            <div key={i} className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 text-center space-y-4 shadow-xs hover:border-woof-gold/40 hover:shadow-md transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-[#e8ded1] mx-auto flex items-center justify-center shadow-2xs">
                                    {right.icon}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-woof-charcoal">{right.title}</h4>
                                    <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                        {right.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cookie Transparency */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 sm:p-10 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-[#e8ded1]">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                                <Cookie className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-woof-charcoal">Cookie Transparency</h3>
                                <p className="text-xs text-woof-charcoal/60">We use minimal cookies for security and session state. Zero 3rd-party trackers.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-4 rounded-2xl bg-white border border-[#e8ded1] space-y-1">
                                <span className="text-xs font-bold text-woof-gold uppercase tracking-wider">Essential Cookies</span>
                                <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                    Authentication, CSRF security, and core session storage.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-[#e8ded1] space-y-1">
                                <span className="text-xs font-bold text-woof-gold uppercase tracking-wider">Performance Cookies</span>
                                <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                    Anonymous telemetry to maintain optimal server response times.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Updates Section */}
            <section className="bg-[#fcfbf9] py-16">
                <div className="container-wide max-w-4xl px-6 lg:px-12">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-center sm:text-left">
                        <div className="space-y-1">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-woof-gold text-xs font-medium">
                                <Clock className="size-4" />
                                <span>Last Updated: May 14, 2026</span>
                            </div>
                            <h3 className="text-lg font-bold text-woof-charcoal">Questions about your data?</h3>
                            <p className="text-xs text-woof-charcoal/70">
                                Contact our data protection concierge at{' '}
                                <a href="mailto:privacy@woofcircle.test" className="text-woof-gold font-bold hover:underline">
                                    privacy@woofcircle.test
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
