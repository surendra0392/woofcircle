import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    Camera,
    CheckCircle2,
    Clock,
    FileText,
    Image as ImageIcon,
    Images,
    IndianRupee,
    Info,
    Loader2,
    MapPin,
    Plus,
    Save,
    Tag,
    Trophy,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

interface LitterImage {
    id: number;
    image_url: string;
    image_type: string;
    sort_order: number;
}

interface Litter {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: string | null;
    price_min: string | null;
    price_max: string | null;
    age: string | null;
    kci_registered: boolean;
    sire_name: string | null;
    dam_name: string | null;
    status: string;
    is_negotiable: boolean;
    is_vaccinated: boolean;
    is_champion: boolean;
    awards_count: number;
    featured_image_url: string | null;
    breed_id: number;
    state_id: number;
    city_id: number;
    images: LitterImage[];
}

interface PageProps {
    litter: Litter | null;
    breeds: { id: number; name: string }[];
    states: { id: number; name: string }[];
    cities: { id: number; name: string; state_id: number }[];
}

interface LitterFormData {
    [key: string]: any;
    title: string;
    slug: string;
    description: string;
    breed_id: string;
    price: string;
    price_min: string;
    price_max: string;
    age: string;
    kci_registered: boolean;
    sire_name: string;
    dam_name: string;
    status: string;
    is_negotiable: boolean;
    is_vaccinated: boolean;
    is_champion: boolean;
    awards_count: string;
    state_id: string;
    city_id: string;
    featured_image: File | null;
    kci_images: File[];
    images: File[];
}

