import { Activity } from 'lucide-react';
import React from 'react';

import { PlatformStatus } from './types';

interface PlatformPulseProps {
    platformStatus: PlatformStatus[];
}

export const PlatformPulse: React.FC<PlatformPulseProps> = ({ platformStatus }) => {
    return (
        <div className="bg-woof-charcoal hidden overflow-hidden border-b border-white/5 py-4 md:block">
            <div className="animate-marquee flex items-center gap-24 whitespace-nowrap">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-24">
                        {platformStatus.map((status, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div
                                    className={`size-1.5 rounded-none ${status.status === 'Operational' ? 'animate-pulse bg-green-500' : 'bg-amber-500'}`}
                                />
                                <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">{status.label}:</span>
                                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${status.color}`}>{status.status}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-4">
                            <Activity className="text-woof-gold size-4" />
                            <span className="text-woof-gold text-[10px] font-black tracking-[0.3em] uppercase">Sanctuary Heartbeat: 42ms</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
