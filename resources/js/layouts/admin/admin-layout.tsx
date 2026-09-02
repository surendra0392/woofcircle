import { SharedData } from '@/types';
import { AdminSharedData } from '@/types/admin';
import { Link, router, usePage } from '@inertiajs/react';
import SeoHead from '@/components/SeoHead';
import {
    Briefcase,
    CalendarDays,
    ChevronDown,
    Dog,
    FileText,
    GraduationCap,
    Heart,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Megaphone,
    Menu,
    Search,
    Settings,
    ShieldAlert,
    ShieldCheck,
    ShoppingBag,
    Star,
    User,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';
import { useMessageNotifications } from '@/hooks/use-message-notifications';
import { useDeferredRoutes } from '@/hooks/use-deferred-routes';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { initAdminTheme } from '@/bootstrap';
import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────
interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

interface NavLink {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: number;
}

interface NavGroup {
    title: string;
    icon: LucideIcon;
    items: NavLink[];
}

interface NavSection {
    label: string;
    entries: NavEntry[];
}

type NavEntry = NavLink | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
    return 'items' in entry;
}

// ─── Navigation Structure ────────────────────────────────────────────────────
const navSections: NavSection[] = [
    {
        label: 'Main',
        entries: [
            { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Registry & Breeds',
        entries: [
            {
                title: 'Pet Registry',
                icon: Dog,
                items: [
                    { title: 'Pet Directory', url: '/admin/pets' },
                    { title: 'Breeds', url: '/admin/breeds' },
                    { title: 'Vaccinations', url: '/admin/vaccinations' },
                    { title: 'Medical History', url: '/admin/medical-records' },
                    { title: 'Appointments', url: '/admin/appointments' },
                ],
            },
            {
                title: 'Location',
                icon: MapPin,
                items: [
                    { title: 'States', url: '/admin/states' },
                    { title: 'Cities', url: '/admin/cities' },
                ],
            },
        ],
    },
    {
        label: 'Marketplace',
        entries: [
            {
                title: 'Marketplace',
                icon: ShoppingBag,
                items: [
                    { title: 'Breeders', url: '/admin/breeders' },
                    { title: 'Puppy Litters', url: '/admin/litters' },
                    { title: 'Stud Services', url: '/admin/stud-services' },
                    { title: 'Pet Shops', url: '/admin/pet-shops' },
                    { title: 'Transfer Requests', url: '/admin/transfer-requests' },
                ],
            },
            {
                title: 'Reviews',
                icon: Star,
                items: [
                    { title: 'All Reviews', url: '/admin/reviews' },
                ],
            },
        ],
    },
    {
        label: 'Services',
        entries: [
            {
                title: 'Professional Services',
                icon: GraduationCap,
                items: [
                    { title: 'Dog Trainers', url: '/admin/trainers' },
                    { title: 'Boarding & Daycare', url: '/admin/boarding' },
                    { title: 'Expertise Catalog', url: '/admin/trainer-specializations' },
                ],
            },
            {
                title: 'Healthcare',
                icon: ShieldCheck,
                items: [
                    { title: 'Veterinary Clinics', url: '/admin/vets' },
                    { title: 'Clinical Services', url: '/admin/vet-services' },
                ],
            },
        ],
    },
    {
        label: 'Content & Community',
        entries: [
            {
                title: 'Content & SEO',
                icon: FileText,
                items: [
                    { title: 'Articles', url: '/admin/articles' },
                    { title: 'Article Categories', url: '/admin/article-categories' },
                    { title: 'Gallery', url: '/admin/gallery' },
                    { title: 'Gallery Categories', url: '/admin/gallery-categories' },
                ],
            },
            {
                title: 'Events',
                icon: CalendarDays,
                items: [
                    { title: 'All Events', url: '/admin/events' },
                    { title: 'Event Types', url: '/admin/event-types' },
                ],
            },
            {
                title: 'Community & Welfare',
                icon: Heart,
                items: [
                    { title: 'Welfare & Rescue', url: '/admin/welfare' },
                    { title: 'Adoptions', url: '/admin/adoptions' },
                ],
            },
            {
                title: 'Careers',
                icon: Briefcase,
                items: [
                    { title: 'Positions', url: '/admin/career-positions' },
                    { title: 'Applications', url: '/admin/career-applications' },
                ],
            },
        ],
    },
    {
        label: 'System',
        entries: [
            {
                title: 'Users & Access',
                icon: Users,
                items: [
                    { title: 'Users', url: '/admin/users' },
                    { title: 'Roles', url: '/admin/roles' },
                    { title: 'Admins', url: '/admin/admins' },
                ],
            },
            {
                title: 'Communication',
                icon: Mail,
                items: [
                    { title: 'Messages', url: '/admin/messages' },
                    { title: 'Contact Messages', url: '/admin/contact-messages' },
                    { title: 'Support Tickets', url: '/admin/support-tickets' },
                    { title: 'Announcements', url: '/admin/notifications' },
                ],
            },
            {
                title: 'Monitoring',
                icon: ShieldAlert,
                items: [
                    { title: 'Ad Placements', url: '/admin/ads' },
                    { title: 'Ad Pricing', url: '/admin/ad-pricings' },
                    { title: 'Audit Logs', url: '/admin/audit-logs' },
                    { title: 'User Logs', url: '/admin/user-audit-logs' },
                ],
            },
            { title: 'Settings', url: '/admin/settings', icon: Settings },
        ],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRoleBadgeClasses(role: string): string {
    switch (role) {
        case 'superadmin':
            return 'bg-emerald-50 text-emerald-700 border-emerald-300';
        case 'admin':
            return 'bg-amber-50 text-amber-700 border-amber-300';
        case 'editor':
            return 'bg-woof-gold/10 text-woof-gold border-woof-gold/30';
        default:
            return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
}

// ─── NavLink Component ───────────────────────────────────────────────────────
function SidebarLink({ item, currentPath, collapsed, nested = false }: { item: NavLink; currentPath: string; collapsed: boolean; nested?: boolean }) {
    const isActive = currentPath === item.url;
    const Icon = nested ? undefined : item.icon;
    return (
        <Link
            href={item.url}
            className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                isActive 
                    ? 'bg-woof-charcoal text-white shadow-xs' 
                    : 'text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal'
            } ${collapsed ? 'relative justify-center' : ''} ${nested && !collapsed ? 'pl-9 text-xs' : ''}`}
            title={collapsed ? item.title : undefined}
        >
            {Icon && (
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-woof-gold' : 'text-woof-charcoal/50'}`} />
            )}
            {nested && !collapsed && (
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-woof-gold' : 'bg-woof-charcoal/20'
                }`} />
            )}
            {!collapsed && <span className="flex-1 truncate tracking-tight">{item.title}</span>}
            {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all ${
                    isActive ? 'bg-woof-gold text-woof-charcoal' : 'bg-woof-gold/15 text-woof-gold border border-woof-gold/30'
                }`}>
                    {item.badge > 99 ? '99+' : item.badge}
                </span>
            )}
        </Link>
    );
}

