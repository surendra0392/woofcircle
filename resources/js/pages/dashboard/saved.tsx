import { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import SaveButton from '@/components/public/save-button';
import { Head, Link, router } from '@inertiajs/react';
import { Bookmark, MapPin, ChevronRight, Heart, Image, BookOpen } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface Props {
    roles: string[];
    saved_listings: {
        puppies: any[];
        adoptions: any[];
        studs: any[];
        directory: any[];
        articles: any[];
        galleries: any[];
        events: any[];
    };
    saved_counts: {
        puppies: number;
        adoptions: number;
        studs: number;
        directory: number;
        articles: number;
        galleries: number;
        events: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Saved Listings', href: '/dashboard/saved' },
];

export default function SavedListings({ roles, saved_listings, saved_counts }: Props) {
    const [activeTab, setActiveTab] = useState<'puppies' | 'adoptions' | 'studs' | 'directory' | 'articles' | 'galleries' | 'events'>('puppies');

    const toggleArticleSave = (slug: string) => {
        router.post(route('community.articles.save', { slug }), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Articles list updated'),
            onError: () => toast.error('Failed to update article bookmark')
        });
    };

    const toggleGalleryLike = (slug: string) => {
        router.post(route('community.gallery.like', { slug }), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Galleries list updated'),
            onError: () => toast.error('Failed to update gallery like')
        });
    };

    const puppiesCount = saved_counts.puppies;
    const adoptionsCount = saved_counts.adoptions;
    const studsCount = saved_counts.studs;
    const directoryCount = saved_counts.directory;
    const articlesCount = saved_counts.articles;
    const galleriesCount = saved_counts.galleries;
    const eventsCount = saved_counts.events;
    const totalSavedCount = puppiesCount + adoptionsCount + studsCount + directoryCount + articlesCount + galleriesCount + eventsCount;

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Saved Listings"
            subtitle="Browse and manage all the items you've bookmarked."
        >
            <Head title="Saved Listings" />

            <div className="space-y-6">
                {totalSavedCount > 0 ? (
                    <div className="space-y-6">
                        {/* Tabs Navigation */}
                        <div className="bg-[#f4ebe1] p-1.5 rounded-full border border-[#e8ded1] flex flex-wrap gap-1">
                            {[
                                { id: 'puppies', label: 'Puppies', count: puppiesCount },
                                { id: 'adoptions', label: 'Adoptions', count: adoptionsCount },
                                { id: 'studs', label: 'Studs', count: studsCount },
                                { id: 'directory', label: 'Directory Services', count: directoryCount },
                                { id: 'articles', label: 'Articles', count: articlesCount },
                                { id: 'galleries', label: 'Galleries', count: galleriesCount },
                                { id: 'events', label: 'Events', count: eventsCount },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-woof-charcoal text-white shadow-xs'
                                            : 'text-[#61584a] hover:text-woof-charcoal hover:bg-white/50'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            activeTab === tab.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-white text-woof-charcoal'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Active Tab Content */}
                        <div>
                            {activeTab === 'puppies' && (
                                puppiesCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.puppies.map((item) => (
                                            <div key={item.id} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                <Link href={item.slug ? route('marketplace.litters.show', { slug: item.slug }) : '#'} className="block relative aspect-video w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={item.images?.[0]?.image_path ? `/storage/${item.images[0].image_path}` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    {item.price && (
                                                        <div className="absolute bottom-3 left-3 bg-woof-charcoal/90 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white rounded-full">
                                                            ₹{item.price.toLocaleString()}
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">
                                                                {item.breed?.name}
                                                            </span>
                                                        </div>
                                                        <Link href={item.slug ? route('marketplace.litters.show', { slug: item.slug }) : '#'}>
                                                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-woof-charcoal/60 mt-1.5 flex items-center gap-1 text-xs font-medium">
                                                            <MapPin className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                                            {item.city?.name}, {item.state?.name}
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                        <span className="text-xs font-medium text-woof-charcoal/50">
                                                            {item.breeder_name || 'Breeder'}
                                                        </span>
                                                        <SaveButton
                                                            itemId={item.id}
                                                            itemType="puppy"
                                                            isSaved={true}
                                                            variant="icon"
                                                            className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved puppies</p>
                                        <Link href={route('marketplace.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Puppies
                                        </Link>
                                    </div>
                                )
                            )}

                            {activeTab === 'adoptions' && (
                                adoptionsCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.adoptions.map((item) => (
                                            <div key={item.id} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                <Link href={route('marketplace.adoption.show', { slug: item.slug })} className="block relative aspect-video w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={item.featured_image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute bottom-3 left-3 bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full shadow-xs">
                                                        Adopt
                                                    </div>
                                                </Link>
                                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">
                                                                {item.breed?.name}
                                                            </span>
                                                        </div>
                                                        <Link href={route('marketplace.adoption.show', { slug: item.slug })}>
                                                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-woof-charcoal/60 mt-1.5 flex items-center gap-1 text-xs font-medium">
                                                            <MapPin className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                                            {item.city?.name}, {item.state?.name}
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                        <span className="text-xs font-medium text-woof-charcoal/60">
                                                            {item.age} • {item.gender}
                                                        </span>
                                                        <SaveButton
                                                            itemId={item.id}
                                                            itemType="adoption"
                                                            isSaved={true}
                                                            variant="icon"
                                                            className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved adoption listings</p>
                                        <Link href={route('marketplace.adoption.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Adoptions
                                        </Link>
                                    </div>
                                )
                            )}

                            {activeTab === 'studs' && (
                                studsCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.studs.map((item) => (
                                            <div key={item.id} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                <Link href={route('marketplace.studs.show', { slug: item.slug })} className="block relative aspect-video w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={item.images?.[0]?.image_path ? `/storage/${item.images[0].image_path}` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute bottom-3 left-3 bg-woof-charcoal/90 backdrop-blur-xs px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full">
                                                        Stud
                                                    </div>
                                                </Link>
                                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">
                                                                {item.breed?.name}
                                                            </span>
                                                        </div>
                                                        <Link href={route('marketplace.studs.show', { slug: item.slug })}>
                                                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-woof-charcoal/60 mt-1.5 flex items-center gap-1 text-xs font-medium">
                                                            <MapPin className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                                            {item.city?.name}, {item.state?.name}
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                        <span className="text-xs font-bold text-woof-charcoal">
                                                            {item.price ? `₹${item.price.toLocaleString()}` : 'Contact'}
                                                        </span>
                                                        <SaveButton
                                                            itemId={item.id}
                                                            itemType="stud"
                                                            isSaved={true}
                                                            variant="icon"
                                                            className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved stud listings</p>
                                        <Link href={route('marketplace.studs.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Studs
                                        </Link>
                                    </div>
                                )
                            )}

                            {activeTab === 'directory' && (
                                directoryCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.directory.map((item) => {
                                            const typeLabel = {
                                                breeder: 'Breeder',
                                                vet: 'Veterinary',
                                                trainer: 'Trainer',
                                                boarding: 'Boarding',
                                                welfare: 'Welfare',
                                                'pet-shop': 'Pet Shop'
                                            }[item.directory_type as string] || 'Service';

                                            const typeColor = {
                                                breeder: 'text-amber-800 bg-amber-50 border-amber-200',
                                                vet: 'text-emerald-800 bg-emerald-50 border-emerald-200',
                                                trainer: 'text-sky-800 bg-sky-50 border-sky-200',
                                                boarding: 'text-sky-800 bg-sky-50 border-sky-200',
                                                welfare: 'text-rose-800 bg-rose-50 border-rose-200',
                                                'pet-shop': 'text-amber-800 bg-amber-50 border-amber-200'
                                            }[item.directory_type as string] || 'text-woof-charcoal/70 bg-[#fcfbf9] border-[#e8ded1]';

                                            const detailUrl = (item.directory_type === 'breeder'
                                                ? route('marketplace.breeders.show', { slug: item.slug })
                                                : route(`directory.${item.directory_type === 'pet-shop' ? 'pet-shops' : item.directory_type + 's'}.show` as any, item.slug)) as string;

                                            return (
                                                <div key={`${item.directory_type}-${item.id}`} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                    <Link href={detailUrl} className="block relative aspect-video w-full overflow-hidden shrink-0 border-b border-[#e8ded1]">
                                                        <img
                                                            src={item.logo_url || {
                                                                breeder: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
                                                                vet: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
                                                                trainer: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop',
                                                                boarding: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=600&auto=format&fit=crop',
                                                                welfare: 'https://images.unsplash.com/photo-1484130331485-7e39042b5585?q=80&w=600&auto=format&fit=crop',
                                                                'pet-shop': 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600&auto=format&fit=crop'
                                                            }[item.directory_type as string] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'}
                                                            alt={item.kennel_name || item.clinic_name || item.business_name || item.org_name || item.shop_name || item.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        <div className={`absolute bottom-3 left-3 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${typeColor}`}>
                                                            {typeLabel}
                                                        </div>
                                                    </Link>
                                                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                        <div>
                                                            <Link href={detailUrl}>
                                                                <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                    {item.kennel_name || item.clinic_name || item.business_name || item.org_name || item.shop_name || item.name}
                                                                </h4>
                                                            </Link>
                                                            <p className="text-woof-charcoal/60 mt-1.5 flex items-center gap-1 text-xs font-medium">
                                                                <MapPin className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                                                {item.city?.name}, {item.state?.name}
                                                            </p>
                                                        </div>
                                                        <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                            <Link href={detailUrl} className="text-xs font-bold text-woof-gold hover:underline">
                                                                View Profile
                                                            </Link>
                                                            <SaveButton
                                                                itemId={item.id}
                                                                itemType={item.directory_type === 'pet-shop' ? 'pet_shop' : item.directory_type}
                                                                isSaved={true}
                                                                variant="icon"
                                                                className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved directory profiles</p>
                                        <Link href={route('directory.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Directory
                                        </Link>
                                    </div>
                                )
                            )}

                            {activeTab === 'articles' && (
                                articlesCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.articles.map((item) => (
                                            <div key={item.id} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                <Link href={route('community.articles.show', { slug: item.slug })} className="block relative aspect-video w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={item.image_url || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs text-[10px] font-bold tracking-wider uppercase text-woof-charcoal">
                                                        {item.category?.name || 'Article'}
                                                    </div>
                                                </Link>
                                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                    <div>
                                                        <Link href={route('community.articles.show', { slug: item.slug })}>
                                                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-woof-charcoal/60 mt-1.5 line-clamp-2 text-xs font-normal">
                                                            {item.excerpt || 'Read this helpful guide from our experts.'}
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                        <Link href={route('community.articles.show', { slug: item.slug })} className="text-xs font-bold text-woof-gold hover:underline flex items-center gap-1">
                                                            Read Article <ChevronRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleArticleSave(item.slug);
                                                            }}
                                                            className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100 flex items-center justify-center cursor-pointer text-rose-500"
                                                        >
                                                            <Heart className="h-4 w-4 fill-current" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved articles</p>
                                        <Link href={route('community.articles.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Articles
                                        </Link>
                                    </div>
                                )
                            )}

                            {activeTab === 'galleries' && (
                                galleriesCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.galleries.map((item) => (
                                            <div key={item.id} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                <Link href={route('community.gallery.show', { slug: item.slug })} className="block relative aspect-video w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={item.main_image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs text-[10px] font-bold tracking-wider uppercase text-woof-charcoal">
                                                        {item.category?.name || 'Gallery'}
                                                    </div>
                                                </Link>
                                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                    <div>
                                                        <Link href={route('community.gallery.show', { slug: item.slug })}>
                                                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-woof-charcoal/60 mt-1.5 line-clamp-2 text-xs font-normal">
                                                            {item.description || 'View this photo gallery.'}
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                        <Link href={route('community.gallery.show', { slug: item.slug })} className="text-xs font-bold text-woof-gold hover:underline flex items-center gap-1">
                                                            View Gallery <ChevronRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleGalleryLike(item.slug);
                                                            }}
                                                            className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100 flex items-center justify-center cursor-pointer text-rose-500"
                                                        >
                                                            <Heart className="h-4 w-4 fill-current" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved galleries</p>
                                        <Link href={route('community.gallery.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Gallery
                                        </Link>
                                    </div>
                                )
                            )}

                            {activeTab === 'events' && (
                                eventsCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {saved_listings.events.map((item) => (
                                            <div key={item.id} className="group bg-white rounded-3xl border border-[#e8ded1] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                <Link href={route('community.events.show', { slug: item.slug })} className="block relative aspect-video w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={item.image_url || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl text-center min-w-[44px] shadow-xs">
                                                        <span className="block text-[9px] font-bold text-woof-gold uppercase leading-none">
                                                            {new Date(item.start_date).toLocaleString('default', { month: 'short' })}
                                                        </span>
                                                        <span className="block text-sm font-bold text-woof-charcoal leading-none mt-0.5">
                                                            {new Date(item.start_date).getDate()}
                                                        </span>
                                                    </div>
                                                </Link>
                                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">
                                                                {item.event_type?.name || 'Event'}
                                                            </span>
                                                        </div>
                                                        <Link href={route('community.events.show', { slug: item.slug })}>
                                                            <h4 className="text-woof-charcoal group-hover:text-woof-gold text-xs leading-snug font-bold transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-woof-charcoal/60 mt-1.5 flex items-center gap-1 text-xs font-medium">
                                                            <MapPin className="h-3.5 w-3.5 text-woof-gold shrink-0" />
                                                            {item.venue_name} • {item.city?.name}
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                                        <span className="text-xs font-medium text-woof-charcoal/50">
                                                            {item.organizer_name}
                                                        </span>
                                                        <SaveButton
                                                            itemId={item.id}
                                                            itemType="event"
                                                            isSaved={true}
                                                            variant="icon"
                                                            className="h-8 w-8 rounded-full bg-rose-50 border-none hover:bg-rose-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-3xl border border-[#e8ded1] bg-white text-center shadow-xs">
                                        <Bookmark className="text-woof-gold/30 mx-auto mb-3 h-10 w-10" />
                                        <p className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">No saved events</p>
                                        <Link href={route('community.events.index')} className="inline-block mt-3 bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors">
                                            Browse Events
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                        <div className="w-14 h-14 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center mx-auto mb-3">
                            <Bookmark className="size-6 text-woof-gold/40" />
                        </div>
                        <p className="text-woof-charcoal text-sm font-bold">No saved listings yet</p>
                        <p className="text-woof-charcoal/60 mt-1 text-xs font-normal max-w-sm mx-auto">
                            Save puppy litters, dogs for adoption, stud profiles, vets, trainers, boarding services, and events to view them here.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Link href={route('marketplace.index')} className="bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors shadow-xs">
                                Browse Marketplace
                            </Link>
                            <Link href={route('directory.index')} className="bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal text-xs font-bold px-5 py-2.5 rounded-full hover:border-woof-gold transition-colors">
                                Search Services
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
