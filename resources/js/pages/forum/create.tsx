import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    HelpCircle,
    PenSquare,
    Sparkles,
    Zap,
} from 'lucide-react';
import React, { FormEvent } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PageProps {
    category: Category;
    [key: string]: any;
}

export default function ForumCreate() {
    const { category, settings } = usePage<PageProps & SharedData>().props;
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: ''
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('forum.store', category.slug));
    };

    return (
        <PublicLayout>
            <Head title={`Start Discussion in ${category.name} | ${settings.site_name} Forum`} />

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
                                { title: category.name, href: route('forum.category', category.slug) },
                                { title: 'New Topic', href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="mx-auto max-w-3xl space-y-4">
                        <div className="animate-reveal flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
                            <Badge className="bg-woof-gold rounded-full border-none px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-2xs">
                                Channel: {category.name}
                            </Badge>
                            <span className="text-woof-charcoal/30">•</span>
                            <span className="text-woof-charcoal/70 text-xs font-semibold tracking-wider uppercase">
                                Open Conversation
                            </span>
                        </div>

                        <h1 className="text-woof-charcoal animate-reveal font-sans text-3xl sm:text-4xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.3s' }}>
                            Start a New Discussion
                        </h1>

                        <p className="text-woof-charcoal/80 animate-reveal text-sm sm:text-base leading-relaxed font-normal" style={{ animationDelay: '0.4s' }}>
                            Ask questions, share real-life observations, or discuss canine care with passionate guardians and certified specialists.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- FORM WORKSPACE --- */}
            <div className="bg-[#fcfbf9] py-16 border-b border-[#e8ded1]">
                <div className="container-wide max-w-3xl px-6 lg:px-12 space-y-8">
                    
                    {/* Guidance Card */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs flex items-start gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-woof-cream text-woof-gold border border-[#e8ded1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                            <h4 className="font-bold text-sm font-sans text-woof-charcoal">Quick Posting Tips</h4>
                            <p>
                                Use a specific, descriptive topic title. Mention breed, age, and context if asking for health or training advice to receive more accurate community feedback.
                            </p>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white border border-[#e8ded1] p-6 sm:p-10 rounded-3xl shadow-xs">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">
                                    Discussion Title <span className="text-rose-500">*</span>
                                </Label>
                                <Input 
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="h-12 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] font-medium text-sm focus:ring-2 focus:ring-woof-gold/20"
                                    placeholder="e.g., Best grain-free diet alternatives for 6-month Golden Retriever puppy"
                                />
                                {errors.title && <div className="text-red-500 text-xs font-medium">{errors.title}</div>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">
                                    Discussion Message <span className="text-rose-500">*</span>
                                </Label>
                                <Textarea 
                                    id="body"
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    rows={8}
                                    className="min-h-[220px] rounded-2xl border-[#e8ded1] bg-[#fcfbf9] p-4 text-sm font-normal focus:ring-2 focus:ring-woof-gold/20 resize-y outline-none leading-relaxed"
                                    placeholder="Explain your question or thoughts in detail. You can include daily routine, behaviors, diet, or background details..."
                                />
                                {errors.body && <div className="text-red-500 text-xs font-medium">{errors.body}</div>}
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e8ded1]">
                                <span className="text-xs text-woof-charcoal/50 flex items-center gap-1.5">
                                    <Zap className="h-3.5 w-3.5 text-woof-gold" /> Earn +5 Community Karma on publish
                                </span>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    <Button 
                                        asChild
                                        variant="outline" 
                                        type="button" 
                                        className="rounded-full border-[#e8ded1] hover:bg-woof-cream/40 font-bold uppercase tracking-wider text-xs h-11 px-6 text-woof-charcoal cursor-pointer"
                                    >
                                        <Link href={route('forum.category', category.slug)}>
                                            Cancel
                                        </Link>
                                    </Button>

                                    <Button 
                                        type="submit" 
                                        disabled={processing || !data.title.trim() || !data.body.trim()} 
                                        className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs h-11 px-8 shadow-md transition-all cursor-pointer"
                                    >
                                        Publish Discussion
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
