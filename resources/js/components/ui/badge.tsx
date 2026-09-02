import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const badgeVariants = ({
    variant,
    className,
}: {
    variant?: BadgeVariant | null;
    className?: string;
} = {}) => {
    const base = 'inline-flex items-center border rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2';
    
    const variants: Record<BadgeVariant, string> = {
        default: 'border-transparent bg-woof-charcoal text-white',
        secondary: 'border-transparent bg-woof-gold text-white',
        destructive: 'border-transparent bg-rose-600 text-white',
        outline: 'text-woof-charcoal border-[#e8ded1] bg-white',
    };

    // If explicit variant is provided, use it.
    // If no variant is provided, only apply variants.default if className does NOT specify custom background or text colors
    let variantClass = '';
    if (variant) {
        variantClass = variants[variant] || variants.default;
    } else if (!className || (!className.includes('bg-') && !className.includes('text-'))) {
        variantClass = variants.default;
    }

    return cn(base, variantClass, className);
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant | null;
}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={badgeVariants({ variant, className })} {...props} />;
}

export { Badge, badgeVariants };
