import { Breadcrumbs } from '@/components/breadcrumbs';
import { ArrowRight, Search, Zap } from 'lucide-react';
import React from 'react';

import { Article, PlatformStatus } from './types';

interface HelpHeroProps {
    searchQuery: string;
    onSearch: (query: string) => void;
    isSearching: boolean;
    filteredArticles: Article[];
    onSelectArticle: (article: Article) => void;
    platformStatus: PlatformStatus[];
}

export const HelpHero: React.FC<HelpHeroProps> = ({ searchQuery, onSearch, isSearching, filteredArticles, onSelectArticle, platformStatus }) => {
    return (
        <section className="bg-woof-charcoal relative overflow-hidden py-24 lg:py-40">
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: "url('/images/cinematic/hero.png')" }}
            />

            <div className="container-wide relative z-10 px-6 lg:px-12">
                <div className="max-w-4xl space-y-12">
                    <div className="space-y-6">
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Help Center', href: '/help-center' },
                            ]}
                            dark
                        />
                        <h1 className="font-sans text-5xl leading-[1] font-black tracking-[0.01em] text-white uppercase lg:text-7xl">
                            Support <br />
                            <span className="text-woof-gold font-sans uppercase">Sanctuary.</span>
                        </h1>
                    </div>

                    {/* Live Pulse */}
                    <div
                        className="flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-white/5 pt-4"
                    >
                        <div className="flex items-center gap-3">
                            <Zap className="text-woof-gold size-4" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Live Pulse:</span>
                        </div>
                        {platformStatus.map((status, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`size-1.5 ${status.color === 'text-green-500' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                                <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">{status.label}</span>
                                <span className={`text-[9px] font-black tracking-widest uppercase ${status.color}`}>{status.status}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="group relative max-w-3xl">
                            <Search className="text-woof-on-dark-subtle group-focus-within:text-woof-gold absolute top-1/2 left-10 size-6 -translate-y-1/2 transition-colors" />
                            <input
                                id="kb-search"
                                type="text"
                                placeholder="Search the knowledge base..."
                                className="focus:border-woof-gold/50 placeholder:text-woof-on-dark-subtle w-full rounded-none border border-white/10 bg-white/5 px-20 py-4 text-xl font-medium text-white/80 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                            />
                            <div className="absolute top-1/2 right-6 hidden -translate-y-1/2 sm:block">
                                <span className="text-woof-on-dark-subtle rounded-none border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black tracking-widest uppercase">
                                    CMD + K
                                </span>
                            </div>

                            {isSearching && (
                                    <div
                                        className="bg-woof-charcoal/95 absolute top-full right-0 left-0 z-[100] mt-2 border border-white/10 shadow-2xl backdrop-blur-xl"
                                    >
                                        <div className="flex items-center justify-between border-b border-white/5 p-4">
                                            <span className="text-woof-gold text-[10px] font-black tracking-widest uppercase">Top Matches</span>
                                            <span className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Archive Pulse</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {filteredArticles.length > 0 ? (
                                                filteredArticles.slice(0, 5).map((art, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => onSelectArticle(art)}
                                                        className="group flex w-full items-center justify-between border-b border-white/5 p-6 text-left transition-colors hover:bg-white/5"
                                                    >
                                                        <span className="group-hover:text-woof-gold text-sm font-bold text-white transition-colors">
                                                            {art.title}
                                                        </span>
                                                        <ArrowRight className="group-hover:text-woof-gold size-4 text-white/20 transition-all group-hover:translate-x-2" />
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-[10px] font-black tracking-widest text-white/40 uppercase">
                                                    No results found in telemetry.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div
                            className="flex flex-wrap items-center gap-6"
                        >
                            <span className="text-woof-on-dark-subtle text-[11px] font-black tracking-[0.3em] uppercase">Fast Tracks:</span>
                            {['Breeder Audit', 'VSP Settlement', 'Checkpoint Logistics', 'Verification'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => onSearch(tag)}
                                    className="hover:text-woof-gold hover:border-woof-gold border-b border-transparent pb-1 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
