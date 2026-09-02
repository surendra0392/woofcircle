import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DirectoryItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight, Dog, Facebook, GraduationCap, Home as HomeIcon, Instagram, MapPin, ShieldCheck, ShoppingBag, Star, Stethoscope, Twitter, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import SaveButton from './save-button';

interface DirectoryCardProps {
    item: DirectoryItem;
    type: 'vet' | 'trainer' | 'boarding' | 'welfare' | 'pet-shop' | 'breeder';
    view?: 'grid' | 'list';
    idx?: number;
}
export default function DirectoryCard({ item, type, view = 'grid', idx = 0 }: DirectoryCardProps) {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [item.id, item.logo_url]);

    const hasValidImage = Boolean(item.logo_url && item.logo_url.trim() !== '' && !imgError);
    const config = {
        vet: {
            icon: Stethoscope,
            color: 'bg-emerald-50 text-emerald-700',
            iconColor: 'text-emerald-700',
            label: 'Medical Clinic',
            routePrefix: 'directory.vets.show',
        },
        trainer: {
            icon: GraduationCap,
            color: 'bg-indigo-50 text-indigo-700',
            iconColor: 'text-indigo-700',
            label: 'Training Academy',
            routePrefix: 'directory.trainers.show',
        },
        boarding: {
            icon: HomeIcon,
            color: 'bg-sky-50 text-sky-700',
            iconColor: 'text-sky-700',
            label: 'Pet Boarding',
            routePrefix: 'directory.boarding.show',
        },
        breeder: {
            icon: ShieldCheck,
            color: 'bg-woof-gold/15 text-woof-gold',
            iconColor: 'text-woof-gold',
            label: 'Premium Breeder',
            routePrefix: 'marketplace.breeders.show',
        },
        welfare: {
            icon: ShieldCheck,
            color: 'bg-rose-50 text-rose-700',
            iconColor: 'text-rose-700',
            label: 'Rescue & Welfare',
            routePrefix: 'directory.welfare.show',
        },
        'pet-shop': {
            icon: ShoppingBag,
            color: 'bg-amber-50 text-amber-700',
            iconColor: 'text-amber-700',
            label: 'Pet Retail',
            routePrefix: 'directory.pet-shops.show',
        },
    };
    const current = config[type];
    const Icon = current.icon;
    const displayName = item.shop_name || item.clinic_name || item.organization_name || item.kennel_name || item.business_name || item.name;
    const detailUrl = route(current.routePrefix, { slug: item.slug });

    function SocialLinks({ className = "border-[#e8ded1] relative z-30 flex items-center gap-1.5 border-t pt-3 mt-3" }: { className?: string }) {
        const socials = [
            { key: 'facebook_url', icon: Facebook, label: 'Facebook' },
            { key: 'instagram_url', icon: Instagram, label: 'Instagram' },
            { key: 'twitter_url', icon: Twitter, label: 'Twitter' },
            { key: 'youtube_url', icon: Youtube, label: 'YouTube' },
        ] as const;

        const hasSocials = socials.some((s) => (item as any)[s.key]);
        if (!hasSocials || (type !== 'pet-shop' && type !== 'breeder')) return null;

        return (
            <div className={className}>
                {socials.map(({ key, icon: Icon, label }) => {
                    const url = (item as any)[key];
                    if (!url) return null;
                    return (
                        <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-woof-charcoal/40 hover:text-woof-gold flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#e8ded1] transition-all hover:border-woof-gold/40 hover:bg-woof-gold/10"
                            title={`Follow on ${label}`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </a>
                    );
                })}
            </div>
        );
    }

    if (view === 'list') {
        return (
            <div
                className="animate-fade-in-up group border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 md:flex-row md:min-h-[240px]"
                style={{ animationDelay: `${idx * 0.05}s` }}
            >
                {/* Full-card link overlay */}
                <Link href={detailUrl} className="absolute inset-0 z-10 cursor-pointer">
                    <span className="sr-only">View Details for {displayName}</span>
                </Link>

                <div className="relative h-56 w-full shrink-0 overflow-hidden md:h-auto md:w-64 lg:w-72 bg-woof-cream/60">
                    {!hasValidImage ? (
                        <div className="bg-woof-cream/60 absolute inset-0 flex h-full w-full flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r border-[#e8ded1]">
                            <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                                <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                            </div>
                            <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                        </div>
                    ) : (
                        <img
                            src={item.logo_url!}
                            alt={displayName}
                            onError={() => setImgError(true)}
                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    )}

                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        {(item as any).is_sponsored ? (
                            <Badge className="bg-woof-gold text-white border-transparent shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                                {(item as any).is_sponsored_tier ? `${(item as any).is_sponsored_tier} Sponsored` : 'Sponsored'}
                            </Badge>
                        ) : null}
                        <Badge className="bg-white/90 text-woof-charcoal border-[#e8ded1] shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                            {current.label}
                        </Badge>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                        <SaveButton itemId={item.id} itemType={type === 'pet-shop' ? 'pet_shop' : type} isSaved={!!(item as unknown as { is_saved?: boolean }).is_saved} className="rounded-full shadow-xs" />
                    </div>
                </div>

                <div className="relative flex flex-1 flex-col justify-center p-5 sm:p-6 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0 flex-1">
                            <div className="text-woof-charcoal/50 flex items-center gap-2 text-xs font-semibold uppercase">
                                <MapPin className="text-woof-gold h-3.5 w-3.5 shrink-0" /> {item.city?.name || 'India'} , {item.state?.name || 'India'}
                            </div>

                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-lg sm:text-xl font-bold tracking-tight capitalize transition-colors duration-300">
                                {displayName}
                            </h4>
                        </div>

                        <div className="text-right shrink-0">
                            <span className="text-woof-charcoal/40 mb-0.5 block text-[9px] font-bold tracking-wider uppercase"> Excellence Guide </span>
                            <span className="text-woof-gold group-hover:text-woof-charcoal text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300">
                                {type === 'pet-shop' ? 'Pet Store' : type === 'breeder' ? 'Breeder' : `₹${item.starting_price || '500'}`}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-[#fcfbf9] border-[#e8ded1] flex items-center gap-1.5 rounded-full border px-2.5 py-1 shadow-2xs">
                            <Star className="text-woof-gold fill-woof-gold h-3.5 w-3.5" />
                            <span className="text-xs text-woof-charcoal font-bold">{Number(item.average_rating || 0).toFixed(1)}</span>
                        </div>

                        {item.is_verified && (
                            <div className="bg-woof-charcoal rounded-full px-2.5 py-1 text-[8px] font-bold tracking-wider text-white uppercase shadow-xs">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="text-woof-gold h-3.5 w-3.5" /> Verified
                                </span>
                            </div>
                        )}

                        {(item.breeds || item.services || item.specialties || []).slice(0, 3).map((s: string | { name: string }, i: number) => (
                            <span
                                key={i}
                                className="bg-woof-cream/60 border-[#e8ded1] text-woof-charcoal/70 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase"
                            >
                                {typeof s === 'string' ? s : s.name}
                            </span>
                        ))}

                        <SocialLinks className="relative z-30 flex items-center gap-1.5" />
                    </div>

                    {item.description && (
                        <p className="text-woof-charcoal/60 text-xs leading-relaxed line-clamp-2 font-normal">{item.description}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="animate-fade-in-up group border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1.5"
            style={{ animationDelay: `${idx * 0.05}s` }}
        >
            {/* Full-card link overlay */}
            <Link href={detailUrl} className="absolute inset-0 z-10 cursor-pointer">
                <span className="sr-only">View Details for {displayName}</span>
            </Link>

            <div className="relative aspect-4/3 overflow-hidden bg-woof-cream/40">
                {!hasValidImage ? (
                    <div className="bg-woof-cream/60 absolute inset-0 flex h-full w-full flex-col items-center justify-center p-6 text-center border-b border-[#e8ded1]">
                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                            <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                        </div>
                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                    </div>
                ) : (
                    <img
                        src={item.logo_url!}
                        alt={displayName}
                        onError={() => setImgError(true)}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                )}

                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {(item as any).is_sponsored ? (
                        <Badge className="bg-woof-gold text-white border-transparent shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                            {(item as any).is_sponsored_tier ? `${(item as any).is_sponsored_tier} Sponsored` : 'Sponsored'}
                        </Badge>
                    ) : null}
                    <Badge className="bg-white/90 text-woof-charcoal border-[#e8ded1] shadow-xs rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase backdrop-blur-md">
                        {current.label}
                    </Badge>
                </div>

                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-[#e8ded1] bg-white/95 px-2.5 py-1 backdrop-blur-md shadow-xs">
                    <Star className="text-woof-gold fill-woof-gold h-3.5 w-3.5" />
                    <span className="text-woof-charcoal text-[11px] font-bold">{Number(item.average_rating || 0).toFixed(1)}</span>
                </div>

                <div className="absolute top-14 right-4 z-20">
                    <SaveButton itemId={item.id} itemType={type === 'pet-shop' ? 'pet_shop' : type} isSaved={!!(item as unknown as { is_saved?: boolean }).is_saved} className="rounded-full shadow-xs" />
                </div>

                {item.is_verified && (
                    <div className="absolute bottom-4 left-4 z-20">
                        <div className="bg-woof-charcoal shadow-xs rounded-full px-3 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="text-woof-gold h-3.5 w-3.5" /> <span>Verified</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex-1 space-y-2.5">
                    <div className="text-woof-charcoal/50 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                        <MapPin className="text-woof-gold h-3.5 w-3.5" /> {item.city?.name || 'India'} , {item.state?.name || 'India'}
                    </div>

                    <h4 className="text-woof-charcoal group-hover:text-woof-gold line-clamp-1 text-lg font-bold tracking-tight capitalize transition-colors duration-300">
                        {displayName}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 pt-1 relative z-20">
                        {(item.breeds || item.services || item.specialties || []).slice(0, 3).map((s: string | { name: string }, i: number) => (
                            <span
                                key={i}
                                className="bg-woof-cream/60 border-[#e8ded1] text-woof-charcoal/70 rounded-full border px-2.5 py-0.5 text-[8px] font-semibold uppercase transition-all"
                            >
                                {typeof s === 'string' ? s : s.name}
                            </span>
                        ))}
                    </div>

                    <SocialLinks />
                </div>

                <div className="border-[#e8ded1] flex items-center justify-between border-t pt-3.5 mt-4">
                    <div className="flex flex-col">
                        <span className="text-woof-charcoal/40 text-[9px] font-bold tracking-wider uppercase">Price Guide</span>
                        <span className="text-woof-charcoal text-lg font-black tracking-tight group-hover:text-woof-gold transition-colors duration-300">
                            {type === 'pet-shop' ? 'Retail' : type === 'breeder' ? 'Breeder' : `₹${item.starting_price || '500'}`}
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
