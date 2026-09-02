import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SupportLayout from '@/layouts/SupportLayout';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

export default function CannedResponsesIndex({ responses }: any) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this canned response?')) {
            destroy(route('support.manage-canned.destroy', id));
        }
    };

    return (
        <SupportLayout>
            <Head title="Manage Canned Responses" />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#24221c]">Canned Responses</h1>
                    <p className="text-sm text-[#61584a] mt-1">Manage quick replies for the ticket workspace.</p>
                </div>
                <Link
                    href={route('support.manage-canned.create')}
                    className="bg-[#24221c] hover:bg-[#061d10] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Response
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e8ded1] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#e8ded1] flex items-center justify-between bg-[#f9f6f2]">
                    <h2 className="text-lg font-semibold text-[#24221c] flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#bb8b62]" />
                        Library
                    </h2>
                </div>
                
                {responses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f9f6f2] text-[#61584a] text-xs uppercase tracking-wider">
                                    <th className="px-6 py-3 font-bold">Title</th>
                                    <th className="px-6 py-3 font-bold">Preview Content</th>
                                    <th className="px-6 py-3 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8ded1] text-sm">
                                {responses.map((resp: any) => (
                                    <tr key={resp.id} className="hover:bg-[#f9f6f2] transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#24221c] whitespace-nowrap">
                                            {resp.title}
                                        </td>
                                        <td className="px-6 py-4 text-[#61584a] truncate max-w-xs">
                                            {resp.content.substring(0, 80)}{resp.content.length > 80 ? '...' : ''}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            <button
                                                onClick={() => handleDelete(resp.id)}
                                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <MessageSquare className="w-8 h-8 text-[#deb893] mx-auto mb-2" />
                        <p className="text-[#61584a]">No canned responses found.</p>
                    </div>
                )}
            </div>
        </SupportLayout>
    );
}
