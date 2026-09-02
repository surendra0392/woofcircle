import ArticleCard from '@/components/articles/ArticleCard';
import BreedCard from '@/components/public/breed-card';
import LitterCard from '@/components/public/litter-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { Article, Breed, City, CommunityGallery, Litter, SharedData, State } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import SeoHead from '@/components/SeoHead';
import { ArrowRight, Award, Bone, Home, Dog, GraduationCap, Heart, Home as HomeIcon, PawPrint, QrCode, Search, ShieldCheck, ShoppingBag, Sparkles, Stethoscope, Clock, User, Star, CheckCircle2, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import PetPassportCard from '@/components/pets/PetPassportCard';

function CountUp({ end, duration = 1500, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration]);

    return (
        <span className="font-sans text-3xl font-black tracking-tight text-woof-charcoal">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

interface PageProps {
    litters: Litter[];
    breeds: Breed[];
    gallery?: CommunityGallery[];
    states: State[];
    articles?: Article[];
}
export default function HomePage({ litters, breeds, states, articles = [] }: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [category, setCategory] = useState('puppies');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    useEffect(() => {
        if (selectedState && selectedState !== 'all') {
            setIsLoadingCities(true);
            fetch(route('api.cities.by-state', selectedState))
                .then((res) => res.json())
                .then((data) => {
                    setCities(data);
                    setIsLoadingCities(false);
                });
        } else {
            setCities([]);
            setSelectedCity('all');
        }
    }, [selectedState]);
    const handleSearch = () => {
        const params: Record<string, string> = { search: searchTerm };
        if (selectedState !== 'all') params.state_id = selectedState;
        if (selectedCity !== 'all') params.city_id = selectedCity;
        let targetRoute = 'marketplace.index';
        if (category === 'vets') targetRoute = 'directory.vets';
        if (category === 'trainers') targetRoute = 'directory.trainers';
        if (category === 'boarding') targetRoute = 'directory.boarding';
        if (category === 'pet-shops') targetRoute = 'directory.pet-shops';
        if (category === 'welfare') targetRoute = 'directory.welfare';
        window.location.href = route(targetRoute, params);
    };

    const defaultMockArticles = [
        {
            slug: 'canine-nutrition',
            category: 'Nutrition & Wellness',
            readTime: '5 min read',
            title: 'The Architecture of Canine Nutrition',
            excerpt: 'A deep dive into custom ancestral formulations and botanical additions suited for high-energy lineages.',
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop',
            isMock: true,
        },
        {
            slug: 'luxury-travel',
            category: 'Luxury Travel',
            readTime: '4 min read',
            title: 'Travel Redefined: Stays of Distinction',
            excerpt: 'A curated review of six-star boarding retreats and private jet travel accommodations for modern companions.',
            image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=600&auto=format&fit=crop',
            isMock: true,
        },
        {
            slug: 'canine-genetics',
            category: 'Canine Genetics',
            readTime: '7 min read',
            title: 'Understanding Lineage: The Genetic Tapestry',
            excerpt: 'How genome tracing and predictive breed diagnostics safeguard pedigree legacy and companion longevity.',
            image: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=600&auto=format&fit=crop',
            isMock: true,
        },
        {
            slug: 'behavioral-mastery',
            category: 'Dog Training',
            readTime: '6 min read',
            title: 'The Art of K9 Behavioral Mastery',
            excerpt: 'Modern positive reinforcement methodologies and neurological communication patterns in working canines.',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop',
            isMock: true,
        },
    ];

    const displayArticles = (articles && articles.length > 0)
        ? articles.slice(0, 4).map(art => {
            const wordCount = art.content?.split(/\s+/).length || 150;
            const readTime = Math.ceil(wordCount / 200) + ' min read';
            return {
                slug: art.slug,
                category: art.category?.name || 'Insights',
                readTime: readTime,
                title: art.title,
                excerpt: art.excerpt || (art.content ? art.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : ''),
                image: art.image_url || art.featured_image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop',
                author: art.author?.name || 'WoofCircle Editor',
                isMock: false,
            };
        })
        : defaultMockArticles.map(a => ({...a, author: 'WoofCircle Editor'}));

    return (
        <PublicLayout>
            <SeoHead title="Woof Circle | The Ultimate Pet Platform" />
            <section className="bg-woof-pearl/5 relative overflow-hidden pt-32 pb-20 lg:pt-32 lg:pb-16">
                <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        <div className="max-w-2xl space-y-10">
                            <div className="space-y-6">
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-woof-gold/10 border border-woof-gold/30 text-woof-gold text-[10px] font-black tracking-[0.25em] uppercase rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xs"
                                    style={{ animationDelay: '100ms', animationFillMode: 'both' }}
                                >
                                    <Sparkles className="w-3 h-3 text-woof-gold" />
                                    The Standard for Premium Pet Care
                                </div>
                                <h1
                                    className="text-woof-charcoal mt-4 font-sans text-4xl leading-[1.1] font-black tracking-tight uppercase lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000"
                                    style={{ animationDelay: '250ms', animationFillMode: 'both' }}
                                >
                                    Discover Excellence <br /> <span className="font-sans font-normal text-woof-gold lowercase tracking-normal">in every detail.</span>
                                </h1>
                                <p
                                    className="text-md text-woof-charcoal/60 max-w-xl leading-relaxed font-normal tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000"
                                    style={{ animationDelay: '400ms', animationFillMode: 'both' }}
                                >
                                    A curated sanctuary connecting discerning owners with world-class breeders, verified clinical experts, and a community of distinction.
                                </p>
                            </div>
                            <div
                                className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000"
                                style={{ animationDelay: '550ms', animationFillMode: 'both' }}
                            >
                                <div className="group flex flex-col items-center gap-2 border border-[#e8ded1] bg-white rounded-3xl sm:rounded-full p-2 pl-5 shadow-md transition-all focus-within:border-woof-gold focus-within:shadow-xl sm:flex-row">
                                    <div className="flex w-full flex-1 items-center gap-3">
                                        <Search className="text-woof-charcoal/40 group-focus-within:text-woof-gold h-5 w-5 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder={`Search for ${category === 'puppies' ? 'breeds or litters' : category}...`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="text-woof-charcoal placeholder:text-woof-charcoal/40 w-full border-none bg-transparent px-0 font-sans text-sm font-medium outline-none focus:ring-0"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="text-woof-charcoal/70 hover:text-woof-gold flex shrink-0 cursor-pointer items-center gap-1.5 transition-colors px-3 py-2 rounded-full hover:bg-woof-cream/60"
                                    >
                                        <span className="text-[10px] font-bold tracking-wider uppercase">Filters</span>
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="bg-woof-charcoal hover:bg-woof-gold text-white shrink-0 cursor-pointer rounded-full px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-xs"
                                    >
                                        Explore
                                    </button>
                                </div>
                                {isFilterOpen && (
                                    <div className="animate-in fade-in slide-in-from-top-4 mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 bg-white p-5 rounded-2xl border border-[#e8ded1] shadow-xs">
                                        <div className="space-y-2">
                                            <label className="text-woof-charcoal/50 font-sans text-[10px] font-bold tracking-wider uppercase">
                                                Discovering
                                            </label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger className="h-10 rounded-xl border border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs font-medium text-woof-charcoal focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-[#e8ded1] shadow-xl">
                                                    <SelectItem value="puppies">Puppy Litters</SelectItem>
                                                    <SelectItem value="vets">Medical Clinics</SelectItem>
                                                    <SelectItem value="trainers">Master Trainers</SelectItem>
                                                    <SelectItem value="pet-shops">Luxury Boutiques</SelectItem>
                                                    <SelectItem value="boarding">Grand Boarding</SelectItem>
                                                    <SelectItem value="welfare">Welfare & Rescue</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-woof-charcoal/50 font-sans text-[10px] font-bold tracking-wider uppercase">
                                                State / Region
                                            </label>
                                            <Select value={selectedState} onValueChange={setSelectedState}>
                                                <SelectTrigger className="h-10 rounded-xl border border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs font-medium text-woof-charcoal focus:ring-0">
                                                    <SelectValue placeholder="All States" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-64 rounded-xl border-[#e8ded1] shadow-xl">
                                                    <SelectItem value="all">National Search</SelectItem>
                                                    {states.map((s) => (
                                                        <SelectItem key={s.id} value={s.id.toString()}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-woof-charcoal/50 font-sans text-[10px] font-bold tracking-wider uppercase">
                                                City
                                            </label>
                                            <Select
                                                value={selectedCity}
                                                onValueChange={setSelectedCity}
                                                disabled={selectedState === 'all' || isLoadingCities}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl border border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs font-medium text-woof-charcoal focus:ring-0">
                                                    <SelectValue placeholder={isLoadingCities ? 'Syncing...' : 'All Cities'} />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-64 rounded-xl border-[#e8ded1] shadow-xl">
                                                    <SelectItem value="all">All Cities</SelectItem>
                                                    {cities.map((c) => (
                                                        <SelectItem key={c.id} value={c.id.toString()}>
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Statistics Row */}
                            <div
                                className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/60 lg:hidden animate-in fade-in slide-in-from-bottom-6 duration-1000"
                                style={{ animationDelay: '700ms', animationFillMode: 'both' }}
                            >
                                <div className="space-y-1">
                                    <h4 className="text-woof-charcoal font-sans text-xl font-black"><CountUp end={2300} suffix="+" /></h4>
                                    <p className="text-[8px] font-bold tracking-widest text-woof-charcoal/40 uppercase">Adopted</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-woof-charcoal font-sans text-xl font-black">Verified</h4>
                                    <p className="text-[8px] font-bold tracking-widest text-woof-charcoal/40 uppercase">Vets Network</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-woof-charcoal font-sans text-xl font-black"><CountUp end={100} suffix="%" /></h4>
                                    <p className="text-[8px] font-bold tracking-widest text-woof-charcoal/40 uppercase">Audited Health</p>
                                </div>
                            </div>
                        </div>

                        {/* Staggered 4-Image Collage (Absolute positioning in relative wrapper) */}
                        <div className="relative hidden h-[620px] w-full lg:block">
                            {/* Inline floats keyframe helper */}
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                @keyframes float-slow {
                                    0%, 100% { transform: translateY(0px); }
                                    50% { transform: translateY(-10px); }
                                }
                                @keyframes float-delayed {
                                    0%, 100% { transform: translateY(0px); }
                                    50% { transform: translateY(-10px); }
                                }
                                .animate-float-slow {
                                    animation: float-slow 5s ease-in-out infinite;
                                }
                                .animate-float-delayed {
                                    animation: float-delayed 5s ease-in-out infinite;
                                    animation-delay: 2.5s;
                                }
                            `}} />

                            <div className="relative h-full w-full">
                                {/* Image 1: Top Left - Puppy / Heritage */}
                                <div
                                    className="absolute top-[4%] left-0 w-[48%] aspect-[3/4] overflow-hidden rounded-3xl border border-[#e8ded1] bg-woof-cream shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:z-30 hover:border-woof-gold/50 group animate-in fade-in slide-in-from-bottom-8 duration-1000"
                                    style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600&auto=format&fit=crop"
                                        alt="Verified Heritage Puppy"
                                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-woof-charcoal/90 via-woof-charcoal/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-[9px] font-bold tracking-wider uppercase">Verified Heritage</p>
                                    </div>
                                </div>

                                {/* Image 2: Top Right - Majestic Companion */}
                                <div
                                    className="absolute top-[12%] right-0 w-[42%] aspect-[4/5] overflow-hidden rounded-3xl border border-[#e8ded1] bg-woof-cream shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:z-30 hover:border-woof-gold/50 group animate-in fade-in slide-in-from-bottom-8 duration-1000"
                                    style={{ animationDelay: '400ms', animationFillMode: 'both' }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=600&auto=format&fit=crop"
                                        alt="Elite Kennels"
                                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-woof-charcoal/90 via-woof-charcoal/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-[9px] font-bold tracking-wider uppercase">Elite Kennels</p>
                                    </div>
                                </div>

                                {/* Image 3: Bottom Left - Groomed Companion */}
                                <div
                                    className="absolute bottom-[8%] left-[6%] w-[38%] aspect-[1/1] overflow-hidden rounded-3xl border border-[#e8ded1] bg-woof-cream shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:z-30 hover:border-woof-gold/50 group animate-in fade-in slide-in-from-bottom-8 duration-1000"
                                    style={{ animationDelay: '600ms', animationFillMode: 'both' }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop"
                                        alt="Luxury Lifestyle"
                                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-woof-charcoal/90 via-woof-charcoal/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-[9px] font-bold tracking-wider uppercase">Luxury Lifestyle</p>
                                    </div>
                                </div>

                                {/* Image 4: Bottom Right - Portrait */}
                                <div
                                    className="absolute bottom-0 right-[4%] w-[44%] aspect-[3/4] overflow-hidden rounded-3xl border border-[#e8ded1] bg-woof-cream shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:z-30 hover:border-woof-gold/50 group animate-in fade-in slide-in-from-bottom-8 duration-1000"
                                    style={{ animationDelay: '800ms', animationFillMode: 'both' }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop"
                                        alt="Pure Breed Legacy"
                                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-woof-charcoal/90 via-woof-charcoal/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-[9px] font-bold tracking-wider uppercase">Pure Breed Legacy</p>
                                    </div>
                                </div>

                                {/* Floating Stat Card 1: Top Right */}
                                <div
                                    className="absolute top-[9%] right-[-2%] z-40 bg-white/95 backdrop-blur-md border border-[#e8ded1] py-2.5 px-4 flex items-center gap-3.5 shadow-xl rounded-2xl animate-float-slow select-none transition-all duration-300 hover:border-woof-gold/50 animate-in fade-in zoom-in-95 duration-1000"
                                    style={{ animationDelay: '1000ms', animationFillMode: 'both' }}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-woof-gold/15 text-woof-gold flex items-center justify-center shrink-0">
                                        <Stethoscope className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-xs font-bold uppercase text-woof-charcoal leading-none">Verified Vets</h4>
                                        <p className="text-[8px] font-semibold uppercase tracking-wider text-woof-charcoal/50 mt-1 leading-none">Trusted Partners</p>
                                    </div>
                                </div>

                                {/* Floating Stat Card 2: Bottom Left */}
                                <div
                                    className="absolute bottom-[40%] left-[-6%] z-40 bg-white/95 backdrop-blur-md border border-[#e8ded1] py-2.5 px-4 flex items-center gap-3.5 shadow-xl rounded-2xl animate-float-delayed select-none transition-all duration-300 hover:border-woof-gold/50 animate-in fade-in zoom-in-95 duration-1000"
                                    style={{ animationDelay: '1200ms', animationFillMode: 'both' }}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                        <Heart className="w-4 h-4 fill-rose-500 stroke-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-xs font-bold uppercase text-woof-charcoal leading-none">
                                            <CountUp end={2300} suffix="+" /> Adopted
                                        </h4>
                                        <p className="text-[8px] font-semibold uppercase tracking-wider text-woof-charcoal/50 mt-1 leading-none">This Year</p>
                                    </div>
                                </div>

                                {/* Floating Stat Card 3: Middle Right */}
                                <div
                                    className="absolute top-[75%] right-[-6%] z-40 bg-white/95 backdrop-blur-md border border-[#e8ded1] py-2.5 px-4 flex items-center gap-3.5 shadow-xl rounded-2xl animate-float-slow select-none transition-all duration-300 hover:border-woof-gold/50 animate-in fade-in zoom-in-95 duration-1000"
                                    style={{ animationDelay: '800ms', animationFillMode: 'both' }}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-woof-gold text-white flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-xs font-bold uppercase text-woof-charcoal leading-none">
                                            <CountUp end={100} suffix="%" /> Audited
                                        </h4>
                                        <p className="text-[8px] font-semibold uppercase tracking-wider text-woof-charcoal/50 mt-1 leading-none">Health Assured</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By / Feature Highlights Row */}
            <section className="bg-woof-charcoal border-y border-white/10 py-14">
                <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                    <span
                        className="text-woof-cream/90 text-xs font-bold tracking-widest uppercase text-center block mb-10 animate-in fade-in duration-1000"
                        style={{ animationDelay: '100ms', animationFillMode: 'both' }}
                    >
                        Trusted by Thousands of Pet Lovers & Families
                    </span>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-6 sm:grid-cols-3 lg:grid-cols-6 justify-items-center">
                        {[
                            { label: 'Certified Vets', icon: Stethoscope },
                            { label: 'Loving Care', icon: Heart },
                            { label: '100% Safe', icon: ShieldCheck },
                            { label: 'Pet First', icon: PawPrint },
                            { label: 'Award Winning', icon: Award },
                            { label: 'Premium Service', icon: Sparkles },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-col items-center select-none animate-in fade-in slide-in-from-bottom-4 duration-700 transition-all hover:-translate-y-1.5 cursor-pointer"
                                style={{
                                    animationDelay: `${idx * 100 + 200}ms`,
                                    animationFillMode: 'both',
                                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    transitionDuration: '500ms'
                                }}
                            >
                                <div
                                    className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl text-woof-gold transition-all group-hover:bg-woof-gold group-hover:text-woof-charcoal group-hover:scale-105 group-hover:shadow-md group-hover:border-woof-gold"
                                    style={{
                                        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        transitionDuration: '500ms'
                                    }}
                                >
                                    <item.icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                                </div>
                                <span className="mt-3 text-[10px] font-bold tracking-wider text-woof-cream/80 uppercase text-center group-hover:text-woof-gold transition-all duration-300">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-32">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div className="max-w-2xl space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold tracking-[0.4em] uppercase">The Registry</span>
                            </div>
                            <h2 className="text-woof-charcoal text-4xl leading-none font-bold tracking-normal uppercase lg:text-4xl">
                                Elite <span className="text-woof-gold uppercase">Collections.</span>
                            </h2>
                        </div>
                        <Link
                            href={route('marketplace.index')}
                            className="text-woof-charcoal hover:text-woof-gold border-woof-charcoal hover:border-woof-gold inline-flex items-center gap-3 border-b pb-2 text-[10px] font-black tracking-[0.2em] uppercase transition-colors"
                        >
                            Browse All Litters <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {litters.map((litter) => (
                            <LitterCard key={litter.id} litter={litter} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-white py-24 border-b border-woof-pearl/30 relative border-t">
                <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="text-center space-y-6 mb-16">
                        <span className="inline-flex items-center justify-center px-4 py-1.5 bg-woof-gold/10 text-woof-gold text-[11px] font-black tracking-widest uppercase rounded-full border border-woof-gold/20">
                            How it works
                        </span>
                        <h2 className="text-woof-charcoal text-4xl font-sans font-black tracking-wide uppercase leading-none lg:text-4xl">
                            Simple, kind & <br className="sm:hidden" /> <span className="text-woof-gold">tail-wagging</span> easy
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Horizontal dashed line connecting steps on desktop */}
                        <div className="hidden lg:block absolute top-16 left-[16%] right-[16%] h-px border-t-2 border-dashed border-woof-gold/20 z-0" />

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative z-10">
                            {[
                                {
                                    step: '01',
                                    title: 'Choose a dog or service',
                                    desc: 'Browse adorable pups or pick from grooming, vet care, and training services.',
                                    icon: Dog,
                                },
                                {
                                    step: '02',
                                    title: 'Connect with the provider',
                                    desc: 'Chat directly with adoption centers or trusted local pet professionals.',
                                    icon: PawPrint,
                                },
                                {
                                    step: '03',
                                    title: 'Bring happiness home',
                                    desc: 'Welcome your new family member or enjoy premium care at your doorstep.',
                                    icon: Home,
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group bg-white border border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl p-8 sm:p-10 flex flex-col items-center text-center space-y-5 rounded-3xl shadow-xs transition-all duration-500 hover:-translate-y-1.5"
                                >
                                    {/* Icon Container */}
                                    <div className="w-18 h-18 bg-woof-cream/60 border border-[#e8ded1] text-woof-gold group-hover:bg-woof-gold group-hover:text-woof-charcoal group-hover:border-woof-gold flex items-center justify-center relative rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-2xs">
                                        <div className="w-6 h-6 rounded-full bg-woof-charcoal text-white text-[10px] font-bold flex items-center justify-center absolute -top-1.5 -right-1.5 border-2 border-white shadow-xs transition-colors duration-300 group-hover:bg-woof-charcoal group-hover:text-woof-gold">
                                            {item.step}
                                        </div>
                                        {item.icon && <item.icon className="w-7 h-7 transition-colors duration-300" />}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h4 className="text-woof-charcoal font-sans text-lg font-bold uppercase tracking-wide group-hover:text-woof-gold transition-colors duration-300">
                                            {item.title}
                                        </h4>
                                        <p className="text-woof-charcoal/60 text-xs leading-relaxed font-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-woof-charcoal py-20 text-white lg:py-24">
                <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        <div className="relative w-full aspect-[1/1] group/heritage select-none">
                            {/* Decorative Background Offset Frame */}
                            <div className="absolute top-[4%] left-[4%] w-[62%] h-[78%] border border-woof-gold/20 rounded-3xl z-0 pointer-events-none" />

                            {/* Main Background Image Card */}
                            <div className="absolute top-0 left-0 w-[62%] h-[78%] overflow-hidden rounded-3xl border border-white/10 bg-gray-900 shadow-xl transition-all duration-500 group-hover/heritage:scale-[1.01] group-hover/heritage:border-woof-gold/40 z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?q=80&w=1000&auto=format&fit=crop"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover/heritage:scale-105"
                                    alt="Verified Heritage"
                                />
                            </div>

                            {/* Overlapping Foreground Card */}
                            <div
                                className="absolute bottom-[5%] right-0 w-[46%] aspect-[1/1] overflow-hidden rounded-3xl border border-white/15 bg-woof-cream shadow-2xl transition-all duration-500 group-hover/heritage:translate-x-[6px] group-hover/heritage:translate-y-[6px] group-hover/heritage:scale-[1.02] group-hover/heritage:border-woof-gold z-20"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600&auto=format&fit=crop"
                                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover/heritage:scale-105"
                                    alt="Breeder Heritage Detail"
                                />
                            </div>

                            {/* Floating Lineage Seal Badge */}
                            <div
                                className="absolute bottom-[24%] right-[34%] z-30 bg-white border border-[#e8ded1] py-2.5 px-3.5 shadow-xl rounded-2xl transition-all duration-500 select-none border-t-2 border-t-woof-gold group-hover/heritage:-translate-x-[6px] group-hover/heritage:translate-y-[-6px] group-hover/heritage:scale-[1.05]"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-woof-gold/15 text-woof-gold flex items-center justify-center shrink-0">
                                        <Award className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-[9px] font-bold uppercase text-woof-charcoal leading-none">Lineage Seal</h4>
                                        <p className="text-[7px] font-semibold uppercase tracking-wider text-woof-charcoal/50 mt-0.5 leading-none">100% Certified</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rotated Vertical Branding Tag */}
                            <div className="absolute bottom-[10%] left-[-3%] flex items-center select-none rotate-[-90deg] origin-left translate-y-full text-woof-pearl/40">
                                <span className="text-[8px] font-bold tracking-[0.3em] uppercase">WOOFCIRCLE pedigree registry</span>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-bold tracking-widest uppercase">The Pedigree</span>
                                </div>
                                <h2 className="text-3xl leading-tight font-bold text-white uppercase lg:text-4xl tracking-wide">
                                    Verified Heritage & <br /> <span className="text-woof-gold">Ethical Lineage.</span>
                                </h2>
                                <p className="text-woof-on-dark/70 max-w-xl text-sm tracking-wide leading-relaxed font-normal">
                                    Our breeders are custodians of history. Every kennel undergoes rigorous verification covering lineage, health
                                    protocols, and environmental standards.
                                </p>
                            </div>
                            <div className="grid gap-6 pt-2 sm:grid-cols-2">
                                <div className="space-y-2.5">
                                    <ShieldCheck className="text-woof-gold h-5 w-5" />
                                    <h4 className="font-sans text-base font-bold tracking-wide text-white uppercase">Genetic Assurance</h4>
                                    <p className="text-woof-on-dark/60 text-xs leading-relaxed font-normal">
                                        Immutable tracking for every premium litter, ensuring authenticity.
                                    </p>
                                </div>
                                <div className="space-y-2.5">
                                    <ShieldCheck className="text-woof-gold h-5 w-5" />
                                    <h4 className="font-sans text-base font-bold tracking-wide text-white uppercase">Elite Ethics</h4>
                                    <p className="text-woof-on-dark/60 text-xs leading-relaxed font-normal">
                                        Strict adherence to global kennel club welfare standards.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href={route('marketplace.breeders.index')}
                                    className="bg-woof-gold hover:bg-white text-woof-charcoal inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-xs cursor-pointer"
                                >
                                    Explore Kennels <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Pet Passport & QR Verification Showcase Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0e0d0a] via-[#14120e] to-[#0e0d0a] py-24 lg:py-32 text-white">
                {/* Rich Ambient Background Layers */}
                <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 rounded-full bg-woof-gold/8 blur-[180px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-woof-champagne/8 blur-[150px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[800px] rounded-full bg-woof-gold/5 blur-[200px] pointer-events-none" />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(187,139,98,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
                    {/* Section Header — Centered */}
                    <div className="text-center mb-16 lg:mb-20 space-y-5">
                        <div className="inline-flex items-center gap-2.5 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-5 py-2 backdrop-blur-md mx-auto">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-woof-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-woof-gold"></span>
                            </span>
                            <span className="text-woof-gold text-[10px] font-black tracking-[0.3em] uppercase">
                                Digital Pet Passport & QR Identity
                            </span>
                        </div>

                        <h2 className="font-sans text-3xl sm:text-4xl lg:text-[3.25rem] font-black leading-[1.1] text-white uppercase tracking-normal">
                            Cryptographic Identity. <br />
                            <span className="text-woof-gold">Instant QR Verification.</span>
                        </h2>

                        <p className="text-white/60 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                            Every canine registered on WoofCircle receives an immutable 15-character Digital Passport ID
                            (e.g. <span className="text-woof-gold font-mono font-bold">WCTG 1578 5792 57985</span>). Embedded with dynamic QR
                            cryptographic verification — veterinarians, boarding facilities, and guardians can instantly inspect
                            verified health dossiers, lineage pedigree, and vaccination clearance from any smartphone.
                        </p>
                    </div>

                    <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
                        {/* Left Column: Interactive Passport Showcase */}
                        <div className="lg:col-span-7 flex flex-col items-center justify-center order-2 lg:order-1">
                            <div className="relative w-full max-w-xl">
                                {/* Multi-layer radial back glow */}
                                <div className="absolute -inset-6 bg-woof-gold/10 rounded-[2rem] blur-3xl -z-10 pointer-events-none" />
                                <div className="absolute -inset-2 bg-woof-champagne/5 rounded-3xl blur-xl -z-10 pointer-events-none" />

                                <div className="transition-transform duration-700 hover:scale-[1.02]">
                                    <PetPassportCard
                                        pet={{
                                            id: 1,
                                            name: 'Aurelia Duchess of Kent',
                                            passport_number: 'WCTG 8614 4813 4954',
                                            gender: 'female',
                                            date_of_birth: '2024-02-14',
                                            color: 'Rich Golden Amber',
                                            profile_image_url:
                                                'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
                                            is_champion: true,
                                            breed: { id: 1, name: 'Golden Retriever' },
                                        }}
                                    />
                                </div>

                                {/* Floating Trust Badge - Top Left */}
                                <div className="absolute -top-4 -left-3 sm:-left-5 bg-woof-charcoal/90 backdrop-blur-xl border border-woof-gold/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl animate-float-slow">
                                    <div className="w-9 h-9 rounded-xl bg-woof-gold/20 border border-woof-gold/40 text-woof-gold flex items-center justify-center">
                                        <ShieldCheck className="h-4.5 w-4.5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-white uppercase tracking-wider">Verified Registry</span>
                                        <span className="block text-[9px] text-white/50">Tamper-Proof Identity</span>
                                    </div>
                                </div>

                                {/* Floating Scan Badge - Right Center (between Official Registry & Champion) */}
                                <div className="absolute top-[38%] -translate-y-1/2 -right-3 sm:-right-6 bg-woof-charcoal/90 backdrop-blur-xl border border-woof-gold/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                                        <QrCode className="h-4.5 w-4.5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-white uppercase tracking-wider">Instant Scan</span>
                                        <span className="block text-[9px] text-emerald-400/80">Verify in 2 seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Features & CTA */}
                        <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
                            {/* Feature Cards — Stacked with numbering */}
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: Award,
                                        title: 'State-Coded Unique ID',
                                        desc: 'Standardized WC-prefix state identifier code with a 12-digit random cryptographic checksum for absolute uniqueness.',
                                        num: '01',
                                    },
                                    {
                                        icon: QrCode,
                                        title: 'Instant QR Scan',
                                        desc: 'Scan the passport QR code to instantly resolve verified health dossiers, ownership records, and medical history.',
                                        num: '02',
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: 'Verified Medical Logs',
                                        desc: 'Direct synchronization with authorized veterinary clinics for real-time vaccination tracking and health alerts.',
                                        num: '03',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Pedigree Lineage Seal',
                                        desc: 'Immutable lineage certification tracing ancestry to certified kennel club champions with DNA verification.',
                                        num: '04',
                                    },
                                ].map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-woof-gold/30 p-5 sm:p-6 transition-all duration-400 backdrop-blur-xs flex gap-4 items-start"
                                    >
                                        {/* Number indicator */}
                                        <span className="text-woof-gold/20 text-2xl font-black font-mono leading-none shrink-0 pt-0.5 group-hover:text-woof-gold/40 transition-colors">
                                            {feat.num}
                                        </span>
                                        <div className="space-y-2 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-woof-gold/15 text-woof-gold border border-woof-gold/25 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-woof-gold group-hover:text-woof-charcoal group-hover:border-woof-gold">
                                                    <feat.icon className="h-4 w-4" />
                                                </div>
                                                <h4 className="text-[11px] font-bold tracking-wider uppercase text-white group-hover:text-woof-gold transition-colors">
                                                    {feat.title}
                                                </h4>
                                            </div>
                                            <p className="text-white/50 text-xs leading-relaxed font-normal">
                                                {feat.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Actions */}
                            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                                <Link
                                    href={route('pets.passport.index')}
                                    className="group bg-woof-gold hover:bg-woof-champagne text-woof-charcoal inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black tracking-[0.2em] uppercase shadow-xl shadow-woof-gold/10 hover:shadow-woof-gold/25 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <QrCode className="h-4 w-4" />
                                    <span>Verification Portal</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Public Registry Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#FAF7F2] py-20 lg:py-28 border-y border-[#e8ded1]/60 relative overflow-hidden">
                {/* Subtle ambient luxury light */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-woof-gold/5 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-2xl space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold tracking-[0.4em] uppercase">Expert Network</span>
                            </div>
                            <h2 className="text-woof-charcoal text-3xl sm:text-4xl leading-tight font-bold tracking-normal uppercase lg:text-4xl">
                                Bespoke <span className="text-woof-gold">Services.</span>
                            </h2>
                            <p className="text-woof-charcoal/65 text-sm max-w-xl font-normal leading-relaxed">
                                India’s premier ecosystem of verified specialists upholding gold-standard veterinary care, master behavioral training, luxury stays, welfare sanctuaries, and artisanal boutiques.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href={route('directory.index')}
                                className="group inline-flex items-center gap-2.5 rounded-full border border-[#e8ded1] bg-white px-5 py-2.5 text-[11px] font-black tracking-[0.2em] uppercase text-woof-charcoal shadow-2xs transition-all duration-300 hover:border-woof-gold hover:bg-woof-gold hover:text-woof-charcoal hover:shadow-md"
                            >
                                <span>Full Directory</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            {
                                step: '01',
                                badge: 'Clinical Care',
                                name: 'Veterinary Clinics',
                                icon: Stethoscope,
                                href: route('directory.vets'),
                                desc: 'Medical specialists, advanced diagnostics, emergency trauma, and holistic wellness.',
                            },
                            {
                                step: '02',
                                badge: 'Behavior & K9',
                                name: 'Master Trainers',
                                icon: GraduationCap,
                                href: route('directory.trainers'),
                                desc: 'Elite obedience coaching, behavioral modification, and working trial disciplines.',
                            },
                            {
                                step: '03',
                                badge: 'Resort & Suites',
                                name: 'Grand Boarding',
                                icon: HomeIcon,
                                href: route('directory.boarding'),
                                desc: 'Five-star suites, open-air play paddocks, 24/7 supervision, and bespoke staycation care.',
                            },
                            {
                                step: '04',
                                badge: 'Sanctuary & Rescue',
                                name: 'Animal Welfare',
                                icon: ShieldCheck,
                                href: route('directory.welfare'),
                                desc: 'Ethical rehabilitation centers, verified rescue non-profits, and adoption networks.',
                            },
                            {
                                step: '05',
                                badge: 'Artisanal Retail',
                                name: 'Luxury Boutiques',
                                icon: ShoppingBag,
                                href: route('directory.pet-shops'),
                                desc: 'Curated organic nutrition, bespoke collars, designer gear, and artisanal essentials.',
                            },
                        ].map((service, i) => (
                            <Link
                                key={i}
                                href={service.href}
                                className="group relative bg-white border border-[#e8ded1] hover:border-woof-gold/60 p-6 sm:p-7 flex flex-col justify-between rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-500 hover:-translate-y-2 outline-none h-full"
                            >
                                <div className="space-y-5">
                                    {/* Top Row: Icon and Step / Badge */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-woof-cream/70 border border-[#e8ded1] text-woof-gold group-hover:bg-woof-gold group-hover:text-woof-charcoal group-hover:border-woof-gold flex items-center justify-center transition-all duration-400 group-hover:scale-105 shadow-2xs">
                                            <service.icon className="h-6 w-6 transition-colors duration-300" />
                                        </div>
                                        <span className="text-[9px] font-black tracking-widest uppercase text-woof-charcoal/40 group-hover:text-woof-gold transition-colors duration-300 font-mono">
                                            {service.step}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <div className="inline-block">
                                            <span className="text-[9px] font-bold tracking-widest uppercase text-woof-gold bg-woof-cream px-2 py-0.5 rounded-full border border-woof-gold/15">
                                                {service.badge}
                                            </span>
                                        </div>
                                        <h4 className="text-woof-charcoal group-hover:text-woof-gold text-base font-sans font-bold tracking-wide uppercase transition-colors duration-300 leading-snug">
                                            {service.name}
                                        </h4>
                                        <p className="text-woof-charcoal/60 text-xs leading-relaxed font-normal">
                                            {service.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="border-t border-[#f0eae1] pt-4 mt-6 flex items-center justify-between text-woof-gold text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-300 group-hover:text-woof-charcoal">
                                    <span>Discover</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="bg-white py-20 lg:py-28 border-t border-[#e8ded1]/60">
                <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-2xl space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold tracking-[0.4em] uppercase">Encyclopedia</span>
                            </div>
                            <h2 className="text-woof-charcoal text-3xl sm:text-4xl leading-tight font-bold tracking-normal uppercase lg:text-4xl">
                                The Art of <span className="text-woof-gold">Breeds.</span>
                            </h2>
                            <p className="text-woof-charcoal/65 text-sm max-w-xl font-normal leading-relaxed">
                                Comprehensive guides into the temperament, grooming requirements, genetic predispositions, and legacy of over 170+ canine breeds.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href={route('breeds.index')}
                                className="group inline-flex items-center gap-2.5 rounded-full border border-[#e8ded1] bg-white px-5 py-2.5 text-[11px] font-black tracking-[0.2em] uppercase text-woof-charcoal shadow-2xs transition-all duration-300 hover:border-woof-gold hover:bg-woof-gold hover:text-woof-charcoal hover:shadow-md"
                            >
                                <span>Explore All Breeds</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {breeds.map((breed, idx) => (
                            <BreedCard
                                key={breed.id}
                                breed={breed}
                                view="grid"
                                idx={idx}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-woof-pearl/5 py-20 lg:py-24 border-t border-woof-pearl/50 border-b">
                <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div className="max-w-2xl space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-woof-gold h-px w-8" />
                                <span className="text-woof-gold text-xs font-bold tracking-[0.4em] uppercase">The Journal</span>
                            </div>
                            <h2 className="text-woof-charcoal text-4xl leading-none font-bold tracking-normal uppercase lg:text-4xl">
                                Editorial <span className="text-woof-gold">Insights.</span>
                            </h2>
                            <p className="text-woof-charcoal/70 text-md font-light tracking-wider">
                                Curated essays on luxury canine care, breeding excellence, and genetic heritage.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {displayArticles.map((article, i) => (
                            <ArticleCard
                                key={i}
                                view="grid"
                                article={{
                                    title: article.title,
                                    excerpt: article.excerpt,
                                    category: article.category,
                                    readTime: article.readTime,
                                    author: article.author,
                                    image: article.image,
                                    href: article.isMock ? route('community.articles.index') : route('community.articles.show', { slug: article.slug })
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* The Circle of Trust / Patron Stories Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] py-20 lg:py-28">
                {/* Ambient Glows using official brand palette */}
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-woof-gold/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-woof-pearl/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                        {/* Stories (Left Column) */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-woof-gold/10 border border-woof-gold/20 text-woof-gold text-[10px] font-black tracking-[0.25em] uppercase">
                                    <Sparkles className="h-3 w-3" />
                                    <span>Patron Stories & Verified Trust</span>
                                </div>
                                <h2 className="text-woof-charcoal text-3xl sm:text-4xl lg:text-5xl font-bold tracking-normal uppercase leading-tight">
                                    The Circle of <span className="text-woof-gold">Trust.</span>
                                </h2>
                                <p className="text-woof-charcoal/70 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                                    Hear from companion parents, senior veterinary surgeons, and master breeders whose standards are elevated through the WoofCircle network.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[
                                    {
                                        q: 'Finding a verified breeder was my biggest concern. WoofCircle made the entire journey cinematic, verified, and secure.',
                                        a: "Sarah D'Souza",
                                        r: 'Golden Retriever Patron',
                                        badge: 'Verified Patron',
                                        initials: 'SD',
                                        rating: 5,
                                        icon: Heart,
                                    },
                                    {
                                        q: 'The medical passport continuity is a game changer for our clinic and the health of the puppies we treat.',
                                        a: 'Dr. Arjun Mehta',
                                        r: 'Senior Veterinary Surgeon',
                                        badge: 'Medical Specialist',
                                        initials: 'AM',
                                        rating: 5,
                                        icon: Stethoscope,
                                    },
                                    {
                                        q: 'WoofCircle elevated our lineage standards. The verification system filters out sub-par practices instantly.',
                                        a: 'Devendra Sharma',
                                        r: 'Elite Doberman Kennel',
                                        badge: 'Master Breeder',
                                        initials: 'DS',
                                        rating: 5,
                                        icon: ShieldCheck,
                                    },
                                    {
                                        q: 'The bespoke boarding services saved our travel worries. Knowing our companion has a 6-star retreat is pure comfort.',
                                        a: 'Ananya Sen',
                                        r: 'Premium Boarding Member',
                                        badge: 'VIP Member',
                                        initials: 'AS',
                                        rating: 5,
                                        icon: HomeIcon,
                                    },
                                ].map((story, i) => (
                                    <div
                                        key={i}
                                        className="group relative bg-white border border-[#e8ded1] hover:border-woof-gold/50 p-6 sm:p-7 rounded-3xl shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
                                    >
                                        <div className="space-y-4">
                                            {/* Top Row: Stars + Category Badge */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1 text-woof-gold">
                                                    {[...Array(story.rating)].map((_, s) => (
                                                        <Star key={s} className="h-3.5 w-3.5 fill-woof-gold text-woof-gold" />
                                                    ))}
                                                </div>
                                                <span className="text-[9px] font-bold tracking-wider uppercase text-woof-gold bg-woof-cream px-2.5 py-0.5 rounded-full border border-woof-gold/15">
                                                    {story.badge}
                                                </span>
                                            </div>

                                            {/* Quote */}
                                            <p className="text-woof-charcoal/80 text-xs sm:text-[13px] leading-relaxed font-normal italic">
                                                "{story.q}"
                                            </p>
                                        </div>

                                        {/* Author Row */}
                                        <div className="mt-5 pt-4 border-t border-[#f0eae1] flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-woof-cream border border-[#e8ded1] text-woof-charcoal font-bold text-xs flex items-center justify-center font-mono">
                                                    {story.initials}
                                                </div>
                                                <div>
                                                    <h4 className="text-woof-charcoal font-bold text-xs uppercase tracking-tight group-hover:text-woof-gold transition-colors">
                                                        {story.a}
                                                    </h4>
                                                    <p className="text-woof-charcoal/50 text-[10px] tracking-wider">
                                                        {story.r}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-woof-cream/60 text-woof-gold flex items-center justify-center transition-colors group-hover:bg-woof-gold group-hover:text-woof-charcoal">
                                                <story.icon className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modernized Visual Collage Showcase (Right Column) */}
                        <div className="lg:col-span-5 relative flex items-center justify-center">
                            <div className="relative w-full max-w-md">
                                {/* Ambient Backglow */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-woof-gold/20 via-woof-champagne/10 to-transparent rounded-[2.5rem] blur-2xl -z-10" />

                                {/* Main Hero Image */}
                                <div className="relative rounded-3xl overflow-hidden border border-[#e8ded1] shadow-2xl bg-white aspect-[4/5] group">
                                    <img
                                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop"
                                        alt="Patron Stories Companion"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                    {/* Bottom Floating Card info */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-2">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-woof-pearl">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                            <span>100% Verified Lineage</span>
                                        </div>
                                        <p className="text-sm font-light text-white/90 leading-snug">
                                            "Every litter certified through digital passports and clinical lineage DNA."
                                        </p>
                                    </div>
                                </div>

                                {/* Floating Stat Badge 1 (Top Right) */}
                                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-[#e8ded1] shadow-xl rounded-2xl p-4 flex items-center gap-3 animate-float-slow">
                                    <div className="w-10 h-10 rounded-xl bg-woof-gold/10 text-woof-gold flex items-center justify-center font-bold">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider">Zero Tolerance</span>
                                        <span className="block text-[10px] text-woof-charcoal/60">Strict Breeder Vetting</span>
                                    </div>
                                </div>

                                {/* Floating Stat Badge 2 (Bottom Left) */}
                                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-woof-charcoal text-white border border-white/10 shadow-2xl rounded-2xl p-4.5 flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-woof-gold/20 border border-woof-gold/40 text-woof-gold flex items-center justify-center font-bold text-sm">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-base font-black text-white">4.9</span>
                                            <div className="flex text-woof-gold">
                                                <Star className="h-3 w-3 fill-woof-gold" />
                                            </div>
                                        </div>
                                        <span className="block text-[10px] font-bold text-white/60 tracking-wider uppercase">Patron Satisfaction</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Distinguished Partners Marquee Divider Section */}
            <section className="bg-white py-10 border-y border-[#e8ded1]/60 relative overflow-hidden">
                <div className="mx-auto max-w-[1440px] px-6 lg:px-12 flex flex-col md:flex-row items-center gap-8 justify-between">
                    <div className="shrink-0 flex items-center gap-2.5">
                        <div className="bg-woof-gold h-px w-6" />
                        <span className="text-woof-charcoal/50 text-[10px] font-black tracking-[0.25em] uppercase">Ecosystem Partners</span>
                    </div>
                    <div className="w-full overflow-hidden relative select-none [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
                        <div className="flex gap-6 items-center animate-marquee whitespace-nowrap">
                            {[
                                'Royal Kennel Club',
                                'Sovereign Vets Network',
                                'Apex Canine Registry',
                                'Elite Breeder League',
                                'Indian Veterinary Council',
                                'Grand Boarding Alliance',
                            ].map((partner, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-woof-pearl/10 border border-[#e8ded1] text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold/40 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-2xs"
                                >
                                    <ShieldCheck className="h-3 w-3 text-woof-gold" />
                                    {partner}
                                </span>
                            ))}
                            {/* Duplicate for marquee */}
                            {[
                                'Royal Kennel Club',
                                'Sovereign Vets Network',
                                'Apex Canine Registry',
                                'Elite Breeder League',
                                'Indian Veterinary Council',
                                'Grand Boarding Alliance',
                            ].map((partner, i) => (
                                <span
                                    key={`dup-${i}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-woof-pearl/10 border border-[#e8ded1] text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold/40 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-2xs"
                                >
                                    <ShieldCheck className="h-3 w-3 text-woof-gold" />
                                    {partner}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Belong to the Exceptional Membership Section */}
            <section className="bg-white py-20 lg:py-28 relative overflow-hidden">
                <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#24221c] via-[#1c1a15] to-[#14120e] p-8 sm:p-14 lg:p-20 text-white overflow-hidden border border-white/10 shadow-2xl">
                        {/* Luxury Ambient Glows */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-woof-gold/15 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-woof-pearl/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                            {/* Left Text and Actions */}
                            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-woof-gold text-[10px] font-black tracking-[0.25em] uppercase">
                                        <Sparkles className="h-3 w-3" />
                                        <span>Membership of Distinction</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-normal uppercase leading-[1.1] text-white">
                                        Belong to the <br />
                                        <span className="text-woof-gold font-sans">
                                            Exceptional.
                                        </span>
                                    </h2>
                                    <p className="text-white/70 max-w-xl text-sm sm:text-base leading-relaxed font-light mx-auto lg:mx-0">
                                        Join 12,000+ patrons and verified canine professionals in India's most refined pet ecosystem. Experience verified pedigree transparency, digital pet passports, and curated bespoke care.
                                    </p>
                                </div>

                                {/* Benefit Micro-Pills */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                    {[
                                        'Verified Pedigree Registry',
                                        'Digital QR Pet Passport',
                                        '24/7 Expert Healthcare Network',
                                    ].map((benefit, bIdx) => (
                                        <div
                                            key={bIdx}
                                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                    <Link
                                        href={route('register')}
                                        className="group inline-flex items-center justify-center gap-3 rounded-full bg-woof-gold hover:bg-woof-champagne text-woof-charcoal px-9 py-4.5 text-center text-xs font-black tracking-[0.2em] uppercase shadow-xl hover:shadow-woof-gold/25 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                                    >
                                        <span>Initialize Account</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href={route('marketplace.index')}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:border-woof-gold bg-white/5 hover:bg-white/10 px-8 py-4.5 text-center text-xs font-bold tracking-[0.2em] text-white hover:text-woof-gold uppercase transition-all duration-300 w-full sm:w-auto"
                                    >
                                        <span>Browse Registry</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image Showcase with Glass Cards */}
                            <div className="lg:col-span-5 relative flex items-center justify-center">
                                <div className="relative w-full max-w-sm">
                                    {/* Main Framed Card */}
                                    <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl aspect-[4/5] group">
                                        <img
                                            src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            alt="Membership of Distinction - Companion"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-woof-gold block mb-1">
                                                WoofCircle Heritage
                                            </span>
                                            <h4 className="text-lg font-bold uppercase tracking-tight">
                                                Elite Canine Society
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Floating Glassmorphic Overlap Card */}
                                    <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-woof-charcoal/90 backdrop-blur-xl border border-white/20 p-4.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-[220px]">
                                        <div className="w-10 h-10 rounded-xl bg-woof-gold/20 border border-woof-gold/40 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-black uppercase tracking-widest text-white/50">Community</span>
                                            <span className="block text-xs font-bold text-white">12,000+ Patrons</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
