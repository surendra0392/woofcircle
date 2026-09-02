import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { CheckCircle2, Pencil, Plus, Save, Tag, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    articles_count: number;
}

interface PageProps {
    categories: Category[];
}

export default function ArticleCategories({ categories }: PageProps) {
    const { selectedIds, isAllSelected, isSomeSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(categories, 'article_categories');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({ name: '', is_active: true as boolean });

    const openAddModal = () => {
        reset();
        setIsAddModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setData({ name: category.name, is_active: category.is_active });
        setIsEditModalOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.article-categories.store'), {
            preserveScroll: true,
            onSuccess: () => { 
                toast.success('Article Category created successfully'); 
                setIsAddModalOpen(false);
                reset(); 
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        put(route('admin.article-categories.update', editingCategory.id), {
            preserveScroll: true,
            onSuccess: () => { 
                toast.success('Article Category updated successfully'); 
                setIsEditModalOpen(false);
                reset(); 
            },
        });
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.article-categories.toggle-active', id), {}, { preserveScroll: true });
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.article-categories.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Article Categories">
            <Head title="Article Categories" />
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Article Categories</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage taxonomies for content and SEO</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button onClick={() => bulkDelete()} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 h-10 text-xs font-bold transition-all shadow-xs">
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button
                            onClick={openAddModal}
                            className="bg-woof-charcoal hover:bg-woof-forest text-white h-10 rounded-full px-5 text-xs font-bold transition-all shadow-xs"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#fcfbf9] border-b border-[#e8ded1] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center"><Checkbox checked={isAllSelected} onCheckedChange={toggleAll} /></th>
                                    <th className="px-6 py-4">Category Name</th>
                                    <th className="px-6 py-4 text-center">Associated Articles</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-[#fcfbf9] transition-colors">
                                        <td className="px-6 py-4 w-10 text-center"><Checkbox checked={selectedIds.includes(category.id)} onCheckedChange={() => toggleItem(category.id)} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold">
                                                    <Tag className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-woof-charcoal">{category.name}</div>
                                                    <div className="text-[11px] text-woof-charcoal/50">/{category.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center rounded-full bg-[#fcfbf9] border border-[#e8ded1] px-3 py-1 text-[11px] font-bold text-woof-charcoal">
                                                {category.articles_count} articles
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(category.id)}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${category.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}
                                            >
                                                {category.is_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(category.id)}
                                                    disabled={category.articles_count > 0}
                                                    className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                                                    title={category.articles_count > 0 ? 'Cannot delete category with associated articles' : 'Delete'}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <Tag className="mb-3 h-8 w-8 text-woof-charcoal/30 mx-auto" />
                                            <p className="text-xs font-bold uppercase tracking-wider">No categories found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog
                    open={isAddModalOpen || isEditModalOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsAddModalOpen(false);
                            setIsEditModalOpen(false);
                        }
                    }}
                >
                    <DialogContent className="max-w-md rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-woof-charcoal">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold shadow-2xs">
                                    <Tag className="h-4 w-4" />
                                </div>
                                {isAddModalOpen ? 'Create Category' : 'Edit Category'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">
                                    Category Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    placeholder="E.g. Training Tips, Health Advice"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Status</Label>
                                <div className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-3.5">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-bold text-woof-charcoal">Active Category</Label>
                                        <p className="text-[11px] text-woof-charcoal/60">Available for article selection</p>
                                    </div>
                                    <Checkbox checked={data.is_active} onCheckedChange={(checked) => setData('is_active', !!checked)} />
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-forest text-white rounded-full text-xs font-bold shadow-xs"
                                >
                                    <Save className="mr-2 h-4 w-4" /> Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
