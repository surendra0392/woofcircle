import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { initAdminTheme } from '@/bootstrap';
import { Dog } from 'lucide-react';
import { useEffect } from 'react';

interface AdminAuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    heading?: React.ReactNode;
    subheading?: React.ReactNode;
    brandName?: string;
}

export default function AdminAuthLayout({ children, title, description, heading, subheading, brandName }: AdminAuthLayoutProps) {
    const { settings } = usePage<SharedData>().props;

    useEffect(initAdminTheme, []);

    const defaultHeading = (
        <>
            Woof Circle Admin <br /> System Authority
        </>
    );
    const defaultSubheading = "Restricted authority environment. Enter authenticated credentials to access platform controls, telemetry, and directory registries.";
    const displayBrandName = brandName || "Woof Circle Console";

    return (
        <div className="bg-[#fcfbf9] relative flex min-h-screen items-center justify-center overflow-hidden font-sans antialiased text-woof-charcoal">
            <Head title={`${title} | Admin`} />
            
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-woof-gold/10 via-transparent to-transparent" />
            
            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* LEFT: Branding & Context */}
                    <div className="hidden min-h-[500px] flex-col justify-between py-12 lg:flex">
                        <div className="space-y-10">
                            <div className="animate-fade-in-left flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-white border border-[#e8ded1] text-woof-gold flex items-center justify-center shadow-2xs">
                                    {settings.site_logo_url ? (
                                        <img src={settings.site_logo_url} alt={settings.site_name} className="h-6 w-auto object-contain" />
                                    ) : (
                                        <Dog className="size-5" />
                                    )}
                                </div>
                                <div className="bg-[#e8ded1] h-px w-10" />
                                <span className="text-woof-gold text-xs font-bold uppercase tracking-widest">{displayBrandName}</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-woof-charcoal leading-tight">
                                    {heading || defaultHeading}
                                </h1>
                                <p className="text-xs text-woof-charcoal/70 tracking-wide max-w-md leading-relaxed font-normal">
                                    {subheading || defaultSubheading}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-[#e8ded1] pt-8">
                            <p className="text-xs text-woof-charcoal/40 font-medium">
                                &copy; {new Date().getFullYear()} {settings.site_name || 'WoofCircle'} Sanctuary &bull; Console Environment
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Form Container */}
                    <div className="animate-fade-in-up mx-auto w-full max-w-md">
                        <div className="relative border border-[#e8ded1] bg-white p-6 sm:p-10 rounded-3xl shadow-xs space-y-6">
                            {/* Mobile Logo */}
                            <div className="flex items-center gap-3 lg:hidden border-b border-[#e8ded1] pb-6">
                                <div className="w-9 h-9 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center shadow-2xs">
                                    <Dog className="size-5" />
                                </div>
                                <span className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">Woof Circle Console</span>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-woof-charcoal tracking-tight"> {title} </h2>
                                {description && (
                                    <p className="text-xs text-woof-charcoal/60 font-normal"> {description} </p>
                                )}
                            </div>

                            <div className="h-px w-full bg-[#e8ded1]" /> 
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
