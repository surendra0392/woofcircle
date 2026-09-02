import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppLogoProps {
    className?: string;
    variant?: 'full' | 'icon' | 'text' | 'stacked';
    imgClassName?: string;
}

export default function AppLogo({ className = '', variant = 'full', imgClassName = 'h-9 w-auto object-contain' }: AppLogoProps) {
    const { settings } = usePage<SharedData>().props;

    const logoFull = settings?.site_logo || '/images/logo.png';
    const logoStacked = settings?.site_footer_logo || '/images/logo-stacked.png';
    const logoIcon = settings?.site_favicon || '/images/logo-icon.png';
    const logoText = settings?.site_logo_text || '/images/logo-text.png';
    const siteName = settings?.site_name || 'WoofCircle';

    if (variant === 'stacked') {
        return (
            <div className={`flex items-center ${className}`}>
                <img
                    src={logoStacked}
                    alt={siteName}
                    className={`${imgClassName} transition-transform duration-500 group-hover:scale-105`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/logo.png';
                    }}
                />
            </div>
        );
    }

    if (variant === 'icon') {
        return (
            <div className={`flex items-center ${className}`}>
                <img
                    src={logoIcon}
                    alt={siteName}
                    className={`${imgClassName} transition-transform duration-500 group-hover:scale-105`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/favicon.png';
                    }}
                />
            </div>
        );
    }

    if (variant === 'text') {
        return (
            <div className={`flex items-center ${className}`}>
                <img
                    src={logoText}
                    alt={siteName}
                    className={`${imgClassName} transition-transform duration-500 group-hover:scale-105`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/logo.png';
                    }}
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center ${className}`}>
            <img
                src={logoFull}
                alt={siteName}
                className={`${imgClassName} transition-transform duration-500 group-hover:scale-105`}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/logo.png';
                }}
            />
        </div>
    );
}
