import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Globe, Image as ImageIcon, Trash2, Home } from 'lucide-react';

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

interface Boarding {
    id: number;
    user_id: number | null;
    name: string;
    description: string | null;
    phone: string;
    email: string | null;
    service_type: 'boarding' | 'daycare' | 'both';
    price_per_day: number | null;
    capacity: number | null;
    state_id: number;
    city_id: number;
    address: string;
    logo: string | null;
    gallery: GalleryImage[];
    user?: User;
}

interface PageProps {
    profile: Boarding;
    states: State[];
    cities: City[];
    availableUsers: User[];
}

export default function BoardingEditPage({ profile, states = [], cities = [], availableUsers = [] }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: profile.user_id?.toString() || '',
        name: profile.name || '',
        description: profile.description || '',
        phone: profile.phone || '',
        email: profile.email || '',
        service_type: profile.service_type || 'boarding',
        price_per_day: profile.price_per_day?.toString() || '',
        capacity: profile.capacity?.toString() || '',
        state_id: profile.state_id?.toString() || '',
        city_id: profile.city_id?.toString() || '',
        address: profile.address || '',
        logo: null as File | null,
        gallery: [] as File[],
    });

    const handleDeleteGalleryImage = (imageId: number) => {
        if (confirm('Are you sure you want to remove this gallery image?')) {
            router.delete(route('admin.boarding.gallery.destroy', imageId), {
                onSuccess: () => {
                    toast.success('Gallery image removed.');
                }
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.boarding.update', profile.id), {
            onSuccess: () => {
                toast.success('Boarding profile updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update boarding profile. Please check form validation errors.');
            }
        });
    };

    const filteredFormCities = cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Edit Boarding Provider">
            <Head title={`Edit Boarding - ${profile.name}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.boarding.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Facility: {profile.name}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update lodging capacity, day rates, and facility amenities</p>
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
                            Link this facility profile to a registered user account belonging to a boarding provider role.
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

                {/* 2. Facility Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Facility Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the provider name, phone number, email, and choose the service scope of operations.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Facility Name *</Label>
                                <Input 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="e.g. Happy Paws Boarding" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="logo" className="text-xs font-bold text-woof-charcoal">Logo / Facility Image</Label>
                                <div className="flex items-center gap-3">
                                    {profile.logo && (
                                        <div className="h-10 w-10 rounded-2xl overflow-hidden border border-[#e8ded1] bg-[#fcfbf9] shrink-0 shadow-2xs">
                                            <img src={profile.logo} alt={profile.name} className="h-full w-full object-cover" />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="boarding@example.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="service_type" className="text-xs font-bold text-woof-charcoal">Service Type *</Label>
                                <select 
                                    id="service_type" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 cursor-pointer" 
                                    value={data.service_type} 
                                    onChange={e => setData('service_type', e.target.value as any)}
                                >
                                    <option value="boarding">Boarding Only</option>
                                    <option value="daycare">Daycare Only</option>
                                    <option value="both">Both Services</option>
                                </select>
                                {errors.service_type && <p className="text-xs text-rose-500">{errors.service_type}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="price_per_day" className="text-xs font-bold text-woof-charcoal">Price Per Day (₹)</Label>
                                <Input 
                                    id="price_per_day" 
                                    type="number"
                                    step="0.01"
                                    value={data.price_per_day} 
                                    onChange={e => setData('price_per_day', e.target.value)} 
                                    placeholder="e.g. 500" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.price_per_day && <p className="text-xs text-rose-500">{errors.price_per_day}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="capacity" className="text-xs font-bold text-woof-charcoal">Dog Capacity</Label>
                                <Input 
                                    id="capacity" 
                                    type="number"
                                    value={data.capacity} 
                                    onChange={e => setData('capacity', e.target.value)} 
                                    placeholder="e.g. 15" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.capacity && <p className="text-xs text-rose-500">{errors.capacity}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Facility Description</Label>
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
                            Select the facility's operating state, city, and full physical address.
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
                        href={route('admin.boarding.index')}
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
