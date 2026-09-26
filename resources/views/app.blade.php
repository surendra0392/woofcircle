<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $settings = \Cache::get('site_settings');
            if (!$settings) {
                try {
                    $settings = \App\Models\Setting::all()->pluck('value', 'key')->toArray();
                } catch (\Throwable $e) {
                    $settings = [];
                }
            }
            $faviconUrl = asset('favicon.png');
            if (!empty($settings['site_favicon'])) {
                $rawFavicon = trim($settings['site_favicon']);
                if (filter_var($rawFavicon, FILTER_VALIDATE_URL)) {
                    $faviconUrl = $rawFavicon;
                } else {
                    $path = ltrim($rawFavicon, '/');
                    if (str_starts_with($path, 'storage/')) {
                        $path = substr($path, 8);
                        $faviconUrl = asset('storage/' . $path);
                    } elseif (file_exists(public_path($path))) {
                        $faviconUrl = asset($path);
                    } else {
                        $faviconUrl = asset('storage/' . $path);
                    }
                }
            }
        @endphp

        <title data-inertia>{{ config('app.name', 'WoofCircle') }}</title>

        {{-- Global SEO Meta Fallbacks --}}
        @php
            $defaultMetaTitle = !empty($settings['seo_meta_title']) ? $settings['seo_meta_title'] : 'WoofCircle | India\'s Premier Ethical Pet Platform';
            $defaultMetaDesc = !empty($settings['seo_meta_description']) ? $settings['seo_meta_description'] : 'Connect with registered breeders, verified veterinary clinics, trainers, boarding services, and find healthy puppies and dogs for adoption on WoofCircle.';
            $defaultKeywords = !empty($settings['seo_keywords']) ? $settings['seo_keywords'] : 'dogs, puppies, dog breeders, stud services, pet adoption, veterinary clinics, dog trainers, dog boarding, India, WoofCircle';
            $defaultOgImage = asset('images/logo-icon.png');
            $currentCanonical = url()->current();
        @endphp
        <meta name="description" content="{{ $defaultMetaDesc }}">
        <meta name="keywords" content="{{ $defaultKeywords }}">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <link rel="canonical" href="{{ $currentCanonical }}">

        {{-- Open Graph / Social --}}
        <meta property="og:site_name" content="WoofCircle">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="en_IN">
        <meta property="og:url" content="{{ $currentCanonical }}">
        <meta property="og:title" content="{{ $defaultMetaTitle }}">
        <meta property="og:description" content="{{ $defaultMetaDesc }}">
        <meta property="og:image" content="{{ $defaultOgImage }}">

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@WoofCircle">
        <meta name="twitter:title" content="{{ $defaultMetaTitle }}">
        <meta name="twitter:description" content="{{ $defaultMetaDesc }}">
        <meta name="twitter:image" content="{{ $defaultOgImage }}">

        {{-- Google Search Console Verification --}}
        @if(!empty($settings['google_site_verification']))
            <meta name="google-site-verification" content="{{ trim($settings['google_site_verification']) }}">
        @endif

        {{-- Global Organization & WebSite JSON-LD Schema --}}
        <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Organization',
                    '@id' => url('/') . '/#organization',
                    'name' => 'WoofCircle',
                    'url' => url('/'),
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => $defaultOgImage,
                        'caption' => 'WoofCircle Logo'
                    ],
                    'description' => "India's premier ethical pet platform connecting pet lovers with verified breeders, stud dogs, adoptions, and veterinary care.",
                    'sameAs' => [
                        'https://www.instagram.com/woofcircle',
                        'https://www.facebook.com/woofcircle',
                        'https://twitter.com/woofcircle'
                    ]
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => url('/') . '/#website',
                    'url' => url('/'),
                    'name' => 'WoofCircle',
                    'description' => $defaultMetaDesc,
                    'publisher' => [
                        '@id' => url('/') . '/#organization'
                    ],
                    'potentialAction' => [
                        '@type' => 'SearchAction',
                        'target' => [
                            '@type' => 'EntryPoint',
                            'urlTemplate' => url('/puppies') . '?search={search_term_string}'
                        ],
                        'query-input' => 'required name=search_term_string'
                    ],
                    'inLanguage' => 'en-IN'
                ]
            ]
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
        </script>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

        <link rel="icon" type="image/png" href="{{ $faviconUrl }}">
        <link rel="shortcut icon" href="{{ $faviconUrl }}">
        <link rel="apple-touch-icon" href="{{ asset('images/logo-icon.png') }}">

        @php
            /* Signal the preload scanner to start downloading the app module now,
               ahead of the <script type="module"> tag emitted by @vite below. */
            $appModule = app(Illuminate\Foundation\Vite::class)->asset('resources/js/app.tsx');
        @endphp
        <link rel="modulepreload" href="{{ $appModule }}">

        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        {{-- OneSignal Web Push SDK --}}
        @php
            $oneSignalAppId = !empty($settings['onesignal_app_id']) 
                ? trim($settings['onesignal_app_id']) 
                : env('ONESIGNAL_APP_ID', '6d38b531-5245-432b-b902-b1171e1ce056');
        @endphp
        @if(!empty($oneSignalAppId))
            <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
            <script>
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                OneSignalDeferred.push(async function(OneSignal) {
                    await OneSignal.init({
                        appId: "{{ $oneSignalAppId }}",
                        allowLocalhostAsSecureOrigin: true,
                        notifyButton: {
                            enable: true,
                        },
                    });

                    @if(auth()->check())
                        try {
                            await OneSignal.login("{{ auth()->id() }}");
                        } catch (e) {
                            console.warn('[OneSignal] Login sync:', e);
                        }
                    @endif

                    // Automatically request push notification subscription
                    try {
                        await OneSignal.Slidedown.promptPush();
                    } catch (e) {
                        try {
                            await OneSignal.Notifications.requestPermission();
                        } catch (err) {}
                    }
                });
            </script>
        @endif

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
