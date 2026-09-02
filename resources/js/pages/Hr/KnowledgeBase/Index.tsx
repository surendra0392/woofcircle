import { Head, usePage } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import KBIndex from '@/components/KnowledgeBase/KBIndex';

interface Props {
    articles: any[];
    filters: { category: string };
}

export default function KnowledgeBaseIndex({ articles, filters }: Props) {
    const { auth } = usePage().props as any;
    const admin = auth?.admin?.data || auth?.admin || auth?.user;
    const isMgmt = admin && ['hr_manager', 'hr_director', 'superadmin'].includes(admin.role);

    return (
        <HrLayout>
            <Head title="Knowledge Base" />
            <KBIndex 
                articles={articles} 
                filters={filters} 
                baseRoute="hr.knowledge-base" 
                isMgmt={isMgmt} 
            />
        </HrLayout>
    );
}
