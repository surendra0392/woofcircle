import { CheckCircle2, Clock, X } from 'lucide-react';
import React from 'react';
import { Article } from './types';

interface ArticleModalProps {
    article: Article | null;
    onClose: () => void;
    feedbackStatus: Record<string, 'helpful' | 'not-helpful' | null>;
    onFeedback: (title: string, status: 'helpful' | 'not-helpful') => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, feedbackStatus, onFeedback }) => {
    if (!article) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                    <div
                        className="bg-woof-charcoal/95 absolute inset-0 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <div
                        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-none bg-white shadow-2xl"
                    >
                        <div className="space-y-12 overflow-y-auto p-12 lg:p-20">
                            <div className="flex items-center justify-between">
                                <span className="text-woof-gold text-[10px] font-black tracking-[0.5em] uppercase">Sanctuary Article</span>
                                <button onClick={onClose} className="text-woof-charcoal/40 hover:text-woof-charcoal p-2 transition-colors">
                                    <X className="size-8" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-woof-charcoal text-5xl leading-none font-black tracking-tighter uppercase lg:text-7xl">
                                    {article.title.split(' ').slice(0, -1).join(' ')}
                                    <span className="text-woof-gold font-serif font-normal lowercase">{article.title.split(' ').slice(-1)}</span>
                                </h2>
                                <div className="bg-woof-gold h-1 w-24" />
                                <div className="prose prose-xl text-woof-charcoal/80 max-w-none leading-[1.8] font-medium" dangerouslySetInnerHTML={{ __html: article.content }} />
                            </div>

                            <div className="border-woof-charcoal/5 flex flex-wrap items-center justify-between gap-8 border-t pt-12">
                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="size-5 text-green-500" />
                                        <span className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">
                                            Verified Accuracy
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-woof-gold size-5" />
                                        <span className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">
                                            Updated 2 Days Ago
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-woof-cream border-woof-charcoal/5 flex items-center gap-6 border p-4">
                                    <span className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">
                                        {feedbackStatus[article.title] ? 'Thank you for your feedback!' : 'Was this helpful?'}
                                    </span>
                                    {!feedbackStatus[article.title] && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onFeedback(article.title, 'helpful')}
                                                className="border-woof-charcoal/5 hover:bg-woof-gold flex size-8 items-center justify-center border bg-white text-xs font-bold transition-colors"
                                            >
                                                Y
                                            </button>
                                            <button
                                                onClick={() => onFeedback(article.title, 'not-helpful')}
                                                className="border-woof-charcoal/5 hover:bg-woof-charcoal flex size-8 items-center justify-center border bg-white text-xs font-bold transition-colors hover:text-white"
                                            >
                                                N
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-woof-cream border-woof-charcoal/5 flex justify-end border-t p-8">
                            <button
                                onClick={onClose}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal px-12 py-5 text-xs font-black tracking-[0.3em] text-white uppercase transition-all"
                            >
                                Close Article —
                            </button>
                        </div>
                    </div>
        </div>
    );
};
