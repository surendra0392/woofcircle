import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LayoutGrid, List } from 'lucide-react';
interface ResultsToolbarProps {
    total: number;
    view: 'grid' | 'list';
    onViewChange: (view: 'grid' | 'list') => void;
    orderBy: string;
    onOrderByChange: (value: string) => void;
    sortOptions?: { label: string; value: string }[];
    className?: string;
}
const defaultSortOptions = [
    { label: 'Featured First', value: 'featured' },
    { label: 'Newest Arrivals', value: 'latest' },
    { label: 'Rating: High to Low', value: 'rating' },
    { label: 'Price: Low to High', value: 'price_low' },
    { label: 'Price: High to Low', value: 'price_high' },
];
export default function ResultsToolbar({
    total,
    view,
    onViewChange,
    orderBy,
    onOrderByChange,
    sortOptions = defaultSortOptions,
    className,
}: ResultsToolbarProps) {
    return (
        <div className={cn('border-[#e8ded1] mb-8 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-center', className)}>
            <div className="flex items-center gap-3">
                <div className="bg-woof-gold h-7 w-1 rounded-full" />

                <div>
                    <p className="text-woof-charcoal text-2xl leading-none font-bold tracking-tight">
                        {total} <span className="text-woof-charcoal/50 text-base font-normal">results found</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="bg-woof-cream/80 border border-[#e8ded1] flex items-center gap-1 rounded-full p-1 shadow-2xs">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewChange('grid')}
                        className={cn(
                            'h-8 w-8 rounded-full transition-all cursor-pointer',
                            view === 'grid'
                                ? 'bg-woof-charcoal text-white shadow-xs'
                                : 'text-woof-charcoal/60 hover:text-woof-charcoal hover:bg-white/60',
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewChange('list')}
                        className={cn(
                            'h-8 w-8 rounded-full transition-all cursor-pointer',
                            view === 'list'
                                ? 'bg-woof-charcoal text-white shadow-xs'
                                : 'text-woof-charcoal/60 hover:text-woof-charcoal hover:bg-white/60',
                        )}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
                <div className="border-[#e8ded1] mx-1 hidden h-8 border-l md:block" />

                <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-woof-charcoal/50 hidden text-xs font-semibold uppercase tracking-wider lg:block">Sort:</span>

                    <Select value={orderBy} onValueChange={onOrderByChange}>
                        <SelectTrigger className="border-[#e8ded1] focus:border-woof-gold h-10 w-[190px] rounded-full bg-white text-xs font-medium text-woof-charcoal shadow-2xs">
                            <SelectValue placeholder="Featured First" />
                        </SelectTrigger>

                        <SelectContent className="border-[#e8ded1] shadow-xl rounded-2xl">
                            {sortOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="focus:bg-woof-cream focus:text-woof-gold cursor-pointer rounded-xl py-2 text-xs font-medium"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
