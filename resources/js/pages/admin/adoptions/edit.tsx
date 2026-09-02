import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Heart, Globe, Image as ImageIcon, Sparkles, Award, Trash2 } from 'lucide-react';

interface Breed {
    id: number;
    name: string;
}

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
    role_id: number;
    role?: { id: number; name: string };
}

interface Profile {
    id: number;
    user_id: number | null;
    name: string;
    type: string;
}

interface GalleryImage {
    id: number;
    image: string;
}

interface Adoption {
    id: number;
    user_id: number;
    profile_id: number | null;
    profile_type: string | null;
    breed_id: number;
    gender: 'male' | 'female';
    title: string;
    slug: string;
    description: string;
    fee: number | null;
    age: string | null;
    state_id: number;
    city_id: number;
    status: 'draft' | 'published' | 'available' | 'unavailable';
    is_negotiable: boolean;
    is_vaccinated: boolean;
    is_available: boolean;
    is_approved: boolean;
    is_champion: boolean;
    awards_count: number | null;
    featured_image_path: string | null;
    featured_image_url: string | null;
    is_featured: boolean;
    featured_position: number | null;
    featured_duration: string | null;
    images: GalleryImage[];
}

interface PageProps {
    adoption: Adoption;
    breeds: Breed[];
    users: User[];
    profiles: Profile[];
    states: State[];
    cities: City[];
}

