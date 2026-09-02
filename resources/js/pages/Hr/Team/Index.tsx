import HrLayout from '@/layouts/HrLayout';
import { Head } from '@inertiajs/react';
import { User, Mail, Shield, Users } from 'lucide-react';

export default function Index({ team }: { team: any[] }) {
    return (
        <HrLayout title="HR Team Hierarchy">
            <Head title="My HR Team" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">HR Organizational Hierarchy</h1>
                    <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Supervise direct reports, subordinate personnel, and departmental reporting structures.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e8ded1] bg-[#fcfbf9] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Users className="size-4 text-woof-gold" />
                            <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                Departmental Roster ({team.length} Members)
                            </h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#e8ded1]">
                            <thead>
                                <tr className="bg-[#fcfbf9] text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider">
                                    <th scope="col" className="px-6 py-3.5 text-left">
                                        Member
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left">
                                        Reporting Line
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left">
                                        HR Role
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-center">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-right">
                                        Direct Reports
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#e8ded1] text-xs">
                                {team.length > 0 ? (
                                    team.map((member) => (
                                        <tr key={member.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 flex items-center justify-center rounded-full bg-woof-pearl/30 text-woof-charcoal font-bold text-xs border border-[#e8ded1]">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{member.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-woof-charcoal/70">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="size-3.5 text-woof-charcoal/40" />
                                                    {member.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.manager_id ? (
                                                    <div className="text-woof-charcoal flex items-center gap-1">
                                                        <span className="text-woof-gold">↳</span>
                                                        <span className="text-woof-charcoal/60">Reports to:</span>
                                                        <span className="font-semibold">{team.find(t => t.id === member.manager_id)?.name || 'Manager'}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-woof-charcoal/40 font-medium">Direct Report</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-woof-charcoal capitalize">
                                                    <Shield className="size-3.5 text-woof-gold" />
                                                    {member.role.replace('_', ' ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {member.is_active ? (
                                                    <span className="px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-woof-charcoal/70">
                                                <span className="px-2.5 py-0.5 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-[11px] font-bold">
                                                    {member.subordinates_count} staff
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50 font-medium">
                                            No team members assigned in this division.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
