import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile' | 'product';
    noindex?: boolean;
    canonical?: string;
    schema?: Record<string, any> | Array<Record<string, any>>;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
}

export default function SeoHead({
    title = 'WoofCircle | India\'s Premier Ethical Pet Platform',
    description = 'Connect with verified dog breeders, find vaccinated puppies, champion stud services, pet adoption, and top veterinary clinics across India on WoofCircle.',
    keywords = 'dogs, puppies, dog breeders, stud services, pet adoption, veterinary clinics, dog trainers, dog boarding, India, WoofCircle',
    image = '/images/logo-icon.png',
    url = typeof window !== 'undefined' ? window.location.href : 'https://woofcircle.in',
    type = 'website',
    noindex = false,
    canonical,
    schema,
    publishedTime,
    modifiedTime,
    author,
}: SeoHeadProps) {
    const brandSuffix = 'WoofCircle';
    const fullTitle = title.includes(brandSuffix) ? title : `${title} | ${brandSuffix}`;
    const canonicalUrl = canonical || (url.split('?')[0]);
    const fullImageUrl = image.startsWith('http') ? image : `https://woofcircle.in${image.startsWith('/') ? '' : '/'}${image}`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Social */}
            <meta property="og:site_name" content="WoofCircle" />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:url" content={canonicalUrl} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@WoofCircle" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />

            {/* Article Specific Metadata */}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Head>
    );
}
