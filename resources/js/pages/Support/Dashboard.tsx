import React from 'react';
import SupportLayout from '@/layouts/SupportLayout';
import { Head } from '@inertiajs/react';
import { Ticket, CheckCircle2, UserCheck, User, FileText, LifeBuoy, MessageSquare } from 'lucide-react';

export default function Dashboard({ kpis }: { kpis: any }) {
    return (
        <SupportLayout>
            <Head title="Support Dashboard" />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-[#24221c]">Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-[#e8ded1]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#f9f6f2] flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-[#bb8b62]" />
                            </div>
                            <div className="text-xs font-bold text-[#61584a] uppercase tracking-wider">Open Tickets</div>
                        </div>
                        <div className="text-4xl font-bold text-[#24221c]">{kpis.open_tickets}</div>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-[#e8ded1]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="text-xs font-bold text-[#61584a] uppercase tracking-wider">Resolved Tickets</div>
                        </div>
                        <div className="text-4xl font-bold text-[#24221c]">{kpis.resolved_tickets}</div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-[#e8ded1]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="text-xs font-bold text-[#61584a] uppercase tracking-wider">My Assigned Tickets</div>
                        </div>
                        <div className="text-4xl font-bold text-[#24221c]">{kpis.my_tickets}</div>
                    </div>
                </div>

                <div className="mt-8 mb-6">
                    <h2 className="text-lg font-black uppercase tracking-tight text-[#24221c] mb-4">Quick Links</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <a href={route('support.profile.edit')} className="bg-white p-5 rounded-3xl shadow-sm border border-[#e8ded1] flex flex-col justify-center items-center text-center hover:border-[#bb8b62] hover:shadow-md transition-all group">
                            <div className="bg-[#f9f6f2] group-hover:bg-[#bb8b62]/10 p-3 rounded-full mb-3 transition-colors">
                                <User className="w-5 h-5 text-[#61584a] group-hover:text-[#bb8b62] transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-[#24221c] uppercase tracking-wider">My Profile</span>
                        </a>
                        <a href={route('support.tickets.index')} className="bg-white p-5 rounded-3xl shadow-sm border border-[#e8ded1] flex flex-col justify-center items-center text-center hover:border-[#bb8b62] hover:shadow-md transition-all group">
                            <div className="bg-[#f9f6f2] group-hover:bg-[#bb8b62]/10 p-3 rounded-full mb-3 transition-colors">
                                <FileText className="w-5 h-5 text-[#61584a] group-hover:text-[#bb8b62] transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-[#24221c] uppercase tracking-wider">All Tickets</span>
                        </a>
                        <a href={route('support.queue.index')} className="bg-white p-5 rounded-3xl shadow-sm border border-[#e8ded1] flex flex-col justify-center items-center text-center hover:border-[#bb8b62] hover:shadow-md transition-all group">
                            <div className="bg-[#f9f6f2] group-hover:bg-[#bb8b62]/10 p-3 rounded-full mb-3 transition-colors">
                                <LifeBuoy className="w-5 h-5 text-[#61584a] group-hover:text-[#bb8b62] transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-[#24221c] uppercase tracking-wider">My Queue</span>
                        </a>
                        <a href={route('support.canned-responses.index')} className="bg-white p-5 rounded-3xl shadow-sm border border-[#e8ded1] flex flex-col justify-center items-center text-center hover:border-[#bb8b62] hover:shadow-md transition-all group">
                            <div className="bg-[#f9f6f2] group-hover:bg-[#bb8b62]/10 p-3 rounded-full mb-3 transition-colors">
                                <MessageSquare className="w-5 h-5 text-[#61584a] group-hover:text-[#bb8b62] transition-colors" />
                            </div>
                            <span className="text-xs font-bold text-[#24221c] uppercase tracking-wider">Responses</span>
                        </a>
                    </div>
                </div>
            </div>
        </SupportLayout>
    );
}
