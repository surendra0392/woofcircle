import {
    Article,
    ArticleModal,
    ChatConcierge,
    ChatMessage,
    DiagnosticsHub,
    DiagnosticsRole,
    FaqSection,
    Glossary,
    HelpHero,
    InfrastructureDetail,
    KnowledgeBase,
    PlatformPulse,
    ProtocolType,
    ResourceCenter,
    SanctuaryProtocols,
    SuccessPathways,
    SupportConcierge,
    TicketModal,
} from '@/components/help-center';
import { articleContents, categories, faqs, glossary, onboardingChecklist, platformStatus, resources, trendingTopics } from '@/data/help-center-data';
import PublicLayout from '@/layouts/public/public-layout';
import { SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function HelpCenter() {
    const { auth } = usePage<SharedData>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [activeProtocol, setActiveProtocol] = useState<ProtocolType>('settlement');

    // Smart Diagnostics State
    const [diagRole, setDiagRole] = useState<DiagnosticsRole | null>('buyer');
    const [diagIssue, setDiagIssue] = useState<string | null>(null);
    const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});

    // Success Pathways State
    const [activePathway, setActivePathway] = useState<DiagnosticsRole>('buyer');
    const [showTransparency, setShowTransparency] = useState(true);

    // Ticket Form
    const { data, setData, post, processing, reset, recentlySuccessful } = useForm({
        subject: '',
        category: 'Technical Support',
        priority: 'low',
        message: '',
        attachment: null as File | null,
    });

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('kb-search')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const chatEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [chatMessages]);

    // Search Logic
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(query.length > 0);
    };

    const checkmarkedOnboardingChecklist = onboardingChecklist.map((item) => ({
        ...item,
        completed: item.task === 'Complete Identity Verification' ? !!auth.user : false,
    }));

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMsgs: ChatMessage[] = [
            ...chatMessages,
            {
                sender: 'user',
                text: chatInput,
            },
        ];
        setChatMessages(newMsgs);
        setChatInput('');

        setTimeout(() => {
            const lowerInput = chatInput.toLowerCase();
            let botResponse =
                'I have logged your inquiry within our sanctuary telemetry archives. A senior platform concierge has been notified to ensure your journey maintains its intended excellence. Is there any other technical or ethical protocol I can clarify for you?';

            if (lowerInput.includes('settlement') || lowerInput.includes('payment') || lowerInput.includes('vsp')) {
                botResponse =
                    "The Verified Settlement Protocol (VSP) is active. Your transactions are managed via milestone-triggered direct transfers, ensuring transparency and compliance. You can monitor your 'Settlement Pulse' in the Financials dashboard.";
            } else if (lowerInput.includes('audit') || lowerInput.includes('champion')) {
                botResponse =
                    'Our 7-Step Integrity Protocol defines the Champion tier. This includes DNA-verified genetic integrity and mandatory video walkthroughs of facilities. Would you like me to retrieve the latest audit trail for a specific member of the sanctuary?';
            } else if (lowerInput.includes('shipping') || lowerInput.includes('transport') || lowerInput.includes('checkpoint')) {
                botResponse =
                    'Checkpoint Logistics utilize human-verified transit nodes with mandatory vet check-ins. Every journey is logged via Live Node Reporting for absolute transparency. Do you require the latest status report for an active transit?';
            } else if (lowerInput.includes('visit') || lowerInput.includes('kennel')) {
                botResponse =
                    "To maintain absolute biosecurity for our litters, we mandate a 'Video-First' policy. High-definition digital walkthroughs must be successfully executed before any physical site verification is authorized by the board.";
            } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
                botResponse =
                    'I am your primary digital concierge. For complex inquiries, I can escalate your session to a human specialist or initiate a Priority Ticket. Please specify if your request concerns technical, financial, or ethical protocols.';
            }

            setChatMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: botResponse,
                },
            ]);
        }, 1200);
    };

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('help-center.tickets.store'), {
            onSuccess: () => {
                setTimeout(() => reset(), 3000);
            },
            preserveScroll: true,
        });
    };

    const filteredCategories = categories
        .map((cat) => ({
            ...cat,
            articles: cat.articles.filter((art) => {
                const query = searchQuery.toLowerCase();
                const titleMatch = art.toLowerCase().includes(query);
                const contentMatch = (articleContents[art] || '').toLowerCase().includes(query);
                const categoryMatch = cat.title.toLowerCase().includes(query);
                return titleMatch || contentMatch || categoryMatch;
            }),
        }))
        .filter((cat) => cat.articles.length > 0 || cat.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleFeedback = (title: string, status: 'helpful' | 'not-helpful') => {
        setFeedbackStatus((prev) => ({
            ...prev,
            [title]: status,
        }));
    };

    return (
        <PublicLayout>
            <Head title="Help Center | WoofCircle" />

            <HelpHero
                searchQuery={searchQuery}
                onSearch={handleSearch}
                isSearching={isSearching}
                filteredArticles={filteredCategories
                    .flatMap((c) => c.articles)
                    .map((art) => ({
                        title: art,
                        content: articleContents[art] || '',
                    }))}
                onSelectArticle={(art) => setSelectedArticle(art)}
                platformStatus={platformStatus}
            />

            <PlatformPulse platformStatus={platformStatus} />

            <DiagnosticsHub
                diagRole={diagRole}
                diagIssue={diagIssue}
                setDiagRole={setDiagRole}
                setDiagIssue={setDiagIssue}
                setIsChatOpen={setIsChatOpen}
            />

            <SanctuaryProtocols activeProtocol={activeProtocol} setActiveProtocol={setActiveProtocol} />

            <InfrastructureDetail />

            <SuccessPathways
                activePathway={activePathway}
                setActivePathway={setActivePathway}
                onboardingChecklist={checkmarkedOnboardingChecklist}
                showTransparency={showTransparency}
                setShowTransparency={setShowTransparency}
            />

            <ResourceCenter resources={resources} trendingTopics={trendingTopics} onSearch={handleSearch} />

            <SupportConcierge
                onOpenChat={() => setIsChatOpen(true)}
                onOpenTicket={() => {
                    if (!auth.user) {
                        window.location.href = route('login');
                        return;
                    }
                    setIsTicketModalOpen(true);
                }}
            />

            <KnowledgeBase
                isSearching={isSearching}
                searchQuery={searchQuery}
                onSearch={handleSearch}
                filteredCategories={filteredCategories}
                onSelectArticle={(art) => setSelectedArticle(art)}
                articleContents={articleContents}
            />

            <Glossary glossary={glossary} />

            <FaqSection faqs={faqs} />

            <ChatConcierge
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                input={chatInput}
                setInput={setChatInput}
            />

            <ArticleModal
                article={selectedArticle}
                onClose={() => setSelectedArticle(null)}
                feedbackStatus={feedbackStatus}
                onFeedback={handleFeedback}
            />

            <TicketModal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                recentlySuccessful={recentlySuccessful}
                processing={processing}
                data={data}
                setData={setData}
                onSubmit={handleTicketSubmit}
                reset={reset}
            />
        </PublicLayout>
    );
}
