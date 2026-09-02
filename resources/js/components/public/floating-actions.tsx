import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { X, Smartphone } from 'lucide-react';

export default function FloatingActions() {
    const { auth } = usePage<SharedData>().props;
    const [showAppModal, setShowAppModal] = useState(false);

    // Determine target link for Free Listing based on auth status
    const freeListingLink = auth.user ? route('breeder.litters.create') : route('register');

    return (
        <>
            {/* Floating Action Buttons container - Hidden on mobile, fixed to right edge, vertically centered */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] hidden md:flex flex-col items-end gap-2.5 font-sans">
                {/* Advertise Button (Woof Gold Gradient) */}
                <Link
                    href={route('contact')}
                    className="group relative flex items-center justify-center bg-gradient-to-b from-woof-gold to-woof-champagne border border-r-0 border-woof-charcoal/10 rounded-l-2xl shadow-md hover:-translate-x-1.5 transition-all duration-300 ease-out cursor-pointer select-none"
                    style={{ minHeight: '110px', width: '36px' }}
                >
                    <span 
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
                        className="text-[10px] font-bold tracking-widest uppercase text-woof-charcoal whitespace-nowrap py-2"
                    >
                        Advertise
                    </span>
                </Link>

                {/* Free Listing Button (Woof Charcoal / Dark theme) */}
                <Link
                    href={freeListingLink}
                    className="group relative flex items-center justify-center bg-woof-charcoal border border-r-0 border-white/10 rounded-l-2xl shadow-md hover:-translate-x-1.5 transition-all duration-300 ease-out cursor-pointer select-none"
                    style={{ minHeight: '120px', width: '36px' }}
                >
                    <span 
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
                        className="text-[10px] font-bold tracking-widest uppercase text-white whitespace-nowrap py-2"
                    >
                        Free Listing
                    </span>
                </Link>

                {/* Download App Button (White/Cream with Phone Mockup) */}
                <button
                    onClick={() => setShowAppModal(true)}
                    className="group flex items-center gap-2.5 bg-white border border-r-0 border-[#e8ded1] rounded-l-2xl pl-3.5 pr-2 py-1.5 shadow-md hover:-translate-x-1.5 transition-all duration-300 ease-out cursor-pointer"
                >
                    <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal select-none">
                        App
                    </span>
                    <div className="w-[1px] h-6 bg-[#e8ded1]" />
                    
                    {/* Smartphone Mockup Icon */}
                    <div className="relative w-6 h-9 border border-woof-charcoal rounded-md bg-white flex flex-col justify-between p-0.5 shadow-2xs transition-transform duration-300 group-hover:scale-105">
                        <div className="w-2.5 h-0.5 bg-woof-charcoal mx-auto rounded-full mt-0.5" />
                        
                        <div className="flex-1 flex items-center justify-center font-sans font-bold text-[8px] leading-none">
                            <span className="text-woof-charcoal">W</span>
                            <span className="text-woof-gold">c</span>
                        </div>
                        
                        <div className="w-2 h-0.5 bg-woof-charcoal/30 mx-auto rounded-full mb-0.5" />
                    </div>
                </button>
            </div>

            {/* App Coming Soon Modal */}
            {showAppModal && (
                <div className="fixed inset-0 bg-woof-charcoal/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    {/* Modal click-outside background closer */}
                    <div className="absolute inset-0" onClick={() => setShowAppModal(false)} />
                    
                    {/* Modal Content */}
                    <div className="bg-white border border-[#e8ded1] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-300 z-10">
                        {/* Close button */}
                        <button
                            onClick={() => setShowAppModal(false)}
                            className="absolute top-4 right-4 text-woof-charcoal/40 hover:text-woof-charcoal transition-colors p-1.5 rounded-full hover:bg-woof-cream/60"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="text-center space-y-5">
                            {/* Smartphone Icon Illustration */}
                            <div className="mx-auto w-14 h-20 border-2 border-woof-charcoal rounded-2xl bg-[#fcfbf9] flex flex-col justify-between p-1 shadow-sm">
                                <div className="w-6 h-0.5 bg-woof-charcoal mx-auto rounded-full mt-0.5" />
                                <div className="flex-1 flex items-center justify-center font-sans text-xl font-black">
                                    <span className="text-woof-charcoal">W</span>
                                    <span className="text-woof-gold">c</span>
                                </div>
                                <div className="w-5 h-0.5 bg-woof-charcoal/30 mx-auto rounded-full mb-0.5" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-bold tracking-tight text-woof-charcoal">
                                    Mobile App Coming Soon
                                </h3>
                                <p className="text-[10px] font-bold tracking-wider uppercase text-woof-gold">
                                    iOS & Android
                                </p>
                            </div>

                            <p className="font-sans text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                                Our mobile application is currently in development. Get ready for the ultimate sanctuary for pet parents, launching soon.
                            </p>

                            <button
                                onClick={() => setShowAppModal(false)}
                                className="w-full bg-woof-charcoal hover:bg-woof-gold text-white font-sans text-xs font-bold tracking-wider uppercase py-3 rounded-full transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
