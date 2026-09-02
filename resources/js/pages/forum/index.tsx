import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Brain,
    Clock,
    Compass,
    Dna,
    Eye,
    HeartPulse,
    HelpCircle,
    LayoutDashboard,
    MessageCircle,
    MessageSquare,
    PenSquare,
    ShieldCheck,
    ShoppingBag,
    Smile,
    Sparkles,
    TrendingUp,
    User,
    Users,
    Zap,
} from 'lucide-react';
import React from 'react';

// Icon Map with fallbacks
const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
        case 'HeartPulse':
            return <HeartPulse className="h-6 w-6 stroke-[1.75]" />;
        case 'Brain':
            return <Brain className="h-6 w-6 stroke-[1.75]" />;
        case 'Dna':
            return <Dna className="h-6 w-6 stroke-[1.75]" />;
        case 'ShoppingBag':
            return <ShoppingBag className="h-6 w-6 stroke-[1.75]" />;
        case 'Smile':
            return <Smile className="h-6 w-6 stroke-[1.75]" />;
        default:
            return <MessageSquare className="h-6 w-6 stroke-[1.75]" />;
    }
};

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    threads_count: number;
}

interface Thread {
    id: number;
    title: string;
    slug: string;
    view_count: number;
    reply_count: number;
    created_at: string;
    category: Category;
    user: { name: string; id: number };
}

interface ForumIndexProps {
    categories: Category[];
    latestThreads: Thread[];
    stats?: {
        categories_count: number;
        threads_count: number;
        replies_count: number;
    };
}

