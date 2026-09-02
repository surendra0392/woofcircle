import { protocols } from '@/data/help-center-data';
import { ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import React from 'react';
import { ProtocolType } from './types';

interface SanctuaryProtocolsProps {
    activeProtocol: ProtocolType;
    setActiveProtocol: (protocol: ProtocolType) => void;
}

export const SanctuaryProtocols: React.FC<SanctuaryProtocolsProps> = ({ activeProtocol, setActiveProtocol }) => {
    return (
        <section className="relative overflow-hidden bg-white py-32">
            <div className="container-wide px-6 lg:px-12">
                <div className="flex flex-col items-start gap-24 lg:flex-row">
                    <div className="w-full space-y-12 lg:w-1/3">
                        <div className="space-y-6">
                            <div className="text-woof-gold flex items-center gap-3">
                                <ShieldCheck className="size-5" />
                                <span className="text-xs font-black tracking-[0.5em] uppercase">Sanctuary Protocols</span>
                            </div>
                            <h2 className="text-woof-charcoal text-5xl leading-[1] font-black tracking-[0.01em] uppercase">
                                Engineered <br />
                                <span className="text-woof-gold uppercase">Integrity.</span>
                            </h2>
                            <p className="text-md text-woof-charcoal/60 leading-[2] font-medium">
                                We replace uncertainty with rigid, automated protocols. Explore the mechanics of our safety architecture.
                            </p>
                        </div>

                        <div className="space-y-2">
                            {(Object.keys(protocols) as ProtocolType[]).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveProtocol(key)}
                                    className={`group flex w-full items-center justify-between border p-8 text-left transition-all ${
                                        activeProtocol === key
                                            ? 'bg-woof-charcoal border-woof-charcoal translate-x-2 text-white shadow-xl'
                                            : 'bg-woof-cream/50 border-woof-charcoal/5 text-woof-charcoal hover:bg-woof-cream hover:border-woof-charcoal/20'
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <span
                                            className={`text-xs font-black tracking-widest uppercase ${
                                                activeProtocol === key ? 'text-woof-gold' : 'text-woof-charcoal/40'
                                            }`}
                                        >
                                            {protocols[key].subtitle}
                                        </span>
                                        <h4
                                            className={`text-lg font-black tracking-tight uppercase ${
                                                activeProtocol === key ? 'text-white' : 'text-woof-charcoal'
                                            }`}
                                        >
                                            {protocols[key].title}
                                        </h4>
                                    </div>
                                    <ArrowRight
                                        className={`size-5 transition-all ${
                                            activeProtocol === key
                                                ? 'text-woof-gold translate-x-2'
                                                : 'text-woof-charcoal/20 group-hover:text-woof-gold group-hover:translate-x-1'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-woof-charcoal relative flex min-h-[700px] w-full flex-1 flex-col justify-between overflow-hidden p-12 shadow-2xl lg:p-20">
                        <div className="pointer-events-none absolute inset-0 opacity-40">
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-1000"
                                style={{ backgroundImage: `url(${protocols[activeProtocol].image})` }}
                            />
                            <div className="from-woof-charcoal via-woof-charcoal/40 absolute inset-0 bg-gradient-to-t to-transparent"></div>
                        </div>

                        <div className="relative z-10 space-y-16">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Layers className="text-woof-gold size-6" />
                                    <span className="text-woof-gold text-xs font-black tracking-[0.4em] uppercase">
                                        {protocols[activeProtocol].subtitle}
                                    </span>
                                </div>
                                <h3 className="text-3xl leading-[1.2] font-black tracking-[0.01em] text-white uppercase lg:text-4xl">
                                    {protocols[activeProtocol].title}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {protocols[activeProtocol].steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="animate-in fade-in slide-in-from-bottom-8 space-y-4 border border-white/5 bg-white/5 p-8 backdrop-blur-sm duration-700"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-woof-gold text-lg font-bold tracking-[0.1em]">0{i + 1}.</span>
                                            <h5 className="text-md font-black tracking-[0.01em] text-white uppercase">{step.title}</h5>
                                        </div>
                                        <p className="text-woof-on-dark-muted text-sm leading-relaxed font-medium">"{step.desc}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-wrap items-center justify-between gap-8 border-t border-white/10 pt-16">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">
                                    Trusted by over 14,000 Verified Members
                                </span>
                            </div>
                            <button className="bg-woof-gold text-woof-charcoal shadow-woof-gold/10 cursor-pointer px-12 py-5 text-[10px] font-black tracking-[0.3em] uppercase shadow-lg transition-all hover:bg-white">
                                Audit Your Compliance Status —
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
