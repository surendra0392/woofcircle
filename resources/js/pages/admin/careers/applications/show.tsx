import { Head, useForm, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { ArrowLeft, Download, ExternalLink, Mail, Phone, Calendar, Briefcase, Building, Linkedin, Link as LinkIcon, User, Save } from 'lucide-react';

export default function ApplicationShow({ application }: any) {
    const { data, setData, patch, processing } = useForm({
        status: application.status || 'pending',
        admin_notes: application.admin_notes || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.career-applications.update-status', application.id), {
            onSuccess: () => {
                toast.success('Application status updated successfully');
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'shortlisted':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'reviewed':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'rejected':
                return 'bg-rose-50 text-rose-800 border-rose-200';
            default:
                return 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]';
        }
    };

    return (
        <AdminLayout title="Application Details">
            <Head title={`Application: ${application.full_name} - Admin`} />
            <div className="mx-auto max-w-5xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('admin.career-applications.index')}
                        className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Candidate Profile</h2>
                        <p className="text-xs text-woof-charcoal/60">Review candidate qualifications, cover message, and application progress</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Applicant Profile & Cover Letter */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Card */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs space-y-6">
                            <div className="flex flex-col justify-between gap-4 border-b border-[#e8ded1] pb-5 sm:flex-row sm:items-center">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-woof-charcoal">{application.full_name}</h3>
                                    <p className="text-xs text-woof-charcoal/60">
                                        Applied for <span className="font-bold text-woof-charcoal">{application.position_title}</span> ({application.position_department})
                                    </p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${getStatusBadge(application.status)}`}>
                                        {application.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-wider text-woof-charcoal/50 uppercase">Email Address</div>
                                        <a href={`mailto:${application.email}`} className="text-xs font-bold text-woof-charcoal hover:underline">{application.email}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-wider text-woof-charcoal/50 uppercase">Phone Number</div>
                                        <a href={`tel:${application.phone}`} className="text-xs font-bold text-woof-charcoal hover:underline">{application.phone}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-wider text-woof-charcoal/50 uppercase">Experience</div>
                                        <div className="text-xs font-bold text-woof-charcoal">{application.experience_years ?? '0'} Years</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                        <Building className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-wider text-woof-charcoal/50 uppercase">Current Company</div>
                                        <div className="text-xs font-bold text-woof-charcoal">{application.current_company ?? '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 sm:col-span-2">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-wider text-woof-charcoal/50 uppercase">Applied On</div>
                                        <div className="text-xs font-bold text-woof-charcoal">{application.applied_at || new Date(application.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            {(application.linkedin_url || application.portfolio_url) && (
                                <div className="flex flex-wrap gap-2.5 border-t border-[#e8ded1] pt-5">
                                    {application.linkedin_url && (
                                        <a
                                            href={application.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white px-4 py-2 text-xs font-bold text-woof-charcoal transition-colors shadow-2xs"
                                        >
                                            <Linkedin className="h-3.5 w-3.5 text-sky-600" /> LinkedIn Profile <ExternalLink className="h-3 w-3 text-woof-charcoal/50" />
                                        </a>
                                    )}
                                    {application.portfolio_url && (
                                        <a
                                            href={application.portfolio_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white px-4 py-2 text-xs font-bold text-woof-charcoal transition-colors shadow-2xs"
                                        >
                                            <LinkIcon className="h-3.5 w-3.5 text-emerald-600" /> Portfolio Website <ExternalLink className="h-3 w-3 text-woof-charcoal/50" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cover Letter */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs space-y-3">
                            <h4 className="text-xs font-bold tracking-wider text-woof-charcoal uppercase border-b border-[#e8ded1] pb-3">Cover Letter & Pitch</h4>
                            <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-xs text-woof-charcoal font-medium leading-relaxed whitespace-pre-line">
                                {application.cover_letter ? application.cover_letter : (
                                    <span className="text-woof-charcoal/40 font-normal">No cover letter submitted with this application.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Resume & Application Actions */}
                    <div className="space-y-6">
                        {/* Resume File Card */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs text-center space-y-4">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fcfbf9] text-woof-gold border border-[#e8ded1] shadow-2xs">
                                <User className="h-7 w-7" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-woof-charcoal">Resume Document</h4>
                                <p className="text-[11px] text-woof-charcoal/60 mt-0.5">Download candidate curriculum vitae</p>
                            </div>
                            <a
                                href={route('admin.career-applications.download-resume', application.id)}
                                className="block w-full"
                            >
                                <Button className="w-full bg-woof-charcoal hover:bg-woof-forest text-white transition-all rounded-full h-10 text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                                    <Download className="h-4 w-4" /> Download Resume
                                </Button>
                            </a>
                        </div>

                        {/* Status Management Card */}
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs space-y-4">
                            <h4 className="text-xs font-bold tracking-wider text-woof-charcoal uppercase border-b border-[#e8ded1] pb-3">Review & Notes</h4>
                            
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="status" className="text-xs font-bold text-woof-charcoal">Application Status</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="admin_notes" className="text-xs font-bold text-woof-charcoal">Internal Notes</Label>
                                    <Textarea
                                        id="admin_notes"
                                        rows={4}
                                        value={data.admin_notes}
                                        onChange={(e) => setData('admin_notes', e.target.value)}
                                        className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                        placeholder="Add notes about candidate screening, interviews, or reasons..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-woof-charcoal hover:bg-woof-forest text-white font-bold transition-all rounded-full h-10 text-xs shadow-xs cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Save className="h-4 w-4" /> Save Review
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
