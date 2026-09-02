import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function Contact() {
    const { settings } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', subject: '', message: '' });
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <Head title="Contact Us | WoofCircle" />

            {/* Hero Section */}
            <section className="bg-[#fcfbf9] border-b border-[#e8ded1] pt-36 pb-16 sm:pt-44 sm:pb-20">
                <div className="container-wide px-6 lg:px-12">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: route('home') },
                            { title: 'Contact Us', href: route('contact') },
                        ]}
                        className="mb-6"
                    />

                    <div className="max-w-3xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-woof-gold h-px w-8" />
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Direct Assistance</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal">
                            We're here to help you & your companion.
                        </h1>
                        <p className="text-sm sm:text-base text-woof-charcoal/70 leading-relaxed font-normal">
                            Have questions about our marketplace, verified breeder network, or platform features? Our dedicated concierge is ready to assist.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-white py-16 sm:py-24">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-start">
                        {/* Contact Form */}
                        <div className="lg:col-span-7 rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-10 shadow-xs">
                            <h2 className="text-xl font-bold text-woof-charcoal mb-8 pb-4 border-b border-[#e8ded1]">
                                Send a Message
                            </h2>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-2xl border border-[#e8ded1] bg-white px-4 py-3 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20"
                                            placeholder="Enter your name"
                                            required
                                        />
                                        {errors.name && <div className="text-xs text-red-500 font-medium">{errors.name}</div>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-2xl border border-[#e8ded1] bg-white px-4 py-3 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20"
                                            placeholder="your@email.com"
                                            required
                                        />
                                        {errors.email && <div className="text-xs text-red-500 font-medium">{errors.email}</div>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Subject</label>
                                    <select
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="w-full rounded-2xl border border-[#e8ded1] bg-white px-4 py-3 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer"
                                        required
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Marketplace Support">Marketplace Support</option>
                                        <option value="Professional Verification">Professional Verification</option>
                                        <option value="Technical Issue">Technical Issue</option>
                                    </select>
                                    {errors.subject && <div className="text-xs text-red-500 font-medium">{errors.subject}</div>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Message</label>
                                    <textarea
                                        rows={5}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full rounded-2xl border border-[#e8ded1] bg-white p-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 resize-none font-normal"
                                        placeholder="How can our team help you today?"
                                        required
                                    />
                                    {errors.message && <div className="text-xs text-red-500 font-medium">{errors.message}</div>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-8 h-12 text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {processing ? 'Sending...' : 'Transmit Message'}
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6 shadow-xs">
                                <h3 className="text-lg font-bold text-woof-charcoal pb-3 border-b border-[#e8ded1]">
                                    Concierge Information
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center shrink-0 shadow-2xs">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-woof-gold uppercase tracking-wider">Email Us</h4>
                                            <p className="text-sm font-bold text-woof-charcoal">
                                                {settings.contact_email || 'support@woofcircle.com'}
                                            </p>
                                            <p className="text-xs text-woof-charcoal/60">Typical response within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center shrink-0 shadow-2xs">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-woof-gold uppercase tracking-wider">Call Us</h4>
                                            <p className="text-sm font-bold text-woof-charcoal">
                                                {settings.contact_phone || '+91 98765 43210'}
                                            </p>
                                            <p className="text-xs text-woof-charcoal/60">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center shrink-0 shadow-2xs">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-woof-gold uppercase tracking-wider">Headquarters</h4>
                                            <p className="text-sm font-bold text-woof-charcoal">
                                                Woof Circle Sanctuary HQ
                                            </p>
                                            <p className="text-xs text-woof-charcoal/60">Indiranagar, Bangalore, Karnataka, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#e8ded1] bg-woof-charcoal p-6 sm:p-8 text-white space-y-3 shadow-md">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-woof-gold">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h4 className="text-base font-bold text-white">Need immediate guidance?</h4>
                                <p className="text-xs text-white/70 leading-relaxed font-normal">
                                    Check our comprehensive Help Center and FAQ section for immediate answers regarding breeder audits and pet health passports.
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href={route('help-center')}
                                        className="inline-flex items-center gap-2 text-xs font-bold text-woof-gold hover:underline"
                                    >
                                        Visit Help Center →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
