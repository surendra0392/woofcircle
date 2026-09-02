import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { RichTextEditorProps } from '@/components/ui/RichTextEditor';

const RichTextEditorInner = React.lazy(async () => {
    const mod = await import('@/components/ui/RichTextEditor');
    return { default: mod.RichTextEditor };
});

function EditorSkeleton() {
    return (
        <div className="flex flex-col border border-[#e8ded1] rounded-3xl overflow-hidden shadow-xs bg-white">
            {/* Toolbar Skeleton */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 border-b border-[#e8ded1] bg-[#fcfbf9]">
                {/* View mode toggle */}
                <Skeleton className="h-8.5 w-24 rounded-full bg-[#e8ded1]/50" />
                <div className="w-px h-5 bg-[#e8ded1] mx-1" />
                <Skeleton className="h-8.5 w-36 rounded-2xl bg-[#e8ded1]/50" />
                <div className="w-px h-5 bg-[#e8ded1] mx-1" />
                <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                <div className="w-px h-5 bg-[#e8ded1] mx-1" />
                <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                <div className="w-px h-5 bg-[#e8ded1] mx-1" />
                <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                <div className="ml-auto flex items-center gap-1">
                    <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                    <Skeleton className="h-8.5 w-8.5 rounded-2xl bg-[#e8ded1]/50" />
                </div>
            </div>

            {/* Editor Content Skeleton */}
            <div className="bg-white min-h-[320px] p-6">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4 rounded-xl bg-[#e8ded1]/50" />
                    <Skeleton className="h-4 w-full rounded-lg bg-[#e8ded1]/50" />
                    <Skeleton className="h-4 w-5/6 rounded-lg bg-[#e8ded1]/50" />
                    <Skeleton className="h-4 w-2/3 rounded-lg bg-[#e8ded1]/50" />
                    <Skeleton className="h-4 w-full rounded-lg bg-[#e8ded1]/50" />
                </div>
            </div>

            {/* Footer Status Bar Skeleton */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-[#e8ded1] bg-[#fcfbf9]">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-3 w-20 rounded-md bg-[#e8ded1]/50" />
                    <Skeleton className="h-3 w-24 rounded-md bg-[#e8ded1]/50" />
                </div>
                <Skeleton className="h-3 w-32 rounded-md bg-[#e8ded1]/50" />
            </div>
        </div>
    );
}

export function LazyRichTextEditor({ value, onChange, placeholder, theme }: RichTextEditorProps) {
    return (
        <Suspense fallback={<EditorSkeleton />}>
            <RichTextEditorInner value={value} onChange={onChange} placeholder={placeholder} theme={theme} />
        </Suspense>
    );
}

export { type RichTextEditorProps };