export default function AdoptionEditPage({ adoption, breeds = [], users = [], profiles = [], states = [], cities = [] }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: adoption.user_id?.toString() || '',
        profile_id: adoption.profile_id?.toString() || 'none',
        profile_type: adoption.profile_type || '',
        breed_id: adoption.breed_id?.toString() || '',
        gender: adoption.gender || '',
        title: adoption.title || '',
        slug: adoption.slug || '',
        description: adoption.description || '',
        fee: adoption.fee?.toString() || '',
        age: adoption.age || '',
        state_id: adoption.state_id?.toString() || '',
        city_id: adoption.city_id?.toString() || '',
        status: adoption.status || 'draft',
        is_negotiable: !!adoption.is_negotiable,
        is_vaccinated: !!adoption.is_vaccinated,
        is_available: !!adoption.is_available,
        is_approved: !!adoption.is_approved,
        is_champion: !!adoption.is_champion,
        awards_count: adoption.awards_count?.toString() || '',
        featured_image: null as File | null,
        is_featured: !!adoption.is_featured,
        featured_position: adoption.featured_position?.toString() || '',
        featured_duration: adoption.featured_duration || '',
        images: [] as File[],
    });

    const handleDeleteGalleryImage = (imageId: number) => {
        if (confirm('Are you sure you want to remove this gallery image?')) {
            router.delete(route('admin.adoptions.gallery.destroy', imageId), {
                onSuccess: () => {
                    toast.success('Gallery image removed.');
                }
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.adoptions.update', adoption.id), {
            onSuccess: () => {
                toast.success('Adoption listing updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update adoption listing. Please check form validation errors.');
            }
        });
    };

    const handleProfileChange = (val: string) => {
        if (val === '' || val === 'none') {
            setData(prev => ({
                ...prev,
                profile_id: 'none',
                profile_type: ''
            }));
        } else {
            const [id, type] = val.split(':');
            setData(prev => ({
                ...prev,
                profile_id: id,
                profile_type: type
            }));
        }
    };

    const filteredProfiles = data.user_id 
        ? profiles.filter(p => p.user_id?.toString() === data.user_id)
        : profiles;

    const filteredFormCities = cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Edit Adoption Listing">
            <Head title={`Edit Adoption - ${adoption.title}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.adoptions.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Adoption: {adoption.title}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update pet description, rehoming fee, and photo gallery</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* 1. Account & Profile Mapping */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Listing Owner</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Map this listing to a registered owner user account and optional provider profile.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Owner User *</Label>
                                <select 
                                    id="user_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.user_id} 
                                    onChange={e => {
                                        setData(prev => ({
                                            ...prev,
                                            user_id: e.target.value,
                                            profile_id: 'none',
                                            profile_type: ''
                                        }));
                                    }}
                                >
                                    <option value="" disabled>Select Owner User...</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id.toString()}>
                                            {u.name} ({u.role?.name || `Role #${u.role_id}`}) - {u.email}
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="profile_mapping" className="text-xs font-bold text-woof-charcoal">Linked Business/NGO Profile</Label>
                                <select 
                                    id="profile_mapping" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.profile_id !== 'none' && data.profile_type ? `${data.profile_id}:${data.profile_type}` : 'none'} 
                                    onChange={e => handleProfileChange(e.target.value)}
                                >
                                    <option value="none">None / Independent Listing</option>
                                    {filteredProfiles.map((p) => {
                                        const typeName = p.type.split('\\').pop()?.replace('Profile', '') || 'Profile';
                                        return (
                                            <option key={`${p.id}:${p.type}`} value={`${p.id}:${p.type}`}>
                                                {p.name} [{typeName}]
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.profile_id && <p className="text-xs text-rose-500">{errors.profile_id}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Pet Identity & Listing Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Heart className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Listing & Pet Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the listing heading, breed details, gender, age range, adoption fee status, and descriptions.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Listing Title *</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. Playful Golden Retriever Puppy for Adoption" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="slug" className="text-xs font-bold text-woof-charcoal">Custom URL Slug (Optional)</Label>
                                <Input 
                                    id="slug" 
                                    value={data.slug} 
                                    onChange={e => setData('slug', e.target.value)} 
                                    placeholder="e.g. golden-retriever-puppy-adoption" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.slug && <p className="text-xs text-rose-500">{errors.slug}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="breed_id" className="text-xs font-bold text-woof-charcoal">Breed *</Label>
                                <select 
                                    id="breed_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.breed_id} 
                                    onChange={e => setData('breed_id', e.target.value)}
                                >
                                    <option value="" disabled>Select Breed...</option>
                                    {breeds.map((b) => (
                                        <option key={b.id} value={b.id.toString()}>{b.name}</option>
                                    ))}
                                </select>
                                {errors.breed_id && <p className="text-xs text-rose-500">{errors.breed_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="gender" className="text-xs font-bold text-woof-charcoal">Gender *</Label>
                                <select 
                                    id="gender" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer" 
                                    value={data.gender} 
                                    onChange={e => setData('gender', e.target.value as any)}
                                >
                                    <option value="" disabled>Select Gender...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && <p className="text-xs text-rose-500">{errors.gender}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="age" className="text-xs font-bold text-woof-charcoal">Age Range</Label>
                                <Input 
                                    id="age" 
                                    value={data.age} 
                                    onChange={e => setData('age', e.target.value)} 
                                    placeholder="e.g. 3 Months, 2 Years" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="fee" className="text-xs font-bold text-woof-charcoal">Adoption Fee (₹) - Leave blank if Free</Label>
                                <Input 
                                    id="fee" 
                                    type="number"
                                    step="0.01"
                                    value={data.fee} 
                                    onChange={e => setData('fee', e.target.value)} 
                                    placeholder="e.g. 1500" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.fee && <p className="text-xs text-rose-500">{errors.fee}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status" className="text-xs font-bold text-woof-charcoal">Listing Status *</Label>
                                <select 
                                    id="status" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer" 
                                    value={data.status} 
                                    onChange={e => setData('status', e.target.value as any)}
                                >
                                    <option value="draft">Draft / Hidden</option>
                                    <option value="published">Published</option>
                                    <option value="available">Available for Adoption</option>
                                    <option value="unavailable">Unavailable / Closed</option>
                                </select>
                                {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#fcfbf9] p-4 rounded-2xl border border-[#e8ded1]">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_negotiable" 
                                    checked={data.is_negotiable} 
                                    onCheckedChange={checked => setData('is_negotiable', !!checked)} 
                                />
                                <Label htmlFor="is_negotiable" className="text-xs font-bold text-woof-charcoal cursor-pointer">Fee Negotiable</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_vaccinated" 
                                    checked={data.is_vaccinated} 
                                    onCheckedChange={checked => setData('is_vaccinated', !!checked)} 
                                />
                                <Label htmlFor="is_vaccinated" className="text-xs font-bold text-woof-charcoal cursor-pointer">Vaccinated</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_available" 
                                    checked={data.is_available} 
                                    onCheckedChange={checked => setData('is_available', !!checked)} 
                                />
                                <Label htmlFor="is_available" className="text-xs font-bold text-woof-charcoal cursor-pointer">Is Available</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_approved" 
                                    checked={data.is_approved} 
                                    onCheckedChange={checked => setData('is_approved', !!checked)} 
                                />
                                <Label htmlFor="is_approved" className="text-xs font-bold text-woof-charcoal cursor-pointer">Approved</Label>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Pet Story & Description *</Label>
                            <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Location Cascades */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Location Scope</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            State the active location region where the pet is available.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">State Location *</Label>
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
                                <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal">City Location *</Label>
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
                    </div>
                </div>

                {/* 4. Champion Status & Achievements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Award className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Show & Champion Status</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Mark if the pet has won official show awards or championship titles.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="flex items-center space-x-2 bg-[#fcfbf9] p-3.5 rounded-2xl border border-[#e8ded1]">
                            <Checkbox 
                                id="is_champion" 
                                checked={data.is_champion} 
                                onCheckedChange={checked => setData('is_champion', !!checked)} 
                            />
                            <Label htmlFor="is_champion" className="text-xs font-bold text-woof-charcoal cursor-pointer">Official Champion Title Holder</Label>
                        </div>

                        {data.is_champion && (
                            <div className="space-y-1.5">
                                <Label htmlFor="awards_count" className="text-xs font-bold text-woof-charcoal">Total Show Awards Won</Label>
                                <Input 
                                    id="awards_count" 
                                    type="number"
                                    value={data.awards_count} 
                                    onChange={e => setData('awards_count', e.target.value)} 
                                    placeholder="e.g. 3" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.awards_count && <p className="text-xs text-rose-500">{errors.awards_count}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Featured Listings Promotion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Promoted / Featured</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Pin this listing to the main dashboard or directory banner spotlight.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="flex items-center space-x-2 bg-[#fcfbf9] p-3.5 rounded-2xl border border-[#e8ded1]">
                            <Checkbox 
                                id="is_featured" 
                                checked={data.is_featured} 
                                onCheckedChange={checked => setData('is_featured', !!checked)} 
                            />
                            <Label htmlFor="is_featured" className="text-xs font-bold text-woof-charcoal cursor-pointer">Feature and Promote Listing</Label>
                        </div>

                        {data.is_featured && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="featured_position" className="text-xs font-bold text-woof-charcoal">Featured Position Index (1-5)</Label>
                                    <Input 
                                        id="featured_position" 
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={data.featured_position} 
                                        onChange={e => setData('featured_position', e.target.value)} 
                                        placeholder="e.g. 1" 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                    />
                                    {errors.featured_position && <p className="text-xs text-rose-500">{errors.featured_position}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="featured_duration" className="text-xs font-bold text-woof-charcoal">Promotion Duration</Label>
                                    <select 
                                        id="featured_duration" 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        value={data.featured_duration} 
                                        onChange={e => setData('featured_duration', e.target.value)}
                                    >
                                        <option value="">Select Promotion Period...</option>
                                        <option value="1d">1 Day</option>
                                        <option value="3d">3 Days</option>
                                        <option value="7d">7 Days</option>
                                        <option value="15d">15 Days</option>
                                        <option value="30d">30 Days</option>
                                    </select>
                                    {errors.featured_duration && <p className="text-xs text-rose-500">{errors.featured_duration}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Media Gallery & Featured Image */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media & Photos</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload new photos and view/delete currently uploaded gallery photos.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="featured_image" className="text-xs font-bold text-woof-charcoal">Primary / Featured Image</Label>
                                <div className="flex items-center gap-3">
                                    {adoption.featured_image_url && (
                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] bg-[#fcfbf9] shrink-0 shadow-2xs">
                                            <img src={adoption.featured_image_url} alt={adoption.title} className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <Input 
                                        id="featured_image" 
                                        type="file"
                                        onChange={e => setData('featured_image', e.target.files ? e.target.files[0] : null)} 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20 w-full" 
                                    />
                                </div>
                                {errors.featured_image && <p className="text-xs text-rose-500">{errors.featured_image}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="images" className="text-xs font-bold text-woof-charcoal">Upload Additional Photos</Label>
                                <Input 
                                    id="images" 
                                    type="file"
                                    multiple
                                    onChange={e => {
                                        if (e.target.files) {
                                            setData('images', Array.from(e.target.files));
                                        }
                                    }} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20" 
                                />
                                {errors.images && <p className="text-xs text-rose-500">{errors.images}</p>}
                            </div>
                        </div>

                        {adoption.images && adoption.images.length > 0 && (
                            <div className="border-t border-[#e8ded1] pt-4">
                                <Label className="text-xs font-bold text-woof-charcoal block mb-3">Currently Active Gallery ({adoption.images.length})</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {adoption.images.map((img) => (
                                        <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-[#e8ded1] aspect-square bg-[#fcfbf9] shadow-2xs">
                                            <img src={img.image} alt="gallery" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGalleryImage(img.id)}
                                                    className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all shadow-xs cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.adoptions.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Update Listing
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
