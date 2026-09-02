import { Head } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import KBCreate from '@/components/KnowledgeBase/KBCreate';

interface Props {
    categories: any[];
}

export default function KnowledgeBaseCreate({ categories }: Props) {
    return (
        <AgentLayout>
            <Head title="New Article — Knowledge Base" />
            <KBCreate 
                categories={categories} 
                baseRoute="agent.knowledge-base" 
            />
        </AgentLayout>
    );
}
