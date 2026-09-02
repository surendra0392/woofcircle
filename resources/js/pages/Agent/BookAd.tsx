import React, { useState, useEffect } from 'react';
import AgentLayout from '@/layouts/AgentLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Loader2, MapPin, Image as ImageIcon, ChevronRight, ChevronLeft, CheckCircle2, Megaphone, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface Props {
    states: any[];
    cities: any[];
}

export default function BookAd({ states, cities }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        placement_slot: 'listing_boost',
        promotable_type: 'App\\Models\\DirectoryProfile',
        promotable_id: '',
        title: '',
        subtitle: '',
        target_url: '',
        cta_text: 'Learn More',
        banner_image: null as File | null,
        tier: '',
        duration: '1m',
        starts_at: new Date().toISOString().split('T')[0],
        targeted_state_ids: [] as number[],
        targeted_city_ids: [] as number[],
        request_discount: false,
        discount_type: 'fixed',
        discount_amount: '',
        discount_reason: ''
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [liveStatus, setLiveStatus] = useState<{available: boolean, message: string, next_available_date?: string, price?: number} | null>(null);
    const [isCheckingLive, setIsCheckingLive] = useState(false);

    // Step 1: Search Filters
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchStateId, setSearchStateId] = useState('');
    const [searchCityId, setSearchCityId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

    const searchCities = searchStateId 
        ? cities.filter(c => c.state_id.toString() === searchStateId) 
        : cities;

    const targetCities = data.targeted_state_ids.length > 0 
        ? cities.filter(c => data.targeted_state_ids.includes(c.state_id))
        : cities;

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoadingProfiles(true);
            try {
                const params = new URLSearchParams({
                    q: searchQuery,
                    category: categoryFilter === 'all' ? '' : categoryFilter,
                    search_state_id: searchStateId,
                    search_city_id: searchCityId
                });
                const response = await fetch(`/agent/book-ad/search?${params.toString()}`, {
                    headers: { 
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const resData = await response.json();
                    setProfiles(resData);
                }
            } catch (error) {
                console.error("Failed to fetch profiles", error);
            } finally {
                setIsLoadingProfiles(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProfiles();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, categoryFilter, searchStateId, searchCityId]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (!data.tier || !data.duration || !data.starts_at) {
                setLiveStatus(null);
                return;
            }
            
            setIsCheckingLive(true);
            try {
                // @ts-ignore
                const response = await window.axios.post('/agent/book-ad/check-availability', {
                    tier: data.tier,
                    duration: data.duration,
                    starts_at: data.starts_at,
                    targeted_state_ids: data.targeted_state_ids,
                    targeted_city_ids: data.targeted_city_ids
                });
                
                setLiveStatus(response.data);
            } catch (err) {
                console.error("Failed to check availability", err);
            } finally {
                setIsCheckingLive(false);
            }
        };

        if (currentStep === 3) {
            const timer = setTimeout(checkAvailability, 400);
            return () => clearTimeout(timer);
        }
    }, [data.tier, data.duration, data.starts_at, data.targeted_state_ids, data.targeted_city_ids, currentStep]);

    const selectedProfile = profiles.find(p => p.id.toString() === data.promotable_id && p.promotable_type === data.promotable_type);

    const handleCategoryChange = (val: string) => {
        setCategoryFilter(val);
        setData('promotable_id', '');
    };

    const handleStateChange = (val: string) => {
        setSearchStateId(val === 'all' ? '' : val);
        setSearchCityId('');
        setData('promotable_id', '');
    };

    const handleCityChange = (val: string) => {
        setSearchCityId(val === 'all' ? '' : val);
        setData('promotable_id', '');
    };

    const isStep1Valid = data.placement_slot === 'listing_boost'
        ? !!data.promotable_id
        : (!!data.title && !!data.target_url);

    const isStep3Valid = !!data.tier && !!data.duration && !!data.starts_at && !!liveStatus?.available && 
        (!data.request_discount || (!!data.discount_amount && !!data.discount_reason && (
            data.discount_type === 'percentage' 
                ? parseFloat(data.discount_amount) > 0 && parseFloat(data.discount_amount) <= 100
                : parseFloat(data.discount_amount) < (liveStatus.price || 0)
        )));

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('banner_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AgentLayout title="Book Advertisement Placement">
            <Head title="Book Ad Placement" />

            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs shrink-0">
                        <Megaphone className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Book Advertisement Placement</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Select an onboarded vendor or create custom visual display banners with location reach and duration.</p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs">
                    <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#e8ded1] -z-0 rounded-full"></div>
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-woof-gold -z-0 transition-all duration-300 rounded-full"
                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                        ></div>
                        
                        {[
                            { step: 1, label: '1. Ad Creative & Format' },
                            { step: 2, label: '2. Location Reach' },
                            { step: 3, label: '3. Schedule & Tier' },
                        ].map(({ step, label }) => (
                            <div key={step} className="flex flex-col items-center relative z-10">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all cursor-pointer ${
                                    currentStep === step 
                                        ? 'bg-woof-charcoal border-woof-charcoal text-white shadow-xs' 
                                        : currentStep > step 
                                            ? 'bg-woof-gold border-woof-gold text-woof-charcoal'
                                            : 'bg-white border-[#e8ded1] text-woof-charcoal/40'
                                }`}>
                                    {currentStep > step ? <Check className="size-4 stroke-[3]" /> : step}
                                </div>
                                <span className={`text-[11px] font-bold mt-2 whitespace-nowrap ${currentStep >= step ? 'text-woof-charcoal' : 'text-woof-charcoal/40'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* STEP 1: Search and Select or Banner Builder */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-lg font-bold text-woof-charcoal">Step 1: Choose Ad Format & Placement</h2>
                                    <p className="text-xs text-woof-charcoal/60 mt-0.5">Select whether you want to boost an existing directory profile or create a custom visual banner ad.</p>
                                </div>

                                {/* Slot / Format Selector */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { id: 'listing_boost', title: 'Listing Boost', desc: 'Promoted in search feeds' },
                                        { id: 'header_leaderboard', title: 'Header Leaderboard', desc: 'Top of page wide banner' },
                                        { id: 'sidebar_square', title: 'Sidebar 300×250', desc: 'Directory & Article sidebar' },
                                        { id: 'in_article', title: 'In-Article Banner', desc: 'Editorial feed placement' },
                                    ].map((slot) => {
                                        const isSelected = data.placement_slot === slot.id;
                                        return (
                                            <div
                                                key={slot.id}
                                                onClick={() => {
                                                    setData('placement_slot', slot.id);
                                                }}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                                                    isSelected
                                                        ? 'border-woof-gold bg-woof-gold/10 ring-1 ring-woof-gold shadow-2xs'
                                                        : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold/50'
                                                }`}
                                            >
                                                <div className="text-xs font-bold text-woof-charcoal flex items-center justify-between">
                                                    {slot.title}
                                                    {isSelected && <CheckCircle2 className="size-3.5 text-woof-gold shrink-0" />}
                                                </div>
                                                <div className="text-[10px] text-woof-charcoal/60 leading-tight">
                                                    {slot.desc}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Format A: Listing Boost */}
                                {data.placement_slot === 'listing_boost' ? (
                                    <div className="space-y-4 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Category</Label>
                                                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                                                    <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                                        <SelectValue placeholder="All Categories" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                        <SelectItem value="all">All Categories</SelectItem>
                                                        <SelectItem value="vet">Veterinarians</SelectItem>
                                                        <SelectItem value="pet_shop">Pet Shops</SelectItem>
                                                        <SelectItem value="breeder">Breeders</SelectItem>
                                                        <SelectItem value="trainer">Trainers</SelectItem>
                                                        <SelectItem value="boarding">Boarding/Daycare</SelectItem>
                                                        <SelectItem value="adoption">Adoptions</SelectItem>
                                                        <SelectItem value="litter">Litters</SelectItem>
                                                        <SelectItem value="stud_service">Studs</SelectItem>
                                                        <SelectItem value="pet">Pets</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Filter State</Label>
                                                <Select value={searchStateId || 'all'} onValueChange={handleStateChange}>
                                                    <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                                        <SelectValue placeholder="All States" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                        <SelectItem value="all">All States</SelectItem>
                                                        {states.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Filter City</Label>
                                                <Select value={searchCityId || 'all'} onValueChange={handleCityChange} disabled={!searchStateId}>
                                                    <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                                        <SelectValue placeholder="All Cities" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                        <SelectItem value="all">All Cities in State</SelectItem>
                                                        {searchCities.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 relative">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Search Entity Name / Title</Label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="Type provider or listing name..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus:border-woof-gold"
                                                />
                                                {isLoadingProfiles && (
                                                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-woof-charcoal/40 animate-spin" />
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70 mb-2.5 block">Matched Profiles</Label>
                                            {profiles.length === 0 && !isLoadingProfiles ? (
                                                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-[#e8ded1] rounded-3xl bg-[#fcfbf9]">
                                                    <div className="text-xs font-bold text-woof-charcoal mb-1">No entities found matching your filters.</div>
                                                    <div className="text-[11px] text-woof-charcoal/60">Try searching for other terms or resetting state filters.</div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                                                    {profiles.map((p, idx) => {
                                                        const isSelected = data.promotable_id === p.id.toString();
                                                        return (
                                                            <div 
                                                                key={`${p.promotable_type}-${p.id}-${idx}`}
                                                                onClick={() => {
                                                                    setData('promotable_id', p.id.toString());
                                                                    setData('promotable_type', p.promotable_type);
                                                                }}
                                                                className={`relative flex items-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                                                                    isSelected 
                                                                        ? 'border-woof-gold bg-woof-gold/10 shadow-xs ring-1 ring-woof-gold' 
                                                                        : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-woof-gold/60 hover:bg-white'
                                                                }`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="absolute -top-1.5 -right-1.5 bg-woof-charcoal text-white rounded-full p-0.5 shadow-xs">
                                                                        <CheckCircle2 className="size-4 text-woof-gold" />
                                                                    </div>
                                                                )}
                                                                
                                                                <div className="size-11 rounded-xl bg-white flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#e8ded1]">
                                                                    {p.image_url ? (
                                                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <ImageIcon className="size-5 text-woof-charcoal/40" />
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="ml-3 overflow-hidden flex-1">
                                                                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-woof-charcoal' : 'text-woof-charcoal'}`}>
                                                                        {p.name}
                                                                    </div>
                                                                    <div className="text-[10px] text-woof-charcoal/60 capitalize mt-0.5">
                                                                        {p.type.replace('_', ' ')}
                                                                    </div>
                                                                    <div className="flex items-center text-[10px] text-woof-charcoal/50 mt-1 truncate">
                                                                        <MapPin className="size-3 mr-1 shrink-0 text-woof-gold" />
                                                                        <span className="truncate">{p.location || 'Location not specified'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {errors.promotable_id && <p className="text-xs text-rose-600 font-medium mt-2">Please select an entity from the list.</p>}
                                        </div>
                                    </div>
                                ) : (
                                    /* Format B: Visual Banner Builder */
                                    <div className="space-y-5 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Ad Headline / Title *</Label>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    placeholder="e.g. Royal Canin Breed Health Nutrition"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="target_url" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Destination URL (Click Link) *</Label>
                                                <Input
                                                    id="target_url"
                                                    type="url"
                                                    placeholder="https://example.com/special-offer"
                                                    value={data.target_url}
                                                    onChange={(e) => setData('target_url', e.target.value)}
                                                    className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="subtitle" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Subtitle / Tagline</Label>
                                                <Input
                                                    id="subtitle"
                                                    type="text"
                                                    placeholder="e.g. Formulated exclusively for purebred champions"
                                                    value={data.subtitle}
                                                    onChange={(e) => setData('subtitle', e.target.value)}
                                                    className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="cta_text" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">CTA Button Text</Label>
                                                <Input
                                                    id="cta_text"
                                                    type="text"
                                                    placeholder="e.g. Shop Now, Book Consultation, Learn More"
                                                    value={data.cta_text}
                                                    onChange={(e) => setData('cta_text', e.target.value)}
                                                    className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="banner_image" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Banner Creative Graphic</Label>
                                            <Input
                                                id="banner_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageFileChange}
                                                className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-woof-charcoal file:text-white"
                                            />
                                        </div>

                                        {/* Live Creative Preview */}
                                        <div className="p-4 rounded-3xl border border-woof-gold/30 bg-[#fcfbf9] space-y-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-woof-gold">
                                                <Sparkles className="size-3" /> Live Creative Preview ({data.placement_slot.replace('_', ' ')})
                                            </div>
                                            <div className="p-4 rounded-2xl border border-[#e8ded1] bg-white flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="h-12 w-16 object-cover rounded-xl border border-[#e8ded1]" />
                                                    ) : (
                                                        <div className="h-12 w-16 rounded-xl bg-[#fcfbf9] border border-dashed border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                                            <ImageIcon className="size-5" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-bold text-woof-charcoal truncate">
                                                            {data.title || 'Your Ad Headline'}
                                                        </h4>
                                                        <p className="text-[11px] text-woof-charcoal/60 truncate">
                                                            {data.subtitle || 'Your ad tagline will appear here'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-woof-charcoal text-white text-[10px] font-bold uppercase tracking-wider">
                                                    {data.cta_text || 'Learn More'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4 border-t border-[#e8ded1]">
                                    <button 
                                        type="button"
                                        disabled={!isStep1Valid}
                                        onClick={() => setCurrentStep(2)}
                                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        Next: Location Target <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Target Location */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-lg font-bold text-woof-charcoal">Step 2: Region & Location Targeting</h2>
                                    <p className="text-xs text-woof-charcoal/60 mt-0.5">Define geographical focus. Leaving empty defaults to National audience reach.</p>
                                </div>
                                
                                {selectedProfile && (
                                    <div className="bg-woof-gold/10 border border-woof-gold/30 rounded-2xl p-4 flex items-center">
                                        <div className="size-11 rounded-xl bg-white overflow-hidden border border-[#e8ded1] mr-3 flex items-center justify-center shrink-0">
                                            {selectedProfile.image_url ? (
                                                <img src={selectedProfile.image_url} alt={selectedProfile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="size-5 text-woof-charcoal/40" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-woof-charcoal/60 font-bold">Targeted Provider</div>
                                            <div className="text-xs font-bold text-woof-charcoal">{selectedProfile.name}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Target States</Label>
                                        
                                        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9]">
                                            {data.targeted_state_ids.length === 0 && (
                                                <div className="text-xs text-woof-charcoal/50 py-1 px-2">National Reach (All States)</div>
                                            )}
                                            {data.targeted_state_ids.map(id => {
                                                const s = states.find(s => s.id === id);
                                                return (
                                                    <div key={id} className="bg-white border border-[#e8ded1] text-woof-charcoal text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                                        {s?.name}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => {
                                                                const newStates = data.targeted_state_ids.filter(i => i !== id);
                                                                setData('targeted_state_ids', newStates);
                                                                const stateCities = cities.filter(c => newStates.includes(c.state_id)).map(c => c.id);
                                                                setData('targeted_city_ids', data.targeted_city_ids.filter(cid => stateCities.includes(cid)));
                                                            }}
                                                            className="text-woof-charcoal/40 hover:text-rose-600 transition-colors ml-1 font-normal"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <Select value="ignore" onValueChange={(val) => { 
                                            const id = parseInt(val);
                                            if (id && !data.targeted_state_ids.includes(id)) {
                                                setData('targeted_state_ids', [...data.targeted_state_ids, id]);
                                            }
                                        }}>
                                            <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-white text-xs text-woof-charcoal">
                                                <SelectValue placeholder="Add targeted state..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                <SelectItem value="ignore" className="hidden">Add targeted state...</SelectItem>
                                                {states.filter(s => !data.targeted_state_ids.includes(s.id)).map(s => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Target Cities</Label>
                                        
                                        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9]">
                                            {data.targeted_city_ids.length === 0 && (
                                                <div className="text-xs text-woof-charcoal/50 py-1 px-2">All Cities in Selected States</div>
                                            )}
                                            {data.targeted_city_ids.map(id => {
                                                const c = targetCities.find(c => c.id === id);
                                                return (
                                                    <div key={id} className="bg-white border border-[#e8ded1] text-woof-charcoal text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                                        {c?.name}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setData('targeted_city_ids', data.targeted_city_ids.filter(i => i !== id))}
                                                            className="text-woof-charcoal/40 hover:text-rose-600 transition-colors ml-1 font-normal"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <Select 
                                            value="ignore" 
                                            onValueChange={(val) => {
                                                const id = parseInt(val);
                                                if (id && !data.targeted_city_ids.includes(id)) {
                                                    setData('targeted_city_ids', [...data.targeted_city_ids, id]);
                                                }
                                            }}
                                            disabled={data.targeted_state_ids.length === 0}
                                        >
                                            <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-white text-xs text-woof-charcoal disabled:opacity-50">
                                                <SelectValue placeholder={data.targeted_state_ids.length === 0 ? "Select state first to filter cities" : "Add targeted city..."} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                <SelectItem value="ignore" className="hidden">Add targeted city...</SelectItem>
                                                {targetCities.filter(c => !data.targeted_city_ids.includes(c.id)).map(c => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-[#e8ded1]">
                                    <button 
                                        type="button" 
                                        onClick={() => setCurrentStep(1)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="size-4" /> Previous
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer"
                                    >
                                        Next: Placement & Tier <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Ad Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-lg font-bold text-woof-charcoal">Step 3: Placement Tier & Pricing</h2>
                                    <p className="text-xs text-woof-charcoal/60 mt-0.5">Configure ad slot tier, schedule start, review availability, and submit.</p>
                                </div>

                                {liveStatus && (
                                    <div className={`border rounded-2xl p-4 flex items-start ${
                                        liveStatus.available 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                            : 'bg-rose-50 border-rose-200 text-rose-900'
                                    }`}>
                                        <div className="mt-0.5 mr-3 shrink-0">
                                            {liveStatus.available ? <CheckCircle2 className="size-5 text-emerald-600" /> : <div className="size-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">!</div>}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider mb-0.5">
                                                {liveStatus.available ? 'Inventory Slot Available' : 'Inventory Slot Conflict'}
                                            </div>
                                            <div className="text-xs leading-relaxed opacity-90">
                                                {liveStatus.message}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tier" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Ad Placement Tier *</Label>
                                        <Select value={data.tier} onValueChange={(val) => setData('tier', val)}>
                                            <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                                <SelectValue placeholder="Select tier..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                <SelectItem value="platinum">Platinum (Hero Placement Slot 1)</SelectItem>
                                                <SelectItem value="gold">Gold (High Visibility Slots 2-3)</SelectItem>
                                                <SelectItem value="silver">Silver (Standard Grid Slots 4-5)</SelectItem>
                                                <SelectItem value="bronze">Bronze (Category Slots 6-7)</SelectItem>
                                                <SelectItem value="featured">Featured (Directory Slots 8-10)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Display Duration *</Label>
                                        <Select value={data.duration} onValueChange={(val) => setData('duration', val)}>
                                            <SelectTrigger className="w-full h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                                <SelectValue placeholder="Select duration..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[#e8ded1] shadow-lg">
                                                <SelectItem value="7d">7 Days Campaign</SelectItem>
                                                <SelectItem value="15d">15 Days Campaign</SelectItem>
                                                <SelectItem value="1m">1 Month Campaign</SelectItem>
                                                <SelectItem value="3m">3 Months Campaign</SelectItem>
                                                <SelectItem value="6m">6 Months Campaign</SelectItem>
                                                <SelectItem value="1y">1 Year Campaign</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="starts_at" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Campaign Start Date *</Label>
                                        <Input
                                            id="starts_at"
                                            type="date"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                            className="h-11 px-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70">Calculated Rate (₹)</Label>
                                        <div className="h-11 bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl flex items-center px-4 text-woof-charcoal font-mono font-bold text-sm">
                                            {liveStatus?.price !== undefined && liveStatus.price !== null ? (
                                                (() => {
                                                    let finalPrice = parseFloat(liveStatus.price.toString());
                                                    if (data.request_discount && data.discount_amount && !isNaN(parseFloat(data.discount_amount))) {
                                                        const discountValue = parseFloat(data.discount_amount);
                                                        if (data.discount_type === 'percentage') {
                                                            const discountAmt = (finalPrice * discountValue) / 100;
                                                            finalPrice = Math.max(0, finalPrice - discountAmt);
                                                        } else {
                                                            finalPrice = Math.max(0, finalPrice - discountValue);
                                                        }
                                                    }
                                                    return `₹${finalPrice.toLocaleString('en-IN')}`;
                                                })()
                                            ) : (
                                                <span className="text-woof-charcoal/40 text-xs font-sans font-normal">Select tier and duration</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#e8ded1]">
                                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={data.request_discount}
                                            onChange={(e) => {
                                                setData(data => ({
                                                    ...data, 
                                                    request_discount: e.target.checked,
                                                    discount_amount: e.target.checked ? data.discount_amount : '',
                                                    discount_reason: e.target.checked ? data.discount_reason : ''
                                                }));
                                            }}
                                            className="rounded border-[#e8ded1] text-woof-charcoal focus:ring-woof-gold"
                                        />
                                        <span className="text-xs font-bold text-woof-charcoal">Request Custom Agent Discount (Requires Manager Approval)</span>
                                    </label>
                                    
                                    {data.request_discount && (
                                        <div className="mt-4 p-5 border border-amber-200 bg-amber-50/60 rounded-2xl space-y-4">
                                            <p className="text-xs text-amber-900 leading-relaxed">
                                                Ad placement will be queued as <strong>Pending Approval</strong> until an authorized territory manager or admin approves the requested concession.
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                <div className="space-y-1 md:col-span-3">
                                                    <Label htmlFor="discount_type" className="text-[11px] font-bold uppercase text-amber-900">Type *</Label>
                                                    <Select value={data.discount_type} onValueChange={(val) => setData('discount_type', val)}>
                                                        <SelectTrigger className="bg-white border-amber-200 text-woof-charcoal h-10 rounded-xl text-xs">
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl">
                                                            <SelectItem value="fixed">Fixed Concession (₹)</SelectItem>
                                                            <SelectItem value="percentage">Percentage Off (%)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div className="space-y-1 md:col-span-3">
                                                    <Label htmlFor="discount_amount" className="text-[11px] font-bold uppercase text-amber-900">Discount Value *</Label>
                                                    <Input
                                                        id="discount_amount"
                                                        type="number"
                                                        min="1"
                                                        max={data.discount_type === 'percentage' ? "100" : undefined}
                                                        value={data.discount_amount}
                                                        onChange={(e) => setData('discount_amount', e.target.value)}
                                                        placeholder={data.discount_type === 'percentage' ? "e.g. 15" : "e.g. 500"}
                                                        className="bg-white border-amber-200 text-woof-charcoal h-10 rounded-xl text-xs"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-1 md:col-span-6">
                                                    <Label htmlFor="discount_reason" className="text-[11px] font-bold uppercase text-amber-900">Reason / Justification *</Label>
                                                    <Input
                                                        id="discount_reason"
                                                        type="text"
                                                        value={data.discount_reason}
                                                        onChange={(e) => setData('discount_reason', e.target.value)}
                                                        placeholder="e.g. Annual bundle placement agreement"
                                                        className="bg-white border-amber-200 text-woof-charcoal h-10 rounded-xl text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-[#e8ded1]">
                                    <button 
                                        type="button" 
                                        onClick={() => setCurrentStep(2)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="size-4" /> Previous
                                    </button>
                                    
                                    <button 
                                        type="submit"
                                        disabled={processing || !isStep3Valid}
                                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-8 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-woof-gold" />}
                                        Confirm & Submit Ad Booking
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AgentLayout>
    );
}
