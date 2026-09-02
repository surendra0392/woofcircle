import { Link } from '@inertiajs/react';
import { X, LogOut } from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    active: boolean;
    badge?: number;
    live?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
}

interface SupportSidebarProps {
    navItems: NavItem[];
    admin: { name: string; role: string } | null;
    /** Callback fired when a nav link is clicked (used on mobile to close the drawer) */
    onNavClick?: () => void;
    /** Whether to show the close (X) button in the header */
    showCloseButton?: boolean;
    /** Callback fired when the close button is clicked */
    onClose?: () => void;
    /** Additional className for the outer <aside> */
    className?: string;
}

/**
 * Shared sidebar used by both the desktop sidebar and the mobile slide-out drawer
 * in the SupportLayout. Accepts navItems, admin user data, and optional callbacks
 * for mobile interaction.
 */
export default function SupportSidebar({ navItems, admin, onNavClick, showCloseButton, onClose, className = '' }: SupportSidebarProps) {
    return (
        <aside className={`w-72 text-white flex flex-col ${className}`} style={{ backgroundColor: '#061d10' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <span className="text-xl font-bold" style={{ color: '#bb8b62' }}>Woof Circle</span>
                {showCloseButton && onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Portal label */}
            <div className="p-4 text-sm font-semibold tracking-widest uppercase text-gray-400">
                Support Portal
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={onNavClick}
                        className={`flex items-center justify-between px-4 py-2 rounded transition-colors ${
                            item.active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                        style={item.active ? { borderLeft: `4px solid #bb8b62` } : {}}
                    >
                        <span>{item.name}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-black text-white">
                                {item.badge > 99 ? '99+' : item.badge}
                            </span>
                        )}
                        {item.live !== undefined && (
                            <span
                                className={`ml-1.5 inline-block h-2 w-2 rounded-full transition-colors duration-300 ${
                                    item.live ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-gray-600'
                                }`}
                                title={item.live ? 'Live — real-time updates active' : 'Static — Pusher not configured'}
                            />
                        )}
                    </Link>
                ))}
            </nav>

            {/* User info + logout */}
            <div className="p-4 border-t border-gray-800">
                <div className="text-sm">Logged in as:</div>
                <Link href={route('support.profile.edit')} onClick={onNavClick} className="font-bold truncate hover:text-white transition-colors block" style={{ color: '#bb8b62' }}>{admin?.name}</Link>
                <div className="text-xs text-gray-400 capitalize">{admin?.role?.replace('_', ' ')}</div>
                <Link
                    href={route('support.logout')}
                    method="post"
                    as="button"
                    onClick={onNavClick}
                    className="mt-4 w-full text-left text-sm text-gray-300 hover:text-white block"
                >
                    <LogOut className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
