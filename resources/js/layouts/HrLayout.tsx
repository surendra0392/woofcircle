import { Link, usePage, router } from '@inertiajs/react';
import SeoHead from '@/components/SeoHead';
import { LayoutDashboard, Users, CreditCard, LogOut, TicketCheck, CalendarDays, CheckCircle2, XCircle, BookOpen, Menu, X, Search, Dog, User } from 'lucide-react';
import { useHrTicketCount } from '@/hooks/useHrTicketCount';
import { useEffect, useState, useRef } from 'react';
import { initAdminTheme } from '@/bootstrap';
import { Toaster, toast } from 'sonner';

export default function HrLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { url, props } = usePage<any>();
    const auth = props.auth;
    const admin = auth?.admin;
    const settings = props.settings || {};
    const adminId = admin?.id;
    const [mobileOpen, setMobileOpen] = useState(false);

    const [leaveNotification, setLeaveNotification] = useState<{ leaveId: number; status: string; leaveType: string } | null>(null);

    useEffect(() => {
        if (!window.Echo || !adminId) return;
        const channel = window.Echo.private(`App.Models.Admin.${adminId}`);
        channel.listen('LeaveRequestStatusChanged', (e: any) => {
            setLeaveNotification({ leaveId: e.leaveId, status: e.status, leaveType: e.leaveType });
            setTimeout(() => setLeaveNotification(null), 8000);
        });
        return () => channel.stopListening('LeaveRequestStatusChanged');
    }, [adminId]);

    const { count: ticketCount, isLive } = useHrTicketCount(
        adminId,
        admin?.hr_assigned_tickets ?? 0,
    );

    useEffect(initAdminTheme, []);

    const navItems = [
        { name: 'Dashboard', href: route('hr.dashboard'), icon: LayoutDashboard, active: url === '/hr' || url === '/hr/dashboard' },
        { name: 'Employees', href: route('hr.employees.index'), icon: Users, active: url.startsWith('/hr/employees') },
        { name: 'Leave Requests', href: route('hr.leaves.index'), icon: CalendarDays, active: url.startsWith('/hr/leaves') },
        { name: 'Payouts', href: route('hr.payouts.index'), icon: CreditCard, active: url.startsWith('/hr/payouts') },
        { name: 'Assigned Tickets', href: route('hr.tickets.index'), icon: TicketCheck, active: url.startsWith('/hr/tickets'), badge: ticketCount, live: isLive },
        { name: 'Knowledge Base', href: route('hr.knowledge-base.index'), icon: BookOpen, active: url.startsWith('/hr/knowledge-base') },
    ];

    if (admin?.has_subordinates) {
        navItems.push({ name: 'My HR Team', href: route('hr.team.index'), icon: Users, active: url.startsWith('/hr/team') });
    }

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-[#fcfbf9] min-h-screen w-full font-sans antialiased text-woof-charcoal">
            <Toaster position="top-right" theme="light" closeButton />
            {title ? <SeoHead title={title} /> : <SeoHead />}
            
            {mobileOpen && <div className="fixed inset-0 z-40 bg-woof-charcoal/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}
            
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white text-woof-charcoal border-r border-[#e8ded1] shadow-xs transition-all duration-300 lg:w-64 ${
                    mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#e8ded1] px-5">
                    <Link href="/hr/dashboard" className="flex items-center gap-3 overflow-hidden">
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
                                        {settings.site_name || 'Woof Circle'}
                                    </span>
                                    <span className="text-woof-gold text-[10px] font-bold uppercase tracking-wider">HR Portal</span>
                                </div>
                            </>
                        )}
                    </Link>
                    <button onClick={() => setMobileOpen(false)} className="text-woof-charcoal/60 hover:bg-[#fcfbf9] hover:text-woof-charcoal rounded-full p-1.5 lg:hidden cursor-pointer">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    <h3 className="px-3 py-2 text-[10px] font-bold tracking-wider text-woof-gold uppercase">
                        HR Management
                    </h3>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                                    item.active 
                                        ? 'bg-woof-charcoal text-white shadow-xs' 
                                        : 'text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal'
                                }`}
                            >
                                <Icon className={`h-4 w-4 shrink-0 transition-colors ${item.active ? 'text-woof-gold' : 'text-woof-charcoal/50'}`} />
                                <span className="flex-1 truncate">{item.name}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                                        item.active ? 'bg-woof-gold text-woof-charcoal' : 'bg-woof-gold/15 text-woof-gold border border-woof-gold/30'
                                    }`}>
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                                {item.live !== undefined && (
                                    <span
                                        className={`ml-1.5 inline-block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                                            item.live ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]' : 'bg-woof-charcoal/20'
                                        }`}
                                        title={item.live ? 'Live — real-time updates active' : 'Static'}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex min-h-screen flex-col transition-all duration-300 lg:pl-64">
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#e8ded1] bg-white/90 backdrop-blur-md px-6">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setMobileOpen(true)} className="text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal rounded-2xl p-2 lg:hidden cursor-pointer">
                            <Menu className="h-5 w-5" />
                        </button>
                        {title && (
                            <div className="flex items-center gap-2 mr-4">
                                <span className="text-xs text-woof-charcoal/40 font-medium">HR Portal /</span>
                                <h1 className="text-woof-charcoal text-sm font-bold tracking-tight">{title}</h1>
                            </div>
                        )}
                        
                        <div className="relative max-w-sm w-full hidden md:block">
                            <Search className="absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-woof-charcoal/40" />
                            <input
                                type="text"
                                placeholder="Search employees, records & policies..."
                                className="w-full h-9 bg-[#fcfbf9] border border-[#e8ded1] rounded-full pl-9 pr-4 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus:outline-none focus:ring-2 focus:ring-woof-gold/20 transition-colors font-normal"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative" ref={profileRef}>
                            <button 
                                onClick={() => setProfileOpen(!profileOpen)} 
                                className="flex items-center gap-3 rounded-full p-1 border border-[#e8ded1] bg-white hover:bg-[#fcfbf9] transition-colors cursor-pointer shadow-2xs"
                            >
                                <span className="hidden items-center rounded-full border border-woof-gold/30 bg-woof-gold/10 px-2.5 py-0.5 text-[10px] font-bold text-woof-gold uppercase tracking-wider sm:inline-flex">
                                    HR Rep
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-woof-charcoal text-white text-xs font-bold shadow-xs">
                                    {admin?.avatar ? (
                                        <img src={admin.avatar} alt={admin.name} className="h-full w-full object-cover" />
                                    ) : (
                                        admin?.name?.charAt(0).toUpperCase() || 'H'
                                    )}
                                </div>
                            </button>
                            {profileOpen && (
                                <div className="absolute top-full right-0 z-50 mt-2 w-60 rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-xl animate-scale-in">
                                    <div className="border-b border-[#e8ded1] px-3 py-2.5 mb-1">
                                        <p className="text-woof-charcoal truncate text-xs font-bold">{admin?.name}</p>
                                        <p className="text-woof-charcoal/60 truncate text-[11px] mt-0.5">{admin?.email}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <Link
                                            href={route('hr.profile.edit')}
                                            onClick={() => setProfileOpen(false)}
                                            className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-medium transition-colors ${
                                                window.location.pathname === '/hr/profile'
                                                    ? 'bg-woof-charcoal text-white font-bold'
                                                    : 'text-woof-charcoal/80 hover:bg-[#fcfbf9] hover:text-woof-charcoal'
                                            }`}
                                        >
                                            <User className="h-3.5 w-3.5 text-woof-gold" /> HR Profile
                                        </Link>
                                        <button
                                            onClick={() => router.post(route('hr.logout'))}
                                            className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
                                        >
                                            <LogOut className="h-3.5 w-3.5" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-5 lg:p-8 space-y-6">
                    {/* Leave request status notification banner */}
                    {leaveNotification && (
                        <div className={`mb-6 rounded-3xl px-5 py-4 shadow-xs border flex items-center justify-between animate-fade-in ${
                            leaveNotification.status === 'approved'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                            <div className="flex items-center gap-3">
                                {leaveNotification.status === 'approved' ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-rose-600" />
                                )}
                                <div>
                                    <p className="text-sm font-bold tracking-tight">
                                        Leave Request {leaveNotification.status === 'approved' ? 'Approved' : 'Rejected'}
                                    </p>
                                    <p className="text-xs text-woof-charcoal/70 mt-0.5 font-normal">
                                        Your {leaveNotification.leaveType.replace('_', ' ')} leave request
                                        (ID: {leaveNotification.leaveId}) was {leaveNotification.status}.
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setLeaveNotification(null)} className="text-lg leading-none text-woof-charcoal/40 hover:text-woof-charcoal transition-opacity cursor-pointer">
                                &times;
                            </button>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
