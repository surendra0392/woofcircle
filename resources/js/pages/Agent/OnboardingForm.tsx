import AgentLayout from '@/layouts/AgentLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface VetService {
    id: number;
    name: string;
}

interface TrainerSpecialization {
    id: number;
    name: string;
}

interface Props {
    states: State[];
    cities: City[];
    vet_services: VetService[];
    trainer_specializations: TrainerSpecialization[];
}

export default function OnboardingForm({ states, cities, vet_services, trainer_specializations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        owner_name: '',
        email: '',
        business_name: '',
        type: '',
        phone: '',
        address: '',
        state_id: '',
        city_id: '',
        description: '',
        experience_years: '',
        website: '',
        service_type: '',
        price_per_day: '',
        capacity: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        logo: null as File | null,
        gallery: [] as File[],
        services: [] as number[],
        specializations: [] as number[],
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<{file: File, url: string}[]>([]);
    const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);

    useEffect(() => {
        if (data.logo) {
            const objectUrl = URL.createObjectURL(data.logo);
            setLogoPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setLogoPreview(null);
        }
    }, [data.logo]);

    useEffect(() => {
        const urls = data.gallery.map(file => ({ file, url: URL.createObjectURL(file) }));
        setGalleryPreviews(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u.url));
    }, [data.gallery]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedGalleryIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Delay opacity change so drag image looks correct
        requestAnimationFrame(() => {
            if (e.target && e.target instanceof HTMLElement) {
                e.target.style.opacity = '0.4';
            }
        });
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setDraggedGalleryIndex(null);
        if (e.target && e.target instanceof HTMLElement) {
            e.target.style.opacity = '1';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedGalleryIndex === null || draggedGalleryIndex === dropIndex) return;

        const newGallery = [...data.gallery];
        const item = newGallery.splice(draggedGalleryIndex, 1)[0];
        newGallery.splice(dropIndex, 0, item);
        setData('gallery', newGallery);
        setDraggedGalleryIndex(null);
    };

    const moveGalleryImage = (index: number, direction: 'left' | 'right') => {
        const newGallery = [...data.gallery];
        if (direction === 'left' && index > 0) {
            [newGallery[index - 1], newGallery[index]] = [newGallery[index], newGallery[index - 1]];
        } else if (direction === 'right' && index < newGallery.length - 1) {
            [newGallery[index + 1], newGallery[index]] = [newGallery[index], newGallery[index + 1]];
        }
        setData('gallery', newGallery);
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...data.gallery];
        newGallery.splice(index, 1);
        setData('gallery', newGallery);
    };

    const filteredCities = cities.filter(c => c.state_id === parseInt(data.state_id));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agent.onboarding.store'), {
            forceFormData: true,
        });
    };

    return (
        <AgentLayout title="Onboard Service Provider">
            <Head title="Onboard Business" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Onboard Entity Registry</h1>
                <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Register a new verified veterinary, training, boarding, or welfare provider in the directory network.</p>
            </div>

            <form onSubmit={submit} className="space-y-8 pb-12">
                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                    <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Business Type *</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger className="w-full h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal">
                                    <SelectValue placeholder="Select provider category..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1] bg-white shadow-xl">
                                    <SelectItem value="vet">Veterinary Clinic</SelectItem>
                                    <SelectItem value="trainer">Dog Trainer</SelectItem>
                                    <SelectItem value="boarding">Boarding / Daycare</SelectItem>
                                    <SelectItem value="welfare">Welfare / Rescue</SelectItem>
                                    <SelectItem value="pet_shop">Pet Shop</SelectItem>
                                    <SelectItem value="breeder">Breeder</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-xs text-rose-600 font-medium">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="business_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Business / Facility Name *</Label>
                            <Input
                                id="business_name"
                                value={data.business_name}
                                onChange={(e) => setData('business_name', e.target.value)}
                                placeholder="e.g. Happy Paws Wellness"
                                className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                            />
                            {errors.business_name && <p className="text-xs text-rose-600 font-medium">{errors.business_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="owner_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Primary Contact / Owner *</Label>
                            <Input
                                id="owner_name"
                                value={data.owner_name}
                                onChange={(e) => setData('owner_name', e.target.value)}
                                placeholder="e.g. Dr. Aryan Sharma"
                                className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                            />
                            {errors.owner_name && <p className="text-xs text-rose-600 font-medium">{errors.owner_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Official Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="contact@happypaws.com"
                                className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                            />
                            {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Direct Phone *</Label>
                            <div className="flex shadow-2xs">
                                <span className="inline-flex items-center rounded-l-2xl border border-r-0 border-[#e8ded1] bg-[#fcfbf9] px-3.5 text-xs text-woof-charcoal font-bold">
                                    +91
                                </span>
                                <Input
                                    id="phone"
                                    type="text"
                                    maxLength={10}
                                    className="rounded-l-none h-11 rounded-r-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                                    value={data.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setData('phone', val);
                                    }}
                                    placeholder="9876543210"
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-rose-600 font-medium">{errors.phone}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="experience_years" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Years of Practice / Operation</Label>
                            <Input
                                id="experience_years"
                                type="number"
                                value={data.experience_years}
                                onChange={(e) => setData('experience_years', e.target.value)}
                                placeholder="e.g. 8"
                                className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                            />
                            {errors.experience_years && <p className="text-xs text-rose-600 font-medium">{errors.experience_years}</p>}
                        </div>

                        {['pet_shop', 'welfare'].includes(data.type) && (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="website" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Website URL</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="https://happypaws.com"
                                    className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                                />
                                {errors.website && <p className="text-xs text-rose-600 font-medium">{errors.website}</p>}
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Profile Overview & Credentials</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Provide a comprehensive summary of services, certifications, and facility background..."
                            rows={4}
                            className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                        />
                        {errors.description && <p className="text-xs text-rose-600 font-medium">{errors.description}</p>}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                    <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Location & Jurisdiction</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">State *</Label>
                            <Select value={data.state_id} onValueChange={(val) => {
                                setData(data => ({ ...data, state_id: val, city_id: '' }));
                            }}>
                                <SelectTrigger className="w-full h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal">
                                    <SelectValue placeholder="Select state..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1] bg-white shadow-xl">
                                    {states.map(state => (
                                        <SelectItem key={state.id} value={state.id.toString()}>{state.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.state_id && <p className="text-xs text-rose-600 font-medium">{errors.state_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">City *</Label>
                            <Select value={data.city_id} onValueChange={(val) => setData('city_id', val)} disabled={!data.state_id}>
                                <SelectTrigger className="w-full h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal">
                                    <SelectValue placeholder={data.state_id ? "Select city..." : "Select state first"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1] bg-white shadow-xl">
                                    {filteredCities.map(city => (
                                        <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.city_id && <p className="text-xs text-rose-600 font-medium">{errors.city_id}</p>}
                        </div>
                    </div>
                    
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="address" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Full Physical Address *</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Premises number, Street, Landmark, Area"
                            className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal placeholder:text-woof-charcoal/40"
                        />
                        {errors.address && <p className="text-xs text-rose-600 font-medium">{errors.address}</p>}
                    </div>
                </div>

                {data.type === 'boarding' && (
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                        <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Boarding Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="service_type" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Service Type</Label>
                                <Select value={data.service_type} onValueChange={(val) => setData('service_type', val)}>
                                    <SelectTrigger className="w-full h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-[#e8ded1] bg-white shadow-xl">
                                        <SelectItem value="boarding">Overnight Boarding Only</SelectItem>
                                        <SelectItem value="daycare">Daycare Only</SelectItem>
                                        <SelectItem value="both">Both Overnight & Daycare</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.service_type && <p className="text-xs text-rose-600 font-medium">{errors.service_type}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="price_per_day" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Base Rate / Day (₹)</Label>
                                <Input
                                    id="price_per_day"
                                    type="number"
                                    step="0.01"
                                    value={data.price_per_day}
                                    onChange={(e) => setData('price_per_day', e.target.value)}
                                    placeholder="e.g. 750"
                                    className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal"
                                />
                                {errors.price_per_day && <p className="text-xs text-rose-600 font-medium">{errors.price_per_day}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capacity" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Capacity (Pets)</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', e.target.value)}
                                    placeholder="e.g. 20"
                                    className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal text-woof-charcoal"
                                />
                                {errors.capacity && <p className="text-xs text-rose-600 font-medium">{errors.capacity}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {data.type === 'vet' && (
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                        <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Clinical Services Offered</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {vet_services.map(service => (
                                <label key={service.id} className="flex items-center gap-3 p-3 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="size-4 rounded-md border-[#e8ded1] text-woof-gold focus:ring-woof-gold"
                                        checked={data.services.includes(service.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setData('services', [...data.services, service.id]);
                                            } else {
                                                setData('services', data.services.filter(id => id !== service.id));
                                            }
                                        }}
                                    />
                                    <span className="text-xs font-bold text-woof-charcoal">{service.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.services && <p className="text-xs text-rose-600 font-medium mt-2">{errors.services}</p>}
                    </div>
                )}

                {data.type === 'trainer' && (
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                        <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Trainer Specializations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {trainer_specializations.map(spec => (
                                <label key={spec.id} className="flex items-center gap-3 p-3 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="size-4 rounded-md border-[#e8ded1] text-woof-gold focus:ring-woof-gold"
                                        checked={data.specializations.includes(spec.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setData('specializations', [...data.specializations, spec.id]);
                                            } else {
                                                setData('specializations', data.specializations.filter(id => id !== spec.id));
                                            }
                                        }}
                                    />
                                    <span className="text-xs font-bold text-woof-charcoal">{spec.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.specializations && <p className="text-xs text-rose-600 font-medium mt-2">{errors.specializations}</p>}
                    </div>
                )}

                {['pet_shop', 'trainer', 'welfare'].includes(data.type) && (
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                        <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Social Channels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="facebook_url" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Facebook URL</Label>
                                <Input id="facebook_url" value={data.facebook_url} onChange={(e) => setData('facebook_url', e.target.value)} placeholder="https://facebook.com/..." className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal" />
                                {errors.facebook_url && <p className="text-xs text-rose-600 font-medium">{errors.facebook_url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram_url" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Instagram URL</Label>
                                <Input id="instagram_url" value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} placeholder="https://instagram.com/..." className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal" />
                                {errors.instagram_url && <p className="text-xs text-rose-600 font-medium">{errors.instagram_url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter_url" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">X (Twitter) URL</Label>
                                <Input id="twitter_url" value={data.twitter_url} onChange={(e) => setData('twitter_url', e.target.value)} placeholder="https://x.com/..." className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal" />
                                {errors.twitter_url && <p className="text-xs text-rose-600 font-medium">{errors.twitter_url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="youtube_url" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">YouTube URL</Label>
                                <Input id="youtube_url" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)} placeholder="https://youtube.com/..." className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-normal" />
                                {errors.youtube_url && <p className="text-xs text-rose-600 font-medium">{errors.youtube_url}</p>}
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 sm:p-8">
                    <h2 className="text-base font-bold text-woof-charcoal mb-5 pb-3 border-b border-[#e8ded1]">Media & Gallery Assets</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="logo" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Logo / Featured Avatar</Label>
                            {logoPreview && (
                                <div className="mb-3 relative w-32 h-32 rounded-2xl border border-[#e8ded1] overflow-hidden shadow-xs">
                                    <img src={logoPreview} alt="Logo preview" className="object-cover w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={() => setData('logo', null)}
                                        className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 shadow cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <Input 
                                id="logo" 
                                type="file" 
                                accept="image/*"
                                className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setData('logo', e.target.files[0]);
                                    }
                                    e.target.value = '';
                                }} 
                            />
                            {errors.logo && <p className="text-xs text-rose-600 font-medium">{errors.logo}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gallery" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Facility Gallery (Up to 10 photos)</Label>
                            
                            {galleryPreviews.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {galleryPreviews.map((preview, index) => (
                                        <div 
                                            key={preview.url} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                            className={`relative w-24 h-24 rounded-2xl border-2 ${draggedGalleryIndex === index ? 'border-woof-gold' : 'border-[#e8ded1]'} overflow-hidden group cursor-grab active:cursor-grabbing transition-all`}
                                        >
                                            <img src={preview.url} alt={`Gallery preview ${index + 1}`} className="object-cover w-full h-full pointer-events-none" />
                                            
                                            {/* Action overlay */}
                                            <div className="absolute inset-0 bg-woof-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="text-white/80 p-0.5 pointer-events-none">
                                                        <Grip size={14} />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 shadow cursor-pointer"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                                
                                                <div className="flex justify-between px-1 mt-auto">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveGalleryImage(index, 'left')}
                                                        disabled={index === 0}
                                                        className={`bg-white rounded-full p-1 shadow cursor-pointer ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-woof-gold'}`}
                                                    >
                                                        <ChevronLeft size={14} className="text-woof-charcoal" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveGalleryImage(index, 'right')}
                                                        disabled={index === galleryPreviews.length - 1}
                                                        className={`bg-white rounded-full p-1 shadow cursor-pointer ${index === galleryPreviews.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-woof-gold'}`}
                                                    >
                                                        <ChevronRight size={14} className="text-woof-charcoal" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Order indicator */}
                                            <div className="absolute top-1 left-1 bg-woof-charcoal/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none group-hover:hidden">
                                                {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Input 
                                id="gallery" 
                                type="file" 
                                accept="image/*"
                                multiple
                                className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newFiles = Array.from(e.target.files);
                                        const combined = [...data.gallery, ...newFiles].slice(0, 10);
                                        setData('gallery', combined);
                                    }
                                    e.target.value = '';
                                }} 
                            />
                            <p className="text-[11px] text-woof-charcoal/50">Upload high-resolution images. Drag or click arrows to reorder.</p>
                            {errors.gallery && <p className="text-xs text-rose-600 font-medium">{errors.gallery}</p>}
                        </div>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-12 shadow-xs transition-all cursor-pointer"
                >
                    {processing ? 'Registering Provider...' : 'Complete & Onboard Service Profile'}
                </Button>
            </form>
        </AgentLayout>
    );
}
