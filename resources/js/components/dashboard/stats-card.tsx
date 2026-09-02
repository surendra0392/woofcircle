import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: { value: string; positive: boolean };
    color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'gold';
    layout?: 'horizontal' | 'vertical';
    iconSize?: 'sm' | 'md' | 'lg';
    htmlFor?: string;
    id?: string;
}

const colors = {
    blue: 'bg-woof-pearl/20 text-woof-charcoal border-woof-pearl/40',
    indigo: 'bg-woof-champagne/20 text-woof-charcoal border-woof-champagne/40',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    gold: 'bg-woof-gold/15 text-woof-gold border-woof-gold/30',
};

const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const iconBoxSizes = {
    sm: 'p-2.5',
    md: 'p-3.5',
    lg: 'p-4',
};

export function StatsCard({ title, value, icon: Icon, description, trend, color = 'gold', layout = 'horizontal', iconSize = 'md', htmlFor, id }: StatsCardProps) {
    if (layout === 'vertical') {
        return (
            <div className="border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md flex flex-col gap-3.5 group">
                <div className={`rounded-xl border self-start flex items-center justify-center transition-transform group-hover:scale-105 ${iconBoxSizes[iconSize]} ${colors[color]}`}>
                    <Icon className={iconSizes[iconSize]} />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        {htmlFor || id ? (
                            <label htmlFor={htmlFor} id={id} className="text-woof-charcoal/50 mb-0.5 text-[10px] font-bold tracking-wider uppercase truncate block cursor-pointer">{title}</label>
                        ) : (
                            <h4 className="text-woof-charcoal/50 mb-0.5 text-[10px] font-bold tracking-wider uppercase truncate">{title}</h4>
                        )}
                        {trend && (
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${trend.positive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                                {trend.value}
                            </span>
                        )}
                    </div>
                    <p className="text-woof-charcoal text-2xl font-black tracking-tight">{value}</p>
                    {description && <p className="text-woof-charcoal/50 mt-1 text-[11px] font-medium truncate">{description}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="border-[#e8ded1] hover:border-woof-gold/40 rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md flex items-start gap-4 group">
            <div className={`rounded-xl border shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${iconBoxSizes[iconSize]} ${colors[color]}`}>
                <Icon className={iconSizes[iconSize]} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    {htmlFor || id ? (
                        <label htmlFor={htmlFor} id={id} className="text-woof-charcoal/50 mb-0.5 text-[10px] font-bold tracking-wider uppercase truncate block cursor-pointer">{title}</label>
                    ) : (
                        <h4 className="text-woof-charcoal/50 mb-0.5 text-[10px] font-bold tracking-wider uppercase truncate">{title}</h4>
                    )}
                    {trend && (
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${trend.positive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                            {trend.value}
                        </span>
                    )}
                </div>
                <p className="text-woof-charcoal text-2xl font-black tracking-tight">{value}</p>
                {description && <p className="text-woof-charcoal/50 mt-1 text-[11px] font-medium truncate">{description}</p>}
            </div>
        </div>
    );
}
