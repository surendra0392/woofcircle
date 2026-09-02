import AdminLayout from '@/layouts/admin/admin-layout';
import { AdminSharedData } from '@/types/admin';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    ChevronRight,
    Dog,
    Download,
    GraduationCap,
    Heart,
    Home,
    Layers,
    MapPin,
    Share2,
    Shield,
    Star,
    Stethoscope,
    TrendingUp,
    Users,
    FileText,
    AlertTriangle,
} from 'lucide-react';

interface Stats {
    total_users: number;
    active_users: number;
    total_admins: number;
    total_roles: number;
    total_breeds: number;
    active_breeds: number;
    total_breeders: number;
    active_breeders: number;
    total_vets: number;
    active_vets: number;
    total_trainers: number;
    active_trainers: number;
    total_boarding: number;
    active_boarding: number;
    boarding_only: number;
    daycare_only: number;
    boarding_both: number;
    total_welfare: number;
    active_welfare: number;
    vet_services: number;
    specializations: number;
    total_states: number;
    total_cities: number;
    total_litters: number;
    total_studs: number;
    total_adoptions: number;
    total_pets: number;
    total_reviews: number;
    pending_reviews: number;
    total_gallery_likes: number;
    total_gallery_shares: number;
    total_gallery_exports: number;
    total_passports: number;
    lost_pets: number;
    expiring_vaccinations: number;
    total_transfers: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: { name: string };
    created_at: string;
}

interface RecentProfile {
    id: number;
    name?: string;
    kennel_name?: string;
    clinic_name?: string;
    organization_name?: string;
    state: { name: string };
    city: { name: string };
    created_at: string;
}

interface RecentReview {
    id: number;
    rating: number;
    comment: string;
    status: string;
    user: { name: string };
    reviewable: { name?: string; clinic_name?: string; shop_name?: string; kennel_name?: string; organization_name?: string } | null;
    created_at: string;
}

interface RecentLog {
    id: number;
    action: string;
    created_at: string;
    admin?: { name: string };
}

interface TopState {
    id: number;
    name: string;
    breeder_profiles_count: number;
    vet_profiles_count: number;
    trainer_profiles_count: number;
    boarding_profiles_count: number;
    welfare_profiles_count: number;
}

interface PageProps extends AdminSharedData {
    stats: Stats;
    recent_users: RecentUser[];
    recent_breeders: RecentProfile[];
    recent_vets: RecentProfile[];
    recent_trainers: RecentProfile[];
    recent_boarding: RecentProfile[];
    recent_welfare: RecentProfile[];
    recent_reviews: RecentReview[];
    recent_logs: RecentLog[];
    top_states: TopState[];
}

function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
    href,
    badgeText,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    subValue?: string;
    href: string;
    badgeText?: string;
}) {
    return (
        <Link 
            href={href} 
            className="group relative overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-woof-gold hover:shadow-md flex flex-col justify-between"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-woof-charcoal/60 uppercase">
                    {label}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal transition-colors group-hover:bg-woof-charcoal group-hover:text-woof-gold group-hover:border-woof-charcoal">
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <p className="font-sans text-3xl font-bold text-woof-charcoal tracking-tight">
                        {value.toLocaleString()}
                    </p>
                    {badgeText && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            {badgeText}
                        </span>
                    )}
                </div>
                {subValue && (
                    <p className="mt-2 text-xs text-woof-charcoal/60 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-woof-gold" />
                        {subValue}
                    </p>
                )}
            </div>
        </Link>
    );
}

function MiniBar({ value, max }: { value: number; max: number }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex flex-1 items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f0e8dc]">
                <div className="h-full rounded-full bg-woof-charcoal transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-9 text-right text-xs font-bold text-woof-charcoal/70">{pct}%</span>
        </div>
    );
}

