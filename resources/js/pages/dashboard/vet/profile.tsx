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
    Briefcase,
    Building2,
    Camera,
    Facebook,
    Instagram,
    Loader2,
    MapPin,
    Phone,
    Save,
    Stethoscope,
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
interface VetService {
    id: number;
    name: string;
}
interface Profile {
    id: number;
    clinic_name: string;
    slug: string | null;
    description: string | null;
    experience_years: number | null;
    phone: string | null;
    email: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    youtube_url: string | null;
    state_id: number | null;
    city_id: number | null;
    address: string | null;
    logo: string | null;
    is_verified: boolean;
    is_active: boolean;
    gallery: GalleryImage[];
    services?: VetService[];
}

export default function VetProfile({
    profile,
    states,
    services,
}: SharedData & { profile: Profile | null; states: State[]; services: VetService[] }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo || null);
    const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

    const initialServices = profile?.services?.map((s) => s.id) || [];

    const { data, setData, post, processing, errors } = useForm({
        clinic_name: profile?.clinic_name || '',
        description: profile?.description || '',
        experience_years: profile?.experience_years ? profile.experience_years.toString() : '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        state_id: profile?.state_id ? profile.state_id.toString() : '',
        city_id: profile?.city_id ? profile.city_id.toString() : '',
        address: profile?.address || '',
        facebook_url: profile?.facebook_url || '',
        instagram_url: profile?.instagram_url || '',
        twitter_url: profile?.twitter_url || '',
        youtube_url: profile?.youtube_url || '',
        services: initialServices,
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
            router.delete(`/vet/gallery/${deleteImageId}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Image removed from gallery successfully.'),
                onError: () => toast.error('Failed to remove clinic photo. Please try again.'),
            });
            setDeleteImageId(null);
        }
    };

    const toggleService = (id: number) => {
        const current = [...data.services];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('services', current);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/vet/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => toast.success('Veterinary profile updated successfully.'),
            onError: () => toast.error('Failed to update veterinary profile. Please check the form.'),
        });
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Veterinary Console', href: '/dashboard/vet' },
                { title: 'Profile', href: '/vet/profile' },
            ]}
            title="Veterinary Profile"
            subtitle="Manage your clinic practice details, medical services, and facility gallery"
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
                            form="vet-profile-form"
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
            <Head title="Veterinary Profile" />

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
                                Your clinic profile is hidden from search results while our medical compliance team verifies your veterinary credentials.
                            </p>
                        </div>
                    </div>
                )}

                {/* FORM */}
                {(!profile || profile.is_active) && (
                    <form id="vet-profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Clinic Details */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Clinic & Practice Details</h3>
                                    <p className="text-xs text-woof-charcoal/60">Introduce your clinical practice and medical team</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Clinic / Hospital Name</Label>
                                    <Input
                                        id="clinic_name"
                                        value={data.clinic_name}
                                        onChange={(e) => setData('clinic_name', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="e.g. Happy Paws Multi-Specialty Vet Clinic"
                                        required
                                    />
                                    {errors.clinic_name && <p className="text-xs font-bold text-rose-600 mt-1">{errors.clinic_name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Practice Narrative</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className="min-h-[160px] rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold p-4 leading-relaxed resize-none"
                                        placeholder="Introduce your medical standards, emergency capabilities, diagnostic equipment, and surgical specialties..."
                                    />
                                    {errors.description && <p className="text-xs font-bold text-rose-600 mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Veterinary Services Offered</h3>
                                    <p className="text-xs text-woof-charcoal/60">Select the clinical and surgical services your facility provides</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => toggleService(service.id)}
                                        className={`flex h-11 items-center justify-center rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                                            data.services.includes(service.id)
                                                ? 'border-woof-charcoal bg-woof-charcoal text-white shadow-xs'
                                                : 'border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white'
                                        }`}
                                    >
                                        {service.name}
                                    </button>
                                ))}
                            </div>
                            {errors.services && (
                                <p className="text-xs font-bold text-rose-600 mt-1">{errors.services}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Clinic Location</h3>
                                    <p className="text-xs text-woof-charcoal/60">Where patients visit for consultations and treatments</p>
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
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Full Clinic Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                    placeholder="Clinic address, landmark, PIN code..."
                                />
                                {errors.address && <p className="text-xs font-bold text-rose-600 mt-1">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Direct Contact & Experience */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Direct Contact & Practice Tenure</h3>
                                    <p className="text-xs text-woof-charcoal/60">Emergency hotline, email, and clinical experience</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Clinic Hotline</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="+91 99999 99999"
                                    />
                                    {errors.phone && <p className="text-xs font-bold text-rose-600 mt-1">{errors.phone}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Official Email</Label>
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="clinic@example.com"
                                    />
                                    {errors.email && <p className="text-xs font-bold text-rose-600 mt-1">{errors.email}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Years in Practice</Label>
                                    <Input
                                        id="experience_years"
                                        type="number"
                                        value={data.experience_years}
                                        onChange={(e) => setData('experience_years', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="e.g. 10"
                                    />
                                    {errors.experience_years && <p className="text-xs font-bold text-rose-600 mt-1">{errors.experience_years}</p>}
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
                                    <p className="text-xs text-woof-charcoal/60">Connect your clinic public channels</p>
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

                        {/* Showcase & Branding */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Camera className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Clinic Showcase & Branding</h3>
                                    <p className="text-xs text-woof-charcoal/60">Upload your clinic crest and examination room gallery</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Clinic Logo</Label>
                                    <div className="flex items-center gap-6">
                                        <div
                                            className="relative h-28 w-28 overflow-hidden rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] flex items-center justify-center cursor-pointer shadow-2xs group"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt={profile?.clinic_name}
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
                                        title="Facility & Equipment Gallery"
                                        description="Add photos of the operating theater, consultation rooms, and pet waiting areas"
                                        onDeleteImage={deleteExistingGalleryImage}
                                        dataGallery={data.gallery}
                                        setDataGallery={(files) => setData('gallery', files)}
                                        processing={processing}
                                        errors={errors}
                                        onRetry={() => post('/vet/profile', { preserveScroll: true, forceFormData: true })}
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
                description="This image will be permanently removed from your clinic gallery."
                confirmText="Delete Image"
            />
        </DashboardLayout>
    );
}
