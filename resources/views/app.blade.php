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
