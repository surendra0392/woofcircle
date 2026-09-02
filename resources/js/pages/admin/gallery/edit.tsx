import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Globe, Image as ImageIcon, Sparkles, X, Plus, Trash2, UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react';

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

interface ExistingImage {
    id: number;
    url: string;
    caption: string | null;
}

interface GalleryData {
    id: number;
    title: string | null;
    description: string | null;
    image: string | null;
    main_image_url: string | null;
    category_id: number | null;
    state_id: number | null;
    city_id: number | null;
    is_featured: boolean;
    is_active: boolean;
    images: ExistingImage[];
}

interface PageProps {
    gallery: GalleryData;
    categories: Category[];
    states: State[];
    cities: City[];
}

interface GalleryImageUpload {
    file: File;
    preview: string;
    caption: string;
}

export default function GalleryEditPage({ gallery, categories = [], states = [], cities = [] }: PageProps) {
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(gallery.main_image_url);
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(gallery.images || []);
    const [albumUploads, setAlbumUploads] = useState<GalleryImageUpload[]>([]);

    const { data, setData, post, errors, processing } = useForm({
        title: gallery.title || '',
        description: gallery.description || '',
        image: null as File | null, // Cover image if changing
        category_id: gallery.category_id ? gallery.category_id.toString() : '',
        state_id: gallery.state_id ? gallery.state_id.toString() : '',
        city_id: gallery.city_id ? gallery.city_id.toString() : '',
        is_featured: !!gallery.is_featured,
        is_active: !!gallery.is_active,
        new_gallery_images: [] as { file: File; caption: string }[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Sync local uploads to form data
        const formImages = albumUploads.map(upload => ({
            file: upload.file,
            caption: upload.caption
        }));

        setData('new_gallery_images', formImages);

        post(route('admin.gallery.update', gallery.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Gallery entry updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update gallery entry. Please check form validation errors.');
            }
        });
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAlbumFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newUploads = filesArray.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                caption: ''
            }));
            const updatedUploads = [...albumUploads, ...newUploads];
            setAlbumUploads(updatedUploads);
            
            // Sync to Inertia form object
            setData('new_gallery_images', updatedUploads.map(up => ({ file: up.file, caption: up.caption })));
        }
    };

    const handleCaptionChange = (index: number, val: string) => {
        const updated = [...albumUploads];
        updated[index].caption = val;
        setAlbumUploads(updated);

        // Sync to Inertia form object
        setData('new_gallery_images', updated.map(up => ({ file: up.file, caption: up.caption })));
    };

    const removeAlbumUpload = (index: number) => {
        const updated = [...albumUploads];
        URL.revokeObjectURL(updated[index].preview);
        updated.splice(index, 1);
        setAlbumUploads(updated);

        // Sync to Inertia form object
        setData('new_gallery_images', updated.map(up => ({ file: up.file, caption: up.caption })));
    };

    const deleteExistingImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image from the gallery album?')) {
            router.delete(route('admin.gallery.images.destroy', imageId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Image deleted from gallery album.');
                    setExistingImages(prev => prev.filter(img => img.id !== imageId));
                },
                onError: () => {
                    toast.error('Failed to delete image.');
                }
            });
        }
    };

    const filteredFormCities = !data.state_id 
        ? [] 
        : cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Edit Album">
            <Head title={`Edit Gallery Album: ${gallery.title || 'Untitled'} - Admin`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.gallery.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Gallery Album</h2>
                    <p className="text-xs text-woof-charcoal/60">Currently editing: <span className="font-bold text-woof-charcoal">{gallery.title || 'Untitled Album'}</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6" encType="multipart/form-data">
                {/* 1. Basic details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Basic Information</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide the entry title, set a category group, and write a summary description.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Album Entry Title</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. Dog Carnival Mumbai 2026 Highlight Photos" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="category_id" className="text-xs font-bold text-woof-charcoal">Category Group</Label>
                                <select 
                                    id="category_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.category_id} 
                                    onChange={e => setData('category_id', e.target.value)}
                                >
                                    <option value="">Select Category...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id.toString()}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-xs text-rose-500">{errors.category_id}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                <Textarea 
                                    id="description" 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)} 
                                    placeholder="Provide a general description for the visual album..."
                                    className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 min-h-24" 
                                />
                                {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Geographics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Location Scope</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Assign the location tags of state and city to make this album searchable by geographic area.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">State</Label>
                                <select 
                                    id="state_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.state_id} 
                                    onChange={e => {
                                        setData('state_id', e.target.value);
                                        setData('city_id', '');
                                    }}
                                >
                                    <option value="">Select State...</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id.toString()}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal">City</Label>
                                <select 
                                    id="city_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50" 
                                    value={data.city_id} 
                                    onChange={e => setData('city_id', e.target.value)}
                                    disabled={!data.state_id}
                                >
                                    <option value="">Select City...</option>
                                    {filteredFormCities.map((city) => (
                                        <option key={city.id} value={city.id.toString()}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Highlight & Status promotion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Status & Promotion</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Set album display state on the website. Highlighted albums can be featured on dashboard lists.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-center gap-2.5 p-3.5 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox 
                                    id="is_active" 
                                    checked={data.is_active} 
                                    onCheckedChange={checked => setData('is_active', !!checked)} 
                                />
                                <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active Entry (Visible in gallery)</Label>
                            </div>

                            <div 
                                onClick={() => setData('is_featured', !data.is_featured)}
                                className={`flex items-center gap-2.5 p-3.5 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_featured ? 'border-amber-400 bg-amber-50' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox 
                                    id="is_featured" 
                                    checked={data.is_featured} 
                                    onCheckedChange={checked => setData('is_featured', !!checked)} 
                                />
                                <Label htmlFor="is_featured" className="text-xs font-bold text-woof-charcoal cursor-pointer">Featured Album Spotlight</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Media Section: Main featured & Multi images with dynamic captions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Cover & Album Images</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload a primary cover image and multiple album images with descriptive captions.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        {/* Cover Image details */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">Cover Featured Image</Label>
                            
                            {mainImagePreview && (
                                <div className="relative w-full max-w-xl aspect-video rounded-2xl overflow-hidden border border-[#e8ded1] shadow-inner bg-[#fcfbf9] mb-3 group">
                                    <img src={mainImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setMainImagePreview(null);
                                                setData('image', null);
                                            }}
                                            className="rounded-full flex items-center gap-2 cursor-pointer text-xs font-bold"
                                        >
                                            <X className="h-4 w-4" /> Remove Cover Photo
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Input 
                                id="image" 
                                type="file"
                                onChange={handleMainImageChange} 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20" 
                            />
                            {errors.image && <p className="text-xs text-rose-500">{errors.image}</p>}
                        </div>

                        {/* Existing Gallery Album Images section */}
                        {existingImages.length > 0 && (
                            <div className="space-y-3 border-t border-[#e8ded1] pt-4">
                                <Label className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Current Album Photos</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {existingImages.map((img) => (
                                        <div key={img.id} className="flex flex-col border border-[#e8ded1] bg-[#fcfbf9] p-3 rounded-2xl gap-2 group relative shadow-2xs">
                                            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#e8ded1] bg-white">
                                                <img src={img.url} alt="Existing album content" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExistingImage(img.id)}
                                                    className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                                                    title="Delete Photo"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            {img.caption && (
                                                <p className="text-xs font-medium text-woof-charcoal bg-white p-2 rounded-xl border border-[#e8ded1]">
                                                    <span className="font-bold text-[10px] text-woof-charcoal/50 block uppercase">Caption</span>
                                                    {img.caption}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Gallery Images section */}
                        <div className="space-y-3 border-t border-[#e8ded1] pt-6">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Add More Album Photos</Label>
                                <Input 
                                    id="new_album_files" 
                                    type="file"
                                    multiple
                                    onChange={handleAlbumFilesChange}
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-woof-gold/10 file:text-woof-charcoal hover:file:bg-woof-gold/20" 
                                />
                                {errors.new_gallery_images && <p className="text-xs text-rose-500">{errors.new_gallery_images}</p>}
                            </div>

                            {albumUploads.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <h4 className="text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">New Photos & Captions to Upload ({albumUploads.length})</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {albumUploads.map((up, idx) => (
                                            <div key={idx} className="flex flex-col border border-[#e8ded1] bg-[#fcfbf9] p-3 rounded-2xl gap-2.5 group relative shadow-2xs">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#e8ded1] bg-white">
                                                    <img src={up.preview} alt="Upload thumbnail" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAlbumUpload(idx)}
                                                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                                                        title="Remove Photo"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`caption-${idx}`} className="text-[10px] font-bold text-woof-charcoal/60 uppercase">Photo Caption</Label>
                                                    <Input
                                                        id={`caption-${idx}`}
                                                        value={up.caption}
                                                        onChange={e => handleCaptionChange(idx, e.target.value)}
                                                        placeholder="Enter descriptive photo caption..."
                                                        className="h-8 rounded-xl border-[#e8ded1] bg-white text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.gallery.index')}
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
