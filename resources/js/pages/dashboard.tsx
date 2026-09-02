import { useState } from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import SaveButton from '@/components/public/save-button';
import {
    type Activity as ActivityType,
    type AdoptionListing,
    type Article,
    type BreadcrumbItem,
    type Event,
    type Litter,
    type Pet,
    type UpcomingEvent,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    Calendar,
    ChevronRight,
    Crown,
    Dog,
    Download,
    GraduationCap,
    Heart,
    History,
    Home,
    Image,
    Layers,
    Plus,
    Share2,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    Stethoscope,
    Syringe,
    MapPin,
    Bookmark,
    Award,
    Store,
    BookOpen,
    ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { PetHealthAnalytics } from '@/components/dashboard/pet-health-analytics';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface Props {
    roles: string[];
    stats: {
        pet_owner?: { total_pets: number; upcoming_appointments: number; pending_vaccinations: number };
        breeder?: {
            total_litters: number;
            active_litters: number;

            total_adoptions?: number;
            active_adoptions?: number;
            pending_adoptions?: number;
        };
        stud?: { total_studs: number; active_studs: number };
        vet?: { has_profile: boolean; status: string };
        trainer?: { has_profile: boolean; status: string };
        boarding?: { has_profile: boolean; status: string };
        welfare?: { has_profile: boolean; status: string; total_adoptions?: number; active_adoptions?: number; pending_adoptions?: number };
        'pet-shop'?: { has_profile: boolean; status: string };
    };
    analytics?: {
        health_score: number;
        vaccination_timeline: { month: string; count: number }[];
        overdue_count: number;
    };
    badges?: { id: number; name: string; description: string; icon_path: string; pivot: { earned_at: string } }[];
    recent_activity?: ActivityType[];
    upcoming_events?: UpcomingEvent[];
    recent_pets?: Pet[];
    recent_litters?: Litter[];
    recent_adoptions?: AdoptionListing[];
    recent_articles?: Article[];
    upcoming_events_global?: Event[];
    gallery_stats?: {
        total_likes: number;
        total_shares: number;
        total_exports: number;
        user_likes: number;
    };
    saved_listings?: {
        puppies: any[];
        adoptions: any[];
        studs: any[];
        directory: any[];
        articles: any[];
        galleries: any[];
        events: any[];
    };
    saved_counts?: {
        puppies: number;
        adoptions: number;
        studs: number;
        directory: number;
        articles: number;
        galleries: number;
        events: number;
    };
    profile_views?: { date: string; views: number }[];
    listing_usage?: {
        tier_name: string;
        max_listings: number;
        current_listings: number;
    };
    membership?: {
        tier_id: number;
        tier_name: string;
        is_subscribed: boolean;
        is_connoisseur: boolean;
        is_elite: boolean;
        pet_usage: { count: number; max: number; is_unlimited: boolean };
        listing_usage: { current_listings: number; max_listings: number; is_unlimited: boolean };
    };
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Dashboard', href: '/dashboard' },
];
export default function Dashboard({
    roles,
    stats,
    analytics,
    badges = [],
    recent_pets = [],
    recent_litters = [],
    recent_adoptions = [],
    recent_activity = [],
    upcoming_events = [],
    recent_articles = [],
    upcoming_events_global = [],
    gallery_stats = { total_likes: 0, total_shares: 0, total_exports: 0, user_likes: 0 },
    saved_listings = { puppies: [], adoptions: [], studs: [], directory: [], articles: [], galleries: [], events: [] },
    saved_counts = { puppies: 0, adoptions: 0, studs: 0, directory: 0, articles: 0, galleries: 0, events: 0 },
    profile_views = [],
    listing_usage,
    membership,
}: Props) {
    const isPetOwner = roles.includes('user');
    const isBreeder = roles.includes('breeder');
    const isStudProvider = roles.includes('stud-service-provider');
    const isVet = roles.includes('vet');
    const isTrainer = roles.includes('trainer');
    const isBoarding = roles.includes('boarding');
    const isWelfare = roles.includes('welfare');
    const isPetShop = roles.includes('pet-shop');
    const hasProfessionalRole = isVet || isTrainer || isBoarding || isWelfare || isStudProvider || isPetShop;
    const hasAnyRoleToApply = !isBreeder || !isVet || !isTrainer || !isBoarding || !isWelfare;
    const hasReachedLimit = listing_usage ? (listing_usage.max_listings !== -1 && listing_usage.current_listings >= listing_usage.max_listings) : false;
    const [activeSavedTab, setActiveSavedTab] = useState<'puppies' | 'adoptions' | 'studs' | 'directory' | 'articles' | 'galleries' | 'events'>('puppies');

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

    const totalSavedCount = Object.values(saved_counts || {}).reduce((sum, count) => sum + Number(count), 0);
    const getRoleStatusColor = (status?: string) => {
        switch (status) {
            case 'Approved':
            case 'Active':
                return 'bg-woof-gold/10 text-woof-gold border-woof-gold/20';
            case 'Pending Approval':
                return 'bg-woof-champagne/15 text-woof-champagne border-woof-champagne/20';
            case 'Inactive':
                return 'bg-rose-50 text-rose-500 border-rose-200';
            default:
                return 'bg-woof-cream text-woof-charcoal/50 border-woof-charcoal/5';
        }
    };
    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Welcome Back."
            subtitle="Manage your pets, business, and services all in one place."
            actions={
                <>
                    <Link
                        href="/settings/subscription"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-woof-gold/40 bg-woof-gold/10 hover:bg-woof-gold hover:text-white transition-all text-woof-gold text-[10px] font-black tracking-wider uppercase shadow-2xs"
                    >
                        <Crown className="h-3.5 w-3.5" />
                        <span>{membership?.tier_name ? `${membership.tier_name} Tier` : 'Membership & Plans'}</span>
                    </Link>
                    {isPetOwner && (
                        <Link
                            href="/dashboard/pets"
                            className="bg-woof-charcoal shadow-sm hover:bg-woof-gold flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all"
                        >
                            <Plus className="h-4 w-4" /> Add New Pet
                        </Link>
                    )}
                    {isBreeder && (
                        hasReachedLimit ? (
                            <button
                                disabled
                                className="bg-slate-300 flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all cursor-not-allowed opacity-75"
                                title="Listing limit reached. Please upgrade your tier."
                            >
                                <Plus className="h-4 w-4" /> Add New Litter
                            </button>
                        ) : (
                            <Link
                                href="/dashboard/breeder/litters/create"
                                className="bg-woof-charcoal shadow-sm hover:bg-woof-gold flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all"
                            >
                                <Plus className="h-4 w-4" /> Add New Litter
                            </Link>
                        )
                    )}
                    {isStudProvider && (
                        hasReachedLimit ? (
                            <button
                                disabled
                                className="bg-slate-300 flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all cursor-not-allowed opacity-75"
                                title="Listing limit reached. Please upgrade your tier."
                            >
                                <Plus className="h-4 w-4" /> List Stud
                            </button>
                        ) : (
                            <Link
                                href="/dashboard/stud-services/create"
                                className="bg-woof-charcoal shadow-sm hover:bg-woof-gold flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all"
                            >
                                <Plus className="h-4 w-4" /> List Stud
                            </Link>
                        )
                    )}
                    {(isWelfare || isBreeder) && (
                        hasReachedLimit ? (
                            <button
                                disabled
                                className="bg-slate-300 flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all cursor-not-allowed opacity-75"
                                title="Listing limit reached. Please upgrade your tier."
                            >
                                <Plus className="h-4 w-4" /> List for Adoption
                            </button>
                        ) : (
                            <Link
                                href="/dashboard/adoptions/create"
                                className="bg-woof-gold shadow-sm hover:bg-woof-charcoal flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all"
                            >
                                <Plus className="h-4 w-4" /> List for Adoption
                            </Link>
                        )
                    )}
                </>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Listing Usage Widget */}
                {(isBreeder || isWelfare || isStudProvider) && listing_usage && (
                    <div className="border-[#e8ded1] bg-white relative space-y-4 rounded-3xl border p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-woof-charcoal text-base font-bold tracking-tight uppercase">Listing Usage</h3>
                                <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">
                                    Current Tier: <span className="text-woof-gold">{listing_usage.tier_name}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-woof-charcoal">{listing_usage.current_listings}</span>
                                <span className="text-woof-charcoal/40 text-xs font-bold"> / {listing_usage.max_listings === -1 ? '∞' : listing_usage.max_listings}</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-woof-gold transition-all duration-500 rounded-full" 
                                style={{ width: listing_usage.max_listings === -1 ? '100%' : `${Math.min(100, (listing_usage.current_listings / listing_usage.max_listings) * 100)}%` }}
                            />
                        </div>
                        {listing_usage.max_listings !== -1 && listing_usage.current_listings >= listing_usage.max_listings && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                                You have reached your listing limit. Please upgrade your tier.
                            </p>
                        )}
                    </div>
                )}
                {/* Pet Owner Section */}

                {isPetOwner && (
                    <div className="border-[#e8ded1] bg-white relative space-y-6 rounded-3xl border p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="bg-woof-gold/15 text-woof-gold flex h-11 w-11 items-center justify-center rounded-2xl border border-woof-gold/20">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-woof-charcoal text-lg font-black tracking-tight uppercase lg:text-xl">Pet Care Hub</h2>
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">
                                        Manage your family members
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/pets"
                                className="border-[#e8ded1] text-woof-charcoal hover:bg-woof-gold hover:text-white hover:border-woof-gold border bg-woof-cream/40 px-4 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all shadow-xs"
                            >
                                Manage All
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <StatsCard
                                title="Your Pets"
                                value={stats.pet_owner?.total_pets || 0}
                                icon={Dog}
                                color="blue"
                                description="Total registered pets"
                            />

                            <StatsCard
                                title="Appointments"
                                value={stats.pet_owner?.upcoming_appointments || 0}
                                icon={Calendar}
                                color="indigo"
                                description="Upcoming vet visits"
                            />

                            <StatsCard
                                title="Vaccinations"
                                value={stats.pet_owner?.pending_vaccinations || 0}
                                icon={Syringe}
                                color="gold"
                                description="Due or upcoming"
                            />
                        </div>

                        {analytics && <PetHealthAnalytics data={analytics} />}
                        
                        {/* Pet Owner Grid: Pets, Upcoming, Activity */}

                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* My Pets List */}

                            <div className="border-[#e8ded1] rounded-2xl border bg-[#fcfbf9] p-5 shadow-xs lg:col-span-1">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase">My Pets</h3>

                                    <Link
                                        href="/dashboard/pets"
                                        className="text-woof-gold text-[10px] font-bold tracking-wider uppercase hover:underline"
                                    >
                                        View All
                                    </Link>
                                </div>

                                {recent_pets.length > 0 ? (
                                    <div className="space-y-3">
                                        {recent_pets.map((pet) => (
                                            <div
                                                key={pet.id}
                                                className="hover:bg-white bg-white/70 border border-[#e8ded1]/60 group flex items-center gap-3 rounded-xl p-2.5 transition-all shadow-2xs"
                                            >
                                                <div className="bg-woof-charcoal/5 h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                                                    {pet.profile_image_url ? (
                                                        <img src={pet.profile_image_url} alt={pet.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="text-woof-charcoal/50 flex h-full w-full items-center justify-center">
                                                            <Dog className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-woof-charcoal truncate text-xs font-bold">{pet.name}</p>

                                                    <p className="text-woof-charcoal/50 text-[10px] font-medium tracking-tight uppercase flex items-center gap-2">
                                                        <span>{pet.breed?.name}</span>
                                                        {(pet as any).badges && (pet as any).badges.length > 0 && (
                                                            <span className="flex items-center gap-1 border-l border-woof-charcoal/10 pl-2">
                                                                {(pet as any).badges.map((b: any, i: number) => (
                                                                    <span key={i} title={b.name} className={`w-2 h-2 rounded-full ${b.color.replace('text-', 'bg-')} shadow-xs`}></span>
                                                                ))}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={route('pets.index')}
                                                    className="bg-woof-cream text-woof-charcoal/60 rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Dog className="text-woof-charcoal/40 mx-auto mb-2 h-8 w-8" />
                                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase">No pets added</p>
                                    </div>
                                )}
                            </div>
                            {/* Upcoming Schedule */}

                            <div className="border-[#e8ded1] rounded-2xl border bg-[#fcfbf9] p-5 shadow-xs lg:col-span-1">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase">Upcoming Schedule</h3>
                                    <Calendar className="h-4 w-4 text-woof-gold" />
                                </div>
 
                                {upcoming_events.length > 0 ? (
                                    <div className="space-y-3">
                                        {upcoming_events.map((event, idx) => (
                                            <div
                                                key={`${event.type}-${event.id}-${idx}`}
                                                className="bg-white/70 border border-[#e8ded1]/60 flex items-start gap-3 rounded-xl p-3 shadow-2xs"
                                            >
                                                <div
                                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${event.type === 'appointment' ? 'bg-woof-champagne/15 text-woof-champagne' : 'bg-woof-gold/15 text-woof-gold'}`}
                                                >
                                                    {event.type === 'appointment' ? (
                                                        <Calendar className="h-4 w-4" />
                                                    ) : (
                                                        <Syringe className="h-4 w-4" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-woof-charcoal/50 mb-0.5 text-[9px] font-bold tracking-wide uppercase">
                                                        {event.pet_name}
                                                    </p>
                                                    <p className="text-woof-charcoal truncate text-xs font-bold">{event.title}</p>

                                                    <p className="text-woof-gold mt-0.5 text-[9px] font-bold uppercase">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Calendar className="text-woof-charcoal/40 mx-auto mb-2 h-8 w-8" />
                                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase">Schedule clear</p>
                                    </div>
                                )}
                            </div>
                            {/* Recent Activity */}

                            <div className="border-[#e8ded1] rounded-2xl border bg-[#fcfbf9] p-5 shadow-xs lg:col-span-1">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase">Recent Activity</h3>
                                    <History className="text-woof-gold h-4 w-4" />
                                </div>

                                {recent_activity.length > 0 ? (
                                    <div className="space-y-3">
                                        {recent_activity.map((activity, idx) => (
                                            <div
                                                key={`${activity.type}-${activity.id}-${idx}`}
                                                className="bg-white/70 border border-[#e8ded1]/60 flex items-start gap-3 rounded-xl p-3 shadow-2xs"
                                            >
                                                <div
                                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.type === 'medical' ? 'text-woof-gold bg-woof-gold/15' : 'text-woof-charcoal bg-woof-pearl/20'}`}
                                                >
                                                    {activity.type === 'medical' ? (
                                                        <Activity className="h-4 w-4" />
                                                    ) : (
                                                        <ShieldCheck className="h-4 w-4" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-woof-charcoal/50 mb-0.5 text-[9px] font-bold tracking-wide uppercase">
                                                        {activity.pet_name}
                                                    </p>
                                                    <p className="text-woof-charcoal truncate text-xs font-bold">{activity.title}</p>

                                                    <p className="text-woof-charcoal/40 mt-0.5 text-[9px] font-medium">
                                                        {new Date(activity.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Activity className="text-woof-charcoal/40 mx-auto mb-2 h-8 w-8" />
                                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase">No recent records</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Action Cards */}

                        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Link
                                href="/dashboard/pets"
                                className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md flex items-center gap-4"
                            >
                                <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Plus className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-woof-charcoal text-[11px] font-bold uppercase truncate">Add Pet</h4>
                                    <p className="text-woof-charcoal/50 text-[10px] truncate">Register new pet</p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/appointments"
                                className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md flex items-center gap-4"
                            >
                                <div className="rounded-xl border p-3 shrink-0 bg-woof-champagne/20 text-woof-champagne border-woof-champagne/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-woof-charcoal text-[11px] font-bold uppercase truncate">Appointments</h4>
                                    <p className="text-woof-charcoal/50 text-[10px] truncate">Veterinary visits</p>
                                </div>
                            </Link>

                            <Link
                                href={route('directory.index')}
                                className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md flex items-center gap-4"
                            >
                                <div className="rounded-xl border p-3 shrink-0 bg-woof-gold/15 text-woof-gold border-woof-gold/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Stethoscope className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-woof-charcoal text-[11px] font-bold uppercase truncate">Directory</h4>
                                    <p className="text-woof-charcoal/50 text-[10px] truncate">Find vets & clinics</p>
                                </div>
                            </Link>

                            <Link
                                href={route('marketplace.index')}
                                className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md flex items-center gap-4"
                            >
                                <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Dog className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-woof-charcoal text-[11px] font-bold uppercase truncate">Marketplace</h4>
                                    <p className="text-woof-charcoal/50 text-[10px] truncate">Explore listings</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Achievements / Badges Section */}
                <div className="border-[#e8ded1] bg-white relative space-y-6 rounded-3xl border p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="bg-woof-gold/15 text-woof-gold flex h-11 w-11 items-center justify-center rounded-2xl border border-woof-gold/20">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-woof-charcoal text-lg font-black tracking-tight uppercase lg:text-xl">Achievements</h2>
                                <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">
                                    Your badges and milestones
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                        {badges.length > 0 ? (
                            badges.map((badge) => (
                                <div key={badge.id} className="border-[#e8ded1] rounded-2xl border bg-[#fcfbf9] p-4 shadow-2xs text-center flex flex-col items-center justify-center transition-all hover:border-woof-gold/40 hover:shadow-xs">
                                    <div className="bg-woof-gold/15 text-woof-gold h-12 w-12 rounded-full flex items-center justify-center mb-2.5 shadow-2xs">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-woof-charcoal text-xs font-bold uppercase mb-0.5">{badge.name}</h4>
                                    <p className="text-woof-charcoal/50 text-[9px] font-medium uppercase leading-tight">{badge.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center border border-dashed border-[#e8ded1] bg-[#fcfbf9] rounded-2xl">
                                <Award className="text-woof-charcoal/30 mx-auto mb-2 h-8 w-8" />
                                <p className="text-woof-charcoal/60 text-xs font-bold uppercase">No achievements yet</p>
                                <p className="text-woof-charcoal/40 text-[10px] mt-0.5">Complete your profile to earn your first badge!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Breeder & Stud Section */}

                {(isBreeder || isStudProvider) && (
                    <div className="border-[#e8ded1] bg-white relative space-y-6 rounded-3xl border p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="bg-woof-gold/15 text-woof-gold flex h-11 w-11 items-center justify-center rounded-2xl border border-woof-gold/20">
                                    <Layers className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-woof-charcoal text-lg font-black tracking-tight uppercase lg:text-xl">Breeder Console</h2>
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">
                                        Manage listings & genetics
                                    </p>
                                </div>
                            </div>
                            {(isBreeder || isStudProvider) && (
                                <div className="flex gap-2">
                                    {isBreeder && (
                                        <Link
                                            href="/dashboard/breeder"
                                            className="bg-woof-charcoal hover:bg-woof-gold border border-transparent px-4 py-2 text-[10px] font-bold tracking-wider text-white uppercase rounded-full transition-all shadow-xs"
                                        >
                                            Breeder Console
                                        </Link>
                                    )}
                                    <Link
                                        href="/dashboard/breeder/litters"
                                        className="border-[#e8ded1] text-woof-charcoal hover:bg-woof-gold hover:text-white hover:border-woof-gold border bg-woof-cream/40 px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-full transition-all shadow-xs"
                                    >
                                        Litter Manager
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {isBreeder && (
                                <>
                                    <StatsCard
                                        title="Total Litters"
                                        value={stats.breeder?.total_litters || 0}
                                        icon={Layers}
                                        color="blue"
                                        description="Lifetime litters listed"
                                    />

                                    <StatsCard
                                        title="Active Listings"
                                        value={stats.breeder?.active_litters || 0}
                                        icon={Activity}
                                        color="emerald"
                                        description="Available on marketplace"
                                    />
                                </>
                            )}

                            {isStudProvider && (
                                <StatsCard
                                    title="Stud Services"
                                    value={stats.stud?.total_studs || 0}
                                    icon={Dog}
                                    color="indigo"
                                    description="Active stud listings"
                                />
                            )}

                        </div>
                        {/* Adoption Stats for Welfare/Breeder */}

                        {(isWelfare || isBreeder) &&
                            (stats.welfare?.total_adoptions !== undefined || stats.breeder?.total_adoptions !== undefined) && (
                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <StatsCard
                                        title="Adoption Listings"
                                        value={(isWelfare ? stats.welfare?.total_adoptions : stats.breeder?.total_adoptions) || 0}
                                        icon={Heart}
                                        color="rose"
                                        description="Total rescue listings"
                                    />

                                    <StatsCard
                                        title="Active Adoptions"
                                        value={(isWelfare ? stats.welfare?.active_adoptions : stats.breeder?.active_adoptions) || 0}
                                        icon={Activity}
                                        color="emerald"
                                        description="Available for adoption"
                                    />

                                    <StatsCard
                                        title="Pending Approval"
                                        value={(isWelfare ? stats.welfare?.pending_adoptions : stats.breeder?.pending_adoptions) || 0}
                                        icon={Shield}
                                        color="gold"
                                        description="Awaiting admin review"
                                    />
                                </div>
                            )}

                        {recent_litters.length > 0 && (
                            <div className="border-[#e8ded1] rounded-2xl border bg-[#fcfbf9] p-5 shadow-xs">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase">Recent Litters</h3>

                                    <Link
                                        href="/dashboard/breeder/litters"
                                        className="text-woof-gold text-[10px] font-bold tracking-wider uppercase hover:underline"
                                    >
                                        Manage Listings
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {recent_litters.map((litter) => (
                                        <div key={litter.id} className="bg-white/80 border border-[#e8ded1]/80 hover:border-woof-gold/40 group rounded-xl p-4 transition-all shadow-2xs">
                                            <div className="mb-2.5 flex items-start justify-between">
                                                <div className="text-woof-gold flex h-9 w-9 items-center justify-center rounded-lg bg-woof-gold/15">
                                                    <Layers className="h-4 w-4" />
                                                </div>

                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${litter.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}
                                                >
                                                    {litter.status}
                                                </span>
                                            </div>

                                            <p className="text-woof-charcoal group-hover:text-woof-gold mb-0.5 truncate text-xs font-bold transition-colors">
                                                {litter.title}
                                            </p>

                                            <p className="text-woof-charcoal/50 text-[10px] font-medium uppercase">
                                                {litter.breed?.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recent_adoptions.length > 0 && (
                            <div className="border-[#e8ded1] rounded-2xl border bg-[#fcfbf9] p-5 shadow-xs">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase">Recent Adoption Listings</h3>

                                    <Link
                                        href="/dashboard/adoptions"
                                        className="text-woof-gold text-[10px] font-bold tracking-wider uppercase hover:underline"
                                    >
                                        Manage Adoptions
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {recent_adoptions.map((adoption) => (
                                        <div
                                            key={adoption.id}
                                            className="bg-white/80 border border-[#e8ded1]/80 hover:border-woof-gold/40 group overflow-hidden rounded-xl p-4 transition-all shadow-2xs"
                                        >
                                            <div className="mb-2.5 flex items-start justify-between">
                                                <div className="bg-woof-charcoal/5 border-[#e8ded1] relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border">
                                                    {adoption.featured_image_url ? (
                                                        <img
                                                             src={adoption.featured_image_url}
                                                             alt={adoption.title}
                                                             className="h-full w-full object-cover"
                                                         />
                                                     ) : (
                                                         <div className="text-woof-charcoal/30 flex h-full w-full items-center justify-center">
                                                             <Dog className="h-5 w-5" />
                                                         </div>
                                                     )}

                                                     {adoption.is_champion && (
                                                         <div className="bg-woof-gold absolute top-0.5 right-0.5 rounded-full p-0.5 shadow-xs">
                                                             <Star className="h-2 w-2 fill-white text-white" />
                                                         </div>
                                                     )}
                                                 </div>

                                                 <div className="flex flex-col items-end gap-1">
                                                     <span
                                                         className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${adoption.status === 'published' || adoption.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}
                                                     >
                                                         {adoption.status}
                                                     </span>

                                                     {adoption.is_champion && (
                                                         <span className="text-woof-gold bg-woof-gold/10 border border-woof-gold/20 flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[7px] font-bold uppercase">
                                                             <Sparkles className="h-2 w-2" /> Champion
                                                         </span>
                                                     )}
                                                 </div>
                                             </div>

                                             <p className="text-woof-charcoal group-hover:text-woof-gold mb-0.5 truncate text-xs font-bold transition-colors">
                                                 {adoption.title}
                                             </p>

                                             <div className="flex items-center justify-between">
                                                 <p className="text-woof-charcoal/50 text-[10px] font-medium uppercase">
                                                     {adoption.breed?.name}
                                                 </p>
                                                 <p className="text-woof-charcoal/40 text-[8px] font-bold uppercase">{adoption.city?.name}</p>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                 )}
                {/* Active Professional Status Indicators (Only if they have roles) */}

                {hasProfessionalRole && (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {isVet && (
                            <Link
                                href="/dashboard/vet"
                                className="bg-white hover:bg-emerald-50/40 hover:border-emerald-400/40 border border-[#e8ded1] flex items-center justify-between rounded-2xl p-3.5 transition-all cursor-pointer shadow-2xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                                        <Stethoscope className="h-4 w-4" />
                                    </div>
                                    <span className="text-woof-charcoal text-[11px] font-bold uppercase">Vet Console</span>
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[8px] font-bold uppercase ${getRoleStatusColor(stats.vet?.status)}`}
                                >
                                    {stats.vet?.status}
                                </span>
                            </Link>
                        )}

                        {isTrainer && (
                            <Link
                                href="/dashboard/trainer"
                                className="bg-white hover:bg-indigo-50/40 hover:border-indigo-400/40 border border-[#e8ded1] flex items-center justify-between rounded-2xl p-3.5 transition-all cursor-pointer shadow-2xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                                        <GraduationCap className="h-4 w-4" />
                                    </div>
                                    <span className="text-woof-charcoal text-[11px] font-bold uppercase">Trainer Console</span>
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[8px] font-bold uppercase ${getRoleStatusColor(stats.trainer?.status)}`}
                                >
                                    {stats.trainer?.status}
                                </span>
                            </Link>
                        )}

                        {isBoarding && (
                            <Link
                                href="/dashboard/boarding"
                                className="bg-white hover:bg-sky-50/40 hover:border-sky-400/40 border border-[#e8ded1] flex items-center justify-between rounded-2xl p-3.5 transition-all cursor-pointer shadow-2xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                                        <Home className="h-4 w-4" />
                                    </div>
                                    <span className="text-woof-charcoal text-[11px] font-bold uppercase">Boarding Console</span>
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[8px] font-bold uppercase ${getRoleStatusColor(stats.boarding?.status)}`}
                                >
                                    {stats.boarding?.status}
                                </span>
                            </Link>
                        )}

                        {isWelfare && (
                            <Link
                                href="/dashboard/welfare"
                                className="bg-white hover:bg-rose-50/40 hover:border-rose-400/40 border border-[#e8ded1] flex items-center justify-between rounded-2xl p-3.5 transition-all cursor-pointer shadow-2xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <span className="text-woof-charcoal text-[11px] font-bold uppercase">Welfare Console</span>
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[8px] font-bold uppercase ${getRoleStatusColor(stats.welfare?.status)}`}
                                >
                                    {stats.welfare?.status}
                                </span>
                            </Link>
                        )}

                        {isPetShop && (
                            <Link
                                href="/dashboard/pet-shop"
                                className="bg-white hover:bg-amber-50/40 hover:border-amber-400/40 border border-[#e8ded1] flex items-center justify-between rounded-2xl p-3.5 transition-all cursor-pointer shadow-2xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                                        <ShoppingBag className="h-4 w-4" />
                                    </div>
                                    <span className="text-woof-charcoal text-[11px] font-bold uppercase">Boutique Console</span>
                                </div>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[8px] font-bold uppercase ${getRoleStatusColor(stats['pet-shop']?.status)}`}
                                >
                                    {stats['pet-shop']?.status}
                                </span>
                            </Link>
                        )}
                    </div>
                )}

                {/* Profile Analytics */}
                {profile_views && profile_views.length > 0 && (
                    <div className="border-[#e8ded1] bg-white relative space-y-6 rounded-3xl border p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="bg-woof-gold/15 text-woof-gold flex h-11 w-11 items-center justify-center rounded-2xl border border-woof-gold/20">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-woof-charcoal text-lg font-black tracking-tight uppercase lg:text-xl">Profile Analytics</h2>
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">
                                        Views over the last 30 days
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={profile_views} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#a39a8c"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => {
                                            const d = new Date(val);
                                            return `${d.getMonth()+1}/${d.getDate()}`;
                                        }}
                                        minTickGap={20}
                                    />
                                    <YAxis
                                        stroke="#a39a8c"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e8ded1', boxShadow: '0 4px 12px rgba(36, 34, 28, 0.08)' }}
                                        labelStyle={{ color: '#24221c', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}
                                        itemStyle={{ color: '#bb8b62', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="views"
                                        name="Profile Views"
                                        stroke="#bb8b62"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#bb8b62', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}


                {/* Join Our Professional Network (Application Links) */}
                {hasAnyRoleToApply && (
                    <div className="border-[#e8ded1] bg-white relative space-y-6 rounded-3xl border p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-3.5">
                            <div className="bg-woof-gold/15 text-woof-gold flex h-11 w-11 items-center justify-center rounded-2xl border border-woof-gold/20">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-woof-charcoal text-lg font-black tracking-tight uppercase lg:text-xl">Join Our Professional Network</h2>
                                <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">Expand your pet care practice</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {!isBreeder && (
                                <Link
                                    href={route('breeder.profile.edit')}
                                    className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-[#fcfbf9] p-5 shadow-2xs transition-all hover:shadow-xs flex items-start gap-4"
                                >
                                    <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 group-hover:bg-woof-gold/15 group-hover:text-woof-gold group-hover:border-woof-gold/30 transition-colors flex items-center justify-center">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h4 className="text-woof-charcoal text-xs font-bold uppercase truncate">Apply as Breeder</h4>
                                        <p className="text-woof-charcoal/50 mt-0.5 text-[11px] truncate">List your litters & program</p>
                                    </div>
                                </Link>
                            )}
                            {!isVet && (
                                <Link
                                    href={route('vet.profile.edit')}
                                    className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-[#fcfbf9] p-5 shadow-2xs transition-all hover:shadow-xs flex items-start gap-4"
                                >
                                    <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 group-hover:bg-woof-gold/15 group-hover:text-woof-gold group-hover:border-woof-gold/30 transition-colors flex items-center justify-center">
                                        <Stethoscope className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h4 className="text-woof-charcoal text-xs font-bold uppercase truncate">Apply as Vet</h4>
                                        <p className="text-woof-charcoal/50 mt-0.5 text-[11px] truncate">Join verified veterinary clinic list</p>
                                    </div>
                                </Link>
                            )}
                            {!isTrainer && (
                                <Link
                                    href={route('trainer.profile.edit')}
                                    className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-[#fcfbf9] p-5 shadow-2xs transition-all hover:shadow-xs flex items-start gap-4"
                                >
                                    <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 group-hover:bg-woof-gold/15 group-hover:text-woof-gold group-hover:border-woof-gold/30 transition-colors flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h4 className="text-woof-charcoal text-xs font-bold uppercase truncate">Apply as Trainer</h4>
                                        <p className="text-woof-charcoal/50 mt-0.5 text-[11px] truncate">Offer your behavioral coaching</p>
                                    </div>
                                </Link>
                            )}
                            {!isBoarding && (
                                <Link
                                    href={route('boarding.profile.edit')}
                                    className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-[#fcfbf9] p-5 shadow-2xs transition-all hover:shadow-xs flex items-start gap-4"
                                >
                                    <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 group-hover:bg-woof-gold/15 group-hover:text-woof-gold group-hover:border-woof-gold/30 transition-colors flex items-center justify-center">
                                        <Home className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h4 className="text-woof-charcoal text-xs font-bold uppercase truncate">Apply for Boarding</h4>
                                        <p className="text-woof-charcoal/50 mt-0.5 text-[11px] truncate">List your pet stay facility</p>
                                    </div>
                                </Link>
                            )}
                            {!isWelfare && (
                                <Link
                                    href={route('welfare.profile.edit')}
                                    className="group border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-[#fcfbf9] p-5 shadow-2xs transition-all hover:shadow-xs flex items-start gap-4"
                                >
                                    <div className="rounded-xl border p-3 shrink-0 bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/30 group-hover:bg-woof-gold/15 group-hover:text-woof-gold group-hover:border-woof-gold/30 transition-colors flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h4 className="text-woof-charcoal text-xs font-bold uppercase truncate">Apply as Welfare</h4>
                                        <p className="text-woof-charcoal/50 mt-0.5 text-[11px] truncate">Register rescue organization</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Community Gallery Engagement Stats */}
                <div className="border-[#e8ded1] bg-white relative space-y-6 rounded-3xl border p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-3.5">
                            <div className="bg-woof-gold/15 text-woof-gold flex h-11 w-11 items-center justify-center rounded-2xl border border-woof-gold/20">
                                <Image className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-woof-charcoal text-lg font-black tracking-tight uppercase lg:text-xl">Community Gallery Hub</h2>
                                <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">Visual dog sanctuary</p>
                            </div>
                        </div>
                        <Link href="/community/gallery" className="text-woof-gold text-[10px] font-bold tracking-wider uppercase hover:underline flex items-center gap-1">
                            Explore Dog Gallery <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Gallery Likes"
                            value={gallery_stats.total_likes}
                            icon={Heart}
                            color="rose"
                            description="Community reactions"
                            layout="vertical"
                            iconSize="sm"
                        />
                        <StatsCard
                            title="Total Gallery Shares"
                            value={gallery_stats.total_shares}
                            icon={Share2}
                            color="blue"
                            description="Social media shares"
                            layout="vertical"
                            iconSize="sm"
                        />
                        <StatsCard
                            title="Collections Exported"
                            value={gallery_stats.total_exports}
                            icon={Download}
                            color="gold"
                            description="ZIP downloads"
                            layout="vertical"
                            iconSize="sm"
                        />
                        <div className="border-[#e8ded1] group flex flex-col justify-between rounded-2xl border bg-[#fcfbf9] p-5 shadow-2xs">
                            <div>
                                <h4 className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">Your Activity</h4>
                                <p className="text-woof-charcoal mt-1 text-2xl font-black">{gallery_stats.user_likes}</p>
                                <p className="text-woof-charcoal/50 mt-0.5 text-[11px] font-medium">Dog photos you liked</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#e8ded1] flex items-center justify-between">
                                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Active Member</span>
                                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
