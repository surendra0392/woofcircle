import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export default function SeoHead({
    title = 'Woof Circle',
    description = 'The ultimate platform for pet lovers, breeders, and businesses.',
    image = '/images/og-image.jpg',
    url = typeof window !== 'undefined' ? window.location.href : '',
}: SeoHeadProps) {
    const fullTitle = title === 'Woof Circle' ? title : `${title} | Woof Circle`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
}
