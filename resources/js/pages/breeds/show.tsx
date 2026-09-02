import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShareDialog from '@/components/public/share-dialog';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DisplayAdBanner from '@/components/public/display-ad-banner';
import {
    Activity,
    ArrowRight,
    ArrowRightLeft,
    Brain,
    Calendar,
    ChevronRight,
    Clock,
    Dog,
    Eye,
    Heart,
    History,
    Info,
    MapPin,
    Palette,
    Ruler,
    Scale,
    Share2,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Zap,
} from 'lucide-react';

interface Breed {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    history: string | null;
    appearance: string | null;
    temperament: string | null;
    health: string | null;
    behavior: string | null;
    intelligence: string | null;
    use: string | null;
    variants: string | null;
    life_span: string | null;
    male_height: string | null;
    female_height: string | null;
    male_weight: string | null;
    female_weight: string | null;
    energy_level: string | null;
    breed_group: string | null;
    is_indian: boolean;
    other_names: string | null;
    size: string | null;
    coat_type: string | null;
    colors: string | null;
    origin: string | null;
    image_url: string | null;
}

interface Litter {
    id: number;
    title: string;
    slug: string;
    price: string | number | null;
    featured_image_url: string | null;
    breeder_name?: string | null;
    city: { name: string } | null;
    state: { name: string } | null;
}

interface PageProps {
    breed: Breed;
    relatedLitters: Litter[];
}

