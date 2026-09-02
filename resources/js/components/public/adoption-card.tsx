import { Button } from '@/components/ui/button';
import { AdoptionListing } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight, Award, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import SaveButton from './save-button';

interface AdoptionCardProps {
    listing: AdoptionListing;
    view?: 'grid' | 'list';
    idx?: number;
    htmlFor?: string;
    id?: string;
}

export default function AdoptionCard({ listing, view = 'grid', idx = 0, htmlFor, id }: AdoptionCardProps) {
    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgError(false);
        setIsLoaded(false);
    }, [listing.id, listing.featured_image_url]);

    const detailUrl = route('marketplace.adoption.show', { slug: listing.slug });
    const locationStr = [listing.city?.name, listing.state?.name].filter(Boolean).join(', ') || 'India';

    const hasValidImage = Boolean(listing.featured_image_url && listing.featured_image_url.trim() !== '' && !imgError);

    if (view === 'list') {
        return (
            <div
                className="animate-fade-in-up group border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 md:flex-row md:min-h-[230px]"
                style={{ animationDelay: `${idx * 0.05}s` }}
            >
                {/* Full-card link overlay */}
                <Link href={detailUrl} className="absolute inset-0 z-10 cursor-pointer">
                    <span className="sr-only">Meet {listing.title}</span>
                </Link>

                <div className="relative h-56 w-full shrink-0 overflow-hidden md:h-auto md:w-64 lg:w-72 bg-woof-cream/60">
                    {/* Underlying Zero-Delay Fallback Container */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r border-[#e8ded1]">
                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                            <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                        </div>
                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                    </div>

                    {/* Image Layer */}
                    {hasValidImage && (
                        <img
                            src={listing.featured_image_url!}
                            alt={listing.title}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setIsLoaded(true)}
                            onError={() => setImgError(true)}
                            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
                                isLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    )}

                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                        {(listing as any).is_sponsored ? (
                            <span className="bg-woof-gold text-white shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                                {(listing as any).is_sponsored_tier ? `${(listing as any).is_sponsored_tier} Sponsored` : 'Sponsored'}
                            </span>
                        ) : null}
                        <span className="bg-white/95 text-woof-charcoal border border-[#e8ded1] shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                            {listing.breed?.name || 'Rescue Companion'}
                        </span>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                        <SaveButton itemId={listing.id} itemType="adoption" isSaved={!!(listing as unknown as { is_saved?: boolean }).is_saved} className="rounded-full shadow-xs" />
                    </div>

                    {listing.fee && Number(listing.fee) === 0 && (
                        <div className="absolute bottom-4 left-4 z-20">
                            <div className="bg-woof-gold text-white rounded-full px-3 py-1 text-[8px] font-bold tracking-wider uppercase shadow-xs">
                                Free Adoption
                            </div>
                        </div>
                    )}

                    {listing.is_champion && (
                        <div className="absolute right-4 bottom-4 z-20">
                            <div className="bg-woof-charcoal text-woof-gold border border-woof-gold/30 flex items-center gap-1.5 rounded-full px-3 py-1 text-[8px] font-bold tracking-wider uppercase shadow-xs">
                                <Award className="h-3 w-3 text-woof-gold" /> Champion
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative flex flex-1 flex-col justify-center p-5 sm:p-6 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0 flex-1">
                            <div className="text-woof-charcoal/50 flex items-center gap-1.5 text-xs font-semibold uppercase">
                                <MapPin className="text-woof-gold h-3.5 w-3.5 shrink-0" /> {locationStr}
                            </div>

                            {htmlFor || id ? (
                                <label htmlFor={htmlFor} id={id} className="text-woof-charcoal group-hover:text-woof-gold text-lg sm:text-xl font-bold tracking-tight capitalize transition-colors duration-300 block cursor-pointer">
                                    {listing.title}
                                </label>
                            ) : (
                                <h4 className="text-woof-charcoal group-hover:text-woof-gold text-lg sm:text-xl font-bold tracking-tight capitalize transition-colors duration-300">
                                    {listing.title}
                                </h4>
                            )}
                        </div>

                        <div className="text-right shrink-0">
                            <span className="text-woof-charcoal/40 mb-0.5 block text-[9px] font-bold tracking-wider uppercase">
                                Contribution
                            </span>

                            <span className="text-woof-charcoal group-hover:text-woof-gold text-xl sm:text-2xl font-black tracking-tight uppercase transition-colors duration-300">
                                {listing.fee && Number(listing.fee) > 0 ? `₹${Number(listing.fee).toLocaleString()}` : 'Free'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <Clock className="text-woof-gold h-3.5 w-3.5" />
                            <span className="text-woof-charcoal/70 text-[11px] font-semibold uppercase">{listing.age || 'Adult'}</span>
                        </div>
                        <div className="bg-[#e8ded1] h-1 w-1 rounded-full" />

                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="text-woof-gold h-3.5 w-3.5" />
                            <span className="text-woof-charcoal/70 text-[11px] font-semibold uppercase">
                                {listing.gender || 'Male'}
                            </span>
                        </div>
                    </div>

                    {listing.description && (
                        <p className="text-woof-charcoal/60 text-xs leading-relaxed line-clamp-2 font-normal">{listing.description}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="animate-fade-in-up group border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1.5"
            style={{ animationDelay: `${idx * 0.05}s` }}
        >
            {/* Full-card link overlay */}
            <Link href={detailUrl} className="absolute inset-0 z-10 cursor-pointer">
                <span className="sr-only">Meet {listing.title}</span>
            </Link>

            <div className="relative aspect-4/3 overflow-hidden bg-woof-cream/60">
                {/* Underlying Zero-Delay Fallback Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center border-b border-[#e8ded1]">
                    <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                        <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                    </div>
                    <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                </div>

                {/* Image Layer */}
                {hasValidImage && (
                    <img
                        src={listing.featured_image_url!}
                        alt={listing.title}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}

                <div className="from-woof-charcoal/60 absolute inset-0 z-15 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                    {(listing as any).is_sponsored ? (
                        <span className="bg-woof-gold text-white shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                            {(listing as any).is_sponsored_tier ? `${(listing as any).is_sponsored_tier} Sponsored` : 'Sponsored'}
                        </span>
                    ) : null}
                    <span className="bg-white/95 text-woof-charcoal border border-[#e8ded1] shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                        {listing.breed?.name || 'Rescue Companion'}
                    </span>
                </div>

                <div className="absolute top-4 right-4 z-20">
                    <SaveButton itemId={listing.id} itemType="adoption" isSaved={!!(listing as unknown as { is_saved?: boolean }).is_saved} className="rounded-full shadow-xs" />
                </div>

                {listing.fee && Number(listing.fee) === 0 && (
                    <div className="absolute bottom-4 left-4 z-20">
                        <div className="bg-woof-gold text-white rounded-full px-3 py-1 text-[8px] font-bold tracking-wider uppercase shadow-xs">
                            Free Adoption
                        </div>
                    </div>
                )}

                {listing.is_champion && (
                    <div className="absolute right-4 bottom-4 z-20">
                        <div className="bg-woof-charcoal text-woof-gold border border-woof-gold/30 flex items-center gap-1.5 rounded-full px-3 py-1 text-[8px] font-bold tracking-wider uppercase shadow-xs">
                            <Award className="h-3 w-3 text-woof-gold" /> Champion
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex-1 space-y-2.5">
                    <div className="text-woof-charcoal/50 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                        <MapPin className="text-woof-gold h-3.5 w-3.5 shrink-0" /> {locationStr}
                    </div>

                    {htmlFor || id ? (
                        <label htmlFor={htmlFor} id={id} className="text-woof-charcoal group-hover:text-woof-gold line-clamp-1 text-lg font-bold tracking-tight capitalize transition-colors duration-300 block cursor-pointer">
                            {listing.title}
                        </label>
                    ) : (
                        <h4 className="text-woof-charcoal group-hover:text-woof-gold line-clamp-1 text-lg font-bold tracking-tight capitalize transition-colors duration-300">
                            {listing.title}
                        </h4>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-semibold capitalize">
                            <Clock className="text-woof-gold h-3.5 w-3.5 shrink-0" /> {listing.age || 'Adult'}
                        </div>

                        <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-semibold capitalize">
                            <ShieldCheck className="text-woof-gold h-3.5 w-3.5 shrink-0" /> {listing.gender || 'Male'}
                        </div>
                    </div>
                </div>

                <div className="border-[#e8ded1] flex items-center justify-between border-t pt-3.5 mt-4">
                    <div className="flex flex-col">
                        <span className="text-woof-charcoal/40 text-[9px] font-bold tracking-wider uppercase">Contribution</span>
                        <span className="text-woof-charcoal text-lg font-black tracking-tight uppercase group-hover:text-woof-gold transition-colors duration-300">
                            {listing.fee && Number(listing.fee) > 0 ? `₹${Number(listing.fee).toLocaleString()}` : 'Free'}
                        </span>
                    </div>

                    <Button
                        asChild
                        className="bg-woof-charcoal hover:bg-woof-gold text-white group/btn relative z-20 flex h-10 w-10 items-center justify-center rounded-full p-0 transition-all duration-300 shadow-xs"
                    >
                        <Link href={detailUrl}>
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
