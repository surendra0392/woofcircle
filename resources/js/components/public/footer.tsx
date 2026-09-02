import AppLogo from '@/components/app-logo';
import { SharedData } from '@/types';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Facebook, Heart, Instagram, Phone, Twitter, Youtube, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
export default function Footer() {
    const { settings, flash } = usePage<SharedData>().props;
    const currentYear = new Date().getFullYear();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
    });

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };
    const sections = [
        {
            title: 'Discovery',
            links: [
                { name: 'Puppies for Sale', href: route('marketplace.index') },
                { name: 'Find Breeders', href: route('marketplace.breeders.index') },
                { name: 'Adoption Center', href: route('marketplace.adoption.index') },
                { name: 'Stud Services', href: route('marketplace.studs.index') },
                { name: 'Breed Directory', href: route('breeds.index') },
            ],
        },
        {
            title: 'Professional Care',
            links: [
                { name: 'Veterinary Clinics', href: route('directory.vets') },
                { name: 'Expert Trainers', href: route('directory.trainers') },
                { name: 'Boarding & Daycare', href: route('directory.boarding') },
                { name: 'Welfare & Rescue', href: route('directory.welfare') },
            ],
        },
        {
            title: 'Community',
            links: [
                { name: 'Community Forum', href: route('forum.index') },
                { name: 'Pet Journal (Blog)', href: route('community.articles.index') },
                { name: 'Pet Shops', href: route('directory.pet-shops') },
                { name: 'Community Events', href: route('community.events.index') },
                { name: 'Photo Gallery', href: route('community.gallery.index') },
                { name: 'Healthy Habits', href: route('community.articles.index', { category_id: 3 }) },
            ],
        },
        {
            title: 'Platform',
            links: [
                { name: `About ${settings.site_name}`, href: route('about') },
                { name: 'Contact Us', href: route('contact') },
                { name: 'Help Center', href: route('help-center') },
                { name: 'Membership & Pricing', href: route('subscription.pricing') },
                { name: 'Careers', href: route('careers') },
                { name: 'Pet Passport Verification', href: route('pets.passport.index') },
                { name: 'Terms & Ethics', href: route('terms-and-ethics') },
                { name: 'Privacy Policy', href: route('privacy-policy') },
            ],
        },
    ];
    const seoSections = [
        {
            title: 'Popular Breeds',
            links: [
                { name: 'Golden Retriever', href: route('marketplace.index', { search: 'Golden Retriever' }) },
                { name: 'German Shepherd', href: route('marketplace.index', { search: 'German Shepherd' }) },
                { name: 'Labrador Retriever', href: route('marketplace.index', { search: 'Labrador' }) },
                { name: 'Beagle Puppies', href: route('marketplace.index', { search: 'Beagle' }) },
                { name: 'Rottweiler', href: route('marketplace.index', { search: 'Rottweiler' }) },
                { name: 'Pug Puppies', href: route('marketplace.index', { search: 'Pug' }) },
                { name: 'Shih Tzu', href: route('marketplace.index', { search: 'Shih Tzu' }) },
                { name: 'Siberian Husky', href: route('marketplace.index', { search: 'Husky' }) },
            ],
        },
        {
            title: 'Puppies by City',
            links: [
                { name: 'Puppies in Delhi', href: '/delhi/puppies' },
                { name: 'Puppies in Mumbai', href: '/mumbai/puppies' },
                { name: 'Puppies in Bangalore', href: '/bangalore/puppies' },
                { name: 'Puppies in Chennai', href: '/chennai/puppies' },
                { name: 'Puppies in Hyderabad', href: '/hyderabad/puppies' },
                { name: 'Puppies in Pune', href: '/pune/puppies' },
                { name: 'Puppies in Kolkata', href: '/kolkata/puppies' },
                { name: 'Puppies in Ahmedabad', href: '/ahmedabad/puppies' },
            ],
        },
        {
            title: 'Breeders by City',
            links: [
                { name: 'Breeders in Delhi', href: '/delhi/breeders' },
                { name: 'Breeders in Mumbai', href: '/mumbai/breeders' },
                { name: 'Breeders in Bangalore', href: '/bangalore/breeders' },
                { name: 'Breeders in Chennai', href: '/chennai/breeders' },
                { name: 'Breeders in Hyderabad', href: '/hyderabad/breeders' },
                { name: 'Breeders in Pune', href: '/pune/breeders' },
                { name: 'Breeders in Kolkata', href: '/kolkata/breeders' },
                { name: 'Breeders in Jaipur', href: '/jaipur/breeders' },
            ],
        },
        {
            title: 'Vets by City',
            links: [
                { name: 'Vets in Delhi', href: '/delhi/vets' },
                { name: 'Vets in Mumbai', href: '/mumbai/vets' },
                { name: 'Vets in Bangalore', href: '/bangalore/vets' },
                { name: 'Vets in Chennai', href: '/chennai/vets' },
                { name: 'Vets in Hyderabad', href: '/hyderabad/vets' },
                { name: 'Vets in Pune', href: '/pune/vets' },
                { name: 'Vets in Kolkata', href: '/kolkata/vets' },
                { name: 'Vets in Lucknow', href: '/lucknow/vets' },
            ],
        },
        {
            title: 'Trainers by City',
            links: [
                { name: 'Trainers in Delhi', href: '/delhi/trainers' },
                { name: 'Trainers in Mumbai', href: '/mumbai/trainers' },
                { name: 'Trainers in Bangalore', href: '/bangalore/trainers' },
                { name: 'Trainers in Chennai', href: '/chennai/trainers' },
                { name: 'Trainers in Hyderabad', href: '/hyderabad/trainers' },
                { name: 'Trainers in Pune', href: '/pune/trainers' },
                { name: 'Trainers in Kolkata', href: '/kolkata/trainers' },
                { name: 'Trainers in Ahmedabad', href: '/ahmedabad/trainers' },
            ],
        },
        {
            title: 'Adoption by City',
            links: [
                { name: 'Adopt in Delhi', href: '/delhi/adoptions' },
                { name: 'Adopt in Mumbai', href: '/mumbai/adoptions' },
                { name: 'Adopt in Bangalore', href: '/bangalore/adoptions' },
                { name: 'Adopt in Chennai', href: '/chennai/adoptions' },
                { name: 'Adopt in Hyderabad', href: '/hyderabad/adoptions' },
                { name: 'Adopt in Pune', href: '/pune/adoptions' },
                { name: 'Adopt in Kolkata', href: '/kolkata/adoptions' },
                { name: 'Adopt in Jaipur', href: '/jaipur/adoptions' },
            ],
        },
        {
            title: 'Pet Shops & Boarding',
            links: [
                { name: 'Pet Shops in Delhi', href: '/delhi/pet-shops' },
                { name: 'Pet Shops in Mumbai', href: '/mumbai/pet-shops' },
                { name: 'Pet Shops in Bangalore', href: '/bangalore/pet-shops' },
                { name: 'Boarding in Delhi', href: '/delhi/boarding' },
                { name: 'Boarding in Mumbai', href: '/mumbai/boarding' },
                { name: 'Boarding in Bangalore', href: '/bangalore/boarding' },
                { name: 'Boarding in Pune', href: '/pune/boarding' },
                { name: 'Boarding in Chennai', href: '/chennai/boarding' },
            ],
        },
        {
            title: 'Stud Services',
            links: [
                { name: 'Studs in Delhi', href: '/delhi/studs' },
                { name: 'Studs in Mumbai', href: '/mumbai/studs' },
                { name: 'Studs in Bangalore', href: '/bangalore/studs' },
                { name: 'Studs in Chennai', href: '/chennai/studs' },
                { name: 'Studs in Hyderabad', href: '/hyderabad/studs' },
                { name: 'Studs in Pune', href: '/pune/studs' },
                { name: 'Studs in Kolkata', href: '/kolkata/studs' },
                { name: 'Studs in Ahmedabad', href: '/ahmedabad/studs' },
            ],
        },
        {
            title: 'Quick Discovery',
            links: [
                { name: 'Guard Dogs for Sale', href: route('marketplace.index', { search: 'Guard' }) },
                { name: 'Family Friendly Puppies', href: route('marketplace.index', { search: 'Family' }) },
                { name: 'Small Breed Puppies', href: route('marketplace.index', { search: 'Small' }) },
                { name: 'KCI Registered Dogs', href: route('marketplace.index', { kci_registered: true }) },
                { name: 'Show Quality Puppies', href: route('marketplace.index', { is_champion: true }) },
                { name: 'Toy Breeds India', href: route('marketplace.index', { search: 'Toy' }) },
                { name: 'Champion Sired Pups', href: route('marketplace.index', { is_champion: true }) },
                { name: 'Vaccinated Puppies', href: route('marketplace.index', { search: 'vaccinated' }) },
            ],
        },
        {
            title: 'Professional Hub',
            links: [
                { name: 'Become a Verified Breeder', href: route('register') },
                { name: 'List your Vet Clinic', href: route('register') },
                { name: 'Register as Dog Trainer', href: route('register') },
                { name: 'Pet Boarding Registration', href: route('register') },
                { name: 'Pet Shop Onboarding', href: route('register') },
                { name: 'Welfare Organization', href: route('register') },
            ],
        },
    ];
    return (
        <footer className="bg-woof-charcoal border-t border-white/5 pt-32 pb-16">
            <div className="container-wide px-6 lg:px-12">
                <div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-6">
                    <div className="space-y-8 lg:col-span-2">
                        <Link href={route('home')} className="group inline-flex flex-col items-start transition-transform duration-300 hover:scale-[1.02]">
                            <AppLogo variant="full" imgClassName="h-11 w-auto object-contain" />
                        </Link>
                        <p className="text-white/70 max-w-sm text-xs leading-relaxed font-normal">
                            {settings.site_description}
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: Facebook, url: settings.social_facebook },
                                { Icon: Twitter, url: settings.social_twitter },
                                { Icon: Instagram, url: settings.social_instagram },
                                { Icon: Youtube, url: settings.social_youtube },
                            ].map(({ Icon, url }, i) => (
                                <a
                                    key={i}
                                    href={url}
                                    className="text-woof-cream hover:bg-woof-gold hover:text-woof-charcoal hover:border-woof-gold flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-xs transition-all hover:-translate-y-0.5"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
                        {sections.map((section) => (
                            <div key={section.title} className="space-y-6">
                                <h4 className="text-woof-gold border-woof-gold/20 border-b pb-3 text-xs font-bold tracking-wider uppercase">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3.5">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-white/75 hover:text-woof-gold block text-xs font-normal tracking-wide transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-20 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 md:grid-cols-3 lg:grid-cols-5">
                    {seoSections.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="text-woof-gold border-b border-woof-gold/15 pb-2 text-[11px] font-bold tracking-wider uppercase">
                                {section.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/60 hover:text-woof-gold block text-[11px] font-normal tracking-wide transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {/* Newsletter Subscription Section */}
                <div className="mb-20 border-t border-white/10 pt-12">
                    <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-12">
                        <div className="space-y-2 text-center lg:col-span-5 lg:text-left">
                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase block">
                                Join Our Community & Newsletter
                            </span>
                            <h3 className="font-sans text-2xl font-black uppercase tracking-tight text-white md:text-3xl leading-tight">
                                Stay Connected With <br /> <span className="text-woof-gold">Woof Circle</span>
                            </h3>
                            <p className="text-woof-on-dark/70 text-xs font-normal">
                                Subscribe for expert pet care guides, breeder listings, and exclusive community news.
                            </p>
                        </div>

                        <div className="lg:col-span-7">
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                {flash?.success && (
                                    <div className="flex items-center gap-3 border border-[#bb8b62]/40 bg-[#bb8b62]/10 p-3 rounded-2xl text-xs font-semibold text-[#bb8b62]">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bb8b62]" />
                                        <span>{flash.success}</span>
                                    </div>
                                )}
                                {flash?.info && (
                                    <div className="flex items-center gap-3 border border-amber-500/30 bg-amber-500/10 p-3 rounded-2xl text-xs font-semibold text-amber-300">
                                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                                        <span>{flash.info}</span>
                                    </div>
                                )}
                                {flash?.error && (
                                    <div className="flex items-center gap-3 border border-red-500/30 bg-red-500/10 p-3 rounded-2xl text-xs font-semibold text-red-300">
                                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                                        <span>{flash.error}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2.5 sm:flex-row">
                                    <input
                                        type="text"
                                        placeholder="Your Name (Optional)"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="flex-1 border border-white/15 bg-white/5 px-5 py-3 rounded-full text-xs text-white placeholder:text-white/40 focus:border-woof-gold focus:outline-none focus:ring-1 focus:ring-woof-gold transition-colors"
                                    />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Your Email Address *"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="flex-1 border border-white/15 bg-white/5 px-5 py-3 rounded-full text-xs text-white placeholder:text-white/40 focus:border-woof-gold focus:outline-none focus:ring-1 focus:ring-woof-gold transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-woof-gold text-woof-charcoal hover:bg-white flex shrink-0 items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Mail className="h-4 w-4" />
                                                Subscribe
                                            </>
                                        )}
                                    </button>
                                </div>
                                {errors.email && (
                                    <p className="text-xs font-medium text-red-400 pl-1">{errors.email}</p>
                                )}
                                {errors.name && (
                                    <p className="text-xs font-medium text-red-400 pl-1">{errors.name}</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-12 md:flex-row">
                    <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
                        <p className="text-white/50 text-[11px] font-medium tracking-wider uppercase">
                            &copy; {currentYear} {settings.site_name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-8">
                            <Link
                                href={route('privacy-policy')}
                                className="text-white/60 hover:text-woof-gold text-[11px] font-medium tracking-wider uppercase transition-colors"
                            >
                                Privacy
                            </Link>
                            <Link
                                href={route('terms-and-ethics')}
                                className="text-white/60 hover:text-woof-gold text-[11px] font-medium tracking-wider uppercase transition-colors"
                            >
                                Terms
                            </Link>
                            <Link
                                href={route('help-center')}
                                className="text-white/60 hover:text-woof-gold text-[11px] font-medium tracking-wider uppercase transition-colors"
                            >
                                Help
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-white/50 flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase">
                            Curated with <Heart className="text-woof-gold fill-woof-gold h-3.5 w-3.5 animate-pulse" /> for Dogs
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
