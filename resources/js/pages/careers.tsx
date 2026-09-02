import { Breadcrumbs } from '@/components/breadcrumbs';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Award,
    Briefcase,
    Clock,
    Code,
    Globe,
    GraduationCap,
    Heart,
    HeartHandshake,
    Laptop,
    MapPin,
    Megaphone,
    Palette,
    Rocket,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
    X,
    Upload,
    FileText,
    User,
    Mail,
    Phone,
    Building,
    Linkedin,
    Link as LinkIcon,
} from 'lucide-react';

interface Position {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements?: string;
    is_active: boolean;
}

const departmentColors: Record<string, string> = {
    Engineering: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Design: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    Content: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Marketing: 'bg-woof-gold/10 text-woof-gold border-woof-gold/20',
    Growth: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const cultureValues = [
    {
        icon: Heart,
        title: 'Mission-Driven',
        desc: 'Every line of code, every pixel, and every conversation we have is guided by our love for animals and their families.',
    },
    {
        icon: Rocket,
        title: 'Move Fast, Stay Sharp',
        desc: "We ship often, iterate quickly, and hold ourselves to the highest quality bar. Speed and excellence aren't opposites here.",
    },
    {
        icon: Users,
        title: 'Radical Transparency',
        desc: 'Open salaries, open roadmaps, open decisions. We trust our team with everything because trust is how great work gets done.',
    },
    {
        icon: GraduationCap,
        title: 'Always Learning',
        desc: "Annual learning budgets, conference sponsorships, and a culture where asking questions is valued more than having answers.",
    },
    {
        icon: Globe,
        title: 'Remote-First DNA',
        desc: 'Work from wherever you\'re most productive. Our async-first culture means no pointless meetings and focus time.',
    },
    {
        icon: HeartHandshake,
        title: 'Impact Over Hours',
        desc: 'We measure outcomes, not hours logged. Flexible schedules, unlimited PTO, and a genuine respect for life outside work.',
    },
];

const perks = [
    { icon: Laptop, title: 'Remote-First', desc: 'Work from anywhere in India' },
    { icon: TrendingUp, title: 'Equity Options', desc: 'Own a piece of what you build' },
    { icon: Clock, title: 'Flexible Hours', desc: 'Async-first, no micromanagement' },
    { icon: Shield, title: 'Health Coverage', desc: 'Comprehensive insurance for you & family' },
    { icon: GraduationCap, title: 'Learning Budget', desc: '₹1L annual education allowance' },
    { icon: Zap, title: 'Top-Tier Setup', desc: 'MacBook, monitors & ergonomic gear' },
    { icon: Award, title: 'Pet Adoption Bonus', desc: '₹25K if you adopt a rescue' },
    { icon: Heart, title: 'Pet-Friendly Office', desc: 'Bring your dog to work days' },
];

export default function Careers({ positions = [] }: { positions: Position[] }) {
    const { settings } = usePage<SharedData>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        career_position_id: '',
        full_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        resume: null as File | null,
        experience_years: '',
        current_company: '',
        linkedin_url: '',
        portfolio_url: '',
    });

    const openApplyModal = (position: Position | null) => {
        setSelectedPosition(position);
        setData('career_position_id', position ? String(position.id) : '');
        setIsModalOpen(true);
    };

    const closeApplyModal = () => {
        setIsModalOpen(false);
        setSelectedPosition(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('careers.apply'), {
            forceFormData: true,
            onSuccess: () => {
                closeApplyModal();
            },
        });
    };

    return (
        <PublicLayout>
            <Head title={`Careers — ${settings.site_name}`} />

            {/* ─── Hero ──────────────────────────────────────────────── */}
            <section className="bg-[#fcfbf9] border-b border-[#e8ded1] pt-36 pb-16 sm:pt-44 sm:pb-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="max-w-3xl space-y-4">
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: route('home') },
                                { title: 'Careers', href: route('careers') },
                            ]}
                            className="mb-6"
                        />

                        <div className="flex items-center gap-3">
                            <div className="bg-woof-gold h-px w-8" />
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">We're Hiring</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal">
                            Build the Future of Pet Care.
                        </h1>

                        <p className="text-sm sm:text-base text-woof-charcoal/70 leading-relaxed font-normal max-w-2xl">
                            Join a passionate team creating India's most trusted pet ecosystem. We're looking for exceptional people who believe technology can make life better for millions of pets and their families.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <a
                                href="#open-positions"
                                className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-8 h-12 text-xs font-bold uppercase tracking-wider shadow-md transition-all inline-flex items-center justify-center cursor-pointer"
                            >
                                View Open Roles
                            </a>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ded1] bg-white px-4 py-2 text-xs font-bold text-woof-charcoal shadow-2xs">
                                <Briefcase className="size-4 text-woof-gold" />
                                <span>{positions.length} Open Positions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Culture Values ─────────────────────────────────── */}
            <section className="bg-white py-16 sm:py-24 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Our Culture</span>
                        <h2 className="text-3xl font-bold text-woof-charcoal tracking-tight">
                            What Makes Us Different
                        </h2>
                        <p className="text-sm text-woof-charcoal/70 max-w-xl mx-auto font-normal">
                            We're not building just another startup. We're building a legacy for millions of pets and their families.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cultureValues.map((value, i) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 space-y-4 hover:border-woof-gold/40 hover:shadow-md transition-all shadow-xs"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center shadow-2xs">
                                        <Icon className="size-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-woof-charcoal">
                                        {value.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-woof-charcoal/70 leading-relaxed font-normal">
                                        {value.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Open Positions ─────────────────────────────────── */}
            <section id="open-positions" className="bg-[#fcfbf9] py-16 sm:py-24">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Opportunities</span>
                        <h2 className="text-3xl font-bold text-woof-charcoal tracking-tight">
                            Find Your Role
                        </h2>
                    </div>

                    <div className="mx-auto max-w-4xl space-y-6">
                        {positions.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-[#e8ded1] bg-white p-12 text-center space-y-4 shadow-xs">
                                <Briefcase className="size-10 text-woof-gold mx-auto" />
                                <h3 className="text-lg font-bold text-woof-charcoal">No open roles at the moment</h3>
                                <p className="text-xs sm:text-sm text-woof-charcoal/70 max-w-md mx-auto font-normal">
                                    We aren't actively hiring for any specific position right now, but we are always looking for amazing talent. Submit a general application and we'll keep you in mind!
                                </p>
                                <button
                                    onClick={() => openApplyModal(null)}
                                    className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-8 h-12 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Submit General Application
                                </button>
                            </div>
                        ) : (
                            positions.map((position) => (
                                <div
                                    key={position.id}
                                    className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs hover:border-woof-gold/40 hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${departmentColors[position.department] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}
                                                >
                                                    {position.department}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs text-woof-charcoal/60">
                                                    <Clock className="size-3.5" />
                                                    {position.type}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-woof-charcoal">
                                                {position.title}
                                            </h3>

                                            <p className="text-xs sm:text-sm text-woof-charcoal/70 leading-relaxed font-normal whitespace-pre-line">
                                                {position.description}
                                            </p>

                                            {position.requirements && (
                                                <div className="pt-2 space-y-1">
                                                    <h4 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Requirements:</h4>
                                                    <p className="text-xs text-woof-charcoal/70 whitespace-pre-line leading-relaxed font-normal">
                                                        {position.requirements}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1.5 text-xs text-woof-charcoal/60 pt-2">
                                                <MapPin className="size-3.5 text-woof-gold" />
                                                <span>{position.location}</span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 pt-2">
                                            <button
                                                onClick={() => openApplyModal(position)}
                                                className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-6 h-11 text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {positions.length > 0 && (
                        <div className="mt-12 text-center space-y-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Don't see your role? We're always looking for exceptional talent.
                            </p>
                            <button
                                onClick={() => openApplyModal(null)}
                                className="text-xs font-bold text-woof-gold hover:underline cursor-pointer"
                            >
                                Send us your resume →
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── Perks & Benefits ──────────────────────────────── */}
            <section className="bg-woof-charcoal relative overflow-hidden py-24 sm:py-32 text-white">
                <div className="container-wide relative z-10 px-6 lg:px-12 space-y-16">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                            Perks & Benefits
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            More Than a <span className="text-woof-gold">Paycheck.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {perks.map((perk, i) => {
                            const Icon = perk.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-white/5 rounded-3xl border border-white/10 p-6 space-y-4 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                        <Icon className="text-woof-gold size-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">
                                        {perk.title}
                                    </h3>
                                    <p className="text-xs text-white/70 leading-relaxed font-normal">
                                        {perk.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Hiring Process ─────────────────────────────────── */}
            <section className="bg-white py-16 sm:py-24 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Hiring Process</span>
                        <h2 className="text-3xl font-bold text-woof-charcoal tracking-tight">
                            Simple & Respectful
                        </h2>
                        <p className="text-sm text-woof-charcoal/70 max-w-xl mx-auto font-normal">
                            No trick questions, no 8-round marathons. Just genuine conversations to find mutual fit.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { step: '01', icon: Megaphone, title: 'Apply', desc: 'Submit your resume and a brief note on why this role excites you.' },
                            { step: '02', icon: Users, title: 'Culture Chat', desc: 'A 30-minute call to explore mutual values and expectations.' },
                            { step: '03', icon: Code, title: 'Skill Deep-Dive', desc: 'A practical assessment relevant to the role — no whiteboard stunts.' },
                            { step: '04', icon: Palette, title: 'Offer & Onboard', desc: 'Transparent offer with equity details, followed by a structured onboarding.' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 space-y-4 hover:border-woof-gold/40 shadow-xs transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-woof-gold text-xs font-bold tracking-wider">
                                            {item.step}
                                        </span>
                                        <div className="w-8 h-8 rounded-xl bg-white border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                                            <Icon className="size-4" />
                                        </div>
                                    </div>
                                    <h4 className="text-base font-bold text-woof-charcoal">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── CUSTOM APPLICATION FORM MODAL ────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-woof-charcoal/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-2xl max-w-xl w-full relative p-6 sm:p-10 my-8">
                        {/* Close button */}
                        <button
                            onClick={closeApplyModal}
                            className="absolute top-6 right-6 text-woof-charcoal/50 hover:text-woof-charcoal transition-colors p-1"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6 space-y-1">
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Join Our Team</span>
                            <h3 className="text-2xl font-bold text-woof-charcoal">
                                {selectedPosition ? `Apply for ${selectedPosition.title}` : 'Submit Resume'}
                            </h3>
                            <p className="text-xs text-woof-charcoal/60">
                                {selectedPosition ? `${selectedPosition.department} • ${selectedPosition.location}` : 'General Application'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Position dropdown if general application */}
                            {!selectedPosition && positions.length > 0 && (
                                <div className="space-y-1.5">
                                    <label htmlFor="position_select" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Select Position *</label>
                                    <div className="relative flex items-center">
                                        <Briefcase className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <select
                                            id="position_select"
                                            value={data.career_position_id}
                                            onChange={(e) => setData('career_position_id', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-10 text-sm text-woof-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl cursor-pointer"
                                            required
                                        >
                                            <option value="">Select a role...</option>
                                            {positions.map((pos) => (
                                                <option key={pos.id} value={pos.id}>{pos.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.career_position_id && <p className="text-xs text-rose-500 font-medium">{errors.career_position_id}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label htmlFor="full_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Full Name *</label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <input
                                            id="full_name"
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                            placeholder="e.g. Jane Doe"
                                            required
                                        />
                                    </div>
                                    {errors.full_name && <p className="text-xs text-rose-500 font-medium">{errors.full_name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Email Address *</label>
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                            placeholder="e.g. jane@example.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Phone Number *</label>
                                    <div className="relative flex items-center">
                                        <Phone className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                            placeholder="e.g. +91 98765 43210"
                                            required
                                        />
                                    </div>
                                    {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="experience_years" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Experience (Years) *</label>
                                    <div className="relative flex items-center">
                                        <Clock className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <input
                                            id="experience_years"
                                            type="number"
                                            min="0"
                                            value={data.experience_years}
                                            onChange={(e) => setData('experience_years', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                            placeholder="e.g. 5"
                                            required
                                        />
                                    </div>
                                    {errors.experience_years && <p className="text-xs text-rose-500 font-medium">{errors.experience_years}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="current_company" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Current Company</label>
                                    <div className="relative flex items-center">
                                        <Building className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <input
                                            id="current_company"
                                            type="text"
                                            value={data.current_company}
                                            onChange={(e) => setData('current_company', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                            placeholder="e.g. Acme Corp (or Freelance)"
                                        />
                                    </div>
                                    {errors.current_company && <p className="text-xs text-rose-500 font-medium">{errors.current_company}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="linkedin_url" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">LinkedIn URL</label>
                                    <div className="relative flex items-center">
                                        <Linkedin className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                        <input
                                            id="linkedin_url"
                                            type="url"
                                            value={data.linkedin_url}
                                            onChange={(e) => setData('linkedin_url', e.target.value)}
                                            className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                            placeholder="e.g. https://linkedin.com/in/username"
                                        />
                                    </div>
                                    {errors.linkedin_url && <p className="text-xs text-rose-500 font-medium">{errors.linkedin_url}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="portfolio_url" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Portfolio URL</label>
                                <div className="relative flex items-center">
                                    <LinkIcon className="absolute left-4 size-4 text-woof-charcoal/40 pointer-events-none" />
                                    <input
                                        id="portfolio_url"
                                        type="url"
                                        value={data.portfolio_url}
                                        onChange={(e) => setData('portfolio_url', e.target.value)}
                                        className="w-full h-11 border border-[#e8ded1] bg-white pl-11 pr-4 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal"
                                        placeholder="e.g. https://jane-portfolio.dev"
                                    />
                                </div>
                                {errors.portfolio_url && <p className="text-xs text-rose-500 font-medium">{errors.portfolio_url}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Upload Resume (PDF/DOC, max 5MB) *</label>
                                <div className="border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] rounded-2xl p-4 text-center cursor-pointer hover:bg-white transition-colors relative">
                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setData('resume', e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        required
                                    />
                                    <div className="space-y-1.5">
                                        <Upload className="mx-auto h-5 w-5 text-woof-gold" />
                                        <div className="text-xs font-bold text-woof-charcoal">
                                            {data.resume ? (
                                                <span className="text-woof-charcoal flex items-center justify-center gap-1.5">
                                                    <FileText className="h-4 w-4 text-woof-gold" /> {data.resume.name}
                                                </span>
                                            ) : (
                                                <span>Drag and drop or click to upload</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-woof-charcoal/60">PDF, DOC, DOCX up to 5MB</p>
                                    </div>
                                </div>
                                {errors.resume && <p className="text-xs text-rose-500 font-medium">{errors.resume}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="cover_letter" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider block">Cover Letter / Message</label>
                                <div className="relative">
                                    <textarea
                                        id="cover_letter"
                                        value={data.cover_letter}
                                        onChange={(e) => setData('cover_letter', e.target.value)}
                                        className="w-full h-24 border border-[#e8ded1] bg-white p-3 text-sm text-woof-charcoal outline-none focus:ring-2 focus:ring-woof-gold/20 rounded-2xl font-normal resize-none"
                                        placeholder="Tell us why you are interested in this position..."
                                    />
                                </div>
                                {errors.cover_letter && <p className="text-xs text-rose-500 font-medium">{errors.cover_letter}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#e8ded1]">
                                <button
                                    type="button"
                                    onClick={closeApplyModal}
                                    className="border border-[#e8ded1] bg-white hover:bg-[#fcfbf9] text-woof-charcoal font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-full cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-full transition-colors cursor-pointer"
                                >
                                    {processing ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
