import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { Litter, SharedData } from '@/types'; // Temporarily defining HealthRecord here if not in global types
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    Dog,
    MapPin,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Trophy,
    User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import SaveButton from '@/components/public/save-button';
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
interface TransferRequest {
    id: number;
    status: 'pending_breeder' | 'pending_admin' | 'approved' | 'rejected';
    pet_name: string;
    gender: string;
    created_at: string;
}

interface PageProps {
    litter: Litter;
    healthRecords: HealthRecord[];
    hasHealthRecords: boolean;
    existingRequest: TransferRequest | null;
}
export default function PuppyShow({ litter, healthRecords, hasHealthRecords, existingRequest }: PageProps) {
    const { auth, settings } = usePage<SharedData>().props;
    const displayTitle = litter.title || `${litter.breed?.name || 'Purebred'} Puppy`;
    const [selectedImage, setSelectedImage] = useState<string | null>(litter.featured_image_url);
    const [imgError, setImgError] = useState(false);
    const [selectedImgError, setSelectedImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
        setSelectedImgError(false);
        setSelectedImage(litter.featured_image_url);
    }, [litter.id, litter.featured_image_url]);

    const hasValidImage = Boolean(litter.featured_image_url && litter.featured_image_url.trim() !== '' && !imgError);
    const hasValidSelected = Boolean(selectedImage && selectedImage.trim() !== '' && !selectedImgError);

    const [isConverting, setIsConverting] = useState(false);
    const [isAcquireDialogOpen, setIsAcquireDialogOpen] = useState(false);
    const acquisitionForm = useForm({ pet_name: litter.title || '', gender: 'male', date_of_birth: '' });
    const handleAcquire = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user) {
            toast.error('Please sign in to request a puppy');
            router.get(route('login'));
            return;
        }
        setIsConverting(true);
        acquisitionForm.post(route('marketplace.litters.request-transfer', litter.id), {
            onSuccess: () => {
                setIsConverting(false);
                setIsAcquireDialogOpen(false);
                toast.success('Your secure transfer request has been sent to the breeder!');
            },
            onError: (errors) => {
                setIsConverting(false);
                console.error(errors);
                toast.error('Something went wrong. Please check the form.');
            },
        });
    };
    return (
        <PublicLayout>
            <Head title={`${displayTitle} | Premium ${litter.breed?.name || 'Puppy'} Marketplace | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-b border-woof-charcoal/5 relative overflow-hidden pt-32 pb-16 text-woof-charcoal">
                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Marketplace', href: route('marketplace.index') },
                                { title: litter.breed?.name || 'Puppy', href: '#' },
                                { title: displayTitle, href: '#' },
                            ]}
                            dark={false}
                            className="mb-6 text-woof-charcoal"
                        />
                    </div>
                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        <div className="group animate-reveal relative [animation-delay:400ms]">
                            <div className="h-72 w-72 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidImage ? (
                                    <img
                                        src={litter.featured_image_url!}
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

                            {litter.is_champion && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-14 w-14 items-center justify-center rounded-2xl border-4 text-white shadow-xl">
                                    <Trophy className="h-7 w-7" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase"> Verified Premium Listing </span>
                                </div>
                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayTitle}
                                </h1>
                            </div>
                            <div className="animate-reveal flex flex-wrap items-center gap-6" style={{ animationDelay: '0.8s' }}>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {litter.city?.name}, {litter.state?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Dog className="text-woof-gold h-4 w-4" /> {litter.breed?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Calendar className="text-woof-gold h-4 w-4" /> Listed {new Date(litter.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        {/* Quick Stats in Hero */}
                        <div className="animate-reveal flex gap-8" style={{ animationDelay: '1000ms' }}>
                            <div className="text-left sm:text-right">
                                <p className="text-woof-charcoal/50 mb-1 text-xs font-bold uppercase tracking-wider">Starting Price</p>
                                <p className="text-woof-charcoal font-sans text-3xl sm:text-4xl font-bold">
                                    <span className="text-woof-gold mr-1">₹</span>
                                    {litter.price ? Number(litter.price).toLocaleString('en-IN') : 'Enquiry'}
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
                            {/* GALLERY */}
                            <div className="animate-reveal space-y-8">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Visual Portfolio</h3>
                                        <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                            Purebred Aesthetics
                                        </h4>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="group bg-woof-cream border border-[#e8ded1] shadow-xs relative aspect-[16/10] overflow-hidden rounded-3xl">
                                        {hasValidSelected ? (
                                            <img
                                                src={selectedImage!}
                                                alt={litter.title}
                                                onError={() => setSelectedImgError(true)}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                                <div className="bg-white border border-[#e8ded1] shadow-2xs mb-3 flex h-16 w-16 items-center justify-center rounded-2xl">
                                                    <img src="/images/favicon.png" alt="WoofCircle" className="h-8 w-8 object-contain" />
                                                </div>
                                                <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            {litter.is_champion && (
                                                <Badge className="bg-woof-charcoal text-woof-gold border border-woof-gold/30 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase shadow-md">
                                                    <Trophy className="h-3.5 w-3.5" /> Champion Bloodline
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {litter.images && litter.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4">
                                            <button
                                                onClick={() => setSelectedImage(litter.featured_image_url)}
                                                className={`aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300 ${selectedImage === litter.featured_image_url ? 'border-woof-gold scale-105 shadow-md' : 'border-[#e8ded1] opacity-70 hover:opacity-100'}`}
                                            >
                                                <img src={litter.featured_image_url || ''} alt="Main" className="h-full w-full object-cover" />
                                            </button>
                                            {litter.images.map((img) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => setSelectedImage(img.image_url)}
                                                    className={`aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300 ${selectedImage === img.image_url ? 'border-woof-gold scale-105 shadow-md' : 'border-[#e8ded1] opacity-70 hover:opacity-100'}`}
                                                >
                                                    <img src={img.image_url} alt="Gallery" className="h-full w-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* CORE DETAILS */}
                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Litter Specifications</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Technical Details
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                                    {[
                                        { label: 'Puppy Age', value: litter.age || '8 Weeks', icon: Clock },
                                        { label: 'Registration', value: litter.kci_registered ? 'KCI Certified' : 'Verified Pet', icon: Award },
                                        { label: 'Bloodline', value: litter.is_champion ? 'Champion' : 'Show Quality', icon: Trophy },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="border-[#e8ded1] group flex items-center gap-4 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300"
                                        >
                                            <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300">
                                                <stat.icon className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5 min-w-0">
                                                <p className="text-woof-charcoal/50 text-[11px] font-bold uppercase tracking-wider truncate">
                                                    {stat.label}
                                                </p>
                                                <p className="text-woof-charcoal font-sans text-base sm:text-lg font-bold truncate">
                                                    {stat.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* DESCRIPTION */}
                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Pedigree Narrative</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        About This Puppy
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: litter.description
                                                ? (/<[a-z][\s\S]*>/i.test(litter.description) ? litter.description : litter.description.replace(/\n/g, '<br/>'))
                                                : 'No description provided for this puppy.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* CLINICAL HEALTH HUB */}
                            <div className="bg-woof-charcoal group shadow-xl animate-reveal relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white">
                                <div className="bg-woof-gold/10 absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
                                    <div className="bg-woof-gold shadow-lg shadow-woof-gold/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white">
                                        <Stethoscope className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <h4 className="font-sans text-2xl font-bold text-white">
                                            Clinical Continuity Verified
                                        </h4>

                                        <p className="max-w-lg text-xs leading-relaxed font-medium text-white/60">
                                            Acquisition automatically syncs all {healthRecords.length} medical history records to your dashboard for
                                            lifetime tracking.
                                        </p>
                                    </div>

                                    {hasHealthRecords && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="hover:bg-woof-gold hover:text-woof-charcoal h-11 cursor-pointer rounded-full border-white/20 bg-white/10 px-6 text-xs font-bold tracking-wider text-white uppercase transition-all"
                                                >
                                                    Check Records
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="shadow-2xl max-w-2xl overflow-hidden rounded-3xl border border-[#e8ded1] p-0 bg-white">
                                                <div className="bg-woof-charcoal p-8 text-white">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-white/10 text-woof-gold flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10">
                                                            <Stethoscope className="h-6 w-6" />
                                                        </div>

                                                        <div className="space-y-0.5">
                                                            <DialogTitle className="font-sans text-2xl font-bold text-white">
                                                                Pre-Acquisition Clinical History
                                                            </DialogTitle>

                                                            <p className="text-xs font-medium text-white/60">
                                                                Verified by {litter.breeder_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="max-h-[60vh] space-y-4 overflow-y-auto bg-white p-6 sm:p-8">
                                                    {healthRecords.map((record) => (
                                                        <div
                                                            key={record.id}
                                                            className="bg-woof-cream/40 border border-[#e8ded1] hover:border-woof-gold/40 flex items-start gap-4 rounded-2xl p-4 transition-colors"
                                                        >
                                                            <div
                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${record.record_type === 'vaccination' ? 'bg-woof-gold text-white' : 'bg-woof-charcoal text-white'}`}
                                                            >
                                                                {record.record_type === 'vaccination' ? (
                                                                    <Syringe className="h-5 w-5" />
                                                                ) : (
                                                                    <Stethoscope className="h-5 w-5" />
                                                                )}
                                                            </div>

                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h5 className="text-woof-charcoal text-sm font-bold">
                                                                        {record.title}
                                                                    </h5>

                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${record.record_type === 'vaccination' ? 'border-woof-gold text-woof-gold' : 'border-[#e8ded1] text-woof-charcoal/60'}`}
                                                                    >
                                                                        {record.record_type}
                                                                    </Badge>
                                                                </div>

                                                                <div className="text-woof-charcoal/60 mt-1 flex items-center gap-3 text-xs font-medium">
                                                                    <span>{new Date(record.administered_date).toLocaleDateString()}</span>
                                                                    <div className="bg-woof-gold/50 h-1 w-1 rounded-full"></div>
                                                                    <span>{record.vet_name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                            {/* REVIEWS */}

                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={litter.reviews || []}
                                    averageRating={litter.average_rating || 0}
                                    reviewsCount={litter.reviews_count || 0}
                                    reviewableId={litter.id}
                                    reviewableType="litter"
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
                                            Secure Registry
                                        </h4>
                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase">Purebred Verification</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-2 text-xs font-bold uppercase tracking-wider">Breeder Identity</p>

                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-white p-1 shadow-xs">
                                                    {litter.profile?.logo_url ? (
                                                        <img
                                                            src={litter.profile.logo_url}
                                                            alt="Breeder"
                                                            className="h-full w-full rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="bg-woof-cream flex h-full w-full items-center justify-center text-woof-charcoal/50 rounded-xl">
                                                            <User className="h-7 w-7" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-sans text-lg font-bold text-white"> {litter.breeder_name} </p>

                                                    <p className="text-white/60 text-xs font-medium mt-1">
                                                        {litter.breeder_location || 'Location Unavailable'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-0">
                                        {existingRequest ? (
                                            <div className="space-y-4">
                                                <div className={`flex items-center gap-4 rounded-2xl border p-5 ${existingRequest.status === 'approved'
                                                    ? 'border-emerald-500/30 bg-emerald-500/10'
                                                    : existingRequest.status === 'pending_admin'
                                                        ? 'border-sky-500/30 bg-sky-500/10'
                                                        : 'border-amber-500/30 bg-amber-500/10'
                                                    }`}>
                                                    {existingRequest.status === 'approved' ? (
                                                        <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                                                    ) : existingRequest.status === 'pending_admin' ? (
                                                        <ShieldCheck className="h-6 w-6 text-sky-400 shrink-0" />
                                                    ) : (
                                                        <Clock className="h-6 w-6 text-amber-400 shrink-0" />
                                                    )}
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold uppercase tracking-wider text-white">
                                                            {existingRequest.status === 'approved'
                                                                ? 'Transfer Approved'
                                                                : existingRequest.status === 'pending_admin'
                                                                    ? 'Awaiting Admin Verification'
                                                                    : 'Awaiting Breeder Approval'}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-white/60 mt-0.5">
                                                            {existingRequest.status === 'approved'
                                                                ? 'Check your dashboard for the puppy'
                                                                : `Requested ${new Date(existingRequest.created_at).toLocaleDateString()}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    if (!auth.user) {
                                                        toast.error('Please sign in to request a puppy');
                                                        router.get(route('login'));
                                                        return;
                                                    }
                                                    setIsAcquireDialogOpen(true);
                                                }}
                                                disabled={isConverting}
                                                className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full cursor-pointer rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isConverting ? 'Processing...' : 'Request Secure Transfer'} <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={route('marketplace.breeders.show', { slug: litter.profile?.slug || '#' })}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 h-11 text-xs font-bold tracking-wider uppercase text-white/90 hover:text-woof-gold hover:bg-white/10 transition-all cursor-pointer"
                                            >
                                                Breeder Profile
                                            </Link>

                                            <SaveButton
                                                itemId={litter.id}
                                                itemType="puppy"
                                                isSaved={!!(litter as unknown as { is_saved?: boolean }).is_saved}
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
                                        This litter has been manually verified for KCI registration, health certifications, and ethical breeding
                                        standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* --- ACQUISITION DIALOG --- */}
            <Dialog open={isAcquireDialogOpen} onOpenChange={setIsAcquireDialogOpen}>
                <DialogContent className="shadow-2xl max-w-xl overflow-hidden rounded-3xl border border-[#e8ded1] p-0 bg-white">
                    <div className="bg-woof-gold relative p-8 sm:p-10 text-white">
                        <div className="relative z-10">
                            <CheckCircle2 className="mb-3 h-8 w-8 text-white/80" />

                            <DialogTitle className="mb-1 font-sans text-2xl font-bold text-white">
                                Request Secure Transfer
                            </DialogTitle>

                            <DialogDescription className="text-xs font-medium text-white/80">
                                Request breeder approval before data is transferred to your account.
                            </DialogDescription>
                        </div>
                        <ShieldCheck className="absolute right-[-20px] bottom-[-20px] h-40 w-40 rotate-12 text-white/10 pointer-events-none" />
                    </div>

                    <form onSubmit={handleAcquire} className="space-y-6 bg-white p-6 sm:p-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pet_name" className="text-woof-charcoal/80 ml-1 text-xs font-bold uppercase tracking-wider">
                                    Your Puppy's New Name
                                </Label>

                                <Input
                                    id="pet_name"
                                    value={acquisitionForm.data.pet_name}
                                    onChange={(e) => acquisitionForm.setData('pet_name', e.target.value)}
                                    placeholder="Enter Pet Name..."
                                    className="bg-white border-[#e8ded1] h-12 rounded-2xl font-medium shadow-2xs"
                                />

                                {acquisitionForm.errors.pet_name && (
                                    <p className="text-red-500 ml-1 text-xs font-medium">{acquisitionForm.errors.pet_name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-woof-charcoal/80 ml-1 text-xs font-bold uppercase tracking-wider">Gender</Label>

                                    <Select value={acquisitionForm.data.gender} onValueChange={(v) => acquisitionForm.setData('gender', v)}>
                                        <SelectTrigger className="bg-white border-[#e8ded1] h-12 rounded-2xl font-medium">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent className="rounded-2xl border-[#e8ded1]">
                                            <SelectItem value="male" className="rounded-xl">Male</SelectItem>
                                            <SelectItem value="female" className="rounded-xl">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob" className="text-woof-charcoal/80 ml-1 text-xs font-bold uppercase tracking-wider">
                                        Date of Birth (Optional)
                                    </Label>

                                    <Input
                                        id="dob"
                                        type="date"
                                        value={acquisitionForm.data.date_of_birth}
                                        onChange={(e) => acquisitionForm.setData('date_of_birth', e.target.value)}
                                        className="bg-white border-[#e8ded1] h-12 rounded-2xl font-medium shadow-2xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-woof-cream border border-woof-gold/30 flex items-center gap-4 rounded-2xl p-4">
                            <div className="bg-woof-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs text-white">
                                <Syringe className="h-5 w-5" />
                            </div>

                            <p className="text-xs leading-relaxed font-medium text-woof-charcoal/80">
                                CLINICAL RECORDS: Upon approval, all health history will be securely transferred to your profile.
                            </p>
                        </div>

                        <DialogFooter className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAcquireDialogOpen(false)}
                                className="text-woof-charcoal/60 hover:text-woof-charcoal h-11 flex-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={acquisitionForm.processing}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal flex h-11 flex-[2] items-center justify-center gap-2 rounded-full text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                            >
                                {acquisitionForm.processing ? (
                                    'PROCESSING...'
                                ) : (
                                    <>
                                        REQUEST TRANSFER <ArrowRight className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
