import { HTMLAttributes } from 'react';

interface AppLogoIconProps extends HTMLAttributes<HTMLImageElement> {
    className?: string;
}

export default function AppLogoIcon({ className = 'h-6 w-6', ...props }: AppLogoIconProps) {
    return (
        <img
            src="/images/logo-icon.png"
            alt="WoofCircle Icon"
            className={`${className} object-contain`}
            onError={(e) => {
                (e.target as HTMLImageElement).src = '/favicon.png';
            }}
            {...props}
        />
    );
}
