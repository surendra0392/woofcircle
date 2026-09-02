import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    Building2,
    Check,
    Compass,
    Crosshair,
    Loader2,
    MapPin,
    Navigation,
    RotateCcw,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    BangaloreIcon,
    DelhiIcon,
    FaridabadIcon,
    GhaziabadIcon,
    GreaterNoidaIcon,
    GurugramIcon,
    HyderabadIcon,
    JaipurIcon,
    MumbaiIcon,
    NoidaIcon,
    PuneIcon,
} from './icons/CityIcons';

const POPULAR_CITIES = [
    { name: 'Delhi', region: 'NCR', icon: DelhiIcon },
    { name: 'Mumbai', region: 'Maharashtra', icon: MumbaiIcon },
    { name: 'Bengaluru', region: 'Karnataka', icon: BangaloreIcon },
    { name: 'Hyderabad', region: 'Telangana', icon: HyderabadIcon },
    { name: 'Gurugram', region: 'Haryana', icon: GurugramIcon },
    { name: 'Noida', region: 'UP', icon: NoidaIcon },
    { name: 'Pune', region: 'Maharashtra', icon: PuneIcon },
    { name: 'Jaipur', region: 'Rajasthan', icon: JaipurIcon },
    { name: 'Faridabad', region: 'Haryana', icon: FaridabadIcon },
    { name: 'Ghaziabad', region: 'UP', icon: GhaziabadIcon },
    { name: 'Greater Noida', region: 'UP', icon: GreaterNoidaIcon },
];

