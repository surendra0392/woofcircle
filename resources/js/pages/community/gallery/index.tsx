import { Breadcrumbs } from '@/components/breadcrumbs';
import CuratedListingSidebar, { FeaturedAdoption, FeaturedBreeder, FeaturedLitter, FeaturedStud } from '@/components/public/curated-listing-sidebar';
import ResultsToolbar from '@/components/public/results-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Camera,
    ChevronDown,
    Heart,
    Image as ImageIcon,
    RotateCcw,
    Search,
    Share2,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface GalleryImage {
    id: number;
    image_url: string;
    caption: string | null;
    author_name: string | null;
    created_at: string;
    category: { name: string };
    likes_count?: number;
    shares_count?: number;
    gallery?: {
        id: number;
        title: string;
        slug: string;
    } | null;
}

interface Album {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    category: { name: string };
    likes_count?: number;
    shares_count?: number;
    exports_count?: number;
}

interface PageProps {
    images: { data: GalleryImage[]; total: number; links: { url: string | null; label: string; active: boolean }[] };
    galleries: Album[];
    categories: { id: number; name: string }[];
    featuredBreeders?: FeaturedBreeder[];
    featuredLitters?: FeaturedLitter[];
    featuredStuds?: FeaturedStud[];
    featuredAdoptions?: FeaturedAdoption[];
    filters: { category_id?: string; search?: string; orderby?: string; view?: 'grid' | 'list' };
}

function AlbumCard({ gal }: { gal: Album }) {
    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgError(false);
        setIsLoaded(false);
    }, [gal.id, gal.image_url]);

    const hasValidImage = Boolean(gal.image_url && gal.image_url.trim() !== '' && !imgError);

    return (
        <Link
            href={route('community.gallery.show', { slug: gal.slug })}
            className="group border border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-xl relative overflow-hidden rounded-3xl bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 flex flex-col h-full p-2.5"
        >
            {/* Cover Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-woof-cream/60">
                {/* Fallback container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white border border-[#e8ded1] shadow-2xs mb-1.5 flex h-10 w-10 items-center justify-center rounded-2xl">
                        <img src="/images/favicon.png" alt="WoofCircle" className="h-5 w-5 object-contain" />
                    </div>
                    <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Image Available</span>
                </div>

                {hasValidImage && (
                    <img
                        src={gal.image_url!}
                        alt={gal.title}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}

                <div className="absolute top-3 left-3 z-20">
                    <Badge className="text-woof-charcoal rounded-full border-none bg-white/95 px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-xs backdrop-blur-md">
                        {gal.category?.name || 'Collection'}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-3.5 space-y-3">
                <div className="flex-1 space-y-1">
                    <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">
                        Curated Collection
                    </span>
                    <h3 className="text-woof-charcoal group-hover:text-woof-gold text-base font-bold tracking-tight transition-colors duration-300 line-clamp-1">
                        {gal.title}
                    </h3>

                    <p className="text-woof-charcoal/70 line-clamp-2 text-xs font-normal leading-relaxed">
                        {gal.description || 'A visual exploration of pet life.'}
                    </p>
                </div>

                <div className="border-t border-[#e8ded1] flex items-center justify-between pt-2.5">
                    <div className="flex items-center gap-3 text-xs font-medium text-woof-charcoal/60">
                        <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                            {gal.likes_count ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Share2 className="h-3.5 w-3.5 text-blue-500" />
                            {gal.shares_count ?? 0}
                        </span>
                    </div>
                    <span className="text-woof-gold group-hover:text-woof-charcoal inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase transition-colors">
                        Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function PhotoGridCard({ image, onSelect }: { image: GalleryImage; onSelect: () => void }) {
    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgError(false);
        setIsLoaded(false);
    }, [image.id, image.image_url]);

    const hasValidImage = Boolean(image.image_url && image.image_url.trim() !== '' && !imgError);

    return (
        <div
            onClick={onSelect}
            className="group border border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-xl relative overflow-hidden rounded-3xl bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full shadow-xs cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-woof-cream/60">
                {/* Fallback container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white border border-[#e8ded1] shadow-2xs mb-1.5 flex h-10 w-10 items-center justify-center rounded-2xl">
                        <img src="/images/favicon.png" alt="WoofCircle" className="h-5 w-5 object-contain" />
                    </div>
                    <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Image Available</span>
                </div>

                {hasValidImage && (
                    <img
                        src={image.image_url}
                        alt={image.caption || 'Community Photo'}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}

                <div className="absolute top-3 left-3 z-10">
                    <Badge className="text-woof-charcoal rounded-full border-none bg-white/95 px-3 py-1 text-[9px] font-bold tracking-wider uppercase shadow-xs backdrop-blur-md">
                        {image.category?.name || 'Moment'}
                    </Badge>
                </div>
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-woof-charcoal/80 text-white p-1.5 rounded-full backdrop-blur-xs">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>

            {/* Content area below image */}
            <div className="flex flex-col flex-grow p-3 space-y-2">
                <div className="flex-grow space-y-1">
                    <div className="text-woof-charcoal/50 flex items-center gap-1.5 text-[10px] font-medium">
                        <Camera className="text-woof-gold h-3.5 w-3.5" />
                        <span>By {image.author_name || 'Community Member'}</span>
                    </div>

                    <h4 className="text-woof-charcoal group-hover:text-woof-gold text-base font-bold tracking-tight leading-snug transition-colors duration-300">
                        {image.caption || 'Untitled Moment'}
                    </h4>
                </div>

                {/* Interactions Footer */}
                <div className="border-t border-[#e8ded1] flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-woof-charcoal/60">
                        <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                            {image.likes_count ?? 0} Likes
                        </span>
                    </div>
                    <span className="text-woof-gold group-hover:text-woof-charcoal inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase transition-colors">
                        Preview <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </div>
    );
}

