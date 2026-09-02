import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-11 w-full rounded-2xl border border-[#e8ded1] bg-white px-4 py-2 text-sm font-medium text-woof-charcoal placeholder:text-woof-charcoal/40 transition-all duration-300 focus-visible:outline-none focus-visible:border-woof-gold focus-visible:ring-2 focus-visible:ring-woof-gold/20 disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';
export { Input };
