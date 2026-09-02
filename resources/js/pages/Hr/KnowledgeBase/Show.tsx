import { Head, usePage } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import KBShow from '@/components/KnowledgeBase/KBShow';

interface Props {
    article: any;
}

export default function KnowledgeBaseShow({ article }: Props) {
    const { auth } = usePage().props as any;
    const admin = auth?.admin?.data || auth?.admin || auth?.user;
    const isMgmt = admin && ['hr_manager', 'hr_director', 'superadmin'].includes(admin.role);

    return (
        <HrLayout>
            <Head title={`${article.title} — Knowledge Base`} />
            <KBShow 
                article={article} 
                baseRoute="hr.knowledge-base" 
                isMgmt={isMgmt} 
            />
        </HrLayout>
    );
}
