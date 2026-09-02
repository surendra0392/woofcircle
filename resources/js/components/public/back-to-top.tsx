import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            if (scrollHeight > 0) {
                const progress = (scrollTop / scrollHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, progress)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // SVG Circular Progress calculation
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className={`group fixed right-6 bottom-6 sm:right-8 sm:bottom-8 z-50 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#1c1917]/90 text-white shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-[#1c1917] hover:border-woof-gold/60 hover:shadow-[0_0_25px_rgba(197,168,128,0.35)] cursor-pointer ${
                isVisible
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
            }`}
        >
            {/* SVG Circular Scroll Progress Ring */}
            <svg
                className="absolute inset-0 h-full w-full -rotate-90 p-1 pointer-events-none"
                viewBox="0 0 48 48"
            >
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    className="stroke-white/10"
                    strokeWidth="2.5"
                    fill="transparent"
                />
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    className="stroke-woof-gold transition-all duration-150 ease-out"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </svg>

            {/* Centered Animated Icon */}
            <div className="relative z-10 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-woof-champagne group-hover:text-white transition-all duration-300 group-hover:-translate-y-1 stroke-[2.25]" />
            </div>
        </button>
    );
}
