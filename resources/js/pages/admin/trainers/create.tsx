import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Globe, FileText, Image as ImageIcon, GraduationCap } from 'lucide-react';
import { useState } from 'react';

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Specialization {
    id: number;
    name: string;
}

interface PageProps {
    states: State[];
    cities: City[];
    availableUsers: User[];
    allSpecializations: Specialization[];
}

export default function TrainerCreatePage({ states = [], cities = [], availableUsers = [], allSpecializations = [] }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: '',
        name: '',
        description: '',
        phone: '',
        email: '',
        experience_years: '',
        state_id: '',
        city_id: '',
        address: '',
        logo: null as File | null,
        specializations: [] as number[],
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        gallery: [] as File[],
    });

    const handleSpecializationToggle = (id: number) => {
        const current = data.specializations;
        if (current.includes(id)) {
            setData('specializations', current.filter(s => s !== id));
        } else {
            setData('specializations', [...current, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.trainers.store'), {
            onSuccess: () => {
                toast.success('Trainer profile created successfully.');
            },
            onError: () => {
                toast.error('Failed to create trainer profile. Please check form validation errors.');
            }
        });
    };

    const filteredFormCities = cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Add Dog Trainer">
            <Head title="Add Dog Trainer - Admin" />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.trainers.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Create Trainer Profile</h2>
                    <p className="text-xs text-woof-charcoal/60">Configure dog trainer information, specializations, and service area</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* 1. Linked User Context */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Linked User Account</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Link this profile to a registered user account belonging to a trainer role.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Linked User Account</Label>
                            <select 
                                id="user_id" 
                                className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                value={data.user_id} 
                                onChange={e => setData('user_id', e.target.value)}
                            >
                                <option value="">None / Guest / External Business</option>
                                {availableUsers?.map((u: any) => (
                                    <option key={u.id} value={u.id.toString()}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Professional Credentials */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Profile Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the trainer or business name, upload a logo/profile picture, and record experience years.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Trainer / Business Name *</Label>
                                <Input 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="e.g. John Doe K9 Academy" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="logo" className="text-xs font-bold text-woof-charcoal">Logo / Profile Image</Label>
                                <Input 
                                    id="logo" 
                                    type="file"
                                    onChange={e => setData('logo', e.target.files ? e.target.files[0] : null)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20" 
                                />
                                {errors.logo && <p className="text-xs text-rose-500">{errors.logo}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-bold text-woof-charcoal">Contact Phone *</Label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-r-0 border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs font-bold text-woof-charcoal/60 rounded-l-2xl select-none">
                                        +91
                                    </div>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => {
                                            let digits = e.target.value.replace(/\D/g, '');
                                            digits = digits.substring(0, 10);
                                            setData('phone', digits);
                                        }}
                                        placeholder="9876543210"
                                        className="h-10 rounded-r-2xl rounded-l-none border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal">Contact Email</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    placeholder="trainer@example.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="experience_years" className="text-xs font-bold text-woof-charcoal">Years of Experience</Label>
                                <Input 
                                    id="experience_years" 
                                    type="number"
                                    value={data.experience_years} 
                                    onChange={e => setData('experience_years', e.target.value)} 
                                    placeholder="e.g. 5" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.experience_years && <p className="text-xs text-rose-500">{errors.experience_years}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Trainer Biography / Description</Label>
                            <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Address & Geographical coordinates */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Geographical Context</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select the trainer's operating state, corresponding city scope, and input physical address.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">Operating State *</Label>
                                <select 
                                    id="state_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.state_id} 
                                    onChange={e => {
                                        setData('state_id', e.target.value);
                                        setData('city_id', '');
                                    }}
                                >
                                    <option value="" disabled>Select State...</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id.toString()}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal">Operating City *</Label>
                                <select 
                                    id="city_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50" 
                                    value={data.city_id} 
                                    onChange={e => setData('city_id', e.target.value)}
                                    disabled={!data.state_id}
                                >
                                    <option value="" disabled>Select City...</option>
                                    {filteredFormCities.map((city) => (
                                        <option key={city.id} value={city.id.toString()}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="address" className="text-xs font-bold text-woof-charcoal">Physical Address *</Label>
                            <Input 
                                id="address" 
                                value={data.address} 
                                onChange={e => setData('address', e.target.value)} 
                                placeholder="Enter street address, building or complex details..." 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.address && <p className="text-xs text-rose-500">{errors.address}</p>}
                        </div>
                    </div>
                </div>

                {/* 4. Specializations Context */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Specializations</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select one or more fields of canine training expertise this academy specializes in.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <Label className="text-xs font-bold text-woof-charcoal">Expertise Specializations</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {allSpecializations.map((spec) => {
                                const isChecked = data.specializations.includes(spec.id);
                                return (
                                    <div 
                                        key={spec.id}
                                        onClick={() => handleSpecializationToggle(spec.id)}
                                        className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all duration-200 rounded-2xl select-none ${
                                            isChecked 
                                                ? 'border-woof-gold bg-woof-gold/10' 
                                                : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                        }`}
                                    >
                                        <Checkbox 
                                            id={`spec-${spec.id}`}
                                            checked={isChecked}
                                            onCheckedChange={() => handleSpecializationToggle(spec.id)}
                                        />
                                        <Label htmlFor={`spec-${spec.id}`} className="text-xs font-bold text-woof-charcoal cursor-pointer">{spec.name}</Label>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.specializations && <p className="text-xs text-rose-500 mt-2">{errors.specializations}</p>}
                    </div>
                </div>

                {/* 5. Media gallery upload */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media Gallery</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload photos of training sessions, facilities, or academy achievements.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="gallery" className="text-xs font-bold text-woof-charcoal">Upload Gallery Photos</Label>
                            <Input 
                                id="gallery" 
                                type="file"
                                multiple
                                onChange={e => {
                                    if (e.target.files) {
                                        setData('gallery', Array.from(e.target.files));
                                    }
                                }} 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20" 
                            />
                            <p className="text-[11px] text-woof-charcoal/50">Supported formats: JPG, PNG. Max size: 2MB per image.</p>
                            {errors.gallery && <p className="text-xs text-rose-500">{errors.gallery}</p>}
                        </div>
                    </div>
                </div>

                {/* 6. Social URL handles */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Social Profiles</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide web address handles to social handles or external business landing pages.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="facebook_url" className="text-xs font-bold text-woof-charcoal">Facebook Link</Label>
                                <Input 
                                    id="facebook_url" 
                                    value={data.facebook_url} 
                                    onChange={e => setData('facebook_url', e.target.value)} 
                                    placeholder="https://facebook.com/..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.facebook_url && <p className="text-xs text-rose-500">{errors.facebook_url}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="instagram_url" className="text-xs font-bold text-woof-charcoal">Instagram Link</Label>
                                <Input 
                                    id="instagram_url" 
                                    value={data.instagram_url} 
                                    onChange={e => setData('instagram_url', e.target.value)} 
                                    placeholder="https://instagram.com/..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.instagram_url && <p className="text-xs text-rose-500">{errors.instagram_url}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="twitter_url" className="text-xs font-bold text-woof-charcoal">Twitter Link</Label>
                                <Input 
                                    id="twitter_url" 
                                    value={data.twitter_url} 
                                    onChange={e => setData('twitter_url', e.target.value)} 
                                    placeholder="https://twitter.com/..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.twitter_url && <p className="text-xs text-rose-500">{errors.twitter_url}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="youtube_url" className="text-xs font-bold text-woof-charcoal">YouTube Link</Label>
                                <Input 
                                    id="youtube_url" 
                                    value={data.youtube_url} 
                                    onChange={e => setData('youtube_url', e.target.value)} 
                                    placeholder="https://youtube.com/..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.youtube_url && <p className="text-xs text-rose-500">{errors.youtube_url}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.trainers.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Save Profile
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
