import { Head, usePage } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import KBShow from '@/components/KnowledgeBase/KBShow';

interface Props {
    article: any;
}

export default function KnowledgeBaseShow({ article }: Props) {
    const { auth } = usePage().props as any;
    const admin = auth?.admin?.data || auth?.admin || auth?.user;
    const isMgmt = admin && ['team_leader', 'area_manager', 'district_head', 'state_head', 'superadmin'].includes(admin.role);

    return (
        <AgentLayout>
            <Head title={`${article.title} — Knowledge Base`} />
            <KBShow 
                article={article} 
                baseRoute="agent.knowledge-base" 
                isMgmt={isMgmt} 
            />
        </AgentLayout>
    );
}
