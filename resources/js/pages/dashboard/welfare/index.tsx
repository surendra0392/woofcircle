import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    Award,
    BarChart3,
    Camera,
    ChevronRight,
    ExternalLink,
    Heart,
    Image,
    Layers,
    Plus,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';

interface GalleryImage {
    id: number;
    image: string;
}

interface Profile {
    id: number;
    organization_name: string;
    slug: string | null;
    description: string | null;
    website: string | null;
    state: { id: number; name: string } | null;
    city: { id: number; name: string } | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
    is_verified: boolean;
    is_active: boolean;
    gallery: GalleryImage[];
}

interface Analytics {
    gallery_count: number;
    profile_completeness: number;
    is_verified: boolean;
    is_active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Welfare Console', href: '/dashboard/welfare' },
];

interface Props {
    profile: Profile | null;
    analytics: Analytics;
}

export default function WelfareDashboard({ profile, analytics }: SharedData & Props) {
    const hasProfile = !!profile;

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="Welfare Console"
            subtitle="Analytics, rescue tracking, and animal advocacy overview"
            actions={
                <Link
                    href="/welfare/profile"
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                >
                    <Heart className="h-4 w-4" /> Manage Organization
                </Link>
            }
        >
            <Head title="Welfare Console" />

            <div className="mx-auto max-w-7xl space-y-8 pb-16">
                {/* Status Banners */}
                {!hasProfile && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xs">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 border border-amber-200 text-amber-800">
                                <Heart className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">Organization Profile Required</h4>
                                <p className="text-xs text-amber-700/90 mt-0.5">
                                    Create your welfare or rescue organization profile to publish adoption listings and receive community support.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/welfare/profile"
                            className="flex shrink-0 items-center gap-2 bg-amber-800 hover:bg-amber-900 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all"
                        >
                            <Plus className="h-4 w-4" /> Create Profile
                        </Link>
                    </div>
                )}

                {hasProfile && !analytics.is_active && (
                    <div className="flex items-start sm:items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-xs">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 border border-rose-200 text-rose-700">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-rose-900">Profile Pending Review</h4>
                            <p className="text-xs text-rose-700/90 mt-0.5">
                                Your organization profile is currently hidden while our compliance team verifies your non-profit registration.
                            </p>
                        </div>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                                <Heart className="h-5 w-5" />
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${analytics.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                                {analytics.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Organization Status</p>
                        <p className="text-woof-charcoal truncate text-xl font-bold">
                            {hasProfile ? (analytics.is_verified ? 'Verified NGO' : 'Registered') : '—'}
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                                <Image className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-bold text-woof-charcoal/40 uppercase tracking-wider">/ 10 max</span>
                        </div>
                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Shelter Photos</p>
                        <p className="text-woof-charcoal text-xl font-bold">{analytics.gallery_count}</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                                <Award className="h-5 w-5" />
                            </div>
                            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                {analytics.profile_completeness}%
                            </span>
                        </div>
                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Profile Completeness</p>
                        <div className="mt-2 h-2 w-full rounded-full bg-[#f4ebe1] overflow-hidden">
                            <div
                                className="h-full bg-woof-gold transition-all duration-1000 rounded-full"
                                style={{ width: `${analytics.profile_completeness}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                                <Layers className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-bold text-woof-charcoal/40 uppercase tracking-wider">Rescue</span>
                        </div>
                        <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Active Adoptions</p>
                        <p className="text-woof-charcoal text-xl font-bold">Suite Live</p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Analytics & Rescue Overview */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Welfare Engagement Overview */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-woof-charcoal">Welfare Analytics</h2>
                                        <p className="text-xs text-woof-charcoal/60">Track adoption inquiries, rescues, and community bookmarks</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    <TrendingUp className="h-3.5 w-3.5" /> Live Insights
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center">
                                    <Users className="mx-auto mb-2 h-5 w-5 text-woof-gold" />
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Shelter Views</p>
                                    <p className="text-woof-charcoal text-2xl font-bold">—</p>
                                    <p className="text-woof-charcoal/40 text-[10px] mt-1">Collecting data</p>
                                </div>
                                <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center">
                                    <Heart className="mx-auto mb-2 h-5 w-5 text-rose-500" />
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Rescue Saves</p>
                                    <p className="text-woof-charcoal text-2xl font-bold">—</p>
                                    <p className="text-woof-charcoal/40 text-[10px] mt-1">Collecting data</p>
                                </div>
                                <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-center">
                                    <Star className="mx-auto mb-2 h-5 w-5 text-amber-500" />
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-1">Adoption Inquiries</p>
                                    <p className="text-woof-charcoal text-2xl font-bold">—</p>
                                    <p className="text-woof-charcoal/40 text-[10px] mt-1">Collecting data</p>
                                </div>
                            </div>
                        </div>

                        {/* Adoption Program Overview */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                            <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                        <Heart className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-woof-charcoal">Adoption Listings Hub</h2>
                                        <p className="text-xs text-woof-charcoal/60">Manage companions available for rehoming and fostering</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/adoptions"
                                    className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-woof-charcoal hover:text-white px-4 py-1.5 text-xs font-bold text-woof-charcoal transition-all"
                                >
                                    Adoption Manager
                                </Link>
                            </div>

                            <div className="rounded-3xl border border-dashed border-[#e8ded1] bg-[#fcfbf9] p-8 text-center">
                                <Sparkles className="mx-auto mb-3 h-8 w-8 text-woof-gold" />
                                <h3 className="text-base font-bold text-woof-charcoal mb-1">Active Rescue Campaigns</h3>
                                <p className="mx-auto mb-6 max-w-md text-xs text-woof-charcoal/60">
                                    Create adoption listings with full medical histories, vaccination status, temperament notes, and rehoming terms.
                                </p>
                                <Link
                                    href="/dashboard/adoptions/create"
                                    className="inline-flex items-center gap-2 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal px-6 py-2.5 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Post Rescue for Adoption
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs space-y-4">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-3">
                                <div className="w-9 h-9 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                    <Heart className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-woof-charcoal">Quick Actions</h3>
                                    <p className="text-[10px] text-woof-charcoal/50">Manage welfare operations</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Link
                                    href="/welfare/profile"
                                    className="group flex items-center gap-3 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold p-3.5 transition-all shadow-2xs"
                                >
                                    <Users className="h-4 w-4 text-woof-gold transition-transform group-hover:scale-110" />
                                    <span className="flex-1 text-xs font-bold text-woof-charcoal">
                                        Edit NGO Profile
                                    </span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-woof-charcoal/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>

                                {profile && (
                                    <Link
                                        href={route('directory.welfare.show', { slug: profile.slug || profile.id })}
                                        className="group flex items-center gap-3 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold p-3.5 transition-all shadow-2xs"
                                    >
                                        <ExternalLink className="h-4 w-4 text-woof-gold transition-transform group-hover:scale-110" />
                                        <span className="flex-1 text-xs font-bold text-woof-charcoal">
                                            View Public Page
                                        </span>
                                        <ArrowUpRight className="h-3.5 w-3.5 text-woof-charcoal/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                )}

                                <Link
                                    href={route('directory.index')}
                                    className="group flex items-center gap-3 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white hover:border-woof-gold p-3.5 transition-all shadow-2xs"
                                >
                                    <Heart className="h-4 w-4 text-woof-gold transition-transform group-hover:scale-110" />
                                    <span className="flex-1 text-xs font-bold text-woof-charcoal">
                                        Browse Welfare Directory
                                    </span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-woof-charcoal/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Partner Status Card */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
                                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-woof-charcoal">Verified NGO Partner</h4>
                                    <p className="text-xs text-woof-charcoal/50">Verified status benefits</p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-3">
                                    <span className="text-xs font-medium text-woof-charcoal/70">Directory Priority</span>
                                    <span className="rounded-full bg-woof-charcoal px-2.5 py-0.5 text-[10px] font-bold text-white">
                                        {analytics.is_verified ? 'PRIORITY HIGH' : 'STANDARD'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-3">
                                    <span className="text-xs font-medium text-woof-charcoal/70">Trust Score</span>
                                    <span className="text-xs font-bold text-woof-charcoal">{analytics.is_verified ? '9.9 / 10' : '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
