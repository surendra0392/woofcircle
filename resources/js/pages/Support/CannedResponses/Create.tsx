import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SupportLayout from '@/layouts/SupportLayout';
import { ArrowLeft, Type, FileText } from 'lucide-react';

export default function CannedResponsesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('support.manage-canned.store'));
    };

    return (
        <SupportLayout>
            <Head title="Create Canned Response" />
            
            <div className="mb-6">
                <Link
                    href={route('support.manage-canned.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#61584a] hover:text-[#24221c] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Responses
                </Link>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#e8ded1] shadow-sm max-w-2xl">
                <h2 className="text-xl font-bold text-[#24221c] mb-6">New Canned Response</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#24221c] mb-1.5 uppercase tracking-wider">
                            Shortcut Title
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Type className="h-4 w-4 text-[#bb8b62]" />
                            </div>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full pl-11 rounded-2xl border-[#e8ded1] shadow-sm focus:border-[#bb8b62] focus:ring-[#bb8b62] bg-[#fcfbf9]"
                                placeholder="e.g., Return Policy"
                                required
                            />
                        </div>
                        {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#24221c] mb-1.5 uppercase tracking-wider">
                            Message Content
                        </label>
                        <div className="relative">
                            <div className="absolute top-3.5 left-4 pointer-events-none">
                                <FileText className="h-4 w-4 text-[#bb8b62]" />
                            </div>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                rows={8}
                                className="w-full pl-11 rounded-2xl border-[#e8ded1] shadow-sm focus:border-[#bb8b62] focus:ring-[#bb8b62] resize-none bg-[#fcfbf9]"
                                placeholder="The full response text that will be inserted..."
                                required
                            />
                        </div>
                        {errors.content && <p className="text-rose-600 text-xs mt-1">{errors.content}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#e8ded1]">
                        <Link
                            href={route('support.manage-canned.index')}
                            className="px-5 py-2.5 border border-[#e8ded1] text-[#61584a] rounded-full hover:bg-[#f9f6f2] transition text-sm font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#24221c] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#061d10] transition disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Response'}
                        </button>
                    </div>
                </form>
            </div>
        </SupportLayout>
    );
}
