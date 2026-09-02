import FlashNotifications from '@/components/flash-notifications';
import BackToTop from '@/components/public/back-to-top';
import FloatingActions from '@/components/public/floating-actions';
import Footer from '@/components/public/footer';
import Navbar from '@/components/public/navbar';
import { Toaster } from '@/components/ui/sonner';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
export default function PublicLayout({ children }: PropsWithChildren) {
    const { settings } = usePage<SharedData>().props;
    return (
        <div className="bg-woof-cream flex min-h-screen flex-col">
            <Head>
                <title>{settings.site_name}</title>
                <meta name="description" content={settings.seo_meta_description} />
                <meta name="keywords" content={settings.seo_keywords} />
                <link rel="icon" type="image/png" href={settings.site_favicon} />
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={settings.seo_meta_title || settings.site_name} />
                <meta property="og:description" content={settings.seo_meta_description} />
                {settings.site_logo && <meta property="og:image" content={settings.site_logo} />}
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={settings.seo_meta_title || settings.site_name} />
                <meta name="twitter:description" content={settings.seo_meta_description} />
                {settings.site_logo && <meta name="twitter:image" content={settings.site_logo} />}
            </Head>
            <Navbar />
            <main className="w-full flex-1"> {children} </main> {/* Footer */}
            <Footer /> <BackToTop /> <FloatingActions /> <Toaster />
            <FlashNotifications />
        </div>
    );
}
