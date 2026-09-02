import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, MapPin, BookOpen, Image, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PetShopCreatePage({ states = [], cities = [], users = [] }: any) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: '',
        shop_name: '',
        slug: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        state_id: '',
        city_id: '',
        address: '',
        logo: null as File | null,
        gallery: [] as File[],
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Cleanup logo preview object URL
    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.pet-shops.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Pet Shop created successfully.');
            },
            onError: () => {
                toast.error('Failed to create Pet Shop. Please check form validation errors.');
            }
        });
    };

    const filteredCities = cities.filter((c: any) => c.state_id?.toString() === data.state_id?.toString());

    return (
        <AdminLayout title="Add Pet Shop">
            <Head title="Add Pet Shop - Admin" />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.pet-shops.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Add Pet Shop</h2>
                    <p className="text-xs text-woof-charcoal/60">Register a new retail store profile and storefront details</p>
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
                            Define the name, slug, phone, email, optional website link, and link this store to a registered user owner.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="shop_name" className="text-xs font-bold text-woof-charcoal">Shop Name *</Label>
                                <Input 
                                    id="shop_name" 
                                    value={data.shop_name} 
                                    onChange={e => setData('shop_name', e.target.value)} 
                                    placeholder="e.g. Premium Pets Store" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.shop_name && <p className="text-xs text-rose-500">{errors.shop_name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="slug" className="text-xs font-bold text-woof-charcoal">Slug (URL segment) *</Label>
                                <Input 
                                    id="slug" 
                                    value={data.slug} 
                                    onChange={e => setData('slug', e.target.value)} 
                                    placeholder="e.g. premium-pets-store" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.slug && <p className="text-xs text-rose-500">{errors.slug}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-bold text-woof-charcoal">Phone Number (10 digits) *</Label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-r-0 border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs font-bold text-woof-charcoal/60 rounded-l-2xl">
                                        +91
                                    </div>
                                    <Input 
                                        id="phone" 
                                        value={data.phone} 
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                                            setData('phone', val);
                                        }} 
                                        placeholder="9876543210" 
                                        className="h-10 rounded-l-none rounded-r-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    placeholder="e.g. contact@premiumpets.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                            </div>
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Owner User Account</Label>
                                <SearchableSelect 
                                    options={[
                                        { value: '', label: 'Select Owner (Optional)...' },
                                        ...(users?.map((u: any) => ({
                                            value: u.id.toString(),
                                            label: `${u.name} (${u.email}) - ${u.role?.name || 'No Role'}`
                                        })) || [])
                                    ]}
                                    value={data.user_id || ''}
                                    onChange={(val) => setData('user_id', val)}
                                    placeholder="Search owner user account..."
                                    className="w-full h-10 border-[#e8ded1] bg-[#fcfbf9] rounded-2xl text-xs font-medium"
                                />
                                {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                            </div>
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <Label htmlFor="website" className="text-xs font-bold text-woof-charcoal">Website URL</Label>
                                <Input 
                                    id="website" 
                                    type="url"
                                    value={data.website} 
                                    onChange={e => setData('website', e.target.value)} 
                                    placeholder="e.g. https://www.premiumpets.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.website && <p className="text-xs text-rose-500">{errors.website}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Detailed Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Shop Description</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide a rich overview of products, brands, specialties, store hours, and unique features.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                            <div className="rounded-2xl overflow-hidden border border-[#e8ded1]">
                                <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            </div>
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Location Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Geographical Location</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select the physical shop territory (state, city) and write down the complete street address.
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
                                    onChange={e => {
                                        setData(prev => ({
                                            ...prev,
                                            state_id: e.target.value,
                                            city_id: '',
                                        }));
                                    }}
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
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50" 
                                    disabled={!data.state_id} 
                                    value={data.city_id} 
                                    onChange={e => setData('city_id', e.target.value)}
                                >
                                    <option value="">Select City</option>
                                    {filteredCities?.map((city: any) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                            </div>
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <Label htmlFor="address" className="text-xs font-bold text-woof-charcoal">Complete Address *</Label>
                                <Textarea 
                                    id="address" 
                                    value={data.address} 
                                    onChange={e => setData('address', e.target.value)} 
                                    placeholder="e.g. Shop No 14, Main Commercial Street, Sector 2" 
                                    className="min-h-24 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.address && <p className="text-xs text-rose-500">{errors.address}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Social Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <LinkIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Social Profiles</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Add links to the store's Facebook, Instagram, Twitter/X, and YouTube channels.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="facebook_url" className="text-xs font-bold text-woof-charcoal">Facebook URL</Label>
                                <Input 
                                    id="facebook_url" 
                                    type="url"
                                    value={data.facebook_url} 
                                    onChange={e => setData('facebook_url', e.target.value)} 
                                    placeholder="e.g. https://facebook.com/yourshop" 
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
                                    placeholder="e.g. https://instagram.com/yourshop" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.instagram_url && <p className="text-xs text-rose-500">{errors.instagram_url}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="twitter_url" className="text-xs font-bold text-woof-charcoal">Twitter URL</Label>
                                <Input 
                                    id="twitter_url" 
                                    type="url"
                                    value={data.twitter_url} 
                                    onChange={e => setData('twitter_url', e.target.value)} 
                                    placeholder="e.g. https://twitter.com/yourshop" 
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
                                    placeholder="e.g. https://youtube.com/@yourshop" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.youtube_url && <p className="text-xs text-rose-500">{errors.youtube_url}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Media Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Image className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media & Storefront</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload a storefront logo or icon and add multiple gallery pictures displaying layout and products.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Logo Image */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Shop Logo</Label>
                                <div className="flex flex-col gap-3">
                                    {logoPreview ? (
                                        <div className="h-32 w-full border border-[#e8ded1] rounded-2xl bg-[#fcfbf9] flex items-center justify-center relative overflow-hidden group">
                                            <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs text-white font-bold">Change Logo</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-32 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-7 w-7 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Shop Logo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
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
                                <div className="flex flex-col gap-3">
                                    {data.gallery && data.gallery.length > 0 ? (
                                        <div className="border border-[#e8ded1] p-3 rounded-2xl bg-[#fcfbf9] space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {data.gallery.map((file: File, idx: number) => (
                                                    <img key={idx} src={URL.createObjectURL(file)} alt={`Gallery Preview ${idx}`} className="h-16 w-16 object-cover border border-[#e8ded1] rounded-xl" />
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('gallery', [])}
                                                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                                                >
                                                    Clear Images
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-32 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-7 w-7 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Storefront Photos</span>
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

                {/* Submit Action */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.pet-shops.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Save Shop
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
