import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';

import { AdoptionListing, SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    ClipboardList,
    Clock,
    Dog,
    Heart,
    Home,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Trophy,
    User,
} from 'lucide-react';
import SaveButton from '@/components/public/save-button';
import { toast } from 'sonner';
interface HealthRecord {
    id: number;
    record_type: string;
    title: string;
    description: string | null;
    administered_date: string;
    next_due_date: string | null;
    vet_name: string | null;
    notes: string | null;
}
interface PageProps {
    listing: AdoptionListing;
    healthRecords?: HealthRecord[];
    hasHealthRecords?: boolean;
}
export default function AdoptionShow({ listing, healthRecords = [], hasHealthRecords = false }: PageProps) {
    const { settings, auth } = usePage<SharedData>().props;
    const displayTitle = listing.title || `Adoptable ${listing.breed?.name || 'Dog'}`;
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [listing.id, listing.featured_image_url]);

    const hasValidImage = Boolean(listing.featured_image_url && listing.featured_image_url.trim() !== '' && !imgError);
    
    // Using router.post directly for Express Interest

    return (
        <PublicLayout>
            <Head title={`${displayTitle} | Adopt a ${listing.breed?.name || 'Pet'} | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}

                {hasValidImage && (
                    <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                        <img
                            src={listing.featured_image_url!}
                            alt="Background Decor"
                            className="h-full w-full object-cover grayscale"
                        />
                    </div>
                )}

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Marketplace', href: route('marketplace.index') },
                                { title: 'Adoption', href: route('marketplace.adoption.index') },
                                { title: displayTitle, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        <div className="group animate-reveal relative [animation-delay:400ms]">
                            <div className="h-72 w-72 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidImage ? (
                                    <img
                                        src={listing.featured_image_url!}
                                        alt={displayTitle}
                                        onError={() => setImgError(true)}
                                        className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-3 flex h-16 w-16 items-center justify-center rounded-2xl">
                                            <img src="/images/favicon.png" alt="WoofCircle" className="h-8 w-8 object-contain" />
                                        </div>
                                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                                    </div>
                                )}
                            </div>

                            {listing.is_champion && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-14 w-14 items-center justify-center rounded-2xl border-4 text-white shadow-xl">
                                    <Trophy className="h-7 w-7" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />

                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                                        Adoptable {listing.breed?.name}
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayTitle}
                                </h1>
                            </div>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {listing.city?.name || 'Location TBD'}, {listing.state?.name || ''}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Clock className="text-woof-gold h-4 w-4" /> {listing.age || 'Age TBD'}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <CheckCircle2 className="text-woof-gold h-4 w-4" />
                                    {listing.is_available ? 'Available' : 'Reserved / Adopted'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- CORE CONTENT --- */}
            <section className="bg-white py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid items-start gap-16 lg:grid-cols-3">
                        <div className="space-y-16 lg:col-span-2">
                            {/* Philosophy / Description */}

                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">About the Companion</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Companion Overview
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: listing.description
                                                ? (/<[a-z][\s\S]*>/i.test(listing.description) ? listing.description : listing.description.replace(/\n/g, '<br/>'))
                                                : 'No overview provided for this pet.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Key Stats */}

                            <div className="animate-reveal grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="border-[#e8ded1] group flex items-center gap-4 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-6 transition-all duration-300">
                                    <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300">
                                        <Home className="h-6 w-6" />
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                        <h5 className="text-woof-charcoal font-sans text-lg font-bold"> Placement Type </h5>
                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            Permanent Forever Home
                                        </p>
                                    </div>
                                </div>

                                <div className="border-[#e8ded1] group flex items-center gap-4 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-6 transition-all duration-300">
                                    <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300">
                                        <Heart className="h-6 w-6" />
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                        <h5 className="text-woof-charcoal font-sans text-lg font-bold"> Health & Vaccines </h5>
                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            {listing.is_vaccinated ? 'Fully Vaccinated & Dewormed' : 'Up to date on vaccinations'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Breed Info if available */}

                            {listing.breed && (
                                <div className="animate-reveal space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Breed Context</h3>
                                        <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                            The {listing.breed.name} Breed
                                        </h4>
                                    </div>

                                    <div className="border-[#e8ded1] overflow-hidden rounded-3xl border bg-white shadow-xs">
                                        <div className="border-[#e8ded1] border-b p-6 sm:p-8">
                                            <p className="text-woof-charcoal/80 font-sans text-base leading-relaxed">
                                                {listing.breed.description || 'Gentle, loyal companion breed known for intelligence and sociability.'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 divide-y divide-[#e8ded1] md:grid-cols-3 md:divide-x md:divide-y-0">
                                            <div className="bg-[#fcfbf9] space-y-1 p-6 text-center">
                                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider">Origin</p>
                                                <p className="text-sm font-bold text-woof-charcoal capitalize">
                                                    {listing.breed.origin || 'International'}
                                                </p>
                                            </div>

                                            <div className="bg-[#fcfbf9] space-y-1 p-6 text-center">
                                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider">Expected Life</p>
                                                <p className="text-sm font-bold text-woof-charcoal capitalize">
                                                    {listing.breed.life_span || '12-15 Years'}
                                                </p>
                                            </div>

                                            <div className="bg-[#fcfbf9] space-y-1 p-6 text-center">
                                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider">Temperament</p>
                                                <p className="text-sm font-bold text-woof-charcoal capitalize">
                                                    {listing.breed.temperament || 'Loyal & Intelligent'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Clinical History */}

                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Medical Verification</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Clinical History
                                    </h4>
                                </div>

                                {!hasHealthRecords ? (
                                    <div className="bg-woof-champagne/10 border border-woof-gold/30 flex gap-6 rounded-3xl p-6 sm:p-8 shadow-2xs">
                                        <div className="bg-woof-gold text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-woof-charcoal font-sans text-lg font-bold">
                                                Health Screened
                                            </h3>

                                            <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                                This companion has been health screened and is {listing.is_vaccinated ? 'fully vaccinated' : 'up to date on vaccines'}. All adoption candidates are verified for temperament and compatibility.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {healthRecords.map((record) => (
                                            <div
                                                key={record.id}
                                                className="border-[#e8ded1] bg-woof-cream/40 hover:border-woof-gold/40 hover:bg-white flex items-start gap-4 rounded-2xl border p-4 sm:p-5 transition-all duration-300"
                                            >
                                                <div className="bg-woof-charcoal flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
                                                    {record.record_type === 'vaccination' ? (
                                                        <Syringe className="h-5 w-5" />
                                                    ) : record.record_type === 'deworming' ? (
                                                        <Activity className="h-5 w-5" />
                                                    ) : (
                                                        <ClipboardList className="h-5 w-5" />
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-woof-gold text-xs font-bold uppercase tracking-wider">
                                                            {record.record_type}
                                                        </span>

                                                        <span className="text-woof-charcoal/50 text-xs font-medium">
                                                            {new Date(record.administered_date).toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>

                                                    <h5 className="text-woof-charcoal font-sans text-base font-bold">
                                                        {record.title}
                                                    </h5>

                                                    <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                                        {record.description || 'Verified Procedure'}
                                                    </p>

                                                    {record.vet_name && (
                                                        <div className="text-woof-charcoal/50 flex items-center gap-1.5 pt-1 text-xs font-medium">
                                                            <Stethoscope className="h-3.5 w-3.5 text-woof-gold" /> Verified by: {record.vet_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Reviews */}

                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={listing.reviews || []}
                                    averageRating={listing.average_rating || 0}
                                    reviewsCount={listing.reviews_count || 0}
                                    reviewableId={listing.id}
                                    reviewableType="adoption"
                                />
                            </div>
                        </div>
                        {/* --- CINEMATIC SIDEBAR --- */}

                        <div className="animate-reveal space-y-8 [animation-delay:1000ms] lg:sticky lg:top-32">
                            <div className="bg-woof-charcoal shadow-xl group relative space-y-8 overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
                                <div className="bg-woof-gold/10 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150"></div>
                                <div className="bg-woof-gold/20 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[100px]"></div>

                                <div className="relative z-10 space-y-6 text-center">
                                    <div className="space-y-2">
                                        <h4 className="font-sans text-3xl font-bold text-white">
                                            Forever Home
                                        </h4>

                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase"> Adoption Registry </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Adoption Fee</p>

                                            <div className="flex items-center justify-center gap-1 font-sans text-2xl font-bold text-white">
                                                <span className="text-woof-gold text-lg">₹</span>
                                                {listing.fee && Number(listing.fee) > 0 ? Number(listing.fee).toLocaleString('en-IN') : 'Free'}
                                            </div>

                                            <p className="mt-1 text-[10px] font-medium text-white/50">Support & Care Fee</p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Current Location</p>

                                            <div className="flex items-center justify-center gap-2 text-white">
                                                <MapPin className="text-woof-gold h-4 w-4" />
                                                <p className="font-sans text-lg font-bold">{listing.city?.name || 'Location TBD'}</p>
                                            </div>

                                            <p className="mt-1 text-xs font-medium text-white/60">
                                                {listing.state?.name || ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <Button 
                                            onClick={() => {
                                                if (!auth.user) {
                                                    toast.error('Please sign in to express interest');
                                                    router.get(route('login'));
                                                    return;
                                                }
                                                if (auth.user.id === listing.user_id) {
                                                    toast('This is your own listing.', { icon: '👋' });
                                                    return;
                                                }
                                                router.post(route('marketplace.adoption.express-interest', listing.id));
                                            }}
                                            className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full cursor-pointer rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            EXPRESS INTEREST <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            {listing.user_id && (
                                                auth.user?.id === listing.user_id ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toast('This is your own listing, you cannot chat with yourself.', { icon: '👋' })}
                                                        className="hover:text-woof-gold flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-xs font-bold tracking-wider text-white/80 uppercase transition-all cursor-not-allowed opacity-70"
                                                    >
                                                        <MessageCircle className="h-4 w-4 stroke-[2]" /> Inquire
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (!auth.user) {
                                                                toast.error('Please sign in to chat with the rescuer');
                                                                router.get(route('login'));
                                                                return;
                                                            }
                                                            router.get(route('chat.initiate', listing.user_id));
                                                        }}
                                                        className="hover:text-woof-gold hover:bg-white/10 flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-xs font-bold tracking-wider text-white/90 uppercase transition-all cursor-pointer"
                                                    >
                                                        <MessageCircle className="h-4 w-4 stroke-[2]" /> Inquire
                                                    </button>
                                                )
                                            )}

                                            <div className={!listing.user_id ? "col-span-2" : ""}>
                                                <SaveButton
                                                    itemId={listing.id}
                                                    itemType="adoption"
                                                    isSaved={!!(listing as unknown as { is_saved?: boolean }).is_saved}
                                                    variant="button"
                                                    theme="dark"
                                                    className="h-11 w-full text-xs font-bold tracking-wider uppercase rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Rescuer Profile Link */}

                            <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-6 sm:p-8 [animation-delay:1200ms] shadow-2xs">
                                <div className="flex items-center gap-4">
                                    <div className="bg-woof-charcoal flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white">
                                        <User className="h-6 w-6" />
                                    </div>

                                    <div className="space-y-0.5">
                                        <h5 className="text-woof-charcoal font-sans text-lg font-bold">
                                            {listing.breeder_name || listing.user?.name || 'Verified Rescuer'}
                                        </h5>

                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            {listing.profile?.is_verified ? 'Verified Care Facility' : 'Individual Rescuer'}
                                        </p>
                                    </div>
                                </div>

                                {listing.profile && listing.profile_url ? (
                                    listing.user_id === auth.user?.id ? (
                                        <div className="mt-2 space-y-2">
                                            {listing.profile?.is_verified && (
                                                <div className="bg-emerald-500/10 text-emerald-700 flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full w-fit">
                                                    <ShieldCheck className="h-3.5 w-3.5" /> 
                                                    {listing.profile_type === 'App\\Models\\BreederProfile' ? 'Verified Breeder' 
                                                        : listing.profile_type === 'App\\Models\\WelfareProfile' ? 'Verified Rescuer' 
                                                        : 'Verified Profile'}
                                                </div>
                                            )}
                                            <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-medium">
                                                <ShieldCheck className="text-woof-gold h-4 w-4" /> This is your profile
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-2 space-y-2">
                                            {listing.profile?.is_verified && (
                                                <div className="bg-emerald-500/10 text-emerald-700 flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full w-fit">
                                                    <ShieldCheck className="h-3.5 w-3.5" /> 
                                                    {listing.profile_type === 'App\\Models\\BreederProfile' ? 'Verified Breeder' 
                                                        : listing.profile_type === 'App\\Models\\WelfareProfile' ? 'Verified Rescuer' 
                                                        : 'Verified Profile'}
                                                </div>
                                            )}
                                            <Button
                                                asChild
                                                variant="link"
                                                className="text-woof-gold hover:text-woof-charcoal flex h-auto items-center gap-1.5 p-0 text-xs font-bold tracking-wider uppercase transition-colors"
                                            >
                                                <Link href={listing.profile_url}>
                                                    VIEW PROFILE <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-medium">
                                        <ShieldCheck className="text-woof-gold h-4 w-4" /> Platform Verified User
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
