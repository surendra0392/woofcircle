import { Head, useForm, Link, usePage } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { ArrowLeft, User, Mail, Lock, Shield } from 'lucide-react';
import React from 'react';

export default function EditEmployee({ employee, states = [], cities = [] }: any) {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name || '',
        email: employee.email || '',
        password: '',
        role: employee.role || 'field_agent',
        is_active: employee.is_active ?? true,
        state_id: employee.state_id || '',
        city_id: employee.city_id || '',
    });

    const filteredCities = cities.filter((city: any) => city.state_id === parseInt(data.state_id) || !data.state_id);

    const { auth } = usePage().props as any;
    const isHrRole = ['hr_manager', 'hr_executive'].includes(employee.role) || ['hr_manager', 'hr_executive'].includes(data.role);
    const canEditLocation = !isHrRole || ['admin', 'superadmin'].includes(auth?.user?.role || auth?.admin?.role);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('hr.employees.update', employee.id));
    };

    return (
        <HrLayout title={`Edit Employee: ${employee.name}`}>
            <Head title={`Edit ${employee.name}`} />
            
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-3">
                    <Link 
                        href={route('hr.employees.index')} 
                        className="inline-flex items-center gap-1.5 size-9 rounded-full bg-white border border-[#e8ded1] justify-center text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">Edit Employee Profile</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Update records for {employee.name}.</p>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8ded1] shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">Full Legal Name</label>
                            <div className="relative">
                                <User className="size-4 text-woof-charcoal/40 absolute top-1/2 left-3.5 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 pr-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                    required
                                />
                            </div>
                            {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">Corporate Email Address</label>
                            <div className="relative">
                                <Mail className="size-4 text-woof-charcoal/40 absolute top-1/2 left-3.5 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 pr-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">Reset Password (Leave blank to keep existing)</label>
                            <div className="relative">
                                <Lock className="size-4 text-woof-charcoal/40 absolute top-1/2 left-3.5 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 pr-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                                    minLength={8}
                                />
                            </div>
                            {errors.password && <p className="text-rose-600 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">Role Assignment</label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs font-medium text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold"
                            >
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="hr_manager">HR Manager</option>
                                <option value="hr_executive">HR Executive</option>
                                <option value="field_agent">Field Agent</option>
                                <option value="support_agent">Support Agent</option>
                                <option value="finance">Finance</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Sales</option>
                            </select>
                            {errors.role && <p className="text-rose-600 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">State Jurisdiction</label>
                                <select
                                    value={data.state_id}
                                    onChange={e => setData(d => ({ ...d, state_id: e.target.value, city_id: '' }))}
                                    className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!canEditLocation}
                                >
                                    <option value="">Select State</option>
                                    {states.map((state: any) => (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.state_id && <p className="text-rose-600 text-xs mt-1">{errors.state_id}</p>}
                                {!canEditLocation && <p className="text-woof-charcoal/50 text-[10px] mt-1">Only master admins can reassign state jurisdictions for HR roles.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-woof-charcoal uppercase tracking-wider mb-2">Assigned City</label>
                                <select
                                    value={data.city_id}
                                    onChange={e => setData('city_id', e.target.value)}
                                    className="w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-4 py-2.5 text-xs text-woof-charcoal shadow-xs focus:border-woof-gold focus:ring-1 focus:ring-woof-gold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!data.state_id || !canEditLocation}
                                >
                                    <option value="">Select City</option>
                                    {filteredCities.map((city: any) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="text-rose-600 text-xs mt-1">{errors.city_id}</p>}
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded-lg border-[#e8ded1] text-woof-gold focus:ring-woof-gold size-4"
                                />
                                <span className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Account Active & In Good Standing</span>
                            </label>
                            {errors.is_active && <p className="text-rose-600 text-xs mt-1">{errors.is_active}</p>}
                        </div>

                        <div className="flex justify-end items-center gap-3 pt-6 border-t border-[#e8ded1]">
                            <Link
                                href={route('hr.employees.index')}
                                className="px-5 py-2.5 border border-[#e8ded1] text-woof-charcoal rounded-full text-xs font-bold hover:bg-[#fcfbf9] transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? 'Saving...' : 'Save Profile Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </HrLayout>
    );
}
