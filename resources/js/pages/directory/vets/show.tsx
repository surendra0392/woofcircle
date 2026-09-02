import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Review, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ShareDialog from '@/components/public/share-dialog';
import { Activity, ArrowUpRight, CheckCircle2, Clock, Dog, Heart, MapPin, Share2, ShieldCheck, Star, Stethoscope } from 'lucide-react';
import SaveButton from '@/components/public/save-button';
import BookSlotDialog from '@/components/public/book-slot-dialog';
import { toast } from 'sonner';

interface Pet {
    id: number;
    name: string;
}

interface Vet {
    id: number;
    clinic_name: string;
    name?: string;
    logo_url: string | null;
    address: string;
    description: string | null;
    is_verified: boolean;
    city: { name: string };
    state: { name: string };
    experience_years: number | null;
    phone: string | null;
    email: string | null;
    user_id: number | null;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
}
interface PageProps {
    vet: Vet;
    pets?: Pet[];
}
export default function VetShow({ vet, pets = [] }: PageProps) {
    const { settings, auth } = usePage<SharedData>().props;
    const displayName = vet.clinic_name || vet.name || 'Veterinary Clinic';
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [vet.id, vet.logo_url]);

    const hasValidImage = Boolean(vet.logo_url && vet.logo_url.trim() !== '' && !imgError);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

    const isAdminManaged = !vet.user_id;
    const isOwnProfile = auth?.user && vet.user_id === auth.user.id;

    return (
        <PublicLayout>
            <Head title={`${displayName} | Premium Veterinary Care | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}

                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop"
                        alt="Background Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Directory', href: route('directory.index') },
                                { title: 'Veterinary Clinics', href: route('directory.vets') },
                                { title: displayName, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        <div className="group animate-reveal relative [animation-delay:400ms]">
                            <div className="h-56 w-56 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidImage ? (
                                    <img
                                        src={vet.logo_url!}
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

                            {vet.is_verified && (
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
                                        Verified Medical Facility
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayName}
                                </h1>
                            </div>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {vet.city?.name}, {vet.state?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Star className="text-woof-gold fill-woof-gold h-4 w-4" /> {Number(vet.average_rating || 0).toFixed(1)} Rating
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Clock className="text-woof-gold h-4 w-4" /> Open until 8:00 PM
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- CORE CONTENT --- */}
            <section className="bg-white py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid items-start gap-16 lg:grid-cols-12">
                        <div className="space-y-16 lg:col-span-8">
                            {/* Philosophy */}

                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Clinical Philosophy</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        About {vet.clinic_name}
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: vet.description
                                                ? (/<[a-z][\s\S]*>/i.test(vet.description) ? vet.description : vet.description.replace(/\n/g, '<br/>'))
                                                : 'Pioneering advanced veterinary medicine with a commitment to compassionate care and clinical precision.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Gallery - LENS STYLE */}

                            <div className="animate-reveal space-y-6">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Visual Tour</h3>
                                        <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">The Facility</h4>
                                    </div>
                                </div>

                                <div className="grid h-[450px] grid-cols-12 gap-4">
                                    <div className="border-[#e8ded1] group col-span-8 overflow-hidden rounded-3xl border shadow-xs bg-woof-cream/30">
                                        <img
                                            src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop"
                                            alt="Facility Main"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="col-span-4 flex flex-col gap-4">
                                        <div className="border-[#e8ded1] group flex-1 overflow-hidden rounded-2xl border shadow-xs bg-woof-cream/30">
                                            <img
                                                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop"
                                                alt="Facility Detail"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="border-[#e8ded1] group flex-1 overflow-hidden rounded-2xl border shadow-xs bg-woof-cream/30">
                                            <img
                                                src="https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=2070&auto=format&fit=crop"
                                                alt="Facility Detail"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Specializations */}

                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Medical Services</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Precision Care
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                    {[
                                        { name: 'Surgical Excellence', desc: 'Precision procedures with modern equipment.', icon: Activity },
                                        { name: 'Diagnostic Imaging', desc: 'Advanced Digital X-Ray and Ultrasound screening.', icon: Stethoscope },
                                        { name: 'Holistic Wellness', desc: 'Preventative healthcare and comprehensive plans.', icon: Heart },
                                        { name: 'Critical Care', desc: 'Dedicated intensive monitoring for emergencies.', icon: ShieldCheck },
                                    ].map((service) => {
                                        const IconComponent = service.icon;
                                        return (
                                            <div
                                                key={service.name}
                                                className="border-[#e8ded1] group flex items-start gap-4 sm:gap-5 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300"
                                            >
                                                <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300 mt-0.5">
                                                    <IconComponent className="h-6 w-6 stroke-[1.75]" />
                                                </div>

                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <h5 className="text-woof-charcoal font-sans text-base sm:text-lg font-bold tracking-tight">
                                                        {service.name}
                                                    </h5>

                                                    <p className="text-woof-charcoal/70 text-xs sm:text-sm leading-relaxed font-normal">
                                                        {service.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Reviews */}

                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={vet.reviews || []}
                                    averageRating={vet.average_rating || 0}
                                    reviewsCount={vet.reviews_count || 0}
                                    reviewableId={vet.id}
                                    reviewableType="vet"
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
                                            Clinical Registry
                                        </h4>

                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase">Trusted Verification</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Direct Access</p>

                                            <p className="font-sans text-xl font-bold text-white cursor-pointer hover:text-woof-gold transition-colors"
                                                onClick={() => { fetch('/api/track-interaction', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }, body: JSON.stringify({ viewable_type: 'App\\Models\\VetProfile', viewable_id: vet.id, interaction_type: 'phone_click' }) }).catch(() => {}); window.location.href = `tel:${vet.phone}`; }}
                                            >
                                                {vet.phone || '98765 43210'}
                                            </p>

                                            <p className="text-xs text-white/50 font-medium mt-1">
                                                {vet.email || settings.contact_email}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Hours of Service</p>

                                            <div className="flex items-center justify-center gap-2 text-white">
                                                <Clock className="text-woof-gold h-4 w-4" />
                                                <p className="font-sans text-lg font-bold">09:00 AM - 08:00 PM</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        {!isAdminManaged && (
                                            <Button 
                                                onClick={() => {
                                                    if (!auth?.user) {
                                                        toast.error('Please sign in to book an appointment.');
                                                        return;
                                                    }
                                                    setIsAppointmentDialogOpen(true);
                                                }}
                                                disabled={isOwnProfile}
                                                className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                            >
                                                {isOwnProfile ? 'Your Profile' : 'Book Appointment'} <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Button>
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
                                                itemId={vet.id}
                                                itemType="vet"
                                                isSaved={!!(vet as unknown as { is_saved?: boolean }).is_saved}
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
                                        Every medical partner is manually verified for credentials, equipment quality, and hygiene standards.
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
                title={displayName} 
            />

            <BookSlotDialog
                isOpen={isAppointmentDialogOpen}
                setIsOpen={setIsAppointmentDialogOpen}
                providerType="directory_profiles"
                providerId={vet.id}
                providerName={displayName}
            />
        </PublicLayout>
    );
}
