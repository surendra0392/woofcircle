import { Breadcrumbs } from '@/components/breadcrumbs';
import LitterCard from '@/components/public/litter-card';
import ResultsToolbar from '@/components/public/results-toolbar';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { Breed, City, Litter, PaginatedResponse, SharedData, State } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, Dog, RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
interface PageProps {
    litters: PaginatedResponse<Litter>;
    breeds: Breed[];
    states: State[];
    filters: {
        breed_id?: string;
        state_id?: string;
        city_id?: string;
        search?: string;
        kci_registered?: string | boolean;
        is_champion?: string | boolean;
        orderby?: string;
        view?: 'grid' | 'list';
    };
}
export default function LittersListing({ litters, breeds, states, filters }: PageProps) {
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
        breed_id: filters?.breed_id || 'all',
        state_id: filters?.state_id || 'all',
        city_id: filters?.city_id || 'all',
        search: filters?.search || '',
        kci_registered: filters?.kci_registered === 'true' || filters?.kci_registered === true || filters?.kci_registered === '1',
        is_champion: filters?.is_champion === 'true' || filters?.is_champion === true || filters?.is_champion === '1',
        orderby: filters?.orderby || 'latest',
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
            route('marketplace.litters.index'),
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
        setFilterData({ breed_id: 'all', state_id: 'all', city_id: 'all', search: '', kci_registered: false, is_champion: false, orderby: 'latest' });
        router.get(route('marketplace.litters.index'), { view: view });
    };
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as [number, number, number, number] },
    };
    return (
        <PublicLayout>
            <Head title={`Elite Verified Litters | ${settings.site_name} Marketplace`} /> {/* --- CINEMATIC HERO --- */}
            <section className="border-woof-charcoal/5 relative overflow-hidden border-b bg-woof-pearl/5 pt-32 pb-8">
                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Marketplace', href: route('marketplace.index') },
                                { title: 'Elite Litters', href: '#' },
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
                                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">Registry Excellence</span>
                                </div>

                                <h1 className="text-4xl leading-16 font-bold tracking-wider text-woof-charcoal uppercase">
                                    Elite <span className="text-woof-gold">Litters.</span>
                                </h1>
                            </div>

                            <p className="text-sm text-woof-charcoal/60 max-w-lg tracking-wider leading-relaxed font-medium">
                                Discover health-verified litters from India's most prestigious ethical breeders. Every litter is clinically
                                documented.
                            </p>
                        </div>

                        <div
                            className="flex w-full flex-col items-center justify-end gap-6 pb-4 sm:flex-row"
                        >
                            <div className="border-woof-charcoal/20 focus-within:border-woof-charcoal group flex w-full items-center gap-6 border-b pb-1 transition-all duration-500 sm:w-[600px]">
                                <div className="text-woof-charcoal/70 flex flex-1 items-center gap-4">
                                    <Search className="text-woof-gold/50 group-focus-within:text-woof-gold h-5 w-5 transition-colors" />

                                    <input
                                        type="text"
                                        placeholder="Search breed, breeder or location..."
                                        value={filterData.search}
                                        onChange={(e) => setFilterData({ ...filterData, search: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="text-woof-charcoal placeholder:text-woof-charcoal/40 text-md h-12 w-full border-none bg-transparent px-0 font-sans font-medium outline-none focus:ring-0"
                                    />
                                </div>

                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="text-woof-charcoal hover:text-woof-gold group/btn flex shrink-0 cursor-pointer items-center gap-2 transition-colors"
                                    >
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">Filters</span>

                                        <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={() => applyFilters()}
                                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-white h-10 cursor-pointer rounded-none px-4 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-2xl transition-all"
                                        >
                                            Explore
                                        </Button>

                                        <Button
                                            onClick={resetFilters}
                                            variant="ghost"
                                            className="bg-woof-charcoal group hover:bg-woof-gold hover:text-woof-white flex h-10 w-10 cursor-pointer items-center justify-center rounded-none p-0 text-white transition-all"
                                        >
                                            <RotateCcw className="h-5 w-5 transition-transform duration-700 group-hover:rotate-[-180deg]" />
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
                    <section
                        className="border-woof-charcoal/5 relative overflow-hidden border-b bg-white"
                    >
                        <div className="container-wide px-6 py-12 lg:px-12">
                            <div className="grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                                <div className="group space-y-4">
                                    <label className="text-woof-charcoal/50 group-hover:text-woof-gold ml-1 block text-[11px] font-black tracking-[0.2em] uppercase transition-colors">
                                        Breed Selection
                                    </label>

                                    <Select value={filterData.breed_id} onValueChange={(v) => setFilterData({ ...filterData, breed_id: v })}>
                                        <SelectTrigger className="hover:border-woof-gold h-14 rounded-none border-t-0 border-r-0 border-b border-l-0 border-gray-100 bg-transparent px-0 font-sans text-lg font-light text-gray-900 transition-colors focus:ring-0">
                                            <SelectValue placeholder="All Breeds" />
                                        </SelectTrigger>

                                        <SelectContent className="border-woof-charcoal/5 shadow-premium rounded-none bg-white p-2">
                                            <SelectItem
                                                value="all"
                                                className="focus:bg-woof-pearl rounded-none py-4 text-[9px] font-black tracking-[0.2em] uppercase"
                                            >
                                                All Breeds
                                            </SelectItem>

                                            {breeds.map((breed) => (
                                                <SelectItem
                                                    key={breed.id}
                                                    value={breed.id.toString()}
                                                    className="focus:bg-woof-pearl rounded-none py-4 text-[9px] font-black tracking-[0.2em] uppercase"
                                                >
                                                    {breed.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="group space-y-4">
                                    <label className="text-woof-charcoal/50 group-hover:text-woof-gold ml-1 block text-[11px] font-black tracking-[0.2em] uppercase transition-colors">
                                        Region / State
                                    </label>

                                    <Select
                                        value={filterData.state_id}
                                        onValueChange={(v) => setFilterData({ ...filterData, state_id: v, city_id: 'all' })}
                                    >
                                        <SelectTrigger className="hover:border-woof-gold h-14 rounded-none border-t-0 border-r-0 border-b border-l-0 border-gray-100 bg-transparent px-0 font-sans text-lg font-light text-gray-900 transition-colors focus:ring-0">
                                            <SelectValue placeholder="All States" />
                                        </SelectTrigger>

                                        <SelectContent className="border-woof-charcoal/5 shadow-premium rounded-none bg-white p-2">
                                            <SelectItem
                                                value="all"
                                                className="focus:bg-woof-pearl rounded-none py-4 text-[9px] font-black tracking-[0.2em] uppercase"
                                            >
                                                All Regions
                                            </SelectItem>

                                            {states.map((state) => (
                                                <SelectItem
                                                    key={state.id}
                                                    value={state.id.toString()}
                                                    className="focus:bg-woof-pearl rounded-none py-4 text-[9px] font-black tracking-[0.2em] uppercase"
                                                >
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="group space-y-4">
                                    <label className="text-woof-charcoal/50 group-hover:text-woof-gold ml-1 block text-[11px] font-black tracking-[0.2em] uppercase transition-colors">
                                        City / Area
                                    </label>

                                    <Select
                                        value={filterData.city_id}
                                        onValueChange={(v) => setFilterData({ ...filterData, city_id: v })}
                                        disabled={filterData.state_id === 'all' || isLoadingCities}
                                    >
                                        <SelectTrigger className="hover:border-woof-gold h-14 rounded-none border-t-0 border-r-0 border-b border-l-0 border-gray-100 bg-transparent px-0 font-sans text-lg font-light text-gray-900 transition-colors focus:ring-0 disabled:opacity-30">
                                            <SelectValue placeholder={isLoadingCities ? 'Loading Cities...' : 'All Cities'} />
                                        </SelectTrigger>

                                        <SelectContent className="border-woof-charcoal/5 shadow-premium rounded-none bg-white p-2">
                                            <SelectItem
                                                value="all"
                                                className="focus:bg-woof-pearl rounded-none py-4 text-[9px] font-black tracking-[0.2em] uppercase"
                                            >
                                                All Cities
                                            </SelectItem>

                                            {cities.map((city) => (
                                                <SelectItem
                                                    key={city.id}
                                                    value={city.id.toString()}
                                                    className="focus:bg-woof-pearl rounded-none py-4 text-[9px] font-black tracking-[0.2em] uppercase"
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex h-14 items-end gap-3 pt-4 md:pt-0">
                                    <Button
                                        onClick={() => applyFilters()}
                                        className="bg-woof-charcoal h-full flex-1 rounded-none text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:bg-black"
                                    >
                                        Refresh Registry
                                    </Button>

                                    <Button
                                        onClick={resetFilters}
                                        variant="ghost"
                                        className="bg-woof-charcoal group flex h-full w-14 cursor-pointer items-center justify-center rounded-none p-0 text-white transition-all hover:bg-black"
                                    >
                                        <RotateCcw className="h-5 w-5 transition-transform duration-700 group-hover:rotate-[-180deg]" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            {/* --- LISTING CONTENT --- */}
            <section className="bg-white py-32">
                <div className="container-wide px-6 lg:px-12">
                    <ResultsToolbar
                        total={litters.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={handleOrderByChange}
                    />

                    <div
                        className={cn(
                            'grid gap-12 lg:gap-16',
                            view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-1',
                        )}
                    >
                        {litters.data.length === 0 ? (
                            <div
                                className="bg-woof-pearl border-woof-charcoal/10 col-span-full space-y-12 rounded-none border border-dashed py-48 text-center"
                            >
                                <div className="text-woof-charcoal/50 border-woof-charcoal/5 mx-auto flex h-32 w-32 rotate-3 items-center justify-center rounded-none border bg-white shadow-xl transition-transform duration-700 hover:rotate-0">
                                    <Dog className="text-woof-gold h-12 w-12" />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-woof-charcoal text-5xl leading-none font-black tracking-tight uppercase">
                                        No Litters Found.
                                    </h3>

                                    <p className="text-woof-charcoal/50 mx-auto max-w-sm font-sans text-lg leading-relaxed opacity-70">
                                        We couldn't find any litters matching your selection. Try adjusting your filters.
                                    </p>
                                </div>

                                <Button
                                    onClick={resetFilters}
                                    className="bg-woof-charcoal h-16 rounded-none px-16 text-[10px] font-black tracking-[0.3em] text-white uppercase shadow-2xl transition-all hover:bg-black"
                                >
                                    Reset Discovery
                                </Button>
                            </div>
                        ) : (
                            litters.data.map((litter, idx) => (
                                <div key={litter.id} {...fadeInUp}>
                                    <LitterCard litter={litter} view={view} />
                                </div>
                            ))
                        )}
                    </div>
                    {/* Pagination */}

                    {litters.links && litters.links.length > 3 && (
                        <div className="mt-32 flex justify-center">
                            <Pagination links={litters.links} />
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
