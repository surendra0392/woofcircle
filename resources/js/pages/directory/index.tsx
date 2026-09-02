import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Building2,
    CheckCircle2,
    ChevronRight,
    FileCheck,
    GraduationCap,
    HeartHandshake,
    Home as HomeIcon,
    MapPin,
    Search,
    Shield,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Stethoscope,
    UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import DirectoryCard from '@/components/public/directory-card';
import DisplayAdBanner from '@/components/public/display-ad-banner';

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface StateItem {
    id: number;
    name: string;
}

interface PageProps {
    counts: {
        vets: number;
        trainers: number;
        boarding: number;
        welfare: number;
        petShops: number;
        total?: number;
    };
    states?: StateItem[];
    featuredVets?: any[];
    featuredTrainers?: any[];
    featuredBoarding?: any[];
}

export default function DirectoryIndex({
    counts,
    states = [],
    featuredVets = [],
    featuredTrainers = [],
    featuredBoarding = [],
}: PageProps) {
    const [category, setCategory] = useState<string>('all');
    const [selectedState, setSelectedState] = useState<string>('all');
    const [selectedCity, setSelectedCity] = useState<string>('all');
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [spotlightTab, setSpotlightTab] = useState<'vets' | 'trainers' | 'boarding'>('vets');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Fetch cities when state changes
    useEffect(() => {
        if (selectedState && selectedState !== 'all') {
            setIsLoadingCities(true);
            fetch(route('api.cities.by-state', selectedState))
                .then((res) => res.json())
                .then((data) => {
                    setCities(data);
                    setIsLoadingCities(false);
                })
                .catch(() => {
                    setCities([]);
                    setIsLoadingCities(false);
                });
        } else {
            setCities([]);
            setSelectedCity('all');
        }
    }, [selectedState]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedState !== 'all') params.state_id = selectedState;
        if (selectedCity !== 'all') params.city_id = selectedCity;

        let targetRoute = 'directory.vets';
        if (category === 'trainers') targetRoute = 'directory.trainers';
        else if (category === 'boarding') targetRoute = 'directory.boarding';
        else if (category === 'welfare') targetRoute = 'directory.welfare';
        else if (category === 'pet-shops') targetRoute = 'directory.pet-shops';

        router.get(route(targetRoute), params);
    };

    const categories = [
        {
            id: 'vets',
            name: 'Veterinary Clinics & Trauma Care',
            icon: Stethoscope,
            href: route('directory.vets'),
            count: counts.vets,
            image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=800&auto=format&fit=crop',
            desc: 'Clinically verified multi-specialty hospitals, 24/7 trauma emergency care, and licensed veterinary physicians.',
            specialties: ['Emergency 24/7', 'Surgical Suites', 'Diagnostics', 'Preventive Care'],
        },
        {
            id: 'trainers',
            name: 'Certified Master Dog Trainers',
            icon: GraduationCap,
            href: route('directory.trainers'),
            count: counts.trainers,
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop',
            desc: 'Certified positive-reinforcement trainers, behavior modification consultants, and competition agility coaches.',
            specialties: ['Behavior Modification', 'Puppy Foundation', 'Obedience', 'K9 Agility'],
        },
        {
            id: 'boarding',
            name: 'Luxury Boarding & Daycare Retreats',
            icon: HomeIcon,
            href: route('directory.boarding'),
            count: counts.boarding,
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
            desc: 'Climate-controlled private suites, 24/7 live video monitoring, and bespoke exercise yards for peaceful stays.',
            specialties: ['Private Suites', '24/7 CCTV', 'Hydrotherapy', 'Supervised Play'],
        },
        {
            id: 'welfare',
            name: 'Rescue Sanctuaries & Welfare Trusts',
            icon: ShieldCheck,
            href: route('directory.welfare'),
            count: counts.welfare,
            image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=800&auto=format&fit=crop',
            desc: 'Verified non-profit organizations, rehabilitation centers, and rescue networks championing ethical adoption.',
            specialties: ['Shelter Adoption', 'Rehabilitation', 'Foster Care', 'Community Health'],
        },
        {
            id: 'pet-shops',
            name: 'Curated Pet Retail & Nutrition',
            icon: ShoppingBag,
            href: route('directory.pet-shops'),
            count: counts.petShops,
            image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800&auto=format&fit=crop',
            desc: 'Boutique retailers stocking premium biological diets, orthopedic bedding, supplements, and certified gear.',
            specialties: ['Ancestral Diets', 'Supplements', 'Orthopedic Beds', 'Boutique Gear'],
        },
    ];

    const verificationPillars = [
        {
            number: '01',
            title: 'Clinical & Licensing Audit',
            icon: FileCheck,
            desc: 'Direct credential verification with the Veterinary Council of India (VCI) and certified professional training boards.',
            checklist: ['Council License Verification', 'Board Certifications Check', 'Years of Verified Practice'],
        },
        {
            number: '02',
            title: 'Facility & Safety Standards',
            icon: Building2,
            desc: 'Audit of hospital sterilization systems, clean airflow ventilation, emergency oxygen protocols, and secured play yards.',
            checklist: ['Sterilization & Hygiene', 'Emergency Response Protocols', 'Secured & Monitored Grounds'],
        },
        {
            number: '03',
            title: 'Low-Stress & Ethical Handling',
            icon: HeartHandshake,
            desc: 'Strict adherence to Fear-Free clinical protocols, positive reinforcement behavioral methods, and gentle care ethics.',
            checklist: ['Fear-Free Handling', 'Positive Reinforcement Only', 'Humane Care Guarantee'],
        },
        {
            number: '04',
            title: 'Audited Reviews & Monitoring',
            icon: Star,
            desc: 'Continuous pet parent feedback tracking, verified owner reviews, and ongoing community safety compliance.',
            checklist: ['Verified Owner Reviews', 'Periodic Re-Inspection', 'Transparent Response Rates'],
        },
    ];

    const faqs = [
        {
            question: 'How are specialists verified before listing on WoofCircle?',
            answer: 'Every veterinary clinic, master trainer, and boarding facility goes through our rigorous 4-Pillar verification process. We cross-reference medical licensing with regulatory councils, audit facility sterilization standards, and verify positive handling protocols.',
        },
        {
            question: 'Can I book an appointment directly with listed specialists?',
            answer: 'Yes. Every verified profile allows you to book direct appointments, request consultation dates, or message practice directors directly with your companion’s health and training records attached.',
        },
        {
            question: 'How do I know if a veterinary clinic handles emergency trauma 24/7?',
            answer: 'Emergency and critical care facilities are distinguished with the "Emergency 24/7" badge on their profile cards and can be filtered instantly on the Veterinary directory search view.',
        },
        {
            question: 'Are you a licensed veterinarian or canine professional?',
            answer: 'You can claim or create your professional profile by clicking "Register Now" or "Join Directory Network". Once verified by our clinical audit team, your practice will receive the official Verified seal.',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Specialist Directory | Verified Vets, Trainers & Boarding | WoofCircle" />

            {/* --- HERO & INTERACTIVE SEARCH SECTION --- */}
            <section className="relative overflow-hidden border-b border-[#e8ded1] bg-gradient-to-b from-[#fcfbf9] via-white to-[#fcfbf9] pt-28 pb-16 lg:pt-36 lg:pb-20">
                {/* Subtle Luxury Pattern Layer */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#bb8b62_1px,transparent_1px)] [background-size:24px_24px]" />

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: '/' },
                            { title: 'Service Directory', href: route('directory.index') },
                        ]}
                        className="mb-8"
                    />

                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-woof-gold">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>The Premier Canine Professional Network</span>
                        </div>

                        <h1 className="text-woof-charcoal mt-6 text-4xl font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
                            Trusted <span className="text-woof-gold">Specialists</span> & Care.
                        </h1>

                        <p className="text-woof-charcoal/70 mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed sm:text-lg">
                            Access India’s premier circle of clinically verified veterinarians, certified master dog trainers, luxury boarding retreats, and ethical rescue sanctuaries.
                        </p>
                    </div>

                    {/* --- UNIFIED MULTI-FILTER SEARCH BAR --- */}
                    <div className="mx-auto mt-10 max-w-5xl">
                        <form
                            onSubmit={handleSearch}
                            className="bg-white border-[#e8ded1] hover:border-woof-gold/50 rounded-3xl border p-4 shadow-xl transition-all duration-300 sm:p-5"
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
                                {/* Search Keyword */}
                                <div className="relative lg:col-span-4">
                                    <Search className="text-woof-gold absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Clinic, Trainer, or Service name..."
                                        className="text-woof-charcoal placeholder:text-woof-charcoal/40 h-11 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 pr-4 text-xs font-medium focus:border-woof-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-woof-gold"
                                    />
                                </div>

                                {/* Category Select */}
                                <div className="lg:col-span-3">
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal h-11 w-full rounded-2xl text-xs font-medium focus:border-woof-gold focus:ring-woof-gold">
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#e8ded1] rounded-2xl shadow-xl">
                                            <SelectItem value="all">All Care Categories</SelectItem>
                                            <SelectItem value="vets">Veterinary Clinics</SelectItem>
                                            <SelectItem value="trainers">Dog Trainers</SelectItem>
                                            <SelectItem value="boarding">Boarding & Daycare</SelectItem>
                                            <SelectItem value="welfare">Welfare & Rescue</SelectItem>
                                            <SelectItem value="pet-shops">Pet Retail Stores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* State Select */}
                                <div className="lg:col-span-3">
                                    <Select value={selectedState} onValueChange={setSelectedState}>
                                        <SelectTrigger className="border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal h-11 w-full rounded-2xl text-xs font-medium focus:border-woof-gold focus:ring-woof-gold">
                                            <SelectValue placeholder="Select State / Region" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#e8ded1] max-h-60 rounded-2xl shadow-xl">
                                            <SelectItem value="all">All Regions</SelectItem>
                                            {states.map((st) => (
                                                <SelectItem key={st.id} value={st.id.toString()}>
                                                    {st.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search Button */}
                                <div className="lg:col-span-2">
                                    <Button
                                        type="submit"
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white h-11 w-full cursor-pointer rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-98"
                                    >
                                        <Search className="mr-1.5 h-3.5 w-3.5" />
                                        Find
                                    </Button>
                                </div>
                            </div>

                            {/* City Sub-row if State Selected */}
                            {selectedState !== 'all' && cities.length > 0 && (
                                <div className="border-[#e8ded1] mt-3 flex items-center gap-3 border-t pt-3">
                                    <span className="text-woof-charcoal/50 text-[11px] font-semibold uppercase">Filter City:</span>
                                    <div className="w-64">
                                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                                            <SelectTrigger className="border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal h-9 rounded-xl text-xs font-medium">
                                                <SelectValue placeholder="All Cities" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#e8ded1] max-h-48 rounded-xl">
                                                <SelectItem value="all">All Cities</SelectItem>
                                                {cities.map((ct) => (
                                                    <SelectItem key={ct.id} value={ct.id.toString()}>
                                                        {ct.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* --- STATS & TRUST METRICS STRIP --- */}
                    <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="bg-white border-[#e8ded1] rounded-2xl border p-4 text-center shadow-xs">
                            <p className="text-woof-gold text-2xl font-black tracking-tight sm:text-3xl">
                                {counts.total ? `${counts.total}+` : '2,500+'}
                            </p>
                            <p className="text-woof-charcoal/60 mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Verified Specialists
                            </p>
                        </div>
                        <div className="bg-white border-[#e8ded1] rounded-2xl border p-4 text-center shadow-xs">
                            <p className="text-woof-charcoal text-2xl font-black tracking-tight sm:text-3xl">100%</p>
                            <p className="text-woof-charcoal/60 mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Clinically Vetted
                            </p>
                        </div>
                        <div className="bg-white border-[#e8ded1] rounded-2xl border p-4 text-center shadow-xs">
                            <p className="text-woof-gold text-2xl font-black tracking-tight sm:text-3xl">40+</p>
                            <p className="text-woof-charcoal/60 mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Major Cities
                            </p>
                        </div>
                        <div className="bg-white border-[#e8ded1] rounded-2xl border p-4 text-center shadow-xs">
                            <p className="text-woof-charcoal text-2xl font-black tracking-tight sm:text-3xl">4.9 ★</p>
                            <p className="text-woof-charcoal/60 mt-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Client Satisfaction
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CATEGORY CARDS SECTION --- */}
            <section className="bg-white py-16 lg:py-24">
                <div className="container-wide px-6 lg:px-12">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold uppercase tracking-wider">Specialist Divisions</span>
                            </div>
                            <h2 className="text-woof-charcoal text-3xl font-black tracking-tight sm:text-4xl">
                                Explore Specialist Categories
                            </h2>
                        </div>
                        <p className="text-woof-charcoal/60 max-w-md text-xs sm:text-sm font-normal">
                            Direct connection to India's most reputable clinics, canine behavioral academies, and luxury pet retreats.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((cat) => {
                            const IconComponent = cat.icon;
                            return (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    className="group bg-white border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-2xl relative flex flex-col justify-between overflow-hidden rounded-3xl border shadow-xs transition-all duration-500 hover:-translate-y-1.5"
                                >
                                    {/* Card Image Header */}
                                    <div className="relative h-48 w-full overflow-hidden bg-woof-cream/40">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                        {/* Top Badge: Count */}
                                        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                            <span className="h-1.5 w-1.5 rounded-full bg-woof-gold" />
                                            <span>{cat.count}+ Available</span>
                                        </div>

                                        {/* Icon Floating Badge */}
                                        <div className="bg-woof-gold text-woof-charcoal absolute right-4 bottom-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110">
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                    </div>

                                    {/* Card Content Body */}
                                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 space-y-4">
                                        <div className="space-y-2.5">
                                            <h3 className="text-woof-charcoal group-hover:text-woof-gold text-xl font-bold tracking-tight capitalize transition-colors duration-300">
                                                {cat.name}
                                            </h3>
                                            <p className="text-woof-charcoal/70 text-xs font-normal leading-relaxed line-clamp-2">
                                                {cat.desc}
                                            </p>
                                        </div>

                                        {/* Sub-specialties Pills */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {cat.specialties.map((spec, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-[#fcfbf9] border-[#e8ded1] text-woof-charcoal/70 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Card Footer Link */}
                                        <div className="border-[#e8ded1] flex items-center justify-between border-t pt-4">
                                            <span className="text-woof-charcoal group-hover:text-woof-gold text-xs font-bold uppercase tracking-wider transition-colors">
                                                Explore Specialists
                                            </span>
                                            <div className="bg-woof-cream/60 group-hover:bg-woof-gold group-hover:text-woof-charcoal text-woof-gold flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300">
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* VIP PARTNER INVITATION CARD */}
                        <div className="group bg-woof-charcoal hover:border-woof-gold/60 hover:shadow-2xl relative flex flex-col justify-between overflow-hidden rounded-3xl border border-transparent p-7 text-white shadow-xl transition-all duration-500 hover:-translate-y-1.5">
                            {/* Subtle Background Art */}
                            <div className="pointer-events-none absolute inset-0 opacity-15 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-25">
                                <img
                                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop"
                                    alt="Partner"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="bg-woof-gold text-woof-charcoal flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform duration-500 group-hover:scale-110">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <span className="rounded-full border border-woof-gold/40 bg-woof-gold/15 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-woof-gold">
                                        Professional Network
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        Partner with <span className="text-woof-gold">WoofCircle</span>
                                    </h3>
                                    <p className="text-xs font-normal leading-relaxed text-white/70">
                                        Are you a licensed veterinarian, canine behaviorist, or luxury boarding director? Join India's most distinguished network of pet care professionals.
                                    </p>
                                </div>

                                <ul className="space-y-2 text-xs font-medium text-white/80">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="text-woof-gold h-4 w-4 shrink-0" /> Official Vetted Practice Badge
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="text-woof-gold h-4 w-4 shrink-0" /> Direct Client Inquiries & Bookings
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="text-woof-gold h-4 w-4 shrink-0" /> Priority City & Regional Visibility
                                    </li>
                                </ul>
                            </div>

                            <div className="relative z-10 mt-6 border-t border-white/10 pt-4">
                                <Link href={route('register')}>
                                    <Button className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-11 w-full cursor-pointer rounded-full bg-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-98">
                                        Register Your Practice
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LEADERBOARD ADVERTISEMENT BANNER --- */}
            <div className="container-wide px-6 lg:px-12">
                <DisplayAdBanner slot="header_leaderboard" className="my-6" />
            </div>

            {/* --- FEATURED SPOTLIGHT SPECIALISTS TABS --- */}
            <section className="bg-[#fcfbf9] border-t border-[#e8ded1] py-16 lg:py-24">
                <div className="container-wide px-6 lg:px-12">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold uppercase tracking-wider">Curated Discovery</span>
                            </div>
                            <h2 className="text-woof-charcoal text-3xl font-black tracking-tight sm:text-4xl">
                                Featured Verified Practices
                            </h2>
                        </div>

                        {/* Spotlight Category Switcher Tabs */}
                        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e8ded1] bg-white p-1.5 shadow-2xs">
                            <button
                                onClick={() => setSpotlightTab('vets')}
                                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    spotlightTab === 'vets'
                                        ? 'bg-woof-charcoal text-white shadow-xs'
                                        : 'text-woof-charcoal/70 hover:text-woof-charcoal hover:bg-woof-cream/40'
                                }`}
                            >
                                Veterinary ({counts.vets})
                            </button>
                            <button
                                onClick={() => setSpotlightTab('trainers')}
                                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    spotlightTab === 'trainers'
                                        ? 'bg-woof-charcoal text-white shadow-xs'
                                        : 'text-woof-charcoal/70 hover:text-woof-charcoal hover:bg-woof-cream/40'
                                }`}
                            >
                                Trainers ({counts.trainers})
                            </button>
                            <button
                                onClick={() => setSpotlightTab('boarding')}
                                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    spotlightTab === 'boarding'
                                        ? 'bg-woof-charcoal text-white shadow-xs'
                                        : 'text-woof-charcoal/70 hover:text-woof-charcoal hover:bg-woof-cream/40'
                                }`}
                            >
                                Boarding ({counts.boarding})
                            </button>
                        </div>
                    </div>

                    {/* Spotlight Grid */}
                    {spotlightTab === 'vets' && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredVets.length > 0 ? (
                                featuredVets.map((vet, idx) => (
                                    <DirectoryCard key={vet.id} item={vet} type="vet" idx={idx} view="grid" />
                                ))
                            ) : (
                                <div className="col-span-full rounded-3xl border border-[#e8ded1] bg-white p-12 text-center">
                                    <Stethoscope className="text-woof-gold/40 mx-auto h-12 w-12" />
                                    <h4 className="text-woof-charcoal mt-3 text-lg font-bold">Discover Top Veterinary Clinics</h4>
                                    <p className="text-woof-charcoal/60 mt-1 text-xs">Browse all verified clinics and trauma centers nationwide.</p>
                                    <Link href={route('directory.vets')} className="mt-4 inline-block">
                                        <Button className="bg-woof-charcoal text-white rounded-full px-6 text-xs font-bold uppercase">
                                            View All Vets
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {spotlightTab === 'trainers' && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredTrainers.length > 0 ? (
                                featuredTrainers.map((trainer, idx) => (
                                    <DirectoryCard key={trainer.id} item={trainer} type="trainer" idx={idx} view="grid" />
                                ))
                            ) : (
                                <div className="col-span-full rounded-3xl border border-[#e8ded1] bg-white p-12 text-center">
                                    <GraduationCap className="text-woof-gold/40 mx-auto h-12 w-12" />
                                    <h4 className="text-woof-charcoal mt-3 text-lg font-bold">Discover Master Dog Trainers</h4>
                                    <p className="text-woof-charcoal/60 mt-1 text-xs">Browse all certified behavioral coaches and obedience trainers.</p>
                                    <Link href={route('directory.trainers')} className="mt-4 inline-block">
                                        <Button className="bg-woof-charcoal text-white rounded-full px-6 text-xs font-bold uppercase">
                                            View All Trainers
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {spotlightTab === 'boarding' && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredBoarding.length > 0 ? (
                                featuredBoarding.map((resort, idx) => (
                                    <DirectoryCard key={resort.id} item={resort} type="boarding" idx={idx} view="grid" />
                                ))
                            ) : (
                                <div className="col-span-full rounded-3xl border border-[#e8ded1] bg-white p-12 text-center">
                                    <HomeIcon className="text-woof-gold/40 mx-auto h-12 w-12" />
                                    <h4 className="text-woof-charcoal mt-3 text-lg font-bold">Discover Luxury Boarding Retreats</h4>
                                    <p className="text-woof-charcoal/60 mt-1 text-xs">Browse all private suite boarding resorts and daycare centers.</p>
                                    <Link href={route('directory.boarding')} className="mt-4 inline-block">
                                        <Button className="bg-woof-charcoal text-white rounded-full px-6 text-xs font-bold uppercase">
                                            View All Boarding
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href={
                                spotlightTab === 'vets'
                                    ? route('directory.vets')
                                    : spotlightTab === 'trainers'
                                    ? route('directory.trainers')
                                    : route('directory.boarding')
                            }
                        >
                            <Button className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white h-12 rounded-full px-8 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md">
                                Explore All {spotlightTab === 'vets' ? 'Veterinary Clinics' : spotlightTab === 'trainers' ? 'Dog Trainers' : 'Boarding Resorts'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 4-PILLAR CLINICAL & ETHICAL VERIFICATION FRAMEWORK --- */}
            <section className="bg-white border-t border-[#e8ded1] py-20 lg:py-28">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-woof-gold">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Clinical Governance & Safety Standards</span>
                        </div>
                        <h2 className="text-woof-charcoal mt-4 text-3xl font-black tracking-tight uppercase sm:text-4xl lg:text-5xl">
                            Uncompromising Standards for <span className="text-woof-gold">Elite Pros</span>
                        </h2>
                        <p className="text-woof-charcoal/70 mt-3 text-sm sm:text-base font-normal leading-relaxed">
                            Every specialist on WoofCircle is vetted through our comprehensive 4-Pillar clinical and ethical audit framework to ensure animal safety, clinical excellence, and absolute integrity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {verificationPillars.map((pillar) => {
                            const PillarIcon = pillar.icon;
                            return (
                                <div
                                    key={pillar.number}
                                    className="group bg-[#fcfbf9] border-[#e8ded1] hover:border-woof-gold/50 hover:bg-white hover:shadow-xl relative flex flex-col justify-between rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1.5"
                                >
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div className="bg-white border border-[#e8ded1] text-woof-gold group-hover:bg-woof-charcoal group-hover:text-woof-gold flex h-12 w-12 items-center justify-center rounded-2xl shadow-2xs transition-all duration-300">
                                                <PillarIcon className="h-6 w-6" />
                                            </div>
                                            <span className="text-woof-charcoal/25 group-hover:text-woof-gold text-2xl font-black tracking-tight transition-colors duration-300">
                                                {pillar.number}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-woof-charcoal text-lg font-bold tracking-tight">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-woof-charcoal/70 text-xs font-normal leading-relaxed">
                                                {pillar.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-[#e8ded1] mt-6 border-t pt-4 space-y-1.5">
                                        {pillar.checklist.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-woof-charcoal/80">
                                                <CheckCircle2 className="text-woof-gold h-3 w-3 shrink-0" />
                                                <span className="truncate">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- FREQUENTLY ASKED QUESTIONS SECTION --- */}
            <section className="bg-[#fcfbf9] border-t border-[#e8ded1] py-16 lg:py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mx-auto max-w-3xl">
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center gap-3">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold uppercase tracking-wider">Care Concierge Help</span>
                                <div className="bg-woof-gold h-px w-8" />
                            </div>
                            <h2 className="text-woof-charcoal mt-3 text-3xl font-black tracking-tight">
                                Specialist Directory FAQs
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white border-[#e8ded1] overflow-hidden rounded-2xl border shadow-xs transition-all duration-300"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                                        >
                                            <span className="text-woof-charcoal text-sm font-bold tracking-tight pr-4">
                                                {faq.question}
                                            </span>
                                            <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e8ded1] transition-transform duration-300 ${
                                                    isOpen ? 'rotate-90 bg-woof-gold text-woof-charcoal border-woof-gold' : 'text-woof-charcoal/50 bg-[#fcfbf9]'
                                                }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="border-[#e8ded1] border-t bg-[#fcfbf9] p-5 pt-4">
                                                <p className="text-woof-charcoal/75 text-xs sm:text-sm font-normal leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
