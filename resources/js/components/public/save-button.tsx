import { Button } from '@/components/ui/button';
import { usePage, router } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface SaveButtonProps {
    itemId: number;
    itemType: 'breeder' | 'puppy' | 'adoption' | 'stud' | 'vet' | 'trainer' | 'boarding' | 'welfare' | 'pet_shop' | 'event';
    isSaved: boolean;
    className?: string;
    variant?: 'icon' | 'button' | 'outline';
    theme?: 'light' | 'dark';
}

export default function SaveButton({ itemId, itemType, isSaved, className, variant = 'icon', theme = 'light' }: SaveButtonProps) {
    const { auth } = usePage<SharedData>().props;
    const [saved, setSaved] = useState(isSaved);
    const [loading, setLoading] = useState(false);

    // Sync state if props change
    useEffect(() => {
        setSaved(isSaved);
    }, [isSaved]);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            toast.error('Please log in to save listings.');
            router.visit(route('login'));
            return;
        }

        setLoading(true);
        // Optimistic UI update
        const newSavedState = !saved;
        setSaved(newSavedState);

        router.post(
            route('save-item.toggle', { type: itemType, id: itemId }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                    setSaved(!newSavedState); // revert optimistic update
                    toast.error('Something went wrong. Please try again.');
                },
            }
        );
    };

    if (variant === 'button') {
        const buttonClasses = theme === 'dark'
            ? (saved 
                ? 'bg-woof-gold text-white border border-woof-gold hover:bg-woof-gold/90 shadow-sm' 
                : 'border border-white/20 text-white/90 hover:text-woof-gold hover:bg-white/10 bg-transparent')
            : (saved 
                ? 'bg-woof-gold text-white border border-woof-gold hover:bg-woof-gold/90 shadow-sm' 
                : 'border border-woof-charcoal text-woof-charcoal hover:bg-woof-charcoal hover:text-white bg-transparent');

        return (
            <button
                onClick={handleSave}
                disabled={loading}
                className={cn(
                    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-xs font-bold tracking-wider uppercase transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 h-11 cursor-pointer shadow-xs',
                    buttonClasses,
                    className
                )}
            >
                <Heart className={cn('h-4.5 w-4.5 stroke-[2.25] shrink-0 transition-transform duration-300', saved ? 'fill-current text-white scale-110' : 'hover:scale-110')} />
                <span>{saved ? 'Saved' : 'Save Listing'}</span>
            </button>
        );
    }

    if (variant === 'outline') {
        return (
            <Button
                onClick={handleSave}
                disabled={loading}
                variant="outline"
                className={cn(
                    'border-[#e8ded1] text-woof-charcoal hover:border-woof-gold hover:text-woof-gold h-10 w-10 cursor-pointer rounded-full p-0 transition-colors shadow-2xs',
                    saved ? 'text-woof-gold border-woof-gold/40 bg-woof-gold/10' : '',
                    className
                )}
            >
                <Heart className={cn('h-5 w-5 stroke-[2] shrink-0 transition-transform duration-300', saved ? 'fill-current text-rose-500 scale-110' : 'text-woof-charcoal/70 hover:scale-110')} />
            </Button>
        );
    }

    // Default 'icon' variant - round overlay with shadow
    return (
        <button
            onClick={handleSave}
            disabled={loading}
            className={cn(
                'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 border border-black/5',
                saved ? 'text-rose-500' : 'text-woof-charcoal/70 hover:text-rose-500',
                className
            )}
        >
            <Heart className={cn('h-5 w-5 stroke-[2.25] shrink-0 transition-all duration-300', saved ? 'fill-current text-rose-500 scale-105' : 'hover:scale-105')} />
        </button>
    );
}
