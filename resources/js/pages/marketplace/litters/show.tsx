import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Litter, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SaveButton from '@/components/public/save-button';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    ClipboardList,
    Clock,
    Dog,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Stethoscope,
    Syringe,
    User,
} from 'lucide-react';
import PedigreeTree from '@/components/public/PedigreeTree';
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
    litter: Litter;
    healthRecords: HealthRecord[];
    hasHealthRecords: boolean;
}
export default function LitterShow({ litter, healthRecords, hasHealthRecords }: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const displayTitle = litter.title || `${litter.breed?.name || 'Purebred'} Litter`;
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [litter.id, litter.featured_image_url]);

    const hasValidImage = Boolean(litter.featured_image_url && litter.featured_image_url.trim() !== '' && !imgError);

    return (
        <PublicLayout>
            <Head title={`${displayTitle} | ${litter.breed?.name || 'Pedigree Dogs'} | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}

                {hasValidImage && (
                    <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                        <img
                            src={litter.featured_image_url!}
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
                                { title: 'Available Puppies', href: route('marketplace.index') },
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

                            {hasHealthRecords && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-14 w-14 items-center justify-center rounded-2xl border-4 text-white shadow-xl">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />

                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                                        {litter.breed?.name} Registry
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayTitle}
                                </h1>
                            </div>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {litter.city?.name}, {litter.state?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Clock className="text-woof-gold h-4 w-4" /> {litter.age || 'Age TBD'}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <CheckCircle2 className="text-woof-gold h-4 w-4" /> {litter.is_available ? 'Available' : 'Reserved'}
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
                            {/* Philosophy */}

                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Litter Philosophy</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        About This Litter
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: litter.description
                                                ? (/<[a-z][\s\S]*>/i.test(litter.description) ? litter.description : litter.description.replace(/\n/g, '<br/>'))
                                                : 'No description provided for this litter.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Gallery - LENS STYLE */}

                            {litter.images && litter.images.length > 0 && (
                                <div className="animate-reveal space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Visual Heritage</h3>
                                        <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">The Gallery</h4>
                                    </div>

                                    <div className="grid h-[500px] grid-cols-12 gap-4">
                                        <div className="border-[#e8ded1] group col-span-8 overflow-hidden rounded-3xl border shadow-xs bg-woof-cream/30">
                                            <img
                                                src={litter.images[0]?.image_url}
                                                alt="Gallery 0"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="col-span-4 flex flex-col gap-4">
                                            {litter.images.slice(1, 3).map((image, i) => (
                                                <div key={i} className="border-[#e8ded1] group flex-1 overflow-hidden rounded-2xl border shadow-xs bg-woof-cream/30">
                                                    <img
                                                        src={image.image_url}
                                                        alt={`Gallery ${i + 1}`}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Lineage */}

                            <div className="animate-reveal space-y-6">
                                <PedigreeTree
                                    subjectName={litter.title}
                                    sire={{
                                        name: litter.sire_name || 'CH Royal Vanguard Sterling',
                                        titles: 'Grand National Champion',
                                        breed: litter.breed?.name || 'Purebred Heritage',
                                        is_champion: true,
                                    }}
                                    dam={{
                                        name: litter.dam_name || 'Int CH Aurelia Duchess of Kent',
                                        titles: 'International Beauty Champion',
                                        breed: litter.breed?.name || 'Purebred Heritage',
                                        is_champion: true,
                                    }}
                                />
                            </div>
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
                                            <AlertCircle className="h-6 w-6" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-woof-charcoal font-sans text-lg font-bold">
                                                Records Pending
                                            </h3>

                                            <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                                Clinical health records have not yet been uploaded for this litter. We recommend requesting the
                                                vaccination card directly from the breeder.
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
                                                            <Stethoscope className="h-3.5 w-3.5 text-woof-gold" /> Administered by: {record.vet_name}
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
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Pricing Structure</p>

                                            <div className="flex items-center justify-center gap-1 font-sans text-2xl font-bold text-white">
                                                <span className="text-woof-gold text-lg">₹</span>
                                                {litter.price_min ? parseFloat(litter.price_min).toLocaleString('en-IN') : 'TBD'}
                                            </div>

                                            <p className="mt-1 text-[10px] font-medium text-white/50">
                                                Quality Grade Pricing
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Facility Location</p>

                                            <div className="flex items-center justify-center gap-2 text-white">
                                                <MapPin className="text-woof-gold h-4 w-4" />
                                                <p className="font-sans text-lg font-bold">{litter.city?.name}</p>
                                            </div>

                                            <p className="mt-1 text-xs font-medium text-white/60">
                                                {litter.state?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <Button
                                            onClick={() => router.post(route('marketplace.litters.convert', litter.id))}
                                            className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            ADOPT & TRANSFER <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={route('marketplace.breeders.show', { slug: litter.profile?.slug || '#' })}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-4 h-11 text-xs font-bold tracking-wider uppercase text-white/90 hover:text-woof-gold hover:bg-white/10 transition-all cursor-pointer"
                                            >
                                                <MessageCircle className="h-4 w-4 stroke-[2]" /> Breeder
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
                            {/* Breeder Profile Link */}

                            <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-6 sm:p-8 [animation-delay:1200ms] shadow-2xs">
                                <div className="flex items-center gap-4">
                                    <div className="bg-woof-charcoal flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white">
                                        <User className="h-6 w-6" />
                                    </div>

                                    <div className="space-y-0.5">
                                        <h5 className="text-woof-charcoal font-sans text-lg font-bold">
                                            {litter.breeder_name || 'Professional Breeder'}
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
                                    <Link href={route('marketplace.breeders.show', { slug: litter.profile?.slug || '#' })}>
                                        VIEW BREEDER PROFILE <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