export default function BreedShow({ breed, relatedLitters = [] }: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [imgError, setImgError] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [breed.id, breed.image_url]);

    const hasValidImage = Boolean(breed.image_url && breed.image_url.trim() !== '' && !imgError);

    const detailedSections = [
        { id: 'overview', label: 'Breed Overview', icon: Info, content: breed.description, subtitle: 'Essential background and standard summary' },
        { id: 'history', label: 'History & Heritage', icon: History, content: breed.history, subtitle: 'Origins, ancestral lineage, and historical purpose' },
        { id: 'appearance', label: 'Appearance & Physicality', icon: Eye, content: breed.appearance, subtitle: 'Conformation, coat structure, and stature' },
        { id: 'temperament', label: 'Temperament & Character', icon: Heart, content: breed.temperament, subtitle: 'Household disposition, social nature, and loyalty' },
        { id: 'behavior', label: 'Behavior & Drive', icon: Dog, content: breed.behavior, subtitle: 'Instinctual habits, energy output, and social dynamics' },
        { id: 'intelligence', label: 'Intelligence & Trainability', icon: Brain, content: breed.intelligence, subtitle: 'Working aptitude, cognitive agility, and responsiveness' },
        { id: 'health', label: 'Health & Clinical Care', icon: Stethoscope, content: breed.health, subtitle: 'Lifespan considerations, genetic vitality, and wellness plans' },
        { id: 'use', label: 'Working Utility & Purpose', icon: ShieldCheck, content: breed.use, subtitle: 'Traditional tasks, sport versatility, and family roles' },
        { id: 'variants', label: 'Breed Variants & Lines', icon: Sparkles, content: breed.variants, subtitle: 'Recognized varieties, regional types, and bloodlines' },
    ].filter((s) => Boolean(s.content && s.content.trim() !== ''));

    const quickPillars = [
        { label: 'Life Expectancy', value: breed.life_span || '10 - 14 Years', icon: Clock, desc: 'Average healthy lifespan' },
        { label: 'Energy Level', value: breed.energy_level || 'Moderate to High', icon: Zap, desc: 'Daily activity requirement' },
        { label: 'Breed Group', value: breed.breed_group || 'Companion / Working', icon: Dog, desc: 'Official registry classification' },
        { label: 'Regional Origin', value: breed.origin || 'International', icon: MapPin, desc: 'Ancestral birthplace' },
    ];

    return (
        <PublicLayout>
            <Head title={`${breed.name} - Breed Information, History & Health Guide | ${settings.site_name}`} />

            {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl pointer-events-none select-none">
                    <img
                        src={
                            breed.image_url ||
                            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop'
                        }
                        alt="Background Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Breeds Guide', href: route('breeds.index') },
                                { title: breed.name, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        {/* Breed Portrait Card */}
                        <div className="group animate-reveal relative [animation-delay:400ms] shrink-0 w-full max-w-[340px] sm:max-w-[400px] mx-auto lg:mx-0">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidImage ? (
                                    <img
                                        src={breed.image_url!}
                                        alt={breed.name}
                                        onError={() => setImgError(true)}
                                        className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-3 flex h-16 w-16 items-center justify-center rounded-2xl">
                                            <img src="/images/favicon.png" alt="WoofCircle" className="h-8 w-8 object-contain" />
                                        </div>
                                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">Breed Portrait</span>
                                    </div>
                                )}
                            </div>

                            {breed.is_indian && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 text-white shadow-xl" title="Native Indian Breed">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                            )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                        {breed.breed_group || 'Purebred Registry'}
                                    </Badge>

                                    {breed.is_indian && (
                                        <Badge className="bg-woof-charcoal text-white rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider uppercase shadow-2xs">
                                            Native Indian Heritage
                                        </Badge>
                                    )}

                                    {breed.size && (
                                        <span className="text-woof-charcoal/60 text-xs font-bold tracking-wider uppercase bg-white px-3 py-1 rounded-full border border-[#e8ded1]">
                                            {breed.size} Build
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold tracking-tight">
                                    {breed.name}
                                </h1>

                                {breed.other_names && (
                                    <p className="text-woof-charcoal/60 text-xs sm:text-sm font-medium">
                                        Also referenced as: <span className="font-semibold text-woof-charcoal">{breed.other_names}</span>
                                    </p>
                                )}
                            </div>

                            {/* Quick Spec Tags */}
                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Clock className="text-woof-gold h-4 w-4" /> {breed.life_span || '10 - 14 Years'}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Ruler className="text-woof-gold h-4 w-4" /> {breed.male_height || breed.size || 'Standard Size'}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {breed.origin || 'International'}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="animate-reveal flex flex-wrap items-center gap-4 pt-2 [animation-delay:1000ms]">
                                <Button
                                    asChild
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal gap-2 rounded-full px-6 h-11 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all cursor-pointer"
                                >
                                    <Link href={route('breeds.compare', { breeds: breed.id })}>
                                        <ArrowRightLeft className="h-4 w-4" /> Compare Breed
                                    </Link>
                                </Button>

                                {relatedLitters.length > 0 && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-[#e8ded1] bg-white hover:bg-woof-cream/40 text-woof-charcoal rounded-full px-6 h-11 text-xs font-bold tracking-wider uppercase cursor-pointer"
                                    >
                                        <Link href={`#available-litters`}>
                                            <Dog className="text-woof-gold h-4 w-4 mr-2" /> View Puppies ({relatedLitters.length})
                                        </Link>
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => setIsShareOpen(true)}
                                    className="border-[#e8ded1] bg-white hover:bg-woof-cream/40 text-woof-charcoal h-11 w-11 rounded-full p-0 flex items-center justify-center cursor-pointer"
                                    title="Share Breed Guide"
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PHYSICAL & BEHAVIORAL MATRIX --- */}
            <section className="bg-white py-12 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {quickPillars.map((pillar) => {
                            const IconComponent = pillar.icon;
                            return (
                                <div
                                    key={pillar.label}
                                    className="border-[#e8ded1] group flex items-start gap-4 rounded-3xl border bg-[#fcfbf9] hover:bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 transition-all duration-300"
                                >
                                    <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300 mt-0.5">
                                        <IconComponent className="h-6 w-6 stroke-[1.75]" />
                                    </div>
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">
                                            {pillar.label}
                                        </span>
                                        <h4 className="text-woof-charcoal font-sans text-base font-bold tracking-tight truncate">
                                            {pillar.value}
                                        </h4>
                                        <p className="text-woof-charcoal/60 text-xs font-normal">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Detailed Specifications Row */}
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6">
                        <div className="space-y-1">
                            <span className="text-woof-charcoal/50 flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
                                <Ruler className="text-woof-gold h-3.5 w-3.5" /> Male Height
                            </span>
                            <p className="text-woof-charcoal font-sans text-sm font-bold">{breed.male_height || '22 - 26 inches'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-woof-charcoal/50 flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
                                <Scale className="text-woof-gold h-3.5 w-3.5" /> Male Weight
                            </span>
                            <p className="text-woof-charcoal font-sans text-sm font-bold">{breed.male_weight || '25 - 35 kg'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-woof-charcoal/50 flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
                                <Sparkles className="text-woof-gold h-3.5 w-3.5" /> Coat Structure
                            </span>
                            <p className="text-woof-charcoal font-sans text-sm font-bold">{breed.coat_type || 'Standard Coat'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-woof-charcoal/50 flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
                                <Palette className="text-woof-gold h-3.5 w-3.5" /> Color Varieties
                            </span>
                            <p className="text-woof-charcoal font-sans text-sm font-bold">{breed.colors || 'Standard Registry Colors'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DETAILED COMPREHENSIVE GUIDE --- */}
            <div className="bg-[#fcfbf9] py-20 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="flex flex-col gap-12 lg:flex-row items-start">
                        {/* Interactive Sticky Table of Contents */}
                        <div className="shrink-0 lg:w-1/3 lg:sticky lg:top-32 w-full space-y-6">
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs space-y-2">
                                <div className="space-y-1 border-b border-[#e8ded1] pb-4 mb-3">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Comprehensive Index</h3>
                                    <h4 className="font-sans text-lg font-bold text-woof-charcoal">
                                        Breed Knowledge Hub
                                    </h4>
                                </div>

                                <nav className="space-y-1.5">
                                    {detailedSections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="group flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-medium text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal transition-all border border-transparent hover:border-[#e8ded1]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-woof-cream group-hover:bg-woof-gold group-hover:text-white flex h-8 w-8 items-center justify-center rounded-xl border border-[#e8ded1] text-woof-gold transition-colors">
                                                    <section.icon className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-woof-charcoal">{section.label}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-woof-charcoal/30 group-hover:text-woof-gold transition-colors" />
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Comparison Side Banner */}
                            <div className="bg-woof-charcoal text-white rounded-3xl p-6 shadow-lg border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-woof-gold">
                                    <ArrowRightLeft className="h-5 w-5" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Breed Comparison</span>
                                </div>
                                <h4 className="font-sans text-lg font-bold">Wondering if {breed.name} is the best match?</h4>
                                <p className="text-white/70 text-xs leading-relaxed">
                                    Compare temperaments, exercise needs, size, and care requirements side-by-side with other breeds.
                                </p>
                                <Button
                                    asChild
                                    className="w-full bg-woof-gold hover:bg-woof-gold/90 text-woof-charcoal font-bold text-xs uppercase tracking-wider rounded-full h-10 shadow-sm"
                                >
                                    <Link href={route('breeds.compare', { breeds: breed.id })}>
                                        Launch Comparison Tool
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-8 lg:w-2/3 w-full">
                            {detailedSections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="border-[#e8ded1] scroll-mt-32 rounded-3xl border bg-white p-6 sm:p-8 shadow-xs space-y-5"
                                >
                                    <div className="flex items-start gap-4 border-b border-[#e8ded1] pb-5">
                                        <div className="bg-woof-cream text-woof-gold flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs">
                                            <section.icon className="h-6 w-6 stroke-[1.75]" />
                                        </div>

                                        <div className="space-y-1 min-w-0">
                                            <h2 className="text-woof-charcoal font-sans text-xl sm:text-2xl font-bold tracking-tight">
                                                {section.label}
                                            </h2>
                                            <p className="text-woof-charcoal/60 text-xs font-normal">
                                                {section.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: section.content
                                                ? (/<[a-z][\s\S]*>/i.test(section.content) ? section.content : section.content.replace(/\n/g, '<br/>'))
                                                : ''
                                        }}
                                    />
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RELATED LITTERS SPOTLIGHT --- */}
            <section id="available-litters" className="bg-white py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div className="space-y-1">
                            <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Verified Registry</h3>
                            <h4 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight font-sans">
                                Available {breed.name} Puppies & Litters
                            </h4>
                        </div>

                        <Button
                            asChild
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal gap-2 rounded-full px-6 h-11 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all cursor-pointer"
                        >
                            <Link href={route('marketplace.index', { breed_id: breed.id })}>
                                Explore All {breed.name} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {relatedLitters.length === 0 ? (
                        <div className="bg-[#fcfbf9] border-[#e8ded1] space-y-4 rounded-3xl border border-dashed p-12 text-center">
                            <div className="text-woof-gold mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#e8ded1] shadow-2xs">
                                <Dog className="h-7 w-7" />
                            </div>

                            <h5 className="text-woof-charcoal text-lg font-bold">No active litters listed today</h5>
                            <p className="text-woof-charcoal/60 text-xs font-medium max-w-md mx-auto">
                                Registered breeders regularly post verified litters. Check back soon or browse verified breeders directly.
                            </p>

                            <Button
                                asChild
                                variant="outline"
                                className="border-[#e8ded1] hover:bg-white text-woof-charcoal rounded-full px-6 h-10 text-xs font-bold tracking-wider uppercase cursor-pointer"
                            >
                                <Link href={route('marketplace.breeders.index')}>
                                    Browse Certified Breeders
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {relatedLitters.map((litter) => (
                                <div
                                    key={litter.id}
                                    className="group border-[#e8ded1] overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-2"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-woof-cream/20">
                                        {litter.featured_image_url ? (
                                            <img
                                                src={litter.featured_image_url}
                                                alt={litter.title}
                                                className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                                <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                                                    <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                                                </div>
                                                <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">Pedigree Litter</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-medium">
                                            <MapPin className="text-woof-gold h-3.5 w-3.5 shrink-0" /> {litter.city?.name || 'Location'}, {litter.state?.name || 'India'}
                                        </div>

                                        <h5 className="text-woof-charcoal line-clamp-1 text-base font-bold font-sans">
                                            {litter.title}
                                        </h5>

                                        {litter.breeder_name && (
                                            <p className="text-woof-charcoal/60 text-xs font-medium truncate">
                                                By <span className="font-semibold text-woof-charcoal">{litter.breeder_name}</span>
                                            </p>
                                        )}

                                        <div className="border-t border-[#e8ded1] flex items-center justify-between pt-3">
                                            <span className="text-woof-gold text-base font-bold">
                                                ₹{litter.price ? Number(litter.price).toLocaleString() : 'Price on Request'}
                                            </span>

                                            <Button
                                                asChild
                                                size="icon"
                                                className="bg-woof-cream text-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-9 w-9 rounded-full transition-all border border-[#e8ded1] cursor-pointer"
                                            >
                                                <Link href={litter.slug ? route('marketplace.litters.show', { slug: litter.slug }) : '#'}>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* --- DISPLAY BANNER AD & REGISTRY CTA BANNER --- */}
            <div className="container-wide px-6 pb-20 lg:px-12 space-y-10">
                <DisplayAdBanner slot="header_leaderboard" />
                <div className="bg-[#fcfbf9] border border-[#e8ded1] flex flex-col items-center justify-between gap-8 rounded-3xl p-8 sm:p-12 md:flex-row shadow-xs">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight font-sans">
                            Looking to Explore More Pedigree Breeds?
                        </h4>

                        <p className="text-woof-charcoal/70 text-sm font-normal max-w-xl">
                            Search our comprehensive registry with detailed profiles, behavioral matrices, and certified breeder litters.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-8 h-12 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                        >
                            <Link href="/breeds">Browse Breeds Registry</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Share Dialog */}
            <ShareDialog
                isOpen={isShareOpen}
                setIsOpen={setIsShareOpen}
                title={`${breed.name} Breed Guide`}
            />
        </PublicLayout>
    );
}
