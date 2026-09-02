import { ArrowRight, Search, X } from 'lucide-react';
import React from 'react';

import { Article, Category } from './types';

interface KnowledgeBaseProps {
    isSearching: boolean;
    searchQuery: string;
    onSearch: (query: string) => void;
    filteredCategories: Category[];
    onSelectArticle: (article: Article) => void;
    articleContents: Record<string, string>;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
    isSearching,
    searchQuery,
    onSearch,
    filteredCategories,
    onSelectArticle,
    articleContents,
}) => {
    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="bg-woof-gold/30 text-woof-gold">
                            {part}
                        </span>
                    ) : (
                        part
                    ),
                )}
            </span>
        );
    };

    return (
        <section className="bg-woof-charcoal border-t border-white/5 py-32 text-white">
            <div className="container-wide px-6 lg:px-12">
                <div className="mb-24 max-w-4xl space-y-6">
                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">Knowledge Base</span>
                    <h2 className="mt-2 text-5xl leading-none font-black tracking-[0.01em] text-white uppercase">
                        {isSearching ? 'Search' : 'Deep Dive'} &nbsp;
                        <span className="text-woof-gold uppercase">
                            {isSearching ? `Results for "${searchQuery}"` : 'Documentation.'}
                        </span>
                    </h2>
                    {isSearching && (
                        <button
                            onClick={() => onSearch('')}
                            className="text-woof-on-dark-subtle group flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-colors hover:text-white"
                        >
                            <X className="size-4" /> Clear Search Results
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat, i) => (
                            <div
                                key={i}
                                className="group hover:border-woof-gold/30 hover:shadow-gold space-y-10 border border-white/5 p-12 transition-all hover:bg-white/5 hover:shadow-xl"
                            >
                                <div className="text-woof-gold group-hover:bg-woof-gold group-hover:text-woof-charcoal flex size-16 items-center justify-center bg-white/5 transition-all">
                                    {cat.icon}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="group-hover:text-woof-gold group-hover:border-b-woof-gold text-2xl font-black tracking-[0.03em] text-white uppercase transition-all">
                                        {highlightText(cat.title, searchQuery)}
                                    </h3>
                                    <p className="text-woof-on-dark-muted text-sm leading-relaxed font-medium">{cat.desc}</p>
                                </div>
                                <div className="space-y-4 border-t border-white/5 pt-6">
                                    {cat.articles.map((art, j) => (
                                        <button
                                            key={j}
                                            onClick={() =>
                                                onSelectArticle({
                                                    title: art,
                                                    content:
                                                        articleContents[art] ||
                                                        'Detailed documentation for this topic is currently being finalized. Please reach out to our concierge for immediate assistance.',
                                                })
                                            }
                                            className="group/art flex w-full items-center justify-between py-1 text-left"
                                        >
                                            <span className="text-woof-on-dark-subtle hover:text-woof-gold cursor-pointer text-[11px] font-bold tracking-widest uppercase transition-colors group-hover/art:text-white">
                                                {highlightText(art, searchQuery)}
                                            </span>
                                            <ArrowRight className="text-woof-gold size-3 opacity-0 transition-all group-hover/art:translate-x-1 group-hover/art:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full space-y-8 border border-dashed border-white/10 py-32 text-center">
                            <Search className="mx-auto size-16 text-white/5" />
                            <div className="space-y-2">
                                <p className="text-2xl font-black tracking-tight text-white uppercase">No matches found in the archives</p>
                                <p className="text-woof-on-dark-muted text-sm font-medium">
                                    Try broader keywords or speak with our live concierge for immediate help.
                                </p>
                            </div>
                            <button
                                onClick={() => onSearch('')}
                                className="text-woof-gold text-[10px] font-black tracking-[0.3em] uppercase transition-colors hover:text-white"
                            >
                                Reset Archives —
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
