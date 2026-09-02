import { Breadcrumbs } from '@/components/breadcrumbs';
import BreedCard from '@/components/public/breed-card';
import ResultsToolbar from '@/components/public/results-toolbar';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRightLeft, BookOpen, ChevronDown, RotateCcw, Scale, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import DisplayAdBanner from '@/components/public/display-ad-banner';
interface BreedListItem {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    is_indian: boolean;
    size: string | null;
    breed_group: string | null;
    description: string | null;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
    view: string | null;
}
interface PageProps {
    breeds: { data: BreedListItem[]; links: PaginationLink[]; total: number };
    breedGroups: string[];
    filters: { breed_group?: string; size?: string; is_indian?: string; search?: string; orderby?: string; view?: 'grid' | 'list' };
}
export default function BreedsIndex({ breeds, breedGroups, filters }: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterData, setFilterData] = useState({
        breed_group: filters.breed_group || 'all',
        size: filters.size || 'all',
        is_indian: filters.is_indian === '1',
        search: filters.search || '',
        orderby: filters.orderby || 'a-z',
        view: filters.view || 'grid',
    });
    const [view, setViewState] = useState<'grid' | 'list'>(filters.view || 'grid');
    const setView = (newView: 'grid' | 'list') => {
        setViewState(newView);
        router.get(
            route('breeds.index'),
            {
                ...filterData,
                breed_group: filterData.breed_group === 'all' ? '' : filterData.breed_group,
                size: filterData.size === 'all' ? '' : filterData.size,
                is_indian: filterData.is_indian ? '1' : undefined,
                view: newView,
            },
            { preserveState: true, replace: true },
        );
    };
    const applyFilters = () => {
        router.get(
            route('breeds.index'),
            {
                breed_group: filterData.breed_group === 'all' ? '' : filterData.breed_group,
                size: filterData.size === 'all' ? '' : filterData.size,
                is_indian: filterData.is_indian ? '1' : undefined,
                search: filterData.search || '',
                orderby: filterData.orderby,
                view: view,
            },
            { preserveState: true, replace: true },
        );
    };
    const resetFilters = () => {
        setFilterData({ breed_group: 'all', size: 'all', is_indian: false, search: '', orderby: 'a-z', view: view });
        router.get(route('breeds.index'), { view: view });
    };
    const handleOrderByChange = (value: string) => {
        setFilterData((prev) => ({ ...prev, orderby: value }));
        router.get(
            route('breeds.index'),
            {
                ...filterData,
                orderby: value,
                breed_group: filterData.breed_group === 'all' ? '' : filterData.breed_group,
                size: filterData.size === 'all' ? '' : filterData.size,
                is_indian: filterData.is_indian ? '1' : undefined,
            },
            { preserveState: true, replace: true },
        );
    };
    return (
        <PublicLayout>
            <Head title={`Dog Breed Information & Guides | ${settings.site_name}`} />

            {/* --- CINEMATIC CLEAN HERO --- */}
            <section className="border-woof-charcoal/5 relative overflow-hidden border-b bg-woof-pearl/5 pt-32 pb-8">
                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Breed Library', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid items-end gap-16 lg:grid-cols-2">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">Registry Knowledge Base</span>
                                </div>
                                <h1 className="text-4xl leading-14 font-bold tracking-wider text-woof-charcoal uppercase">
                                    Dog Breed <span className="text-woof-gold">Guides.</span>
                                </h1>
                            </div>
                            <p className="text-sm text-woof-charcoal/60 max-w-lg tracking-wide leading-relaxed font-medium">
                                Explore our comprehensive encyclopedia of certified dog breeds and indigenous Indian lineages. Find detailed information on temperament, health, exercise, and care.
                            </p>

                            <div className="pt-1">
                                <Link
                                    href={route('breeds.compare')}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#e8ded1] bg-white hover:border-woof-gold hover:bg-woof-gold hover:text-woof-charcoal px-4 text-xs font-bold uppercase tracking-wider text-woof-charcoal shadow-2xs transition-all cursor-pointer"
                                >
                                    <ArrowRightLeft className="text-woof-gold h-3.5 w-3.5" />
                                    <span>Compare Breeds Side-by-Side</span>
                                </Link>
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-center justify-end gap-4 pb-2 sm:flex-row">
                            <div className="border-[#e8ded1] focus-within:border-woof-gold/60 focus-within:shadow-md bg-white rounded-3xl sm:rounded-full p-2 pl-6 flex w-full items-center gap-4 border shadow-xs transition-all duration-300 sm:w-[620px]">
                                <div className="text-woof-charcoal/70 flex flex-1 items-center gap-3">
                                    <Search className="text-woof-gold size-4 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search breed name, temperament..."
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
                                        <span>Filters</span>
                                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-woof-gold' : ''}`} />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={applyFilters}
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

            {/* --- CINEMATIC COLLAPSIBLE FILTER DRAWER --- */}
            {isFilterOpen && (
                <section className="bg-woof-cream/30 py-6 border-b border-[#e8ded1]">
                    <div className="container-wide px-6 lg:px-12">
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs">
                            <div className="grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-end">
                                <div className="space-y-1.5">
                                    <label className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                                        Breed Group
                                    </label>
                                    <Select value={filterData.breed_group} onValueChange={(v) => setFilterData({ ...filterData, breed_group: v })}>
                                        <SelectTrigger className="hover:border-woof-gold h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 font-medium text-xs text-gray-900 transition-colors focus:ring-0">
                                            <SelectValue placeholder="All Groups" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] shadow-xl rounded-2xl bg-white p-2">
                                            <SelectItem value="all" className="focus:bg-woof-cream rounded-xl py-2.5 text-xs font-medium cursor-pointer">
                                                All Groups
                                            </SelectItem>
                                            {breedGroups.filter(Boolean).map((group) => (
                                                <SelectItem key={group} value={group} className="focus:bg-woof-cream rounded-xl py-2.5 text-xs font-medium cursor-pointer">
                                                    {group}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                                        Breed Size
                                    </label>
                                    <Select value={filterData.size} onValueChange={(v) => setFilterData({ ...filterData, size: v })}>
                                        <SelectTrigger className="hover:border-woof-gold h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 font-medium text-xs text-gray-900 transition-colors focus:ring-0">
                                            <SelectValue placeholder="All Sizes" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] shadow-xl rounded-2xl bg-white p-2">
                                            <SelectItem value="all" className="focus:bg-woof-cream rounded-xl py-2.5 text-xs font-medium cursor-pointer">
                                                All Sizes
                                            </SelectItem>
                                            {['Small', 'Medium', 'Large', 'Giant'].map((s) => (
                                                <SelectItem key={s} value={s} className="focus:bg-woof-cream rounded-xl py-2.5 text-xs font-medium cursor-pointer">
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setFilterData({ ...filterData, is_indian: !filterData.is_indian })}
                                        className={`flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-xs font-bold tracking-wider uppercase transition-all ${
                                            filterData.is_indian
                                                ? 'bg-woof-gold border-woof-gold text-white shadow-xs'
                                                : 'border-[#e8ded1] text-woof-charcoal hover:border-woof-gold bg-[#fcfbf9]'
                                        }`}
                                    >
                                        <span>🇮🇳 Indian Breeds Only</span>
                                    </button>
                                </div>

                                <div>
                                    <Button
                                        onClick={applyFilters}
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 w-full cursor-pointer rounded-full text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all"
                                    >
                                        Update Results
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <section className="bg-white py-16">
                <div className="container-wide px-6 lg:px-12">
                    <DisplayAdBanner slot="header_leaderboard" className="mb-8" />
                    <ResultsToolbar
                        total={breeds.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={handleOrderByChange}
                        sortOptions={[
                            { label: 'A-Z (Name)', value: 'a-z' },
                            { label: 'Z-A (Name)', value: 'z-a' },
                            { label: 'Newest Added', value: 'newest' },
                        ]}
                    />

                    <div
                        className={cn(
                            'grid gap-8',
                            view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2',
                        )}
                    >
                        {breeds.data.length === 0 ? (
                            <div className="bg-[#fcfbf9] border-[#e8ded1] col-span-full space-y-6 rounded-3xl border border-dashed py-24 text-center">
                                <div className="text-woof-gold border border-[#e8ded1] mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-2xs">
                                    <BookOpen className="h-8 w-8" />
                                </div>

                                <h3 className="text-woof-charcoal text-2xl font-bold">No Breeds Found</h3>

                                <Button
                                    onClick={resetFilters}
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 rounded-full px-8 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            breeds.data.map((breed, idx) => (
                                <BreedCard key={breed.id} breed={breed} view={view} idx={idx} />
                            ))
                        )}
                    </div>

                    <div className="mt-16">
                        <Pagination links={breeds.links} />
                    </div>
                </div>
            </section>

            {/* Floating Compare Button */}
            <div className="fixed bottom-22 sm:bottom-24 right-6 sm:right-8 z-40">
                <Link
                    href={route('breeds.compare')}
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white flex items-center gap-2 px-5 py-3 shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 text-xs font-bold tracking-wider uppercase rounded-full group cursor-pointer"
                >
                    <Scale className="h-4 w-4 text-woof-gold group-hover:text-woof-charcoal transition-colors" />
                    <span>Compare Breeds</span>
                </Link>
            </div>
        </PublicLayout>
    );
}
