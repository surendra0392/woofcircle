import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useBulkSelect } from '@/hooks/use-bulk-select';
import { FileText, Pencil, Plus, Trash2, CheckCircle2, XCircle, Star, Image as ImageIcon, Search, Filter, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ArticlesPage({ articles, categories, filters }: any) {
    const { selectedIds, isAllSelected, toggleAll, toggleItem, bulkDelete, isProcessing } = useBulkSelect(articles?.data || articles, 'articles');

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterCategory, setFilterCategory] = useState(filters?.category_id || 'all');
    const [filterPublished, setFilterPublished] = useState(filters?.is_published || 'all');

    const applyFilters = () => {
        router.get(
            route('admin.articles.index'),
            { search: searchTerm, category_id: filterCategory, is_published: filterPublished },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm !== (filters?.search || '')) {
                applyFilters();
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleCategoryChange = (val: string) => {
        setFilterCategory(val);
        router.get(
            route('admin.articles.index'),
            { search: searchTerm, category_id: val, is_published: filterPublished },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handlePublishedChange = (val: string) => {
        setFilterPublished(val);
        router.get(
            route('admin.articles.index'),
            { search: searchTerm, category_id: filterCategory, is_published: val },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterCategory('all');
        setFilterPublished('all');
        router.get(
            route('admin.articles.index'),
            {},
            { preserveScroll: true, replace: true }
        );
    };

    const toggleStatus = (id: number) => {
        router.patch(route('admin.articles.toggle-publish', id), {}, { 
            preserveScroll: true,
            onSuccess: () => toast.success('Publication status updated successfully.')
        });
    };

    const toggleFeatured = (id: number) => {
        router.patch(route('admin.articles.toggle-featured', id), {}, { 
            preserveScroll: true,
            onSuccess: () => toast.success('Featured status updated successfully.')
        });
    };

    const deleteArticle = (id: number) => {
        if (confirm('Are you sure you want to permanently delete this article?')) {
            router.delete(route('admin.articles.destroy', id), { 
                preserveScroll: true,
                onSuccess: () => toast.success('Article deleted permanently.')
            });
        }
    };

    return (
        <AdminLayout title="Articles">
            <Head title="Articles - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Page header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Articles Registry</h2>
                            <p className="text-xs text-woof-charcoal/60">Manage blog posts, canine guides and educational article publications</p>
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
                        <Link href={route('admin.articles.create')}>
                            <Button className="bg-woof-charcoal hover:bg-woof-forest text-white h-10 rounded-full px-5 text-xs font-bold transition-all shadow-xs">
                                <Plus className="mr-2 h-4 w-4" /> Add Article
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid gap-4 rounded-3xl border border-[#e8ded1] bg-white p-5 shadow-xs md:grid-cols-4 items-end">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-woof-charcoal flex items-center gap-1.5">
                            <Search className="h-3.5 w-3.5 text-woof-gold" /> Search Title
                        </Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-woof-charcoal/40" />
                            <Input
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] pl-10 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 focus-visible:ring-woof-gold/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-woof-charcoal flex items-center gap-1.5">
                            <Filter className="h-3.5 w-3.5 text-woof-gold" /> Category
                        </Label>
                        <select
                            value={filterCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                        >
                            <option value="all">All Categories</option>
                            {categories?.map((c: any) => (
                                <option key={c.id} value={c.id.toString()}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-woof-charcoal flex items-center gap-1.5">
                            <Filter className="h-3.5 w-3.5 text-woof-gold" /> Status
                        </Label>
                        <select
                            value={filterPublished}
                            onChange={(e) => handlePublishedChange(e.target.value)}
                            className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                        >
                            <option value="all">All Statuses</option>
                            <option value="true">Published</option>
                            <option value="false">Draft</option>
                        </select>
                    </div>

                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResetFilters}
                            className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white text-xs font-bold w-full transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                        </Button>
                    </div>
                </div>

                {/* Articles Table Grid */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10 text-center">
                                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
                                    </th>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Featured</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {articles?.data?.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors">
                                        <td className="px-6 py-4 font-medium text-woof-charcoal w-10 text-center">
                                            <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.featured_image ? (
                                                <div className="h-11 w-16 overflow-hidden rounded-2xl border border-[#e8ded1] shadow-2xs">
                                                    <img src={item.featured_image} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex h-11 w-16 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9]">
                                                    <ImageIcon className="h-4 w-4 text-woof-charcoal/30" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-woof-charcoal">{item.title}</td>
                                        <td className="px-6 py-4 text-woof-charcoal/70">{item.category?.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStatus(item.id)} 
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                                    item.is_published 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}
                                            >
                                                {item.is_published ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />} 
                                                {item.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleFeatured(item.id)} 
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                                    item.is_featured 
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                        : 'bg-[#fcfbf9] text-woof-charcoal/50 border border-[#e8ded1]'
                                                }`}
                                            >
                                                <Star className={`h-3.5 w-3.5 ${item.is_featured ? 'fill-current' : ''}`} /> 
                                                {item.is_featured ? 'Featured' : 'Standard'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link href={route('admin.articles.edit', item.id)}>
                                                    <button className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => deleteArticle(item.id)} 
                                                    className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!articles?.data || articles.data.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-xs text-woof-charcoal/50">
                                            <FileText className="mb-3 h-8 w-8 text-woof-charcoal/30 mx-auto" />
                                            <p className="font-bold uppercase tracking-wider">No articles found matching filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {articles?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={articles.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
