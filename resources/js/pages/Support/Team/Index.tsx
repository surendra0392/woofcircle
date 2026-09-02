import React from 'react';
import SupportLayout from '@/layouts/SupportLayout';
import { Head } from '@inertiajs/react';
import { Users, BarChart3 } from 'lucide-react';

export default function TeamIndex({ team }: { team: any[] }) {
    return (
        <SupportLayout>
            <Head title="Team Performance" />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#f9f6f2] flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#bb8b62]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#24221c]">Team Performance</h2>
                </div>

                <div className="bg-white shadow-sm overflow-hidden rounded-2xl border border-[#e8ded1]">
                    <table className="min-w-full divide-y divide-[#e8ded1]">
                        <thead className="bg-[#f9f6f2]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#61584a] uppercase tracking-wider">
                                    Agent
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#61584a] uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#61584a] uppercase tracking-wider">
                                    Open Tickets
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#61584a] uppercase tracking-wider">
                                    Resolved Tickets
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[#61584a] uppercase tracking-wider">
                                    Total Assigned
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#e8ded1]">
                            {team.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 whitespace-nowrap text-sm text-[#61584a] text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <BarChart3 className="w-8 h-8 text-[#deb893]" />
                                            <span>No subordinates found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                team.map((member) => (
                                    <tr key={member.id} className="hover:bg-[#f9f6f2] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#f9f6f2] flex items-center justify-center font-bold text-[#bb8b62]">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-[#24221c]">{member.name}</div>
                                                    <div className="text-sm text-[#61584a]">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                                                {member.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#24221c]">
                                            {member.performance.open_tickets}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#24221c]">
                                            {member.performance.resolved_tickets}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#24221c]">
                                            {member.performance.total_assigned}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SupportLayout>
    );
}
