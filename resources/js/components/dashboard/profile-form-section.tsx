import { type ReactNode } from 'react';

interface FormSectionProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
    htmlFor?: string;
    id?: string;
}

export function ProfileFormSection({ icon, title, description, children, className = '', htmlFor, id }: FormSectionProps) {
    return (
        <div
            className={`relative overflow-hidden border border-[#e8ded1] bg-white rounded-3xl shadow-xs transition-all duration-300 ${className}`}
        >
            {/* Header */}
            {(icon || title) && (
                <div className="flex items-center gap-3.5 border-b border-[#e8ded1] px-6 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-8 bg-white">
                    {icon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold">
                            {icon}
                        </div>
                    )}
                    <div className="min-w-0">
                        {htmlFor || id ? (
                            <label htmlFor={htmlFor} id={id} className="text-base font-bold text-woof-charcoal block cursor-pointer">
                                {title}
                            </label>
                        ) : (
                            <h3 className="text-base font-bold text-woof-charcoal">{title}</h3>
                        )}
                        {description && (
                            <p className="mt-0.5 text-xs text-woof-charcoal/60">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">{children}</div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    accent?: boolean;
}

export function ProfileStatCard({ label, value, icon, accent = false }: StatCardProps) {
    return (
        <div
            className={`border rounded-3xl p-5 text-center transition-all duration-300 hover:shadow-md ${
                accent
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-[#e8ded1] bg-white shadow-xs'
            }`}
        >
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">{label}</p>
            <div className="flex items-center justify-center gap-2">
                {icon}
                <span className={`text-xl font-bold ${accent ? 'text-amber-800' : 'text-woof-charcoal'}`}>{value}</span>
            </div>
        </div>
    );
}
