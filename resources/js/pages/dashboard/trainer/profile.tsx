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
    Award,
    Briefcase,
    Camera,
    Facebook,
    Instagram,
    Loader2,
    MapPin,
    Phone,
    Save,
    Trophy,
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
interface TrainerSpecialization {
    id: number;
    name: string;
}
interface Profile {
    id: number;
    name: string;
    slug: string | null;
    description: string | null;
    experience_years: number;
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
    specializations?: TrainerSpecialization[];
}

export default function TrainerProfile({
    profile,
    states,
    specializations,
}: SharedData & { profile: Profile | null; states: State[]; specializations: TrainerSpecialization[] }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(profile?.logo || null);
    const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

    const initialSpecializations = profile?.specializations?.map((s) => s.id) || [];

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name || '',
        description: profile?.description || '',
        experience_years: profile?.experience_years ? profile.experience_years.toString() : '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        state_id: profile?.state_id ? profile.state_id.toString() : '',
        city_id: profile?.city_id ? profile.city_id.toString() : '',
        address: profile?.address || '',
        specializations: initialSpecializations,
        facebook_url: profile?.facebook_url || '',
        instagram_url: profile?.instagram_url || '',
        twitter_url: profile?.twitter_url || '',
        youtube_url: profile?.youtube_url || '',
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
            router.delete(`/dashboard/trainer/gallery/${deleteImageId}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Image removed from gallery successfully.'),
                onError: () => toast.error('Failed to remove trainer image. Please try again.'),
            });
            setDeleteImageId(null);
        }
    };

    const toggleSpecialization = (id: number) => {
        const current = [...data.specializations];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('specializations', current);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/dashboard/trainer/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => toast.success('Trainer profile updated successfully.'),
            onError: () => toast.error('Failed to update trainer profile. Please check the form.'),
        });
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Trainer Console', href: '/dashboard/trainer' },
                { title: 'Profile', href: '/dashboard/trainer/profile' },
            ]}
            title="Trainer Profile"
            subtitle="Manage your training philosophy, behavioral specializations, and credentials"
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
                            form="trainer-profile-form"
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
            <Head title="Trainer Profile" />

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
                                Your trainer profile is hidden from search results while our compliance team verifies your certifications.
                            </p>
                        </div>
                    </div>
                )}

                {/* FORM */}
                {(!profile || profile.is_active) && (
                    <form id="trainer-profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Identity & Narrative */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Identity & Philosophy</h3>
                                    <p className="text-xs text-woof-charcoal/60">Introduce your canine training methods and credentials</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Professional Name / Brand</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="e.g. Apex Canine Academy"
                                        required
                                    />
                                    {errors.name && <p className="text-xs font-bold text-rose-600 mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Training Narrative & Background</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className="min-h-[160px] rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold p-4 leading-relaxed resize-none"
                                        placeholder="Detail your training philosophy (positive reinforcement, balanced methods), behavioral case experience, and certifications..."
                                    />
                                    {errors.description && <p className="text-xs font-bold text-rose-600 mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Specializations */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Training Expertise & Programs</h3>
                                    <p className="text-xs text-woof-charcoal/60">Select the specific disciplines and programs you provide</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {specializations.map((spec) => (
                                    <button
                                        key={spec.id}
                                        type="button"
                                        onClick={() => toggleSpecialization(spec.id)}
                                        className={`flex h-11 items-center justify-center rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                                            data.specializations.includes(spec.id)
                                                ? 'border-woof-charcoal bg-woof-charcoal text-white shadow-xs'
                                                : 'border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white'
                                        }`}
                                    >
                                        {spec.name}
                                    </button>
                                ))}
                            </div>
                            {errors.specializations && (
                                <p className="text-xs font-bold text-rose-600 mt-1">{errors.specializations}</p>
                            )}
                        </div>

                        {/* Location Section */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Operating Location</h3>
                                    <p className="text-xs text-woof-charcoal/60">Where your training facility is based or where you travel to clients</p>
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
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Full Address / Training Grounds</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                    placeholder="Facility address, sector, or service radius..."
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
                                    <h3 className="text-base font-bold text-woof-charcoal">Direct Connect & Experience</h3>
                                    <p className="text-xs text-woof-charcoal/60">Contact lines and professional tenure</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Business Phone</Label>
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
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="trainer@example.com"
                                    />
                                    {errors.email && <p className="text-xs font-bold text-rose-600 mt-1">{errors.email}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Years of Experience</Label>
                                    <Input
                                        id="experience_years"
                                        type="number"
                                        value={data.experience_years}
                                        onChange={(e) => setData('experience_years', e.target.value)}
                                        className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        placeholder="e.g. 7"
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
                                    <p className="text-xs text-woof-charcoal/60">Connect your Instagram and video demonstration channels</p>
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
                                    <h3 className="text-base font-bold text-woof-charcoal">Showcase & Branding</h3>
                                    <p className="text-xs text-woof-charcoal/60">Upload your logo / headshot and session gallery</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Brand Logo / Photo</Label>
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
                                                    <Trophy className="h-7 w-7 mb-1" />
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
                                                <Camera className="h-3.5 w-3.5 text-woof-gold" /> Upload Photo
                                            </Button>
                                            <p className="text-[10px] text-woof-charcoal/50">Square PNG or JPG recommended. Max 2MB.</p>
                                        </div>
                                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-[#e8ded1]">
                                    <ProfileGallery
                                        profile={profile}
                                        title="Training Session Gallery"
                                        description="Add photos of training grounds, agility courses, and graduate pets"
                                        onDeleteImage={deleteExistingGalleryImage}
                                        dataGallery={data.gallery}
                                        setDataGallery={(files) => setData('gallery', files)}
                                        processing={processing}
                                        errors={errors}
                                        onRetry={() => post('/dashboard/trainer/profile', { preserveScroll: true, forceFormData: true })}
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
                description="This image will be permanently removed from your trainer gallery."
                confirmText="Delete Image"
            />
        </DashboardLayout>
    );
}
