import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'custom';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const buttonVariants = ({
    variant,
    size,
    className,
}: {
    variant?: ButtonVariant | null;
    size?: ButtonSize | null;
    className?: string;
} = {}) => {
    const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-bold tracking-wider uppercase ring-offset-background transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-woof-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';
    
    const variants: Record<ButtonVariant, string> = {
        default: 'bg-woof-charcoal text-white hover:bg-woof-gold hover:text-woof-charcoal shadow-xs',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs',
        outline: 'border border-[#e8ded1] bg-white text-woof-charcoal hover:border-woof-gold/60 hover:bg-woof-cream/60 hover:text-woof-charcoal shadow-2xs',
        secondary: 'bg-woof-gold text-white hover:bg-woof-charcoal hover:text-white shadow-xs',
        ghost: 'hover:bg-woof-cream/70 hover:text-woof-charcoal shadow-none',
        link: 'text-woof-charcoal underline-offset-4 hover:underline shadow-none',
        custom: '',
    };
    
    const sizes: Record<ButtonSize, string> = {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-[10px]',
        lg: 'h-12 px-8 text-xs',
        icon: 'h-10 w-10 p-0',
    };

    let variantClass = '';
    if (variant) {
        variantClass = variants[variant] || variants.default;
    } else if (!className || (!className.includes('bg-') && !className.includes('text-') && !className.includes('bg[') && !className.includes('text['))) {
        variantClass = variants.default;
    }

    let sizeClass = '';
    if (size) {
        sizeClass = sizes[size] || sizes.default;
    } else if (!className || (!className.includes('h-') && !className.includes('px-') && !className.includes('p-') && !className.includes('h[') && !className.includes('p['))) {
        sizeClass = sizes.default;
    }

    return cn(base, variantClass, sizeClass, className);
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant | null;
    size?: ButtonSize | null;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        
        if (asChild) {
            const childrenArray = React.Children.toArray(props.children);
            const validChild = childrenArray.find(React.isValidElement);
            
            return (
                <Comp
                    className={buttonVariants({ variant, size, className })}
                    ref={ref}
                    {...props}
                >
                    {validChild}
                </Comp>
            );
        }

        return (
            <Comp
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        );
    },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
