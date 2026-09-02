import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { Plus, Eye, Users, Filter, UserCheck, Shield } from 'lucide-react';

export default function EmployeeIndex({ employees, filters }: any) {
    const [role, setRole] = useState(filters.role || '');

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setRole(value);
        router.get(route('hr.employees.index'), { role: value }, { preserveState: true, preserveScroll: true });
    };

    return (
        <HrLayout title="Staff & Personnel Directory">
            <Head title="Employees" />
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Staff & Personnel Directory</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Supervise active field agents, support personnel, and executive HR staff accounts.</p>
                    </div>
                    <Link
                        href={route('hr.employees.create')}
                        className="inline-flex items-center gap-2 bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                        <Plus className="size-4 stroke-[3]" /> Add New Employee
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] overflow-hidden">
                    <div className="p-4 sm:px-6 border-b border-[#e8ded1] flex flex-wrap justify-between items-center gap-4 bg-[#fcfbf9]">
                        <div className="flex items-center gap-3">
                            <Filter className="size-4 text-woof-charcoal/40" />
                            <span className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Filter by Role:</span>
                            <select 
                                value={role} 
                                onChange={handleFilter}
                                className="text-xs border border-[#e8ded1] rounded-2xl bg-white px-3 py-1.5 font-medium text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                            >
                                <option value="">All Operational Roles</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="hr_manager">HR Manager</option>
                                <option value="hr_executive">HR Executive</option>
                                <option value="field_agent">Field Agent</option>
                                <option value="support_agent">Support Agent</option>
                                <option value="finance">Finance</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Sales</option>
                            </select>
                        </div>
                        <div className="text-[11px] font-medium text-woof-charcoal/60">
                            Total Records: <span className="font-bold text-woof-charcoal">{employees.total}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-[#fcfbf9] text-woof-charcoal/50 uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded1]">
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Contact Email</th>
                                    <th className="px-6 py-4">Assigned Role</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Onboarded</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8ded1] text-xs">
                                {employees.data.map((employee: any) => (
                                    <tr key={employee.id} className="hover:bg-[#fcfbf9] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-woof-pearl/30 border border-[#e8ded1] flex items-center justify-center font-bold text-woof-charcoal text-xs">
                                                    {employee.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-woof-charcoal">{employee.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-woof-charcoal/70">{employee.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                                <Shield className="size-3 text-woof-gold" />
                                                {employee.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {employee.is_active ? (
                                                <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Active</span>
                                            ) : (
                                                <span className="inline-block bg-rose-50 text-rose-800 border border-rose-200 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-woof-charcoal/60">
                                            {new Date(employee.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={route('hr.employees.show', employee.id)} 
                                                className="inline-flex items-center gap-1 size-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] justify-center text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold transition-colors"
                                                title="View Profile Dossier"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {employees.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50 font-medium">
                                            No employee records found matching selected filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-[#e8ded1] flex justify-between items-center text-xs text-woof-charcoal/60 bg-[#fcfbf9]">
                        <div>Showing {employees.from || 0} to {employees.to || 0} of {employees.total} staff records</div>
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
