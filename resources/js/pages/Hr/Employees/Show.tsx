import { Head, Link, router } from '@inertiajs/react';
import HrLayout from '@/layouts/HrLayout';
import { ArrowLeft, User, Briefcase, Calendar, Target, Plus, Check, FileText, Trash2, Download, Shield, IndianRupee, Sparkles, Building2, MapPin } from 'lucide-react';

export default function EmployeeShow({ employee, stats, payouts }: any) {
    const handleDeactivate = () => {
        if(confirm('Are you sure you want to deactivate this employee account?')) {
            router.delete(route('hr.employees.destroy', employee.id));
        }
    };

    return (
        <HrLayout title={`Staff Dossier: ${employee.name}`}>
            <Head title={`Employee: ${employee.name}`} />
            
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <Link 
                        href={route('hr.employees.index')} 
                        className="inline-flex items-center gap-1.5 size-9 rounded-full bg-white border border-[#e8ded1] justify-center text-woof-charcoal/60 hover:text-woof-gold hover:border-woof-gold transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-woof-charcoal tracking-tight">{employee.name}</h1>
                        <p className="text-xs text-woof-charcoal/60 mt-0.5 font-normal">Personnel dossier, operational performance metrics, disbursements, and document vault.</p>
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-16 bg-woof-pearl/30 border border-[#e8ded1] text-woof-charcoal rounded-full flex items-center justify-center text-2xl font-bold uppercase shadow-xs shrink-0">
                            {employee.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-woof-charcoal">{employee.name}</h2>
                                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    employee.is_active 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}>
                                    {employee.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-xs text-woof-charcoal/60 mt-1 flex items-center gap-2 capitalize">
                                <span className="inline-flex items-center gap-1 font-semibold text-woof-charcoal">
                                    <Shield className="size-3.5 text-woof-gold" />
                                    {employee.role.replace('_', ' ')}
                                </span>
                                <span>•</span>
                                <span>{employee.email}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('hr.employees.edit', employee.id)}
                            className="bg-[#fcfbf9] hover:bg-white text-woof-charcoal border border-[#e8ded1] px-5 py-2 rounded-full text-xs font-bold transition-colors shadow-xs"
                        >
                            Edit Profile
                        </Link>
                        <button 
                            onClick={handleDeactivate} 
                            className="bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 px-5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer"
                        >
                            Deactivate Account
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Information Details */}
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 md:col-span-1 space-y-4">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider border-b border-[#e8ded1] pb-3">Account Details</h3>
                        <div className="space-y-4 text-xs">
                            <div>
                                <p className="text-[10px] text-woof-charcoal/50 uppercase font-bold tracking-wider">Contact Email</p>
                                <p className="font-semibold text-woof-charcoal mt-0.5">{employee.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-woof-charcoal/50 uppercase font-bold tracking-wider">Onboarding Date</p>
                                <p className="font-semibold text-woof-charcoal mt-0.5 flex items-center gap-1.5">
                                    <Calendar className="size-3.5 text-woof-gold" />
                                    {new Date(employee.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-woof-charcoal/50 uppercase font-bold tracking-wider">Assigned Jurisdiction</p>
                                <p className="font-semibold text-woof-charcoal mt-0.5 flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-woof-gold" />
                                    {employee.city ? `${employee.city.name}, ` : ''}{employee.state ? employee.state.name : 'National / Unrestricted'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] p-6 md:col-span-2 space-y-4">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider border-b border-[#e8ded1] pb-3 flex items-center gap-2">
                            <Target className="size-4 text-woof-gold" /> Performance Telemetry
                        </h3>
                        
                        {Object.keys(stats || {}).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.onboarded_profiles !== undefined && (
                                    <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#e8ded1]">
                                        <p className="text-[10px] text-woof-charcoal/50 uppercase tracking-wider font-bold">Onboarded Service Profiles</p>
                                        <p className="text-2xl font-bold text-woof-charcoal mt-1 tracking-tight">{stats.onboarded_profiles}</p>
                                    </div>
                                )}
                                {stats.ad_placements_sold !== undefined && (
                                    <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#e8ded1]">
                                        <p className="text-[10px] text-woof-charcoal/50 uppercase tracking-wider font-bold">Ad Placements Booked</p>
                                        <p className="text-2xl font-bold text-woof-charcoal mt-1 tracking-tight">{stats.ad_placements_sold}</p>
                                    </div>
                                )}
                                {stats.resolved_internal_tickets !== undefined && (
                                    <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#e8ded1]">
                                        <p className="text-[10px] text-woof-charcoal/50 uppercase tracking-wider font-bold">Internal Tickets Settled</p>
                                        <p className="text-2xl font-bold text-woof-charcoal mt-1 tracking-tight">{stats.resolved_internal_tickets}</p>
                                    </div>
                                )}
                                {stats.resolved_support_tickets !== undefined && (
                                    <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#e8ded1]">
                                        <p className="text-[10px] text-woof-charcoal/50 uppercase tracking-wider font-bold">Support Inquiries Resolved</p>
                                        <p className="text-2xl font-bold text-woof-charcoal mt-1 tracking-tight">{stats.resolved_support_tickets}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-woof-charcoal/50 py-4">No specific metrics indexed for this role tier.</p>
                        )}
                    </div>
                </div>

                {/* Payouts Section */}
                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] overflow-hidden">
                    <div className="p-5 sm:px-6 border-b border-[#e8ded1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfbf9]">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Disbursement & Settlement History</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            router.post(route('hr.payouts.store'), {
                                admin_id: employee.id,
                                amount: formData.get('amount'),
                                type: formData.get('type'),
                                period_start: formData.get('period_start'),
                                period_end: formData.get('period_end'),
                            });
                        }} className="flex flex-wrap items-center gap-2">
                            <input 
                                type="number" 
                                name="amount" 
                                placeholder="Amount (₹)" 
                                required 
                                min="0.01" 
                                step="0.01" 
                                className="text-xs rounded-xl border border-[#e8ded1] bg-white px-3 py-1.5 w-28 text-woof-charcoal" 
                            />
                            <select name="type" required className="text-xs rounded-xl border border-[#e8ded1] bg-white px-3 py-1.5 text-woof-charcoal font-medium">
                                <option value="salary">Salary</option>
                                <option value="commission">Commission</option>
                                <option value="bonus">Bonus</option>
                            </select>
                            <input type="date" name="period_start" required className="text-xs rounded-xl border border-[#e8ded1] bg-white px-2.5 py-1.5 text-woof-charcoal" />
                            <input type="date" name="period_end" required className="text-xs rounded-xl border border-[#e8ded1] bg-white px-2.5 py-1.5 text-woof-charcoal" />
                            <button type="submit" className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white size-8 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer">
                                <Plus className="size-4 stroke-[3]" />
                            </button>
                        </form>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                                <tr className="bg-[#fcfbf9] text-woof-charcoal/50 uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded1]">
                                    <th className="px-6 py-3.5">Disbursement Type</th>
                                    <th className="px-6 py-3.5">Amount</th>
                                    <th className="px-6 py-3.5">Accrual Period</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8ded1] text-xs">
                                {payouts?.length > 0 ? payouts.map((payout: any) => (
                                    <tr key={payout.id} className="hover:bg-[#fcfbf9] transition-colors">
                                        <td className="px-6 py-3.5 font-bold text-woof-charcoal capitalize">{payout.type}</td>
                                        <td className="px-6 py-3.5 font-mono font-bold text-woof-charcoal">₹{parseFloat(payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-3.5 text-woof-charcoal/60">
                                            {new Date(payout.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(payout.period_end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                payout.status === 'paid' 
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                            }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            {payout.status === 'pending' && (
                                                <button 
                                                    onClick={() => router.put(route('hr.payouts.update', payout.id), { status: 'paid' })}
                                                    className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors border border-emerald-200 font-bold cursor-pointer"
                                                    title="Mark as Paid"
                                                >
                                                    <Check className="size-3 stroke-[3]" /> Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-woof-charcoal/50 font-medium">No disbursement history recorded for this employee.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Document Vault Section */}
                <div className="bg-white rounded-3xl shadow-xs border border-[#e8ded1] overflow-hidden">
                    <div className="p-5 sm:px-6 border-b border-[#e8ded1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfbf9]">
                        <h3 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-2">
                            <FileText className="size-4 text-woof-gold" />
                            Employee Document Vault
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            router.post(route('hr.employees.documents.store', employee.id), formData, {
                                forceFormData: true,
                                onSuccess: () => (e.target as HTMLFormElement).reset(),
                            });
                        }} className="flex flex-wrap items-center gap-2">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Document Title" 
                                required 
                                className="text-xs rounded-xl border border-[#e8ded1] bg-white px-3 py-1.5 w-44 text-woof-charcoal" 
                            />
                            <input 
                                type="file" 
                                name="file" 
                                required 
                                accept=".pdf,.jpg,.jpeg,.png" 
                                className="text-xs w-44 text-woof-charcoal/60 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#fcfbf9] file:text-woof-charcoal hover:file:bg-[#e8ded1]" 
                            />
                            <button type="submit" className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white size-8 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer">
                                <Plus className="size-4 stroke-[3]" />
                            </button>
                        </form>
                    </div>
                    <div className="p-6">
                        {(!employee.documents || employee.documents.length === 0) ? (
                            <p className="text-xs text-woof-charcoal/50 text-center py-4">No verified documents or contracts uploaded yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {employee.documents.map((doc: any) => (
                                    <div key={doc.id} className="border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between bg-[#fcfbf9] hover:border-woof-gold/60 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="bg-white border border-[#e8ded1] p-2.5 rounded-xl text-woof-gold shrink-0">
                                                <FileText className="size-5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-bold text-xs text-woof-charcoal truncate">{doc.name}</p>
                                                <p className="text-[10px] text-woof-charcoal/50 mt-0.5">
                                                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            <a 
                                                href={`/storage/${doc.file_path}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="size-7 rounded-full bg-white border border-[#e8ded1] flex items-center justify-center text-woof-charcoal/70 hover:text-woof-gold hover:border-woof-gold transition-colors"
                                                title="Download Attachment"
                                            >
                                                <Download className="size-3.5" />
                                            </a>
                                            <button 
                                                onClick={() => {
                                                    if(confirm('Permanently delete this document from vault?')) {
                                                        router.delete(route('hr.employees.documents.destroy', { employee: employee.id, document: doc.id }));
                                                    }
                                                }} 
                                                className="size-7 rounded-full bg-white border border-[#e8ded1] flex items-center justify-center text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer"
                                                title="Delete File"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HrLayout>
    );
}
