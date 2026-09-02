'use client'; 
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as React from 'react';
import { cn } from '@/lib/utils';

export type ToggleVariant = 'default' | 'outline';
export type ToggleSize = 'default' | 'sm' | 'lg';

const toggleVariants = ({
    variant = 'default',
    size = 'default',
    className,
}: {
    variant?: ToggleVariant | null;
    size?: ToggleSize | null;
    className?: string;
} = {}) => {
    const base = 'inline-flex items-center justify-center rounded-none text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2';
    
    const variants: Record<ToggleVariant, string> = {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    };
    
    const sizes: Record<ToggleSize, string> = {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-9 px-2.5 min-w-9',
        lg: 'h-11 px-5 min-w-11',
    };

    return cn(base, variants[variant || 'default'], sizes[size || 'default'], className);
};

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
    variant?: ToggleVariant | null;
    size?: ToggleSize | null;
}

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
    ({ className, variant, size, ...props }, ref) => (
        <TogglePrimitive.Root ref={ref} className={toggleVariants({ variant, size, className })} {...props} />
    )
);
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
