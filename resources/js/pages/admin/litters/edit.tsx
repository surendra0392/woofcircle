import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Info, MapPin, BookOpen, Image, UploadCloud, ShieldCheck, Tag, IndianRupee, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LitterEditPage({ litter, breeds = [], users = [], profiles = [], states = [], cities = [] }: any) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: litter.user_id?.toString() || '',
        profile_id: litter.profile_id?.toString() || '',
        profile_type: litter.profile_type || '',
        breed_id: litter.breed_id?.toString() || '',
        title: litter.title || '',
        slug: litter.slug || '',
        description: litter.description || '',
        price: litter.price?.toString() || '',
        price_min: litter.price_min?.toString() || '',
        price_max: litter.price_max?.toString() || '',
        age: litter.age || '',
        kci_registered: !!litter.kci_registered,
        sire_name: litter.sire_name || '',
        dam_name: litter.dam_name || '',
        state_id: litter.state_id?.toString() || '',
        city_id: litter.city_id?.toString() || '',
        status: litter.status || 'draft',
        is_negotiable: !!litter.is_negotiable,
        is_vaccinated: !!litter.is_vaccinated,
        is_available: !!litter.is_available,
        is_approved: !!litter.is_approved,
        is_champion: !!litter.is_champion,
        awards_count: litter.awards_count?.toString() || '0',
        is_featured: !!litter.is_featured,
        featured_position: litter.featured_position?.toString() || '',
        featured_duration: litter.featured_duration || '',
        featured_image: null as File | null,
        images: [] as File[],
    });

    const [featuredPreview, setFeaturedPreview] = useState<string | null>(litter.featured_image_url || null);
    const [existingImages, setExistingImages] = useState<any[]>(litter.images || []);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (featuredPreview && featuredPreview !== litter.featured_image_url && featuredPreview.startsWith('blob:')) {
                URL.revokeObjectURL(featuredPreview);
            }
        };
    }, [featuredPreview, litter.featured_image_url]);

    const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            setFeaturedPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileChange = (value: string) => {
        if (!value) {
            setData((prev: any) => ({
                ...prev,
                profile_id: '',
                profile_type: '',
            }));
        } else {
            const [type, id, userId] = value.split('|');
            setData((prev: any) => ({
                ...prev,
                profile_type: type,
                profile_id: id,
                user_id: prev.user_id ? prev.user_id : userId || '',
            }));
        }
    };

    const handleDeleteExistingImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this gallery image?')) {
            router.delete(route('admin.litters.images.destroy', imageId), {
                onSuccess: () => {
                    setExistingImages(prev => prev.filter(img => img.id !== imageId));
                    toast.success('Gallery image removed successfully.');
                },
                onError: () => {
                    toast.error('Failed to remove gallery image.');
                }
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.litters.update', litter.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Litter">
            <Head title={`Edit Litter - ${litter.title}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.litters.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Litter: {litter.title}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update litter information, pricing, status, and photos</p>
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
                            Assign the listing title, breed taxonomy, user owner, and optional polymorphic profile relationships.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Litter Title *</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. Champion Lineage Siberian Husky Puppies" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <Label htmlFor="slug" className="text-xs font-bold text-woof-charcoal">Slug (Optional URL segment)</Label>
                                <Input 
                                    id="slug" 
                                    value={data.slug} 
                                    onChange={e => setData('slug', e.target.value)} 
                                    placeholder="e.g. champion-husky-puppies-2026" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.slug && <p className="text-xs text-rose-500">{errors.slug}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="breed_id" className="text-xs font-bold text-woof-charcoal">Breed *</Label>
                                <select 
                                    id="breed_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.breed_id} 
                                    onChange={e => setData('breed_id', e.target.value)}
                                >
                                    <option value="">Select Breed</option>
                                    {breeds?.map((breed: any) => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </select>
                                {errors.breed_id && <p className="text-xs text-rose-500">{errors.breed_id}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Owner User Account *</Label>
                                <SearchableSelect 
                                    options={[
                                        { value: '', label: 'Select user...' },
                                        ...(users?.map((u: any) => ({
                                            value: u.id.toString(),
                                            label: `${u.name} (${u.email}) - ${u.role?.name || 'No Role'}`
                                        })) || [])
                                    ]}
                                    value={data.user_id || ''}
                                    onChange={(val) => setData('user_id', val)}
                                    placeholder="Search user account..."
                                    className="w-full h-10 border-[#e8ded1] rounded-2xl text-xs"
                                />
                                {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                            </div>
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <Label htmlFor="profile_val" className="text-xs font-bold text-woof-charcoal">Link to Commercial Profile (Optional)</Label>
                                <select 
                                    id="profile_val" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.profile_id && data.profile_type ? `${data.profile_type}|${data.profile_id}|${data.user_id}` : ''} 
                                    onChange={e => handleProfileChange(e.target.value)}
                                >
                                    <option value="">None (Individual Listing)</option>
                                    {profiles?.map((profile: any, idx: number) => {
                                        const typeLabel = profile.type.split('\\').pop().replace('Profile', '');
                                        return (
                                            <option key={idx} value={`${profile.type}|${profile.id}|${profile.user_id}`}>
                                                [{typeLabel}] {profile.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.profile_id && <p className="text-xs text-rose-500">{errors.profile_id}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Location Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Geographical Location</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Specify state and city territories where the litter is located and available for inspection.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
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
                    </div>
                </div>

                {/* 3. Detailed Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Detailed Description</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Write descriptive information regarding general health profiles, diet plans, and vaccination history details.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Litter Description *</Label>
                            <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 4. Commercial Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <IndianRupee className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Commercial Profile</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Configure standard listing pricing, price range segments, status details, and specific check flags.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="price" className="text-xs font-bold text-woof-charcoal">Standard Price (₹)</Label>
                                <Input 
                                    id="price" 
                                    type="number"
                                    value={data.price} 
                                    onChange={e => setData('price', e.target.value)} 
                                    placeholder="e.g. 25000" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.price && <p className="text-xs text-rose-500">{errors.price}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="price_min" className="text-xs font-bold text-woof-charcoal">Min Price (₹)</Label>
                                <Input 
                                    id="price_min" 
                                    type="number"
                                    value={data.price_min} 
                                    onChange={e => setData('price_min', e.target.value)} 
                                    placeholder="e.g. 22000" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.price_min && <p className="text-xs text-rose-500">{errors.price_min}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="price_max" className="text-xs font-bold text-woof-charcoal">Max Price (₹)</Label>
                                <Input 
                                    id="price_max" 
                                    type="number"
                                    value={data.price_max} 
                                    onChange={e => setData('price_max', e.target.value)} 
                                    placeholder="e.g. 28000" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.price_max && <p className="text-xs text-rose-500">{errors.price_max}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="age" className="text-xs font-bold text-woof-charcoal">Litter Age *</Label>
                                <Input 
                                    id="age" 
                                    value={data.age} 
                                    onChange={e => setData('age', e.target.value)} 
                                    placeholder="e.g. 8 Weeks, 2 Months" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="status" className="text-xs font-bold text-woof-charcoal">Listing Status *</Label>
                                <select 
                                    id="status" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.status} 
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="soldout">Sold Out</option>
                                </select>
                                {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Boolean checkboxes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div 
                                onClick={() => setData('is_negotiable', !data.is_negotiable)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_negotiable ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox id="is_negotiable" checked={data.is_negotiable} onCheckedChange={(c) => setData('is_negotiable', c as boolean)} />
                                <Label htmlFor="is_negotiable" className="text-xs font-bold text-woof-charcoal cursor-pointer">Negotiable</Label>
                            </div>
                            <div 
                                onClick={() => setData('is_vaccinated', !data.is_vaccinated)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_vaccinated ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox id="is_vaccinated" checked={data.is_vaccinated} onCheckedChange={(c) => setData('is_vaccinated', c as boolean)} />
                                <Label htmlFor="is_vaccinated" className="text-xs font-bold text-woof-charcoal cursor-pointer">Vaccinated</Label>
                            </div>
                            <div 
                                onClick={() => setData('is_available', !data.is_available)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_available ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox id="is_available" checked={data.is_available} onCheckedChange={(c) => setData('is_available', c as boolean)} />
                                <Label htmlFor="is_available" className="text-xs font-bold text-woof-charcoal cursor-pointer">Available</Label>
                            </div>
                            <div 
                                onClick={() => setData('is_approved', !data.is_approved)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_approved ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox id="is_approved" checked={data.is_approved} onCheckedChange={(c) => setData('is_approved', c as boolean)} />
                                <Label htmlFor="is_approved" className="text-xs font-bold text-woof-charcoal cursor-pointer">Approved</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Lineage & Registry Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Registry & Lineage</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Set up lineage details, KCI kennel club registrations, sire and dam profiles, and show champion classifications.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setData('kci_registered', !data.kci_registered)}
                                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.kci_registered ? 'border-woof-gold bg-woof-gold/10 shadow-2xs' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox id="kci_registered" checked={data.kci_registered} onCheckedChange={(c) => setData('kci_registered', c as boolean)} className="mt-0.5" />
                                <div>
                                    <Label htmlFor="kci_registered" className="text-xs font-bold text-woof-charcoal cursor-pointer">KCI Registered</Label>
                                    <p className="text-[11px] text-woof-charcoal/60 mt-0.5 leading-relaxed">Indicates if this litter is officially registered with the Kennel Club of India.</p>
                                </div>
                            </div>

                            <div 
                                onClick={() => setData('is_champion', !data.is_champion)}
                                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_champion ? 'border-woof-gold bg-woof-gold/10 shadow-2xs' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox id="is_champion" checked={data.is_champion} onCheckedChange={(c) => setData('is_champion', c as boolean)} className="mt-0.5" />
                                <div>
                                    <Label htmlFor="is_champion" className="text-xs font-bold text-woof-charcoal cursor-pointer">Show Champion Lineage</Label>
                                    <p className="text-[11px] text-woof-charcoal/60 mt-0.5 leading-relaxed">Indicates if parents hold champion certificates or titles in conformation shows.</p>
                                </div>
                            </div>
                        </div>

                        {data.kci_registered && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-dashed border-[#e8ded1] rounded-2xl bg-[#fcfbf9]">
                                <div className="space-y-1.5">
                                    <Label htmlFor="sire_name" className="text-xs font-bold text-woof-charcoal">Sire Name (Father) *</Label>
                                    <Input 
                                        id="sire_name" 
                                        value={data.sire_name} 
                                        onChange={e => setData('sire_name', e.target.value)} 
                                        placeholder="e.g. Int Ch. Max of Golden Dunes" 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-white text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                    />
                                    {errors.sire_name && <p className="text-xs text-rose-500">{errors.sire_name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="dam_name" className="text-xs font-bold text-woof-charcoal">Dam Name (Mother) *</Label>
                                    <Input 
                                        id="dam_name" 
                                        value={data.dam_name} 
                                        onChange={e => setData('dam_name', e.target.value)} 
                                        placeholder="e.g. Ch. Bella of Snow Peaks" 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-white text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                    />
                                    {errors.dam_name && <p className="text-xs text-rose-500">{errors.dam_name}</p>}
                                </div>
                            </div>
                        )}

                        {data.is_champion && (
                            <div className="space-y-1.5 max-w-xs">
                                <Label htmlFor="awards_count" className="text-xs font-bold text-woof-charcoal">Awards / Certificates Count</Label>
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

                {/* 6. Promotional & Featured section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Tag className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Featured Listing Accent</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Configure promotional flags, featured carousel slots, and activation durations.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div 
                            onClick={() => setData('is_featured', !data.is_featured)}
                            className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                data.is_featured ? 'border-woof-gold bg-woof-gold/10 shadow-2xs' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                            }`}
                        >
                            <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(c) => setData('is_featured', c as boolean)} className="mt-0.5" />
                            <div>
                                <Label htmlFor="is_featured" className="text-xs font-bold text-woof-charcoal cursor-pointer">Feature on Homepage</Label>
                                <p className="text-[11px] text-woof-charcoal/60 mt-0.5 leading-relaxed">Pin this litter to premium carousel slots for enhanced breeder discovery.</p>
                            </div>
                        </div>

                        {data.is_featured && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-dashed border-[#e8ded1] rounded-2xl bg-[#fcfbf9]">
                                <div className="space-y-1.5">
                                    <Label htmlFor="featured_position" className="text-xs font-bold text-woof-charcoal">Carousel Position (1 - 5)</Label>
                                    <select 
                                        id="featured_position" 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-white px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        value={data.featured_position} 
                                        onChange={e => setData('featured_position', e.target.value)}
                                    >
                                        <option value="">Default Slot</option>
                                        <option value="1">Position 1</option>
                                        <option value="2">Position 2</option>
                                        <option value="3">Position 3</option>
                                        <option value="4">Position 4</option>
                                        <option value="5">Position 5</option>
                                    </select>
                                    {errors.featured_position && <p className="text-xs text-rose-500">{errors.featured_position}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="featured_duration" className="text-xs font-bold text-woof-charcoal">Promotion Duration</Label>
                                    <select 
                                        id="featured_duration" 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-white px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        value={data.featured_duration} 
                                        onChange={e => setData('featured_duration', e.target.value)}
                                    >
                                        <option value="">Select Duration</option>
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

                {/* 7. Media Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Image className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media & Gallery</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload a featured landscape photo and add multi-image uploads to build out the puppy carousel gallery.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Featured Image */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Featured Display Image *</Label>
                                <div className="flex flex-col gap-4">
                                    {featuredPreview ? (
                                        <div className="h-28 w-full border border-[#e8ded1] rounded-2xl bg-[#fcfbf9] flex items-center justify-center relative overflow-hidden group shadow-2xs">
                                            <img src={featuredPreview} alt="Featured Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-white font-bold uppercase">Change</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFeaturedChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-28 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-6 w-6 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Featured Landscape Photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFeaturedChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.featured_image && <p className="text-xs text-rose-500">{errors.featured_image}</p>}
                            </div>

                            {/* Gallery Images */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Puppy Gallery Images</Label>
                                <div className="flex flex-col gap-4">
                                    {/* Existing images */}
                                    {existingImages.length > 0 && (
                                        <div className="border border-[#e8ded1] p-3 rounded-2xl bg-[#fcfbf9] space-y-2">
                                            <p className="text-[10px] font-bold text-woof-charcoal/60">Current Gallery Photos</p>
                                            <div className="flex flex-wrap gap-2">
                                                {existingImages.map((img: any) => (
                                                    <div key={img.id} className="relative group h-14 w-14 rounded-xl overflow-hidden border border-[#e8ded1]">
                                                        <img src={img.image_url || img.url || img} alt="Gallery" className="h-full w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteExistingImage(img.id)}
                                                            className="absolute inset-0 bg-rose-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New uploads preview */}
                                    {data.images && data.images.length > 0 ? (
                                        <div className="border border-[#e8ded1] p-3 rounded-2xl bg-[#fcfbf9] space-y-2 shadow-2xs">
                                            <p className="text-[10px] font-bold text-woof-charcoal/60">New Uploads ({data.images.length})</p>
                                            <div className="flex flex-wrap gap-2">
                                                {data.images.map((file: File, idx: number) => (
                                                    <img key={idx} src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="h-14 w-14 object-cover rounded-xl border border-[#e8ded1]" />
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('images', [])}
                                                    className="text-[10px] text-rose-600 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                                                >
                                                    Clear New Uploads
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="h-24 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-3 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                        <UploadCloud className="h-5 w-5 text-woof-charcoal/40 mb-1" />
                                        <span className="text-xs font-bold text-woof-charcoal">Upload More Photos</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={e => setData('images', Array.from(e.target.files || []))}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                {errors.images && <p className="text-xs text-rose-500">{errors.images}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex justify-end pt-6 border-t border-[#e8ded1] gap-3">
                    <Link 
                        href={route('admin.litters.index')} 
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-7 text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Update Litter'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
