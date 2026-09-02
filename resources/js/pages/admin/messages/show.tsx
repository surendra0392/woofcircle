import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Image as ImageIcon, ArrowLeft, ShieldAlert, Mail } from 'lucide-react';

interface Props {
    conversation: Conversation;
    messages: Message[];
}

export default function AdminMessagesShow({ conversation, messages: initialMessages }: Props) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // Admin should still see real-time incoming messages during moderation
    useEffect(() => {
        if (!conversation || typeof window === 'undefined' || !window.Echo) return;

        const channel = window.Echo.private(`chat.${conversation.id}`);
        
        channel.listen('MessageSent', (e: any) => {
            setMessages((prev) => [...prev, e.message]);
        });

        return () => {
            channel.stopListening('MessageSent');
            window.Echo?.leave(`chat.${conversation.id}`);
        };
    }, [conversation.id]);

    const title = conversation.users?.map(u => u.name).join(' & ') || 'Conversation';

    return (
        <AdminLayout title={`Moderate: ${title}`}>
            <Head title={`Moderate: ${title} - Admin`} />
            <div className="mx-auto max-w-5xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('admin.messages.index')}
                        className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">{title}</h2>
                        <p className="text-xs text-woof-charcoal/60">Private communication log and message inspection</p>
                    </div>
                </div>

                {/* Main Box */}
                <div className="flex h-[calc(100vh-230px)] min-h-[550px] w-full flex-col overflow-hidden rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] shadow-xs relative">
                    {/* Moderation Banner */}
                    <div className="bg-amber-50 p-3 text-center border-b border-amber-200 flex items-center justify-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-700" />
                        <p className="text-xs font-bold text-amber-800">
                            Read-Only Moderation Mode. Admins cannot participate in private user conversations.
                        </p>
                    </div>

                    {/* Chat Area */}
                    <div className="flex flex-1 flex-col overflow-hidden bg-white">
                        <div 
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto p-6 space-y-5"
                        >
                            {messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-woof-charcoal/40">
                                    <p className="text-xs font-bold uppercase tracking-wider">No messages in this conversation</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id;
                                    
                                    return (
                                        <div key={msg.id} className="flex gap-3.5 items-start max-w-[85%]">
                                            {showAvatar ? (
                                                <Avatar className="h-8 w-8 rounded-full border border-[#e8ded1] shrink-0 mt-0.5 shadow-2xs">
                                                    <AvatarFallback className="rounded-full bg-[#fcfbf9] text-woof-gold font-bold text-xs">
                                                        {msg.sender?.name?.substring(0, 2).toUpperCase() || '??'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="w-8 shrink-0"></div>
                                            )}
                                            
                                            <div className="flex flex-col gap-1 min-w-0 w-full">
                                                {showAvatar && (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xs font-bold text-woof-charcoal">
                                                            {msg.sender?.name || 'Unknown User'}
                                                        </span>
                                                        <span className="text-[10px] text-woof-charcoal/50">
                                                            {new Date(msg.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex flex-col gap-2 bg-[#fcfbf9] border border-[#e8ded1] p-3.5 w-fit max-w-full shadow-2xs rounded-2xl">
                                                    {msg.body && (
                                                        <p className="text-xs font-medium text-woof-charcoal leading-relaxed whitespace-pre-wrap break-words">
                                                            {msg.body}
                                                        </p>
                                                    )}
                                                    
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {msg.attachments.map((attachment) => (
                                                                <a 
                                                                    key={attachment.id}
                                                                    href={`/storage/${attachment.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 bg-white border border-[#e8ded1] p-2 rounded-xl text-xs font-bold text-woof-charcoal hover:border-woof-gold transition-colors shadow-2xs"
                                                                >
                                                                    {attachment.mime_type.startsWith('image/') ? (
                                                                        <ImageIcon className="h-4 w-4 text-sky-600" />
                                                                    ) : (
                                                                        <FileText className="h-4 w-4 text-amber-600" />
                                                                    )}
                                                                    <span className="max-w-[150px] truncate">{attachment.file_name}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
