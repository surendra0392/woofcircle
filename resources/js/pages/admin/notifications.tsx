import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Bell, GraduationCap, Heart, Home, Info, Megaphone, Send, Stethoscope, Store, Trash2, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: string;
}

interface PageProps {
    notifications: {
        data: Notification[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    flash: { success?: string; error?: string };
}

export default function AdminNotifications({ notifications, flash }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(notifications?.data || notifications, 'notifications');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deleteNotification, setDeleteNotification] = useState<Notification | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        message: '',
        target: 'all' as 'all' | 'breeders' | 'vets' | 'trainers' | 'boarding' | 'welfare' | 'vendors' | 'regular',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.notifications.store'), {
            onSuccess: () => { 
                toast.success('Announcement created successfully'); 
                setIsAddOpen(false);
                reset(); 
            },
        });
    };

    const submitDelete = () => {
        if (!deleteNotification) return;
        router.delete(route('admin.notifications.destroy', deleteNotification.id), { 
            onSuccess: () => { 
                toast.success('Announcement deleted successfully'); 
                setDeleteNotification(null); 
            } 
        });
    };

    return (
        <AdminLayout title="System Announcements">
            <Head title="Admin - System Announcements" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">System Announcements</h2>
                            <p className="text-xs text-woof-charcoal/60">Broadcast announcements and global notifications to platform users</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button onClick={() => setIsAddOpen(true)} className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white transition-all shadow-xs">
                            <Send className="mr-2 h-4 w-4" /> Send Announcement
                        </Button>
                    </div>
                </div>

                {flash?.success && (
                    <div className="border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-2xl p-4 text-xs font-medium">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center"><Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} /></th>
                                    <th className="px-6 py-4">Announcement</th>
                                    <th className="px-6 py-4">Date Sent</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {notifications.data.length > 0 ? (
                                    notifications.data.map((notification) => (
                                        <tr key={notification.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(notification.id)} onCheckedChange={() => toggleItem(notification.id)} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-2 font-bold text-woof-charcoal">
                                                        <Info className="h-3.5 w-3.5 text-woof-gold" /> {notification.title}
                                                    </span>
                                                    <span className="line-clamp-1 text-xs text-woof-charcoal/70">{notification.message}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60 text-xs">
                                                {new Date(notification.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeleteNotification(notification)}
                                                    className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs ml-auto"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center gap-2">
                                                <Bell className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No system announcements found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {notifications.last_page > 1 && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={notifications.links} />
                        </div>
                    )}
                </div>

                {/* Send Announcement Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[500px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-woof-charcoal">
                                <Megaphone className="h-5 w-5 text-woof-gold" /> Send System Announcement
                            </DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                This will send an in-app notification to the selected group of users.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="target" className="text-xs font-bold text-woof-charcoal">Target Audience</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'all', label: 'All Users', icon: Megaphone },
                                        { id: 'breeders', label: 'Breeders', icon: UserCheck },
                                        { id: 'vets', label: 'Veterinarians', icon: Stethoscope },
                                        { id: 'trainers', label: 'Trainers', icon: GraduationCap },
                                        { id: 'boarding', label: 'Boarding/Daycare', icon: Home },
                                        { id: 'welfare', label: 'Welfare/Rescue', icon: Heart },
                                        { id: 'vendors', label: 'Vendors', icon: Store },
                                        { id: 'regular', label: 'Regular Users', icon: Users },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    'target',
                                                    t.id as 'all' | 'breeders' | 'vets' | 'trainers' | 'boarding' | 'welfare' | 'vendors' | 'regular',
                                                )
                                            }
                                            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                                                data.target === t.id
                                                    ? 'border-woof-charcoal bg-woof-charcoal text-white'
                                                    : 'border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white'
                                            }`}
                                        >
                                            <t.icon className={`h-3.5 w-3.5 ${data.target === t.id ? 'text-woof-gold' : 'text-woof-charcoal/60'}`} /> {t.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.target && <p className="text-xs text-rose-500">{errors.target}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Announcement Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Maintenance Scheduled"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="message" className="text-xs font-bold text-woof-charcoal">Message Content</Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Details about the announcement..."
                                    className="min-h-[100px] rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    required
                                />
                                {errors.message && <p className="text-xs text-rose-500">{errors.message}</p>}
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-6 text-xs font-bold text-white shadow-xs">
                                    {processing ? 'Sending...' : 'Send Announcement'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog open={!!deleteNotification} onOpenChange={(open) => !open && setDeleteNotification(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Delete Announcement Record</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Are you sure you want to delete this announcement record? This will NOT remove the notification from users' inboxes, only the admin record.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setDeleteNotification(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={submitDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete Record
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
