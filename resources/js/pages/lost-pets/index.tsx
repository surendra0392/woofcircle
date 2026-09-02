import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Check,
    Compass,
    Dog,
    Eye,
    HeartHandshake,
    MapPin,
    MessageCircle,
    Phone,
    Radio,
    RotateCcw,
    Search,
    Share2,
    ShieldAlert,
    Sparkles,
    User,
    Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Leaflet client-only imports
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface Pet {
    id: number;
    name: string;
    passport_number: string;
    gender: string;
    color: string;
    profile_image_url: string;
    lost_at: string;
    lost_location: string;
    lost_description: string;
    lost_lat: number | null;
    lost_lng: number | null;
    days_missing: number;
    breed: { name: string } | null;
    owner: { name: string; id: number } | null;
}

interface PageProps {
    lost_pets: {
        data: Pet[];
        links: any[];
        total: number;
    };
    states: { id: number; name: string }[];
    total_lost_count: number;
    filters: {
        state?: string;
        search?: string;
    };
}

// Custom Leaflet radar ping icon
const customIcon = typeof window !== 'undefined'
    ? L.divIcon({
          className: 'bg-transparent',
          html: `<div class="w-10 h-10 rounded-full border-2 border-rose-500 bg-[#1c1917] flex items-center justify-center text-rose-500 shadow-2xl overflow-hidden relative">
                   <div class="absolute inset-0 bg-rose-500/25 rounded-full animate-ping"></div>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 text-rose-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
      })
    : null;

function LostPetCard({ pet }: { pet: Pet }) {
    const [imgError, setImgError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [pet.id, pet.profile_image_url]);

    const hasValidImage = Boolean(pet.profile_image_url && pet.profile_image_url.trim() !== '' && !imgError);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.origin}/lost-pets?search=${encodeURIComponent(pet.passport_number || pet.name)}`);
            setCopied(true);
            toast.success(`SOS Alert for ${pet.name} copied to clipboard!`);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="border border-[#e8ded1] bg-white group overflow-hidden rounded-3xl shadow-xs hover:border-rose-300 hover:shadow-xl transition-all duration-300 p-3 flex flex-col justify-between">
            <div className="space-y-4">
                {/* Image Container */}
                <div className="aspect-[4/3] bg-woof-cream/20 relative overflow-hidden rounded-2xl">
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                        <span className="bg-rose-600 text-white text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                            Missing {pet.days_missing} {pet.days_missing === 1 ? 'Day' : 'Days'}
                        </span>
                    </div>

                    <button
                        onClick={handleShare}
                        title="Share SOS Alert"
                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-xs text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-white" />}
                    </button>

                    {hasValidImage ? (
                        <img
                            src={pet.profile_image_url}
                            alt={pet.name}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-woof-cream/60 p-4 text-center rounded-2xl">
                            <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                                <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                            </div>
                            <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Photo Available</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none rounded-2xl" />

                    <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-xl font-bold text-white font-sans tracking-tight">{pet.name}</h3>
                        <p className="text-rose-200 text-xs font-medium">
                            {pet.breed?.name || 'Unknown Breed'} • {pet.gender || 'Unknown Gender'}
                            {pet.color && ` • ${pet.color}`}
                        </p>
                    </div>
                </div>

                {/* Info Block */}
                <div className="space-y-3 px-1">
                    <div className="flex items-start gap-2 text-xs">
                        <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-woof-charcoal leading-snug">{pet.lost_location}</p>
                            <p className="text-[11px] text-woof-charcoal/60 mt-0.5">
                                Last seen: {new Date(pet.lost_at).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-rose-50/60 rounded-2xl p-3.5 border border-rose-100/80">
                        <p className="text-xs text-woof-charcoal/80 line-clamp-2 italic font-normal leading-relaxed">
                            "{pet.lost_description || 'No additional notes provided. If you spot this dog, please alert the owner immediately!'}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-4 border-t border-[#e8ded1] flex items-center justify-between px-1">
                <div>
                    <span className="text-[9px] text-woof-charcoal/50 font-bold uppercase tracking-wider block">Passport #</span>
                    <span className="text-xs font-mono font-bold text-woof-charcoal">{pet.passport_number}</span>
                </div>

                {pet.owner?.id ? (
                    <Button
                        asChild
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold tracking-wider uppercase px-5 h-9 rounded-full shadow-sm transition-all cursor-pointer"
                    >
                        <Link href={route('chat.initiate', pet.owner.id)}>
                            <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Contact Owner
                        </Link>
                    </Button>
                ) : (
                    <span className="text-xs font-semibold text-woof-charcoal/60">Community Alert</span>
                )}
            </div>
        </div>
    );
}

export default function LostPetsIndex({ lost_pets, states, total_lost_count, filters }: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        router.get(route('lost-pets.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const resetFilters = () => {
        router.get(route('lost-pets.index'));
    };

    const validMapPets = lost_pets.data.filter((pet) => pet.lost_lat && pet.lost_lng);
    const defaultCenter: [number, number] =
        validMapPets.length > 0
            ? [validMapPets[0].lost_lat as number, validMapPets[0].lost_lng as number]
            : [20.5937, 78.9629]; // India center default

    return (
        <PublicLayout>
            <Head title={`Lost & Missing Pet SOS Network | ${settings.site_name}`} />

            {/* --- CINEMATIC SOS HERO (LUXURY LIGHT THEME) --- */}
            <section className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Background Ambient Imagery */}
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl pointer-events-none select-none">
                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop"
                        alt="Lost Pets Ambient Backdrop"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Lost Pet SOS Network', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid items-end gap-10 lg:grid-cols-12">
                        <div className="space-y-4 lg:col-span-8">
                            <div className="animate-reveal flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
                                <Badge className="bg-rose-600 text-white rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider uppercase shadow-2xs flex items-center gap-1.5">
                                    <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Canine SOS Beacon
                                </Badge>
                                <span className="text-woof-charcoal/30">•</span>
                                <span className="text-woof-charcoal/70 text-xs font-semibold tracking-wider uppercase">
                                    5km Rapid Geocoded Alerts
                                </span>
                            </div>

                            <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                                Lost & Missing Pet Network
                            </h1>

                            <p className="text-woof-charcoal/80 animate-reveal max-w-2xl text-base sm:text-lg leading-relaxed font-normal" style={{ animationDelay: '0.4s' }}>
                                Help reunite lost dogs with their guardians. When a dog is reported missing, nearby pet parents receive immediate geo-targeted alerts. If you spot any of these companions, please contact the guardian immediately.
                            </p>

                            {/* Stat Chips */}
                            <div className="animate-reveal flex flex-wrap items-center gap-3 pt-2" style={{ animationDelay: '0.5s' }}>
                                <div className="bg-white border border-[#e8ded1] rounded-2xl px-5 py-2.5 shadow-2xs flex items-center gap-3">
                                    <span className="text-xl font-bold text-rose-600 font-sans">{total_lost_count}</span>
                                    <span className="text-xs font-bold text-woof-charcoal">Active SOS Alerts</span>
                                </div>
                                <div className="bg-white border border-[#e8ded1] rounded-2xl px-5 py-2.5 shadow-2xs flex items-center gap-3">
                                    <span className="text-xl font-bold text-emerald-600 font-sans">100%</span>
                                    <span className="text-xs font-bold text-woof-charcoal">Verified Passports</span>
                                </div>
                            </div>
                        </div>

                        {/* Search & State Filter Container */}
                        <div className="flex flex-col items-stretch justify-end gap-3 lg:col-span-4 lg:items-end">
                            <div className="w-full space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/60 mb-1.5 block">
                                        Filter by State / Region
                                    </label>
                                    <Select
                                        value={filters.state || 'all'}
                                        onValueChange={(val) => handleFilterChange('state', val === 'all' ? '' : val)}
                                    >
                                        <SelectTrigger className="h-11 w-full rounded-2xl border-[#e8ded1] bg-white text-woof-charcoal text-xs font-medium focus:ring-1 focus:ring-rose-500 shadow-2xs">
                                            <SelectValue placeholder="All States & Regions" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#e8ded1] text-woof-charcoal">
                                            <SelectItem value="all">All States & Regions</SelectItem>
                                            {states.map((s) => (
                                                <SelectItem key={s.id} value={s.id.toString()}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2 rounded-full border border-[#e8ded1] bg-white p-1.5 shadow-xs">
                                    <div className="text-woof-charcoal/70 flex flex-1 items-center gap-2.5 pl-3">
                                        <Search className="text-rose-500 h-4 w-4 shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Search name, breed, passport..."
                                            value={filters.search || ''}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && router.get(route('lost-pets.index'), filters, { preserveState: true })}
                                            className="text-woof-charcoal placeholder:text-woof-charcoal/40 text-xs h-10 w-full border-none bg-transparent px-0 font-medium outline-none focus:ring-0"
                                        />
                                    </div>

                                    <Button
                                        onClick={() => router.get(route('lost-pets.index'), filters, { preserveState: true })}
                                        className="bg-woof-charcoal hover:bg-rose-600 text-white h-10 cursor-pointer rounded-full px-5 text-xs font-bold tracking-wider uppercase shadow-xs transition-all shrink-0"
                                    >
                                        Search
                                    </Button>

                                    {(filters.state || filters.search) && (
                                        <Button
                                            onClick={resetFilters}
                                            variant="ghost"
                                            className="hover:bg-woof-cream/40 text-woof-charcoal flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-0 transition-all shrink-0"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LIVE INTERACTIVE SOS MAP --- */}
            <div className="bg-[#fcfbf9] py-12 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="rounded-3xl border border-[#e8ded1] bg-white overflow-hidden shadow-md">
                        <div className="p-4 sm:p-6 border-b border-[#e8ded1] flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2.5">
                                <div className="h-3 w-3 rounded-full bg-rose-500 animate-ping"></div>
                                <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-woof-charcoal">
                                    Geographic Beacon Radar
                                </h3>
                            </div>
                            <span className="text-xs font-semibold text-woof-charcoal/60">
                                {validMapPets.length} Mapped Alerts
                            </span>
                        </div>

                        <div className="h-[420px] w-full relative z-0">
                            {isMounted && customIcon && (
                                <MapContainer
                                    center={defaultCenter}
                                    zoom={validMapPets.length > 0 ? 6 : 5}
                                    scrollWheelZoom={false}
                                    className="h-full w-full z-0"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {validMapPets.map((pet) => (
                                        <Marker
                                            key={`map-${pet.id}`}
                                            position={[pet.lost_lat as number, pet.lost_lng as number]}
                                            icon={customIcon}
                                        >
                                            <Popup className="lost-pet-popup">
                                                <div className="text-center w-52 p-2 space-y-2">
                                                    {pet.profile_image_url && (
                                                        <img
                                                            src={pet.profile_image_url}
                                                            alt={pet.name}
                                                            className="w-full h-28 object-cover rounded-xl shadow-xs"
                                                        />
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-woof-charcoal text-base font-sans leading-tight">
                                                            {pet.name}
                                                        </h4>
                                                        <p className="text-xs text-rose-600 font-semibold">
                                                            {pet.breed?.name || 'Unknown Breed'}
                                                        </p>
                                                        <p className="text-[11px] text-woof-charcoal/70 mt-1 leading-snug">
                                                            {pet.lost_location}
                                                        </p>
                                                    </div>
                                                    {pet.owner?.id && (
                                                        <Link
                                                            href={route('chat.initiate', pet.owner.id)}
                                                            className="inline-flex items-center justify-center w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold tracking-wider uppercase py-2 transition-colors rounded-full shadow-sm"
                                                        >
                                                            Contact Owner
                                                        </Link>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LOST PETS GRID --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12 space-y-8">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                        <div className="space-y-1">
                            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Active Search Notices</h2>
                            <h3 className="text-2xl font-bold font-sans text-woof-charcoal">Reported Missing Dogs</h3>
                        </div>
                        <span className="text-xs font-semibold text-woof-charcoal/60">
                            {lost_pets.total || lost_pets.data.length} Total Alerts
                        </span>
                    </div>

                    {lost_pets.data.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[#e8ded1] space-y-4 shadow-xs">
                            <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mx-auto flex items-center justify-center shadow-2xs">
                                <Check className="h-8 w-8 stroke-[2.5]" />
                            </div>
                            <div className="space-y-1 max-w-md mx-auto">
                                <h3 className="text-2xl font-bold font-sans text-woof-charcoal">No Lost Pets Reported</h3>
                                <p className="text-xs text-woof-charcoal/70 font-normal leading-relaxed">
                                    No dogs match your current search and location criteria.
                                </p>
                            </div>
                            <Button
                                onClick={resetFilters}
                                className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs px-8 h-11 shadow-sm transition-all cursor-pointer"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lost_pets.data.map((pet) => (
                                <LostPetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    )}

                    {lost_pets.links && lost_pets.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination links={lost_pets.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* --- HOW THE SOS SYSTEM WORKS --- */}
            <div className="bg-white py-20 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="flex items-center justify-center gap-2 text-rose-600">
                            <ShieldAlert className="h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Rapid Community Protocol</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold font-sans text-woof-charcoal">
                            How the WoofCircle SOS System Works
                        </h3>
                        <p className="text-sm text-woof-charcoal/70 leading-relaxed font-normal">
                            Every pet registered on WoofCircle possesses a Digital Canine Passport. When an emergency happens, our network responds in seconds.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 space-y-4 shadow-xs">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shadow-2xs">
                                1
                            </div>
                            <h4 className="text-lg font-bold font-sans text-woof-charcoal">5km Geo-Radius Alert</h4>
                            <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                Once reported, our system geocodes the missing location and instantly alerts all registered guardians, breeders, and vets in a 5km radius.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 space-y-4 shadow-xs">
                            <div className="h-12 w-12 rounded-2xl bg-woof-cream border border-[#e8ded1] text-woof-gold flex items-center justify-center font-bold text-lg shadow-2xs">
                                2
                            </div>
                            <h4 className="text-lg font-bold font-sans text-woof-charcoal">Live Passport Broadcast</h4>
                            <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                The dog's microchip, unique identifying markings, and digital passport profile are published across the active SOS Beacon map.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 space-y-4 shadow-xs">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-2xs">
                                3
                            </div>
                            <h4 className="text-lg font-bold font-sans text-woof-charcoal">Direct Guardian Contact</h4>
                            <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                Anyone who spots the dog can immediately initiate a secure direct chat or call with the verified guardian to coordinate safe reunion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
