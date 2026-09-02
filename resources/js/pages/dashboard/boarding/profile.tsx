import { ProfileGallery } from '@/components/dashboard/profile-gallery';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { SharedData } from '@/types';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    AlertTriangle,
    Building2,
    Camera,
    Facebook,
    Instagram,
    Loader2,
    MapPin,
    Phone,
    Save,
    Twitter,
    Users,
    Youtube,
} from 'lucide-react';
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';

interface State {
    id: number;
    name: string;
}
interface City {
    id: number;
    name: string;
}
interface GalleryImage {
    id: number;
    image: string;
}
interface Profile {
    id: number;
    name: string;
    slug: string | null;
    description: string | null;
    phone: string | null;
    email: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    youtube_url: string | null;
    service_type: string | null;
    price_per_day: number | null;
    capacity: number | null;
    state_id: number | null;
    city_id: number | null;
    address: string | null;
    logo: string | null;
    is_verified: boolean;
    is_active: boolean;
    gallery: GalleryImage[];
}

export default function BoardingProfile({
    profile,
    states,
}: SharedData & { profile: Profile | null; states: State[] }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo || null);
    const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name || '',
        description: profile?.description || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        facebook_url: profile?.facebook_url || '',
        instagram_url: profile?.instagram_url || '',
        twitter_url: profile?.twitter_url || '',
        youtube_url: profile?.youtube_url || '',
        service_type: profile?.service_type || 'boarding',
        price_per_day: profile?.price_per_day ? profile.price_per_day.toString() : '',
        capacity: profile?.capacity ? profile.capacity.toString() : '',
        state_id: profile?.state_id ? profile.state_id.toString() : '',
        city_id: profile?.city_id ? profile.city_id.toString() : '',
        address: profile?.address || '',
        logo: null as File | null,
        gallery: [] as File[],
    });

    const [dynamicCities, setDynamicCities] = useState<City[]>([]);
    useEffect(() => {
        let ignore = false;
        if (data.state_id) {
            fetch(`/api/cities/${data.state_id}`)
                .then((res) => res.json())
                .then((cities) => {
                    if (!ignore) setDynamicCities(cities);
                })
                .catch(() => {
                    if (!ignore) setDynamicCities([]);
                });
        } else {
            setDynamicCities([]);
        }
        return () => {
            ignore = true;
        };
    }, [data.state_id]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const deleteExistingGalleryImage = (id: number) => {
        setDeleteImageId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteImageId !== null) {
            router.delete(`/boarding/gallery/${deleteImageId}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Image removed from gallery successfully.'),
                onError: () => toast.error('Failed to remove boarding image. Please try again.'),
            });
            setDeleteImageId(null);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/boarding/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => toast.success('Boarding profile updated successfully.'),
            onError: () => toast.error('Failed to update boarding profile. Please check the form.'),
        });
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Boarding Console', href: '/dashboard/boarding' },
                { title: 'Profile', href: '/boarding/profile' },
            ]}
            title="Boarding Profile"
            subtitle="Manage your pet boarding presence, pricing, and capacity"
            actions={
                (!profile || profile.is_active) && (
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('dashboard')}
                            className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-xs font-bold text-woof-charcoal h-11 px-6 flex items-center transition-all shadow-2xs"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            form="boarding-profile-form"
                            disabled={processing}
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-11 px-7 transition-all shadow-xs cursor-pointer flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Profile
                                </>
                            )}
                        </Button>
                    </div>
                )
            }
        >
            <Head title="Boarding Profile" />

            <div className="pb-16 max-w-5xl mx-auto space-y-8">
                {/* INACTIVE BANNER */}
                {!profile?.is_active && profile && (
                    <div className="flex items-start sm:items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-xs">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 border border-rose-200 text-rose-700">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-rose-900">Profile Inactive</h4>
                            <p className="text-xs text-rose-700/90 mt-0.5">
                                Your boarding profile is hidden from search results while our compliance team verifies your facility credentials.
                            </p>
                        </div>
                    </div>
                )}

                {/* FORM */}
                {(!profile || profile.is_active) && (
                    <form id="boarding-profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Facility Details */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Facility Details</h3>
                                    <p className="text-xs text-woof-charcoal/60">Introduce your facility and daily pet care environment</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Boarding / Facility Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="e.g. Cozy Canines Boarding & Daycare"
                                        required
                                    />
                                    {errors.name && <p className="text-xs font-bold text-rose-600 mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Facility Description & Care Narrative</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className="min-h-[160px] rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold p-4 leading-relaxed resize-none"
                                        placeholder="Describe your facilities, play yards, sleeping arrangements, dietary plans, and 24/7 supervision..."
                                    />
                                    {errors.description && <p className="text-xs font-bold text-rose-600 mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Provider Stats */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Capacity & Pricing</h3>
                                    <p className="text-xs text-woof-charcoal/60">Configure your boarding rates and guest capacity limits</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Service Type</Label>
                                    <Select
                                        value={data.service_type}
                                        onValueChange={(v: string) => setData('service_type', v)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold">
                                            <SelectValue placeholder="Select Service Type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                            <SelectItem value="boarding" className="text-xs font-medium">Kennel / Boarding Center</SelectItem>
                                            <SelectItem value="daycare" className="text-xs font-medium">Pet Sitting / Daycare</SelectItem>
                                            <SelectItem value="both" className="text-xs font-medium">Both Boarding &amp; Daycare</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Price per Day (₹)</Label>
                                    <Input
                                        id="price_per_day"
                                        type="number"
                                        value={data.price_per_day}
                                        onChange={(e) => setData('price_per_day', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="750"
                                        disabled={processing}
                                    />
                                    {errors.price_per_day && <p className="text-xs font-bold text-rose-600 mt-1">{errors.price_per_day}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Capacity (Pets)</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="15"
                                        disabled={processing}
                                    />
                                    {errors.capacity && <p className="text-xs font-bold text-rose-600 mt-1">{errors.capacity}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Facility Location</h3>
                                    <p className="text-xs text-woof-charcoal/60">Where pet parents drop off and pick up their pets</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">State</Label>
                                    <Select
                                        value={data.state_id}
                                        onValueChange={(v: string) => setData((d) => ({ ...d, state_id: v, city_id: '' }))}
                                    >
                                        <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                            {states.map((s) => (
                                                <SelectItem key={s.id} value={s.id.toString()} className="text-xs">
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">City</Label>
                                    <Select
                                        value={data.city_id}
                                        onValueChange={(v: string) => setData('city_id', v)}
                                        disabled={!data.state_id}
                                    >
                                        <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold disabled:opacity-50">
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                            {dynamicCities.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()} className="text-xs">
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Full Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                    placeholder="Plot number, road, landmark, pincode..."
                                />
                                {errors.address && <p className="text-xs font-bold text-rose-600 mt-1">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Direct Contact</h3>
                                    <p className="text-xs text-woof-charcoal/60">Direct contact details for guest reservations and check-ins</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Hotline Number</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="+91 88888 88888"
                                    />
                                    {errors.phone && <p className="text-xs font-bold text-rose-600 mt-1">{errors.phone}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="boarding@example.com"
                                    />
                                    {errors.email && <p className="text-xs font-bold text-rose-600 mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Social Channels */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Social Profiles</h3>
                                    <p className="text-xs text-woof-charcoal/60">Connect your public handles to build trust</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Facebook</Label>
                                    <div className="relative flex items-center">
                                        <Facebook className="pointer-events-none absolute left-3.5 size-4 text-woof-gold" />
                                        <Input
                                            type="url"
                                            value={data.facebook_url}
                                            onChange={(e) => setData('facebook_url', e.target.value)}
                                            className="h-11 pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Instagram</Label>
                                    <div className="relative flex items-center">
                                        <Instagram className="pointer-events-none absolute left-3.5 size-4 text-woof-gold" />
                                        <Input
                                            type="url"
                                            value={data.instagram_url}
                                            onChange={(e) => setData('instagram_url', e.target.value)}
                                            className="h-11 pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Twitter / X</Label>
                                    <div className="relative flex items-center">
                                        <Twitter className="pointer-events-none absolute left-3.5 size-4 text-woof-gold" />
                                        <Input
                                            type="url"
                                            value={data.twitter_url}
                                            onChange={(e) => setData('twitter_url', e.target.value)}
                                            className="h-11 pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                            placeholder="https://x.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">YouTube</Label>
                                    <div className="relative flex items-center">
                                        <Youtube className="pointer-events-none absolute left-3.5 size-4 text-woof-gold" />
                                        <Input
                                            type="url"
                                            value={data.youtube_url}
                                            onChange={(e) => setData('youtube_url', e.target.value)}
                                            className="h-11 pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Facility Showcase */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Camera className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Facility Showcase & Branding</h3>
                                    <p className="text-xs text-woof-charcoal/60">Upload your facility crest and photo showcase</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Facility Logo / Emblem</Label>
                                    <div className="flex items-center gap-6">
                                        <div
                                            className="relative h-28 w-28 overflow-hidden rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] flex items-center justify-center cursor-pointer shadow-2xs group"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt={profile?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-woof-charcoal/40">
                                                    <Building2 className="h-7 w-7 mb-1" />
                                                    <span className="text-[9px] font-bold uppercase">Upload</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-woof-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                <Camera className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-9 px-4 text-xs font-bold gap-1.5 rounded-full border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-colors"
                                            >
                                                <Camera className="h-3.5 w-3.5 text-woof-gold" /> Upload Logo
                                            </Button>
                                            <p className="text-[10px] text-woof-charcoal/50">Square PNG or JPG recommended. Max 2MB.</p>
                                        </div>
                                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-[#e8ded1]">
                                    <ProfileGallery
                                        profile={profile}
                                        title="Facility Gallery"
                                        description="Add photos of the suites, play yards, and splash areas"
                                        onDeleteImage={deleteExistingGalleryImage}
                                        dataGallery={data.gallery}
                                        setDataGallery={(files) => setData('gallery', files)}
                                        processing={processing}
                                        errors={errors}
                                        onRetry={() => post('/boarding/profile', { preserveScroll: true, forceFormData: true })}
                                    />
                                    {errors.gallery && (
                                        <p className="text-xs font-bold text-rose-600 mt-2">{errors.gallery}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <ConfirmDialog
                open={deleteImageId !== null}
                onOpenChange={() => setDeleteImageId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Gallery Image?"
                description="This image will be permanently removed from your facility gallery."
                confirmText="Delete Image"
            />
        </DashboardLayout>
    );
}
