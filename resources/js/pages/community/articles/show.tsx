import ArticleCard from '@/components/articles/ArticleCard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShareDialog from '@/components/public/share-dialog';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    Heart,
    Link2,
    Share2,
    Sparkles,
    ThumbsDown,
    ThumbsUp,
    User,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import DisplayAdBanner from '@/components/public/display-ad-banner';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string | null;
    author_name: string | null;
    read_time?: string | null;
    created_at: string;
    user_id: number;
    category: { name: string };
    user?: {
        id: number;
        name: string;
        avatar_url: string | null;
    } | null;
}

interface PageProps {
    article: Article;
    relatedArticles?: Article[];
    isSavedProp?: boolean;
}

export default function ArticleShow({ article, relatedArticles = [], isSavedProp = false }: PageProps) {
    const { settings, auth } = usePage<SharedData>().props;

    // Interactive states
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
    const [isSaved, setIsSaved] = useState(isSavedProp);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Calculate reading time based on content length
    const wordsCount = article.content ? article.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
    const readingTime = article.read_time ? parseInt(article.read_time) : Math.max(1, Math.ceil(wordsCount / 200));

    // Handle copying article link
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success('Article link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveToggle = () => {
        if (!auth || !auth.user) {
            toast.error('Please login to save articles.');
            return;
        }

        const newSavedState = !isSaved;
        setIsSaved(newSavedState);

        fetch(route('community.articles.save', { slug: article.slug }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.saved) {
                    toast.success('Saved to your reading list!');
                } else {
                    toast.success('Removed from saved articles');
                }
            })
            .catch(() => {
                setIsSaved(!newSavedState);
                toast.error('Failed to update saved articles.');
            });
    };

    const handleFeedback = (type: 'helpful' | 'not-helpful') => {
        setFeedback(type);
        toast.success('Thank you for your valuable feedback!');
    };

    const authorDisplayName = article.user?.name || article.author_name || `${settings.site_name} Editorial Team`;

    return (
        <PublicLayout>
            <Head title={`${article.title} - ${settings.site_name} Knowledge Hub`} />

            {/* --- CINEMATIC HEADER HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background Decor */}
                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl pointer-events-none select-none">
                    <img
                        src={
                            article.image_url ||
                            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop'
                        }
                        alt="Background Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Knowledge Hub', href: route('community.articles.index') },
                                { title: article.title, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="mx-auto max-w-4xl space-y-6 text-left">
                        <div className="animate-reveal flex flex-wrap items-center gap-3" style={{ animationDelay: '0.2s' }}>
                            <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                {article.category?.name || 'Pet Care Guide'}
                            </Badge>
                            <span className="text-woof-charcoal/30">•</span>
                            <span className="text-woof-charcoal/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                                <Clock className="h-3.5 w-3.5 text-woof-gold" /> {readingTime} MIN READ
                            </span>
                        </div>

                        <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                            {article.title}
                        </h1>

                        {article.excerpt && (
                            <p className="text-woof-charcoal/80 animate-reveal text-base sm:text-lg leading-relaxed font-normal" style={{ animationDelay: '0.4s' }}>
                                {article.excerpt}
                            </p>
                        )}

                        <div className="animate-reveal flex flex-col gap-6 border-t border-[#e8ded1] pt-6 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: '0.5s' }}>
                            {/* Author Badge */}
                            <div className="flex items-center gap-3.5">
                                <div className="bg-white h-11 w-11 overflow-hidden rounded-2xl border border-[#e8ded1] shadow-2xs flex items-center justify-center shrink-0">
                                    {article.user?.avatar_url ? (
                                        <img
                                            src={article.user.avatar_url}
                                            alt={authorDisplayName}
                                            className="h-full w-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-woof-cream text-woof-gold">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">Written By</p>
                                    <p className="text-woof-charcoal text-sm font-bold">
                                        {authorDisplayName}
                                    </p>
                                </div>
                                <div className="bg-[#e8ded1] h-6 w-px mx-1"></div>
                                <div>
                                    <p className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">Published</p>
                                    <p className="text-woof-charcoal text-sm font-bold">
                                        {new Date(article.created_at).toLocaleDateString('default', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSaveToggle}
                                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 h-10 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
                                        isSaved
                                            ? 'bg-woof-gold border-woof-gold text-white hover:bg-woof-gold/90 shadow-sm'
                                            : 'border-[#e8ded1] bg-white text-woof-charcoal hover:border-woof-gold hover:text-woof-gold shadow-2xs'
                                    }`}
                                >
                                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                                    {isSaved ? 'Saved' : 'Save Article'}
                                </button>

                                <Button
                                    variant="outline"
                                    onClick={() => setIsShareOpen(true)}
                                    className="border-[#e8ded1] bg-white hover:bg-woof-cream/40 text-woof-charcoal h-10 w-10 rounded-full p-0 flex items-center justify-center cursor-pointer shadow-2xs"
                                    title="Share Article"
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CORE SECTION CONTENT --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">

                        {/* LEFT: Article content wrapper */}
                        <div className="space-y-10 lg:col-span-8">
                            {/* Featured Image */}
                            <div className="group relative aspect-[16/9] overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md">
                                <img
                                    src={
                                        article.image_url ||
                                        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop'
                                    }
                                    alt={article.title}
                                    className="h-full w-full rounded-2xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Content Body */}
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-10 shadow-xs">
                                <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-woof-charcoal prose-p:font-normal prose-p:text-woof-charcoal/80 prose-p:leading-relaxed prose-a:text-woof-gold hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-woof-gold prose-blockquote:bg-[#fcfbf9] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:text-woof-charcoal prose-strong:text-woof-charcoal prose-strong:font-bold prose-img:rounded-2xl">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: article.content
                                                ? (/<[a-z][\s\S]*>/i.test(article.content) ? article.content : article.content.replace(/\n/g, '<br/>'))
                                                : 'No content available for this guide.'
                                        }}
                                    />
                                </article>
                            </div>

                            {/* In-Article / In-Feed Native Editorial Banner */}
                            <DisplayAdBanner slot="in_article" />

                            {/* Bottom Helpfulness Feedback Widget */}
                            <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between gap-6 md:flex-row shadow-xs">
                                {feedback === null ? (
                                    <>
                                        <div className="space-y-1 text-center md:text-left">
                                            <h4 className="text-woof-charcoal font-sans text-base sm:text-lg font-bold">Was this guide helpful?</h4>
                                            <p className="text-woof-charcoal/60 text-xs font-normal">Your feedback helps us provide more accurate canine advice.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleFeedback('helpful')}
                                                className="border-[#e8ded1] gap-2 rounded-full px-5 h-10 text-xs font-bold tracking-wider uppercase hover:bg-woof-cream hover:text-woof-gold cursor-pointer"
                                            >
                                                <ThumbsUp className="h-3.5 w-3.5" /> Yes, Helpful
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleFeedback('not-helpful')}
                                                className="border-[#e8ded1] gap-2 rounded-full px-5 h-10 text-xs font-bold tracking-wider uppercase hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                                            >
                                                <ThumbsDown className="h-3.5 w-3.5" /> Not Really
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center w-full py-2 animate-reveal">
                                        <h4 className="text-woof-gold font-sans text-lg font-bold flex items-center justify-center gap-2">
                                            <Check className="h-5 w-5 bg-woof-gold text-white p-0.5 rounded-full" />
                                            Feedback Submitted
                                        </h4>
                                        <p className="text-woof-charcoal/70 mt-1 text-xs font-medium">
                                            {feedback === 'helpful'
                                                ? "Awesome! Glad you found it useful. We will continue publishing expert pet insights."
                                                : "Thank you for letting us know. Our canine specialists will review and improve this guide."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Sidebar sticky column */}
                        <div className="space-y-8 lg:col-span-4 lg:sticky lg:top-28">

                            {/* Author Summary Panel */}
                            <div className="border border-[#e8ded1] bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                                <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase border-b border-[#e8ded1] pb-3">
                                    About The Contributor
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white h-14 w-14 overflow-hidden rounded-2xl border border-[#e8ded1] shadow-2xs shrink-0 flex items-center justify-center">
                                        {article.user?.avatar_url ? (
                                            <img
                                                src={article.user.avatar_url}
                                                alt={authorDisplayName}
                                                className="h-full w-full object-cover rounded-2xl"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-woof-cream text-woof-gold">
                                                <User className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <h4 className="text-woof-charcoal text-base font-bold truncate">
                                            {authorDisplayName}
                                        </h4>
                                        <p className="text-woof-gold text-xs font-medium">
                                            Verified Canine Contributor
                                        </p>
                                    </div>
                                </div>
                                <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                    Passionate dog advocate and pet care expert specializing in canine nutrition, behavior training, and breed-specific wellness patterns.
                                </p>
                            </div>

                            {/* Quick Share Panel */}
                            <div className="border border-[#e8ded1] bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                                <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase border-b border-[#e8ded1] pb-3">
                                    Share This Guide
                                </h3>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => setIsShareOpen(true)}
                                        className="flex-1 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full h-11 text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                                    >
                                        <Share2 className="h-3.5 w-3.5 mr-2" /> Share Options
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCopyLink}
                                        className={`border-[#e8ded1] rounded-full h-11 px-4 transition-all cursor-pointer ${
                                            copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'text-woof-charcoal hover:bg-woof-cream hover:text-woof-gold'
                                        }`}
                                        title="Copy Link"
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Article Metadata Summary */}
                            <div className="border border-[#e8ded1] bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                                <h3 className="text-woof-charcoal text-xs font-bold tracking-wider uppercase border-b border-[#e8ded1] pb-3">
                                    Guide Specifications
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-medium text-woof-charcoal/70">
                                        <span>Category:</span>
                                        <span className="text-woof-gold font-bold uppercase tracking-wider text-xs">
                                            {article.category?.name || 'Pet Care'}
                                        </span>
                                    </div>
                                    <div className="bg-[#e8ded1] h-px w-full" />
                                    <div className="flex items-center justify-between text-xs font-medium text-woof-charcoal/70">
                                        <span>Estimated Read Time:</span>
                                        <span className="text-woof-charcoal font-bold text-xs">
                                            {readingTime} Minutes
                                        </span>
                                    </div>
                                    <div className="bg-[#e8ded1] h-px w-full" />
                                    <div className="flex items-center justify-between text-xs font-medium text-woof-charcoal/70">
                                        <span>Access Level:</span>
                                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Open Access
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar 300x250 Sponsor Showcase Card */}
                            <DisplayAdBanner slot="sidebar_square" />

                            {/* Newsletter Box */}
                            <div className="bg-woof-charcoal text-white p-8 rounded-3xl border border-white/10 relative overflow-hidden group shadow-xl">
                                <BookOpen className="absolute -right-8 -bottom-8 h-40 w-40 rotate-12 text-white/[0.04] transition-transform duration-1000 group-hover:rotate-45 pointer-events-none" />

                                <div className="relative z-10 space-y-4">
                                    <h4 className="text-xl font-bold tracking-tight text-white font-sans">
                                        Stay Updated with <br />
                                        <span className="text-woof-gold">Expert Canine Care</span>
                                    </h4>

                                    <p className="text-white/70 text-xs font-normal leading-relaxed">
                                        Join 10,000+ pet parents receiving our weekly training and wellness guides.
                                    </p>

                                    <div className="space-y-3 pt-2">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="focus:border-woof-gold w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white transition-colors outline-none placeholder:text-white/40"
                                        />
                                        <Button className="bg-white hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal w-full rounded-full h-11 text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300 cursor-pointer">
                                            Subscribe to Digest
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* --- RELATED ARTICLES SPOTLIGHT --- */}
            {relatedArticles.length > 0 && (
                <section className="bg-white py-20 border-b border-[#e8ded1]">
                    <div className="container-wide px-6 lg:px-12">
                        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div className="space-y-1">
                                <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Continue Reading</h3>
                                <h4 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight font-sans">
                                    Related Guides & Insights
                                </h4>
                            </div>

                            <Button
                                asChild
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal gap-2 rounded-full px-6 h-11 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all cursor-pointer"
                            >
                                <Link href={route('community.articles.index')}>
                                    Browse All Articles <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedArticles.map((rel) => (
                                <ArticleCard
                                    key={rel.id}
                                    article={{
                                        title: rel.title,
                                        excerpt: rel.excerpt || '',
                                        category: rel.category?.name || 'Guide',
                                        readTime: `${rel.read_time || '5 min'} Read`,
                                        author: rel.author_name || authorDisplayName,
                                        image: rel.image_url || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop',
                                        href: route('community.articles.show', { slug: rel.slug })
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- BOTTOM EXPLORATION CTA --- */}
            <div className="container-wide px-6 py-16 lg:px-12">
                <div className="bg-[#fcfbf9] border border-[#e8ded1] flex flex-col items-center justify-between gap-8 rounded-3xl p-8 sm:p-12 md:flex-row shadow-xs">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-woof-charcoal text-2xl sm:text-3xl font-bold tracking-tight font-sans">
                            Looking for Specific Canine Guidance?
                        </h4>

                        <p className="text-woof-charcoal/70 text-sm font-normal max-w-xl">
                            Browse all categories in our verified Knowledge Hub covering puppy nutrition, clinical health, breed training, and grooming tips.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal rounded-full px-8 h-12 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all cursor-pointer"
                        >
                            <Link href={route('community.articles.index')}>Explore Knowledge Base</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Share Dialog */}
            <ShareDialog
                isOpen={isShareOpen}
                setIsOpen={setIsShareOpen}
                title={article.title}
            />
        </PublicLayout>
    );
}
