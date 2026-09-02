import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Check,
    Copy,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MessageCircle,
    MessageSquare,
    Send,
    Share2,
    Twitter,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
}

export default function ShareDialog({ isOpen, setIsOpen, title }: ShareDialogProps) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const channels = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${title} on WoofCircle: ${url}`)}`,
            iconColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50 group-hover:bg-emerald-100/70',
        },
        {
            name: 'X / Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${title} on @WoofCircle!`)}`,
            iconColor: 'text-zinc-900',
            bgColor: 'bg-zinc-100 group-hover:bg-zinc-200/70',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50 group-hover:bg-blue-100/70',
        },
        {
            name: 'Telegram',
            icon: Send,
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${title} on WoofCircle!`)}`,
            iconColor: 'text-sky-500',
            bgColor: 'bg-sky-50 group-hover:bg-sky-100/70',
        },
        {
            name: 'Instagram',
            icon: Instagram,
            onClick: () => {
                copyToClipboard();
                toast.success('Link copied! Ready to share on Instagram.');
            },
            iconColor: 'text-pink-600',
            bgColor: 'bg-pink-50 group-hover:bg-pink-100/70',
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            iconColor: 'text-blue-700',
            bgColor: 'bg-blue-50 group-hover:bg-blue-100/70',
        },
        {
            name: 'Reddit',
            icon: MessageSquare,
            href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50 group-hover:bg-orange-100/70',
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodeURIComponent(`Check out ${title}`)}&body=${encodeURIComponent(`I thought you might be interested in this on WoofCircle:\n\n${url}`)}`,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50 group-hover:bg-amber-100/70',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-2xl overflow-hidden">
                <DialogHeader className="space-y-2 text-left">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-woof-cream/60 text-woof-gold shadow-2xs">
                            <Share2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase block">Spread the Joy</span>
                            <DialogTitle className="text-woof-charcoal text-xl font-bold tracking-tight truncate">
                                Share This Page
                            </DialogTitle>
                        </div>
                    </div>

                    <DialogDescription className="text-woof-charcoal/70 text-xs font-normal leading-relaxed pt-1">
                        Share <span className="font-semibold text-woof-charcoal line-clamp-1">{title}</span> with fellow canine enthusiasts.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-1 w-full min-w-0">
                    {/* Social Channels 4-Column Grid */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full min-w-0">
                        {channels.map((ch, idx) => {
                            const Icon = ch.icon;
                            if (ch.onClick) {
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={ch.onClick}
                                        className="group min-w-0 w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-2.5 sm:p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-woof-gold/50 hover:bg-white hover:shadow-md cursor-pointer"
                                    >
                                        <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${ch.bgColor}`}>
                                            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${ch.iconColor}`} />
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-woof-charcoal/70 transition-colors group-hover:text-woof-charcoal truncate w-full block">
                                            {ch.name}
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <a
                                    key={idx}
                                    href={ch.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group min-w-0 w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-2.5 sm:p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-woof-gold/50 hover:bg-white hover:shadow-md cursor-pointer"
                                >
                                    <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${ch.bgColor}`}>
                                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${ch.iconColor}`} />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-semibold text-woof-charcoal/70 transition-colors group-hover:text-woof-charcoal truncate w-full block">
                                        {ch.name}
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Or Copy Link Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#e8ded1]" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="bg-white px-3 text-woof-charcoal/40">Or copy link</span>
                        </div>
                    </div>

                    {/* Modern Copy Link Bar */}
                    <div className="flex items-center gap-2 rounded-2xl border border-[#e8ded1] bg-woof-cream/30 p-1.5 pl-3.5 w-full min-w-0 transition-all focus-within:border-woof-gold focus-within:ring-2 focus-within:ring-woof-gold/20">
                        <input
                            readOnly
                            value={url}
                            className="bg-transparent text-woof-charcoal/70 font-mono text-xs truncate flex-1 min-w-0 focus:outline-hidden select-all"
                        />

                        <Button
                            type="button"
                            onClick={copyToClipboard}
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white h-9 rounded-xl px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
