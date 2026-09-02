import { Head } from '@inertiajs/react';
import SupportLayout from '@/layouts/SupportLayout';
import KBCreate from '@/components/KnowledgeBase/KBCreate';

interface Props {
    categories: any[];
}

export default function KnowledgeBaseCreate({ categories }: Props) {
    return (
        <SupportLayout>
            <Head title="New Article — Knowledge Base" />
            <KBCreate 
                categories={categories} 
                baseRoute="support.knowledge-base" 
            />
        </SupportLayout>
    );
}
