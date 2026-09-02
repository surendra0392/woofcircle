import { Breadcrumbs } from '@/components/breadcrumbs';
import CuratedListingSidebar, { FeaturedAdoption, FeaturedBreeder, FeaturedLitter, FeaturedStud } from '@/components/public/curated-listing-sidebar';
import ResultsToolbar from '@/components/public/results-toolbar';
import SaveButton from '@/components/public/save-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    ChevronDown,
    Filter,
    MapPin,
    RotateCcw,
    Search,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface City {
    id: number;
    name: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date?: string | null;
    start_time?: string | null;
    venue_name: string | null;
    city: { name: string } | null;
    state: { name: string; code: string } | null;
    registrations_count: number;
    event_type: { name: string };
    is_saved?: boolean;
}

interface PageProps {
    events: { data: Event[]; total: number; links: { url: string | null; label: string; active: boolean }[] };
    eventTypes: { id: number; name: string }[];
    states: { id: number; name: string }[];
    featuredBreeders?: FeaturedBreeder[];
    featuredLitters?: FeaturedLitter[];
    featuredStuds?: FeaturedStud[];
    featuredAdoptions?: FeaturedAdoption[];
    filters: { event_type_id?: string; state_id?: string; city_id?: string; search?: string; orderby?: string; view?: 'grid' | 'list' };
    stats?: {
        total_events: number;
        upcoming_events: number;
        total_attendees: number;
    };
}

