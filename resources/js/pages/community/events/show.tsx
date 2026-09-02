import { Breadcrumbs } from '@/components/breadcrumbs';
import SaveButton from '@/components/public/save-button';
import ShareDialog from '@/components/public/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Compass,
    Eye,
    Globe,
    Info,
    Mail,
    MapPin,
    Navigation,
    Phone,
    Share2,
    ShieldCheck,
    Sparkles,
    Ticket,
    User,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Event {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    venue_name: string | null;
    address: string | null;
    organizer_name: string;
    contact_phone?: string | null;
    contact_email?: string | null;
    city: { name: string } | null;
    state: { name: string; code: string } | null;
    registrations_count: number;
    event_type: { name: string };
    gallery: { id: number; image_url: string }[];
    is_saved?: boolean;
}

interface PageProps {
    event: Event;
    isRegistered: boolean;
}

export default function EventShow({ event, isRegistered }: PageProps) {
    const { auth, settings } = usePage<SharedData>().props;
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const isEventEnded = () => {
        const endDateStr = event.end_date || event.start_date;
        const endDateTime = new Date(endDateStr);
        endDateTime.setHours(23, 59, 59, 999);
        return new Date() > endDateTime;
    };

    const handleRegister = () => {
        if (!auth.user) {
            toast.error('Please sign in to register for this event.');
            router.get(route('login'));
            return;
        }

        setIsRegistering(true);
        router.post(
            route('community.events.register', event.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('You have successfully registered for the event!'),
                onError: () => toast.error('Failed to register. Please try again.'),
                onFinish: () => setIsRegistering(false),
            },
        );
    };

    const startDate = new Date(event.start_date);
    const hasEndDate = event.end_date && event.end_date !== event.start_date;
    const endDate = hasEndDate ? new Date(event.end_date!) : null;

    const formattedDateRange = hasEndDate
        ? `${startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} – ${endDate?.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : startDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <PublicLayout>
            <Head title={`${event.title} | Dog & Pet Community Events | ${settings.site_name}`} />

            {/* --- CINEMATIC HERO --- */}
            <section className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl pointer-events-none select-none">
                    <img
                        src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop"
                        alt="Event Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Community Events', href: route('community.events.index') },
                                { title: event.title, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-4xl space-y-4">
                            <div className="animate-reveal flex flex-wrap items-center gap-3" style={{ animationDelay: '0.2s' }}>
                                <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                    {event.event_type?.name || 'Community Event'}
                                </Badge>
                                <span className="text-woof-charcoal/30">•</span>
                                <span className="text-woof-charcoal/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                                    <Users className="h-3.5 w-3.5 text-woof-gold" /> {event.registrations_count} Attendees Joined
                                </span>
                                {isRegistered && (
                                    <Badge className="bg-emerald-600 text-white rounded-full border-none px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                                        <Check className="h-3 w-3 mr-1" /> You're Attending
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                                {event.title}
                            </h1>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 text-xs font-semibold text-woof-charcoal/70 pt-2" style={{ animationDelay: '0.4s' }}>
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-woof-gold h-4 w-4 shrink-0" />
                                    <span>{formattedDateRange}</span>
                                </div>

                                {event.start_time && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-woof-gold h-4 w-4 shrink-0" />
                                        <span>{event.start_time}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <MapPin className="text-woof-gold h-4 w-4 shrink-0" />
                                    <span>
                                        {event.city && event.state
                                            ? `${event.city.name}, ${event.state.code}`
                                            : event.venue_name || 'Virtual / Nationwide'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Top Action Pills */}
                        <div className="animate-reveal flex items-center gap-3 shrink-0 [animation-delay:500ms]">
                            <button
                                onClick={() => setIsShareDialogOpen(true)}
                                className="h-11 px-5 rounded-full border border-[#e8ded1] bg-white hover:bg-woof-cream/40 text-woof-charcoal text-xs font-bold tracking-wider uppercase shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                            >
                                <Share2 className="h-4 w-4 text-woof-gold" />
                                <span>Share</span>
                            </button>

                            <SaveButton
                                itemId={event.id}
                                itemType="event"
                                isSaved={!!(event as unknown as { is_saved?: boolean }).is_saved}
                                variant="button"
                                theme="light"
                                className="h-11 rounded-full text-xs font-bold tracking-wider uppercase px-5 shadow-2xs"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MAIN EVENT DETAIL WORKSPACE --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
                        
                        {/* LEFT COLUMN: Main Event Details */}
                        <div className="space-y-10 lg:col-span-8">
                            
                            {/* Hero Banner Image Card */}
                            <div className="group relative aspect-video overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2.5 shadow-md">
                                <img
                                    src={
                                        event.image_url ||
                                        'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop'
                                    }
                                    alt={event.title}
                                    className="h-full w-full rounded-2xl object-cover transition-all duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* About the Event Description */}
                            <div className="space-y-4 rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-10 shadow-xs">
                                <div className="flex items-center gap-2.5 border-b border-[#e8ded1] pb-4">
                                    <Info className="text-woof-gold h-5 w-5" />
                                    <h3 className="text-woof-charcoal text-xl font-bold font-sans">
                                        About This Gathering
                                    </h3>
                                </div>

                                <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-woof-charcoal/85 whitespace-pre-wrap font-normal">
                                    {event.description}
                                </div>
                            </div>

                            {/* Event Logistics & Key Highlights Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shadow-2xs">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/50">Location</h4>
                                            <p className="text-sm font-bold font-sans text-woof-charcoal">{event.venue_name || 'Venue to be confirmed'}</p>
                                        </div>
                                    </div>
                                    {event.address && (
                                        <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal pl-13">
                                            {event.address}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 shadow-xs space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shadow-2xs">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/50">Schedule</h4>
                                            <p className="text-sm font-bold font-sans text-woof-charcoal">{formattedDateRange}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal pl-13">
                                        {event.start_time ? `Starts promptly at ${event.start_time}` : 'Full schedule announced at venue'}
                                    </p>
                                </div>
                            </div>

                            {/* Event Gallery */}
                            {event.gallery?.length > 0 && (
                                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-10 shadow-xs space-y-6">
                                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                                        <h3 className="text-woof-charcoal text-xl font-bold font-sans">
                                            Event Photos & Highlights
                                        </h3>
                                        <span className="text-xs font-semibold text-woof-charcoal/60">
                                            {event.gallery.length} Images
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {event.gallery.map((img) => (
                                            <div
                                                key={img.id}
                                                className="group aspect-square overflow-hidden rounded-2xl border border-[#e8ded1] bg-neutral-100 p-1 shadow-2xs"
                                            >
                                                <img 
                                                    src={img.image_url} 
                                                    alt="Event Gallery" 
                                                    className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: Sticky Registration & Organizer Card */}
                        <div className="space-y-8 lg:col-span-4 lg:sticky lg:top-28">

                            {/* Registration Box */}
                            <div className="bg-woof-charcoal text-white rounded-3xl border border-white/10 p-8 shadow-xl relative overflow-hidden group space-y-6">
                                <Ticket className="absolute -right-8 -bottom-8 h-40 w-40 rotate-12 text-white/[0.04] transition-transform duration-1000 group-hover:rotate-45 pointer-events-none" />

                                <div className="relative z-10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-woof-gold text-woof-charcoal rounded-full border-none px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                            {isEventEnded() ? 'Past Event' : 'Open RSVP'}
                                        </Badge>
                                        <span className="text-xs font-semibold text-white/70">
                                            {event.registrations_count} Attendees
                                        </span>
                                    </div>

                                    <h4 className="text-2xl font-bold font-sans text-white">
                                        Reserve Your Pass
                                    </h4>

                                    <p className="text-xs text-white/70 leading-relaxed font-normal">
                                        Join fellow dog enthusiasts and breeders. Confirm your attendance to receive venue updates and entry badges.
                                    </p>
                                </div>

                                <div className="relative z-10 space-y-3 pt-2 border-t border-white/10">
                                    {isRegistered ? (
                                        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold tracking-wider uppercase shadow-xs">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Attendance Confirmed
                                        </div>
                                    ) : isEventEnded() ? (
                                        <div className="bg-white/10 border border-white/15 text-white/60 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-medium text-center px-4">
                                            <Info className="h-4 w-4 shrink-0" />
                                            This event has concluded
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleRegister}
                                            disabled={isRegistering}
                                            className="bg-white hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-12 w-full cursor-pointer rounded-full text-xs font-bold tracking-wider uppercase shadow-xl transition-all"
                                        >
                                            {isRegistering ? 'Confirming...' : 'Register Attendance (Free)'}
                                        </Button>
                                    )}

                                    <div className="flex items-center justify-center pt-2">
                                        <span className="text-[11px] text-white/50 flex items-center gap-1.5">
                                            <ShieldCheck className="h-3.5 w-3.5 text-woof-gold" /> Official WoofCircle Verified Gathering
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Organizer Details Card */}
                            <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                                <div className="flex items-center gap-3.5 border-b border-[#e8ded1] pb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                                        {event.organizer_name ? event.organizer_name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold font-sans text-woof-charcoal">
                                            {event.organizer_name || 'Community Organizer'}
                                        </h4>
                                        <p className="text-woof-gold text-[10px] font-bold uppercase tracking-wider">
                                            Event Organizer
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs text-woof-charcoal/70">
                                    {event.contact_phone && (
                                        <div className="flex items-center gap-2.5">
                                            <Phone className="h-4 w-4 text-woof-gold shrink-0" />
                                            <a href={`tel:${event.contact_phone}`} className="hover:text-woof-gold transition-colors font-medium">
                                                {event.contact_phone}
                                            </a>
                                        </div>
                                    )}
                                    {event.contact_email && (
                                        <div className="flex items-center gap-2.5">
                                            <Mail className="h-4 w-4 text-woof-gold shrink-0" />
                                            <a href={`mailto:${event.contact_email}`} className="hover:text-woof-gold transition-colors font-medium">
                                                {event.contact_email}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-[#e8ded1]">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full rounded-full border-[#e8ded1] hover:bg-woof-cream/40 text-woof-charcoal text-xs font-bold tracking-wider uppercase h-10 cursor-pointer"
                                    >
                                        <Link href={route('community.events.index')}>
                                            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> All Events
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <ShareDialog
                isOpen={isShareDialogOpen}
                setIsOpen={setIsShareDialogOpen}
                title={event.title}
            />
        </PublicLayout>
    );
}
