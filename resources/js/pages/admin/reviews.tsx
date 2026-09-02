import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { Star, Pencil, Plus, Trash2, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ReviewsPage({ reviews, users, reviewableTypes }: any) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(reviews?.data || reviews, 'reviews');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [deleteItem, setDeleteItem] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        user_id: '',
        reviewable_type: '',
        reviewable_id: '',
        rating: '',
        comment: '',
        status: ''
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.reviews.store'), {
            onSuccess: () => { 
                toast.success('Review created successfully'); 
                setIsAddOpen(false); 
                reset(); 
                clearErrors(); 
            }
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.reviews.update', editItem.id), {
            onSuccess: () => { 
                toast.success('Review updated successfully'); 
                setEditItem(null); 
                reset(); 
                clearErrors(); 
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'rejected':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            default:
                return 'bg-amber-50 text-amber-800 border-amber-200';
        }
    };

    return (
        <AdminLayout title="Reviews">
            <Head title="Reviews Moderation - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Star className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Reviews Moderation</h2>
                            <p className="text-xs text-woof-charcoal/60">Moderate client reviews, star ratings, and community feedback</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button 
                                onClick={() => bulkDelete()} 
                                disabled={isProcessing} 
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs"
                            >
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button 
                            onClick={() => { reset(); clearErrors(); setIsAddOpen(true); }} 
                            className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Review
                        </Button>
                    </div>
                </div>

                {/* Content Table */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} ref={(el: any) => { if (el) el.indeterminate = isSomeSelected; }} />
                                    </th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Comment & Feedback</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {reviews?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Star className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No reviews found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    reviews?.data?.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-woof-charcoal">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                    <span className="font-bold text-xs">{item.rating}/5</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal max-w-md">
                                                <p className="line-clamp-2">{item.comment}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                    {item.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                                                    {item.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                                    {item.status === 'pending' && <Clock className="h-3 w-3" />}
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => { setEditItem(item); setData(item); }} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Review"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteItem(item)} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {reviews?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={reviews.links} />
                        </div>
                    )}
                </div>

                {/* Add Review Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[420px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Add Review</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-2">
                            <div className="space-y-3 py-1 max-h-[60vh] overflow-y-auto px-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">User</Label>
                                    <select 
                                        id="user_id" 
                                        value={data.user_id} 
                                        onChange={e => setData('user_id', e.target.value)} 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        required
                                    >
                                        <option value="">Select a user</option>
                                        {users?.map((u: any) => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                    {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="reviewable_type" className="text-xs font-bold text-woof-charcoal">Reviewable Type</Label>
                                    <select 
                                        id="reviewable_type" 
                                        value={data.reviewable_type} 
                                        onChange={e => setData('reviewable_type', e.target.value)} 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        required
                                    >
                                        <option value="">Select type</option>
                                        {reviewableTypes?.map((rt: any) => (
                                            <option key={rt.value} value={rt.value}>{rt.label}</option>
                                        ))}
                                    </select>
                                    {errors.reviewable_type && <p className="text-xs text-rose-500">{errors.reviewable_type}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="reviewable_id" className="text-xs font-bold text-woof-charcoal">Target ID</Label>
                                    <Input 
                                        id="reviewable_id" 
                                        type="number" 
                                        value={data.reviewable_id} 
                                        onChange={e => setData('reviewable_id', e.target.value)} 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                        required 
                                    />
                                    {errors.reviewable_id && <p className="text-xs text-rose-500">{errors.reviewable_id}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="rating" className="text-xs font-bold text-woof-charcoal">Rating (1-5)</Label>
                                    <Input 
                                        id="rating" 
                                        type="number" 
                                        min="1" 
                                        max="5" 
                                        value={data.rating} 
                                        onChange={e => setData('rating', e.target.value)} 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                        required 
                                    />
                                    {errors.rating && <p className="text-xs text-rose-500">{errors.rating}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="status" className="text-xs font-bold text-woof-charcoal">Status</Label>
                                    <select 
                                        id="status" 
                                        value={data.status} 
                                        onChange={e => setData('status', e.target.value)} 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        required
                                    >
                                        <option value="">Select a status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="comment" className="text-xs font-bold text-woof-charcoal">Comment</Label>
                                    <textarea 
                                        id="comment" 
                                        value={data.comment} 
                                        onChange={e => setData('comment', e.target.value)} 
                                        className="flex min-h-[80px] w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        required
                                    />
                                    {errors.comment && <p className="text-xs text-rose-500">{errors.comment}</p>}
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                    Add Review
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Review Modal */}
                <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[420px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit Review</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4 pt-2">
                            <div className="space-y-3 py-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-rating" className="text-xs font-bold text-woof-charcoal">Rating (1-5)</Label>
                                    <Input 
                                        id="edit-rating" 
                                        type="number" 
                                        min="1" 
                                        max="5" 
                                        value={data.rating} 
                                        onChange={e => setData('rating', e.target.value)} 
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                        required 
                                    />
                                    {errors.rating && <p className="text-xs text-rose-500">{errors.rating}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-status" className="text-xs font-bold text-woof-charcoal">Status</Label>
                                    <select 
                                        id="edit-status" 
                                        value={data.status} 
                                        onChange={e => setData('status', e.target.value)} 
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        required
                                    >
                                        <option value="">Select a status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-comment" className="text-xs font-bold text-woof-charcoal">Comment</Label>
                                    <textarea 
                                        id="edit-comment" 
                                        value={data.comment} 
                                        onChange={e => setData('comment', e.target.value)} 
                                        className="flex min-h-[80px] w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                        required
                                    />
                                    {errors.comment && <p className="text-xs text-rose-500">{errors.comment}</p>}
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Review Modal */}
                <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Review</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete this review? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setDeleteItem(null)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => {
                                    destroy(route('admin.reviews.destroy', deleteItem.id), {
                                        onSuccess: () => { toast.success('Review deleted successfully'); setDeleteItem(null); }
                                    });
                                }} 
                                className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
