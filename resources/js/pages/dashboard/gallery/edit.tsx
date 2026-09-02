import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Camera, Image as ImageIcon, MapPin, Plus, Trash2, X, FileText, Info, Tag, Save, Upload, CheckCircle2 } from 'lucide-react';
import * as React from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface Category {
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

interface GalleryImage {
    id: number;
    url: string;
    caption: string | null;
}

interface Gallery {
    id: number;
    title: string | null;
    description: string | null;
    image: string | null;
    main_image_url: string;
    category_id: number | null;
    state_id: number | null;
    city_id: number | null;
    images: GalleryImage[];
}

interface PageProps {
    gallery: Gallery;
    categories: Category[];
    states: State[];
    cities: City[];
}

interface GalleryFormInput {
    title: string;
    description: string;
    image: File | null;
    category_id: string;
    state_id: string;
    city_id: string;
    new_gallery_images: { file: File; caption: string; previewUrl: string }[];
    [key: string]: any;
}

export default function EditGallery({ gallery, categories, states, cities }: PageProps) {
    const [coverPreview, setCoverPreview] = useState<string | null>(gallery.main_image_url);
    const [formCities, setFormCities] = useState<City[]>(
        gallery.state_id ? cities.filter(c => c.state_id === gallery.state_id) : cities
    );
    const [existingImages, setExistingImages] = useState<GalleryImage[]>(gallery.images);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const albumInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, transform, processing, errors } = useForm<GalleryFormInput>({
        title: gallery.title || '',
        description: gallery.description || '',
        image: null,
        category_id: gallery.category_id?.toString() || '',
        state_id: gallery.state_id?.toString() || '',
        city_id: gallery.city_id?.toString() || '',
        new_gallery_images: [],
    });

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const arr = Array.from(files).map(file => ({
                file,
                caption: '',
                previewUrl: URL.createObjectURL(file),
            }));
            setData('new_gallery_images', [...data.new_gallery_images, ...arr]);
        }
    };

    const updateNewCaption = (index: number, caption: string) => {
        const temp = [...data.new_gallery_images];
        temp[index].caption = caption;
        setData('new_gallery_images', temp);
    };

    const removeNewImage = (index: number) => {
        const temp = [...data.new_gallery_images];
        URL.revokeObjectURL(temp[index].previewUrl);
        temp.splice(index, 1);
        setData('new_gallery_images', temp);
    };

    const handleStateChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            state_id: val,
            city_id: '',
        }));

        if (val) {
            setFormCities(cities.filter(c => c.state_id.toString() === val));
        } else {
            setFormCities(cities);
        }
    };

    const handleDeleteExistingImage = (imageId: number) => {
        if (confirm('Are you sure you want to remove this photo?')) {
            router.delete(route('dashboard.gallery.image.destroy', imageId), {
                preserveScroll: true,
                onSuccess: () => {
                    setExistingImages(prev => prev.filter(img => img.id !== imageId));
                    toast.success('Photo removed from album.');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((payload) => {
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('description', payload.description);
            formData.append('category_id', payload.category_id);
            formData.append('state_id', payload.state_id);
            formData.append('city_id', payload.city_id);

            if (payload.image) {
                formData.append('image', payload.image);
            }

            payload.new_gallery_images.forEach((imgObj, idx) => {
                formData.append(`new_gallery_images[${idx}][image]`, imgObj.file);
                formData.append(`new_gallery_images[${idx}][caption]`, imgObj.caption);
            });

            return formData as any;
        });

        post(route('dashboard.gallery.update', gallery.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Gallery updated successfully.');
            },
        });
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Galleries', href: '/dashboard/gallery' },
                { title: 'Edit Gallery', href: '#' },
            ]}
            title={`Edit: ${gallery.title || 'Untitled Gallery'}`}
            subtitle="Update photos, captions, and showcase details"
            actions={
                <div className="flex items-center gap-3">
                    <Link href={route('dashboard.gallery.index')}>
                        <Button
                            variant="custom"
                            className="border border-[#e8ded1] hover:bg-[#fcfbf9] h-10 rounded-full px-5 text-xs font-bold transition-all text-woof-charcoal shadow-2xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        form="edit-gallery-form"
                        variant="custom"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-10 rounded-full px-6 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Saving...
                            </div>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <Head title={`Edit ${gallery.title || 'Gallery'}`} />

            <div className="pb-16 max-w-4xl mx-auto space-y-6">
                <form id="edit-gallery-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Gallery Details</h3>
                                <p className="text-xs text-woof-charcoal/60">Album title, category and description</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Gallery Title <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Golden Retriever Beach Outing"
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    required
                                />
                                {errors.title && <p className="text-xs font-bold text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Category <span className="text-rose-600">*</span>
                                </Label>
                                <Select value={data.category_id} onValueChange={(val) => setData('category_id', val)}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-xs font-bold text-rose-500">{errors.category_id}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Description & Story</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Share the background, event, or memorable experience..."
                                className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[90px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                            />
                            {errors.description && <p className="text-xs font-bold text-rose-500">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Location Tagging</h3>
                                <p className="text-xs text-woof-charcoal/60">Optional state and city location for local discovery</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">State</Label>
                                <Select value={data.state_id} onValueChange={handleStateChange}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select State (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {states.map((st) => (
                                            <SelectItem key={st.id} value={st.id.toString()}>{st.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">City</Label>
                                <Select value={data.city_id} onValueChange={(val) => setData('city_id', val)} disabled={!data.state_id}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal disabled:opacity-50">
                                        <SelectValue placeholder="Select City (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {formCities.map((ct) => (
                                            <SelectItem key={ct.id} value={ct.id.toString()}>{ct.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image Card */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Camera className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Primary Cover Image</h3>
                                <p className="text-xs text-woof-charcoal/60">Featured hero thumbnail for the album</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div
                                onClick={() => coverInputRef.current?.click()}
                                className="border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] hover:bg-[#f4ebe1]/30 hover:border-woof-gold group relative flex h-48 w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl transition-all shadow-2xs"
                            >
                                {coverPreview ? (
                                    <>
                                        <img src={coverPreview} className="h-full w-full object-cover" />
                                        <div className="bg-woof-charcoal/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-2xs">
                                            <Camera className="h-7 w-7 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="text-woof-gold/40 mb-3 h-8 w-8" />
                                        <span className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                            Upload Cover Photo
                                        </span>
                                        <p className="text-[10px] text-woof-charcoal/40 mt-1">
                                            Max size: 2MB (JPG, PNG, WEBP)
                                        </p>
                                    </>
                                )}
                            </div>
                            <input ref={coverInputRef} type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
                            {errors.image && <p className="text-xs font-bold text-rose-500 mt-2">{errors.image}</p>}
                        </div>
                    </div>

                    {/* Existing & New Album Photos Card */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-woof-charcoal">Album Photos</h3>
                                    <p className="text-xs text-woof-charcoal/60">Manage existing photos and attach new ones</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => albumInputRef.current?.click()}
                                className="border-[#e8ded1] bg-[#fcfbf9] hover:bg-woof-charcoal hover:text-white rounded-full text-xs font-bold transition-all"
                            >
                                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add More
                            </Button>
                        </div>

                        <input ref={albumInputRef} type="file" multiple className="hidden" accept="image/*" onChange={handleAlbumChange} />

                        <div className="space-y-6">
                            {/* Existing Photos */}
                            {existingImages.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Existing Album Photos ({existingImages.length})</p>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {existingImages.map((img) => (
                                            <div key={img.id} className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-3 space-y-2 shadow-2xs">
                                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#e8ded1]">
                                                    <img src={img.url} className="h-full w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteExistingImage(img.id)}
                                                        className="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white hover:bg-rose-700 transition-all shadow-xs"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                {img.caption && (
                                                    <p className="text-xs text-woof-charcoal/70 truncate px-1">{img.caption}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Photos */}
                            {data.new_gallery_images.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-[#e8ded1]">
                                    <p className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">New Photos to Upload ({data.new_gallery_images.length})</p>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {data.new_gallery_images.map((imgObj, idx) => (
                                            <div key={idx} className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-3 space-y-2 shadow-2xs">
                                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#e8ded1]">
                                                    <img src={imgObj.previewUrl} className="h-full w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(idx)}
                                                        className="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white hover:bg-rose-700 transition-all shadow-xs"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <Input
                                                    placeholder="Add caption..."
                                                    value={imgObj.caption}
                                                    onChange={(e) => updateNewCaption(idx, e.target.value)}
                                                    className="bg-white border-[#e8ded1] focus-visible:ring-woof-gold h-9 rounded-xl text-xs text-woof-charcoal"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