function PhotoListCard({ image, onSelect }: { image: GalleryImage; onSelect: () => void }) {
    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgError(false);
        setIsLoaded(false);
    }, [image.id, image.image_url]);

    const hasValidImage = Boolean(image.image_url && image.image_url.trim() !== '' && !imgError);

    return (
        <div
            className="group border border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-lg relative flex flex-col items-center gap-6 rounded-3xl bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 md:flex-row shadow-xs md:min-h-[190px]"
        >
            <div
                onClick={onSelect}
                className="relative aspect-video w-full overflow-hidden rounded-2xl md:w-64 md:h-full block shrink-0 cursor-pointer bg-woof-cream/60"
            >
                {/* Fallback container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white border border-[#e8ded1] shadow-2xs mb-1.5 flex h-10 w-10 items-center justify-center rounded-2xl">
                        <img src="/images/favicon.png" alt="WoofCircle" className="h-5 w-5 object-contain" />
                    </div>
                    <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Image Available</span>
                </div>

                {hasValidImage && (
                    <img
                        src={image.image_url}
                        alt={image.caption || ''}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-2xl ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl">
                    <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left p-2">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                    <Badge className="bg-woof-gold rounded-full border-none px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                        {image.category?.name || 'Moment'}
                    </Badge>

                    <span className="text-woof-charcoal/50 text-xs font-medium">
                        Captured by {image.author_name || 'Community Member'}
                    </span>
                </div>

                <h3 className="text-woof-charcoal group-hover:text-woof-gold text-xl font-bold tracking-tight transition-colors">
                    {image.caption || 'Community Visual Discovery'}
                </h3>

                <div className="flex items-center justify-center gap-6 pt-2 md:justify-start">
                    <div className="flex items-center gap-1.5 text-xs text-woof-charcoal/60">
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                        <span>{image.likes_count ?? 0} Likes</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-woof-charcoal/60">
                        <Share2 className="h-4 w-4 text-blue-500" />
                        <span>{image.shares_count ?? 0} Shares</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pr-2">
                <Button
                    onClick={onSelect}
                    variant="outline"
                    className="border-[#e8ded1] hover:border-woof-gold hover:bg-woof-gold hover:text-woof-charcoal h-10 rounded-full px-6 text-xs font-bold tracking-wider uppercase cursor-pointer transition-all"
                >
                    Preview Moment
                </Button>
                {image.gallery?.slug && (
                    <Button
                        asChild
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white h-10 rounded-full px-6 text-xs font-bold tracking-wider uppercase cursor-pointer transition-all"
                    >
                        <Link href={route('community.gallery.show', { slug: image.gallery.slug })}>
                            Album
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function GalleryIndex({
    images,
    galleries,
    categories,
    featuredBreeders,
    featuredLitters,
    featuredStuds,
    featuredAdoptions,
    filters,
}: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [view, setViewState] = useState<'grid' | 'list'>(filters.view || 'grid');
    const [filterData, setFilterData] = useState({
        category_id: filters.category_id || 'all',
        search: filters.search || '',
        orderby: filters.orderby || 'latest',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const setView = (mode: 'grid' | 'list') => {
        setViewState(mode);
        router.get(
            route('community.gallery.index'),
            { ...filterData, view: mode, category_id: filterData.category_id === 'all' ? '' : filterData.category_id },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const applyFilters = (newFilters = {}) => {
        const finalFilters = { ...filterData, ...newFilters };
        router.get(
            route('community.gallery.index'),
            { ...finalFilters, view: view, category_id: finalFilters.category_id === 'all' ? '' : finalFilters.category_id },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setFilterData({ category_id: 'all', search: '', orderby: 'latest' });
        router.get(
            route('community.gallery.index'),
            { view: view },
            { preserveState: true, preserveScroll: true, replace: true },
        );
        setIsFilterOpen(false);
    };

    return (
        <PublicLayout>
            <Head title={`Community Gallery | ${settings.site_name} Moments`} />

            {/* --- CINEMATIC CLEAN HERO --- */}
            <section className="border-woof-charcoal/5 relative overflow-hidden border-b bg-woof-pearl/5 pt-32 pb-8">
                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Community Gallery', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid items-end gap-16 lg:grid-cols-2">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">
                                        Visual Chronicles
                                    </span>
                                </div>
                                <h1 className="text-4xl leading-14 font-bold tracking-wider text-woof-charcoal uppercase">
                                    Moments <span className="text-woof-gold">Captured.</span>
                                </h1>
                            </div>
                            <p className="text-sm text-woof-charcoal/60 max-w-lg tracking-wide leading-relaxed font-medium">
                                A visual tribute to our four-legged companions. Explore curated editorial albums, breed captures, and authentic daily stories from the {settings.site_name} community.
                            </p>

                            <div className="pt-1 flex items-center gap-3">
                                <a
                                    href="#curated-albums"
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#e8ded1] bg-white hover:border-woof-gold hover:bg-woof-gold hover:text-woof-charcoal px-4 text-xs font-bold uppercase tracking-wider text-woof-charcoal shadow-2xs transition-all cursor-pointer"
                                >
                                    <Sparkles className="text-woof-gold h-3.5 w-3.5" />
                                    <span>Featured Albums</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-center justify-end gap-4 pb-2 sm:flex-row">
                            <div className="border-[#e8ded1] focus-within:border-woof-gold/60 focus-within:shadow-md bg-white rounded-3xl sm:rounded-full p-2 pl-6 flex w-full items-center gap-4 border shadow-xs transition-all duration-300 sm:w-[620px]">
                                <div className="text-woof-charcoal/70 flex flex-1 items-center gap-3">
                                    <Search className="text-woof-gold size-4 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search memories, captions, authors..."
                                        value={filterData.search}
                                        onChange={(e) => setFilterData({ ...filterData, search: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="text-woof-charcoal placeholder:text-woof-charcoal/40 text-sm h-10 w-full border-none bg-transparent px-0 font-medium outline-none focus:ring-0"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="text-woof-charcoal/70 hover:text-woof-gold group/btn flex shrink-0 cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-woof-cream/60 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        <span>Categories</span>
                                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-woof-gold' : ''}`} />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => applyFilters()}
                                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-9 cursor-pointer rounded-full px-5 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all"
                                        >
                                            Explore
                                        </Button>
                                        <Button
                                            onClick={resetFilters}
                                            variant="ghost"
                                            className="hover:bg-woof-cream text-woof-charcoal/60 hover:text-woof-charcoal flex h-9 w-9 cursor-pointer items-center justify-center rounded-full p-0 transition-all"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CATEGORY DRAWER --- */}
            {isFilterOpen && (
                <section className="bg-woof-cream/30 py-6 border-b border-[#e8ded1]">
                    <div className="container-wide px-6 lg:px-12">
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs">
                            <div className="space-y-3">
                                <h4 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Filter by Category</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterData((prev) => ({ ...prev, category_id: 'all' }));
                                            applyFilters({ category_id: 'all' });
                                        }}
                                        className={cn(
                                            'rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer',
                                            filterData.category_id === 'all'
                                                ? 'bg-woof-charcoal border-woof-charcoal text-white shadow-xs'
                                                : 'text-woof-charcoal border-[#e8ded1] hover:border-woof-gold hover:text-woof-gold bg-white',
                                        )}
                                    >
                                        All Categories
                                    </button>

                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                const val = cat.id.toString();
                                                setFilterData((prev) => ({ ...prev, category_id: val }));
                                                applyFilters({ category_id: val });
                                            }}
                                            className={cn(
                                                'rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer',
                                                filterData.category_id === cat.id.toString()
                                                    ? 'bg-woof-charcoal border-woof-charcoal text-white shadow-xs'
                                                    : 'text-woof-charcoal border-[#e8ded1] hover:border-woof-gold hover:text-woof-gold bg-white',
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- FEATURED CURATED ALBUMS (4 GRIDS PER ROW) --- */}
            {galleries && galleries.length > 0 && (
                <section id="curated-albums" className="border-b border-[#e8ded1] bg-[#fcfbf9] py-16">
                    <div className="container-wide px-6 lg:px-12">
                        <div className="flex flex-col items-start justify-between gap-4 pb-8 md:flex-row md:items-end">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="bg-woof-gold h-2 w-2 rounded-full" />
                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Editorial Selections</span>
                                </div>
                                <h2 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight">
                                    Curated <span className="text-woof-gold">Albums.</span>
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {galleries.map((gal) => (
                                <AlbumCard key={gal.id} gal={gal} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- PHOTO STREAM & RESULTS --- */}
            <section className="bg-white py-16">
                <div className="container-wide px-6 lg:px-12">
                    <ResultsToolbar
                        total={images.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={(v) => applyFilters({ orderby: v })}
                        sortOptions={[
                            { label: 'Newest First', value: 'latest' },
                            { label: 'Most Liked', value: 'popular' },
                        ]}
                    />

                    {view === 'grid' ? (
                        <div>
                            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {images.data.length === 0 ? (
                                    <div className="border-[#e8ded1] col-span-full space-y-4 rounded-3xl border border-dashed bg-[#fcfbf9] py-24 text-center">
                                        <div className="text-woof-gold border border-[#e8ded1] bg-white mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xs">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-woof-charcoal text-2xl font-bold">No captures discovered</h3>
                                            <p className="text-woof-charcoal/70 mx-auto max-w-sm text-xs font-normal">
                                                The stream is currently quiet for this category. Be the first to share a moment.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    images.data.map((image) => (
                                        <PhotoGridCard
                                            key={image.id}
                                            image={image}
                                            onSelect={() => setSelectedImage(image)}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {images.links && images.links.length > 3 && (
                                <div className="mt-16 flex justify-center">
                                    <Pagination links={images.links} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main List Column */}
                            <div className="lg:col-span-8 space-y-6">
                                {images.data.length === 0 ? (
                                    <div className="border-[#e8ded1] rounded-3xl border border-dashed bg-[#fcfbf9] py-20 text-center">
                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            No captures found in list view
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {images.data.map((image) => (
                                            <PhotoListCard
                                                key={image.id}
                                                image={image}
                                                onSelect={() => setSelectedImage(image)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {images.links && images.links.length > 3 && (
                                    <div className="pt-8 flex justify-center">
                                        <Pagination links={images.links} />
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar Column */}
                            <div className="lg:col-span-4">
                                <CuratedListingSidebar
                                    currentType="gallery"
                                    featuredBreeders={featuredBreeders}
                                    featuredLitters={featuredLitters}
                                    featuredStuds={featuredStuds}
                                    featuredAdoptions={featuredAdoptions}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* --- LIGHTBOX DIALOG --- */}
            <Dialog open={!!selectedImage} onOpenChange={(open: boolean) => !open && setSelectedImage(null)}>
                <DialogContent
                    showCloseButton={false}
                    overlayClassName="bg-black/90 backdrop-blur-xl"
                    className="shadow-2xl animate-in zoom-in-95 max-w-[95vw] overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-0 duration-300 md:max-w-7xl"
                >
                    {selectedImage && (
                        <div className="flex h-full flex-col md:h-[85vh] md:flex-row">
                            <div className="relative flex items-center justify-center bg-slate-950 p-6 md:w-2/3">
                                <img
                                    src={selectedImage.image_url}
                                    alt="Discovery Preview"
                                    className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
                                />

                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-col justify-between space-y-8 p-8 md:w-1/3">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="text-woof-gold border border-[#e8ded1] bg-woof-cream flex h-12 w-12 items-center justify-center rounded-2xl shadow-2xs">
                                            <Camera className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h4 className="text-woof-charcoal/50 text-[10px] font-medium tracking-wider uppercase">Captured by</h4>
                                            <p className="text-woof-charcoal text-lg font-bold">
                                                {selectedImage.author_name || 'Community Member'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-woof-charcoal text-2xl font-bold tracking-tight">
                                            {selectedImage.caption || `A moment of discovery within the ${settings.site_name} community.`}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            <Badge className="bg-woof-cream text-woof-charcoal rounded-full border-none px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-2xs">
                                                {selectedImage.category?.name || 'Moments'}
                                            </Badge>

                                            <span className="text-woof-charcoal/60 text-xs font-medium">
                                                {new Date(selectedImage.created_at).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#e8ded1] space-y-6 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1.5 text-rose-500">
                                                <Heart className="fill-current h-5 w-5" />
                                                <span className="text-woof-charcoal/80 text-xs font-bold">{selectedImage.likes_count ?? 0}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-blue-500">
                                                <Share2 className="h-5 w-5" />
                                                <span className="text-woof-charcoal/80 text-xs font-bold">{selectedImage.shares_count ?? 0}</span>
                                            </div>
                                        </div>

                                        {selectedImage.gallery?.slug ? (
                                            <Button
                                                asChild
                                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 rounded-full px-6 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                                            >
                                                <Link href={route('community.gallery.show', { slug: selectedImage.gallery.slug })}>
                                                    View Full Album
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => setSelectedImage(null)}
                                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 rounded-full px-6 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                                            >
                                                Close Preview
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
