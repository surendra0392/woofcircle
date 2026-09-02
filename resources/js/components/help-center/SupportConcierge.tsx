import { Link } from '@inertiajs/react';
import { FileText, MessageSquare, ShieldAlert } from 'lucide-react';
import React from 'react';

interface SupportConciergeProps {
    onOpenChat: () => void;
    onOpenTicket: () => void;
}

export const SupportConcierge: React.FC<SupportConciergeProps> = ({ onOpenChat, onOpenTicket }) => {
    return (
        <section className="relative overflow-hidden bg-white py-32">
            <div className="container-wide relative z-10 px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-32 lg:grid-cols-2">
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-woof-gold h-px w-12" />
                                <span className="text-woof-gold text-xs font-black tracking-[0.5em] uppercase">Support Concierge</span>
                            </div>
                            <h2 className="text-woof-charcoal text-5xl leading-[1] font-black tracking-[0.01em] uppercase">
                                Still Need <br />
                                <span className="text-woof-gold uppercase">Assistance?</span>
                            </h2>
                            <p className="text-woof-charcoal/70 max-w-xl text-lg leading-[2] font-medium">
                                Our white-glove support team is dedicated to maintaining the sanctuary. Reach out for technical help, safety
                                reporting, or membership inquiries.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            <div className="border-woof-charcoal/5 hover:border-woof-gold group space-y-6 border p-10 transition-colors hover:shadow-2xl">
                                <MessageSquare className="text-woof-gold size-8" />
                                <h4 className="text-xl font-black tracking-tight uppercase">Live Chat</h4>
                                <p className="text-woof-charcoal/60 text-sm font-medium">Connect with a platform specialist in under 2 minutes.</p>
                                <button
                                    onClick={onOpenChat}
                                    className="text-woof-gold hover:text-woof-charcoal cursor-pointer text-xs font-black tracking-widest uppercase transition-colors"
                                >
                                    Start Session —
                                </button>
                            </div>
                            <div className="bg-woof-charcoal group hover:border-woof-gold space-y-6 p-10 text-white transition-colors hover:border hover:shadow-2xl">
                                <FileText className="text-woof-gold size-8" />
                                <h4 className="text-xl font-black tracking-tight text-white uppercase">Priority Ticket</h4>
                                <p className="text-woof-on-dark-muted text-sm font-medium">Open a formal request for complex account issues.</p>
                                <button
                                    onClick={onOpenTicket}
                                    className="text-woof-gold cursor-pointer text-xs font-black tracking-widest uppercase transition-colors hover:text-white"
                                >
                                    Open Ticket —
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="border-woof-gold/20 absolute -inset-4 -z-10 translate-x-4 translate-y-4 border transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                        <div className="bg-woof-charcoal space-y-12 p-16 shadow-2xl">
                            <div className="bg-woof-gold flex size-20 items-center justify-center">
                                <ShieldAlert className="text-woof-charcoal size-10" />
                            </div>
                            <h3 className="text-4xl leading-[1.2] font-black tracking-[0.01em] text-white uppercase">
                                Trust & <br /> <span className='text-woof-gold'>Safety Hotline</span>
                            </h3>
                            <p className="text-woof-on-dark text-lg leading-relaxed font-medium">
                                Dedicated channel for reporting violations of our{' '}
                                <Link href="/terms-and-ethics" className="text-woof-gold hover:underline">
                                    Breeder Pledge
                                </Link>{' '}
                                or suspected fraudulent activity.
                            </p>
                            <div className="flex items-center justify-between border-t border-white/10 pt-8">
                                <span className="text-3xl font-black text-white">0800 WOOF SAFE</span>
                                <span className="text-[10px] font-black tracking-widest text-green-500 uppercase">24/7 Monitored</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
