import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    maxWidth?: string;
}

export default function AuthLayout({
    children,
    title,
    description,
    maxWidth = 'max-w-lg',
}: AuthLayoutProps) {
    const { settings } = usePage<SharedData>().props;

    return (
        <PublicLayout>
            <div className="flex min-h-screen flex-col justify-center bg-[#fcfbf9] px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-28 lg:px-8">
                <div
                    className={`animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full flex-col justify-center space-y-6 rounded-3xl border border-[#e8ded1] bg-white p-7 sm:p-10 shadow-xl duration-500 ${maxWidth}`}
                >
                    {title && (
                        <div className="flex flex-col gap-1.5 text-center">
                            <h1 className="text-woof-charcoal text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-woof-charcoal/60 text-xs font-medium tracking-wide">
                                    {description}
                                </p>
                            )}
                            <div className="w-12 h-0.5 bg-woof-gold mx-auto mt-2 rounded-full" />
                        </div>
                    )}

                    <div className="w-full">{children}</div>

                    <p className="text-woof-charcoal/40 text-center text-[10px] leading-relaxed font-medium tracking-wider uppercase pt-3 border-t border-[#e8ded1]/60">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-woof-gold hover:underline transition-colors font-bold">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-woof-gold hover:underline transition-colors font-bold">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
