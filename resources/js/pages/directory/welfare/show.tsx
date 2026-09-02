import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Review, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ShareDialog from '@/components/public/share-dialog';
import {
    ArrowUpRight,
    CheckCircle2,
    Dog,
    Facebook,
    Globe,
    HandHeart,
    Heart,
    Instagram,
    MapPin,
    Share2,
    ShieldCheck,
    Sparkles,
    Star,
    Twitter,
    User,
    Youtube,
} from 'lucide-react';
import SaveButton from '@/components/public/save-button';

interface Welfare {
    id: number;
    organization_name: string;
    name?: string;
    logo_url: string | null;
    address: string;
    description: string | null;
    is_verified: boolean;
    city: { name: string };
    state: { name: string };
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    phone?: string;
    email?: string | null;
    website?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
}

interface PageProps {
    welfare: Welfare;
}
export default function WelfareShow({ welfare }: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const displayName = welfare.organization_name || welfare.name || 'Animal Welfare Organization';
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [welfare.id, welfare.logo_url]);

    const hasValidImage = Boolean(welfare.logo_url && welfare.logo_url.trim() !== '' && !imgError);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    return (
        <PublicLayout>
            <Head title={`${displayName} | Support Animal Welfare | ${settings.site_name}`} />
            {/* --- CINEMATIC HERO SECTION --- */}

            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=2128&auto=format&fit=crop"
                        className="h-full w-full object-cover grayscale"
                        alt="Background"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal">
                        <Breadcrumbs
                            className="mb-6"
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Directory', href: route('directory.index') },
                                { title: 'Welfare', href: route('directory.welfare') },
                                { title: displayName, href: '#' },
                            ]}
                        />                                <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                                    <div className="group animate-reveal relative [animation-delay:400ms]">
                                        <div className="h-56 w-56 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                            {hasValidImage ? (
                                                <img
                                                    src={welfare.logo_url!}
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

                                        {welfare.is_verified && (
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
                                                    Verified Non-Profit Rescue
                                                </span>
                                            </div>

                                            <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                                {displayName}
                                            </h1>
                                        </div>

                                        <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                            <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                                <MapPin className="text-woof-gold h-4 w-4" /> {welfare.city?.name}, {welfare.state?.name}
                                            </div>
                                            <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                            <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                                <Star className="text-woof-gold fill-woof-gold h-4 w-4" /> {Number(welfare.average_rating || 0).toFixed(1)} Impact Rating
                                            </div>
                                            <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                            <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                                <Heart className="text-woof-gold h-4 w-4" /> 1.2K+ Lives Saved
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="relative overflow-hidden bg-white py-20">
                        <div className="container-wide px-6 lg:px-12">
                            <div className="grid gap-16 lg:grid-cols-12">
                                {/* --- CONTENT ARCHITECTURE --- */}

                                <div className="space-y-16 lg:col-span-8">
                                    {/* --- THE MISSION --- */}
                                    <div className="animate-reveal space-y-4" style={{ animationDelay: '0.5s' }}>
                                        <div className="space-y-1">
                                            <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Philosophy &amp; Methodology</h3>
                                            <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                                Our Mission
                                            </h4>
                                        </div>
                                        <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                            <div
                                                className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                                dangerouslySetInnerHTML={{
                                                    __html: welfare.description
                                                        ? (/<[a-z][\s\S]*>/i.test(welfare.description) ? welfare.description : welfare.description.replace(/\n/g, '<br/>'))
                                                        : 'Dedicated to rescuing, rehabilitating, and rehoming abandoned pets. We believe every animal deserves a second chance at a loving home and work tirelessly to build a compassionate society where no animal is left behind.'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* --- IMPACT PILLARS --- */}

                                    <div className="animate-reveal space-y-6" style={{ animationDelay: '0.6s' }}>
                                        <div className="space-y-1">
                                            <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Core Pillars</h3>
                                            <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                                Impact In Action
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {[
                                                {
                                                    icon: HandHeart,
                                                    title: 'Rescue & Refuge',
                                                    desc: 'Providing immediate medical care and a safe sanctuary for animals in critical distress.',
                                                },
                                                {
                                                    icon: Sparkles,
                                                    title: 'Rehabilitation',
                                                    desc: 'Scientific behavioral therapy and trauma recovery to prepare companions for new homes.',
                                                },
                                                {
                                                    icon: User,
                                                    title: 'Foster Network',
                                                    desc: 'A vast community of compassionate guardians providing temporary loving spaces.',
                                                },
                                                {
                                                    icon: Globe,
                                                    title: 'Advocacy',
                                                    desc: 'Driving legislative change and public awareness for animal rights and welfare.',
                                                },
                                            ].map((pillar, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border-[#e8ded1] group flex items-start gap-4 sm:gap-5 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300"
                                                >
                                                    <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300 mt-0.5">
                                                        <pillar.icon className="h-6 w-6 stroke-[1.75]" />
                                                    </div>
                                                    <div className="space-y-1 min-w-0 flex-1">
                                                        <h4 className="text-woof-charcoal font-sans text-base sm:text-lg font-bold tracking-tight">{pillar.title}</h4>

                                                        <p className="text-woof-charcoal/70 text-xs sm:text-sm leading-relaxed font-normal">
                                                            {pillar.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* --- COMMUNITY VOICES --- */}

                                    <div className="border-[#e8ded1] animate-reveal border-t pt-16" style={{ animationDelay: '0.7s' }}>
                                        <ReviewSection
                                            reviews={welfare.reviews || []}
                                            averageRating={welfare.average_rating || 0}
                                            reviewsCount={welfare.reviews_count || 0}
                                            reviewableId={welfare.id}
                                            reviewableType="welfare"
                                        />
                                    </div>
                                </div>
                                {/* --- CINEMATIC SIDEBAR --- */}

                                <div className="lg:col-span-4">
                                    <div className="animate-reveal space-y-8 lg:sticky lg:top-32" style={{ animationDelay: '0.8s' }}>
                                        <div className="bg-woof-charcoal shadow-xl group relative space-y-8 overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
                                            <div className="bg-woof-gold/10 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150"></div>
                                            <div className="bg-woof-gold/20 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[100px]"></div>

                                            <div className="relative z-10 space-y-6 text-center">
                                                <div className="space-y-2">
                                                    <h4 className="font-sans text-3xl font-bold text-white">
                                                        Support Registry
                                                    </h4>

                                                    <p className="text-woof-gold text-xs font-bold tracking-wider uppercase">Rescue & Refuge</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                                        <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">
                                                            Emergency Access
                                                        </p>
                                                        <p className="font-sans text-xl font-bold text-white cursor-pointer hover:text-woof-gold transition-colors"
                                                            onClick={() => { fetch('/api/track-interaction', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }, body: JSON.stringify({ viewable_type: 'App\\Models\\WelfareProfile', viewable_id: welfare.id, interaction_type: 'phone_click' }) }).catch(() => {}); window.location.href = `tel:${welfare.phone}`; }}
                                                        >{welfare.phone || '1800 200 1234'}</p>

                                                        <p className="text-xs text-white/50 font-medium mt-1">{welfare.email || 'rescue@woofcircle.org'}</p>
                                                    </div>

                                                    {(welfare.instagram_url || welfare.facebook_url || welfare.twitter_url || welfare.youtube_url) && (
                                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                                                            <p className="text-woof-gold mb-2 text-xs font-bold uppercase tracking-wider">Follow Us</p>
                                                            <div className="flex items-center justify-center gap-3">
                                                                {welfare.instagram_url && (
                                                                    <a href={welfare.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-woof-gold hover:bg-white/10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/80 transition-all">
                                                                        <Instagram className="h-4 w-4" />
                                                                    </a>
                                                                )}
                                                                {welfare.facebook_url && (
                                                                    <a href={welfare.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-woof-gold hover:bg-white/10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/80 transition-all">
                                                                        <Facebook className="h-4 w-4" />
                                                                    </a>
                                                                )}
                                                                {welfare.twitter_url && (
                                                                    <a href={welfare.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-woof-gold hover:bg-white/10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/80 transition-all">
                                                                        <Twitter className="h-4 w-4" />
                                                                    </a>
                                                                )}
                                                                {welfare.youtube_url && (
                                                                    <a href={welfare.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-woof-gold hover:bg-white/10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/80 transition-all">
                                                                        <Youtube className="h-4 w-4" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4 pt-2">
                                                    <Button className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal group h-13 w-full rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                                                        Donate Now <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:rotate-45" />
                                                    </Button>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsShareDialogOpen(true)}
                                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-4 h-11 text-xs font-bold tracking-wider uppercase text-white/90 hover:text-woof-gold hover:bg-white/10 transition-all cursor-pointer w-full"
                                                        >
                                                            <Share2 className="h-3.5 w-3.5" /> Share
                                                        </button>

                                                        <SaveButton
                                                            itemId={welfare.id}
                                                            itemType="welfare"
                                                            isSaved={!!(welfare as unknown as { is_saved?: boolean }).is_saved}
                                                            variant="button"
                                                            theme="dark"
                                                            className="h-11 text-xs font-bold tracking-wider uppercase rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Verification Card */}

                                        <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-6 sm:p-8 [animation-delay:1200ms] shadow-2xs">
                                            <ShieldCheck className="text-woof-gold h-10 w-10" />

                                            <div className="space-y-1">
                                                <h5 className="text-woof-charcoal font-sans text-xl font-bold">
                                                    Woof Circle Verified
                                                </h5>

                                                <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                                    This organization has been manually verified for ethical rescue practices, financial transparency, and community impact.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
            
            <ShareDialog 
                isOpen={isShareDialogOpen} 
                setIsOpen={setIsShareDialogOpen} 
                title={displayName} 
            />
        </PublicLayout>
    );
}
