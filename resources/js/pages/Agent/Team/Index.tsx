import { Head } from '@inertiajs/react';
import AgentLayout from '@/layouts/AgentLayout';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { Users, Store, Mail, Calendar } from 'lucide-react';

interface Subordinate {
    id: number;
    name: string;
    email: string;
    onboarded_profiles_count: number;
    created_at: string;
}

export default function TeamIndex({ subordinates }: { subordinates: Subordinate[] }) {
    return (
        <AgentLayout title="Field Team Members">
            <Head title="My Team" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Direct Field Team</h1>
                    <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Monitor team subordinates, onboarding volume, and activity telemetry.</p>
                </div>

                <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden">
                    {subordinates.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center mx-auto mb-3">
                                <Users className="size-6" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal mb-1">No Team Members Assigned</h3>
                            <p className="text-xs text-woof-charcoal/60">You currently have no reporting field agents or subordinates assigned.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-[#fcfbf9] text-woof-charcoal/50 text-[10px] font-bold uppercase tracking-wider border-b border-[#e8ded1]">
                                        <th className="py-3.5 px-6">Agent Name</th>
                                        <th className="py-3.5 px-6">Email Address</th>
                                        <th className="py-3.5 px-6 text-center">Profiles Onboarded</th>
                                        <th className="py-3.5 px-6 text-right">Joined Organization</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8ded1] text-xs">
                                    {subordinates.map((member) => (
                                        <tr key={member.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="py-4 px-6 font-bold text-woof-charcoal">{member.name}</td>
                                            <td className="py-4 px-6 text-woof-charcoal/70 font-mono">{member.email}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-woof-charcoal bg-woof-gold/15 border border-woof-gold/30 rounded-full">
                                                    {member.onboarded_profiles_count} Profiles
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right text-woof-charcoal/50 whitespace-nowrap">
                                                <RelativeTime date={member.created_at} format="absolute" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AgentLayout>
    );
}