export default function ForumIndex({ categories = [], latestThreads = [], stats }: ForumIndexProps) {
    const { settings } = usePage<SharedData>().props;

    const totalThreads = stats?.threads_count ?? categories.reduce((acc, cat) => acc + (cat.threads_count || 0), 0);
    const totalReplies = stats?.replies_count ?? latestThreads.reduce((acc, t) => acc + (t.reply_count || 0), 0);

    return (
        <PublicLayout>
            <Head title={`Community Forum - Pet Care, Training & Breeder Discussions | ${settings.site_name}`} />

            {/* --- CINEMATIC HERO --- */}
            <section className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background Blur Texture */}
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl pointer-events-none select-none">
                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop"
                        alt="Forum Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Community Forum', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl space-y-4">
                            <div className="animate-reveal flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
                                <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                    Canine Community Hub
                                </Badge>
                                <span className="text-woof-charcoal/30">•</span>
                                <span className="text-woof-charcoal/70 text-xs font-semibold tracking-wider uppercase">
                                    Verified Pet Guardians & Specialists
                                </span>
                            </div>

                            <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                                Community Forum
                            </h1>

                            <p className="text-woof-charcoal/80 animate-reveal text-base sm:text-lg leading-relaxed font-normal" style={{ animationDelay: '0.4s' }}>
                                Join open conversations on canine health, nutrition, behavioral coaching, pedigree genetics, and ethical breeding.
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="animate-reveal flex flex-wrap items-center gap-3 lg:justify-end [animation-delay:500ms]">
                            <div className="bg-white border border-[#e8ded1] rounded-2xl px-4 py-2.5 shadow-2xs text-center min-w-[110px]">
                                <span className="block text-lg font-bold text-woof-charcoal">{categories.length}</span>
                                <span className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Categories</span>
                            </div>
                            <div className="bg-white border border-[#e8ded1] rounded-2xl px-4 py-2.5 shadow-2xs text-center min-w-[110px]">
                                <span className="block text-lg font-bold text-woof-gold">{totalThreads}</span>
                                <span className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Discussions</span>
                            </div>
                            <div className="bg-white border border-[#e8ded1] rounded-2xl px-4 py-2.5 shadow-2xs text-center min-w-[110px]">
                                <span className="block text-lg font-bold text-woof-charcoal">{totalReplies}</span>
                                <span className="text-[10px] font-bold text-woof-charcoal/50 uppercase tracking-wider">Replies</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MAIN FORUM WORKSPACE --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
                        
                        {/* LEFT COLUMN: Categories */}
                        <div className="space-y-8 lg:col-span-8">
                            <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-xs font-bold text-woof-gold uppercase tracking-wider">Channels & Domains</h2>
                                    <h3 className="text-2xl font-bold font-sans text-woof-charcoal">Browse Forum Channels</h3>
                                </div>
                                <span className="text-xs font-semibold text-woof-charcoal/60">
                                    {categories.length} Active Channels
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {categories.map((category) => (
                                    <Link 
                                        key={category.id} 
                                        href={route('forum.category', category.slug)}
                                        className="group"
                                    >
                                        <div className="h-full rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-woof-gold/40 hover:shadow-lg flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shrink-0 group-hover:bg-woof-gold group-hover:text-white transition-all duration-300 shadow-2xs">
                                                        {getCategoryIcon(category.icon)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal text-xs font-bold">
                                                        <MessageSquare className="h-3.5 w-3.5 text-woof-gold" />
                                                        <span>{category.threads_count}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <h4 className="text-lg font-bold font-sans text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                                        {category.name}
                                                    </h4>
                                                    <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal line-clamp-3">
                                                        {category.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-[#e8ded1] flex items-center justify-between text-xs font-bold text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                                <span className="uppercase tracking-wider text-[11px]">Explore Channel</span>
                                                <div className="h-8 w-8 rounded-full border border-[#e8ded1] flex items-center justify-center group-hover:bg-woof-gold group-hover:border-woof-gold group-hover:text-white transition-all">
                                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar */}
                        <div className="space-y-8 lg:col-span-4 lg:sticky lg:top-28">

                            {/* Latest Discussions Panel */}
                            <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-[#e8ded1]">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-woof-gold" />
                                        <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-woof-charcoal">
                                            Recent Discussions
                                        </h3>
                                    </div>
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>

                                <div className="space-y-3">
                                    {latestThreads.length === 0 ? (
                                        <p className="text-xs text-woof-charcoal/60 py-4 text-center">No discussions yet. Be the first to start one!</p>
                                    ) : (
                                        latestThreads.map((thread) => (
                                            <Link 
                                                key={thread.id} 
                                                href={route('forum.thread', [thread.category.slug, thread.slug])} 
                                                className="block group"
                                            >
                                                <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#e8ded1] hover:border-woof-gold/40 hover:bg-white hover:shadow-2xs transition-all duration-300 space-y-2.5">
                                                    <h5 className="text-woof-charcoal font-sans font-bold text-sm leading-snug group-hover:text-woof-gold transition-colors line-clamp-2">
                                                        {thread.title}
                                                    </h5>
                                                    <div className="flex flex-wrap items-center text-[11px] font-medium text-woof-charcoal/60 gap-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#e8ded1] text-woof-charcoal/70 font-semibold text-[10px] uppercase">
                                                            {thread.category.name}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="h-3 w-3 text-woof-gold" /> {thread.reply_count}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="text-woof-charcoal/40">
                                                            {new Date(thread.created_at).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Community Karma & Perks */}
                            <div className="border border-[#e8ded1] bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                                <div className="flex items-center gap-2 text-woof-gold border-b border-[#e8ded1] pb-3">
                                    <Sparkles className="h-4 w-4" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">
                                        Community Karma & Badges
                                    </h4>
                                </div>
                                <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                    Every helpful response and insightful discussion earns community points. Active contributors receive verified badges and early access to litters & events.
                                </p>
                                <div className="pt-2 flex items-center justify-between text-xs font-bold text-woof-charcoal">
                                    <span className="flex items-center gap-1.5 text-woof-gold">
                                        <Zap className="h-3.5 w-3.5" /> +5 Pts per Topic
                                    </span>
                                    <span className="flex items-center gap-1.5 text-woof-gold">
                                        <MessageCircle className="h-3.5 w-3.5" /> +2 Pts per Reply
                                    </span>
                                </div>
                            </div>

                            {/* Start Discussion Callout */}
                            <div className="bg-woof-charcoal text-white p-8 rounded-3xl border border-white/10 relative overflow-hidden group shadow-xl space-y-4">
                                <MessageSquare className="absolute -right-8 -bottom-8 h-36 w-36 rotate-12 text-white/[0.04] transition-transform duration-1000 group-hover:rotate-45 pointer-events-none" />

                                <div className="relative z-10 space-y-3">
                                    <h4 className="text-xl font-bold tracking-tight text-white font-sans">
                                        Have a Question About <br />
                                        <span className="text-woof-gold">Your Companion?</span>
                                    </h4>

                                    <p className="text-white/70 text-xs font-normal leading-relaxed">
                                        Post your topic in any category to receive answers from breeders, veterinarians, and experienced guardians.
                                    </p>

                                    {categories.length > 0 && (
                                        <div className="pt-2">
                                            <Button 
                                                asChild 
                                                className="bg-white hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal w-full rounded-full h-11 text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300 cursor-pointer"
                                            >
                                                <Link href={route('forum.category', categories[0].slug)}>
                                                    <PenSquare className="h-3.5 w-3.5 mr-2" /> Start a Topic
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM EXPLORATION CTA --- */}
            <div className="container-wide px-6 py-16 lg:px-12">
                <div className="bg-[#fcfbf9] border border-[#e8ded1] flex flex-col items-center justify-between gap-8 rounded-3xl p-8 sm:p-12 md:flex-row shadow-xs">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight font-sans">
                            Looking for Certified Breed Guides or Health Articles?
                        </h4>

                        <p className="text-woof-charcoal/70 text-sm font-normal max-w-xl">
                            Visit our Knowledge Hub for curated medical reviews, dietary plans, and official puppy social training frameworks.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-8 h-12 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                        >
                            <Link href={route('community.articles.index')}>Explore Knowledge Hub</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