export function LocationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { props } = usePage<SharedData>();
    const { user_location } = props;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ id: number; name: string; state: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [nearbyCities, setNearbyCities] = useState<{ id: number; name: string; state: string }[]>([]);

    useEffect(() => {
        if (isOpen && user_location) {
            fetch('/api/location/nearby')
                .then((res) => res.json())
                .then((data) => setNearbyCities(data))
                .catch(console.error);
        }
    }, [isOpen, user_location]);

    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            setIsSearching(true);
            const timeoutId = setTimeout(async () => {
                try {
                    const response = await fetch('/api/location/search?q=' + encodeURIComponent(searchQuery.trim()));
                    const data = await response.json();
                    setSearchResults(data);
                } catch (error) {
                    console.error('Error searching cities:', error);
                } finally {
                    setIsSearching(false);
                }
            }, 250);
            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchQuery]);

    const handleSelectLocation = async (cityId?: number, lat?: number, lng?: number) => {
        const payload = cityId ? { city_id: cityId } : { latitude: lat, longitude: lng };

        router.post('/api/location/set', payload, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleSelectPopularCity = async (cityName: string) => {
        setIsSearching(true);
        try {
            const response = await fetch('/api/location/search?q=' + encodeURIComponent(cityName));
            const data = await response.json();
            if (data && data.length > 0) {
                handleSelectLocation(data[0].id);
            }
        } catch (error) {
            console.error('Error finding city:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        setIsLocating(true);

        const fallbackToIpLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.latitude && data.longitude) {
                    handleSelectLocation(undefined, data.latitude, data.longitude);
                } else {
                    alert('Unable to retrieve location automatically. Please search for your city manually.');
                }
            } catch {
                alert('Unable to retrieve location automatically. Please search for your city manually.');
            } finally {
                setIsLocating(false);
            }
        };

        if ('geolocation' in navigator) {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
                if (permissionStatus.state === 'denied') {
                    await fallbackToIpLocation();
                    return;
                }
            } catch {
                // Permissions API not supported
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    handleSelectLocation(undefined, position.coords.latitude, position.coords.longitude);
                    setIsLocating(false);
                },
                (error) => {
                    console.error('Error getting location via browser:', error);
                    fallbackToIpLocation();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 0,
                },
            );
        } else {
            fallbackToIpLocation();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl sm:max-w-3xl md:max-w-4xl w-[94vw] rounded-3xl p-0 overflow-hidden bg-white border border-[#e8ded1] shadow-2xl">
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-woof-gold animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-woof-gold">
                                Location Preferences
                            </span>
                        </div>
                        <DialogTitle className="text-2xl sm:text-3xl font-bold font-sans text-woof-charcoal tracking-tight">
                            Select Your Location
                        </DialogTitle>
                        <p className="text-xs sm:text-sm text-woof-charcoal/70 font-normal leading-relaxed">
                            Discover certified breeders, puppies, verified veterinarians, and pet events in your area.
                        </p>
                    </div>

                    {/* Active / Current Location Strip & Auto Detect */}
                    <div className="mb-6 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">
                                    Current Selection
                                </p>
                                <p className="text-sm font-bold font-sans text-woof-charcoal">
                                    {user_location?.name || 'All India / Nationwide'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            className="flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-white hover:bg-woof-charcoal hover:text-white text-woof-charcoal border border-[#e8ded1] hover:border-woof-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
                        >
                            {isLocating ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-woof-gold" />
                                    <span>Detecting...</span>
                                </>
                            ) : (
                                <>
                                    <Crosshair className="h-3.5 w-3.5 text-woof-gold" />
                                    <span>Use Current Location</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Search Input Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-woof-gold" />
                        <input
                            type="text"
                            placeholder="Search by city, area, state, or locality..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-11 pr-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs sm:text-sm font-medium text-woof-charcoal placeholder:text-woof-charcoal/40 focus:outline-none focus:ring-1 focus:ring-woof-gold focus:border-woof-gold shadow-xs transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>

                    {/* Content Section: Search Results vs Popular Cities */}
                    {searchQuery.trim().length >= 2 ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[#e8ded1] pb-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/60">
                                    Search Results
                                </h3>
                                {isSearching && <Loader2 className="h-3.5 w-3.5 animate-spin text-woof-gold" />}
                            </div>

                            {isSearching ? (
                                <div className="py-12 text-center text-xs text-woof-charcoal/60 font-medium">
                                    Searching cities across India...
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                                    {searchResults.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => handleSelectLocation(city.id)}
                                            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold hover:shadow-sm text-left transition-all group cursor-pointer"
                                        >
                                            <div className="h-8 w-8 rounded-xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shrink-0 group-hover:bg-woof-gold group-hover:text-white transition-colors">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-bold font-sans text-woof-charcoal group-hover:text-woof-gold truncate transition-colors">
                                                    {city.name}
                                                </p>
                                                <p className="text-[10px] text-woof-charcoal/60 truncate font-medium">
                                                    {city.state}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-2 rounded-2xl border border-dashed border-[#e8ded1] bg-[#fcfbf9]">
                                    <MapPin className="h-6 w-6 text-woof-charcoal/40 mx-auto" />
                                    <p className="text-xs text-woof-charcoal/70 font-medium">
                                        No cities found matching "{searchQuery}".
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Popular Cities Grid */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-[#e8ded1] pb-2">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/60">
                                        Popular Metropolitan Hubs
                                    </h3>
                                    <span className="text-[10px] font-semibold text-woof-charcoal/40 uppercase">
                                        Major Canine Centers
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {POPULAR_CITIES.map((city) => {
                                        const isCurrent = user_location?.name?.toLowerCase().includes(city.name.toLowerCase());

                                        return (
                                            <button
                                                key={city.name}
                                                onClick={() => handleSelectPopularCity(city.name)}
                                                className={`group relative flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-center h-28 ${
                                                    isCurrent
                                                        ? 'bg-woof-cream/60 border-woof-gold shadow-xs ring-1 ring-woof-gold'
                                                        : 'bg-[#fcfbf9] hover:bg-white border-[#e8ded1] hover:border-woof-gold hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                            >
                                                {isCurrent && (
                                                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-woof-gold text-white flex items-center justify-center shadow-xs">
                                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                                    </div>
                                                )}

                                                {/* Landmark Architectural Illustration */}
                                                <div className="h-12 w-full flex items-center justify-center text-woof-charcoal/60 group-hover:text-woof-gold transition-colors">
                                                    <city.icon className="h-10 w-auto max-w-[48px] object-contain transition-transform duration-300 group-hover:scale-110" />
                                                </div>

                                                {/* City Name & Region Pill */}
                                                <div className="w-full">
                                                    <span className="block text-xs font-bold font-sans text-woof-charcoal group-hover:text-woof-gold transition-colors truncate">
                                                        {city.name}
                                                    </span>
                                                    <span className="block text-[9px] font-semibold text-woof-charcoal/50 uppercase tracking-wider truncate">
                                                        {city.region}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Nearby Areas */}
                            {user_location && nearbyCities.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/60">
                                        Nearby Cities & Districts
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                                        {nearbyCities.map((city) => (
                                            <button
                                                key={city.id}
                                                onClick={() => handleSelectLocation(city.id)}
                                                className="flex items-center gap-2 p-2.5 rounded-xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold hover:shadow-xs transition-all text-left group cursor-pointer"
                                            >
                                                <MapPin className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                                <span className="text-xs font-bold font-sans text-woof-charcoal group-hover:text-woof-gold truncate">
                                                    {city.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
