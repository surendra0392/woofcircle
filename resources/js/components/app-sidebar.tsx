import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bookmark, Dog, GraduationCap, Heart, Home, Layers, LayoutGrid, MessageSquare, Search, ShoppingBag, Stethoscope, Users } from 'lucide-react';
import AppLogo from './app-logo';
const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
    { title: 'My Pets', url: '/dashboard/pets', icon: Dog },
    { title: 'Saved Listings', url: '/dashboard/saved', icon: Bookmark },
    { title: 'My Reviews', url: '/dashboard/reviews', icon: MessageSquare },
    { title: 'Marketplace', url: '/puppies', icon: ShoppingBag },
    { title: 'Directory', url: '/directory', icon: Search },
    { title: 'Community', url: '/articles', icon: Users },
    { title: 'Breeder Console', url: '/dashboard/breeder', icon: LayoutGrid, roles: ['breeder'] },
    { title: 'My Litters', url: '/dashboard/breeder/litters', icon: Layers, roles: ['breeder'] },
    { title: 'Stud Services', url: '/dashboard/stud-services', icon: Dog, roles: ['breeder'] },
    { title: 'Vet Console', url: '/dashboard/vet', icon: Stethoscope, roles: ['vet'] },
    { title: 'Trainer Console', url: '/dashboard/trainer', icon: GraduationCap, roles: ['trainer'] },
    { title: 'Boarding Console', url: '/dashboard/boarding', icon: Home, roles: ['boarding'] },
    { title: 'Welfare Console', url: '/dashboard/welfare', icon: Heart, roles: ['welfare'] },
    { title: 'Boutique Console', url: '/dashboard/pet-shop', icon: ShoppingBag, roles: ['pet-shop'] },
    { title: 'My Adoptions', url: '/dashboard/adoptions', icon: Heart },
    { title: 'Support Tickets', url: '/dashboard/support', icon: MessageSquare },
];
const footerNavItems: NavItem[] = [];
export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const userRoles = user?.roles || [];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Platform" items={mainNavItems.filter((item) => ['Dashboard', 'My Pets', 'My Litters', 'Stud Services', 'My Adoptions', 'Saved Listings', 'My Reviews', 'Support Tickets'].includes(item.title))} />

                <NavMain label="Discover" items={mainNavItems.filter((item) => ['Marketplace', 'Directory', 'Community'].includes(item.title))} />

                {userRoles.some((role: string) => ['breeder', 'vet', 'trainer', 'boarding', 'welfare', 'stud-service-provider', 'pet-shop'].includes(role)) && (
                    <NavMain
                        label="Management"
                        items={mainNavItems.filter((item) => {
                            if (!item.roles) return false;
                            if (['Dashboard', 'My Pets', 'My Litters', 'Stud Services', 'My Adoptions', 'Saved Listings', 'My Reviews', 'Support Tickets', 'Marketplace', 'Directory', 'Community'].includes(item.title)) return false;
                            return item.roles.some((role: string) => userRoles.includes(role));
                        })}
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" /> <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
