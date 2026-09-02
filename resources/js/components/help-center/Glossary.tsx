import { Lightbulb } from 'lucide-react';
import React from 'react';

import { GlossaryItem } from './types';

interface GlossaryProps {
    glossary: GlossaryItem[];
}

export const Glossary: React.FC<GlossaryProps> = ({ glossary }) => {
    return (
        <section className="bg-woof-charcoal border-t border-white/5 py-32">
            <div className="container-wide px-6 lg:px-12">
                <div className="grid grid-cols-1 gap-24 lg:grid-cols-3">
                    <div className="space-y-8">
                        <div className="text-woof-gold flex items-center gap-3">
                            <Lightbulb className="size-5" />
                            <span className="text-xs font-black tracking-[0.5em] uppercase">Sanctuary Glossary</span>
                        </div>
                        <h2 className="text-5xl leading-none font-black tracking-[0.01em] text-white uppercase">
                            Decode the <br />
                            <span className="text-woof-gold uppercase">Sanctuary.</span>
                        </h2>
                        <p className="text-woof-on-dark-muted text-lg leading-[2] tracking-wider font-medium">
                            "Clarity is the foundation of trust. Understanding our unique terminology ensures a seamless journey through the
                            sanctuary."
                        </p>
                    </div>
                    <div className="hover:shadow-gold grid grid-cols-1 gap-8 transition-all duration-300 hover:shadow-2xl md:grid-cols-2 lg:col-span-2">
                        {glossary.map((item, i) => (
                            <div
                                key={i}
                                className="group hover:border-woof-gold space-y-4 border border-white/5 bg-white/5 p-10 backdrop-blur-sm transition-all"
                            >
                                <h4 className="group-hover:text-woof-gold text-lg font-bold tracking-[0.03em] text-white uppercase transition-colors">
                                    {item.term}
                                </h4>
                                <p className="text-woof-on-dark-muted text-sm leading-[2] tracking-wider font-medium">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
