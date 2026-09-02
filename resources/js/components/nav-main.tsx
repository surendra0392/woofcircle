import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-woof-charcoal/40 text-[10px] font-black tracking-[0.3em] uppercase">{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.url === page.url} className="h-10 rounded-none px-3">
                            <Link href={item.url} prefetch className="flex items-center gap-3">
                                {item.icon && <item.icon className={cn('size-4 shrink-0', item.url === page.url && 'text-woof-gold')} />}
                                <span className={cn('text-[10px] font-black tracking-[0.2em] uppercase', item.url === page.url && 'text-woof-gold')}>
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
