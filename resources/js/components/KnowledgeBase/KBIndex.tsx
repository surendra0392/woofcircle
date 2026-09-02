import { Link, router } from '@inertiajs/react';
import { BookOpen, Search, Plus, ChevronRight, Pencil } from 'lucide-react';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { useState } from 'react';

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
}

interface Props {
    articles: Article[];
    filters: { category: string };
    baseRoute: string;
    isMgmt: boolean;
}

export default function KBIndex({ articles, filters, baseRoute, isMgmt }: Props) {
    const activeCategory = filters.category;
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [...new Set(articles.map(a => a.category))].sort();

    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

    const filteredArticles = articles.filter(a => {
        const matchesCategory = !activeCategory || activeCategory === 'all' || a.category === activeCategory;
        const matchesSearch = !searchQuery ||
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stripHtml(a.content).toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs shrink-0">
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Knowledge Base & SOPs</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Standard operating procedures, compliance guides, and internal policies.</p>
                    </div>
                </div>
                {isMgmt && (
                    <Link
                        href={route(`${baseRoute}.create`)}
                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                        <Plus className="size-3.5" /> Publish Article
                    </Link>
                )}
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-woof-charcoal/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search articles, guides, policies, or procedures..."
                    className="w-full pl-11 pr-4 h-12 rounded-full border border-[#e8ded1] bg-white shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold text-xs text-woof-charcoal placeholder:text-woof-charcoal/40"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => router.get(route(`${baseRoute}.index`), { category: '' }, { preserveState: true, replace: true })}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === 'all' || !activeCategory
                            ? 'bg-woof-charcoal text-white shadow-xs'
                            : 'bg-white border border-[#e8ded1] text-woof-charcoal/70 hover:text-woof-charcoal hover:border-woof-gold'
                    }`}
                >
                    All Categories ({articles.length})
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => router.get(route(`${baseRoute}.index`), { category: cat }, { preserveState: true, replace: true })}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeCategory === cat
                                ? 'bg-woof-charcoal text-white shadow-xs'
                                : 'bg-white border border-[#e8ded1] text-woof-charcoal/70 hover:text-woof-charcoal hover:border-woof-gold'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filteredArticles.length === 0 ? (
                <div className="rounded-3xl border border-[#e8ded1] bg-white p-16 text-center shadow-xs">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-woof-charcoal">
                        {searchQuery ? 'No matching articles' : 'No articles published yet'}
                    </h3>
                    <p className="mt-1 text-xs text-woof-charcoal/60 max-w-md mx-auto">
                        {searchQuery
                            ? 'Try searching with different keywords or switch categories.'
                            : 'Knowledge base documentation and guides will appear here once published.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredArticles.map(article => (
                        <Link
                            key={article.id}
                            href={route(`${baseRoute}.show`, article.id)}
                            className="group block bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:border-woof-gold/60 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal bg-woof-gold/15 border border-woof-gold/30 px-3 py-0.5 rounded-full">
                                            {article.category}
                                        </span>
                                        {/<\/?[a-z][\s\S]*>/i.test(article.content) && (
                                            <span className="text-[9px] font-bold tracking-wider uppercase text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                                                Formatted
                                            </span>
                                        )}
                                        <RelativeTime
                                            date={article.created_at}
                                            format="absolute"
                                            className="text-[11px] text-woof-charcoal/40 font-medium"
                                        />
                                    </div>
                                    <h3 className="font-bold text-sm text-woof-charcoal group-hover:text-woof-gold transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-woof-charcoal/60 line-clamp-2 leading-relaxed">
                                        {article.content.replace(/<[^>]*>/g, '').substring(0, 200)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 mt-1">
                                    {isMgmt && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                router.get(route(`${baseRoute}.edit`, article.id));
                                            }}
                                            className="flex size-8 items-center justify-center rounded-full text-woof-charcoal/50 hover:text-woof-charcoal hover:bg-[#fcfbf9] border border-transparent hover:border-[#e8ded1] transition-all cursor-pointer"
                                            title="Edit article"
                                        >
                                            <Pencil className="size-3.5" />
                                        </button>
                                    )}
                                    <div className="size-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-charcoal/50 group-hover:text-woof-gold group-hover:border-woof-gold transition-colors">
                                        <ChevronRight className="size-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
