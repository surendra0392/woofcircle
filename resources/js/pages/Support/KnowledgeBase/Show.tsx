import { Head, usePage } from '@inertiajs/react';
import SupportLayout from '@/layouts/SupportLayout';
import KBShow from '@/components/KnowledgeBase/KBShow';

interface Props {
    article: any;
}

export default function KnowledgeBaseShow({ article }: Props) {
    const { auth } = usePage().props as any;
    const admin = auth?.admin?.data || auth?.admin || auth?.user;
    const isMgmt = admin && ['support_team_leader', 'support_manager', 'superadmin'].includes(admin.role);

    return (
        <SupportLayout>
            <Head title={`${article.title} — Knowledge Base`} />
            <KBShow 
                article={article} 
                baseRoute="support.knowledge-base" 
                isMgmt={isMgmt} 
            />
        </SupportLayout>
    );
}
