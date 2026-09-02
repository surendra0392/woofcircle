import { Head } from '@inertiajs/react';
import { Dog } from 'lucide-react';

interface PortalAuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    portalName: string;
    heading: React.ReactNode;
    subheading: string;
}

/**
 * Modern, luxury Neuform auth layout for Agent, HR, and Support portals.
 * Warm parchment background (#fcfbf9), white card, rounded-3xl container,
 * Woof Charcoal (#24221c) and gold (#bb8b62) branding with #e8ded1 borders.
 */
export default function PortalAuthLayout({ children, title, description, portalName, heading, subheading }: PortalAuthLayoutProps) {
    return (
        <div className="bg-[#fcfbf9] min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <Head title={`${title} | ${portalName}`} />

            {/* Brand header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center shadow-2xs">
                    <Dog className="size-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-woof-charcoal font-bold text-sm tracking-tight">WoofCircle</span>
                    <span className="text-woof-gold text-[10px] font-bold uppercase tracking-wider">{portalName}</span>
                </div>
            </div>

            {/* Portal heading */}
            <div className="text-center mb-8 max-w-md space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-woof-charcoal tracking-tight">
                    {heading}
                </h1>
                {subheading && (
                    <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                        {subheading}
                    </p>
                )}
            </div>

            {/* Form card */}
            <div className="w-full max-w-md bg-white border border-[#e8ded1] rounded-3xl shadow-xs p-6 sm:p-10 space-y-6">
                <div className="space-y-1 pb-4 border-b border-[#e8ded1]">
                    <h2 className="text-xl font-bold text-woof-charcoal tracking-tight">{title}</h2>
                    <p className="text-xs text-woof-charcoal/60 font-normal">{description}</p>
                </div>
                {children}
            </div>

            {/* Footer */}
            <p className="mt-8 text-xs text-woof-charcoal/40 font-medium">
                &copy; {new Date().getFullYear()} WoofCircle Sanctuary &bull; {portalName}
            </p>
        </div>
    );
}
