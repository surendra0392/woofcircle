import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Globe, Image as ImageIcon, Trash2, Heart } from 'lucide-react';

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

interface VetService {
    id: number;
    name: string;
}

interface GalleryImage {
    id: number;
    image: string;
}

interface VetData {
    id: number;
    user_id: number | null;
    clinic_name: string;
    description: string | null;
    phone: string;
    email: string | null;
    state_id: number;
    city_id: number;
    address: string;
    experience_years: number | null;
    logo: string | null;
    is_active: boolean;
    services: number[];
    gallery: GalleryImage[];
}

interface PageProps {
    vet: VetData;
    states: State[];
    cities: City[];
    availableUsers: User[];
    allServices: VetService[];
}

export default function VetEditPage({ vet, states = [], cities = [], availableUsers = [], allServices = [] }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: vet.user_id?.toString() || '',
        clinic_name: vet.clinic_name || '',
        description: vet.description || '',
        phone: vet.phone || '',
        email: vet.email || '',
        state_id: vet.state_id?.toString() || '',
        city_id: vet.city_id?.toString() || '',
        address: vet.address || '',
        experience_years: vet.experience_years?.toString() || '',
        logo: null as File | null,
        gallery: [] as File[],
        services: vet.services || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.vets.update', vet.id), {
            onSuccess: () => {
                toast.success('Veterinary clinic updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update clinic. Please check form validation errors.');
            }
        });
    };

    const handleDeleteGalleryImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image from the gallery?')) {
            router.delete(route('admin.vets.gallery.destroy', imageId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Gallery image deleted.');
                }
            });
        }
    };

    const filteredFormCities = cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Edit Veterinary Clinic">
            <Head title={`Edit Clinic - ${vet.clinic_name}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.vets.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Clinic: {vet.clinic_name}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update hospital identity, offered treatments, and gallery media</p>
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
                            Link this clinical profile to a registered veterinarian account.
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
                                <option value="">None / External Clinic Partner</option>
                                {availableUsers?.map((u: any) => (
                                    <option key={u.id} value={u.id.toString()}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Clinic Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Clinic Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the clinic name, contact info, clinical experience years, and detail their operations.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="clinic_name" className="text-xs font-bold text-woof-charcoal">Clinic Name *</Label>
                                <Input 
                                    id="clinic_name" 
                                    value={data.clinic_name} 
                                    onChange={e => setData('clinic_name', e.target.value)} 
                                    placeholder="e.g. Apex Vet Care" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.clinic_name && <p className="text-xs text-rose-500">{errors.clinic_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="logo" className="text-xs font-bold text-woof-charcoal">Logo / Clinic Brand Image</Label>
                                <div className="flex gap-3 items-center">
                                    {vet.logo && (
                                        <div className="h-10 w-10 shrink-0 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] overflow-hidden shadow-2xs">
                                            <img src={vet.logo} alt="current logo" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <Input 
                                        id="logo" 
                                        type="file"
                                        onChange={e => setData('logo', e.target.files ? e.target.files[0] : null)} 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20" 
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
                                    placeholder="contact@clinic.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="experience_years" className="text-xs font-bold text-woof-charcoal">Experience (Years)</Label>
                                <Input 
                                    id="experience_years" 
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.experience_years} 
                                    onChange={e => setData('experience_years', e.target.value)} 
                                    placeholder="e.g. 8" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.experience_years && <p className="text-xs text-rose-500">{errors.experience_years}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Clinic description</Label>
                            <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Services Offered */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Heart className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Services Offered</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select the clinical services, diagnostic facilities, or surgeries this vet partner supports.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {allServices.map((service) => (
                                <div 
                                    key={service.id} 
                                    className={`flex items-center space-x-3 rounded-2xl border p-3.5 transition-all cursor-pointer ${
                                        data.services.includes(service.id) ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                    }`}
                                    onClick={() => {
                                        if (data.services.includes(service.id)) {
                                            setData('services', data.services.filter(id => id !== service.id));
                                        } else {
                                            setData('services', [...data.services, service.id]);
                                        }
                                    }}
                                >
                                    <Checkbox 
                                        id={`service-${service.id}`}
                                        checked={data.services.includes(service.id)}
                                        onCheckedChange={() => {}}
                                    />
                                    <Label htmlFor={`service-${service.id}`} className="text-xs font-bold text-woof-charcoal cursor-pointer select-none">
                                        {service.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.services && <p className="text-xs text-rose-500 mt-2">{errors.services}</p>}
                    </div>
                </div>

                {/* 4. Geographical Scope */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Geographical Context</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select the clinic's operating state, city, and full physical address.
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

                {/* 5. Media gallery upload & existing images */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media Gallery</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload photos of diagnostic wards, surgery rooms, or medical equipment.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        {vet.gallery && vet.gallery.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal">Current Facility Photos</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {vet.gallery.map((img) => (
                                        <div key={img.id} className="relative group aspect-square rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] overflow-hidden shadow-2xs">
                                            <img src={img.image} alt="gallery" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleDeleteGalleryImage(img.id)}
                                                    className="p-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.vets.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
