import { Head, usePage } from '@inertiajs/react';
import SupportLayout from '@/layouts/SupportLayout';
import KBIndex from '@/components/KnowledgeBase/KBIndex';

interface Props {
    articles: any[];
    filters: { category: string };
}

export default function KnowledgeBaseIndex({ articles, filters }: Props) {
    const { auth } = usePage().props as any;
    const admin = auth?.admin?.data || auth?.admin || auth?.user;
    const isMgmt = admin && ['support_team_leader', 'support_manager', 'superadmin'].includes(admin.role);

    return (
        <SupportLayout>
            <Head title="Knowledge Base" />
            <KBIndex 
                articles={articles} 
                filters={filters} 
                baseRoute="support.knowledge-base" 
                isMgmt={isMgmt} 
            />
        </SupportLayout>
    );
}
