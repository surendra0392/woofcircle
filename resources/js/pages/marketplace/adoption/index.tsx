import { Breadcrumbs } from '@/components/breadcrumbs';
import AdoptionCard from '@/components/public/adoption-card';
import CuratedListingSidebar, { FeaturedBreeder, FeaturedLitter, FeaturedStud } from '@/components/public/curated-listing-sidebar';
import ResultsToolbar from '@/components/public/results-toolbar';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { AdoptionListing, Breed, City, PaginatedResponse, SharedData, State } from '@/types';
import { router, usePage } from '@inertiajs/react';
import SeoHead from '@/components/SeoHead';
import { ChevronDown, Heart, Info, RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
interface PageProps {
    showingFallback?: boolean;
    listings: PaginatedResponse<AdoptionListing>;
    breeds: Breed[];
    states: State[];
    featuredBreeders?: FeaturedBreeder[];
    featuredLitters?: FeaturedLitter[];
    featuredStuds?: FeaturedStud[];
    filters: {
        breed_id?: string;
        state_id?: string;
        city_id?: string;
        search?: string;
        is_champion?: string | boolean;
        orderby?: string;
        view?: 'grid' | 'list';
    };
}
export default function AdoptionIndex({
    listings,
    breeds,
    states,
    filters,
    showingFallback = false,
    featuredBreeders = [],
    featuredLitters = [],
    featuredStuds = [],
}: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [view, setViewState] = useState<'grid' | 'list'>(filters.view || 'grid');
    const setView = (newView: 'grid' | 'list') => {
        setViewState(newView);
        router.get(route(route().current()!), { ...route().params, view: newView }, { preserveState: true, replace: true });
    };
    const [filterData, setFilterData] = useState({
        breed_id: filters.breed_id?.toString() || 'all',
        state_id: filters.state_id?.toString() || 'all',
        city_id: filters.city_id?.toString() || 'all',
        search: filters.search || '',
        is_champion: filters.is_champion === 'true' || filters.is_champion === true || filters.is_champion === '1',
        orderby: filters.orderby || 'latest',
        view: filters.view || 'grid',
    });
    useEffect(() => {
        if (filterData.state_id && filterData.state_id !== 'all') {
            setIsLoadingCities(true);
            fetch(route('api.cities.by-state', filterData.state_id))
                .then((res) => res.json())
                .then((data) => {
                    setCities(data);
                    setIsLoadingCities(false);
                });
        } else {
            setCities([]);
            setFilterData((prev) => ({ ...prev, city_id: 'all' }));
        }
    }, [filterData.state_id]);
    const applyFilters = (newOrderBy?: string) => {
        router.get(
            route('marketplace.adoption.index'),
            {
                ...filterData,
                breed_id: filterData.breed_id === 'all' ? '' : filterData.breed_id,
                state_id: filterData.state_id === 'all' ? '' : filterData.state_id,
                city_id: filterData.city_id === 'all' ? '' : filterData.city_id,
                orderby: newOrderBy || filterData.orderby,
                view: view,
            },
            { preserveState: true, replace: true },
        );
    };
    const handleOrderByChange = (value: string) => {
        setFilterData((prev) => ({ ...prev, orderby: value }));
        applyFilters(value);
    };
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.45, 0.32, 0.9] as [number, number, number, number],
            },
        },
    };

    const resetFilters = () => {
        setFilterData({ breed_id: 'all', state_id: 'all', city_id: 'all', search: '', is_champion: false, orderby: 'latest', view: view });
        router.get(route('marketplace.adoption.index'), { view: view });
    };

    return (
        <PublicLayout>
            <SeoHead title="Adoption | Woof Circle" /> {/* --- CINEMATIC HERO --- */}
            <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')]" />
            </div>
            <section className="border-woof-charcoal/5 relative overflow-hidden border-b bg-woof-pearl/5 pt-32 pb-8">
                <div
                    className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                />

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div
                        className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-24 hidden opacity-[0.02] select-none lg:block"
                    >
                        <h2 className="text-[20rem] leading-none font-black tracking-tighter">ADOPT</h2>
                    </div>

                    <div
                    >
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Marketplace', href: route('marketplace.index') },
                                { title: 'Adoption', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid items-end gap-16 lg:grid-cols-2">
                        <div
                            className="space-y-0"
                        >
                            <div className="space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />
                                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">The Gift of Sanctuary</span>
                                </div>

                                <h1 className="text-4xl leading-16 font-bold tracking-wider text-woof-charcoal uppercase">
                                    Forever <span className="text-woof-gold">Friends.</span>
                                </h1>
                            </div>

                            <p className="text-sm text-woof-charcoal/60 max-w-lg tracking-wider leading-relaxed font-medium">
                                Connect with shelter dogs and private rehoming listings across India. Every life deserves a premium second chance.
                            </p>
                        </div>

                        <div
                            className="flex w-full flex-col items-center justify-end gap-4 pb-2 sm:flex-row"
                        >
                            <div className="border-[#e8ded1] focus-within:border-woof-gold/60 focus-within:shadow-md bg-white rounded-3xl sm:rounded-full p-2 pl-6 flex w-full items-center gap-4 border shadow-xs transition-all duration-300 sm:w-[620px]">
                                <div className="text-woof-charcoal/70 flex flex-1 items-center gap-3">
                                    <Search className="text-woof-gold size-4 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search by breed, shelter, or city..."
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
            {/* --- CINEMATIC FILTER DRAWER --- */}
            {isFilterOpen && (
                <section className="bg-woof-cream/30 py-6 border-b border-[#e8ded1]">
                    <div className="container-wide px-6 lg:px-12">
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-md">
                            <div className="grid w-full grid-cols-1 items-end gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="group space-y-2">
                                    <label className="text-woof-charcoal/80 ml-1 block text-xs font-bold uppercase tracking-wider">
                                        Breed Selection
                                    </label>
                                    <Select value={filterData.breed_id} onValueChange={(v) => setFilterData({ ...filterData, breed_id: v })}>
                                        <SelectTrigger className="border-[#e8ded1] rounded-2xl bg-[#fcfbf9] text-xs font-medium">
                                            <SelectValue placeholder="All Breeds" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white p-1.5 shadow-xl">
                                            <SelectItem value="all" className="rounded-xl py-2 text-xs font-medium">
                                                All Breeds
                                            </SelectItem>
                                            {breeds.map((breed) => (
                                                <SelectItem key={breed.id} value={breed.id.toString()} className="rounded-xl py-2 text-xs font-medium">
                                                    {breed.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="group space-y-2">
                                    <label className="text-woof-charcoal/80 ml-1 block text-xs font-bold uppercase tracking-wider">
                                        Region / State
                                    </label>

                                    <Select
                                        value={filterData.state_id}
                                        onValueChange={(v) => setFilterData({ ...filterData, state_id: v, city_id: 'all' })}
                                    >
                                        <SelectTrigger className="border-[#e8ded1] rounded-2xl bg-[#fcfbf9] text-xs font-medium">
                                            <SelectValue placeholder="All States" />
                                        </SelectTrigger>

                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white p-1.5 shadow-xl">
                                            <SelectItem value="all" className="rounded-xl py-2 text-xs font-medium">
                                                All Regions
                                            </SelectItem>

                                            {states.map((state) => (
                                                <SelectItem key={state.id} value={state.id.toString()} className="rounded-xl py-2 text-xs font-medium">
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="group space-y-2">
                                    <label className="text-woof-charcoal/80 ml-1 block text-xs font-bold uppercase tracking-wider">
                                        City / Area
                                    </label>

                                    <Select
                                        value={filterData.city_id}
                                        onValueChange={(v) => setFilterData({ ...filterData, city_id: v })}
                                        disabled={filterData.state_id === 'all' || isLoadingCities}
                                    >
                                        <SelectTrigger className="border-[#e8ded1] rounded-2xl bg-[#fcfbf9] text-xs font-medium disabled:opacity-40">
                                            <SelectValue placeholder={isLoadingCities ? 'Loading Cities...' : 'All Cities'} />
                                        </SelectTrigger>

                                        <SelectContent className="border-[#e8ded1] rounded-2xl bg-white p-1.5 shadow-xl">
                                            <SelectItem value="all" className="rounded-xl py-2 text-xs font-medium">
                                                All Cities
                                            </SelectItem>

                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={city.id.toString()} className="rounded-xl py-2 text-xs font-medium">
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex h-11 items-end">
                                    <Button
                                        onClick={() => applyFilters()}
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 w-full rounded-full text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                                    >
                                        Update Results
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* --- LISTING CONTENT --- */}
            <section className="bg-white py-16">
                <div className="container-wide px-6 lg:px-12">
                    {showingFallback && (
                        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-2xs">
                            <div className="flex items-center gap-3">
                                <Info className="h-5 w-5 text-amber-600" />
                                <p className="text-sm font-medium text-amber-800">
                                    No listings found within 25km of your location. Showing results from across India.
                                </p>
                            </div>
                        </div>
                    )}
                    <ResultsToolbar
                        total={listings.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={handleOrderByChange}
                    />

                    {listings.data.length === 0 ? (
                        <div className="border-[#e8ded1] bg-[#fcfbf9] space-y-6 rounded-3xl border p-12 sm:p-20 text-center shadow-xs">
                            <div className="bg-woof-cream text-woof-gold mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs">
                                <Heart className="h-10 w-10" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-woof-charcoal font-sans text-2xl font-bold tracking-tight">No Dogs Found</h3>
                                <p className="text-woof-charcoal/60 mx-auto max-w-sm text-sm leading-relaxed font-normal">
                                    Every dog has a story, but none matched your search today. Try refining your filters or exploring all regions.
                                </p>
                            </div>

                            <Button
                                onClick={resetFilters}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 cursor-pointer rounded-full px-8 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all"
                            >
                                Reset Search
                            </Button>
                        </div>
                    ) : view === 'list' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main List Column */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {listings.data.map((listing, idx) => (
                                        <AdoptionCard key={listing.id} listing={listing} view="list" idx={idx} />
                                    ))}
                                </div>

                                {listings.links && listings.links.length > 3 && (
                                    <div className="pt-8">
                                        <Pagination links={listings.links} />
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar Column */}
                            <div className="lg:col-span-4">
                                <CuratedListingSidebar
                                    currentType="adoption"
                                    featuredBreeders={featuredBreeders}
                                    featuredLitters={featuredLitters}
                                    featuredStuds={featuredStuds}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {listings.data.map((listing, idx) => (
                                    <div key={listing.id} className="group/card relative">
                                        <div className="bg-woof-gold/5 pointer-events-none absolute -inset-4 rounded-none opacity-0 transition-opacity duration-700 group-hover/card:opacity-100" />
                                        <AdoptionCard listing={listing} view="grid" idx={idx} />
                                    </div>
                                ))}
                            </div>

                            {listings.links && listings.links.length > 3 && (
                                <div className="mt-24 flex justify-center">
                                    <Pagination links={listings.links} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
