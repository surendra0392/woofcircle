import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

const sidebarNavItems: NavItem[] = [
    { title: 'Profile', url: '/settings/profile', icon: null },
    { title: 'Password', url: '/settings/password', icon: null },
    { title: 'Membership & Billing', url: '/settings/subscription', icon: null },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    return (
        <div className="py-2">
            <Heading title="Account Settings" description="Manage your personal sanctuary credentials and profile preferences" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-10 mt-6">
                <aside className="w-full max-w-xl lg:w-48 shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item) => {
                            const isActive = currentPath === item.url;
                            return (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    prefetch
                                    className={cn(
                                        'flex items-center w-full px-4 py-2.5 text-xs font-bold rounded-2xl transition-all',
                                        isActive
                                            ? 'bg-woof-charcoal text-white shadow-xs'
                                            : 'text-woof-charcoal/70 hover:bg-[#fcfbf9] hover:text-woof-charcoal'
                                    )}
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <Separator className="my-6 lg:hidden bg-[#e8ded1]" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-10">{children}</section>
                </div>
            </div>
        </div>
    );
}
