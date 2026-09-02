import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, MapPin, BookOpen, Image, UploadCloud } from 'lucide-react';

export default function BreederCreatePage({ states, cities, availableUsers }: any) {
    const { data, setData, post, errors, processing } = useForm({
        _method: 'post',
        user_id: '',
        kennel_name: '',
        email: '',
        phone: '',
        description: '',
        address: '',
        state_id: '',
        city_id: '',
        logo: null as File | null,
        gallery: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.breeders.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Add Breeder">
            <Head title="Add Breeder" />
            
            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.breeders.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Add Breeder</h2>
                    <p className="text-xs text-woof-charcoal/60">Configure kennel registry and account assignment</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6" encType="multipart/form-data">
                {/* 1. Basic Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Basic Information</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter the registry name of the kennel or organization, along with direct contact details.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="kennel_name" className="text-xs font-bold text-woof-charcoal">Kennel / Organization Name *</Label>
                                <Input 
                                    id="kennel_name" 
                                    value={data.kennel_name} 
                                    onChange={e => setData('kennel_name', e.target.value)} 
                                    placeholder="e.g. Golden Paws Kennel" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.kennel_name && <p className="text-xs text-rose-500">{errors.kennel_name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal">Email *</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    placeholder="e.g. contact@kennel.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5 max-w-md">
                            <Label htmlFor="phone" className="text-xs font-bold text-woof-charcoal">Phone *</Label>
                            <div className="flex">
                                <div className="flex items-center justify-center border border-r-0 border-[#e8ded1] bg-[#fcfbf9] px-3.5 rounded-l-2xl text-xs font-bold text-woof-charcoal/60">
                                    +91
                                </div>
                                <Input 
                                    id="phone" 
                                    value={data.phone} 
                                    onChange={e => {
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
                    </div>
                </div>

                {/* 2. Location & User Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Location & Assignment</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Assign regional boundaries for this breeder and optionally link their login credentials.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">State *</Label>
                                <select 
                                    id="state_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.state_id} 
                                    onChange={e => setData('state_id', e.target.value)}
                                >
                                    <option value="">Select State</option>
                                    {states?.map((state: any) => (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal">City *</Label>
                                <select 
                                    id="city_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={!data.state_id} 
                                    value={data.city_id} 
                                    onChange={e => setData('city_id', e.target.value)}
                                >
                                    <option value="">Select City</option>
                                    {cities?.filter((c: any) => c.state_id == data.state_id).map((city: any) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Assign to User (Optional)</Label>
                            <SearchableSelect 
                                options={[
                                    { value: '', label: 'None' },
                                    ...(availableUsers?.map((u: any) => ({
                                        value: u.id.toString(),
                                        label: `${u.name} (${u.email}) - ${u.role?.name || 'No Role'}`
                                    })) || [])
                                ]}
                                value={data.user_id || ''}
                                onChange={(val) => setData('user_id', val)}
                                placeholder="Select a user..."
                                className="w-full h-10 border-[#e8ded1] rounded-2xl text-xs"
                            />
                            {!data.user_id && <p className="text-[11px] text-woof-charcoal/50 mt-1 pl-1">Profile will be managed by Admin</p>}
                            {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Detailed Profile</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide Kennel street address coordinates and a detailed descriptive overview of breeder history/specializations.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="address" className="text-xs font-bold text-woof-charcoal">Address *</Label>
                            <Input 
                                id="address" 
                                value={data.address} 
                                onChange={e => setData('address', e.target.value)} 
                                placeholder="e.g. 123 Breeder Lane, Suite 100" 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.address && <p className="text-xs text-rose-500">{errors.address}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                            <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 4. Media Assets Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Image className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media & Assets</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload high-resolution logo and image gallery assets to showcase the kennel facilities and environment.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo Image */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Logo Image</Label>
                                <div className="flex flex-col gap-4">
                                    {data.logo ? (
                                        <div className="h-28 w-28 border border-[#e8ded1] rounded-2xl bg-[#fcfbf9] flex items-center justify-center relative overflow-hidden group shadow-2xs">
                                            <img src={URL.createObjectURL(data.logo)} alt="Logo Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-white font-bold uppercase text-center px-2">Change</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setData('logo', e.target.files?.[0] || null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-28 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-6 w-6 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Kennel Logo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setData('logo', e.target.files?.[0] || null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.logo && <p className="text-xs text-rose-500">{errors.logo}</p>}
                            </div>
                            
                            {/* Gallery Images */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Gallery Images</Label>
                                <div className="flex flex-col gap-4">
                                    {data.gallery && data.gallery.length > 0 ? (
                                        <div className="border border-[#e8ded1] p-3 rounded-2xl bg-[#fcfbf9] space-y-3 shadow-2xs">
                                            <div className="flex flex-wrap gap-2">
                                                {data.gallery.map((file: File, idx: number) => (
                                                    <img key={idx} src={URL.createObjectURL(file)} alt={`Gallery Preview ${idx}`} className="h-14 w-14 object-cover rounded-xl border border-[#e8ded1]" />
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('gallery', [])}
                                                    className="text-[10px] text-rose-600 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                                                >
                                                    Clear Gallery
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-28 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-6 w-6 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Gallery Photos</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={e => setData('gallery', Array.from(e.target.files || []))}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.gallery && <p className="text-xs text-rose-500">{errors.gallery}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex justify-end pt-6 border-t border-[#e8ded1] gap-3">
                    <Link 
                        href={route('admin.breeders.index')} 
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-7 text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Breeder'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