export default function BreederLitterForm({ litter, breeds, states, cities }: PageProps) {
    const [featuredPreview, setFeaturedPreview] = useState<string | null>(litter?.featured_image_url || null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [kciPreviews, setKciPreviews] = useState<string[]>([]);
    const featuredInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const kciInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<LitterFormData>({
        title: litter?.title || '',
        slug: litter?.slug || '',
        description: litter?.description || '',
        breed_id: litter?.breed_id?.toString() || '',
        price: litter?.price || '',
        price_min: litter?.price_min || '',
        price_max: litter?.price_max || '',
        age: litter?.age || '',
        kci_registered: litter?.kci_registered || false,
        sire_name: litter?.sire_name || '',
        dam_name: litter?.dam_name || '',
        status: litter?.status || 'published',
        is_negotiable: litter?.is_negotiable || false,
        is_vaccinated: litter?.is_vaccinated || false,
        is_champion: (litter as any)?.is_champion || false,
        awards_count: (litter as any)?.awards_count?.toString() || '',
        state_id: litter?.state_id?.toString() || '',
        city_id: litter?.city_id?.toString() || '',
        featured_image: null,
        kci_images: [],
        images: [],
    });

    const [filteredCities, setFilteredCities] = useState(cities);

    useEffect(() => {
        if (!litter && data.title) {
            const slug = data.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData('slug', slug);
        }
    }, [data.title]);

    useEffect(() => {
        if (data.state_id) {
            setFilteredCities(cities.filter((c) => c.state_id === parseInt(data.state_id)));
        } else {
            setFilteredCities([]);
        }
    }, [data.state_id, cities]);

    const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            setFeaturedPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('images', [...data.images, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    };

    const handleKciImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('kci_images', [...data.kci_images, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setKciPreviews([...kciPreviews, ...newPreviews]);
    };

    const removeNewImage = (type: 'gallery' | 'kci', index: number) => {
        if (type === 'gallery') {
            const newImages = [...data.images];
            newImages.splice(index, 1);
            setData('images', newImages);
            const newPreviews = [...galleryPreviews];
            newPreviews.splice(index, 1);
            setGalleryPreviews(newPreviews);
        } else {
            const newImages = [...data.kci_images];
            newImages.splice(index, 1);
            setData('kci_images', newImages);
            const newPreviews = [...kciPreviews];
            newPreviews.splice(index, 1);
            setKciPreviews(newPreviews);
        }
    };

    const deleteExistingImage = (imageId: number) => {
        if (confirm('Remove this image from listing?')) {
            router.delete(route('breeder.litters.image.destroy', imageId), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = litter ? route('breeder.litters.update', litter.id) : route('breeder.litters.store');
        post(url, { forceFormData: true, preserveScroll: true });
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Breeder Console', href: '/dashboard/breeder' },
                { title: 'My Litters', href: route('breeder.litters.index') },
                { title: litter ? 'Edit Listing' : 'New Listing', href: '#' },
            ]}
            title={litter ? 'Edit Litter Listing' : 'Post New Litter'}
            subtitle={litter ? 'Update puppy pedigree, health screening, and photos' : 'List your puppies on the marketplace'}
            actions={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('breeder.litters.index')}
                        className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-xs font-bold text-woof-charcoal h-11 px-6 flex items-center transition-all shadow-2xs"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        form="litter-form"
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
                                {litter ? 'Update Listing' : 'Publish Listing'}
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <Head title={litter ? 'Edit Litter' : 'Post New Litter'} />

            <div className="pb-16 max-w-5xl mx-auto">
                <form id="litter-form" onSubmit={handleSubmit} className="space-y-8">
                    {/* Section: Litter Information */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Litter Information</h3>
                                <p className="text-xs text-woof-charcoal/60">Key profile details, breed, and description</p>
                            </div>
                        </div>

                        {!litter && (
                            <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <Info className="h-5 w-5 shrink-0 text-amber-700" />
                                <div>
                                    <p className="text-xs font-bold text-amber-900">Marketplace Verification</p>
                                    <p className="text-[11px] text-amber-800/80">
                                        All new litter listings are reviewed by our breed standards team before going live.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Listing Headline</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Stunning Golden Retriever Puppies"
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                    required
                                />
                                {errors.title && <p className="text-xs font-bold text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">URL Slug</Label>
                                <Input
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="auto-generated-slug"
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                                {errors.slug && <p className="text-xs font-bold text-rose-600 mt-1">{errors.slug}</p>}
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Dog Breed</Label>
                                <Select value={data.breed_id} onValueChange={(v) => setData('breed_id', v)}>
                                    <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold">
                                        <SelectValue placeholder="Select Breed" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                        {breeds.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()} className="text-xs">
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.breed_id && <p className="text-xs font-bold text-rose-600 mt-1">{errors.breed_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Age / Ready By</Label>
                                <Input
                                    value={data.age}
                                    onChange={(e) => setData('age', e.target.value)}
                                    placeholder="e.g. 2 Months"
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                                {errors.age && <p className="text-xs font-bold text-rose-600 mt-1">{errors.age}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Description</Label>
                            <div className="overflow-hidden rounded-2xl border border-[#e8ded1]">
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(val: string) => setData('description', val)}
                                    placeholder="Introduce potential owners to the litter, parentage, health tests, and personality..."
                                />
                            </div>
                            {errors.description && <p className="text-xs font-bold text-rose-600 mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 pt-2">
                            <label className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 cursor-pointer hover:border-woof-gold transition-all">
                                <div>
                                    <p className="text-xs font-bold text-woof-charcoal">Vaccinated</p>
                                    <p className="text-[11px] text-woof-charcoal/50">Litter has received age-appropriate shots</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.is_vaccinated}
                                    onChange={(e) => setData('is_vaccinated', e.target.checked)}
                                    className="h-5 w-5 rounded-lg border-[#e8ded1] accent-[#bb8b62] cursor-pointer"
                                />
                            </label>

                            <label className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 cursor-pointer hover:border-woof-gold transition-all">
                                <div>
                                    <p className="text-xs font-bold text-woof-charcoal">Price Negotiable</p>
                                    <p className="text-[11px] text-woof-charcoal/50">Open to offers from prospective families</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.is_negotiable}
                                    onChange={(e) => setData('is_negotiable', e.target.checked)}
                                    className="h-5 w-5 rounded-lg border-[#e8ded1] accent-[#bb8b62] cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Section: Pricing */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Tag className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Pricing Range</h3>
                                <p className="text-xs text-woof-charcoal/60">Set minimum and maximum price expectations</p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-1">
                                    <IndianRupee className="h-3.5 w-3.5 text-woof-gold" /> Minimum Price
                                </Label>
                                <Input
                                    type="number"
                                    value={data.price_min}
                                    onChange={(e) => setData('price_min', e.target.value)}
                                    placeholder="25000"
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                                {errors.price_min && <p className="text-xs font-bold text-rose-600 mt-1">{errors.price_min}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-1">
                                    <IndianRupee className="h-3.5 w-3.5 text-woof-gold" /> Maximum Price
                                </Label>
                                <Input
                                    type="number"
                                    value={data.price_max}
                                    onChange={(e) => setData('price_max', e.target.value)}
                                    placeholder="45000"
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                                {errors.price_max && <p className="text-xs font-bold text-rose-600 mt-1">{errors.price_max}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Champion Bloodline */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Champion Bloodline</h3>
                                <p className="text-xs text-woof-charcoal/60">Show quality credentials and awards lineage</p>
                            </div>
                        </div>

                        <label className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 cursor-pointer hover:border-woof-gold transition-all">
                            <div>
                                <p className="text-xs font-bold text-woof-charcoal">Champion Pedigree</p>
                                <p className="text-[11px] text-woof-charcoal/50">Sire or Dam has won national/international show championships</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.is_champion}
                                onChange={(e) => setData('is_champion', e.target.checked)}
                                className="h-5 w-5 rounded-lg border-[#e8ded1] accent-[#bb8b62] cursor-pointer"
                            />
                        </label>

                        {data.is_champion && (
                            <div className="grid gap-2 pt-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-1">
                                    <Trophy className="h-3.5 w-3.5 text-woof-gold" /> Champion Titles Count
                                </Label>
                                <Input
                                    type="number"
                                    value={data.awards_count}
                                    onChange={(e) => setData('awards_count', e.target.value)}
                                    placeholder="3"
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                                {errors.awards_count && <p className="text-xs font-bold text-rose-600 mt-1">{errors.awards_count}</p>}
                            </div>
                        )}
                    </div>

                    {/* Section: Registration & Pedigree */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <BadgeCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Registration Details</h3>
                                <p className="text-xs text-woof-charcoal/60">Kennel Club registration, Sire/Dam records, and paperwork</p>
                            </div>
                        </div>

                        <label className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 cursor-pointer hover:border-woof-gold transition-all">
                            <div>
                                <p className="text-xs font-bold text-woof-charcoal">KCI Registered</p>
                                <p className="text-[11px] text-woof-charcoal/50">Puppies have microchips and verified KCI certificate papers</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.kci_registered}
                                onChange={(e) => setData('kci_registered', e.target.checked)}
                                className="h-5 w-5 rounded-lg border-[#e8ded1] accent-[#bb8b62] cursor-pointer"
                            />
                        </label>

                        {data.kci_registered && (
                            <div className="space-y-6 pt-2">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Sire Name (Father)</Label>
                                        <Input
                                            value={data.sire_name}
                                            onChange={(e) => setData('sire_name', e.target.value)}
                                            placeholder="e.g. Ch. Bruno of WoofLand"
                                            className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        />
                                        {errors.sire_name && <p className="text-xs font-bold text-rose-600 mt-1">{errors.sire_name}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Dam Name (Mother)</Label>
                                        <Input
                                            value={data.dam_name}
                                            onChange={(e) => setData('dam_name', e.target.value)}
                                            placeholder="e.g. Stella of KennelHome"
                                            className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                        />
                                        {errors.dam_name && <p className="text-xs font-bold text-rose-600 mt-1">{errors.dam_name}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">KCI Pedigree Certificates</Label>
                                        <Button
                                            type="button"
                                            onClick={() => kciInputRef.current?.click()}
                                            className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-xs font-bold text-woof-charcoal h-9 px-4 shadow-2xs gap-1 cursor-pointer"
                                        >
                                            <Plus className="h-3.5 w-3.5 text-woof-gold" /> Add Certificate
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                                        {litter?.images.filter((img) => img.image_type === 'kci').map((img) => (
                                            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e8ded1] bg-white shadow-2xs">
                                                <img src={img.image_url} alt="KCI Certificate" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExistingImage(img.id)}
                                                    className="absolute top-2 right-2 rounded-full bg-rose-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}

                                        {kciPreviews.map((preview, idx) => (
                                            <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl border border-woof-gold bg-white shadow-2xs">
                                                <img src={preview} alt="New Document" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage('kci', idx)}
                                                    className="absolute top-2 right-2 rounded-full bg-rose-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="bg-woof-gold text-woof-charcoal absolute top-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full">
                                                    New Doc
                                                </span>
                                            </div>
                                        ))}

                                        <div
                                            onClick={() => kciInputRef.current?.click()}
                                            className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] cursor-pointer hover:border-woof-gold transition-all"
                                        >
                                            <Plus className="h-5 w-5 text-woof-gold/60 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold text-woof-charcoal/50 uppercase">Upload</span>
                                        </div>
                                    </div>
                                    <input ref={kciInputRef} type="file" multiple className="hidden" accept="image/*" onChange={handleKciImagesChange} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section: Location */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Location</h3>
                                <p className="text-xs text-woof-charcoal/60">Where the litter is currently based</p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">State</Label>
                                <Select value={data.state_id} onValueChange={(v) => setData((d) => ({ ...d, state_id: v, city_id: '' }))}>
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
                                {errors.state_id && <p className="text-xs font-bold text-rose-600 mt-1">{errors.state_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">City</Label>
                                <Select value={data.city_id} onValueChange={(v) => setData('city_id', v)} disabled={!data.state_id}>
                                    <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold disabled:opacity-50">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                        {filteredCities.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()} className="text-xs">
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.city_id && <p className="text-xs font-bold text-rose-600 mt-1">{errors.city_id}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Media & Photos */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Camera className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Photos & Showcase</h3>
                                <p className="text-xs text-woof-charcoal/60">Featured photo and multi-image puppy gallery</p>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Featured Image</Label>
                            <div
                                className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] p-8 text-center cursor-pointer hover:border-woof-gold transition-all overflow-hidden group min-h-[220px]"
                                onClick={() => featuredInputRef.current?.click()}
                            >
                                {featuredPreview ? (
                                    <div className="absolute inset-0 h-full w-full">
                                        <img src={featuredPreview} alt="Featured" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-woof-charcoal/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                type="button"
                                                className="rounded-full bg-white text-woof-charcoal hover:bg-woof-gold hover:text-white text-xs font-bold shadow-md px-5 h-9"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFeaturedPreview(null);
                                                }}
                                            >
                                                Change Photo
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#e8ded1] flex items-center justify-center text-woof-gold mb-2 shadow-2xs">
                                            <ImageIcon className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-bold text-woof-charcoal">Upload Featured Photo</p>
                                        <p className="text-[10px] text-woof-charcoal/50 mt-1">Recommended: 1200 × 800px. JPG, PNG or WEBP (Max 2MB)</p>
                                    </>
                                )}
                                <input ref={featuredInputRef} type="file" className="hidden" onChange={handleFeaturedImageChange} accept="image/*" />
                            </div>
                            {errors.featured_image && <p className="text-xs font-bold text-rose-600 mt-1">{errors.featured_image}</p>}
                        </div>

                        {/* Gallery */}
                        <div className="space-y-3 pt-4 border-t border-[#e8ded1]">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Puppy Gallery</Label>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                                {litter?.images.filter((img) => img.image_type === 'gallery').map((img) => (
                                    <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e8ded1] bg-white shadow-2xs">
                                        <img src={img.image_url} alt="Gallery" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingImage(img.id)}
                                            className="absolute top-2 right-2 rounded-full bg-rose-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}

                                {galleryPreviews.map((preview, idx) => (
                                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl border border-woof-gold bg-white shadow-2xs">
                                        <img src={preview} alt="New Preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage('gallery', idx)}
                                            className="absolute top-2 right-2 rounded-full bg-rose-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="bg-woof-gold text-woof-charcoal absolute top-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full">
                                            New
                                        </span>
                                    </div>
                                ))}

                                <div
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] cursor-pointer hover:border-woof-gold transition-all"
                                >
                                    <Plus className="h-5 w-5 text-woof-gold/60 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-woof-charcoal/50 uppercase">Add Photo</span>
                                </div>
                            </div>
                            <input ref={galleryInputRef} type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
                            {errors.images && <p className="text-xs font-bold text-rose-600 mt-1">{errors.images}</p>}
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
