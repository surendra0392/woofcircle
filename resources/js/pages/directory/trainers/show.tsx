import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Review, SharedData } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ShareDialog from '@/components/public/share-dialog';
import BookMasteryDialog from '@/components/public/book-mastery-dialog';
import { toast } from 'sonner';
import {
    ArrowUpRight,
    CheckCircle2,
    Dog,
    Facebook,
    GraduationCap,
    Instagram,
    MapPin,
    Share2,
    ShieldCheck,
    Star,
    Trophy,
    Twitter,
    Youtube,
    Zap,
} from 'lucide-react';
import SaveButton from '@/components/public/save-button';
interface Trainer {
    id: number;
    user_id: number | null;
    name: string;
    logo_url: string | null;
    address: string;
    description: string | null;
    is_verified: boolean;
    city: { name: string };
    state: { name: string };
    experience_years: number | null;
    phone: string | null;
    email: string | null;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
}
interface PageProps {
    trainer: Trainer;
    pets: { id: number; name: string }[];
}
export default function TrainerShow({ trainer, pets = [] }: PageProps) {
    const { auth, settings } = usePage<SharedData>().props;
    const displayName = trainer.name || 'Canine Trainer';
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [trainer.id, trainer.logo_url]);

    const hasValidImage = Boolean(trainer.logo_url && trainer.logo_url.trim() !== '' && !imgError);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);

    return (
        <PublicLayout>
            <Head title={`${displayName} | Professional Canine Coach | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}

                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2588&auto=format&fit=crop"
                        className="h-full w-full object-cover grayscale"
                        alt="Background"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            className="mb-6"
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Directory', href: route('directory.index') },
                                { title: 'Trainers', href: route('directory.trainers') },
                                { title: displayName, href: '#' },
                            ]}
                        />
                    </div>

                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        <div className="group animate-reveal relative [animation-delay:400ms]">
                            <div className="h-56 w-56 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidImage ? (
                                    <img
                                        src={trainer.logo_url!}
                                        alt={displayName}
                                        onError={() => setImgError(true)}
                                        className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-14 w-14 items-center justify-center rounded-2xl">
                                            <img src="/images/favicon.png" alt="WoofCircle" className="h-7 w-7 object-contain" />
                                        </div>
                                        <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Logo Available</span>
                                    </div>
                                )}
                            </div>

                            {trainer.is_verified && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 text-white shadow-xl">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />

                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                                        Professional Registry Verified
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayName}
                                </h1>
                            </div>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {trainer.city?.name}, {trainer.state?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Star className="text-woof-gold fill-woof-gold h-4 w-4" /> {Number(trainer.average_rating || 5.0).toFixed(1)} / 5.0 Rating
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Trophy className="text-woof-gold h-4 w-4" /> {trainer.experience_years || '10'}+ Years Mastery
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- CORE CONTENT --- */}
            <section className="relative overflow-hidden bg-white py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid items-start gap-16 lg:grid-cols-12">
                        <div className="space-y-16 lg:col-span-8">
                            {/* Philosophy */}

                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase"> Philosophy & Methodology </h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        About {trainer.name}
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: trainer.description
                                                ? (/<[a-z][\s\S]*>/i.test(trainer.description) ? trainer.description : trainer.description.replace(/\n/g, '<br/>'))
                                                : 'Transforming the canine-human connection through science-based methodology and deep behavioral understanding.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Mastery Pillars */}

                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Mastery Pillars</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Science-Based Training
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {[
                                        {
                                            icon: GraduationCap,
                                            title: 'Puppy Development',
                                            desc: 'Foundational neuro-development and critical socialization protocols.',
                                        },
                                        {
                                            icon: ShieldCheck,
                                            title: 'Behavioral Correction',
                                            desc: 'Scientific approach to reactivity, anxiety, and environmental stressors.',
                                        },
                                        { icon: Trophy, title: 'Advanced Obedience', desc: 'Off-leash precision, impulse control, and complex task mastery.' },
                                        { icon: Zap, title: 'Agility & Sport', desc: 'High-performance conditioning, drive building, and mental stimulation.' },
                                    ].map((pillar, idx) => (
                                        <div key={idx} className="border-[#e8ded1] group flex items-start gap-4 sm:gap-5 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300">
                                            <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300 mt-0.5">
                                                <pillar.icon className="h-6 w-6 stroke-[1.75]" />
                                            </div>

                                            <div className="space-y-1 min-w-0 flex-1">
                                                <h5 className="text-woof-charcoal font-sans text-base sm:text-lg font-bold tracking-tight">
                                                    {pillar.title}
                                                </h5>

                                                <p className="text-woof-charcoal/70 text-xs sm:text-sm leading-relaxed font-normal">
                                                    {pillar.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Reviews */}

                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={trainer.reviews || []}
                                    averageRating={trainer.average_rating || 0}
                                    reviewsCount={trainer.reviews_count || 0}
                                    reviewableId={trainer.id}
                                    reviewableType="trainer"
                                />
                            </div>
                        </div>
                        {/* --- CINEMATIC SIDEBAR --- */}

                        <div className="animate-reveal space-y-8 [animation-delay:1000ms] lg:sticky lg:top-32 lg:col-span-4">
                            <div className="bg-woof-charcoal shadow-xl group relative space-y-8 overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
                                <div className="bg-woof-gold/10 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150"></div>
                                <div className="bg-woof-gold/20 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[100px]"></div>

                                <div className="relative z-10 space-y-6 text-center">
                                    <div className="space-y-2">
                                        <h4 className="font-sans text-3xl font-bold text-white">
                                            Trainer Registry
                                        </h4>
                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase">Trusted Coach</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Direct Access</p>

                                            <p className="font-sans text-xl font-bold text-white cursor-pointer hover:text-woof-gold transition-colors"
                                                onClick={() => { fetch('/api/track-interaction', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }, body: JSON.stringify({ viewable_type: 'App\\Models\\TrainerProfile', viewable_id: trainer.id, interaction_type: 'phone_click' }) }).catch(() => {}); window.location.href = `tel:${trainer.phone}`; }}
                                            >
                                                {trainer.phone || '99887 76655'}
                                            </p>

                                            <p className="text-xs text-white/50 font-medium mt-1">
                                                {trainer.email || 'concierge@woofcircle.com'}
                                            </p>
                                        </div>

                                        {(trainer.instagram_url || trainer.facebook_url || trainer.twitter_url || trainer.youtube_url) && (
                                            <div className="flex justify-center gap-3 pt-2">
                                                {trainer.instagram_url && (
                                                    <a 
                                                        href={trainer.instagram_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="hover:text-woof-gold hover:bg-white/10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors"
                                                    >
                                                        <Instagram className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {trainer.facebook_url && (
                                                    <a 
                                                        href={trainer.facebook_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="hover:text-woof-gold hover:bg-white/10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors"
                                                    >
                                                        <Facebook className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {trainer.twitter_url && (
                                                    <a 
                                                        href={trainer.twitter_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="hover:text-woof-gold hover:bg-white/10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors"
                                                    >
                                                        <Twitter className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {trainer.youtube_url && (
                                                    <a 
                                                        href={trainer.youtube_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="hover:text-woof-gold hover:bg-white/10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors"
                                                    >
                                                        <Youtube className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        {trainer.user_id !== null && (
                                            <>
                                                {auth.user?.id === trainer.user_id ? (
                                                    <Button disabled className="hover:bg-woof-gold text-woof-charcoal h-13 w-full rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all opacity-50">
                                                        Your Profile <ArrowUpRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => {
                                                            if (!auth.user) {
                                                                toast.error('Please sign in to book a session');
                                                                router.get(route('login'));
                                                                return;
                                                            }
                                                            setIsBookDialogOpen(true);
                                                        }}
                                                        className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                                    >
                                                        Book Mastery <ArrowUpRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                )}
                                            </>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsShareDialogOpen(true)}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-4 h-11 text-xs font-bold tracking-wider uppercase text-white/90 hover:text-woof-gold hover:bg-white/10 transition-all cursor-pointer w-full"
                                            >
                                                <Share2 className="h-3.5 w-3.5" /> Share
                                            </button>

                                            <SaveButton
                                                itemId={trainer.id}
                                                itemType="trainer"
                                                isSaved={!!(trainer as unknown as { is_saved?: boolean }).is_saved}
                                                variant="button"
                                                theme="dark"
                                                className="h-11 text-xs font-bold tracking-wider uppercase rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Trust Card */}

                            <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-6 sm:p-8 [animation-delay:1200ms] shadow-2xs">
                                <ShieldCheck className="text-woof-gold h-10 w-10" />

                                <div className="space-y-1">
                                    <h5 className="text-woof-charcoal font-sans text-xl font-bold">
                                        Woof Circle Verified
                                    </h5>

                                    <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                        Every trainer undergoes rigorous behavioral verification and background screening.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <ShareDialog 
                isOpen={isShareDialogOpen} 
                setIsOpen={setIsShareDialogOpen} 
                title={trainer.name} 
            />

            <BookMasteryDialog 
                isOpen={isBookDialogOpen} 
                setIsOpen={setIsBookDialogOpen} 
                trainer={trainer} 
                pets={pets} 
            />
        </PublicLayout>
    );
}
