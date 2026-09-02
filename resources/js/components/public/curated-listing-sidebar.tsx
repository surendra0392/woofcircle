import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    CheckCircle2,
    ChevronRight,
    Dog,
    GraduationCap,
    Heart,
    Home as HomeIcon,
    Loader2,
    Mail,
    MapPin,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Stethoscope,
} from 'lucide-react';
import DisplayAdBanner from '@/components/public/display-ad-banner';

export interface FeaturedBreeder {
    id: number;
    name: string;
    kennel_name?: string;
    slug: string;
    logo_url?: string;
    is_verified?: boolean;
    city?: { name: string };
    state?: { name: string };
}

export interface FeaturedStud {
    id: number;
    title: string;
    stud_dog_name?: string;
    slug: string;
    featured_image_url?: string;
    fee?: number | string;
    is_champion?: boolean;
    breed?: { name: string };
    city?: { name: string };
    state?: { name: string };
}

export interface FeaturedLitter {
    id: number;
    title: string;
    slug: string;
    featured_image_url?: string;
    price?: number | string;
    breeder_name?: string;
    breed?: { name: string };
    city?: { name: string };
    state?: { name: string };
}

export interface FeaturedAdoption {
    id: number;
    title: string;
    slug: string;
    featured_image_url?: string;
    gender?: string;
    age?: string;
    breed?: { name: string };
    city?: { name: string };
    state?: { name: string };
}

interface CuratedListingSidebarProps {
    currentType?: 'puppies' | 'studs' | 'breeders' | 'adoption' | 'vets' | 'trainers' | 'boarding' | 'welfare' | 'pet-shops' | 'breeds' | 'article' | 'event' | 'gallery';
    featuredBreeders?: FeaturedBreeder[];
    featuredStuds?: FeaturedStud[];
    featuredLitters?: FeaturedLitter[];
    featuredAdoptions?: FeaturedAdoption[];
    className?: string;
}

function SidebarNewsletterForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubscribed(true);
                setTimeout(() => setSubscribed(false), 6000);
            },
        });
    };

    if (subscribed) {
        return (
            <div className="bg-woof-gold/15 border border-woof-gold/30 rounded-2xl p-4 text-center space-y-1 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 text-woof-gold mx-auto" />
                <p className="text-xs font-bold text-white">You're on the list!</p>
                <p className="text-[10px] text-woof-pearl/70">Watch your inbox for exclusive updates.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2.5 relative z-10">
            <div className="relative">
                <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-woof-gold focus:ring-1 focus:ring-woof-gold transition-colors"
                />
            </div>
            {errors.email && (
                <p className="text-[10px] text-rose-400 font-medium pl-1">{errors.email}</p>
            )}
            <button
                type="submit"
                disabled={processing}
                className="w-full bg-woof-gold hover:bg-woof-gold-light text-woof-charcoal font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
                {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Mail className="h-3.5 w-3.5" />
                        <span>Subscribe Free</span>
                    </>
                )}
            </button>
            <p className="text-[9px] text-woof-pearl/40 text-center font-normal">
                No spam. Unsubscribe anytime with 1-click.
            </p>
        </form>
    );
}

