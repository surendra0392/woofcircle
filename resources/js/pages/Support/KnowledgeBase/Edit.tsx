import { Head } from '@inertiajs/react';
import SupportLayout from '@/layouts/SupportLayout';
import KBEdit from '@/components/KnowledgeBase/KBEdit';

interface Props {
    article: any;
    categories: any[];
}

export default function KnowledgeBaseEdit({ article, categories }: Props) {
    return (
        <SupportLayout>
            <Head title={`Edit — ${article.title}`} />
            <KBEdit 
                article={article} 
                categories={categories} 
                baseRoute="support.knowledge-base" 
            />
        </SupportLayout>
    );
}