export default function AdminDashboard() {
    const {
        auth,
        stats,
        recent_users,
        recent_reviews,
        recent_logs,
        top_states,
    } = usePage<PageProps>().props;
    const admin = auth.admin;
    const totalDirectoryListings = (stats.total_breeders || 0) + (stats.total_vets || 0) + (stats.total_trainers || 0) + (stats.total_boarding || 0) + (stats.total_welfare || 0);

    return (
        <AdminLayout title="Analytics Dashboard">
            <Head title="Woof Circle Admin Dashboard" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Bento Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-8 shadow-xs">
                    <div className="absolute top-0 right-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-woof-gold/10 blur-3xl pointer-events-none" />
                    
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold tracking-widest text-woof-charcoal uppercase bg-[#fcfbf9] border border-[#e8ded1] px-3 py-1 rounded-full">
                                    Woof Circle Console
                                </span>
                                <span className="text-xs font-medium text-woof-gold">
                                    v2.4 Console System
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-woof-charcoal font-sans sm:text-4xl">
                                System Overview & Intelligence
                            </h2>
                            <p className="text-xs text-woof-charcoal/70 tracking-wide max-w-xl">
                                Welcome back, {admin?.name || 'Administrator'}. Monitor real-time registry operations, ecosystem activity, and infrastructure metrics.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-[#e8ded1] pt-4 lg:pt-0 lg:pl-8">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                    Active Directory Ecosystem
                                </p>
                                <p className="font-sans text-4xl font-bold text-woof-charcoal tracking-tight">
                                    {totalDirectoryListings.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Registered Users"
                        value={stats.total_users || 0}
                        subValue={`${stats.active_users || 0} active users`}
                        href="/admin/users"
                        badgeText="+14%"
                    />
                    <StatCard
                        icon={Dog}
                        label="Breeders Registry"
                        value={stats.total_breeders || 0}
                        subValue={`${stats.active_breeders || 0} active profiles`}
                        href="/admin/breeders"
                        badgeText="+28%"
                    />
                    <StatCard
                        icon={Stethoscope}
                        label="Veterinary Clinics"
                        value={stats.total_vets || 0}
                        subValue={`${stats.active_vets || 0} active clinics`}
                        href="/admin/vets"
                        badgeText="+9%"
                    />
                    <StatCard
                        icon={Star}
                        label="Platform Reviews"
                        value={stats.total_reviews || 0}
                        subValue={`${stats.pending_reviews || 0} pending audit`}
                        href="/admin/reviews"
                        badgeText="+34%"
                    />
                </div>

                {/* Secondary Directory & Service Metric Row */}
                <div className="grid gap-5 lg:grid-cols-3">
                    <StatCard
                        icon={GraduationCap}
                        label="Professional Trainers"
                        value={stats.total_trainers || 0}
                        subValue={`${stats.active_trainers || 0} active trainers`}
                        href="/admin/trainers"
                    />
                    <StatCard
                        icon={Home}
                        label="Boarding & Daycare"
                        value={stats.total_boarding || 0}
                        subValue={`${stats.active_boarding || 0} active facilities`}
                        href="/admin/boarding"
                    />
                    <StatCard
                        icon={Heart}
                        label="Welfare & Rescue"
                        value={stats.total_welfare || 0}
                        subValue={`${stats.active_welfare || 0} active shelters`}
                        href="/admin/welfare"
                    />
                </div>

                {/* Main Bento Analytics Layout */}
                <div className="grid gap-5 lg:grid-cols-3">
                    
                    {/* Directory Active Distribution Progress panel */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 lg:col-span-2 space-y-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                            <div>
                                <h3 className="font-sans text-base font-bold text-woof-charcoal tracking-tight">
                                    Directory Distribution & Ratio
                                </h3>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                    Active verification health across modules
                                </p>
                            </div>
                            <Layers className="h-4 w-4 text-woof-gold" />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-woof-charcoal">
                                    <span className="flex items-center gap-2 font-medium">
                                        <Dog className="h-4 w-4 text-woof-gold" /> Breeder Profiles
                                    </span>
                                    <span className="text-woof-charcoal font-bold">{stats.total_breeders || 0} Records</span>
                                </div>
                                <MiniBar value={stats.active_breeders || 0} max={stats.total_breeders || 1} />
                            </div>

                            <div className="space-y-2 pt-3 border-t border-[#f0e8dc]">
                                <div className="flex items-center justify-between text-xs text-woof-charcoal">
                                    <span className="flex items-center gap-2 font-medium">
                                        <Stethoscope className="h-4 w-4 text-woof-gold" /> Veterinary Clinics
                                    </span>
                                    <span className="text-woof-charcoal font-bold">{stats.total_vets || 0} Records</span>
                                </div>
                                <MiniBar value={stats.active_vets || 0} max={stats.total_vets || 1} />
                            </div>

                            <div className="space-y-2 pt-3 border-t border-[#f0e8dc]">
                                <div className="flex items-center justify-between text-xs text-woof-charcoal">
                                    <span className="flex items-center gap-2 font-medium">
                                        <GraduationCap className="h-4 w-4 text-woof-gold" /> Canine Trainers
                                    </span>
                                    <span className="text-woof-charcoal font-bold">{stats.total_trainers || 0} Records</span>
                                </div>
                                <MiniBar value={stats.active_trainers || 0} max={stats.total_trainers || 1} />
                            </div>

                            <div className="space-y-2 pt-3 border-t border-[#f0e8dc]">
                                <div className="flex items-center justify-between text-xs text-woof-charcoal">
                                    <span className="flex items-center gap-2 font-medium">
                                        <Home className="h-4 w-4 text-woof-gold" /> Boarding & Daycare
                                    </span>
                                    <span className="text-woof-charcoal font-bold">{stats.total_boarding || 0} Records</span>
                                </div>
                                <MiniBar value={stats.active_boarding || 0} max={stats.total_boarding || 1} />
                            </div>

                            <div className="space-y-2 pt-3 border-t border-[#f0e8dc]">
                                <div className="flex items-center justify-between text-xs text-woof-charcoal">
                                    <span className="flex items-center gap-2 font-medium">
                                        <Heart className="h-4 w-4 text-woof-gold" /> Welfare & Shelter
                                    </span>
                                    <span className="text-woof-charcoal font-bold">{stats.total_welfare || 0} Records</span>
                                </div>
                                <MiniBar value={stats.active_welfare || 0} max={stats.total_welfare || 1} />
                            </div>
                        </div>
                    </div>

                    {/* Marketplace Metric Counter Card */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 flex flex-col justify-between relative overflow-hidden shadow-xs">
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-woof-gold/10 blur-2xl pointer-events-none" />
                        
                        <div>
                            <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4 mb-6">
                                <h3 className="font-sans text-base font-bold text-woof-charcoal tracking-tight">
                                    Marketplace Scale
                                </h3>
                                <TrendingUp className="h-4 w-4 text-woof-gold" />
                            </div>
                            
                            <div className="space-y-4 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-woof-charcoal/70">Total Puppy Litters</span>
                                    <span className="text-woof-charcoal font-bold text-base">{stats.total_litters || 0}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#f0e8dc] pt-3">
                                    <span className="text-woof-charcoal/70">Stud Services</span>
                                    <span className="text-woof-charcoal font-bold text-base">{stats.total_studs || 0}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#f0e8dc] pt-3">
                                    <span className="text-woof-charcoal/70">Adoption Requests</span>
                                    <span className="text-woof-charcoal font-bold text-base">{stats.total_adoptions || 0}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#f0e8dc] pt-3">
                                    <span className="text-woof-charcoal/70">Pet Directory Size</span>
                                    <span className="text-woof-charcoal font-bold text-base">{stats.total_pets || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-[#e8ded1]">
                            <Link 
                                href="/admin/litters" 
                                className="w-full flex items-center justify-center gap-2 rounded-full bg-woof-charcoal text-white font-bold text-xs py-2.5 hover:bg-woof-forest transition-colors shadow-xs"
                            >
                                Manage Marketplace <ChevronRight className="h-4 w-4 text-woof-gold" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Passport Registry Analytics */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold tracking-widest text-woof-gold uppercase px-1">
                        Passport Registry Analytics
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            icon={FileText}
                            label="Total Passports Issued"
                            value={stats.total_passports || 0}
                            href="/admin/pets"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            label="Lost Pets Active"
                            value={stats.lost_pets || 0}
                            href="/admin/pets"
                            badgeText={(stats.lost_pets || 0) > 0 ? "URGENT" : undefined}
                        />
                        <StatCard
                            icon={Activity}
                            label="Vaccines Expiring Soon"
                            value={stats.expiring_vaccinations || 0}
                            href="/admin/vaccinations"
                        />
                        <StatCard
                            icon={Users}
                            label="Total Ownership Transfers"
                            value={stats.total_transfers || 0}
                            href="/admin/pets"
                        />
                    </div>
                </div>

                {/* Community & Engagement Metrics */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold tracking-widest text-woof-gold uppercase px-1">
                        Community & Gallery Pulse
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <StatCard
                            icon={Heart}
                            label="Gallery Reactions"
                            value={stats.total_gallery_likes || 0}
                            subValue="Total likes recorded"
                            href="/admin/gallery"
                        />
                        <StatCard
                            icon={Share2}
                            label="Gallery Shares"
                            value={stats.total_gallery_shares || 0}
                            subValue="Total shares tracked"
                            href="/admin/gallery"
                        />
                        <StatCard
                            icon={Download}
                            label="Collection Exports"
                            value={stats.total_gallery_exports || 0}
                            subValue="Total zip packages exported"
                            href="/admin/gallery"
                        />
                    </div>
                </div>

                {/* Geographic & Logs Grid */}
                <div className="grid gap-5 xl:grid-cols-3">
                    
                    {/* Top States Distribution */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white flex flex-col overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] p-5 bg-[#fcfbf9]">
                            <div>
                                <h3 className="font-sans text-sm font-bold text-woof-charcoal tracking-tight">
                                    Top Regional Clusters
                                </h3>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                    State level concentration
                                </p>
                            </div>
                            <MapPin className="h-4 w-4 text-woof-gold" />
                        </div>
                        <div className="space-y-4 p-5 flex-1 text-xs">
                            {(top_states || []).slice(0, 5).map((state, idx) => {
                                const total = (state.breeder_profiles_count || 0) + 
                                              (state.vet_profiles_count || 0) + 
                                              (state.trainer_profiles_count || 0) + 
                                              (state.boarding_profiles_count || 0) + 
                                              (state.welfare_profiles_count || 0);
                                return (
                                    <div key={state.id} className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-woof-charcoal/80 font-semibold">#{idx + 1} {state.name}</span>
                                            <span className="text-woof-charcoal font-bold">{total} listings</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-[#f0e8dc] overflow-hidden flex">
                                            <div className="bg-woof-charcoal h-full rounded-full" style={{ width: `${(total / 50) * 100}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {(!top_states || top_states.length === 0) && (
                                <div className="p-8 text-center text-woof-charcoal/50 text-xs">
                                    No state distribution data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle: Recent Reviews */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white flex flex-col overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] p-5 bg-[#fcfbf9]">
                            <div>
                                <h3 className="font-sans text-sm font-bold text-woof-charcoal tracking-tight">
                                    Recent Ratings & Feedback
                                </h3>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                    Real-time user feedback feed
                                </p>
                            </div>
                            <Link href="/admin/reviews" className="text-xs font-bold text-woof-gold hover:text-woof-charcoal transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="divide-y divide-[#f0e8dc] overflow-y-auto max-h-[340px]">
                            {(recent_reviews || []).map((review) => (
                                <div key={review.id} className="p-4 space-y-2 hover:bg-[#fcfbf9] transition-colors">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                            {review.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-woof-charcoal font-sans line-clamp-2">
                                        "{review.comment}"
                                    </p>
                                    <p className="text-[11px] text-woof-charcoal/60 truncate font-medium">
                                        By {review.user?.name || 'User'}
                                    </p>
                                </div>
                            ))}
                            {(!recent_reviews || recent_reviews.length === 0) && (
                                <div className="p-8 text-center text-woof-charcoal/50 text-xs">
                                    No recent reviews recorded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Latest Registered Users */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white flex flex-col overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] p-5 bg-[#fcfbf9]">
                            <div>
                                <h3 className="font-sans text-sm font-bold text-woof-charcoal tracking-tight">
                                    Latest User Registrations
                                </h3>
                                <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                    New platform accounts
                                </p>
                            </div>
                            <Link href="/admin/users" className="text-xs font-bold text-woof-gold hover:text-woof-charcoal transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="divide-y divide-[#f0e8dc] overflow-y-auto max-h-[340px]">
                            {(recent_users || []).map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-[#fcfbf9] transition-colors">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fcfbf9] text-woof-charcoal text-xs font-bold border border-[#e8ded1]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-sans text-xs font-bold text-woof-charcoal">{user.name}</p>
                                        <p className="truncate text-[11px] text-woof-charcoal/60">{user.email}</p>
                                    </div>
                                    <span className="text-[10px] font-bold bg-[#fcfbf9] text-woof-charcoal border border-[#e8ded1] px-2.5 py-0.5 rounded-full uppercase">
                                        {user.role?.name || 'User'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Realtime Audit Activity Log */}
                <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 space-y-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                        <div>
                            <h3 className="font-sans text-base font-bold text-woof-charcoal tracking-tight">
                                Audit Trail & Administrative Logs
                            </h3>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                System execution and configuration modification stream
                            </p>
                        </div>
                        <Shield className="h-4 w-4 text-woof-gold" />
                    </div>

                    <div className="space-y-3 text-xs">
                        {(recent_logs || []).slice(0, 5).map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1]">
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-woof-charcoal font-medium">{log.action}</span>
                                </div>
                                <div className="flex items-center gap-4 text-woof-charcoal/60 text-[11px] font-medium">
                                    <span>{log.admin?.name || 'Admin'}</span>
                                    <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Link 
                            href="/admin/audit-logs" 
                            className="text-xs font-bold text-woof-gold hover:text-woof-charcoal flex items-center gap-1 transition-colors"
                        >
                            Explore Audit Logs <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
