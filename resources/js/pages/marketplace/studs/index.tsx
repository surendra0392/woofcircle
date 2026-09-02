import { Breadcrumbs } from '@/components/breadcrumbs';
import CuratedListingSidebar, { FeaturedAdoption, FeaturedBreeder, FeaturedLitter } from '@/components/public/curated-listing-sidebar';
import ResultsToolbar from '@/components/public/results-toolbar';
import StudCard from '@/components/public/stud-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { Breed, City, PaginatedResponse, SharedData, State, Stud } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, Dog, Info, RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
interface PageProps {
    showingFallback?: boolean;
    studs: PaginatedResponse<Stud>;
    breeds: Breed[];
    states: State[];
    featuredBreeders?: FeaturedBreeder[];
    featuredLitters?: FeaturedLitter[];
    featuredAdoptions?: FeaturedAdoption[];
    filters: {
        breed_id?: string;
        state_id?: string;
        city_id?: string;
        search?: string;
        is_champion?: string | boolean;
        kci_registered?: string | boolean;
        orderby?: string;
        view?: 'grid' | 'list';
    };
}
export default function StudsListing({
    studs,
    breeds,
    states,
    filters,
    showingFallback = false,
    featuredBreeders = [],
    featuredLitters = [],
    featuredAdoptions = [],
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
        breed_id: filters.breed_id || 'all',
        state_id: filters.state_id || 'all',
        city_id: filters.city_id || 'all',
        search: filters.search || '',
        is_champion: filters.is_champion === 'true' || filters.is_champion === true || filters.is_champion === '1',
        kci_registered: filters.kci_registered === 'true' || filters.kci_registered === true || filters.kci_registered === '1',
        orderby: filters.orderby || 'featured',
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
                })
                .catch(() => setIsLoadingCities(false));
        } else {
            setCities([]);
            setFilterData((prev) => ({ ...prev, city_id: 'all' }));
        }
    }, [filterData.state_id]);
    const applyFilters = (newOrderBy?: string) => {
        router.get(
            route('marketplace.studs.index'),
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
    const resetFilters = () => {
        setFilterData({
            breed_id: 'all',
            state_id: 'all',
            city_id: 'all',
            search: '',
            is_champion: false,
            kci_registered: false,
            orderby: 'featured',
            view: view,
        });
        router.get(route('marketplace.studs.index'), { view: view });
    };

    return (
        <PublicLayout>
            <Head title={`Verified Champion Stud Services | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <section className="border-woof-charcoal/5 relative overflow-hidden border-b bg-woof-pearl/5 pt-32 pb-8">
                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Marketplace', href: route('marketplace.index') },
                                { title: 'Stud Services', href: '#' },
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

                                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">
                                        Verified Genetic Excellence
                                    </span>
                                </div>

                                <h1 className="text-4xl leading-16 font-bold tracking-wider text-woof-charcoal uppercase">
                                    Champion <span className="text-woof-gold">Lines.</span>
                                </h1>
                            </div>

                            <p className="text-sm text-woof-charcoal/60 max-w-lg tracking-wider leading-relaxed font-medium">
                                Discover elite stud dogs from India's most prestigious kennels. All services are verified for health, temperament, and
                                pedigree.
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
                                        placeholder="Search breed, stud name or kennel..."
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
                            <div className="grid w-full grid-cols-1 items-end gap-6 md:grid-cols-2 lg:grid-cols-5">
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

                                <div className="space-y-3 pb-1">
                                    <div className="flex flex-col gap-2.5">
                                        <div
                                            className="group flex cursor-pointer items-center space-x-2.5"
                                            onClick={() => setFilterData({ ...filterData, is_champion: !filterData.is_champion })}
                                        >
                                            <Checkbox
                                                id="is_champion"
                                                checked={filterData.is_champion}
                                                onCheckedChange={(checked) => setFilterData({ ...filterData, is_champion: !!checked })}
                                                className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-4 w-4 rounded-md"
                                            />

                                            <div className="cursor-pointer space-y-0.5">
                                                <Label
                                                    htmlFor="is_champion"
                                                    className="text-woof-charcoal group-hover:text-woof-gold cursor-pointer text-xs font-bold transition-colors"
                                                >
                                                    Champion Only
                                                </Label>

                                                <p className="text-woof-charcoal/50 text-[10px] font-normal">
                                                    Show champion lineage
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="group flex cursor-pointer items-center space-x-2.5"
                                            onClick={() => setFilterData({ ...filterData, kci_registered: !filterData.kci_registered })}
                                        >
                                            <Checkbox
                                                id="kci_registered"
                                                checked={filterData.kci_registered}
                                                onCheckedChange={(checked) => setFilterData({ ...filterData, kci_registered: !!checked })}
                                                className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-4 w-4 rounded-md"
                                            />

                                            <div className="cursor-pointer space-y-0.5">
                                                <Label
                                                    htmlFor="kci_registered"
                                                    className="text-woof-charcoal group-hover:text-woof-gold cursor-pointer text-xs font-bold transition-colors"
                                                >
                                                    KCI Registered
                                                </Label>

                                                <p className="text-woof-charcoal/50 text-[10px] font-normal">
                                                    Kennel Club of India certified
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                        total={studs.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={handleOrderByChange}
                    />

                    {studs.data.length === 0 ? (
                        <div className="border-[#e8ded1] bg-[#fcfbf9] space-y-6 rounded-3xl border p-12 sm:p-20 text-center shadow-xs">
                            <div className="bg-woof-cream text-woof-gold mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs">
                                <Dog className="h-10 w-10" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-woof-charcoal font-sans text-2xl font-bold tracking-tight">No Studs Found</h3>

                                <p className="text-woof-charcoal/60 mx-auto max-w-sm text-sm leading-relaxed font-normal">
                                    We couldn't find any stud services matching your selection. Try adjusting your filters.
                                </p>
                            </div>

                            <Button
                                onClick={resetFilters}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-11 cursor-pointer rounded-full px-8 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    ) : view === 'list' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main List Column */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {studs.data.map((stud, idx) => (
                                        <StudCard key={stud.id} stud={stud} view="list" idx={idx} />
                                    ))}
                                </div>

                                {studs.links && studs.links.length > 3 && (
                                    <div className="pt-8">
                                        <Pagination links={studs.links} />
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar Column */}
                            <div className="lg:col-span-4">
                                <CuratedListingSidebar
                                    currentType="studs"
                                    featuredBreeders={featuredBreeders}
                                    featuredLitters={featuredLitters}
                                    featuredAdoptions={featuredAdoptions}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {studs.data.map((stud, idx) => (
                                    <StudCard key={stud.id} stud={stud} view="grid" idx={idx} />
                                ))}
                            </div>

                            {studs.links && studs.links.length > 3 && (
                                <div className="mt-20 flex justify-center">
                                    <Pagination links={studs.links} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