export default function EventsIndex({
    events,
    eventTypes,
    states,
    featuredBreeders,
    featuredLitters,
    featuredStuds,
    featuredAdoptions,
    filters,
    stats,
}: PageProps) {
    const { settings } = usePage<SharedData>().props;
    const [view, setViewState] = useState<'grid' | 'list'>(filters.view || 'grid');
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    const [filterData, setFilterData] = useState({
        event_type_id: filters.event_type_id || 'all',
        state_id: filters.state_id || 'all',
        city_id: filters.city_id || 'all',
        search: filters.search || '',
        orderby: filters.orderby || 'latest',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (filterData.state_id && filterData.state_id !== 'all') {
            setIsLoadingCities(true);
            fetch(`/api/locations/states/${filterData.state_id}/cities`, {
                headers: { Accept: 'application/json' },
            })
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

    const setView = (mode: 'grid' | 'list') => {
        setViewState(mode);
        router.get(
            route('community.events.index'),
            {
                ...filterData,
                view: mode,
                event_type_id: filterData.event_type_id === 'all' ? '' : filterData.event_type_id,
                state_id: filterData.state_id === 'all' ? '' : filterData.state_id,
                city_id: filterData.city_id === 'all' ? '' : filterData.city_id,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const applyFilters = (newFilters = {}) => {
        const finalFilters = { ...filterData, ...newFilters };
        router.get(
            route('community.events.index'),
            {
                ...finalFilters,
                view: view,
                event_type_id: finalFilters.event_type_id === 'all' ? '' : finalFilters.event_type_id,
                state_id: finalFilters.state_id === 'all' ? '' : finalFilters.state_id,
                city_id: finalFilters.city_id === 'all' ? '' : finalFilters.city_id,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setFilterData({ event_type_id: 'all', state_id: 'all', city_id: 'all', search: '', orderby: 'latest' });
        router.get(
            route('community.events.index'),
            { view: view },
            { preserveState: true, preserveScroll: true, replace: true },
        );
        setIsFilterOpen(false);
    };

    const activeFilterCount = [
        filterData.event_type_id !== 'all',
        filterData.state_id !== 'all',
        filterData.city_id !== 'all',
        Boolean(filterData.search),
    ].filter(Boolean).length;

    return (
        <PublicLayout>
            <Head title={`Dog Shows, Meetups & Canine Events | ${settings.site_name}`} />

            {/* --- CINEMATIC HERO --- */}
            <section className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-14">
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl pointer-events-none select-none">
                    <img
                        src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop"
                        alt="Events Hero Backdrop"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Community Events', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid items-end gap-10 lg:grid-cols-12">
                        <div className="space-y-4 lg:col-span-7">
                            <div className="animate-reveal flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
                                <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                    Community Gatherings & Shows
                                </Badge>
                                <span className="text-woof-charcoal/30">•</span>
                                <span className="text-woof-charcoal/70 text-xs font-semibold tracking-wider uppercase">
                                    India & Nationwide
                                </span>
                            </div>

                            <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                                Canine Events & Meetups
                            </h1>

                            <p className="text-woof-charcoal/80 animate-reveal max-w-xl text-base sm:text-lg leading-relaxed font-normal" style={{ animationDelay: '0.4s' }}>
                                Connect with dog lovers, breeders, and trainers. Discover championship dog shows, breed meetups, training workshops, and adoption drives near you.
                            </p>

                            <div className="animate-reveal flex flex-wrap items-center gap-3 pt-2" style={{ animationDelay: '0.5s' }}>
                                <div className="bg-white border border-[#e8ded1] rounded-2xl px-4 py-2 shadow-2xs flex items-center gap-2.5">
                                    <Calendar className="h-4 w-4 text-woof-gold shrink-0" />
                                    <span className="text-xs font-bold text-woof-charcoal">
                                        {stats?.upcoming_events ?? events.total} Upcoming Shows
                                    </span>
                                </div>
                                <div className="bg-white border border-[#e8ded1] rounded-2xl px-4 py-2 shadow-2xs flex items-center gap-2.5">
                                    <Users className="h-4 w-4 text-woof-gold shrink-0" />
                                    <span className="text-xs font-bold text-woof-charcoal">
                                        {stats?.total_attendees ?? '500+'} Active Attendees
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-stretch justify-end gap-3 lg:col-span-5 lg:items-end">
                            <div className="flex w-full items-center gap-2 rounded-full border border-[#e8ded1] bg-white p-1.5 shadow-xs">
                                <div className="text-woof-charcoal/70 flex flex-1 items-center gap-2.5 pl-3">
                                    <Search className="text-woof-gold h-4 w-4 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search dog shows, meetups, city..."
                                        value={filterData.search || ''}
                                        onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="text-woof-charcoal placeholder:text-woof-charcoal/40 text-xs h-10 w-full border-none bg-transparent px-0 font-medium outline-none focus:ring-0"
                                    />
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={cn(
                                            'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold tracking-wider uppercase transition-all',
                                            isFilterOpen || activeFilterCount > 0
                                                ? 'bg-woof-gold/15 text-woof-gold border border-woof-gold/30'
                                                : 'text-woof-charcoal hover:bg-woof-cream/40',
                                        )}
                                    >
                                        <Filter className="h-3.5 w-3.5" />
                                        <span>Filters</span>
                                        {activeFilterCount > 0 && (
                                            <span className="bg-woof-gold text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', isFilterOpen && 'rotate-180')} />
                                    </button>

                                    <Button
                                        onClick={() => applyFilters()}
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-10 cursor-pointer rounded-full px-5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all"
                                    >
                                        Search
                                    </Button>

                                    {activeFilterCount > 0 && (
                                        <Button
                                            onClick={resetFilters}
                                            variant="ghost"
                                            className="hover:bg-woof-cream/40 text-woof-charcoal flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-0 transition-all shrink-0"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isFilterOpen && (
                        <div className="animate-reveal mt-6 rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-md">
                            <div className="mb-4 flex items-center justify-between border-b border-[#e8ded1] pb-3">
                                <h4 className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                                    Refine Gatherings & Events
                                </h4>
                                <button
                                    onClick={resetFilters}
                                    className="text-woof-gold hover:underline text-xs font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/60">
                                        Event Type / Category
                                    </label>
                                    <Select
                                        value={filterData.event_type_id}
                                        onValueChange={(val) => {
                                            const updated = { ...filterData, event_type_id: val };
                                            setFilterData(updated);
                                            applyFilters(updated);
                                        }}
                                    >
                                        <SelectTrigger className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium focus:ring-1 focus:ring-woof-gold">
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Event Categories</SelectItem>
                                            {eventTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/60">
                                        State / Region
                                    </label>
                                    <Select
                                        value={filterData.state_id}
                                        onValueChange={(val) => {
                                            const updated = { ...filterData, state_id: val, city_id: 'all' };
                                            setFilterData(updated);
                                            applyFilters(updated);
                                        }}
                                    >
                                        <SelectTrigger className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium focus:ring-1 focus:ring-woof-gold">
                                            <SelectValue placeholder="All States" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All States</SelectItem>
                                            {states.map((state) => (
                                                <SelectItem key={state.id} value={state.id.toString()}>
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/60">
                                        City
                                    </label>
                                    <Select
                                        disabled={filterData.state_id === 'all' || isLoadingCities}
                                        value={filterData.city_id}
                                        onValueChange={(val) => {
                                            const updated = { ...filterData, city_id: val };
                                            setFilterData(updated);
                                            applyFilters(updated);
                                        }}
                                    >
                                        <SelectTrigger className="h-11 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium focus:ring-1 focus:ring-woof-gold disabled:opacity-50">
                                            <SelectValue placeholder={isLoadingCities ? 'Loading cities...' : 'All Cities'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Cities</SelectItem>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={city.id.toString()}>
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <ResultsToolbar
                        total={events.total}
                        view={view}
                        onViewChange={setView}
                        orderBy={filterData.orderby}
                        onOrderByChange={(v) => applyFilters({ orderby: v })}
                        sortOptions={[
                            { label: 'Upcoming First', value: 'latest' },
                            { label: 'Most Popular', value: 'popular' },
                        ]}
                    />

                    {view === 'grid' ? (
                        <div>
                            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {events.data.length === 0 ? (
                                    <div className="col-span-full space-y-6 py-24 text-center rounded-3xl border border-dashed border-[#e8ded1] bg-white shadow-xs">
                                        <div className="bg-woof-cream text-woof-gold border border-[#e8ded1] mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xs">
                                            <Calendar className="h-8 w-8 stroke-[1.75]" />
                                        </div>
                                        <div className="space-y-1.5 max-w-md mx-auto">
                                            <h3 className="text-woof-charcoal text-2xl font-bold font-sans">No upcoming events found</h3>
                                            <p className="text-woof-charcoal/70 text-xs sm:text-sm font-normal">
                                                Try adjusting your location filters or search query to find more community gatherings.
                                            </p>
                                        </div>

                                        <Button
                                            onClick={resetFilters}
                                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-8 h-11 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                                        >
                                            Browse All Events
                                        </Button>
                                    </div>
                                ) : (
                                    events.data.map((event) => {
                                        const startDate = new Date(event.start_date);
                                        const day = startDate.getDate();
                                        const month = startDate.toLocaleString('default', { month: 'short' });

                                        return (
                                            <Link
                                                key={event.id}
                                                href={route('community.events.show', { slug: event.slug })}
                                                className="group border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-xl relative flex overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 p-3 flex-col sm:flex-row items-stretch cursor-pointer"
                                            >
                                                <div className="relative overflow-hidden rounded-2xl shrink-0 bg-neutral-100 h-52 sm:h-auto sm:w-48 md:w-52 self-stretch">
                                                    <img
                                                        src={
                                                            event.image_url ||
                                                            'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop'
                                                        }
                                                        alt={event.title}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />

                                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                        <div className="min-w-[48px] rounded-2xl bg-white/95 backdrop-blur-xs p-2 text-center shadow-md border border-[#e8ded1]">
                                                            <span className="text-woof-charcoal block text-xl leading-none font-bold">
                                                                {day}
                                                            </span>
                                                            <span className="text-woof-gold mt-0.5 block text-[9px] font-bold tracking-wider uppercase">
                                                                {month}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="absolute top-3 right-3"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <SaveButton
                                                            itemId={event.id}
                                                            itemType="event"
                                                            isSaved={!!event.is_saved}
                                                            variant="icon"
                                                            className="bg-white/90 backdrop-blur-xs hover:bg-white shadow-sm border border-[#e8ded1]"
                                                        />
                                                    </div>

                                                    <div className="absolute bottom-3 left-3">
                                                        <Badge className="bg-woof-charcoal/90 text-white rounded-full border-none px-3 py-0.5 text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs shadow-sm">
                                                            {event.event_type?.name}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 min-w-0">
                                                    <div className="space-y-2">
                                                        <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-medium truncate h-4">
                                                            <MapPin className="text-woof-gold h-3.5 w-3.5 shrink-0" />
                                                            <span className="truncate">
                                                                {event.city && event.state
                                                                    ? `${event.city.name}, ${event.state.code}`
                                                                    : event.venue_name || 'Virtual / Nationwide'}
                                                            </span>
                                                        </div>

                                                        <h3 className="text-woof-charcoal group-hover:text-woof-gold text-base sm:text-lg leading-snug font-bold font-sans transition-colors line-clamp-2 h-[3rem] flex items-start">
                                                            {event.title}
                                                        </h3>

                                                        <p className="text-woof-charcoal/70 line-clamp-2 text-xs leading-relaxed font-normal h-[2.5rem]">
                                                            {event.description}
                                                        </p>
                                                    </div>

                                                    <div className="border-t border-[#e8ded1] flex items-center justify-between pt-3.5 mt-4">
                                                        <div className="text-woof-charcoal text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 group-hover:text-woof-gold transition-colors">
                                                            <span>View Event</span>
                                                            <ArrowRight className="text-woof-gold h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                                        </div>

                                                        <div className="flex items-center gap-1.5 bg-[#fcfbf9] px-2.5 py-1 rounded-full border border-[#e8ded1]">
                                                            <Users className="text-woof-gold h-3.5 w-3.5" />
                                                            <span className="text-woof-charcoal text-[11px] font-bold">
                                                                {event.registrations_count} Joined
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            {events.links && events.links.length > 3 && (
                                <div className="mt-16 flex justify-center">
                                    <Pagination links={events.links} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main List Column */}
                            <div className="lg:col-span-8 space-y-6">
                                {events.data.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-[#e8ded1] bg-white py-20 text-center shadow-xs">
                                        <p className="text-woof-charcoal/60 text-xs font-medium">
                                            No upcoming events found in list view
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {events.data.map((event) => {
                                            const startDate = new Date(event.start_date);
                                            const day = startDate.getDate();
                                            const month = startDate.toLocaleString('default', { month: 'short' });

                                            return (
                                                <Link
                                                    key={event.id}
                                                    href={route('community.events.show', { slug: event.slug })}
                                                    className="group border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-xl relative flex overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 p-3 flex-col sm:flex-row items-stretch cursor-pointer"
                                                >
                                                    <div className="relative overflow-hidden rounded-2xl shrink-0 bg-neutral-100 h-52 sm:h-auto sm:w-56 md:w-64 self-stretch">
                                                        <img
                                                            src={
                                                                event.image_url ||
                                                                'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop'
                                                            }
                                                            alt={event.title}
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />

                                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                            <div className="min-w-[48px] rounded-2xl bg-white/95 backdrop-blur-xs p-2 text-center shadow-md border border-[#e8ded1]">
                                                                <span className="text-woof-charcoal block text-xl leading-none font-bold">
                                                                    {day}
                                                                </span>
                                                                <span className="text-woof-gold mt-0.5 block text-[9px] font-bold tracking-wider uppercase">
                                                                    {month}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="absolute top-3 right-3"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <SaveButton
                                                                itemId={event.id}
                                                                itemType="event"
                                                                isSaved={!!event.is_saved}
                                                                variant="icon"
                                                                className="bg-white/90 backdrop-blur-xs hover:bg-white shadow-sm border border-[#e8ded1]"
                                                            />
                                                        </div>

                                                        <div className="absolute bottom-3 left-3">
                                                            <Badge className="bg-woof-charcoal/90 text-white rounded-full border-none px-3 py-0.5 text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs shadow-sm">
                                                                {event.event_type?.name}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 min-w-0">
                                                        <div className="space-y-2">
                                                            <div className="text-woof-charcoal/60 flex items-center gap-1.5 text-xs font-medium truncate h-4">
                                                                <MapPin className="text-woof-gold h-3.5 w-3.5 shrink-0" />
                                                                <span className="truncate">
                                                                    {event.city && event.state
                                                                        ? `${event.city.name}, ${event.state.code}`
                                                                        : event.venue_name || 'Virtual / Nationwide'}
                                                                </span>
                                                            </div>

                                                            <h3 className="text-woof-charcoal group-hover:text-woof-gold text-lg sm:text-xl leading-snug font-bold font-sans transition-colors line-clamp-2 h-[3.25rem] flex items-start">
                                                                {event.title}
                                                            </h3>

                                                            <p className="text-woof-charcoal/70 line-clamp-2 text-xs leading-relaxed font-normal h-[2.5rem]">
                                                                {event.description}
                                                            </p>
                                                        </div>

                                                        <div className="border-t border-[#e8ded1] flex items-center justify-between pt-3.5 mt-4">
                                                            <div className="text-woof-charcoal text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 group-hover:text-woof-gold transition-colors">
                                                                <span>View Event</span>
                                                                <ArrowRight className="text-woof-gold h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                                            </div>

                                                            <div className="flex items-center gap-1.5 bg-[#fcfbf9] px-2.5 py-1 rounded-full border border-[#e8ded1]">
                                                                <Users className="text-woof-gold h-3.5 w-3.5" />
                                                                <span className="text-woof-charcoal text-[11px] font-bold">
                                                                    {event.registrations_count} Joined
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Pagination */}
                                {events.links && events.links.length > 3 && (
                                    <div className="pt-8 flex justify-center">
                                        <Pagination links={events.links} />
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar Column */}
                            <div className="lg:col-span-4">
                                <CuratedListingSidebar
                                    currentType="event"
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

            <div className="container-wide px-6 py-16 lg:px-12">
                <div className="bg-woof-charcoal border border-white/10 group relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl p-8 sm:p-12 md:flex-row shadow-xl">
                    <Calendar className="absolute -right-16 -bottom-16 h-72 w-72 -rotate-12 text-white/[0.04] transition-transform duration-1000 group-hover:rotate-0 pointer-events-none" />

                    <div className="relative z-10 space-y-2 text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                            Never Miss a Canine Championship or Meetup
                        </h3>

                        <p className="text-white/70 max-w-xl text-sm font-normal leading-relaxed">
                            Bookmark your favorite dog shows, workshops, and breeding seminars to receive timely notifications and registration reminders.
                        </p>
                    </div>

                    <Button
                        asChild
                        className="bg-white hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal relative z-10 rounded-full px-8 h-12 text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer shrink-0"
                    >
                        <Link href={route('register')}>Join the Community</Link>
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}
