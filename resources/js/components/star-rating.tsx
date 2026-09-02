import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: 3 | 4 | 5 | 6 | 7 | number;
    className?: string;
    onRate?: (rating: number) => void;
    interactive?: boolean;
}

const sizeClasses: Record<number, string> = {
    3: 'h-3.5 w-3.5',
    4: 'h-4.5 w-4.5',
    5: 'h-5.5 w-5.5',
    6: 'h-6.5 w-6.5',
    7: 'h-7.5 w-7.5',
};

export function StarRating({ rating, max = 5, size = 4, className, onRate, interactive = false }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const activeRating = hoverRating !== null ? hoverRating : rating;

    return (
        <div
            className={cn('flex items-center gap-1', className)}
            onMouseLeave={() => interactive && setHoverRating(null)}
        >
            {Array.from({ length: max }).map((_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= Math.round(activeRating);
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onMouseEnter={() => interactive && setHoverRating(starValue)}
                        onClick={() => interactive && onRate?.(starValue)}
                        className={cn(
                            'p-0.5 transition-all duration-200 focus:outline-none',
                            interactive ? 'cursor-pointer hover:scale-125 active:scale-95' : 'cursor-default pointer-events-none'
                        )}
                        aria-label={`${starValue} Star`}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size] || 'h-4.5 w-4.5',
                                'transition-colors duration-200',
                                isFilled
                                    ? 'text-woof-gold fill-woof-gold drop-shadow-xs'
                                    : 'text-[#dfd5c7] fill-[#f4ece1]/70'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
