import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            outDir: 'public',
            buildBase: '/',
            manifest: {
                name: 'WoofCircle',
                short_name: 'WoofCircle',
                description: 'India\'s Premium Dog Community',
                theme_color: '#061d10',
                background_color: '#fbf8f1',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'https://placehold.co/192x192/061d10/bb8b62?text=WC',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'https://placehold.co/512x512/061d10/bb8b62?text=WC',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
});