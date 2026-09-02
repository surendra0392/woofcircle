import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BreederProfile, Litter, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowUpRight, Award, Calendar, Camera, CheckCircle2, Dog, Heart, Info, MapPin, MessageCircle, Phone, ShieldCheck, Star, Trophy, User } from 'lucide-react';
import { toast } from 'sonner';
import SaveButton from '@/components/public/save-button';

function BreederLitterCard({ litter }: { litter: Litter }) {
    const [imgError, setImgError] = useState(false);
    useEffect(() => {
        setImgError(false);
    }, [litter.id, litter.featured_image_url]);

    const hasValidImage = Boolean(litter.featured_image_url && litter.featured_image_url.trim() !== '' && !imgError);

    return (
        <div className="group border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-lg flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden bg-woof-cream/40">
                {hasValidImage ? (
                    <img
                        src={litter.featured_image_url!}
                        alt={litter.title}
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center p-6 text-center">
                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                            <Dog className="text-woof-gold h-6 w-6 stroke-[1.75]" />
                        </div>
                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                    </div>
                )}
                <Badge className="bg-woof-charcoal absolute top-4 left-4 rounded-full border-none px-3.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-md">
                    {litter.breed?.name}
                </Badge>
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div className="space-y-2">
                    <h4 className="text-woof-charcoal group-hover:text-woof-gold font-sans text-xl font-bold tracking-tight transition-colors">
                        {litter.title}
                    </h4>
                    <div className="text-woof-charcoal/60 flex items-center gap-2 text-xs font-medium">
                        <Calendar className="text-woof-gold h-3.5 w-3.5" /> {litter.age || '8 Weeks Old'}
                    </div>
                </div>
                <div className="border-[#e8ded1] flex items-center justify-between border-t pt-4">
                    <span className="text-woof-charcoal font-sans text-lg font-bold">
                        <span className="text-woof-gold mr-1">₹</span>
                        {litter.price ? Number(litter.price).toLocaleString('en-IN') : 'Contact'}
                    </span>
                    <Button
                        asChild
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none p-0 text-white shadow-xs transition-all"
                    >
                        <Link href={litter.slug ? route('marketplace.litters.show', { slug: litter.slug }) : '#'}>
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function BreederLogo({ breeder }: { breeder: BreederProfile }) {
    const [logoError, setLogoError] = useState(false);
    useEffect(() => {
        setLogoError(false);
    }, [breeder.id, breeder.logo_url]);

    const hasValidLogo = Boolean(breeder.logo_url && breeder.logo_url.trim() !== '' && !logoError);

    return (
        <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white p-1 shadow-md">
            {hasValidLogo ? (
                <img
                    src={breeder.logo_url!}
                    alt="Breeder"
                    onError={() => setLogoError(true)}
                    className="h-full w-full rounded-xl object-cover"
                />
            ) : (
                <div className="bg-woof-cream flex h-full w-full items-center justify-center text-woof-charcoal/50 rounded-xl p-3">
                    <img src="/images/favicon.png" alt="WoofCircle" className="h-10 w-10 object-contain" />
                </div>
            )}
        </div>
    );
}
export default function BreederShow({ breeder }: { breeder: BreederProfile }) {
    const { settings, auth } = usePage<SharedData>().props;
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [heroImgError, setHeroImgError] = useState(false);

    useEffect(() => {
        setHeroImgError(false);
    }, [breeder.id, breeder.logo_url]);

    const displayName = breeder.kennel_name || breeder.name || 'Verified Breeder';
    const hasValidHeroImage = Boolean(breeder.logo_url && breeder.logo_url.trim() !== '' && !heroImgError);

    return (
        <PublicLayout>
            <Head title={`${displayName} - Verified Breeder Profile | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-[#e8ded1] relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop"
                        alt="Background Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Marketplace', href: route('marketplace.index') },
                                { title: 'Breeders', href: route('marketplace.breeders.index') },
                                { title: displayName, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>
                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        {/* Hero Logo Card */}
                        <div className="group animate-reveal relative shrink-0 [animation-delay:400ms]">
                            <div className="h-56 w-56 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidHeroImage ? (
                                    <img
                                        src={breeder.logo_url!}
                                        alt={displayName}
                                        onError={() => setHeroImgError(true)}
                                        className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-14 w-14 items-center justify-center rounded-2xl">
                                            <Dog className="text-woof-gold h-7 w-7 stroke-[1.75]" />
                                        </div>
                                        <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Logo Available</span>
                                    </div>
                                )}
                            </div>

                            {breeder.is_verified && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 text-white shadow-xl">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                            )}
                        </div>

                        {/* Title and Meta */}
                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                                        Verified Professional Kennel
                                    </span>
                                </div>
                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayName}
                                </h1>
                            </div>
                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {breeder.city?.name}, {breeder.state?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Star className="text-woof-gold fill-woof-gold h-4 w-4" /> {Number(breeder.average_rating || 0).toFixed(1)} Rating
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Award className="text-woof-gold h-4 w-4" /> {breeder.experience_years || 8}+ Years Experience
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats in Hero */}
                        <div className="animate-reveal flex gap-8 shrink-0" style={{ animationDelay: '0.8s' }}>
                            <div className="text-left sm:text-right">
                                <p className="text-woof-charcoal/50 mb-1 text-xs font-bold uppercase tracking-wider">Response Time</p>
                                <p className="text-woof-charcoal font-sans text-2xl sm:text-3xl font-bold">
                                    Fast <span className="text-woof-gold ml-1">&lt; 2h</span>
                                </p>
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
                            {/* Philosophy */}
                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Pedigree Philosophy</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        About {displayName}
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: breeder.description
                                                ? (/<[a-z][\s\S]*>/i.test(breeder.description) ? breeder.description : breeder.description.replace(/\n/g, '<br/>'))
                                                : 'Dedicated to breeding healthy, well-socialized family companions with a focus on temperament and breed standards.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Active Litters */}
                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Available Now</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Active Litters
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {breeder.litters?.length === 0 ? (
                                        <div className="bg-[#fcfbf9] border-[#e8ded1] col-span-full space-y-4 rounded-3xl border p-12 text-center shadow-xs">
                                            <Dog className="text-woof-gold/40 mx-auto h-12 w-12" />
                                            <p className="text-woof-charcoal/60 text-xs font-bold tracking-wider uppercase">
                                                No active litters available right now
                                            </p>
                                        </div>
                                    ) : (
                                        breeder.litters?.map((litter) => (
                                            <BreederLitterCard key={litter.id} litter={litter} />
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* Core Pillars */}
                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Breeding Standards</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Core Pillars
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {[
                                        {
                                            title: 'Ethical Breeding',
                                            desc: 'Extensive genetic testing and clinical screening for all breeding pairs.',
                                            icon: ShieldCheck,
                                        },
                                        {
                                            title: 'Early Socialization',
                                            desc: 'Home-raised puppies interacting with children and pets from day one.',
                                            icon: Heart,
                                        },
                                        {
                                            title: 'Breed Purity',
                                            desc: 'Adhering to strict kennel club standards for health and temperament.',
                                            icon: Trophy,
                                        },
                                        {
                                            title: 'Lifetime Support',
                                            desc: "Guidance and support for all owners throughout the dog's life.",
                                            icon: Info,
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.title}
                                            className="border-[#e8ded1] group flex items-start gap-4 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300"
                                        >
                                            <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <h5 className="text-woof-charcoal font-sans text-base sm:text-lg font-bold">
                                                    {item.title}
                                                </h5>
                                                <p className="text-woof-charcoal/60 text-xs leading-relaxed font-normal">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Reviews */}
                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={breeder.reviews || []}
                                    averageRating={breeder.average_rating || 0}
                                    reviewsCount={breeder.reviews_count || 0}
                                    reviewableId={breeder.id}
                                    reviewableType="breeder"
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
                                            Breeder Identity
                                        </h4>
                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase">Purebred Verification</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                                            <div className="flex flex-col items-center gap-3">
                                                <BreederLogo breeder={breeder} />

                                                <div>
                                                    <p className="font-sans text-xl font-bold text-white"> {displayName} </p>

                                                    <p className="text-white/60 text-xs font-medium mt-1">
                                                        {breeder.city?.name}, {breeder.state?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        {breeder.user_id && (
                                            auth.user?.id === breeder.user_id ? (
                                                <button
                                                    type="button"
                                                    onClick={() => toast('This is your own profile, you cannot chat with yourself.', { icon: '👋' })}
                                                    className="hover:bg-woof-gold flex items-center justify-center text-woof-charcoal h-13 w-full cursor-not-allowed opacity-70 rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:text-white"
                                                >
                                                    Chat with Breeder <MessageCircle className="ml-2 h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!auth.user) {
                                                            toast.error('Please sign in to chat with the breeder');
                                                            router.get(route('login'));
                                                            return;
                                                        }
                                                        router.get(route('chat.initiate', breeder.user_id));
                                                    }}
                                                    className="hover:bg-woof-gold hover:text-woof-charcoal flex items-center justify-center text-woof-charcoal h-13 w-full cursor-pointer rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    Chat with Breeder <MessageCircle className="ml-2 h-4 w-4" />
                                                </button>
                                            )
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsContactModalOpen(true)}
                                                className="hover:text-woof-gold hover:bg-white/10 flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-xs font-bold tracking-wider text-white/90 uppercase transition-all cursor-pointer w-full"
                                            >
                                                <Phone className="h-4 w-4 stroke-[2]" /> Contact
                                            </button>
                                            <SaveButton
                                                itemId={breeder.id}
                                                itemType="breeder"
                                                isSaved={!!(breeder as unknown as { is_saved?: boolean }).is_saved}
                                                variant="button"
                                                theme="dark"
                                                className="h-11 text-xs font-bold tracking-wider uppercase rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Verification Banner */}
                            <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-8 [animation-delay:1200ms] shadow-2xs">
                                <ShieldCheck className="text-woof-gold h-10 w-10" />
                                <div className="space-y-2">
                                    <h5 className="text-woof-charcoal font-sans text-xl font-bold">
                                        Woof Circle Verified
                                    </h5>
                                    <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                        This kennel has been manually audited for ethical breeding practices, facility hygiene, and clinical
                                        documentation accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border border-[#e8ded1] p-0 overflow-hidden bg-white shadow-2xl">
                    <div className="bg-woof-cream/50 border-b border-[#e8ded1] p-6 sm:p-8">
                        <DialogHeader>
                            <DialogTitle className="text-woof-charcoal font-sans text-2xl font-bold">
                                Contact Breeder
                            </DialogTitle>
                            <DialogDescription className="text-woof-charcoal/60 text-xs font-medium mt-1">
                                Get in touch with {displayName}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 sm:p-8 space-y-4 bg-white">
                        {breeder.email && (
                            <div className="space-y-1 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4">
                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <MessageCircle className="h-3.5 w-3.5 text-woof-gold" /> Email
                                </p>
                                <p className="text-woof-charcoal text-sm font-medium">{breeder.email}</p>
                            </div>
                        )}
                        {breeder.phone && (
                            <div className="space-y-1 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4">
                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-woof-gold" /> Phone
                                </p>
                                <p className="text-woof-charcoal text-sm font-medium cursor-pointer hover:text-woof-gold transition-colors"
                                    onClick={() => { fetch('/api/track-interaction', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }, body: JSON.stringify({ viewable_type: 'App\\Models\\BreederProfile', viewable_id: breeder.id, interaction_type: 'phone_click' }) }).catch(() => {}); window.location.href = `tel:${breeder.phone}`; }}
                                >{breeder.phone}</p>
                            </div>
                        )}
                        <div className="space-y-1 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4">
                            <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-woof-gold" /> Location
                            </p>
                            <p className="text-woof-charcoal text-sm font-medium">
                                {[breeder.address, breeder.city?.name, breeder.state?.name].filter(Boolean).join(', ') || 'Location unavailable'}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
