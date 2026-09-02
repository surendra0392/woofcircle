import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, FileText, User, Globe, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface AuthorUser {
    id: number;
    name: string;
}

interface GalleryImage {
    id: number;
    url: string;
}

interface ArticleData {
    id: number;
    title: string;
    excerpt: string | null;
    content: string;
    author_name: string | null;
    category_id: number | null;
    user_id: number | null;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
    is_featured: boolean;
    featured_image: string | null;
    gallery: GalleryImage[];
}

interface PageProps {
    article: ArticleData;
    categories: Category[];
    users: AuthorUser[];
}

export default function ArticleEditPage({ article, categories = [], users = [] }: PageProps) {
    const [featuredPreview, setFeaturedPreview] = useState<string | null>(article.featured_image);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(article.gallery || []);

    const { data, setData, post, errors, processing } = useForm({
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        author_name: article.author_name || '',
        category_id: article.category_id ? article.category_id.toString() : '',
        user_id: article.user_id ? article.user_id.toString() : '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        is_published: !!article.is_published,
        is_featured: !!article.is_featured,
        featured_image: null as File | null,
        gallery: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.articles.update', article.id), {
            onSuccess: () => {
                toast.success('Article updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update article. Please check form validation errors.');
            }
        });
    };

    const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            setFeaturedPreview(URL.createObjectURL(file));
        }
    };

    const deleteGalleryImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image from the article gallery?')) {
            router.delete(route('admin.articles.gallery.destroy', imageId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Image deleted from gallery.');
                    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
                },
                onError: () => {
                    toast.error('Failed to delete image.');
                }
            });
        }
    };

    return (
        <AdminLayout title="Edit Article">
            <Head title={`Edit: ${article.title} - Admin`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.articles.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Article</h2>
                    <p className="text-xs text-woof-charcoal/60">Currently editing: <span className="font-bold text-woof-charcoal">{article.title}</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* 1. Basic Content details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <FileText className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Article Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Set the title, category, and main body of the article. Write a brief excerpt for summary pages.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Article Title *</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. 10 Essential Tips for Puppy Training" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20 font-medium" 
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category_id" className="text-xs font-bold text-woof-charcoal">Category</Label>
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

                            <div className="space-y-1.5">
                                <Label htmlFor="excerpt" className="text-xs font-bold text-woof-charcoal">Excerpt / Summary</Label>
                                <Textarea 
                                    id="excerpt" 
                                    value={data.excerpt} 
                                    onChange={e => setData('excerpt', e.target.value)} 
                                    placeholder="A brief one or two sentence summary of the article..."
                                    className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.excerpt && <p className="text-xs text-rose-500">{errors.excerpt}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="content" className="text-xs font-bold text-woof-charcoal">Article Content *</Label>
                                <RichTextEditor value={data.content} onChange={(val: string) => setData('content', val)} />
                                {errors.content && <p className="text-xs text-rose-500">{errors.content}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Authorship details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <User className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Author Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Associate this article with a registered user, or input a custom guest author name string.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Registered Author</Label>
                                <select 
                                    id="user_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.user_id} 
                                    onChange={e => setData('user_id', e.target.value)}
                                >
                                    <option value="">None (Custom Guest / Admin)</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id.toString()}>{u.name}</option>
                                    ))}
                                </select>
                                {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="author_name" className="text-xs font-bold text-woof-charcoal">Guest Author Name</Label>
                                <Input 
                                    id="author_name" 
                                    value={data.author_name} 
                                    onChange={e => setData('author_name', e.target.value)} 
                                    placeholder="e.g. Dr. Jane Smith" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.author_name && <p className="text-xs text-rose-500">{errors.author_name}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SEO Metadata details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">SEO & Metadata</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Optimize search visibility by defining search engine metadata values.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="meta_title" className="text-xs font-bold text-woof-charcoal">SEO Meta Title</Label>
                                <Input 
                                    id="meta_title" 
                                    value={data.meta_title} 
                                    onChange={e => setData('meta_title', e.target.value)} 
                                    placeholder="e.g. Puppy Training 101: 10 Expert Tips" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.meta_title && <p className="text-xs text-rose-500">{errors.meta_title}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="meta_description" className="text-xs font-bold text-woof-charcoal">SEO Meta Description</Label>
                                <Textarea 
                                    id="meta_description" 
                                    value={data.meta_description} 
                                    onChange={e => setData('meta_description', e.target.value)} 
                                    placeholder="Detailed meta description for search snippets..."
                                    className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.meta_description && <p className="text-xs text-rose-500">{errors.meta_description}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Highlight & Promotion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Status & Promotion</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Configure publication state and spotlight recommendations.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 border border-[#e8ded1] bg-[#fcfbf9] p-4 rounded-2xl">
                                <Checkbox 
                                    id="is_published" 
                                    checked={data.is_published} 
                                    onCheckedChange={checked => setData('is_published', !!checked)} 
                                />
                                <Label htmlFor="is_published" className="text-xs font-bold text-woof-charcoal cursor-pointer">Published (Visible to public)</Label>
                            </div>

                            <div className="flex items-center space-x-3 border border-amber-200 bg-amber-50/50 p-4 rounded-2xl">
                                <Checkbox 
                                    id="is_featured" 
                                    checked={data.is_featured} 
                                    onCheckedChange={checked => setData('is_featured', !!checked)} 
                                />
                                <Label htmlFor="is_featured" className="text-xs font-bold text-amber-800 cursor-pointer">Featured Article Spotlight</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Media uploads */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Featured & Gallery Images</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload a primary cover image and optional album photos.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-6">
                        {/* Cover Image details */}
                        <div className="space-y-3">
                            <Label htmlFor="featured_image" className="text-xs font-bold text-woof-charcoal">Featured Cover Image</Label>
                            
                            {featuredPreview && (
                                <div className="relative w-full max-w-xl aspect-video rounded-2xl overflow-hidden border border-[#e8ded1] bg-[#fcfbf9] mb-3 group shadow-2xs">
                                    <img src={featuredPreview} alt="Featured Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setFeaturedPreview(null);
                                                setData('featured_image', null);
                                            }}
                                            className="rounded-full flex items-center gap-2 cursor-pointer shadow-xs text-xs font-bold"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Remove Cover Photo
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Input 
                                id="featured_image" 
                                type="file"
                                onChange={handleFeaturedChange} 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#f0e8dc] file:text-woof-charcoal hover:file:bg-[#e8ded1]" 
                            />
                            {errors.featured_image && <p className="text-xs text-rose-500">{errors.featured_image}</p>}
                        </div>

                        {/* Existing Gallery Images section */}
                        {galleryImages.length > 0 && (
                            <div className="space-y-3 border-t border-[#f0e8dc] pt-6">
                                <Label className="text-xs font-bold text-woof-charcoal">Current Gallery Images</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {galleryImages.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-[#e8ded1] bg-[#fcfbf9] group shadow-2xs">
                                            <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteGalleryImage(img.id)}
                                                    className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors cursor-pointer"
                                                    title="Delete Image"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Gallery Images section */}
                        <div className="space-y-3 border-t border-[#f0e8dc] pt-6">
                            <Label htmlFor="gallery" className="text-xs font-bold text-woof-charcoal">Upload More Gallery Photos</Label>
                            <Input 
                                id="gallery" 
                                type="file"
                                multiple
                                onChange={e => {
                                    if (e.target.files) {
                                        setData('gallery', Array.from(e.target.files));
                                    }
                                }} 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#f0e8dc] file:text-woof-charcoal hover:file:bg-[#e8ded1]" 
                            />
                            {errors.gallery && <p className="text-xs text-rose-500">{errors.gallery}</p>}

                            {data.gallery.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-bold text-woof-charcoal/60 uppercase tracking-wider">New photos to upload ({data.gallery.length}):</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {data.gallery.map((file, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#e8ded1] bg-[#fcfbf9] group shadow-2xs">
                                                <img src={URL.createObjectURL(file)} alt="Preview new upload" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newGallery = [...data.gallery];
                                                        newGallery.splice(idx, 1);
                                                        setData('gallery', newGallery);
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-full shadow transition-colors cursor-pointer"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
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
                    <Link href={route('admin.articles.index')}>
                        <Button type="button" variant="outline" className="h-10 px-5 text-xs font-bold rounded-full border-[#e8ded1] text-woof-charcoal hover:bg-[#fcfbf9] transition-colors cursor-pointer">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="h-10 px-6 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                        <Save className="h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
