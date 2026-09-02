import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData, Stud } from '@/types';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    ClipboardList,
    Clock,
    Crown,
    Dog,
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
    stud: Stud;
    healthRecords?: HealthRecord[];
    hasHealthRecords?: boolean;
}
export default function StudShow({ stud, healthRecords = [], hasHealthRecords = false }: PageProps) {
    const { settings, auth } = usePage<SharedData>().props;
    const displayTitle = stud.title || `${stud.breed?.name || 'Pedigree'} Stud`;
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [stud.id, stud.featured_image_url]);

    const hasValidImage = Boolean(stud.featured_image_url && stud.featured_image_url.trim() !== '' && !imgError);
    const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        preferred_date: '',
        contact_number: '',
        message: 'I would like to book a consultation for your stud service. Please let me know your availability.',
    });

    const handleBookConsultation = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('marketplace.studs.book-consultation', stud.id), {
            onSuccess: () => {
                setIsBookDialogOpen(false);
                reset();
                toast.success('Your consultation request has been sent!');
            },
        });
    };
    return (
        <PublicLayout>
            <Head title={`${displayTitle} | ${stud.breed?.name || 'Dog'} Stud Service | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}

                {hasValidImage && (
                    <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                        <img
                            src={stud.featured_image_url!}
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
                                { title: 'Stud Services', href: route('marketplace.studs.index') },
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
                                        src={stud.featured_image_url!}
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

                            {stud.is_champion && (
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
                                        {stud.breed?.name} Stud Service
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayTitle}
                                </h1>
                            </div>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {stud.profile?.city?.name || 'Location TBD'}, {stud.profile?.state?.name || ''}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Clock className="text-woof-gold h-4 w-4" /> {stud.age || 'Age TBD'}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <CheckCircle2 className="text-woof-gold h-4 w-4" />
                                    {stud.is_available ? 'Available' : 'Currently Unavailable'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="bg-white py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid items-start gap-16 lg:grid-cols-3">
                        <div className="space-y-16 lg:col-span-2">
                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Stud Lineage Profile</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Lineage & Philosophy
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: stud.description
                                                ? (/<[a-z][\s\S]*>/i.test(stud.description) ? stud.description : stud.description.replace(/\n/g, '<br/>'))
                                                : 'No description provided for this stud.'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Bloodline Details</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Parentage & Heritage
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                    <div className="border-[#e8ded1] group flex items-center gap-4 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300">
                                        <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300">
                                            <Crown className="h-6 w-6" />
                                        </div>

                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-woof-charcoal/50 text-[11px] font-bold uppercase tracking-wider truncate">Sire (Father)</p>

                                            <p className="text-woof-charcoal font-sans text-base sm:text-lg font-bold truncate">
                                                {stud.sire_name || 'Champion Lineage'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-[#e8ded1] group flex items-center gap-4 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300">
                                        <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300">
                                            <User className="h-6 w-6" />
                                        </div>

                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-woof-charcoal/50 text-[11px] font-bold uppercase tracking-wider truncate">Dam (Mother)</p>

                                            <p className="text-woof-charcoal font-sans text-base sm:text-lg font-bold truncate">
                                                {stud.dam_name || 'Premium Pedigree'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {stud.breed && (
                                <div className="animate-reveal space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Breed Standard</h3>
                                        <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                            The {stud.breed.name} Breed
                                        </h4>
                                    </div>

                                    <div className="border-[#e8ded1] overflow-hidden rounded-3xl border bg-white shadow-xs">
                                        <div className="border-[#e8ded1] border-b p-6 sm:p-8">
                                            <p className="text-woof-charcoal/80 font-sans text-base leading-relaxed">
                                                {stud.breed.description || 'Gentle, loyal companion breed known for intelligence and sociability.'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 divide-y divide-[#e8ded1] md:grid-cols-3 md:divide-x md:divide-y-0">
                                            <div className="bg-[#fcfbf9] space-y-1 p-6 text-center">
                                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider">Physical Build</p>
                                                <p className="text-sm font-bold text-woof-charcoal capitalize">
                                                    {stud.breed.size || 'Standard'}
                                                </p>
                                            </div>

                                            <div className="bg-[#fcfbf9] space-y-1 p-6 text-center">
                                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider">Expected Life</p>
                                                <p className="text-sm font-bold text-woof-charcoal capitalize">
                                                    {stud.breed.life_span || '12-15 Years'}
                                                </p>
                                            </div>

                                            <div className="bg-[#fcfbf9] space-y-1 p-6 text-center">
                                                <p className="text-woof-charcoal/50 text-xs font-bold uppercase tracking-wider">Temperament</p>
                                                <p className="text-sm font-bold text-woof-charcoal capitalize">
                                                    {stud.breed.temperament || 'Loyal & Intelligent'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                                This stud has been health screened and is {stud.is_vaccinated ? 'fully vaccinated' : 'up to date on vaccines'}. KCI Registration: {stud.kci_registered ? 'Verified' : 'Pending'}.
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
                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={stud.reviews || []}
                                    averageRating={stud.average_rating || 0}
                                    reviewsCount={stud.reviews_count || 0}
                                    reviewableId={stud.id}
                                    reviewableType="stud"
                                />
                            </div>
                        </div>
                        <div className="animate-reveal space-y-8 [animation-delay:1000ms] lg:sticky lg:top-32">
                            <div className="bg-woof-charcoal shadow-xl group relative space-y-8 overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
                                <div className="bg-woof-gold/10 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150"></div>
                                <div className="bg-woof-gold/20 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[100px]"></div>

                                <div className="relative z-10 space-y-6 text-center">
                                    <div className="space-y-2">
                                        <h4 className="font-sans text-3xl font-bold text-white">
                                            Premium Stud
                                        </h4>

                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase"> Purebred Quality </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Service Fee</p>

                                            <div className="flex items-center justify-center gap-1 font-sans text-2xl font-bold text-white">
                                                <span className="text-woof-gold text-lg">₹</span>
                                                {stud.fee ? Number(stud.fee).toLocaleString('en-IN') : 'Contact'}
                                            </div>

                                            <p className="mt-1 text-[10px] font-medium text-white/50">
                                                Quality Grade Service
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Facility Location</p>

                                            <div className="flex items-center justify-center gap-2 text-white">
                                                <MapPin className="text-woof-gold h-4 w-4" />
                                                <p className="font-sans text-lg font-bold">{stud.profile?.city?.name || 'Location TBD'}</p>
                                            </div>

                                            <p className="mt-1 text-xs font-medium text-white/60">
                                                {stud.profile?.state?.name || ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <Button
                                            onClick={() => {
                                                if (!auth.user) {
                                                    toast.error('Please sign in to book a consultation');
                                                    router.get(route('login'));
                                                    return;
                                                }
                                                if (auth.user.id === stud.user_id) {
                                                    toast('This is your own stud service.', { icon: '👋' });
                                                    return;
                                                }
                                                setIsBookDialogOpen(true);
                                            }}
                                            className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full cursor-pointer rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            BOOK CONSULTATION <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            {stud.user_id && auth.user?.id === stud.user_id ? (
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
                                                            toast.error('Please sign in to chat with the breeder');
                                                            router.get(route('login'));
                                                            return;
                                                        }
                                                        if (stud.user_id) {
                                                            router.get(route('chat.initiate', stud.user_id));
                                                        } else {
                                                            toast.error('This listing is not associated with a user.');
                                                        }
                                                    }}
                                                    className="hover:text-woof-gold hover:bg-white/10 flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-xs font-bold tracking-wider text-white/90 uppercase transition-all cursor-pointer"
                                                >
                                                    <MessageCircle className="h-4 w-4 stroke-[2]" /> Inquire
                                                </button>
                                            )}

                                            <SaveButton
                                                itemId={stud.id}
                                                itemType="stud"
                                                isSaved={!!(stud as unknown as { is_saved?: boolean }).is_saved}
                                                variant="button"
                                                theme="dark"
                                                className="h-11 w-full text-xs font-bold tracking-wider uppercase rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-6 sm:p-8 [animation-delay:1200ms] shadow-2xs">
                                <div className="flex items-center gap-4">
                                    <div className="bg-woof-charcoal flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white">
                                        <User className="h-6 w-6" />
                                    </div>

                                    <div className="space-y-0.5">
                                        <h5 className="text-woof-charcoal font-sans text-lg font-bold">
                                            {stud.breeder_name || 'Professional Breeder'}
                                        </h5>

                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            Verified Kennel Facility
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    variant="link"
                                    className="text-woof-gold hover:text-woof-charcoal flex h-auto items-center gap-1.5 p-0 text-xs font-bold tracking-wider uppercase transition-colors"
                                >
                                    <Link href={route('marketplace.breeders.show', { slug: stud.profile?.slug || '#' })}>
                                        VIEW BREEDER PROFILE <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
                <DialogContent className="border-[#e8ded1] bg-white p-0 sm:max-w-md rounded-3xl overflow-hidden shadow-2xl">
                    <form onSubmit={handleBookConsultation}>
                        <DialogHeader className="bg-woof-charcoal p-6 sm:p-8">
                            <DialogTitle className="text-woof-gold font-sans text-2xl font-bold">
                                Book Consultation
                            </DialogTitle>
                            <DialogDescription className="text-white/70 text-xs font-medium mt-1">
                                Connect directly with the breeder to discuss stud service details, timing, and requirements.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 p-6 sm:p-8">
                            <div className="space-y-1.5">
                                <Label htmlFor="preferred_date" className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                                    Preferred Timing / Date
                                </Label>
                                <Input
                                    id="preferred_date"
                                    placeholder="e.g. Next month, Late Spring"
                                    value={data.preferred_date}
                                    onChange={(e) => setData('preferred_date', e.target.value)}
                                    className="rounded-2xl border-[#e8ded1] h-12"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="contact_number" className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                                    Contact Number (Optional)
                                </Label>
                                <Input
                                    id="contact_number"
                                    type="tel"
                                    placeholder="For faster coordination"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    className="rounded-2xl border-[#e8ded1] h-12"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="message" className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    placeholder="Any specific questions about the stud?"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    className="min-h-[100px] rounded-2xl border-[#e8ded1]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-[#fcfbf9] border-t border-[#e8ded1] flex justify-end gap-3 p-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsBookDialogOpen(false)}
                                className="rounded-full border-[#e8ded1] text-xs font-bold uppercase tracking-wider"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full text-xs font-bold uppercase tracking-wider"
                            >
                                {processing ? 'Sending...' : 'Send Request'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
