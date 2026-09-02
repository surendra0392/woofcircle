import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pagination } from '@/components/ui/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Clock,
    Eye,
    Lock,
    MessageCircle,
    MessageSquare,
    Pin,
    Reply,
    Share2,
    Sparkles,
    User,
    Zap,
} from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface UserData {
    id: number;
    name: string;
    avatar_url?: string | null;
}

interface Thread {
    id: number;
    title: string;
    slug: string;
    body: string;
    view_count: number;
    reply_count: number;
    is_pinned?: boolean;
    is_locked?: boolean;
    created_at: string;
    category: Category;
    user: UserData;
}

interface ReplyData {
    id: number;
    body: string;
    created_at: string;
    user: UserData;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    current_page: number;
    last_page: number;
}

interface PageProps {
    thread: Thread;
    replies: PaginatedData<ReplyData>;
    auth: { user: UserData | null };
    [key: string]: any;
}

export default function ForumThread() {
    const { thread, replies, auth, settings } = usePage<PageProps & SharedData>().props;
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        body: ''
    });

    const submitReply = (e: FormEvent) => {
        e.preventDefault();
        post(route('forum.reply.store', [thread.category.slug, thread.slug]), {
            onSuccess: () => reset('body'),
            preserveScroll: true
        });
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success('Discussion link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <PublicLayout>
            <Head title={`${thread.title} - ${thread.category.name} | ${settings.site_name} Forum`} />

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
                                { title: thread.category.name, href: route('forum.category', thread.category.slug) },
                                { title: thread.title, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="mx-auto max-w-4xl space-y-4">
                        <div className="animate-reveal flex flex-wrap items-center gap-3" style={{ animationDelay: '0.2s' }}>
                            <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                {thread.category.name}
                            </Badge>
                            {thread.is_pinned && (
                                <Badge className="bg-woof-charcoal text-white rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider uppercase shadow-2xs">
                                    <Pin className="h-3 w-3 mr-1" /> Pinned
                                </Badge>
                            )}
                            <span className="text-woof-charcoal/30">•</span>
                            <span className="text-woof-charcoal/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                                <MessageSquare className="h-3.5 w-3.5 text-woof-gold" /> {thread.reply_count} Replies
                            </span>
                            <span className="text-woof-charcoal/30">•</span>
                            <span className="text-woof-charcoal/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                                <Eye className="h-3.5 w-3.5" /> {thread.view_count} Views
                            </span>
                        </div>

                        <h1 className="text-woof-charcoal animate-reveal font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                            {thread.title}
                        </h1>

                        <div className="flex items-center justify-between border-t border-[#e8ded1] pt-4 text-xs font-medium text-woof-charcoal/60">
                            <span>Started by <strong className="text-woof-charcoal">{thread.user.name}</strong></span>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1.5 text-woof-charcoal hover:text-woof-gold font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors"
                            >
                                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-woof-gold" />}
                                {copied ? 'Link Copied' : 'Share Discussion'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THREAD & REPLIES STREAM --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide max-w-4xl px-6 lg:px-12 space-y-10">
                    
                    {/* Original Post Card */}
                    <div className="bg-white border border-[#e8ded1] p-6 sm:p-10 rounded-3xl shadow-xs space-y-6">
                        <div className="flex items-start justify-between gap-4 border-b border-[#e8ded1] pb-5">
                            <div className="flex items-center gap-3.5">
                                <div className="h-12 w-12 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                                    {thread.user?.name ? thread.user.name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold font-sans text-woof-charcoal">
                                        {thread.user.name}
                                    </h4>
                                    <p className="text-woof-gold text-[10px] font-bold uppercase tracking-wider">
                                        Topic Author
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-xs font-medium text-woof-charcoal/50">
                                {new Date(thread.created_at).toLocaleDateString('default', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-woof-charcoal/85 whitespace-pre-wrap font-normal">
                            {thread.body}
                        </div>
                    </div>

                    {/* Replies Stream */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                            <h3 className="text-lg font-bold font-sans text-woof-charcoal flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-woof-gold" /> Responses ({thread.reply_count})
                            </h3>
                            <span className="text-xs font-semibold text-woof-charcoal/60">
                                Chronological Discussion
                            </span>
                        </div>
                        
                        {replies.data.length === 0 ? (
                            <div className="bg-white border border-[#e8ded1] rounded-3xl p-10 text-center space-y-2 shadow-xs">
                                <p className="text-sm font-bold text-woof-charcoal">No replies posted yet.</p>
                                <p className="text-xs text-woof-charcoal/60">Be the first community member or verified expert to share your thoughts below!</p>
                            </div>
                        ) : (
                            replies.data.map((reply, index) => (
                                <div 
                                    key={reply.id} 
                                    className="bg-white border border-[#e8ded1] p-6 sm:p-8 rounded-3xl shadow-xs space-y-4 transition-all hover:border-woof-gold/30"
                                >
                                    <div className="flex items-start justify-between gap-4 border-b border-[#e8ded1]/60 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-2xl bg-[#fcfbf9] text-woof-charcoal border border-[#e8ded1] flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                                                {reply.user?.name ? reply.user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold font-sans text-woof-charcoal">
                                                    {reply.user.name}
                                                </h5>
                                                <span className="text-[10px] font-semibold text-woof-charcoal/50 uppercase tracking-wider">
                                                    Response #{index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="text-xs font-medium text-woof-charcoal/40">
                                            {new Date(reply.created_at).toLocaleDateString('default', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>

                                    <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-woof-charcoal/80 whitespace-pre-wrap font-normal">
                                        {reply.body}
                                    </div>
                                </div>
                            ))
                        )}

                        {replies.links && replies.links.length > 3 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination links={replies.links} />
                            </div>
                        )}
                    </div>

                    {/* Reply Form Container */}
                    <div className="bg-white border border-[#e8ded1] p-6 sm:p-10 rounded-3xl shadow-xs space-y-6">
                        {thread.is_locked ? (
                            <div className="text-center py-6 space-y-2">
                                <Lock className="h-6 w-6 text-woof-charcoal/40 mx-auto" />
                                <h4 className="text-sm font-bold text-woof-charcoal">This discussion is locked</h4>
                                <p className="text-xs text-woof-charcoal/60">New replies have been disabled for this thread.</p>
                            </div>
                        ) : auth.user ? (
                            <form onSubmit={submitReply} className="space-y-4">
                                <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                                    <h4 className="text-base font-bold font-sans text-woof-charcoal flex items-center gap-2">
                                        <Reply className="h-4 w-4 text-woof-gold" /> Post Your Response
                                    </h4>
                                    <span className="text-xs font-medium text-woof-charcoal/60">
                                        Replying as <strong className="text-woof-charcoal">{auth.user.name}</strong>
                                    </span>
                                </div>

                                <Textarea
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    placeholder="Write a clear, helpful response to this topic..."
                                    rows={5}
                                    className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] p-4 text-sm font-normal focus:ring-2 focus:ring-woof-gold/20 resize-y outline-none leading-relaxed"
                                />
                                {errors.body && <div className="text-red-500 text-xs font-medium">{errors.body}</div>}

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs text-woof-charcoal/50 flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5 text-woof-gold" /> Earn +2 Community Karma
                                    </span>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !data.body.trim()} 
                                        className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs px-8 h-11 shadow-md transition-all cursor-pointer"
                                    >
                                        Post Response
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-8 space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-woof-cream border border-[#e8ded1] mx-auto flex items-center justify-center text-woof-gold shadow-2xs">
                                    <MessageSquare className="h-6 w-6 stroke-[1.75]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold font-sans text-woof-charcoal">Join the Discussion</h4>
                                    <p className="text-xs text-woof-charcoal/70 max-w-sm mx-auto">
                                        Please sign in or create a free WoofCircle profile to ask questions, share answers, and connect with members.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-2">
                                    <Button 
                                        asChild 
                                        className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs px-8 h-10 shadow-sm cursor-pointer"
                                    >
                                        <Link href={route('login')}>Sign In</Link>
                                    </Button>
                                    <Button 
                                        asChild 
                                        variant="outline"
                                        className="rounded-full border-[#e8ded1] hover:bg-woof-cream/40 text-woof-charcoal font-bold uppercase tracking-wider text-xs px-6 h-10 cursor-pointer"
                                    >
                                        <Link href={route('register')}>Create Account</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
