import { Head, usePage } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import KBIndex from '@/components/KnowledgeBase/KBIndex';

interface Props {
    articles: any[];
    filters: { category: string };
}

export default function KnowledgeBaseIndex({ articles, filters }: Props) {
    const { auth } = usePage().props as any;
    const admin = auth?.admin?.data || auth?.admin || auth?.user;
    const isMgmt = admin && ['team_leader', 'area_manager', 'district_head', 'state_head', 'superadmin'].includes(admin.role);

    return (
        <AgentLayout>
            <Head title="Knowledge Base" />
            <KBIndex 
                articles={articles} 
                filters={filters} 
                baseRoute="agent.knowledge-base" 
                isMgmt={isMgmt} 
            />
        </AgentLayout>
    );
}
