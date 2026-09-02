import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}) {
    const { settings } = usePage<SharedData>().props;
    return (
        <PublicLayout>
            <div className="flex min-h-screen flex-col justify-center bg-[#fcfbf9] px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-28 lg:px-8">
                <div className="mx-auto w-full max-w-md space-y-6 rounded-3xl border border-[#e8ded1] bg-white p-7 sm:p-10 shadow-xl">
                    {title && (
                        <div className="flex flex-col gap-1.5 text-center">
                            <h1 className="text-woof-charcoal text-2xl font-extrabold tracking-tight uppercase">
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
                </div>
            </div>
        </PublicLayout>
    );
}
