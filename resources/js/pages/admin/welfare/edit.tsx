import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Globe, Image as ImageIcon, Trash2, HeartHandshake } from 'lucide-react';

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

interface GalleryImage {
    id: number;
    image: string;
}

interface WelfareProfile {
    id: number;
    user_id: number | null;
    organization_name: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    youtube_url: string | null;
    state_id: number;
    city_id: number;
    address: string;
    logo: string | null;
    gallery: GalleryImage[];
    user?: User;
}

interface PageProps {
    profile: WelfareProfile;
    states: State[];
    cities: City[];
    availableUsers: User[];
}

export default function WelfareEditPage({ profile, states = [], cities = [], availableUsers = [] }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: profile.user_id?.toString() || '',
        organization_name: profile.organization_name || '',
        description: profile.description || '',
        phone: profile.phone || '',
        email: profile.email || '',
        website: profile.website || '',
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        twitter_url: profile.twitter_url || '',
        youtube_url: profile.youtube_url || '',
        state_id: profile.state_id?.toString() || '',
        city_id: profile.city_id?.toString() || '',
        address: profile.address || '',
        logo: null as File | null,
        gallery: [] as File[],
    });

    const handleDeleteGalleryImage = (imageId: number) => {
        if (confirm('Are you sure you want to remove this gallery image?')) {
            router.delete(route('admin.welfare.gallery.destroy', imageId), {
                onSuccess: () => {
                    toast.success('Gallery image removed.');
                }
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.welfare.update', profile.id), {
            onSuccess: () => {
                toast.success('Welfare profile updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update welfare profile. Please check form validation errors.');
            }
        });
    };

    const filteredFormCities = cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Edit Welfare Organization">
            <Head title={`Edit Organization - ${profile.organization_name}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.welfare.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Organization: {profile.organization_name}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update shelter credentials, contact information, and shelter images</p>
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
                            Link this profile to a registered user account belonging to a welfare NGO role.
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
                                <option value="">None / External Welfare NGO</option>
                                {profile.user && !availableUsers.some(u => u.id === profile.user?.id) && (
                                    <option value={profile.user.id.toString()}>{profile.user.name} ({profile.user.email})</option>
                                )}
                                {availableUsers?.map((u: any) => (
                                    <option key={u.id} value={u.id.toString()}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Organization Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Organization Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the organization name, contact phone, website, and details of their shelter operations.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="organization_name" className="text-xs font-bold text-woof-charcoal">Organization Name *</Label>
                                <Input 
                                    id="organization_name" 
                                    value={data.organization_name} 
                                    onChange={e => setData('organization_name', e.target.value)} 
                                    placeholder="e.g. Hope Animal Rescue" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.organization_name && <p className="text-xs text-rose-500">{errors.organization_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="logo" className="text-xs font-bold text-woof-charcoal">Logo / Shelter Image</Label>
                                <div className="flex items-center gap-3">
                                    {profile.logo && (
                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] bg-[#fcfbf9] shrink-0 shadow-2xs">
                                            <img src={profile.logo} alt={profile.organization_name} className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <Input 
                                        id="logo" 
                                        type="file"
                                        onChange={e => setData('logo', e.target.files ? e.target.files[0] : null)} 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20 w-full" 
                                    />
                                </div>
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
                                    placeholder="contact@shelter.org" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="website" className="text-xs font-bold text-woof-charcoal">Website URL</Label>
                                <Input 
                                    id="website" 
                                    type="url"
                                    value={data.website} 
                                    onChange={e => setData('website', e.target.value)} 
                                    placeholder="https://shelter.org" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.website && <p className="text-xs text-rose-500">{errors.website}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="facebook_url" className="text-xs font-bold text-woof-charcoal">Facebook URL</Label>
                                <Input 
                                    id="facebook_url" 
                                    type="url"
                                    value={data.facebook_url} 
                                    onChange={e => setData('facebook_url', e.target.value)} 
                                    placeholder="https://facebook.com/shelter" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.facebook_url && <p className="text-xs text-rose-500">{errors.facebook_url}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="instagram_url" className="text-xs font-bold text-woof-charcoal">Instagram URL</Label>
                                <Input 
                                    id="instagram_url" 
                                    type="url"
                                    value={data.instagram_url} 
                                    onChange={e => setData('instagram_url', e.target.value)} 
                                    placeholder="https://instagram.com/shelter" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.instagram_url && <p className="text-xs text-rose-500">{errors.instagram_url}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="twitter_url" className="text-xs font-bold text-woof-charcoal">Twitter URL</Label>
                                <Input 
                                    id="twitter_url" 
                                    type="url"
                                    value={data.twitter_url} 
                                    onChange={e => setData('twitter_url', e.target.value)} 
                                    placeholder="https://twitter.com/shelter" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.twitter_url && <p className="text-xs text-rose-500">{errors.twitter_url}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="youtube_url" className="text-xs font-bold text-woof-charcoal">YouTube URL</Label>
                                <Input 
                                    id="youtube_url" 
                                    type="url"
                                    value={data.youtube_url} 
                                    onChange={e => setData('youtube_url', e.target.value)} 
                                    placeholder="https://youtube.com/shelter" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.youtube_url && <p className="text-xs text-rose-500">{errors.youtube_url}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Shelter Mission & Description</Label>
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
                            Select the organization's operating state, city, and full physical address.
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

                {/* 4. Media gallery upload */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media Gallery</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload new photos and view/delete currently uploaded gallery photos.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="gallery" className="text-xs font-bold text-woof-charcoal">Upload Additional Photos</Label>
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

                        {profile.gallery && profile.gallery.length > 0 && (
                            <div className="border-t border-[#e8ded1] pt-4">
                                <Label className="text-xs font-bold text-woof-charcoal block mb-3">Currently Active Gallery ({profile.gallery.length})</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {profile.gallery.map((img) => (
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
                        href={route('admin.welfare.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Update Profile
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
