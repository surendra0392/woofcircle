import PublicLayout from "@/layouts/public/public-layout";
import { Head, Link } from '@inertiajs/react';

export default function Unsubscribed({ email }: { email: string }) {
    return (
        <PublicLayout>
            <Head title="Unsubscribed | Newsletter" />

            <div className="min-h-[50vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center space-y-8">
                    <div>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#bb8b62]/20">
                            <svg className="h-6 w-6 text-[#bb8b62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            You have been unsubscribed
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We're sorry to see you go. The email address <span className="font-semibold text-gray-900">{email}</span> will no longer receive our newsletter updates.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#061d10] hover:bg-[#061d10]/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bb8b62]"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
