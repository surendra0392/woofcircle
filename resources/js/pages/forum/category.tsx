import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Brain,
    Clock,
    Dna,
    Eye,
    HeartPulse,
    MessageSquare,
    PenSquare,
    Pin,
    ShoppingBag,
    Smile,
    Sparkles,
    User,
} from 'lucide-react';
import React from 'react';

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
}

interface Thread {
    id: number;
    title: string;
    slug: string;
    view_count: number;
    reply_count: number;
    is_pinned?: boolean;
    created_at: string;
    user: { name: string; id: number };
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function ForumCategory({ category, threads }: { category: Category; threads: PaginatedData<Thread> }) {
    const { settings } = usePage<SharedData>().props;

    return (
        <PublicLayout>
            <Head title={`${category.name} - Discussions | ${settings.site_name} Forum`} />

            {/* --- CINEMATIC HEADER --- */}
            <section className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
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
                                { title: 'Community Forum', href: route('forum.index') },
                                { title: category.name, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-start gap-5 max-w-3xl">
                            <div className="h-16 w-16 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shrink-0 shadow-2xs mt-1">
                                {getCategoryIcon(category.icon)}
                            </div>

                            <div className="space-y-3">
                                <div className="animate-reveal flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
                                    <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                        Forum Channel
                                    </Badge>
                                    <span className="text-woof-charcoal/30">•</span>
                                    <span className="text-woof-charcoal/70 text-xs font-semibold tracking-wider uppercase">
                                        {threads.total || threads.data.length} Topics
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                                    {category.name}
                                </h1>

                                <p className="text-woof-charcoal/80 animate-reveal text-sm sm:text-base leading-relaxed font-normal" style={{ animationDelay: '0.4s' }}>
                                    {category.description}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <Button
                                asChild
                                className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold tracking-wider uppercase h-11 px-6 text-xs shadow-md transition-all cursor-pointer"
                            >
                                <Link href={route('forum.create', category.slug)}>
                                    <PenSquare className="mr-2 h-4 w-4" /> Start Discussion
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THREADS LISTING --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide max-w-5xl px-6 lg:px-12">
                    <div className="space-y-4">
                        {threads.data.length === 0 ? (
                            <div className="bg-white border border-dashed border-[#e8ded1] rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-xs">
                                <div className="h-16 w-16 rounded-2xl bg-woof-cream border border-[#e8ded1] mx-auto flex items-center justify-center text-woof-gold shadow-2xs">
                                    <MessageSquare className="h-7 w-7 stroke-[1.75]" />
                                </div>
                                <div className="space-y-1 max-w-md mx-auto">
                                    <h3 className="text-xl font-bold font-sans text-woof-charcoal">No discussions yet in this channel</h3>
                                    <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                        Be the first pet parent or certified specialist to post a question or advice in this topic!
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs h-11 px-8 shadow-md transition-all cursor-pointer"
                                >
                                    <Link href={route('forum.create', category.slug)}>
                                        <PenSquare className="mr-2 h-4 w-4" /> Post First Topic
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            threads.data.map((thread) => (
                                <Link 
                                    key={thread.id} 
                                    href={route('forum.thread', [category.slug, thread.slug])}
                                    className="block group"
                                >
                                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-woof-gold/40 hover:shadow-md flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                                        <div className="flex items-start gap-4 min-w-0 flex-1">
                                            {/* Author Avatar Initial */}
                                            <div className="h-11 w-11 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shrink-0 font-bold text-sm shadow-2xs">
                                                {thread.user?.name ? thread.user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                            </div>

                                            <div className="space-y-1.5 min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    {thread.is_pinned && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-woof-gold/10 text-woof-gold px-2.5 py-0.5 rounded-full">
                                                            <Pin className="h-3 w-3" /> Pinned
                                                        </span>
                                                    )}
                                                    <h3 className="text-base sm:text-lg font-bold font-sans text-woof-charcoal group-hover:text-woof-gold transition-colors leading-snug truncate">
                                                        {thread.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-woof-charcoal/60">
                                                    <span className="font-semibold text-woof-charcoal">
                                                        {thread.user?.name || 'Community Member'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {new Date(thread.created_at).toLocaleDateString('default', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Metrics */}
                                        <div className="flex items-center gap-4 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-[#e8ded1] pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="flex items-center gap-1.5 text-xs text-woof-charcoal/70 font-semibold bg-[#fcfbf9] px-3 py-1.5 rounded-full border border-[#e8ded1]">
                                                <MessageSquare className="h-3.5 w-3.5 text-woof-gold" />
                                                <span>{thread.reply_count} replies</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-woof-charcoal/50 font-medium">
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>{thread.view_count} views</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {threads.links && threads.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination links={threads.links} />
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
