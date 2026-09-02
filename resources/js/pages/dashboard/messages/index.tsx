import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Conversation, Message, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip, Image as ImageIcon, FileText, X, MessageCircle, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
    conversations: any; // PaginatedData<Conversation>
    activeConversation?: Conversation;
    messages?: Message[];
    filters?: { search: string, unread: boolean };
}

export default function MessagesIndex({ conversations, activeConversation, messages, filters }: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;
    
    const [messagesState, setMessagesState] = useState<Message[]>(messages || []);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<{ url: string, name: string, type: string }[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        body: '',
        attachments: [] as File[],
    });

    useEffect(() => {
        setMessagesState(messages || []);
    }, [messages]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messagesState]);

    useEffect(() => {
        if (!activeConversation || typeof window === 'undefined' || !window.Echo) return;

        const channel = window.Echo.private(`chat.${activeConversation.id}`);
        
        channel.listen('MessageSent', (e: any) => {
            if (e.message.user_id !== currentUser.id) {
                setMessagesState((prev) => [...prev, e.message]);
                fetch(route('chat.read', activeConversation.id), {
                    method: 'PATCH',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Accept': 'application/json'
                    }
                }).catch(console.error);
            }
        });

        return () => {
            channel.stopListening('MessageSent');
            window.Echo?.leave(`chat.${activeConversation.id}`);
        };
    }, [activeConversation?.id, currentUser.id]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData('attachments', [...data.attachments, ...filesArray]);

            const newPreviews = filesArray.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name,
                type: file.type
            }));
            setPreviewUrls([...previewUrls, ...newPreviews]);
        }
    };

    const removeAttachment = (index: number) => {
        const newAttachments = [...data.attachments];
        newAttachments.splice(index, 1);
        setData('attachments', newAttachments);

        const newPreviews = [...previewUrls];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.body.trim() && data.attachments.length === 0) return;
        
        post(route('dashboard.messages.store', activeConversation!.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('body', 'attachments');
                setPreviewUrls([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: () => {
                toast.error('Failed to send message.');
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Messages', href: route('dashboard.messages.index') },
    ];

    const getOtherUser = (conv: Conversation) => {
        return conv.users?.find(u => u.id !== currentUser.id) || conv.users?.[0];
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs} title="Messages" subtitle="Communicate securely with verified breeders and buyers">
            <Head title="Messages" />

            <div className="flex h-[calc(100vh-230px)] min-h-[550px] w-full gap-0 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                {/* Conversations List Sidebar */}
                <div className="w-1/3 min-w-[300px] max-w-[360px] border-r border-[#e8ded1] bg-[#fcfbf9] flex flex-col shrink-0">
                    <div className="p-4 border-b border-[#e8ded1] bg-white flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-woof-charcoal flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-woof-gold" />
                            Conversations
                        </h3>
                        <span className="text-xs text-woof-charcoal/50 font-medium">
                            {conversations?.data?.length || 0} active
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        {conversations?.data?.length === 0 ? (
                            <div className="p-8 text-center text-woof-charcoal/40 flex flex-col items-center h-full justify-center">
                                <MessageCircle className="h-10 w-10 mb-2 text-woof-gold/30" />
                                <p className="text-xs font-bold text-woof-charcoal">No conversations found</p>
                                <p className="text-[10px] text-woof-charcoal/40 mt-1">Inquiries from ads and breeders will appear here</p>
                            </div>
                        ) : (
                            conversations?.data?.map((conv: any) => {
                                const otherUser = getOtherUser(conv);
                                const latestMessage = conv.messages?.[0];
                                const isActive = activeConversation?.id === conv.id;
                                
                                return (
                                    <Link
                                        key={conv.id}
                                        href={route('dashboard.messages.show', conv.id)}
                                        preserveScroll
                                        preserveState
                                        className={`flex items-center gap-3 p-4 border-b border-[#e8ded1] transition-all ${
                                            isActive 
                                                ? 'bg-white border-l-4 border-l-woof-gold shadow-2xs' 
                                                : 'hover:bg-white/60 bg-transparent border-l-4 border-l-transparent'
                                        }`}
                                    >
                                        <Avatar className="h-10 w-10 rounded-full border border-[#e8ded1] shrink-0">
                                            <AvatarFallback className="rounded-full bg-[#f4ebe1] text-woof-charcoal text-xs font-bold">
                                                {otherUser?.name?.substring(0, 2).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className="text-xs font-bold truncate text-woof-charcoal">
                                                    {otherUser?.name || 'Unknown User'}
                                                </h4>
                                                {conv.unread_count > 0 && !isActive ? (
                                                    <span className="bg-woof-gold text-white rounded-full h-4 min-w-4 flex items-center justify-center text-[9px] font-bold px-1 ml-2 shrink-0">
                                                        {conv.unread_count}
                                                    </span>
                                                ) : null}
                                                {latestMessage && (
                                                    <span className="text-[10px] text-woof-charcoal/40 font-medium shrink-0 ml-2">
                                                        {new Date(latestMessage.created_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-woof-charcoal/60 truncate font-normal">
                                                {latestMessage?.body || (latestMessage?.attachments?.length ? 'Sent an attachment' : 'No messages yet')}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                    {/* Pagination for Sidebar */}
                    {conversations?.links && conversations.links.length > 3 && (
                        <div className="p-3 border-t border-[#e8ded1] bg-white flex justify-center gap-1">
                            {conversations.links.map((link: any, i: number) => {
                                return link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        className={`flex items-center justify-center h-7 min-w-7 px-2 text-xs font-bold rounded-full border transition-all ${
                                            link.active 
                                                ? 'bg-woof-charcoal text-white border-woof-charcoal' 
                                                : 'bg-white text-woof-charcoal border-[#e8ded1] hover:bg-[#fcfbf9]'
                                        }`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Link>
                                ) : null;
                            })}
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white min-w-0">
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-[#e8ded1] flex items-center justify-between bg-white z-10 sticky top-0">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-full border border-[#e8ded1]">
                                        <AvatarFallback className="rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs">
                                            {getOtherUser(activeConversation)?.name?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <h2 className="text-sm font-bold text-woof-charcoal truncate">
                                            {getOtherUser(activeConversation)?.name}
                                        </h2>
                                        <p className="text-xs text-woof-charcoal/50 truncate">
                                            {getOtherUser(activeConversation)?.email}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    title="Delete Conversation"
                                    className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-full h-8 w-8 shrink-0 ml-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Messages Stream */}
                            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fcfbf9]">
                                {messagesState.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-woof-charcoal/30">
                                        <MessageCircle className="h-12 w-12 mb-3 text-woof-gold/30" />
                                        <p className="text-xs font-bold text-woof-charcoal">Start the conversation</p>
                                        <p className="text-xs text-woof-charcoal/50 mt-0.5">Send a message to begin chatting securely</p>
                                    </div>
                                ) : (
                                    messagesState.map((msg) => {
                                        const isMine = msg.user_id === currentUser.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] sm:max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    <div className={`px-4 sm:px-5 py-3 text-xs relative break-words w-full ${
                                                        isMine 
                                                        ? 'bg-woof-charcoal text-white rounded-2xl rounded-tr-xs shadow-xs' 
                                                        : 'bg-white border border-[#e8ded1] text-woof-charcoal rounded-2xl rounded-tl-xs shadow-2xs'
                                                    }`}>
                                                        {msg.body && <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.body}</p>}
                                                        
                                                        {/* Attachments */}
                                                        {msg.attachments && msg.attachments.length > 0 && (
                                                            <div className={`mt-3 flex flex-wrap gap-2 ${msg.body ? 'pt-2.5 border-t border-white/10' : ''}`}>
                                                                {msg.attachments.map((att) => {
                                                                    const isImage = att.mime_type.startsWith('image/');
                                                                    return (
                                                                        <a 
                                                                            key={att.id} 
                                                                            href={`/storage/${att.file_path}`} 
                                                                            target="_blank" 
                                                                            rel="noreferrer"
                                                                            className={`block overflow-hidden rounded-xl border transition-transform hover:scale-105 ${
                                                                                isMine ? 'border-white/20' : 'border-[#e8ded1]'
                                                                            }`}
                                                                        >
                                                                            {isImage ? (
                                                                                <img src={`/storage/${att.file_path}`} alt={att.file_name} className="h-20 w-20 sm:h-24 sm:w-24 object-cover" />
                                                                            ) : (
                                                                                <div className={`flex h-20 w-20 sm:h-24 sm:w-24 flex-col items-center justify-center p-2 text-center ${
                                                                                    isMine ? 'bg-white/10 text-white' : 'bg-[#fcfbf9] text-woof-charcoal'
                                                                                }`}>
                                                                                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-woof-gold" />
                                                                                    <span className="text-[9px] font-bold line-clamp-2 break-all">{att.file_name}</span>
                                                                                </div>
                                                                            )}
                                                                        </a>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-medium text-woof-charcoal/40 mt-1 ${isMine ? 'mr-1' : 'ml-1'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Message Input Area */}
                            <div className="p-3 sm:p-4 bg-white border-t border-[#e8ded1]">
                                {/* Attachment Previews */}
                                {previewUrls.length > 0 && (
                                    <div className="flex gap-2 pb-3 mb-3 border-b border-[#e8ded1] overflow-x-auto px-1">
                                        {previewUrls.map((preview, idx) => (
                                            <div key={idx} className="relative group shrink-0">
                                                {preview.type.startsWith('image/') ? (
                                                    <img src={preview.url} alt="preview" className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-xl border border-[#e8ded1]" />
                                                ) : (
                                                    <div className="h-14 w-14 sm:h-16 sm:w-16 flex flex-col items-center justify-center bg-[#fcfbf9] rounded-xl border border-[#e8ded1] text-woof-charcoal/60">
                                                        <FileText className="h-4 w-4 text-woof-gold" />
                                                        <span className="text-[8px] font-bold mt-1 truncate w-full px-1 text-center">{preview.name}</span>
                                                    </div>
                                                )}
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeAttachment(idx)}
                                                    title="Remove Attachment"
                                                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileSelect} 
                                        multiple 
                                        className="hidden" 
                                        accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon" 
                                        onClick={() => fileInputRef.current?.click()}
                                        title="Attach Files"
                                        className="h-11 w-11 rounded-full border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-woof-charcoal shrink-0 transition-colors"
                                    >
                                        <Paperclip className="h-4 w-4 text-woof-charcoal/60" />
                                    </Button>
                                    <div className="flex-1 relative min-w-0">
                                        <Input 
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Write your message..."
                                            className="h-11 rounded-full border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold px-4 text-xs font-medium text-woof-charcoal"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || (!data.body.trim() && data.attachments.length === 0)}
                                        className="h-11 px-5 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold text-xs transition-all shadow-xs shrink-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <Send className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Send</span>
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-woof-charcoal/40 bg-[#fcfbf9]">
                            <div className="w-16 h-16 rounded-3xl bg-white border border-[#e8ded1] flex items-center justify-center mb-3 text-woof-gold">
                                <MessageCircle className="h-8 w-8 text-woof-gold/40" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Select a conversation</h3>
                            <p className="text-xs text-woof-charcoal/50 mt-0.5">Choose a conversation from the sidebar to chat</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white border-[#e8ded1] rounded-3xl p-8 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-woof-charcoal">Delete Conversation</DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/60 mt-1">
                            Are you sure you want to delete this conversation? This action cannot be undone and message history will be removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 gap-2 sm:gap-2">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal">
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => {
                                if (activeConversation) {
                                    setIsDeleteDialogOpen(false);
                                    setTimeout(() => {
                                        router.delete(route('dashboard.messages.destroy', activeConversation.id), {
                                            onSuccess: () => toast.success('Conversation deleted successfully.'),
                                            onError: () => toast.error('Failed to delete conversation.'),
                                        });
                                    }, 100);
                                }
                            }}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 shadow-xs"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
