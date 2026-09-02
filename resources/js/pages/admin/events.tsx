import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import {
    Calendar,
    CalendarDays,
    CheckCircle2,
    Clock,
    Download,
    Pencil,
    Image as ImageIcon,
    Plus,
    Trash2,
    Users,
    X,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface EventType {
    id: number;
    name: string;
    slug: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    event_type_id: number;
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    state_id: number;
    city_id: number;
    venue_name: string;
    address: string;
    organizer_name: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    banner_image: string | null;
    is_featured: boolean;
    is_active: boolean;
    state: State;
    city: City;
    eventType: EventType;
    gallery: { id: number; url: string }[];
}

interface PageProps {
    events: {
        data: Event[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    eventTypes: EventType[];
    states: State[];
    cities: City[];
    filters: { is_active?: string; is_featured?: string; event_type_id?: string; state_id?: string; city_id?: string };
}

export default function Events({ events, eventTypes = [], states = [], cities = [], filters }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(events?.data || events, 'events');

    const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
    const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
    const [activeEventForAttendees, setActiveEventForAttendees] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<any[]>([]);
    const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);

    /* Filters state */
    const [filterActive, setFilterActive] = useState<string>(filters.is_active || 'all');
    const [filterFeatured, setFilterFeatured] = useState<string>(filters.is_featured || 'all');
    const [filterType, setFilterType] = useState<string>(filters.event_type_id || 'all');
    const [filterState, setFilterState] = useState<string>(filters.state_id || 'all');
    const [filterCity, setFilterCity] = useState<string>(filters.city_id || 'all');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters: Record<string, string> = {
            is_active: filterActive === 'all' ? '' : filterActive,
            is_featured: filterFeatured === 'all' ? '' : filterFeatured,
            event_type_id: filterType === 'all' ? '' : filterType,
            state_id: filterState === 'all' ? '' : filterState,
            city_id: filterCity === 'all' ? '' : filterCity,
        };

        if (key === 'state_id') {
            newFilters.state_id = value === 'all' ? '' : value;
            newFilters.city_id = '';
            setFilterState(value);
            setFilterCity('all');
        } else if (key === 'city_id') {
            newFilters.city_id = value === 'all' ? '' : value;
            setFilterCity(value);
        } else if (key === 'event_type_id') {
            newFilters.event_type_id = value === 'all' ? '' : value;
            setFilterType(value);
        } else if (key === 'is_active') {
            newFilters.is_active = value === 'all' ? '' : value;
            setFilterActive(value);
        } else if (key === 'is_featured') {
            newFilters.is_featured = value === 'all' ? '' : value;
            setFilterFeatured(value);
        }

        // Clean empty filters
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) delete newFilters[k as keyof typeof newFilters];
        });

        router.get(route('admin.events.index'), newFilters, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteEvent) {
            router.delete(route('admin.events.destroy', deleteEvent.id), {
                onSuccess: () => {
                    toast.success('Event deleted successfully.');
                    setDeleteEvent(null);
                }
            });
        }
    };

    const fetchAttendees = async (event: Event) => {
        setIsLoadingAttendees(true);
        setActiveEventForAttendees(event);
        setIsAttendeesModalOpen(true);
        try {
            const response = await fetch(`/admin/events/${event.id}/registrations`);
            const data = await response.json();
            setAttendees(data);
        } catch (error) {
            console.error('Failed to fetch attendees', error);
            setAttendees([]);
        } finally {
            setIsLoadingAttendees(false);
        }
    };

    const downloadCsv = () => {
        if (!attendees.length) return;
        const headers = ['Name', 'Email', 'Registration Date'];
        const csvRows = [headers.join(',')];
        attendees.forEach((reg) => {
            const date = new Date(reg.created_at).toLocaleDateString('en-US');
            const row = [`"${reg.user?.name || ''}"`, `"${reg.user?.email || ''}"`, `"${date}"`];
            csvRows.push(row.join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `event_attendees_${activeEventForAttendees?.id || 'export'}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const filteredFilterCities = cities.filter(c => c.state_id.toString() === filterState);

    const getTypeDisplay = (eventType: EventType) => {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-0.5 text-[10px] font-bold text-woof-charcoal uppercase">
                {eventType.name}
            </span>
        );
    };

    return (
        <AdminLayout title="Events">
            <Head title="Events - Admin" />
            <div className="mx-auto max-w-full space-y-6">

                {/* Page header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Events Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Manage community dog shows, canine meetups, training seminars, and adoption drives
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button 
                                onClick={() => bulkDelete()} 
                                disabled={isProcessing} 
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs"
                            >
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Link 
                            href={route('admin.events.create')}
                            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filterType}
                        onChange={(e) => handleFilterChange('event_type_id', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Types</option>
                        {eventTypes.map((t) => (
                            <option key={t.id} value={t.id.toString()}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterState}
                        onChange={(e) => handleFilterChange('state_id', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All States</option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id.toString()}>
                                {state.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterCity}
                        onChange={(e) => handleFilterChange('city_id', e.target.value)}
                        disabled={filterState === 'all'}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50"
                    >
                        <option value="all">All Cities</option>
                        {filteredFilterCities.map((city) => (
                            <option key={city.id} value={city.id.toString()}>
                                {city.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterActive}
                        onChange={(e) => handleFilterChange('is_active', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Statuses</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    {(filterType !== 'all' || filterState !== 'all' || filterCity !== 'all' || filterActive !== 'all') && (
                        <Button
                            onClick={() => {
                                setFilterActive('all');
                                setFilterFeatured('all');
                                setFilterType('all');
                                setFilterState('all');
                                setFilterCity('all');
                                router.get(route('admin.events.index'));
                            }}
                            variant="ghost"
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                        </Button>
                    )}
                </div>

                {/* Content Table */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox 
                                            checked={isAllSelected} 
                                            onCheckedChange={toggleAll} 
                                            ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }}
                                        />
                                    </th>
                                    <th className="px-6 py-4">Event Details</th>
                                    <th className="px-6 py-4">Schedule & Timing</th>
                                    <th className="px-6 py-4">Venue & City</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Attendees</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {events.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <CalendarDays className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No events found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    events.data.map((event) => (
                                        <tr key={event.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox 
                                                    checked={selectedIds.includes(event.id)} 
                                                    onCheckedChange={() => toggleItem(event.id)} 
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e8ded1] bg-[#fcfbf9] shadow-2xs overflow-hidden">
                                                        {event.banner_image ? (
                                                            <img src={event.banner_image} alt={event.title} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="h-4 w-4 text-woof-charcoal/40" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-woof-charcoal">
                                                            {event.title}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            {event.eventType && getTypeDisplay(event.eventType)}
                                                            {event.is_featured && (
                                                                <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.2 text-[9px] font-bold text-amber-800">
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 font-medium text-woof-charcoal">
                                                        <Calendar className="h-3.5 w-3.5 text-woof-gold" />
                                                        {new Date(event.start_date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                        {event.end_date &&
                                                            ` - ${new Date(event.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                                                    </div>
                                                    {event.start_time && (
                                                        <div className="flex items-center gap-1.5 text-[11px] text-woof-charcoal/50">
                                                            <Clock className="h-3 w-3" />
                                                            {event.start_time.substring(0, 5)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-woof-charcoal">
                                                        {event.venue_name}
                                                    </span>
                                                    <span className="text-[11px] text-woof-charcoal/50">
                                                        {event.city?.name}, {event.state?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => router.patch(route('admin.events.toggle-active', event.id), {}, { preserveScroll: true })}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                                        event.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {event.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {event.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 font-bold text-woof-charcoal">
                                                    <Users className="h-3.5 w-3.5 text-woof-gold" />
                                                    {(event as any).registrations_count || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => fetchAttendees(event)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="View Attendees"
                                                    >
                                                        <Users className="h-3.5 w-3.5" />
                                                    </button>
                                                    <Link 
                                                        href={route('admin.events.edit', event.id)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="Edit Event"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteEvent(event)}
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {events.data.length > 0 && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={events.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <Dialog open={!!deleteEvent} onOpenChange={(open) => !open && setDeleteEvent(null)}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-rose-600">Delete Event</DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/70">
                            Are you sure you want to delete <span className="font-bold text-woof-charcoal">{deleteEvent?.title}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteEvent(null)}
                            className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Attendees Modal */}
            <Dialog open={isAttendeesModalOpen} onOpenChange={setIsAttendeesModalOpen}>
                <DialogContent className="max-w-2xl rounded-3xl border border-[#e8ded1] bg-white p-0 shadow-2xl overflow-hidden">
                    <div className="flex flex-row items-center justify-between border-b border-[#e8ded1] bg-[#fcfbf9] p-6">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-woof-charcoal">
                            <Users className="h-5 w-5 text-woof-gold" /> Attendees: {activeEventForAttendees?.title}
                        </DialogTitle>
                        {attendees.length > 0 && (
                            <Button
                                onClick={downloadCsv}
                                variant="outline"
                                size="sm"
                                className="h-9 gap-1.5 rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-white cursor-pointer"
                            >
                                <Download className="h-3.5 w-3.5" /> Download CSV
                            </Button>
                        )}
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto p-6 bg-white">
                        {isLoadingAttendees ? (
                            <div className="py-8 text-center text-woof-charcoal/50 font-medium text-xs">Loading attendees...</div>
                        ) : attendees.length === 0 ? (
                            <div className="py-8 text-center text-woof-charcoal/50 font-medium text-xs">No registered attendees yet.</div>
                        ) : (
                            <div className="divide-y divide-[#f0e8dc] rounded-2xl border border-[#e8ded1] overflow-hidden">
                                {attendees.map((registration) => (
                                    <div key={registration.id} className="flex items-center justify-between p-4 hover:bg-[#fcfbf9] transition-colors">
                                        <div>
                                            <div className="font-bold text-woof-charcoal text-xs">{registration.user?.name}</div>
                                            <div className="text-[11px] text-woof-charcoal/50">{registration.user?.email}</div>
                                        </div>
                                        <div className="text-right text-[11px] text-woof-charcoal/50">
                                            Registered: {new Date(registration.created_at).toLocaleDateString('en-IN', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
