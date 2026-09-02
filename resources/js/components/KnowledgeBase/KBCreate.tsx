import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, ArrowLeft, Send } from 'lucide-react';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';

interface CategoryCount {
    category: string;
    count: number;
}

interface Props {
    categories: CategoryCount[];
    baseRoute: string;
}

const DEFAULT_CATEGORIES = ['General', 'Refund Policy', 'Support SOP', 'Escalation', 'Technical', 'Security'];

export default function KBCreate({ categories, baseRoute }: Props) {
    const dynamicCats = categories.map(c => c.category);
    const missingDefaults = DEFAULT_CATEGORIES.filter(c => !dynamicCats.includes(c));
    const allCategories = [
        ...categories,
        ...missingDefaults.map(c => ({ category: c, count: 0 }))
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: 'General',
    });

    const [newCategory, setNewCategory] = useState('');
    const [showNewCategory, setShowNewCategory] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCategory = showNewCategory && newCategory.trim() ? newCategory.trim() : data.category;
        setData('category', finalCategory);
        post(route(`${baseRoute}.store`));
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <Link
                    href={route(`${baseRoute}.index`)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-gold transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Knowledge Base
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#e8ded1]">
                    <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-woof-charcoal">Publish Documentation Article</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5">Author a standard operating procedure, onboarding policy, or compliance guide.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                            Article Title <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold font-medium"
                            placeholder="e.g., Veterinary Profile Verification Standard — SOP-104"
                            required
                        />
                        {errors.title && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                Classification Category <span className="text-rose-600">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowNewCategory(!showNewCategory)}
                                className="text-xs font-bold text-woof-gold hover:underline cursor-pointer"
                            >
                                {showNewCategory ? 'Choose existing' : '+ New category'}
                            </button>
                        </div>
                        {showNewCategory ? (
                            <input
                                type="text"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                placeholder="Enter custom category name..."
                            />
                        ) : (
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                            >
                                {allCategories.map(cat => (
                                    <option key={cat.category} value={cat.category}>
                                        {cat.category} {cat.count > 0 ? `(${cat.count})` : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                            Article Body Content <span className="text-rose-600">*</span>
                        </label>
                        <div className="rounded-2xl border border-[#e8ded1] overflow-hidden bg-[#fcfbf9]">
                            <RichTextEditor
                                value={data.content}
                                onChange={(val) => setData('content', val)}
                                theme="light"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                            <p className="text-[11px] text-woof-charcoal/50">
                                Supports structured markdown, code blocks, checklists, and formatted links.
                            </p>
                            {errors.content && <p className="text-xs text-rose-600 font-medium">{errors.content}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8ded1]">
                        <Link
                            href={route(`${baseRoute}.index`)}
                            className="px-5 py-2.5 text-xs font-bold text-woof-charcoal/70 hover:text-woof-charcoal rounded-full transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <Send className="size-3.5" />
                            {processing ? 'Publishing...' : 'Publish Article'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
