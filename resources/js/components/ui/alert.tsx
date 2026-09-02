import * as React from 'react';
import { cn } from '@/lib/utils';

export type AlertVariant = 'default' | 'destructive';

const alertVariants = ({
    variant,
    className,
}: {
    variant?: AlertVariant | null;
    className?: string;
} = {}) => {
    const base = 'relative w-full rounded-2xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground';
    
    const variants: Record<AlertVariant, string> = {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive [&>svg]:text-destructive',
    };

    let variantClass = '';
    if (variant) {
        variantClass = variants[variant] || variants.default;
    } else if (!className || (!className.includes('bg-') && !className.includes('text-') && !className.includes('bg[') && !className.includes('text['))) {
        variantClass = variants.default;
    }

    return cn(base, variantClass, className);
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant | null;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, ...props }, ref) => (
        <div ref={ref} role="alert" className={alertVariants({ variant, className })} {...props} />
    )
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
    )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
    )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle, alertVariants };
