import { Head } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import KBCreate from '@/components/KnowledgeBase/KBCreate';

interface Props {
    categories: any[];
}

export default function KnowledgeBaseCreate({ categories }: Props) {
    return (
        <HrLayout>
            <Head title="New Article — Knowledge Base" />
            <KBCreate 
                categories={categories} 
                baseRoute="hr.knowledge-base" 
            />
        </HrLayout>
    );
}
