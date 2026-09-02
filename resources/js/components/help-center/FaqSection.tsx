import { ChevronRight, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import { FaqItem } from './types';

interface FaqSectionProps {
    faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-woof-cream border-woof-charcoal/5 relative overflow-hidden border-t py-32">
            <div
                className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.03] grayscale"
                style={{ backgroundImage: "url('/images/cinematic/pattern.svg')" }}
            />

            <div className="container-wide relative z-10 px-6 lg:px-12">
                <div
                    className="mx-auto mb-20 max-w-3xl space-y-6 text-center"
                >
                    <div className="text-woof-gold flex items-center justify-center gap-3">
                        <HelpCircle className="size-5" />
                        <span className="text-xs font-black tracking-[0.4em] uppercase">Curated Answers</span>
                    </div>
                    <h2 className="text-woof-charcoal mt-2 text-3xl leading-none font-black tracking-[0.01em] uppercase lg:text-5xl">
                        The FAQ  &nbsp;
                        <span className="text-woof-gold uppercase">Archives.</span>
                    </h2>
                </div>

                <div className="mx-auto max-w-4xl space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`group overflow-hidden border transition-all duration-500 ${
                                openIndex === i
                                    ? 'border-woof-gold/30 bg-white shadow-2xl'
                                    : 'border-woof-charcoal/5 hover:border-woof-gold/20 bg-white/50'
                            }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex w-full cursor-pointer items-center justify-between p-8 text-left focus:outline-none lg:p-10"
                            >
                                <span
                                    className={`text-md font-black tracking-wider uppercase transition-colors duration-500 lg:text-lg ${
                                        openIndex === i ? 'text-woof-gold' : 'text-woof-charcoal'
                                    }`}
                                >
                                    {faq.q}
                                </span>
                                <div
                                    className={`flex size-10 items-center justify-center border transition-all duration-500 ${
                                        openIndex === i
                                            ? 'bg-woof-gold border-woof-gold text-woof-charcoal rotate-90'
                                            : 'border-woof-charcoal/10 text-woof-gold group-hover:border-woof-gold/30'
                                    }`}
                                >
                                    <ChevronRight className="size-5" />
                                </div>
                            </button>

                            {openIndex === i && (
                                    <div
                                    >
                                        <div className="text-woof-charcoal/70 border-woof-charcoal/5 border-t px-8 pt-8 pb-10 text-lg leading-relaxed font-medium lg:px-10">
                                            <p>
                                                "{faq.a}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
