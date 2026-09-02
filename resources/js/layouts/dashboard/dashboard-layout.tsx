import { Breadcrumbs } from '@/components/breadcrumbs';
import PublicLayout from '@/layouts/public/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronRight,
    Dog,
    GraduationCap,
    Heart,
    Home,
    HeartPulse,
    Image,
    Layers,
    LayoutGrid,
    MessageSquare,
    Settings,
    Shield,
    ShoppingBag,
    Stethoscope,
    Store,
    Users,
    Bookmark,
    BarChart3,
    CalendarDays,
    Clock,
    Crown,
    type LucideIcon,
} from 'lucide-react';
import { useMessageNotifications } from '@/hooks/use-message-notifications';
import { useDeferredRoutes } from '@/hooks/use-deferred-routes';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

interface DashboardNavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    roles?: string[];
}

interface DashboardNavGroup {
    label: string;
    items: DashboardNavItem[];
    color?: string;
    accentColor?: string;
}

const navGroups: DashboardNavGroup[] = [
    {
        label: 'Overview',
        color: 'text-woof-charcoal/20',
        accentColor: 'bg-woof-gold',
        items: [
            { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
            { title: 'Messages', url: '/dashboard/messages', icon: MessageSquare },
            { title: 'My Pets', url: '/dashboard/pets', icon: Dog },
            { title: 'My Galleries', url: '/dashboard/gallery', icon: Image },
            { title: 'Saved Listings', url: '/dashboard/saved', icon: Bookmark },
            { title: 'My Reviews', url: '/dashboard/reviews', icon: MessageSquare },
            { title: 'Notifications', url: '/dashboard/notifications', icon: Bell },
        ],
    },
    {
        label: 'Marketplace',
        color: 'text-woof-gold/20',
        accentColor: 'bg-woof-gold',
        items: [
            { title: 'Breeder Profile', url: '/breeder/profile', icon: Users, roles: ['breeder'] },
            { title: 'My Litters', url: '/dashboard/breeder/litters', icon: Layers, roles: ['breeder'] },
            { title: 'Stud Services', url: '/dashboard/stud-services', icon: Dog, roles: ['stud-service-provider'] },
            { title: 'Welfare Profile', url: '/welfare/profile', icon: Shield, roles: ['welfare'] },
            { title: 'My Adoptions', url: '/dashboard/adoptions', icon: Heart, roles: ['welfare', 'breeder'] },
        ],
    },
    {
        label: 'Services',
        color: 'text-woof-champagne/20',
        accentColor: 'bg-woof-champagne',
        items: [
            { title: 'Business Analytics', url: '/dashboard/business/analytics', icon: BarChart3, roles: ['vet', 'trainer', 'boarding', 'welfare', 'pet-shop', 'breeder'] },
            { title: 'My Bookings', url: '/dashboard/business/bookings', icon: CalendarDays, roles: ['vet', 'trainer', 'boarding', 'welfare', 'pet-shop', 'breeder'] },
            { title: 'Availability', url: '/dashboard/business/availability', icon: Clock, roles: ['vet', 'trainer', 'boarding', 'welfare', 'pet-shop', 'breeder'] },
            { title: 'Vet Profile', url: '/vet/profile', icon: Stethoscope, roles: ['vet'] },
            { title: 'Trainer Profile', url: '/dashboard/trainer/profile', icon: GraduationCap, roles: ['trainer'] },
            { title: 'Boarding Profile', url: '/boarding/profile', icon: Home, roles: ['boarding'] },
        ],
    },
    {
        label: 'Account',
        color: 'text-woof-charcoal/20',
        accentColor: 'bg-woof-charcoal',
        items: [
            { title: 'Membership & Plans', url: '/settings/subscription', icon: Crown },
            { title: 'Support Tickets', url: '/dashboard/support', icon: MessageSquare },
            { title: 'Settings', url: '/settings/profile', icon: Settings },
        ],
    },
];

/**
 * LAYOUT BREAKPOINT: lg (1024px)
 *
 * DashboardLayout deliberately uses the `lg:` breakpoint (1024px) for
 * the mobile→desktop sidebar toggle because the sidebar has 20+ nav
 * items across 4 groups. On tablets (768–1024px), the horizontal
 * scrollable nav is preferred over a fixed sidebar to avoid crowding.
 *
 * Compare with Support/Agent/HR layouts which use `md:` (768px) since
 * their navs have only 3–7 items that fit comfortably in a sidebar on
 * smaller screens.
 */
interface DashboardLayoutProps {
    children: ReactNode;
    breadcrumbs: BreadcrumbItem[];
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function DashboardLayout({ children, breadcrumbs, title, subtitle, actions }: DashboardLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const userRoles: string[] = auth?.user?.roles || [];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [globalUnreadCount, setGlobalUnreadCount] = useState(auth?.user?.unread_messages_count || 0);

    // Load dashboard-specific route definitions on mount
    useDeferredRoutes('dashboard');

    useEffect(() => {
        setGlobalUnreadCount(auth?.user?.unread_messages_count || 0);
    }, [auth?.user?.unread_messages_count]);

    useMessageNotifications({
        userId: auth?.user?.id,
        isViewingConversation: (id) =>
            window.location.pathname.includes(`/messages/${id}`),
        getConversationUrl: (id) => `/dashboard/messages/${id}`,
        onUnreadCountChange: setGlobalUnreadCount,
    });


    const isActive = (url: string) => {
        if (url === '/dashboard') return currentPath === '/dashboard';
        return currentPath.startsWith(url);
    };

    const sidebarRef = useRef<HTMLElement>(null);

    // On mount and route change, scroll the active nav item into view within
    // the sidebar so the user doesn't have to scroll to find where they are.
    useEffect(() => {
        if (!sidebarRef.current) return;
        const activeLink = sidebarRef.current.querySelector('a[class*="text-woof-charcoal"]:not([class*="text-woof-charcoal/"])') as HTMLElement | null;
        if (activeLink) {
            activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [currentPath]);

    const visibleGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                if (!item.roles) return true;
                return item.roles.some((role) => userRoles.includes(role));
            }).map((item) => {
                if (item.title === 'Messages') {
                    return { ...item, badge: (globalUnreadCount as number) > 0 ? (globalUnreadCount as number) : undefined };
                }
                return item;
            }),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <PublicLayout>
            {/* Hero / Header */}
            <section className="bg-woof-cream/60 border-woof-charcoal/5 relative border-b pt-32 pb-8 lg:pt-36 lg:pb-10">
                <div className="container-wide px-6 lg:px-12">
                    <Breadcrumbs breadcrumbs={breadcrumbs} className="mb-4" />
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-woof-charcoal text-2xl font-black tracking-tight uppercase lg:text-3xl">{title}</h1>
                            {subtitle && <p className="text-woof-charcoal/60 mt-1 text-xs font-medium tracking-wide">{subtitle}</p>}
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-[#fcfbf9] py-8 lg:py-12 min-h-[calc(100vh-280px)]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
                        {/* Sidebar */}
                        <aside className="w-full shrink-0 lg:w-60 xl:w-64">
                            {/* Mobile: horizontal scroll tabs */}
                            <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">
                                {visibleGroups.flatMap((group) =>
                                    group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.url);
                                        return (
                                            <Link
                                                key={item.url}
                                                href={item.url}
                                                className={`flex shrink-0 items-center gap-2 border px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-full transition-all ${
                                                    active
                                                        ? 'border-woof-gold bg-woof-gold text-white shadow-sm'
                                                        : 'border-[#e8ded1] text-woof-charcoal/70 hover:border-woof-gold/50 hover:text-woof-charcoal bg-white'
                                                }`}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                {item.title}
                                                {(item as any).badge !== undefined && (
                                                    <span className="bg-rose-500 text-white rounded-full h-4 min-w-4 flex items-center justify-center text-[9px] px-1 ml-1">
                                                        {(item as any).badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    }),
                                )}
                            </div>

                            {/* Desktop: vertical sidebar */}
                            <nav ref={sidebarRef} className="sticky top-24 hidden space-y-6 lg:block bg-white p-5 rounded-2xl border border-[#e8ded1] shadow-sm">
                                {visibleGroups.map((group) => (
                                    <div key={group.label} className="relative">
                                        <p className="text-woof-charcoal/40 mb-2 px-3 text-[9px] font-black tracking-[0.25em] uppercase">
                                            {group.label}
                                        </p>
                                        <div className="space-y-1">
                                            {group.items.map((item) => {
                                                const Icon = item.icon;
                                                const active = isActive(item.url);
                                                return (
                                                    <Link
                                                        key={item.url}
                                                        href={item.url}
                                                        className={`group relative flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold tracking-wide rounded-xl transition-all duration-200 ${
                                                            active
                                                                ? 'bg-woof-gold/10 text-woof-charcoal shadow-xs'
                                                                : 'text-woof-charcoal/70 hover:bg-woof-cream/80 hover:text-woof-charcoal'
                                                        }`}
                                                    >
                                                        <Icon
                                                            className={`h-4 w-4 shrink-0 transition-colors ${
                                                                active ? 'text-woof-gold' : 'text-woof-charcoal/40 group-hover:text-woof-gold'
                                                            }`}
                                                        />
                                                        <span className="flex-1 truncate">{item.title}</span>
                                                        {(item as any).badge !== undefined && (
                                                            <span className="bg-rose-500 text-white rounded-full h-4 min-w-4 flex items-center justify-center text-[9px] px-1 ml-auto">
                                                                {(item as any).badge}
                                                            </span>
                                                        )}
                                                        {active && <ChevronRight className="text-woof-gold h-3.5 w-3.5 opacity-70" />}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Promo / Status Card in Sidebar */}
                                <div className="border border-woof-gold/20 bg-woof-cream/50 mt-4 rounded-xl p-3.5">
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <div className="bg-emerald-500 h-2 w-2 animate-pulse rounded-full" />
                                        <span className="text-woof-gold text-[9px] font-bold tracking-wider uppercase">System Live</span>
                                    </div>
                                    <p className="text-woof-charcoal/60 text-[10px] leading-relaxed font-medium">
                                        Verified Network & Services fully active.
                                    </p>
                                </div>
                            </nav>
                        </aside>

                        {/* Page Content */}
                        <div className="min-w-0 flex-1">{children}</div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
