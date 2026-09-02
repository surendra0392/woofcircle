import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, Megaphone, ArrowUpRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export interface AdBannerData {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    banner_image_url?: string | null;
    target_url?: string | null;
    cta_text?: string | null;
    tier?: string;
    placement_slot?: string;
}

interface DisplayAdBannerProps {
    slot: 'header_leaderboard' | 'sidebar_square' | 'in_article';
    initialAd?: AdBannerData | null;
    className?: string;
    showFallback?: boolean;
}

export default function DisplayAdBanner({
    slot,
    initialAd = null,
    className = '',
    showFallback = true,
}: DisplayAdBannerProps) {
    const pageProps = usePage().props as any;
    const currentUser = pageProps.auth?.user;
    
    // Connoisseur & Elite members get 100% ad-free experience
    const isSubscriberAdFree =
        currentUser?.listing_tier_id === 2 ||
        currentUser?.listing_tier_id === 3 ||
        currentUser?.is_subscribed;

    const [ad, setAd] = useState<AdBannerData | null>(initialAd);
    const [isAdFree, setIsAdFree] = useState<boolean>(isSubscriberAdFree);
    const [hasLoaded, setHasLoaded] = useState<boolean>(!!initialAd);

    useEffect(() => {
        if (isSubscriberAdFree) {
            setIsAdFree(true);
            return;
        }

        if (!initialAd) {
            fetch(`/api/ads/banner/${slot}`, {
                headers: { Accept: 'application/json' },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.is_ad_free) {
                        setIsAdFree(true);
                    } else if (data.banner) {
                        setAd(data.banner);
                        // Track impression
                        fetch(`/api/ads/${data.banner.id}/impression`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN':
                                    document
                                        .querySelector('meta[name="csrf-token"]')
                                        ?.getAttribute('content') || '',
                            },
                        }).catch(() => {});
                    }
                    setHasLoaded(true);
                })
                .catch(() => setHasLoaded(true));
        } else if (initialAd) {
            // Track impression for initialAd
            fetch(`/api/ads/${initialAd.id}/impression`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            }).catch(() => {});
        }
    }, [slot, isSubscriberAdFree, initialAd]);

    if (isAdFree) {
        return null;
    }

    if (!ad && !showFallback && hasLoaded) {
        return null;
    }

    // 1. Header Leaderboard Banner (Wide horizontal format)
    if (slot === 'header_leaderboard') {
        if (ad) {
            return (
                <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ${className}`}>
                    <a
                        href={`/ads/${ad.id}/click`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-2xl sm:rounded-3xl border border-woof-gold/30 bg-gradient-to-r from-[#14120e] via-[#1c1917] to-[#14120e] p-4 sm:p-5 shadow-sm transition-all hover:border-woof-gold/60 hover:shadow-md"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                {ad.banner_image_url && (
                                    <img
                                        src={ad.banner_image_url}
                                        alt={ad.title || 'Advertisement'}
                                        className="h-12 w-16 sm:h-14 sm:w-20 rounded-xl object-cover border border-woof-gold/20 shrink-0"
                                    />
                                )}
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-woof-gold/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-woof-gold">
                                            <Sparkles className="h-2.5 w-2.5" /> Featured Partner
                                        </span>
                                    </div>
                                    <h4 className="truncate text-sm sm:text-base font-bold text-[#fcfbf9] group-hover:text-woof-gold transition-colors">
                                        {ad.title || 'Premium Canine Services'}
                                    </h4>
                                    {ad.subtitle && (
                                        <p className="truncate text-xs text-[#deb893]/80">
                                            {ad.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end shrink-0">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-woof-gold hover:bg-woof-champagne text-[#24221c] px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-xs group-hover:scale-[1.02]">
                                    {ad.cta_text || 'Explore Now'}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            );
        }

        // Leaderboard Fallback
        return (
            <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ${className}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl sm:rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] px-5 py-3.5 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#e8ded1] text-woof-gold shrink-0">
                            <Megaphone className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-woof-gold">
                                Verified Directory Showcase
                            </span>
                            <p className="text-xs font-medium text-woof-charcoal">
                                Reach over 50,000+ passionate pedigree owners and canine breeders across India.
                            </p>
                        </div>
                    </div>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-woof-charcoal hover:text-woof-gold uppercase tracking-wider shrink-0 transition-colors"
                    >
                        Advertise with WoofCircle →
                    </a>
                </div>
            </div>
        );
    }

    // 2. Sidebar 300x250 Square Card
    if (slot === 'sidebar_square') {
        if (ad) {
            return (
                <div className={`w-full ${className}`}>
                    <a
                        href={`/ads/${ad.id}/click`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-5 shadow-xs transition-all hover:border-woof-gold hover:shadow-md"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-woof-charcoal/70">
                                <Sparkles className="h-2.5 w-2.5 text-woof-gold" /> Sponsored
                            </span>
                            <span className="text-[9px] font-semibold text-woof-charcoal/40 uppercase tracking-widest">
                                Ad
                            </span>
                        </div>
                        {ad.banner_image_url && (
                            <div className="mb-3.5 h-36 w-full overflow-hidden rounded-2xl bg-[#fcfbf9] border border-[#e8ded1]">
                                <img
                                    src={ad.banner_image_url}
                                    alt={ad.title || 'Partner Ad'}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <h4 className="text-sm font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors leading-snug">
                            {ad.title || 'Featured Canine Spotlight'}
                        </h4>
                        {ad.subtitle && (
                            <p className="mt-1 line-clamp-2 text-xs text-woof-charcoal/70">
                                {ad.subtitle}
                            </p>
                        )}
                        <div className="mt-4 pt-3 border-t border-[#e8ded1]/60 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                {ad.cta_text || 'Learn More'}
                            </span>
                            <div className="h-7 w-7 rounded-full bg-woof-cream flex items-center justify-center text-woof-charcoal group-hover:bg-woof-gold group-hover:text-[#24221c] transition-all">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </a>
                </div>
            );
        }

        // Sidebar Fallback
        return (
            <div className={`w-full ${className}`}>
                <div className="rounded-3xl border border-[#e8ded1] bg-gradient-to-b from-[#fcfbf9] to-white p-5 shadow-xs text-center space-y-3">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#e8ded1] text-woof-gold shadow-2xs">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-woof-gold">
                            Partner Spotlight
                        </span>
                        <h4 className="text-xs font-bold text-woof-charcoal">
                            Promote Your Canine Brand
                        </h4>
                        <p className="text-[11px] text-woof-charcoal/60 leading-relaxed">
                            Feature your breeding program, clinic, or products directly to targeted canine enthusiasts.
                        </p>
                    </div>
                    <a
                        href="/contact"
                        className="inline-flex w-full items-center justify-center rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white py-2 text-[10px] font-bold uppercase tracking-wider transition-all shadow-xs"
                    >
                        Become a Partner
                    </a>
                </div>
            </div>
        );
    }

    // 3. In-Article / In-Feed Native Banner
    if (ad) {
        return (
            <div className={`my-8 w-full ${className}`}>
                <a
                    href={`/ads/${ad.id}/click`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-3xl border border-woof-gold/30 bg-[#fcfbf9] p-5 sm:p-6 shadow-xs transition-all hover:border-woof-gold hover:shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        {ad.banner_image_url && (
                            <img
                                src={ad.banner_image_url}
                                alt={ad.title || 'Partner Ad'}
                                className="h-24 w-full sm:w-32 rounded-2xl object-cover border border-[#e8ded1] shrink-0"
                            />
                        )}
                        <div className="flex-1 space-y-1 text-center sm:text-left">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-woof-gold">
                                <Sparkles className="h-2.5 w-2.5" /> Recommended Spotlight
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                {ad.title || 'Exceptional Canine Care & Heritage'}
                            </h4>
                            {ad.subtitle && (
                                <p className="text-xs text-woof-charcoal/70 line-clamp-2">
                                    {ad.subtitle}
                                </p>
                            )}
                        </div>
                        <div className="shrink-0">
                            <span className="inline-flex items-center gap-1 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">
                                {ad.cta_text || 'Explore'}
                                <ExternalLink className="h-3 w-3" />
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        );
    }

    // In-Article Fallback
    return (
        <div className={`my-8 w-full rounded-2xl border border-dashed border-[#e8ded1] bg-[#fcfbf9]/60 p-4 text-center ${className}`}>
            <p className="text-xs text-woof-charcoal/60">
                Interested in sponsoring curated editorial content on WoofCircle?{' '}
                <a href="/contact" className="font-bold text-woof-gold hover:underline">
                    Inquire about brand partnerships
                </a>
            </p>
        </div>
    );
}
