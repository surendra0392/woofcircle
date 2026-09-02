import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, User, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface ArticleCardProps {
    article: {
        title: string;
        excerpt: string;
        category: string;
        readTime: string;
        author: string;
        image: string;
        href: string;
    };
    view?: 'grid' | 'list';
}

export default function ArticleCard({ article, view = 'grid' }: ArticleCardProps) {
    const [imgErr, setImgErr] = useState(false);

    return (
        <Link
            href={article.href}
            className={cn(
                'group relative flex h-full bg-white border border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-lg rounded-3xl overflow-hidden transition-all duration-300',
                view === 'grid' ? 'flex-col p-2' : 'h-auto md:h-[280px] flex-col md:flex-row items-center w-full p-2 gap-4'
            )}
        >
            {/* Image Container */}
            <div className={cn(
                'relative overflow-hidden rounded-2xl bg-[#fcfbf9]',
                view === 'grid' ? 'aspect-[16/10] w-full' : 'h-48 md:h-full w-full md:w-[320px] flex-shrink-0'
            )}>
                {!imgErr && article.image ? (
                    <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={() => setImgErr(true)}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-woof-cream/50 text-woof-charcoal/40">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#e8ded1] shadow-2xs mb-2">
                            <BookOpen className="h-6 w-6 text-woof-gold" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Article</span>
                    </div>
                )}

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-woof-charcoal/80 via-transparent to-transparent opacity-60" />
                
                {/* Category Badge overlay on image */}
                <div className="absolute bottom-3 left-4 bg-woof-gold text-white px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full shadow-2xs">
                    {article.category}
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-4 sm:p-5 h-full justify-between">
                <div>
                    <div className="flex items-center gap-3 text-xs font-medium text-woof-charcoal/60 mb-2.5">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-woof-gold" /> {article.readTime}</span>
                        <span className="w-1 h-1 rounded-full bg-woof-charcoal/20" />
                        <span className="flex items-center gap-1.5 truncate"><User className="w-3.5 h-3.5 text-woof-gold" /> {article.author}</span>
                    </div>

                    <h4 className={cn(
                        'text-woof-charcoal font-sans font-bold leading-snug tracking-tight mb-2 group-hover:text-woof-gold transition-colors duration-300',
                        view === 'grid' ? 'text-base sm:text-lg line-clamp-2' : 'text-lg sm:text-xl line-clamp-2'
                    )}>
                        {article.title}
                    </h4>

                    <p className="text-woof-charcoal/70 text-xs leading-relaxed mb-4 line-clamp-2 font-normal">
                        {article.excerpt}
                    </p>
                </div>

                {/* Read More Footer */}
                <div className="pt-3.5 border-t border-[#e8ded1] flex items-center justify-between mt-auto">
                    <span className="text-woof-charcoal text-xs font-bold tracking-wider uppercase group-hover:text-woof-gold transition-colors duration-300">
                        Read Article
                    </span>
                    <div className="w-8 h-8 rounded-full border border-[#e8ded1] flex items-center justify-center group-hover:border-woof-gold group-hover:bg-woof-gold group-hover:text-white transition-all duration-300 text-woof-charcoal/70">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
