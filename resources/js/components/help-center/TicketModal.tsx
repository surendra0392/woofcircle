import { CheckCircle2, ShieldAlert, X } from 'lucide-react';
import React from 'react';
import { TicketData } from './types';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    recentlySuccessful: boolean;
    processing: boolean;
    data: TicketData;
    setData: (key: keyof TicketData, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    reset: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, recentlySuccessful, processing, data, setData, onSubmit, reset }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                    <div
                        className="bg-woof-charcoal/95 absolute inset-0 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <div
                        className="relative w-full max-w-2xl overflow-hidden rounded-none bg-white shadow-2xl"
                    >
                        {recentlySuccessful ? (
                            <div className="space-y-8 p-20 text-center">
                                <div className="bg-woof-gold mx-auto flex size-24 items-center justify-center">
                                    <CheckCircle2 className="text-woof-charcoal size-12" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-woof-charcoal text-4xl leading-none font-black tracking-tight uppercase">
                                        Transmission <br />
                                        <span className="text-woof-gold font-serif font-normal lowercase">Complete.</span>
                                    </h3>
                                    <p className="text-woof-charcoal/60 mx-auto max-w-md text-sm font-medium">
                                        Your priority ticket has been logged in the sanctuary archives. A platform specialist has been assigned and
                                        will respond within 4 hours.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        onClose();
                                        reset();
                                    }}
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal px-12 py-5 text-xs font-black tracking-[0.3em] text-white uppercase transition-all"
                                >
                                    Return to Sanctuary —
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-10 p-12 lg:p-16">
                                <div className="flex items-center justify-between">
                                    <div className="text-woof-gold flex items-center gap-3">
                                        <ShieldAlert className="size-5" />
                                        <span className="text-xs font-black tracking-[0.5em] uppercase">Priority Concierge</span>
                                    </div>
                                    <button onClick={onClose} className="text-woof-charcoal/40 hover:text-woof-charcoal p-2">
                                        <X className="size-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-woof-charcoal text-4xl leading-none font-black tracking-tight uppercase">
                                        Open Priority <br />
                                        <span className="text-woof-gold font-serif font-normal lowercase">Ticket.</span>
                                    </h3>
                                    <p className="text-woof-charcoal/60 text-sm font-medium">
                                        Our specialists will review your request and respond within 4 hours.
                                    </p>
                                </div>

                                <form className="space-y-8 pt-4" onSubmit={onSubmit}>
                                    <div className="space-y-2">
                                        <label className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            className="bg-woof-cream border-woof-charcoal/5 focus:border-woof-gold/50 w-full rounded-none border px-6 py-4 text-sm font-bold focus:outline-none"
                                            placeholder="Brief summary of your inquiry..."
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">Category</label>
                                            <select
                                                className="bg-woof-cream border-woof-charcoal/5 focus:border-woof-gold/50 w-full appearance-none rounded-none border px-6 py-4 text-sm font-bold focus:outline-none"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                            >
                                                <option>Technical Support</option>
                                                <option>Account & Verification</option>
                                                <option>Payment & Escrow</option>
                                                <option>Logistics & Transport</option>
                                                <option>Ethics Violation</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">
                                                Priority Level
                                            </label>
                                            <select
                                                className="bg-woof-cream border-woof-charcoal/5 focus:border-woof-gold/50 w-full appearance-none rounded-none border px-6 py-4 text-sm font-bold focus:outline-none"
                                                value={data.priority}
                                                onChange={(e) => setData('priority', e.target.value)}
                                            >
                                                <option value="low">Standard Review</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">Urgent — Transactional Issue</option>
                                                <option value="critical">Critical — Trust & Safety</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="bg-woof-cream border-woof-charcoal/5 focus:border-woof-gold/50 w-full rounded-none border px-6 py-4 text-sm font-bold focus:outline-none"
                                            placeholder="Describe your inquiry in detail..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-woof-charcoal/40 text-[10px] font-black tracking-widest uppercase">
                                            Attachment (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('attachment', e.target.files ? e.target.files[0] : null)}
                                            className="text-woof-charcoal/40 file:bg-woof-cream file:text-woof-charcoal hover:file:bg-woof-gold w-full text-xs transition-all file:mr-4 file:rounded-none file:border-0 file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal w-full py-6 text-xs font-black tracking-[0.4em] text-white uppercase transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? 'Transmitting...' : 'Submit Ticket —'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
        </div>
    );
};
