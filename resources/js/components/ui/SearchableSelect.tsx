import * as React from 'react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
    /** Compact sidebar-friendly styling — smaller text, rounded, no full-height input. */
    compact?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    className,
    disabled = false,
    compact = false,
}: SearchableSelectProps) {
    const listId = React.useId();
    const selectedLabel = options.find((o) => o.value === value)?.label || '';

    return (
        <div className={cn("relative", className)}>
            <input
                list={listId}
                disabled={disabled}
                placeholder={placeholder}
                defaultValue={selectedLabel}
                onChange={(e) => {
                    const opt = options.find((o) => o.label === e.target.value);
                    if (opt) onChange(opt.value);
                }}
                className={compact
                    ? 'w-full text-sm rounded border-gray-300 focus:border-woof-gold focus:ring-woof-gold disabled:opacity-50'
                    : 'w-full h-14 bg-white border border-woof-charcoal/10 px-6 font-bold text-base rounded-none outline-none focus:border-woof-gold disabled:opacity-50'
                }
            />
            <datalist id={listId}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.label} />
                ))}
            </datalist>
        </div>
    );
}
