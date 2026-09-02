import { Link } from '@inertiajs/react';
import { ArrowRight, Settings, Star, TrendingUp } from 'lucide-react';
import React from 'react';
import { ResourceItem, TrendingTopic } from './types';

interface ResourceCenterProps {
    resources: ResourceItem[];
    trendingTopics: TrendingTopic[];
    onSearch: (query: string) => void;
}

export const ResourceCenter: React.FC<ResourceCenterProps> = ({ resources, trendingTopics, onSearch }) => {
    return (
        <section className="bg-woof-cream text-woof-charcoal relative overflow-hidden py-32">
            <div className="bg-woof-charcoal/5 absolute right-0 bottom-0 h-full w-1/3 translate-x-20 skew-x-12" />
            <div className="container-wide relative z-10 px-6 lg:px-12">
                <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-2">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="text-woof-gold flex items-center gap-3">
                                <Settings className="size-5" />
                                <span className="text-xs font-black tracking-[0.5em] uppercase">Resources</span>
                            </div>
                            <h2 className="text-woof-charcoal text-5xl leading-[1] font-black tracking-[0.01em] uppercase">
                                Operational <br />
                                <span className="text-woof-gold uppercase">Center.</span>
                            </h2>
                            <p className="text-woof-charcoal/60 max-w-xl text-lg leading-relaxed font-medium">
                                Access our library of technical specifications, standard operating procedures, and ethical handbooks.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {resources.map((res, i) => (
                                <div
                                    key={i}
                                    className="border-woof-charcoal/5 hover:border-woof-gold group space-y-6 border bg-white p-8 shadow-sm transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-woof-gold">{res.icon}</div>
                                        <span className="text-woof-charcoal/40 group-hover:text-woof-gold text-xs font-bold leading-[0.5em]">{res.type}</span>
                                    </div>
                                    <h4 className="text-woof-charcoal group-hover:text-woof-gold text-lg font-black tracking-[0.01em] uppercase transition-colors">
                                        {res.title}
                                    </h4>
                                    <div className="border-woof-charcoal/5 flex items-center justify-between border-t pt-4">
                                        <span className="text-woof-charcoal/40 text-[9px] font-bold tracking-widest uppercase">{res.size}</span>
                                        <button className="text-woof-gold hover:text-woof-charcoal text-[9px] font-black tracking-[0.3em] uppercase transition-colors">
                                            Download —
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-16 lg:sticky lg:top-12">
                        {/* Trending Section */}
                        <div className="bg-woof-charcoal space-y-8 p-12 shadow-2xl">
                            <div className="text-woof-gold flex items-center gap-4">
                                <TrendingUp className="size-6" />
                                <span className="text-[11px] font-black tracking-[0.5em] uppercase">Trending Now</span>
                            </div>
                            <div className="space-y-4">
                                {trendingTopics.map((topic, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSearch(topic.title)}
                                        className="group hover:border-woof-gold/50 flex w-full items-center justify-between border border-white/5 p-6 transition-all hover:bg-white/5"
                                    >
                                        <div className="space-y-1 text-left">
                                            <span className="text-woof-gold/70 text-[10px] font-black tracking-widest uppercase">
                                                {topic.category}
                                            </span>
                                            <h5 className="text-sm font-bold tracking-[0.05em] text-white uppercase">{topic.title}</h5>
                                        </div>
                                        <ArrowRight className="group-hover:text-woof-gold size-4 text-white/20 transition-all group-hover:translate-x-2" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-woof-charcoal/5 space-y-8 border bg-white p-12 shadow-xl">
                            <div className="text-woof-gold flex items-center gap-4">
                                <Star className="size-6" />
                                <span className="text-xs font-black tracking-[0.5em] uppercase">The Breeder Pledge</span>
                            </div>
                            <h3 className="text-woof-charcoal text-2xl leading-tight font-black tracking-tight uppercase">
                                Commitment to Genetic Integrity.
                            </h3>
                            <p className="text-woof-charcoal/60 text-base leading-relaxed font-medium">
                                Our platform isn't just a marketplace; it's a movement. Every professional on the sanctuary has signed the{' '}
                                <Link href="/terms-and-ethics" className="text-woof-gold hover:underline">
                                    Breeder Pledge
                                </Link>
                                , committing to DNA-verified health.
                            </p>
                            <div className="border-woof-charcoal/10 border-t pt-6">
                                <Link
                                    href="/terms-and-ethics"
                                    className="group text-woof-charcoal hover:text-woof-gold flex items-center gap-4 transition-colors"
                                >
                                    <span className="text-xs font-black tracking-widest uppercase">Review the Full Pledge</span>
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
