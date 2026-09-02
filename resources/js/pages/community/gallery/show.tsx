import { Breadcrumbs } from '@/components/breadcrumbs';
import DisplayAdBanner from '@/components/public/display-ad-banner';
import ShareDialog from '@/components/public/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
    ArrowLeft,
    ArrowUpRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Heart,
    Image as ImageIcon,
    Loader2,
    MapPin,
    Maximize2,
    Share2,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface GalleryImageItem {
    id: number;
    url: string;
    caption: string | null;
}

interface Gallery {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    category?: { name: string } | null;
    city?: { name: string } | null;
    state?: { name: string } | null;
    user?: { name: string; avatar?: string | null } | null;
    images: GalleryImageItem[];
    shares_count?: number;
    exports_count?: number;
    likes_count?: number;
}

interface AlbumSummary {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    category?: { name: string } | null;
    likes_count?: number;
    shares_count?: number;
}

interface PageProps {
    gallery: Gallery;
    isLiked: boolean;
    likesCount: number;
    moreGalleries?: AlbumSummary[];
}

function RelatedAlbumCard({ gal }: { gal: AlbumSummary }) {
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
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-woof-cream/60">
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
                    <span className="text-woof-charcoal rounded-full bg-white/95 px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-xs backdrop-blur-md">
                        {gal.category?.name || 'Collection'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-3.5 space-y-2">
                <h3 className="text-woof-charcoal group-hover:text-woof-gold text-base font-bold tracking-tight transition-colors duration-300 line-clamp-1">
                    {gal.title}
                </h3>
                <p className="text-woof-charcoal/70 line-clamp-2 text-xs font-normal leading-relaxed">
                    {gal.description || 'A visual exploration of pet life.'}
                </p>
                <div className="border-t border-[#e8ded1] flex items-center justify-between pt-2.5">
                    <span className="text-xs font-medium text-woof-charcoal/60 flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                        {gal.likes_count ?? 0} Likes
                    </span>
                    <span className="text-woof-gold group-hover:text-woof-charcoal inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase transition-colors">
                        Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function GalleryPhotoTile({
    url,
    alt,
    caption,
    index,
    totalPhotos,
    onOpenLightbox,
    aspect = 'aspect-square',
}: {
    url: string;
    alt: string;
    caption?: string | null;
    index: number;
    totalPhotos: number;
    onOpenLightbox: (index: number) => void;
    aspect?: string;
}) {
    const [imgError, setImgError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgError(false);
        setIsLoaded(false);
    }, [url]);

    const hasValidImage = Boolean(url && url.trim() !== '' && !imgError);

    return (
        <div
            onClick={() => onOpenLightbox(index)}
            className={`group relative ${aspect} cursor-pointer overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2.5 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-woof-gold/40 hover:shadow-xl`}
        >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-woof-cream/60">
                {/* Fallback container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white border border-[#e8ded1] shadow-2xs mb-1.5 flex h-10 w-10 items-center justify-center rounded-2xl">
                        <img src="/images/favicon.png" alt="WoofCircle" className="h-5 w-5 object-contain" />
                    </div>
                    <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Image Available</span>
                </div>

                {hasValidImage && (
                    <img
                        src={url}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}

                {/* Index Pill */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        {index + 1} / {totalPhotos}
                    </span>
                </div>

                {/* Hover overlay with zoom button & caption */}
                <div className="bg-woof-charcoal/40 absolute inset-0 flex flex-col justify-between p-4 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 rounded-2xl z-20">
                    <div className="flex justify-end">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur-md shadow-md">
                            <Maximize2 className="h-4 w-4" />
                        </div>
                    </div>

                    {caption && (
                        <div className="rounded-xl border border-white/20 bg-black/40 p-2.5 backdrop-blur-md">
                            <p className="text-xs font-medium text-white line-clamp-2 leading-relaxed">
                                {caption}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function GalleryShow({ gallery, isLiked: initialIsLiked, likesCount: initialLikesCount, moreGalleries = [] }: PageProps) {
    const { settings, auth } = usePage<SharedData>().props;
    const [liked, setLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiking, setIsLiking] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

    // Compile all gallery photos: featured cover + album gallery images
    const allPhotos: { url: string; caption: string | null; isCover?: boolean }[] = [];
    if (gallery.image_url) {
        allPhotos.push({
            url: gallery.image_url,
            caption: gallery.title,
            isCover: true,
        });
    }
    if (gallery.images && gallery.images.length > 0) {
        gallery.images.forEach((img) => {
            allPhotos.push({
                url: img.url,
                caption: img.caption,
                isCover: false,
            });
        });
    }

    // Lightbox navigation handlers
    const handleNextPhoto = useCallback(() => {
        if (activePhotoIndex !== null && allPhotos.length > 0) {
            setActivePhotoIndex((prev) => (prev! + 1) % allPhotos.length);
        }
    }, [activePhotoIndex, allPhotos.length]);

    const handlePrevPhoto = useCallback(() => {
        if (activePhotoIndex !== null && allPhotos.length > 0) {
            setActivePhotoIndex((prev) => (prev! - 1 + allPhotos.length) % allPhotos.length);
        }
    }, [activePhotoIndex, allPhotos.length]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activePhotoIndex === null) return;
            if (e.key === 'ArrowRight') handleNextPhoto();
            if (e.key === 'ArrowLeft') handlePrevPhoto();
            if (e.key === 'Escape') setActivePhotoIndex(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activePhotoIndex, handleNextPhoto, handlePrevPhoto]);

    const trackExport = async () => {
        try {
            await fetch(route('community.gallery.export', { slug: gallery.slug }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
        } catch (error) {
            console.error('Error tracking export:', error);
        }
    };

    const toggleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            const response = await fetch(route('community.gallery.like', { slug: gallery.slug }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLiked(data.liked);
                setLikesCount(data.likes_count);
                if (data.liked) {
                    toast.success('Added to favorite collections!');
                } else {
                    toast.success('Removed from favorite collections.');
                }
            } else {
                toast.error('Please login to save your favorites.');
            }
        } catch (error) {
            console.error('Error liking gallery:', error);
            toast.error('Something went wrong.');
        } finally {
            setIsLiking(false);
        }
    };

    const handleExportGallery = () => {
        setIsExporting(true);
        toast.info('Preparing your gallery archive download...');
        const downloadUrl = `/gallery/${encodeURIComponent(gallery.slug)}/download`;
        window.open(downloadUrl, '_blank');
        trackExport();
        setTimeout(() => setIsExporting(false), 2500);
    };

    const handleSubmitMoment = () => {
        if (auth?.user) {
            router.visit(route('dashboard.gallery.index'));
        } else {
            toast.error('Please login to submit your moment.');
        }
    };

    return (
        <PublicLayout>
            <Head title={`${gallery.title} - Visual Collection | ${settings.site_name}`} />

            {/* --- CINEMATIC CLEAN LUXURY HERO --- */}
            <section className="border-woof-charcoal/5 relative overflow-hidden border-b bg-woof-pearl/5 pt-32 pb-12">
                {/* Ambient backdrop blur */}
                {gallery.image_url && (
                    <div className="animate-reveal absolute inset-0 z-0 opacity-10 blur-3xl pointer-events-none select-none">
                        <img
                            src={gallery.image_url}
                            alt="Ambient Backdrop"
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: '/' },
                            { title: 'Visual Archives', href: route('community.gallery.index') },
                            { title: gallery.title, href: '#' },
                        ]}
                        className="mb-6"
                    />

                    <div className="grid items-end gap-10 lg:grid-cols-12">
                        {/* Title & Metadata */}
                        <div className="space-y-4 lg:col-span-8">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                        {gallery.category?.name || 'Community Collection'}
                                    </Badge>

                                    {gallery.user?.name && (
                                        <span className="text-woof-charcoal/60 text-xs font-medium flex items-center gap-1.5 ml-2">
                                            <User className="h-3.5 w-3.5 text-woof-gold" />
                                            Curated by {gallery.user.name}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                                    {gallery.title}
                                </h1>
                            </div>

                            <p className="text-woof-charcoal/70 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
                                {gallery.description ||
                                    'A visual exploration capturing the extraordinary bonds, joy, and stories within our pet community.'}
                            </p>

                            <div className="text-woof-charcoal/60 flex flex-wrap items-center gap-5 text-xs font-medium uppercase tracking-wider pt-2">
                                {(gallery.city?.name || gallery.state?.name) && (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="text-woof-gold h-4 w-4" />
                                            <span>
                                                {gallery.city?.name ? `${gallery.city.name}, ` : ''}
                                                {gallery.state?.name}
                                            </span>
                                        </div>
                                        <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full" />
                                    </>
                                )}

                                <div className="flex items-center gap-1.5">
                                    <Calendar className="text-woof-gold h-4 w-4" />
                                    <span>
                                        {new Date(gallery.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full" />

                                <div className="flex items-center gap-1.5">
                                    <ImageIcon className="text-woof-gold h-4 w-4" />
                                    <span>{allPhotos.length} Photographs</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Controls */}
                        <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
                            {/* Like Button */}
                            <Button
                                variant="outline"
                                onClick={toggleLike}
                                disabled={isLiking}
                                className={`border-[#e8ded1] h-11 rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                                    liked
                                        ? 'border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100'
                                        : 'bg-white hover:border-woof-gold hover:bg-woof-cream/40 text-woof-charcoal'
                                }`}
                            >
                                <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                                <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                            </Button>

                            {/* Share Button */}
                            <Button
                                variant="outline"
                                onClick={() => setIsShareOpen(true)}
                                className="border-[#e8ded1] bg-white hover:border-woof-gold hover:bg-woof-cream/40 text-woof-charcoal h-11 rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                            >
                                <Share2 className="h-4 w-4 mr-2 text-woof-gold" />
                                <span>Share</span>
                            </Button>

                            {/* Export Collection Button */}
                            <Button
                                onClick={handleExportGallery}
                                disabled={isExporting}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white h-11 rounded-full px-6 text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer transition-all disabled:opacity-75"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Packaging Gallery...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" /> Export Gallery
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GALLERY PHOTOS GRID --- */}
            <section className="bg-white pb-24 pt-12">
                <div className="container-wide px-6 lg:px-12 space-y-16">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e8ded1]">
                        <div className="space-y-1">
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Visual Showcase</span>
                            <h2 className="text-woof-charcoal text-2xl font-bold tracking-tight">
                                Captured Photographs <span className="text-woof-charcoal/40 font-normal">({allPhotos.length})</span>
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className="group h-10 rounded-full border-[#e8ded1] bg-[#fcfbf9] px-5 text-xs font-bold tracking-wider text-woof-charcoal uppercase shadow-2xs transition-all duration-300 hover:border-woof-gold hover:bg-white hover:text-woof-charcoal hover:shadow-xs cursor-pointer"
                            >
                                <Link href={route('community.gallery.index')} className="inline-flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4 text-woof-gold transition-transform duration-300 group-hover:-translate-x-1" />
                                    <span>Back to Albums</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Photos Responsive Grid */}
                    {allPhotos.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allPhotos.map((photo, index) => (
                                <GalleryPhotoTile
                                    key={index}
                                    url={photo.url}
                                    alt={photo.caption || `Collection Photo ${index + 1}`}
                                    caption={photo.caption}
                                    index={index}
                                    totalPhotos={allPhotos.length}
                                    onOpenLightbox={(idx) => setActivePhotoIndex(idx)}
                                    aspect={photo.isCover ? 'aspect-[4/5] sm:aspect-square' : 'aspect-square'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-[#e8ded1] bg-woof-cream/20">
                            <div className="bg-white border border-[#e8ded1] mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm">
                                <ImageIcon className="h-7 w-7 text-woof-gold" />
                            </div>
                            <h3 className="text-woof-charcoal text-lg font-bold">No Photos Found</h3>
                            <p className="text-woof-charcoal/60 text-xs mt-1 max-w-sm">
                                This collection currently has no photos uploaded.
                            </p>
                        </div>
                    )}

                    {/* --- DISPLAY AD BANNER --- */}
                    <div className="py-4">
                        <DisplayAdBanner slot="header_leaderboard" />
                    </div>

                    {/* --- NARRATIVE / BEYOND THE LENS --- */}
                    <div className="border border-[#e8ded1] bg-linear-to-b from-[#fcfbf9] to-white rounded-3xl p-8 sm:p-12 shadow-xs max-w-4xl mx-auto space-y-6 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-woof-gold">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Beyond the Lens</span>
                        </div>

                        <h3 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight">
                            The Story Behind the Moments
                        </h3>

                        <p className="text-woof-charcoal/70 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
                            {gallery.description ||
                                'This collection captures authentic canine beauty, warmth, and memorable companionship. Every picture reflects the heart and devotion of our community members.'}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <Button
                                asChild
                                variant="outline"
                                className="group h-11 rounded-full border-[#e8ded1] bg-white px-6 text-xs font-bold tracking-wider uppercase text-woof-charcoal shadow-2xs transition-all duration-300 hover:border-woof-gold hover:bg-woof-cream/40 cursor-pointer"
                            >
                                <Link href={route('community.gallery.index')} className="inline-flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4 text-woof-gold transition-transform duration-300 group-hover:-translate-x-1" />
                                    <span>All Collections</span>
                                </Link>
                            </Button>

                            <Button
                                onClick={handleSubmitMoment}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 gap-2 rounded-full px-6 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                            >
                                Submit Your Moment <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* --- EXPLORE MORE COLLECTIONS (4-GRID) --- */}
                    {moreGalleries && moreGalleries.length > 0 && (
                        <div className="border-t border-[#e8ded1] pt-16 space-y-8">
                            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-woof-gold h-2 w-2 rounded-full" />
                                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                                            Curated Exploration
                                        </span>
                                    </div>
                                    <h2 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight">
                                        Related <span className="text-woof-gold">Collections.</span>
                                    </h2>
                                </div>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="group h-10 rounded-full border-[#e8ded1] bg-[#fcfbf9] px-5 text-xs font-bold tracking-wider uppercase text-woof-charcoal shadow-2xs transition-all duration-300 hover:border-woof-gold hover:bg-white cursor-pointer"
                                >
                                    <Link href={route('community.gallery.index')} className="inline-flex items-center gap-2">
                                        <span>View All Albums</span>
                                        <ArrowUpRight className="h-4 w-4 text-woof-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {moreGalleries.map((gal) => (
                                    <RelatedAlbumCard key={gal.id} gal={gal} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* --- IMMERSIVE FULL-SCREEN LIGHTBOX MODAL --- */}
            {activePhotoIndex !== null && allPhotos[activePhotoIndex] && (
                <DialogPrimitive.Root
                    open={activePhotoIndex !== null}
                    onOpenChange={(open) => !open && setActivePhotoIndex(null)}
                >
                    <DialogPrimitive.Portal>
                        {/* Pure dark backdrop without white borders */}
                        <DialogPrimitive.Overlay className="fixed inset-0 z-[1000] bg-black/92 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                        {/* Full-viewport canvas without extra frames or gaps */}
                        <DialogPrimitive.Content
                            className="fixed inset-0 z-[1001] flex flex-col justify-between p-4 sm:p-6 select-none focus:outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                        >
                            <DialogPrimitive.Description className="sr-only">
                                High-resolution photo preview
                            </DialogPrimitive.Description>

                            {/* Top Floating Control Bar */}
                            <div className="w-full flex items-center justify-between z-20 shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <span className="rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 text-xs font-semibold text-white/90">
                                        {activePhotoIndex + 1} / {allPhotos.length}
                                    </span>
                                    {gallery.category?.name && (
                                        <span className="hidden sm:inline-block rounded-full bg-woof-gold/90 px-2.5 py-0.5 text-[11px] font-bold text-white tracking-wider uppercase shadow-xs">
                                            {gallery.category.name}
                                        </span>
                                    )}
                                    <span className="hidden md:inline-block text-white/60 text-xs font-medium truncate max-w-sm">
                                        {gallery.title}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={allPhotos[activePhotoIndex].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-all cursor-pointer"
                                        title="Open full resolution in new tab"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Full Res</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => setActivePhotoIndex(null)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Center Photo Canvas */}
                            <div className="relative flex-1 flex items-center justify-center w-full my-auto overflow-hidden py-2 min-h-0">
                                <img
                                    key={activePhotoIndex}
                                    src={allPhotos[activePhotoIndex].url}
                                    alt={allPhotos[activePhotoIndex].caption || gallery.title}
                                    className="max-h-[78vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[88vw] object-contain rounded-xl shadow-2xl transition-all duration-200 select-none pointer-events-auto"
                                />

                                {/* Floating Left & Right Arrow Buttons */}
                                {allPhotos.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrevPhoto();
                                            }}
                                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white/90 hover:text-white backdrop-blur-md hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer z-30"
                                            aria-label="Previous photo"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNextPhoto();
                                            }}
                                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white/90 hover:text-white backdrop-blur-md hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer z-30"
                                            aria-label="Next photo"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Lightweight Minimal Caption */}
                            <div className="w-full text-center z-20 pt-1 shrink-0">
                                {allPhotos[activePhotoIndex].caption ? (
                                    <p className="text-white/90 text-sm font-medium drop-shadow-md max-w-2xl mx-auto truncate sm:whitespace-normal">
                                        {allPhotos[activePhotoIndex].caption}
                                    </p>
                                ) : (
                                    <p className="text-white/50 text-xs font-normal drop-shadow-md">
                                        {gallery.title}
                                    </p>
                                )}
                            </div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
            )}

            {/* --- SHARE DIALOG --- */}
            <ShareDialog
                isOpen={isShareOpen}
                setIsOpen={setIsShareOpen}
                title={`${gallery.title} - WoofCircle Gallery`}
            />
        </PublicLayout>
    );
}

