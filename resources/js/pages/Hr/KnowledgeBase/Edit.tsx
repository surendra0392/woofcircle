import { Head } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import KBEdit from '@/components/KnowledgeBase/KBEdit';

interface Props {
    article: any;
    categories: any[];
}

export default function KnowledgeBaseEdit({ article, categories }: Props) {
    return (
        <HrLayout>
            <Head title={`Edit — ${article.title}`} />
            <KBEdit 
                article={article} 
                categories={categories} 
                baseRoute="hr.knowledge-base" 
            />
        </HrLayout>
    );
}
