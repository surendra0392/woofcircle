import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: 'danger' | 'warning' | 'default';
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    loading = false,
    variant = 'danger',
}: ConfirmDialogProps) {
    const confirmButtonStyles = {
        danger:
            'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20',
        warning:
            'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20',
        default:
            'bg-woof-charcoal hover:bg-woof-charcoal/90 text-white shadow-lg',
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center ${
                                variant === 'danger'
                                    ? 'bg-rose-100 text-rose-600'
                                    : variant === 'warning'
                                      ? 'bg-amber-100 text-amber-600'
                                      : 'bg-woof-charcoal/10 text-woof-charcoal'
                            }`}
                        >
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-black uppercase tracking-tight">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-woof-charcoal/50">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="h-11 flex-1 border-woof-charcoal/20 text-[9px] font-black uppercase tracking-widest text-woof-charcoal/70 hover:bg-woof-charcoal/5 sm:flex-none sm:px-8"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex h-11 flex-1 items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.97] sm:flex-none sm:px-8 ${confirmButtonStyles[variant]}`}
                    >
                        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
