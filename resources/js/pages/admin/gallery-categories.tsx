import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { CheckCircle2, Pencil, Plus, Search, Trash2, XCircle, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    galleries_count: number;
    created_at: string;
}

interface PageProps {
    categories: Category[];
}

export default function GalleryCategories({ categories }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(categories, 'gallery_categories');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { data, setData, post, put, processing, errors, reset } = useForm({ name: '', description: '', is_active: true as boolean });

    const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const openAddModal = () => {
        reset();
        setIsAddModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setData({ name: category.name, description: category.description || '', is_active: category.is_active });
        setIsEditModalOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.gallery-categories.store'), {
            onSuccess: () => { 
                toast.success('Gallery Category created successfully'); 
                setIsAddModalOpen(false);
                reset(); 
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        put(route('admin.gallery-categories.update', editingCategory.id), {
            onSuccess: () => { 
                toast.success('Gallery Category updated successfully'); 
                setIsEditModalOpen(false);
                reset(); 
            },
        });
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure? This will only work if no images are attached.')) {
            router.delete(route('admin.gallery-categories.destroy', id), {
                onSuccess: () => toast.success('Category deleted successfully.')
            });
        }
    };

    return (
        <AdminLayout title="Gallery Categories">
            <Head title="Gallery Categories - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Gallery Categories</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Organize your platform visual showcase albums into thematic groups
                            </p>
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
                            onClick={openAddModal}
                            className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> New Category
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-sm">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-woof-charcoal/40" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                    />
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
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-center">Images Count</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <ImageIcon className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No categories found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap w-10 text-center">
                                                <Checkbox checked={selectedIds.includes(category.id)} onCheckedChange={() => toggleItem(category.id)} />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-woof-charcoal">
                                                {category.name}
                                                <div className="text-[11px] font-normal text-woof-charcoal/50">{category.slug}</div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60 max-w-xs truncate">
                                                {category.description || 'No description'}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-woof-charcoal">
                                                <span className="inline-flex items-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-2.5 py-0.5 text-xs text-woof-charcoal">
                                                    {category.galleries_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        category.is_active 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                    }`}
                                                >
                                                    {category.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => openEditModal(category)}
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Category"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteCategory(category.id)}
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Category"
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
                </div>

                {/* Add Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">New Gallery Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Category Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dog Shows, Puppy Training"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief details about photos in this category..."
                                    className="h-20 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                            </div>

                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', c as boolean)} />
                                <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active</Label>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                    {processing ? 'Saving...' : 'Save Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Edit Gallery Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit_name" className="text-xs font-bold text-woof-charcoal">Category Name *</Label>
                                <Input
                                    id="edit_name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dog Shows"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit_description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                                <Textarea
                                    id="edit_description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief details about photos in this category..."
                                    className="h-20 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                            </div>

                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox id="edit_is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', c as boolean)} />
                                <Label htmlFor="edit_is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active</Label>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs">
                                    {processing ? 'Updating...' : 'Update Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
