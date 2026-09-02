import { ShieldAlert, HeartPulse } from 'lucide-react';

interface AnalyticsProps {
    data: {
        health_score: number;
        vaccination_timeline: { month: string; count: number }[];
        overdue_count: number;
    };
}

export function PetHealthAnalytics({ data }: AnalyticsProps) {
    const { health_score, vaccination_timeline, overdue_count } = data;
    const maxCount = Math.max(...vaccination_timeline.map(t => t.count), 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Health Score Gauge */}
            <div className="bg-white border border-woof-charcoal/10 p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-4 left-4">
                    <HeartPulse className="h-5 w-5 text-woof-gold" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50 mb-6">Pet Health Score</h3>
                
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            className="text-woof-charcoal/5"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className={`${health_score > 80 ? 'text-emerald-500' : health_score > 50 ? 'text-woof-gold' : 'text-rose-500'} transition-all duration-1000`}
                            strokeWidth="8"
                            strokeDasharray={264}
                            strokeDashoffset={264 - (264 * health_score) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-woof-charcoal">{health_score}</span>
                        <span className="text-[10px] font-bold text-woof-charcoal/40 uppercase">/ 100</span>
                    </div>
                </div>
                
                <p className="text-xs font-medium text-woof-charcoal/60 mt-6 text-center">
                    Based on vaccination history and profile completeness.
                </p>
            </div>

            {/* Vaccination Timeline Chart */}
            <div className="bg-white border border-woof-charcoal/10 p-6 lg:col-span-2 relative">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-woof-charcoal/50">Vaccination Timeline</h3>
                        <p className="text-sm font-bold text-woof-charcoal mt-1">Last 6 Months Activity</p>
                    </div>
                    {overdue_count > 0 && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1.5 flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4" />
                            <span className="text-[10px] font-black tracking-widest uppercase">{overdue_count} Overdue</span>
                        </div>
                    )}
                </div>

                <div className="h-32 flex items-end justify-between gap-2 mt-4 px-2">
                    {vaccination_timeline.map((item, index) => {
                        const heightPercentage = (item.count / maxCount) * 100;
                        return (
                            <div key={index} className="flex flex-col items-center flex-1 group/bar relative">
                                <div className="w-full flex justify-center h-24 items-end">
                                    <div 
                                        className="w-1/2 min-w-[20px] bg-woof-charcoal/10 group-hover/bar:bg-woof-gold transition-all duration-500 rounded-t-sm relative"
                                        style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-woof-charcoal text-white text-xs font-bold py-1 px-2 pointer-events-none">
                                            {item.count}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black tracking-widest text-woof-charcoal/40 uppercase mt-4">
                                    {item.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