// ─── NavGroup Component ──────────────────────────────────────────────────────
function SidebarGroup({ group, currentPath, collapsed }: { group: NavGroup; currentPath: string; collapsed: boolean }) {
    const hasActiveChild = group.items.some((item) => currentPath === item.url);
    const storageKey = `admin_sidebar_group_${group.title.toLowerCase().replace(/\s+/g, '_')}`;
    const [open, setOpen] = usePersistedState(storageKey, hasActiveChild);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const Icon = group.icon;

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [open]);

    useEffect(() => {
        if (hasActiveChild && !open) {
            setOpen(true);
        }
    }, [hasActiveChild]);

    if (collapsed) {
        return (
            <div className="space-y-1">
                <div
                    className={`flex items-center justify-center rounded-2xl px-3.5 py-2.5 transition-colors ${hasActiveChild ? 'text-woof-charcoal bg-[#fcfbf9] border border-[#e8ded1]' : 'text-woof-charcoal/50'}`}
                    title={group.title}
                >
                    <Icon className="h-4 w-4 shrink-0" />
                </div>
                {group.items.map((item) => (
                    <SidebarLink key={item.url} item={item} currentPath={currentPath} collapsed={collapsed} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    hasActiveChild ? 'text-woof-charcoal bg-[#fcfbf9] font-bold border border-[#e8ded1]' : 'text-woof-charcoal/70 hover:text-woof-charcoal hover:bg-[#fcfbf9]'
                }`}
            >
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${hasActiveChild ? 'text-woof-gold' : 'text-woof-charcoal/50'}`} />
                <span className="flex-1 truncate text-left tracking-tight">{group.title}</span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-woof-charcoal/40 transition-transform duration-200 ${open ? 'rotate-180 text-woof-charcoal' : ''}`} />
            </button>
            <div
                className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
                style={{ maxHeight: open ? `${contentHeight}px` : '0px' }}
            >
                <div ref={contentRef} className="space-y-1 pt-1 pb-1">
                    {group.items.map((item) => (
                        <SidebarLink key={item.url} item={item} currentPath={currentPath} collapsed={collapsed} nested />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Profile Dropdown ────────────────────────────────────────────────────────
function ProfileDropdown({ admin, roleBadgeClasses }: { admin: AdminSharedData['auth']['admin']; roleBadgeClasses: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setOpen(!open)} 
                className="flex items-center gap-3 rounded-full p-1 border border-[#e8ded1] bg-white hover:bg-[#fcfbf9] transition-colors cursor-pointer shadow-2xs"
            >
                <span className={`hidden items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-flex ${roleBadgeClasses}`}>
                    {admin.role}
                </span>
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-woof-charcoal text-white text-xs font-bold shadow-xs">
                    {admin.avatar ? (
                        <img src={admin.avatar} alt={admin.name} className="h-full w-full object-cover" />
                    ) : (
                        admin.name.charAt(0).toUpperCase()
                    )}
                </div>
            </button>
            {open && (
                <div className="absolute top-full right-0 z-50 mt-2 w-60 rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-xl animate-scale-in">
                    <div className="border-b border-[#e8ded1] px-3 py-2.5 mb-1">
                        <p className="text-woof-charcoal truncate text-xs font-bold">{admin.name}</p>
                        <p className="text-woof-charcoal/60 truncate text-[11px] mt-0.5">{admin.email}</p>
                    </div>
                    <div className="space-y-0.5">
                        <Link
                            href="/admin/profile"
                            onClick={() => setOpen(false)}
                            className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-medium transition-colors ${
                                window.location.pathname === '/admin/profile'
                                    ? 'bg-woof-charcoal text-white font-bold'
                                    : 'text-woof-charcoal/80 hover:bg-[#fcfbf9] hover:text-woof-charcoal'
                            }`}
                        >
                            <User className="h-3.5 w-3.5 text-woof-gold" /> Console Profile
                        </Link>
                        <button
                            onClick={() => router.post('/admin/logout')}
                            className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
                        >
                            <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/** Map each nav section to its first linkable URL for keyboard shortcuts (1–N). */
const sectionShortcuts = navSections.map((section, idx) => {
    const first = section.entries[0];
    const url = 'url' in first ? first.url : first.items[0].url;
    return { key: idx + 1, label: section.label, url };
});

// ─── Main Layout ─────────────────────────────────────────────────────────────
export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth, settings } = usePage<AdminSharedData & SharedData>().props;
    const admin = auth.admin;
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    useDeferredRoutes('admin');

    const [globalUnreadCount, setGlobalUnreadCount] = useState(auth?.user?.unread_messages_count || 0);

    useEffect(() => {
        setGlobalUnreadCount(auth?.user?.unread_messages_count || 0);
    }, [auth?.user?.unread_messages_count]);

    useMessageNotifications({
        userId: auth?.user?.id,
        isViewingConversation: (id) =>
            window.location.pathname.includes(`/admin/messages/${id}`) ||
            window.location.pathname.includes(`/messages/${id}`),
        getConversationUrl: () => `/admin/messages`,
        onUnreadCountChange: setGlobalUnreadCount,
    });

    useEffect(initAdminTheme, []);

    // Keyboard shortcuts: press 1–N to jump to the first item in each nav section.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable) {
                return;
            }
            const num = parseInt(e.key, 10);
            if (num >= 1 && num <= sectionShortcuts.length) {
                const shortcut = sectionShortcuts[num - 1];
                if (shortcut) {
                    e.preventDefault();
                    toast.success(`⌨ Navigated to: ${shortcut.label}`, {
                        duration: 2000,
                    });
                    router.visit(shortcut.url);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        <div className="bg-[#fcfbf9] min-h-screen w-full font-sans antialiased text-woof-charcoal">
            <Toaster position="top-right" theme="light" closeButton />
            {title ? <SeoHead title={title} /> : <SeoHead />}
            
            {/* Mobile overlay */}
            {mobileOpen && <div className="fixed inset-0 z-40 bg-woof-charcoal/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}
            
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white text-woof-charcoal border-r border-[#e8ded1] shadow-xs transition-all duration-300 lg:w-64 ${
                    mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Sidebar header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#e8ded1] px-5">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
                        {settings.site_logo ? (
                            <img src={settings.site_logo} alt={settings.site_name} className="h-8 w-auto object-contain" />
                        ) : (
                            <>
                                <div className="w-9 h-9 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center shadow-2xs">
                                    {settings.site_favicon ? (
                                        <img src={settings.site_favicon} alt={settings.site_name} className="h-5 w-5 object-contain" />
                                    ) : (
                                        <Dog className="h-4.5 w-4.5" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-woof-charcoal truncate text-sm font-bold tracking-tight">
                                        {settings.site_name}
                                    </span>
                                    <span className="text-woof-gold text-[10px] font-bold uppercase tracking-wider">Console Master</span>
                                </div>
                            </>
                        )}
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="text-woof-charcoal/60 hover:bg-[#fcfbf9] hover:text-woof-charcoal rounded-full p-1.5 lg:hidden cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                    {navSections.map((section) => {
                        const processItem = (item: NavLink): NavLink => {
                            if (item.url === '/admin/contact-messages') {
                                return { ...item, badge: admin?.unread_contact_messages };
                            }
                            if (item.url === '/admin/messages') {
                                return { ...item, badge: globalUnreadCount as number };
                            }
                            if (item.url === '/admin/support-tickets') {
                                return { ...item, badge: admin?.unread_support_tickets };
                            }
                            if (item.url === '/admin/reviews') {
                                return { ...item, badge: admin?.pending_reviews };
                            }
                            return item;
                        };
                        return (
                            <div key={section.label} className="space-y-1.5">
                                <h3 className="px-3 text-[10px] font-bold tracking-wider text-woof-gold uppercase">
                                    {section.label}
                                </h3>
                                <div className="space-y-0.5">
                                    {section.entries.map((entry) => {
                                        if (isGroup(entry)) {
                                            return (
                                                <SidebarGroup
                                                    key={entry.title}
                                                    group={{ ...entry, items: entry.items.map(processItem) }}
                                                    currentPath={currentPath}
                                                    collapsed={false}
                                                />
                                            );
                                        }
                                        return <SidebarLink key={entry.url} item={processItem(entry)} currentPath={currentPath} collapsed={false} />;
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main content area */}
            <div className="flex min-h-screen flex-col transition-all duration-300 lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#e8ded1] bg-white/90 backdrop-blur-md px-6">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal rounded-2xl p-2 lg:hidden cursor-pointer"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        {title && (
                            <div className="flex items-center gap-2 mr-4">
                                <span className="text-xs text-woof-charcoal/40 font-medium">Console /</span>
                                <h1 className="text-woof-charcoal text-sm font-bold tracking-tight">{title}</h1>
                            </div>
                        )}
                        
                        {/* Desktop Search Input */}
                        <div className="relative max-w-sm w-full hidden md:block">
                            <Search className="absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                            <input
                                type="text"
                                placeholder="Search resources, records & console..."
                                className="w-full h-9 bg-[#fcfbf9] border border-[#e8ded1] rounded-full pl-9 pr-4 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus:outline-none focus:ring-2 focus:ring-woof-gold/20 transition-colors font-normal"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link href="/admin/notifications" className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-[#e8ded1] text-woof-charcoal/60 hover:bg-[#fcfbf9] hover:text-woof-charcoal transition-colors shadow-2xs" title="Announcements">
                            <Megaphone className="h-4 w-4" />
                        </Link>
                        <Link href="/admin/settings" className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-[#e8ded1] text-woof-charcoal/60 hover:bg-[#fcfbf9] hover:text-woof-charcoal transition-colors shadow-2xs" title="Settings">
                            <Settings className="h-4 w-4" />
                        </Link>
                        
                        {admin && <ProfileDropdown admin={admin} roleBadgeClasses={getRoleBadgeClasses(admin.role)} />}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 lg:p-8 space-y-6">{children}</main>
            </div>
        </div>
    );
}
