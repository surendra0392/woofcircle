import ArticleCard from '@/components/articles/ArticleCard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import CuratedListingSidebar, { FeaturedAdoption, FeaturedBreeder, FeaturedLitter, FeaturedStud } from '@/components/public/curated-listing-sidebar';
import ResultsToolbar from '@/components/public/results-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, ChevronDown, Clock, RotateCcw, Search, User } from 'lucide-react';
import { useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    summary?: string;
    excerpt?: string | null;
    image_url: string | null;
    read_time: string | null;
    author_name: string | null;
    category: { name: string };
}

interface PageProps {
    articles: { data: Article[]; total: number; links: { url: string | null; label: string; active: boolean }[] };
    categories: { id: number; name: string }[];
    featuredBreeders?: FeaturedBreeder[];
    featuredLitters?: FeaturedLitter[];
    featuredStuds?: FeaturedStud[];
    featuredAdoptions?: FeaturedAdoption[];
    filters: { category_id?: string; search?: string; orderby?: string; view?: 'grid' | 'list' };
}

export default function ArticlesIndex({
    articles,
    categories,
    featuredBreeders,
    featuredLitters,
    featuredStuds,
    featuredAdoptions,
    filters,
}: PageProps) {
    const { settings } = usePage<SharedData>().props;
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
            route('community.articles.index'),
            { ...filterData, view: mode, category_id: filterData.category_id === 'all' ? '' : filterData.category_id },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const applyFilters = (newFilters = {}) => {
        const finalFilters = { ...filterData, ...newFilters };
        router.get(
            route('community.articles.index'),
            { ...finalFilters, view: view, category_id: finalFilters.category_id === 'all' ? '' : finalFilters.category_id },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setFilterData({ category_id: 'all', search: '', orderby: 'latest' });
        router.get(
            route('community.articles.index'),
            { view: view },
            { preserveState: true, preserveScroll: true, replace: true },
        );
        setIsFilterOpen(false);
    };
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as [number, number, number, number] },
    };
    return (
        <PublicLayout>
            <Head title={`Dog Care, Training & Health Articles | ${settings.site_name} Blog`} /> {/* --- CINEMATIC HERO --- */}
            <section className="border-b border-[#e8ded1] bg-[#fcfbf9] pt-32 pb-12">
                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Knowledge Hub', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid items-end gap-12 lg:grid-cols-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Canine Expertise</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-woof-charcoal">
                                    Knowledge Hub
                                </h1>
                            </div>

                            <p className="text-sm text-woof-charcoal/70 max-w-lg leading-relaxed font-normal">
                                Discover expert-vetted guides on puppy care, behavior training, nutrition, and breed-specific health advice from India's leading canine experts.
                            </p>
                        </div>

                        <div className="flex w-full flex-col items-center justify-end gap-4 pb-2 sm:flex-row">
                            <div className="flex w-full items-center gap-3 rounded-full border border-[#e8ded1] bg-white px-4 py-1.5 shadow-2xs sm:w-[500px]">
                                <div className="text-woof-charcoal/70 flex flex-1 items-center gap-3">
                                    <Search className="text-woof-gold h-4 w-4 shrink-0" />

                                    <input
                                        type="text"
                                        placeholder="Search guides, tips..."
                                        value={filterData.search || ''}
                                        onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="text-woof-charcoal placeholder:text-woof-charcoal/40 text-xs h-10 w-full border-none bg-transparent px-0 font-medium outline-none focus:ring-0"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="text-woof-charcoal hover:text-woof-gold flex shrink-0 cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-woof-cream/40 text-xs font-bold tracking-wider uppercase transition-colors"
                                    >
                                        <span>Categories</span>
                                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <Button
                                        onClick={() => applyFilters()}
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-9 cursor-pointer rounded-full px-4 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all"
                                    >
                                        Search
                                    </Button>

                                    <Button
                                        onClick={resetFilters}
                                        variant="ghost"
                                        className="hover:bg-woof-cream/40 text-woof-charcoal flex h-9 w-9 cursor-pointer items-center justify-center rounded-full p-0 transition-all"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* --- FILTER DRAWER --- */}

                    {isFilterOpen && (
                        <div className="mt-8 rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs">
                            <div className="space-y-3">
                                <h4 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Filter by Category</h4>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setFilterData((prev) => ({ ...prev, category_id: 'all' }));
                                            applyFilters({ category_id: 'all' });
                                        }}
                                        className={cn(
                                            'rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer',
                                            filterData.category_id === 'all'
                                                ? 'bg-woof-charcoal border-woof-charcoal text-white'
                                                : 'text-woof-charcoal border-[#e8ded1] hover:border-woof-gold hover:text-woof-gold bg-white',
                                        )}
                                    >
                                        All Categories
                                    </button>

                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                const val = cat.id.toString();
                                                setFilterData((prev) => ({ ...prev, category_id: val }));
                                                applyFilters({ category_id: val });
                                            }}
                                            className={cn(
                                                'rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer',
                                                filterData.category_id === cat.id.toString()
                                                    ? 'bg-woof-charcoal border-woof-charcoal text-white'
                                                    : 'text-woof-charcoal border-[#e8ded1] hover:border-woof-gold hover:text-woof-gold bg-white',
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <div className="bg-white py-16">
                <div className="container-wide px-6 lg:px-12">
                    <ResultsToolbar
                        total={articles.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={(v) => applyFilters({ orderby: v })}
                        sortOptions={[
                            { label: 'Latest Articles', value: 'latest' },
                            { label: 'Popular Insights', value: 'popular' },
                            { label: 'Featured Knowledge', value: 'featured' },
                        ]}
                    />

                    {view === 'grid' ? (
                        <div>
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.data.length === 0 ? (
                                    <div className="col-span-full space-y-6 py-24 text-center rounded-3xl border border-dashed border-[#e8ded1] bg-[#fcfbf9]">
                                        <div className="bg-white border border-[#e8ded1] text-woof-gold mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xs">
                                            <BookOpen className="h-8 w-8" />
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-woof-charcoal text-2xl font-bold">No insights found</h3>
                                            <p className="text-woof-charcoal/70 text-sm">Try adjusting your filters or search terms.</p>
                                        </div>

                                        <Button
                                            onClick={resetFilters}
                                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 rounded-full px-8 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                                        >
                                            Browse All Knowledge
                                        </Button>
                                    </div>
                                ) : (
                                    articles.data.map((article) => (
                                        <div key={article.id} className="h-full">
                                            <ArticleCard
                                                view={view}
                                                article={{
                                                    title: article.title,
                                                    excerpt: article.excerpt || article.summary || '',
                                                    category: article.category?.name || 'Knowledge',
                                                    readTime: `${article.read_time || '5 min'} Read`,
                                                    author: article.author_name || `${settings.site_name} Experts`,
                                                    image: article.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop',
                                                    href: route('community.articles.show', { slug: article.slug }),
                                                }}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {articles.links && articles.links.length > 3 && (
                                <div className="mt-16 flex justify-center">
                                    <Pagination links={articles.links} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main List Column */}
                            <div className="lg:col-span-8 space-y-6">
                                {articles.data.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-[#e8ded1] bg-[#fcfbf9] py-20 text-center">
                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            No insights found in list view
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {articles.data.map((article) => (
                                            <ArticleCard
                                                key={article.id}
                                                view={view}
                                                article={{
                                                    title: article.title,
                                                    excerpt: article.excerpt || article.summary || '',
                                                    category: article.category?.name || 'Knowledge',
                                                    readTime: `${article.read_time || '5 min'} Read`,
                                                    author: article.author_name || `${settings.site_name} Experts`,
                                                    image: article.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop',
                                                    href: route('community.articles.show', { slug: article.slug }),
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {articles.links && articles.links.length > 3 && (
                                    <div className="pt-8 flex justify-center">
                                        <Pagination links={articles.links} />
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar Column */}
                            <div className="lg:col-span-4">
                                <CuratedListingSidebar
                                    currentType="article"
                                    featuredBreeders={featuredBreeders}
                                    featuredLitters={featuredLitters}
                                    featuredStuds={featuredStuds}
                                    featuredAdoptions={featuredAdoptions}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
