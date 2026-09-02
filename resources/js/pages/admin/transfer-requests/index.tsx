import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, Dog, FileText, Shield, ShieldCheck, User, XCircle, X } from 'lucide-react';
import { useState } from 'react';

interface TransferRequestLog {
    timestamp: string;
    user_name: string;
    user_email: string | null;
    action: string;
    ip: string;
}

interface TransferRequest {
    id: number;
    pet_name: string;
    gender: string;
    date_of_birth: string | null;
    status: 'pending_breeder' | 'pending_admin' | 'approved' | 'rejected';
    logs: TransferRequestLog[];
    created_at: string;
    updated_at: string;
    litter: {
        id: number;
        title: string;
        breed?: { id: number; name: string };
    };
    buyer: { id: number; name: string; email: string };
    breeder: { id: number; name: string; email: string };
}

interface Props {
    requests: PaginatedResponse<TransferRequest>;
    filters: { status?: string };
}

export default function AdminTransferRequests({ requests, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [selectedLog, setSelectedLog] = useState<TransferRequest | null>(null);

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(
            route('admin.transfer-requests.index'),
            { status: value === 'all' ? '' : value },
            { preserveState: true, replace: true },
        );
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending_breeder: 'bg-amber-50 text-amber-800 border-amber-200',
            pending_admin: 'bg-sky-50 text-sky-800 border-sky-200',
            approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            rejected: 'bg-rose-50 text-rose-800 border-rose-200',
        };
        return styles[status] || 'bg-[#fcfbf9] text-woof-charcoal/60 border-[#e8ded1]';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending_breeder':
                return <Clock className="h-3 w-3" />;
            case 'pending_admin':
                return <ShieldCheck className="h-3 w-3" />;
            case 'approved':
                return <CheckCircle2 className="h-3 w-3" />;
            case 'rejected':
                return <XCircle className="h-3 w-3" />;
            default:
                return null;
        }
    };

    return (
        <AdminLayout title="Transfer Requests">
            <Head title="Transfer Requests - Admin" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header & Filter Bar */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Pet Ownership Transfers</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Review puppy litter ownership handover requests between breeders and buyers
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                        >
                            <option value="all">All Transfer Statuses</option>
                            <option value="pending_breeder">Pending Breeder</option>
                            <option value="pending_admin">Pending Admin Verification</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {statusFilter !== 'all' && (
                            <Button
                                variant="ghost"
                                onClick={() => handleStatusFilter('all')}
                                className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4"
                            >
                                <X className="mr-1.5 h-3.5 w-3.5" /> Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Request List */}
                {requests?.data?.length > 0 ? (
                    <div className="space-y-4">
                        {requests.data.map((req) => (
                            <div
                                key={req.id}
                                className="border border-[#e8ded1] bg-white p-6 rounded-3xl shadow-xs transition-all hover:shadow-md"
                            >
                                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold">
                                                <Dog className="h-4 w-4" />
                                            </div>
                                            <span className="text-base font-bold text-woof-charcoal">
                                                {req.pet_name}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(req.status)}`}
                                            >
                                                {getStatusIcon(req.status)} {req.status.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-woof-charcoal/40 font-medium">
                                                Request #{req.id}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-woof-charcoal/60 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-woof-gold" />
                                                <span className="font-bold text-woof-charcoal">Buyer:</span> {req.buyer.name}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-sky-600" />
                                                <span className="font-bold text-woof-charcoal">Breeder:</span> {req.breeder.name}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-woof-charcoal/40" />
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="text-xs text-woof-charcoal/50">
                                            Litter: <span className="font-medium text-woof-charcoal">{req.litter?.title}</span> &bull; Breed: {req.litter?.breed?.name || 'N/A'} &bull; Gender: {req.gender}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 pt-2 lg:pt-0">
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedLog(req)}
                                            className="h-9 rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4 cursor-pointer"
                                        >
                                            <FileText className="mr-1.5 h-3.5 w-3.5 text-woof-gold" /> View Logs
                                        </Button>

                                        {req.status === 'pending_admin' && (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                `Approve transfer of "${req.pet_name}" to ${req.buyer.name}? This will create a pet profile and copy all health records.`,
                                                            )
                                                        ) {
                                                            router.post(route('admin.transfer-requests.approve', req.id));
                                                        }
                                                    }}
                                                    className="h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white px-5 shadow-xs cursor-pointer"
                                                >
                                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        if (confirm(`Reject transfer request for "${req.pet_name}"?`)) {
                                                            router.post(route('admin.transfer-requests.reject', req.id));
                                                        }
                                                    }}
                                                    variant="outline"
                                                    className="h-9 rounded-full border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 px-4 cursor-pointer"
                                                >
                                                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {requests.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border border-[#e8ded1] bg-white p-4 rounded-3xl sm:flex-row">
                                <div className="text-xs text-woof-charcoal/60">
                                    Showing {requests.from} to {requests.to} of {requests.total}
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    {requests.links.map((link, idx) => {
                                        let label = link.label;
                                        if (label.includes('Previous')) label = 'Prev';
                                        else if (label.includes('Next')) label = 'Next';

                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="cursor-not-allowed select-none rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-3 py-1.5 text-xs text-woof-charcoal/30"
                                                >
                                                    {label}
                                                </span>
                                            );
                                        }
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                preserveState
                                                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                                                    link.active
                                                        ? 'border-woof-charcoal bg-woof-charcoal text-white'
                                                        : 'border-[#e8ded1] bg-white text-woof-charcoal hover:bg-[#fcfbf9]'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="border border-dashed border-[#e8ded1] bg-white py-16 text-center rounded-3xl">
                        <Shield className="mx-auto mb-3 h-12 w-12 text-woof-charcoal/20" />
                        <p className="text-sm font-bold text-woof-charcoal">No transfer requests found</p>
                        <p className="mt-1 text-xs text-woof-charcoal/50">
                            Transfer requests will appear here when buyers request litter puppies.
                        </p>
                    </div>
                )}

                {/* Audit Log Dialog */}
                <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                    <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-0 shadow-2xl">
                        <div className="bg-[#fcfbf9] border-b border-[#e8ded1] p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-white text-woof-gold shadow-2xs">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-woof-charcoal">
                                        Audit Trail — {selectedLog?.pet_name}
                                    </DialogTitle>
                                    <DialogDescription className="mt-0.5 text-xs text-woof-charcoal/60">
                                        Request #{selectedLog?.id} &bull; Status: {selectedLog?.status?.replace(/_/g, ' ')}
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-6 bg-white">
                            {selectedLog?.logs && selectedLog.logs.length > 0 ? (
                                selectedLog.logs.map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-4 border border-[#e8ded1] bg-[#fcfbf9] p-4 rounded-2xl">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-woof-charcoal text-white">
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-bold text-woof-charcoal">{log.action}</p>
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-woof-charcoal/50">
                                                <span className="font-medium text-woof-charcoal">{log.user_name}</span>
                                                <span>&bull;</span>
                                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                                {log.ip && (
                                                    <>
                                                        <span>&bull;</span>
                                                        <span>IP: {log.ip}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center">
                                    <FileText className="mx-auto mb-2 h-8 w-8 text-woof-charcoal/20" />
                                    <p className="text-xs text-woof-charcoal/50">No log entries recorded yet</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
