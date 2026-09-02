import { Bot, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './types';

interface ChatConciergeProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (e: React.FormEvent) => void;
    input: string;
    setInput: (value: string) => void;
}

export const ChatConcierge: React.FC<ChatConciergeProps> = ({ isOpen, onClose, messages, onSendMessage, input, setInput }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="bg-woof-charcoal border-woof-gold/20 fixed right-12 bottom-12 z-[110] flex w-[400px] flex-col overflow-hidden rounded-none border shadow-2xl"
                >
                    <div className="bg-woof-gold flex items-center justify-between p-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-woof-charcoal flex size-10 items-center justify-center">
                                <Bot className="text-woof-gold size-6" />
                            </div>
                            <div>
                                <h4 className="text-woof-charcoal text-xs font-black tracking-widest uppercase">Concierge Bot</h4>
                                <p className="text-woof-charcoal/60 text-[9px] font-bold tracking-widest uppercase">Active — 2m Wait</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-woof-charcoal/40 hover:text-woof-charcoal transition-colors">
                            <X className="size-6" />
                        </button>
                    </div>
                    <div className="bg-woof-charcoal/50 h-[400px] flex-1 space-y-4 overflow-y-auto p-6 backdrop-blur-md">
                        {messages.length === 0 && (
                            <div className="space-y-4 py-12 text-center">
                                <Sparkles className="text-woof-gold/20 mx-auto size-8" />
                                <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Encryption Secured — End-to-End</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 text-xs leading-relaxed font-medium ${msg.sender === 'user' ? 'bg-woof-gold text-woof-charcoal' : 'border border-white/10 bg-white/5 text-white'}`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="bg-woof-charcoal border-t border-white/10 p-4">
                        <form className="flex gap-2" onSubmit={onSendMessage}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="focus:border-woof-gold flex-1 rounded-none border border-white/10 bg-white/5 px-4 py-3 text-xs text-white focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-woof-gold text-woof-charcoal flex items-center justify-center px-4 transition-colors hover:bg-white"
                            >
                                <Send className="size-4" />
                            </button>
                        </form>
                    </div>
        </div>
    );
};
