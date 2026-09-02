import AppLogo from '@/components/app-logo';
import {
    ArrowRight,
    ArrowRightLeft,
    Award,
    ChevronDown,
    Command,
    Compass,
    CornerDownLeft,
    Crown,
    GraduationCap,
    Heart,
    Home,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    MessageSquare,
    QrCode,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Stethoscope,
    User,
    X,
} from 'lucide-react';
import { LocationModal } from '../LocationModal';
import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { getInitials } from '@/hooks/use-initials';
// framer-motion replaced with CSS animations (lightweight fade/slide)

export default function Navbar() {
    const { props } = usePage<SharedData>();
    const { auth, user_location } = props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [headerSearch, setHeaderSearch] = useState('');

    const handleHeaderSearch = () => {
        if (!headerSearch.trim()) return;
        window.location.href = route('marketplace.index', { search: headerSearch });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchExpanded((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        
        // Auto-detect location if not set and not prompted in this session
        if (!user_location && typeof window !== 'undefined' && 'geolocation' in navigator) {
            if (!sessionStorage.getItem('location_prompted')) {
                sessionStorage.setItem('location_prompted', 'true');
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        import('@inertiajs/react').then(({ router }) => {
                            router.post('/api/location/set', {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }, { preserveScroll: true });
                        });
                    },
                    (error) => {
                        console.log('User denied or geolocation failed auto-detect.');
                    },
                    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
                );
            }
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [user_location]);

    const marketplaceLinks = [
        { name: 'Puppies', href: route('marketplace.index') },
        { name: 'Breeders', href: route('marketplace.breeders.index') },
        { name: 'Adoption', href: route('marketplace.adoption.index') },
        { name: 'Studs', href: route('marketplace.studs.index') },
    ];

    const directoryLinks = [
        { name: 'Veterinary Experts', href: route('directory.vets'), icon: Stethoscope, desc: 'Advanced clinical care' },
        { name: 'Master Trainers', href: route('directory.trainers'), icon: GraduationCap, desc: 'Behavioral excellence' },
        { name: 'Grand Boarding', href: route('directory.boarding'), icon: Home, desc: 'Bespoke pet stays' },
        { name: 'Animal Welfare', href: route('directory.welfare'), icon: ShieldCheck, desc: 'Ethical rescue support' },
        { name: 'Luxury Boutiques', href: route('directory.pet-shops'), icon: ShoppingBag, desc: 'Artisanal pet supplies' },
    ];

    const communityLinks = [
        { name: 'Knowledge Base', href: route('community.articles.index'), icon: ArrowRight, desc: 'Curated pet care wisdom' },
        { name: 'Community Forum', href: route('forum.index'), icon: MessageSquare, desc: 'Discuss & share advice' },
        { name: 'Gallery', href: route('community.gallery.index'), icon: ImageIcon, desc: 'Visual sanctuary' },
        { name: 'Events', href: route('community.events.index'), icon: Sparkles, desc: 'Shows & meetups' },
        { name: 'Lost Pets', href: route('lost-pets.index'), icon: ShieldCheck, desc: 'Reunite families' },
    ];

    const { url } = usePage();
    const isActive = (href: string) => {
        try {
            const path = href.startsWith('http') ? new URL(href).pathname : href;
            if (path === '/') return url === '/';
            return url.startsWith(path);
        } catch {
            return false;
        }
    };

    const navLinkClass = (href: string) => {
        const active = isActive(href);
        return `text-[10px] font-black uppercase tracking-[0.2em] transition-all px-2 py-1 font-sans ${active ? 'text-woof-gold' : 'text-woof-charcoal/70 hover:text-woof-gold'}`;
    };

    const navButtonClass = (isActive: boolean) =>
        `text-[10px] font-black uppercase tracking-[0.2em] transition-all px-2 py-1 flex items-center gap-1 outline-none group font-sans ${isActive ? 'text-woof-gold' : 'text-woof-charcoal/70 hover:text-woof-charcoal'}`;

    return (
        <>
            <header
                className={`border-woof-charcoal/5 fixed inset-x-0 top-0 z-[100] border-b bg-white/90 backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'py-3 shadow-md shadow-woof-charcoal/5' : 'py-4 sm:py-5'}`}
            >
                <div className="container-wide flex items-center justify-between">
                    {/* --- LOGO SECTION --- */}
                    <Link href={route('home')} className="flex shrink-0 items-center transition-transform hover:scale-102">
                        <AppLogo className="h-8 w-auto text-gray-900" />
                    </Link>

                    {/* --- DESKTOP NAVIGATION --- */}
                    <nav className="hidden items-center justify-center gap-1.5 lg:gap-3 lg:flex flex-1 px-4">
                        {/* Marketplace */}
                        {marketplaceLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={navLinkClass(link.href)}>
                                {link.name}
                            </Link>
                        ))}

                        {/* Directory */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={navButtonClass(url.startsWith('/directory'))}>
                                    Directory <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="center"
                                className="border-[#e8ded1] mt-3 w-[340px] rounded-2xl border bg-white/95 backdrop-blur-xl p-3 shadow-xl z-[150]"
                            >
                                <div className="space-y-1">
                                    <div className="border-woof-charcoal/5 mb-1.5 border-b px-3 pt-1 pb-2">
                                        <p className="text-woof-charcoal text-[10px] font-black tracking-[0.25em] uppercase">Expert Network</p>
                                    </div>
                                    {directoryLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`group/item flex items-start gap-3 rounded-xl p-2.5 transition-all ${isActive(link.href) ? 'bg-woof-cream text-woof-gold' : 'hover:bg-woof-cream/80'}`}
                                        >
                                            <div
                                                className={`mt-0.5 shrink-0 rounded-lg p-2 transition-transform group-hover/item:scale-105 ${isActive(link.href) ? 'bg-woof-gold text-white shadow-sm' : 'bg-woof-cream text-woof-gold group-hover/item:bg-woof-gold group-hover/item:text-white'}`}
                                            >
                                                <link.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div
                                                    className={`text-[11px] font-bold tracking-tight uppercase transition-colors ${isActive(link.href) ? 'text-woof-gold' : 'text-woof-charcoal group-hover/item:text-woof-gold'}`}
                                                >
                                                    {link.name}
                                                </div>
                                                <div className="text-woof-charcoal/50 mt-0.5 text-[9px] font-medium tracking-wide">
                                                    {link.desc}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="border-woof-charcoal/5 mt-2 border-t px-2 pt-2">
                                        <Link
                                            href={route('directory.index')}
                                            className="text-woof-gold hover:text-woof-charcoal flex items-center gap-1.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase transition-all"
                                        >
                                            View Full Directory <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Breedpedia */}
                        <Link href={route('breeds.index')} className={navLinkClass(route('breeds.index'))}>
                            Breeds
                        </Link>

                        {/* Community */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={navButtonClass(url.startsWith('/events') || url.startsWith('/articles') || url.startsWith('/gallery'))}>
                                    Community <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="mt-3 w-[300px] rounded-2xl border border-[#e8ded1] bg-white/95 backdrop-blur-xl p-3 shadow-xl z-[150]">
                                <div className="space-y-1">
                                    <div className="border-woof-charcoal/5 mb-1.5 border-b px-3 pt-1 pb-2">
                                        <p className="text-woof-charcoal text-[10px] font-black tracking-[0.25em] uppercase">The Circle</p>
                                    </div>
                                    {communityLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`group/item flex items-start gap-3 rounded-xl p-2.5 transition-all ${isActive(link.href) ? 'bg-woof-cream' : 'hover:bg-woof-cream/80'}`}
                                        >
                                            <div
                                                className={`mt-0.5 shrink-0 rounded-lg p-2 transition-transform group-hover/item:scale-105 ${isActive(link.href) ? 'bg-woof-gold text-white shadow-sm' : 'bg-woof-cream text-woof-gold group-hover/item:bg-woof-gold group-hover/item:text-white'}`}
                                            >
                                                <link.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div
                                                    className={`text-[11px] font-bold tracking-tight uppercase transition-colors ${isActive(link.href) ? 'text-woof-gold' : 'text-woof-charcoal group-hover/item:text-woof-gold'}`}
                                                >
                                                    {link.name}
                                                </div>
                                                <div className="text-woof-charcoal/50 mt-0.5 text-[9px] font-medium tracking-wide">
                                                    {link.desc}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* --- ACTIONS --- */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            onClick={() => setIsLocationModalOpen(true)}
                            className="text-woof-charcoal hover:text-woof-gold hover:bg-woof-cream/80 cursor-pointer hidden h-10 flex-row gap-2 px-3.5 items-center justify-center rounded-full border border-woof-charcoal/10 transition-all sm:flex"
                            aria-label="Location"
                        >
                            <MapPin className="h-4 w-4 text-woof-gold" />
                            <span className="text-[10px] font-bold tracking-wider uppercase truncate max-w-[110px]">
                                {user_location ? user_location.name : 'Location'}
                            </span>
                        </button>
                        <button
                            onClick={() => setIsSearchExpanded(true)}
                            className="text-woof-charcoal hover:text-woof-gold hover:bg-woof-cream/80 cursor-pointer hidden h-10 w-10 items-center justify-center rounded-full border border-woof-charcoal/10 transition-all sm:flex"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </button>

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative h-10 w-10 rounded-full p-0.5 border-2 border-woof-gold/30 hover:border-woof-gold transition-all flex items-center justify-center outline-none">
                                        <Avatar className="h-full w-full overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar_url || auth.user.avatar} alt={auth.user.name} className="object-cover" />
                                            <AvatarFallback className="bg-woof-gold rounded-full text-xs font-black text-white uppercase">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="border-[#e8ded1] w-56 rounded-2xl bg-white/95 backdrop-blur-xl p-2 shadow-xl z-[150]" align="end">
                                    <div className="flex flex-col px-3 py-2 border-b border-woof-charcoal/5 mb-1.5 leading-none">
                                        <span className="truncate text-woof-charcoal text-[11px] font-bold tracking-tight uppercase">{auth.user.name}</span>
                                        <span className="truncate text-woof-charcoal/50 text-[9px] tracking-wide mt-1 font-sans">{auth.user.email}</span>
                                    </div>
                                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                                        <Link
                                            href={route('dashboard')}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-woof-charcoal hover:text-woof-gold hover:bg-woof-cream transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4 shrink-0 text-woof-gold" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-woof-charcoal hover:text-woof-gold hover:bg-woof-cream transition-colors"
                                        >
                                            <User className="h-4 w-4 shrink-0 text-woof-gold" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                                        <Link
                                            href={route('subscription.pricing')}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-woof-charcoal hover:text-woof-gold hover:bg-woof-cream transition-colors"
                                        >
                                            <Crown className="h-4 w-4 shrink-0 text-woof-gold" />
                                            Membership & Plans
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-woof-charcoal/5 my-1.5" />
                                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-rose-600 hover:bg-rose-50 transition-colors text-left"
                                        >
                                            <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden items-center gap-3 sm:flex">
                                <Button
                                    asChild
                                    variant="default"
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-white h-10 rounded-full px-5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm transition-all"
                                >
                                    <Link href={route('login')}>Sign In / Join</Link>
                                </Button>
                            </div>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="text-woof-charcoal hover:bg-woof-gold flex h-12 w-12 items-center justify-center rounded-none transition-all lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- SEARCH OVERLAY --- */}
            {isSearchExpanded && (
                <div className="animate-fade-in fixed inset-0 z-[110] flex items-start justify-center bg-woof-charcoal/50 px-4 pt-20 sm:pt-28 backdrop-blur-xl">
                    {/* Backdrop dismiss */}
                    <div className="absolute inset-0" onClick={() => setIsSearchExpanded(false)} />

                    <div className="animate-fade-in-up relative w-full max-w-2xl">
                        {/* Main Card */}
                        <div className="relative overflow-hidden rounded-[28px] border border-[#e8ded1] bg-white shadow-2xl">
                            {/* Decorative top accent bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-woof-gold via-woof-champagne to-woof-pearl" />

                            <div className="p-6 sm:p-8">
                                {/* Header Row */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-woof-cream border border-[#e8ded1]">
                                            <img src="/images/favicon.png" alt="WoofCircle" className="h-5 w-5 object-contain" />
                                        </div>
                                        <div>
                                            <h2 className="text-woof-charcoal font-sans text-lg font-black tracking-tight uppercase leading-none">
                                                Search <span className="text-woof-gold">WoofCircle</span>
                                            </h2>
                                            <p className="mt-0.5 text-[10px] font-medium tracking-wide text-woof-charcoal/40">
                                                Find breeders, puppies, vets & more
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsSearchExpanded(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e8ded1] bg-woof-cream/60 text-woof-charcoal/40 transition-all hover:bg-woof-gold/10 hover:text-woof-charcoal hover:border-woof-gold/30"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {/* Search Input */}
                                <div className="group relative mb-6">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-woof-gold/10">
                                        <Search className="h-4 w-4 text-woof-gold" />
                                    </div>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search breeders, puppies, clinics, breeds..."
                                        value={headerSearch}
                                        onChange={(e) => setHeaderSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleHeaderSearch();
                                            if (e.key === 'Escape') setIsSearchExpanded(false);
                                        }}
                                        className="h-14 w-full rounded-2xl border border-[#e8ded1] bg-woof-cream/40 pl-14 pr-24 font-sans text-[15px] font-semibold text-woof-charcoal placeholder:text-woof-charcoal/30 shadow-inner transition-all focus:border-woof-gold/40 focus:bg-white focus:ring-2 focus:ring-woof-gold/20 focus:outline-none"
                                    />
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1.5">
                                        <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-[#e8ded1] bg-woof-cream/80 px-1.5 font-mono text-[10px] font-medium text-woof-charcoal/40">
                                            <CornerDownLeft className="h-3 w-3" /> Enter
                                        </kbd>
                                        <button
                                            onClick={handleHeaderSearch}
                                            className="flex h-8 items-center gap-1 rounded-xl bg-woof-gold px-3 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:bg-woof-champagne active:scale-95"
                                        >
                                            <Search className="h-3 w-3" /> Go
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Navigate Grid */}
                                <div className="mb-5">
                                    <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-woof-charcoal/35 uppercase">
                                        Quick Navigate
                                    </p>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        {[
                                            { label: 'Puppies', icon: Heart, href: route('marketplace.index') },
                                            { label: 'Breeds', icon: Award, href: route('breeds.index') },
                                            { label: 'Studs', icon: ShieldCheck, href: route('marketplace.studs.index') },
                                            { label: 'Adoption', icon: Sparkles, href: route('marketplace.adoption.index') },
                                            { label: 'Vets', icon: Stethoscope, href: route('directory.vets') },
                                            { label: 'Trainers', icon: GraduationCap, href: route('directory.trainers') },
                                        ].map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setIsSearchExpanded(false)}
                                                className="group/nav flex flex-col items-center gap-1.5 rounded-2xl border border-[#e8ded1] bg-woof-cream/30 p-3 transition-all hover:border-woof-gold/30 hover:bg-woof-gold/5 hover:shadow-sm active:scale-95"
                                            >
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#e8ded1] shadow-2xs transition-all group-hover/nav:border-woof-gold/20 group-hover/nav:shadow-sm">
                                                    <item.icon className="h-4 w-4 text-woof-gold transition-transform group-hover/nav:scale-110" />
                                                </div>
                                                <span className="text-[10px] font-bold tracking-wide text-woof-charcoal/60 uppercase group-hover/nav:text-woof-charcoal">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Trending Searches */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-bold tracking-[0.15em] text-woof-charcoal/35 uppercase">
                                        Trending
                                    </span>
                                    {[
                                        'Golden Retriever', 'German Shepherd', 'Labrador', 'Pomeranian', 'Beagle', 'Shih Tzu',
                                    ].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => { setHeaderSearch(term); handleHeaderSearch(); }}
                                            className="flex items-center gap-1 rounded-full border border-[#e8ded1] bg-woof-cream/40 px-3 py-1 text-[10px] font-bold tracking-wide text-woof-charcoal/50 uppercase transition-all hover:border-woof-gold/30 hover:bg-woof-gold/5 hover:text-woof-gold active:scale-95"
                                        >
                                            <Sparkles className="h-2.5 w-2.5" />
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-[#e8ded1] bg-woof-cream/30 px-6 py-3 sm:px-8">
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-woof-charcoal/30">
                                        <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#e8ded1] bg-white font-mono text-[9px]">
                                            <Command className="h-2.5 w-2.5" />
                                        </kbd>
                                        <span>+</span>
                                        <kbd className="inline-flex h-5 items-center justify-center rounded border border-[#e8ded1] bg-white px-1 font-mono text-[9px]">
                                            K
                                        </kbd>
                                        <span className="ml-1">to search</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsSearchExpanded(false)}
                                    className="text-[10px] font-bold tracking-wider text-woof-charcoal/30 uppercase transition-colors hover:text-woof-charcoal/60"
                                >
                                    Esc to close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LOCATION MODAL --- */}
            <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />

            {/* --- MOBILE MENU --- */}
            {mobileMenuOpen && (
                <div className="animate-slide-in-right fixed inset-0 z-[120] flex flex-col overflow-y-auto bg-white px-6 py-24">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-woof-gold text-white absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all active:scale-95"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="flex flex-col gap-10">
                        <p className="text-woof-charcoal/50 border-woof-gold/10 border-b pb-6 text-[10px] font-black tracking-[0.4em] uppercase">
                            Menu
                        </p>
                        {[
                            ...marketplaceLinks,
                            { name: 'Directory', href: route('directory.index') },
                            { name: 'Breeds', href: route('breeds.index') },
                            { name: 'Pricing', href: route('subscription.pricing') },
                            { name: 'Events', href: route('community.events.index') },
                            { name: 'Articles', href: route('community.articles.index') },
                            { name: 'Gallery', href: route('community.gallery.index') },
                        ].map((link, i) => (
                            <div
                                key={link.name}
                                className="animate-fade-in-left"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <Link
                                    href={link.href}
                                    className={`block py-3 font-sans text-6xl leading-none font-black tracking-tighter uppercase transition-all ${isActive(link.href) ? 'text-woof-gold' : 'text-woof-charcoal hover:text-woof-gold'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </div>
                        ))}

                        {auth.user ? (
                            <div className="border-woof-gold/10 mt-12 flex flex-col gap-4 border-t pt-12">
                                <div className="flex items-center gap-3 mb-4 p-4 border border-[#e8ded1] bg-white rounded-3xl shadow-xs">
                                    <Avatar className="h-12 w-12 overflow-hidden rounded-full border border-woof-gold/30">
                                        <AvatarImage src={auth.user.avatar_url || auth.user.avatar} alt={auth.user.name} className="object-cover" />
                                        <AvatarFallback className="bg-woof-gold rounded-full text-sm font-black text-white uppercase">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left leading-none">
                                        <span className="truncate text-woof-charcoal text-[11px] font-black tracking-[0.2em] uppercase">{auth.user.name}</span>
                                        <span className="truncate text-woof-charcoal/40 text-[9px] tracking-widest mt-1 uppercase font-sans">{auth.user.email}</span>
                                    </div>
                                </div>
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-16 rounded-none text-base font-black tracking-widest text-white uppercase transition-all flex items-center justify-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={route('dashboard')}>
                                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-woof-gold/20 text-woof-charcoal hover:bg-woof-cream h-16 rounded-none text-base font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={route('subscription.pricing')}>
                                        <Crown className="h-5 w-5 shrink-0 text-woof-gold" />
                                        Membership & Plans
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-woof-gold/20 text-woof-charcoal hover:bg-woof-cream h-16 rounded-none text-base font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={route('profile.edit')}>
                                        <User className="h-5 w-5 shrink-0 text-woof-gold" />
                                        Profile
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-red-100 text-red-600 hover:bg-red-50 h-16 rounded-none text-base font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={route('logout')} method="post" as="button" className="w-full">
                                        <LogOut className="h-5 w-5 shrink-0 text-red-500" />
                                        Logout
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="border-woof-gold/10 mt-12 flex flex-col gap-6 border-t pt-12">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-20 rounded-none text-xl font-black tracking-widest text-white uppercase shadow-2xl transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={route('register')}>Create Account</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-woof-gold/20 text-woof-charcoal hover:bg-woof-cream h-20 rounded-none text-xl font-black tracking-widest uppercase transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={route('login')}>Sign In</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
