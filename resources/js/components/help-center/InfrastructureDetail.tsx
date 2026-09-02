import { Lock, Shield, Truck } from 'lucide-react';
import React from 'react';
import { InfrastructureFeature } from './types';

const features: InfrastructureFeature[] = [
    {
        title: 'Settlement Protocol',
        icon: <Lock className="size-6" />,
        desc: 'Transparent, milestone-based direct settlements. Funds are triggered for transfer only when the Handover Certificate is verified.',
        specs: ['Direct P2P Settlement', 'Milestone Verification', 'Immutable Ledger'],
    },
    {
        title: 'Checkpoint Logistics',
        icon: <Truck className="size-6" />,
        desc: 'Human-verified safety network across India. Professional handlers log status updates at every sanctuary node checkpoint.',
        specs: ['Node-based Health checks', 'Certified Handlers', 'Live Node Reporting'],
    },
    {
        title: 'Genetic Integrity',
        icon: <Shield className="size-6" />,
        desc: 'Mandatory DNA and health screening for all Champion listings, verified by our board of veterinary experts.',
        specs: ['DNA verification', 'Health registry', 'Expert audit'],
    },
];

export const InfrastructureDetail: React.FC = () => {
    return (
        <section className="bg-woof-charcoal border-t border-white/5 py-32">
            <div className="container-wide px-6 lg:px-12">
                <div className="mx-auto mb-16 max-w-3xl space-y-6 text-center">
                    <span className="text-woof-gold text-xs font-black tracking-[0.5em] uppercase">Platform Engineering</span>
                    <h2 className="mt-2 text-4xl leading-[1] font-black tracking-[0.01em] text-white uppercase lg:text-5xl">
                        The Sanctuary <br />
                        <span className="text-woof-gold uppercase">Architecture.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-px border border-white/5 bg-white/5 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <div key={i} className="group space-y-10 bg-white/5 p-16 transition-all duration-500 hover:bg-white">
                            <div className="text-woof-gold group-hover:bg-woof-charcoal group-hover:text-woof-gold flex size-16 items-center justify-center bg-white/5 transition-all">
                                {feature.icon}
                            </div>
                            <div className="space-y-4">
                                <h3 className="group-hover:text-woof-charcoal text-2xl font-black tracking-tight text-white uppercase transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-woof-on-dark-muted group-hover:text-woof-charcoal/60 text-sm leading-relaxed font-medium transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                            <div className="group-hover:border-woof-charcoal/10 space-y-4 border-t border-white/5 pt-8">
                                <p className="text-woof-on-dark-subtle group-hover:text-woof-gold mb-2 text-[10px] font-black tracking-widest uppercase">
                                    Technical Specs:
                                </p>
                                {feature.specs.map((spec, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className="bg-woof-gold group-hover:bg-woof-charcoal size-1" />
                                        <span className="text-woof-on-dark-muted group-hover:text-woof-charcoal text-[10px] font-black tracking-widest uppercase transition-all">
                                            {spec}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