export default function CuratedListingSidebar({
    currentType = 'puppies',
    featuredBreeders = [],
    featuredStuds = [],
    featuredLitters = [],
    featuredAdoptions = [],
    className = '',
}: CuratedListingSidebarProps) {
    const isMarketplace = ['puppies', 'studs', 'breeders', 'adoption'].includes(currentType);

    return (
        <aside className={`space-y-6 sticky top-24 ${className}`}>
            {/* 1. VERIFIED BREEDERS / KENNELS (Shown when not currently on breeders page) */}
            {currentType !== 'breeders' && featuredBreeders && featuredBreeders.length > 0 && (
                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                        <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-woof-charcoal">Verified Kennels</span>
                        </div>
                        <Link
                            href={route('marketplace.breeders.index')}
                            className="text-[10px] font-bold text-woof-gold hover:underline uppercase tracking-wider flex items-center gap-0.5"
                        >
                            All Kennels <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {featuredBreeders.slice(0, 5).map((breeder) => (
                            <Link
                                key={breeder.id}
                                href={route('marketplace.breeders.show', { slug: breeder.slug })}
                                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-woof-cream/60 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-woof-cream border border-[#e8ded1] shrink-0 overflow-hidden flex items-center justify-center">
                                    {breeder.logo_url ? (
                                        <img
                                            src={breeder.logo_url}
                                            alt={breeder.kennel_name || breeder.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ShieldCheck className="h-5 w-5 text-woof-gold" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold truncate transition-colors">
                                        {breeder.kennel_name || breeder.name}
                                    </h5>
                                    <p className="text-[10px] font-medium text-woof-charcoal/50 flex items-center gap-1 mt-0.5">
                                        <MapPin className="h-2.5 w-2.5 text-woof-gold shrink-0" />
                                        {breeder.city?.name || 'India'}
                                    </p>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-woof-charcoal/30 group-hover:text-woof-gold transition-colors shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. VERIFIED LITTERS / PUPPIES (Shown when not currently on puppies page) */}
            {currentType !== 'puppies' && featuredLitters && featuredLitters.length > 0 && (
                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                        <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                            <Dog className="h-4 w-4" />
                            <span className="text-woof-charcoal">Verified Puppies</span>
                        </div>
                        <Link
                            href={route('marketplace.index')}
                            className="text-[10px] font-bold text-woof-gold hover:underline uppercase tracking-wider flex items-center gap-0.5"
                        >
                            All Puppies <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {featuredLitters.slice(0, 5).map((litter) => (
                            <Link
                                key={litter.id}
                                href={route('marketplace.litters.show', { slug: litter.slug })}
                                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-woof-cream/60 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-woof-cream border border-[#e8ded1] shrink-0 overflow-hidden flex items-center justify-center">
                                    {litter.featured_image_url ? (
                                        <img
                                            src={litter.featured_image_url}
                                            alt={litter.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Dog className="h-5 w-5 text-woof-gold" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold truncate transition-colors">
                                        {litter.title}
                                    </h5>
                                    <p className="text-[10px] font-medium text-woof-charcoal/50 truncate">
                                        {litter.breed?.name || 'Pedigree Puppy'}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[10px] font-bold text-woof-gold">
                                        {litter.price ? `₹${Number(litter.price).toLocaleString('en-IN')}` : 'POA'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. CHAMPION STUDS (Shown when not on studs page) */}
            {currentType !== 'studs' && featuredStuds && featuredStuds.length > 0 && (
                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                        <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                            <Award className="h-4 w-4" />
                            <span className="text-woof-charcoal">Champion Studs</span>
                        </div>
                        <Link
                            href={route('marketplace.studs.index')}
                            className="text-[10px] font-bold text-woof-gold hover:underline uppercase tracking-wider flex items-center gap-0.5"
                        >
                            View Studs <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {featuredStuds.slice(0, 5).map((stud) => (
                            <Link
                                key={stud.id}
                                href={route('marketplace.studs.show', { slug: stud.slug })}
                                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-woof-cream/60 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-woof-cream border border-[#e8ded1] shrink-0 overflow-hidden flex items-center justify-center">
                                    {stud.featured_image_url ? (
                                        <img
                                            src={stud.featured_image_url}
                                            alt={stud.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Dog className="h-5 w-5 text-woof-gold" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold truncate transition-colors">
                                        {stud.stud_dog_name || stud.title}
                                    </h5>
                                    <p className="text-[10px] font-medium text-woof-charcoal/50 truncate">
                                        {stud.breed?.name || 'Champion Lineage'}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[10px] font-bold text-woof-gold">
                                        {stud.fee ? `₹${Number(stud.fee).toLocaleString('en-IN')}` : 'POA'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. SIDEBAR 300x250 DISPLAY AD BANNER */}
            <DisplayAdBanner slot="sidebar_square" />

            {/* 5. RESCUE & ADOPTION (Shown when not on adoption page) */}
            {currentType !== 'adoption' && featuredAdoptions && featuredAdoptions.length > 0 && (
                <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
                            <Heart className="h-4 w-4 fill-rose-500/20" />
                            <span className="text-woof-charcoal">Rescue & Adoption</span>
                        </div>
                        <Link
                            href={route('marketplace.adoption.index')}
                            className="text-[10px] font-bold text-woof-gold hover:underline uppercase tracking-wider flex items-center gap-0.5"
                        >
                            Adopt <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {featuredAdoptions.slice(0, 5).map((adopt) => (
                            <Link
                                key={adopt.id}
                                href={route('marketplace.adoption.show', { slug: adopt.slug })}
                                className="flex items-center gap-3.5 p-2 rounded-2xl bg-white border border-[#e8ded1] hover:border-woof-gold/50 transition-colors group shadow-2xs"
                            >
                                <div className="h-10 w-10 rounded-xl bg-woof-cream shrink-0 overflow-hidden flex items-center justify-center">
                                    {adopt.featured_image_url ? (
                                        <img
                                            src={adopt.featured_image_url}
                                            alt={adopt.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Dog className="h-5 w-5 text-woof-gold" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold truncate transition-colors">
                                        {adopt.title}
                                    </h5>
                                    <p className="text-[10px] font-medium text-woof-charcoal/50 truncate">
                                        {adopt.breed?.name || 'Companion'} • {adopt.gender || 'Adoption'}
                                    </p>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase shrink-0">
                                    Adopt
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 6. DIRECTORY CARE SPECIALISTS HUB (Shown for marketplace pages) */}
            {isMarketplace && (
                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal border-b border-[#e8ded1] pb-3">
                        Verified Care Specialists
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                        <Link
                            href={route('directory.vets')}
                            className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] hover:border-woof-gold/60 transition-all group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-xl bg-woof-charcoal text-woof-gold flex items-center justify-center shrink-0">
                                    <Stethoscope className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                        Veterinary Clinics
                                    </p>
                                    <p className="text-[9px] text-woof-charcoal/50">Emergency & clinical care</p>
                                </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-woof-charcoal/40 group-hover:text-woof-gold transition-colors" />
                        </Link>

                        <Link
                            href={route('directory.trainers')}
                            className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] hover:border-woof-gold/60 transition-all group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-xl bg-woof-gold text-woof-charcoal flex items-center justify-center shrink-0">
                                    <GraduationCap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                        Master Dog Trainers
                                    </p>
                                    <p className="text-[9px] text-woof-charcoal/50">Obedience & behavior</p>
                                </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-woof-charcoal/40 group-hover:text-woof-gold transition-colors" />
                        </Link>

                        <Link
                            href={route('directory.boarding')}
                            className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] hover:border-woof-gold/60 transition-all group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-xl bg-woof-charcoal text-woof-pearl flex items-center justify-center shrink-0">
                                    <HomeIcon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                        Luxury Boarding
                                    </p>
                                    <p className="text-[9px] text-woof-charcoal/50">Daycare & suites</p>
                                </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-woof-charcoal/40 group-hover:text-woof-gold transition-colors" />
                        </Link>
                    </div>
                </div>
            )}

            {/* 7. CANINE GAZETTE & EXCLUSIVE DROPS SUBSCRIPTION */}
            <div className="bg-woof-charcoal text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-4 border border-woof-gold/30">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-woof-gold/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1.5 relative z-10">
                    <div className="flex items-center gap-2 text-woof-gold text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>The Canine Circle</span>
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                        Exclusive Litter Drops & Verified Updates
                    </h4>
                    <p className="text-xs text-woof-cream/70 leading-relaxed font-normal">
                        Receive instant alerts on upcoming champion litters, ethical adoptions, and expert care advice.
                    </p>
                </div>

                <SidebarNewsletterForm />
            </div>
        </aside>
    );
}
