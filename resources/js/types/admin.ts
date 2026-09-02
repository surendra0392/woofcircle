import { LucideIcon } from 'lucide-react';
export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'editor' | 'viewer';
    avatar: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface AdminAuth {
    admin: AdminUser & { unread_contact_messages?: number; unread_support_tickets?: number; pending_reviews?: number };
}
export interface AdminNavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}
export interface AdminSharedData {
    name: string;
    auth: AdminAuth;
    [key: string]: unknown;
}
