import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit3, Trash2, Calendar, Clock } from 'lucide-react';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    article: Article;
    baseRoute: string;
    isMgmt: boolean;
}

export default function KBShow({ article, baseRoute, isMgmt }: Props) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        router.delete(route(`${baseRoute}.destroy`, article.id), {
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={route(`${baseRoute}.index`)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-gold transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Knowledge Base
                </Link>
                {isMgmt && (
                    <div className="flex items-center gap-2">
                        <Link
                            href={route(`${baseRoute}.edit`, article.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-woof-charcoal hover:text-woof-gold px-3.5 py-1.5 rounded-full border border-[#e8ded1] bg-white transition-colors cursor-pointer"
                        >
                            <Edit3 className="size-3.5" /> Edit Article
                        </Link>
                        <button
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                            <Trash2 className="size-3.5" /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                <div className="p-6 sm:p-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-woof-charcoal bg-woof-gold/15 border border-woof-gold/30 px-3.5 py-1 rounded-full">
                            {article.category}
                        </span>
                        <span className="text-xs text-woof-charcoal/50 flex items-center gap-1.5">
                            <Clock className="size-3 text-woof-gold" />
                            Updated <RelativeTime date={article.updated_at} />
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-woof-charcoal tracking-tight mb-8">{article.title}</h1>

                    <div
                        className="prose prose-sm sm:prose-base max-w-none prose-headings:text-woof-charcoal prose-headings:font-bold prose-a:text-woof-gold prose-strong:text-woof-charcoal prose-code:text-woof-charcoal prose-code:bg-[#fcfbf9] prose-code:border prose-code:border-[#e8ded1] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-xs prose-pre:bg-woof-charcoal prose-pre:text-white prose-pre:rounded-2xl prose-blockquote:border-l-woof-gold prose-blockquote:text-woof-charcoal/70 prose-li:marker:text-woof-gold leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 sm:px-10 py-4 flex items-center justify-between text-xs text-woof-charcoal/50">
                    <span>Created <RelativeTime date={article.created_at} format="absolute" /></span>
                    <span>Last updated <RelativeTime date={article.updated_at} format="absolute" /></span>
                </div>
            </div>

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Article"
                description={`Are you sure you want to permanently delete "${article.title}"? This action cannot be undone.`}
                confirmText="Delete Article"
                loading={isDeleting}
                variant="danger"
            />
        </div>
    );
}
