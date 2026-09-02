import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
    className?: string;
}

export function Pagination({ links, className }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center py-8', className)}>
            <ul className="flex flex-row items-center gap-1">
                {links.map((link, i) => {
                    const isPrev = link.label.includes('&laquo;') || link.label.toLowerCase().includes('previous');
                    const isNext = link.label.includes('&raquo;') || link.label.toLowerCase().includes('next');
                    const isDots = link.label === '...';

                    if (isDots) {
                        return (
                            <li key={i} className="flex h-10 w-10 items-center justify-center">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More pages</span>
                            </li>
                        );
                    }

                    if (!link.url) {
                        return (
                            <li key={i}>
                                <span
                                    className={cn(
                                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                                        'opacity-30 cursor-not-allowed',
                                        (isPrev || isNext) && 'w-auto px-4',
                                    )}
                                >
                                    {isPrev && <ChevronLeft className="h-4 w-4 mr-1" />}
                                    {isPrev ? 'Previous' : isNext ? 'Next' : link.label}
                                    {isNext && <ChevronRight className="h-4 w-4 ml-1" />}
                                </span>
                            </li>
                        );
                    }

                    return (
                        <li key={i}>
                            <Link
                                href={link.url}
                                className={cn(
                                    buttonVariants({
                                        variant: link.active ? 'default' : 'ghost',
                                        size: 'icon',
                                    }),
                                    link.active && 'bg-woof-gold text-white hover:bg-woof-charcoal hover:text-white',
                                    (isPrev || isNext) && 'w-auto px-4',
                                    'rounded-full font-bold transition-all shadow-2xs',
                                )}
                            >
                                {isPrev && <ChevronLeft className="h-4 w-4 mr-1" />}
                                {isPrev ? 'Previous' : isNext ? 'Next' : link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
                                {isNext && <ChevronRight className="h-4 w-4 ml-1" />}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

