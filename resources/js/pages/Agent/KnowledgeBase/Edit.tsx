import { Head } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import KBEdit from '@/components/KnowledgeBase/KBEdit';

interface Props {
    article: any;
    categories: any[];
}

export default function KnowledgeBaseEdit({ article, categories }: Props) {
    return (
        <AgentLayout>
            <Head title={`Edit — ${article.title}`} />
            <KBEdit 
                article={article} 
                categories={categories} 
                baseRoute="agent.knowledge-base" 
            />
        </AgentLayout>
    );
}
