import { Head, Link, useForm } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { LifeBuoy, ArrowLeft, Send } from 'lucide-react';

export default function SupportCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        priority: 'medium',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agent.support.store'));
    };

    return (
        <AgentLayout title="Create Support Ticket">
            <Head title="Create Support Ticket" />

            <div className="mb-6">
                <Link
                    href={route('agent.support.index')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-woof-charcoal/70 hover:text-woof-gold transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Support Desk
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#e8ded1]">
                    <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                        <LifeBuoy className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-woof-charcoal">New Support Ticket</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5">Submit an internal inquiry, dispute, or technical escalation.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="subject" className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                            Subject / Issue Summary <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={data.subject}
                            onChange={e => setData('subject', e.target.value)}
                            className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                            placeholder="e.g. Profile claim verification issue in Bandra district"
                            required
                        />
                        {errors.subject && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.subject}</p>}
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                            Urgency / Priority Level
                        </label>
                        <select
                            id="priority"
                            value={data.priority}
                            onChange={e => setData('priority', e.target.value as 'low' | 'medium' | 'high')}
                            className="w-full h-11 px-4 text-xs rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                        >
                            <option value="low">Low (General Query)</option>
                            <option value="medium">Medium (Standard Request)</option>
                            <option value="high">High (Urgent / Client Impacted)</option>
                        </select>
                        {errors.priority && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.priority}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-woof-charcoal mb-1.5 uppercase tracking-wider">
                            Detailed Description <span className="text-rose-600">*</span>
                        </label>
                        <div className="rounded-2xl border border-[#e8ded1] overflow-hidden bg-[#fcfbf9]">
                            <RichTextEditor
                                value={data.message}
                                onChange={(val) => setData('message', val)}
                                theme="light"
                            />
                        </div>
                        <p className="text-[11px] text-woof-charcoal/50 mt-1.5">Describe the context with listing URLs, agent notes, and error screenshots if applicable.</p>
                        {errors.message && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.message}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8ded1]">
                        <Link
                            href={route('agent.support.index')}
                            className="px-5 py-2.5 text-xs font-bold text-woof-charcoal/70 hover:text-woof-charcoal rounded-full transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <Send className="size-3.5" />
                            {processing ? 'Submitting...' : 'Submit Support Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </AgentLayout>
    );
}
