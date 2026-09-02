import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    Dog,
    Edit2,
    FileText,
    Loader2,
    Pill,
    Plus,
    Send,
    Shield,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Trash2,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface Breed {
    id: number;
    name: string;
}

interface Litter {
    id: number;
    title: string;
    breed: Breed;
    featured_image_path: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PuppyHealthRecord {
    id: number;
    litter_id: number;
    record_type: string;
    title: string;
    description: string | null;
    administered_date: string;
    next_due_date: string | null;
    vet_name: string | null;
    notes: string | null;
    created_at: string;
}

interface TransferRequest {
    id: number;
    pet_name: string;
    gender: string;
    status: 'pending_breeder' | 'pending_admin' | 'approved' | 'rejected';
    created_at: string;
    buyer: {
        id: number;
        name: string;
        email: string;
    };
}

interface PageProps {
    litter: Litter;
    records: PuppyHealthRecord[];
    recordTypes: string[];
    users: User[];
    transferRequests: TransferRequest[];
}

export default function BreederLitterHealthRecords({
    litter,
    records,
    recordTypes,
    users,
    transferRequests,
}: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PuppyHealthRecord | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<PuppyHealthRecord | null>(null);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    interface HealthRecordFormData {
        record_type: string;
        title: string;
        description: string;
        administered_date: string;
        next_due_date: string;
        vet_name: string;
        notes: string;
        [key: string]: any;
    }

    const { data, setData, processing, errors, reset, clearErrors } = useForm<HealthRecordFormData>({
        record_type: 'vaccination',
        title: '',
        description: '',
        administered_date: '',
        next_due_date: '',
        vet_name: '',
        notes: '',
    });

    const transferForm = useForm({
        user_id: '',
        pet_name: '',
        gender: 'male',
        date_of_birth: '',
    });

    const openAddDialog = () => {
        setEditingRecord(null);
        reset();
        clearErrors();
        setIsFormOpen(true);
    };

    const openEditDialog = (record: PuppyHealthRecord) => {
        setEditingRecord(record);
        clearErrors();
        setData({
            record_type: record.record_type,
            title: record.title,
            description: record.description || '',
            administered_date: record.administered_date.split('T')[0],
            next_due_date: record.next_due_date ? record.next_due_date.split('T')[0] : '',
            vet_name: record.vet_name || '',
            notes: record.notes || '',
        });
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingRecord
            ? route('breeder.litters.health-records.update', [litter.id, editingRecord.id])
            : route('breeder.litters.health-records.store', litter.id);
        router.post(url, data, {
            onSuccess: () => {
                setIsFormOpen(false);
                reset();
            },
        });
    };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        transferForm.post(route('breeder.litters.transfer', litter.id), {
            onSuccess: () => {
                setIsTransferOpen(false);
                transferForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (selectedForDelete) {
            router.delete(route('breeder.litters.health-records.destroy', [litter.id, selectedForDelete.id]), {
                onSuccess: () => setIsDeleteDialogOpen(false),
            });
        }
    };

    const getRecordIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'vaccination':
                return <Syringe className="h-4 w-4" />;
            case 'deworming':
                return <Pill className="h-4 w-4" />;
            case 'health_check':
                return <ShieldCheck className="h-4 w-4" />;
            default:
                return <ClipboardList className="h-4 w-4" />;
        }
    };

    const getRecordBadgeClass = (type: string) => {
        switch (type.toLowerCase()) {
            case 'vaccination':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'deworming':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'health_check':
                return 'bg-blue-50 text-blue-800 border-blue-200';
            default:
                return 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]';
        }
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Litters', href: route('breeder.litters.index') },
                { title: litter.title, href: route('breeder.litters.edit', litter.id) },
                { title: 'Puppy Health', href: '#' },
            ]}
            title={`${litter.title} — Health Records`}
            subtitle="Pre-adoption clinical registry and digital health history"
            actions={
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsTransferOpen(true)}
                        className="rounded-full border border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-xs font-bold text-woof-charcoal h-11 px-5 shadow-2xs gap-1.5 cursor-pointer"
                    >
                        <Send className="h-4 w-4 text-woof-gold" /> Transfer Records
                    </Button>

                    <Button
                        onClick={openAddDialog}
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-11 px-6 transition-all shadow-xs cursor-pointer gap-1.5"
                    >
                        <Plus className="h-4 w-4" /> Add Record
                    </Button>
                </div>
            }
        >
            <Head title={`${litter.title} - Puppy Health Records`} />

            <div className="space-y-8 pb-16 max-w-5xl mx-auto">
                {/* Hero Header Card */}
                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] shrink-0 shadow-2xs flex items-center justify-center">
                            {litter.featured_image_path ? (
                                <img
                                    src={`/storage/${litter.featured_image_path}`}
                                    alt={litter.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Dog className="h-10 w-10 text-woof-charcoal/30" />
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold">
                                    {litter.breed.name}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                    <ShieldCheck className="h-3 w-3" /> Pre-adoption Registry
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-woof-charcoal">{litter.title}</h2>
                            <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                Keep accurate records to establish trust with prospective puppy owners
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-[#e8ded1] pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Recorded Procedures</p>
                            <p className="text-2xl font-bold text-woof-charcoal">{records.length}</p>
                        </div>
                    </div>
                </div>

                {/* Transfer Requests Section */}
                {transferRequests && transferRequests.length > 0 && (
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-4">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                                <Send className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Incoming Transfer Requests</h3>
                                <p className="text-xs text-woof-charcoal/60">Review and approve puppy ownership transfers</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {transferRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-woof-charcoal">{req.pet_name}</span>
                                            <Badge
                                                className={`rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    req.status === 'pending_breeder'
                                                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                        : req.status === 'pending_admin'
                                                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                                                          : req.status === 'approved'
                                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                            : 'bg-rose-50 text-rose-800 border-rose-200'
                                                }`}
                                            >
                                                {req.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-woof-charcoal/60 mt-1">
                                            Buyer: <span className="font-medium text-woof-charcoal">{req.buyer.name}</span> &bull; Gender: {req.gender} &bull; Requested: {new Date(req.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {req.status === 'pending_breeder' && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => {
                                                    if (confirm('Approve this transfer request? It will be sent to Admin for final verification.')) {
                                                        router.post(route('breeder.litters.transfer-requests.approve', req.id));
                                                    }
                                                }}
                                                className="h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 gap-1.5 shadow-xs cursor-pointer"
                                            >
                                                <ShieldCheck className="h-3.5 w-3.5" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (confirm('Reject this transfer request?')) {
                                                        router.post(route('breeder.litters.transfer-requests.reject', req.id));
                                                    }
                                                }}
                                                variant="outline"
                                                className="h-9 rounded-full border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold px-4 cursor-pointer"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {req.status === 'pending_admin' && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                                            <Clock className="h-3.5 w-3.5" /> Awaiting Admin Approval
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Records Timeline */}
                <div className="space-y-4">
                    {records.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-[#e8ded1] p-12 text-center shadow-xs flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold mb-3">
                                <ClipboardList className="h-7 w-7" />
                            </div>
                            <h3 className="text-base font-bold text-woof-charcoal">No Health Records Logged</h3>
                            <p className="text-xs text-woof-charcoal/60 max-w-sm mt-1">
                                Document vaccinations, deworming cycles, and vet exams to establish a verified clinical passport.
                            </p>
                            <Button
                                onClick={openAddDialog}
                                className="mt-6 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white text-xs font-bold h-11 px-6 shadow-xs cursor-pointer gap-1.5"
                            >
                                <Plus className="h-4 w-4" /> Add First Record
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {records.map((record) => (
                                <div
                                    key={record.id}
                                    className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${getRecordBadgeClass(record.record_type)}`}>
                                            {getRecordIcon(record.record_type)}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRecordBadgeClass(record.record_type)}`}>
                                                    {record.record_type.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-xs text-woof-charcoal/50 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-woof-gold" />
                                                    {new Date(record.administered_date).toLocaleDateString(undefined, {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>

                                            <h4 className="text-base font-bold text-woof-charcoal">{record.title}</h4>

                                            {record.description && (
                                                <p className="text-xs text-woof-charcoal/70">{record.description}</p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-woof-charcoal/50 pt-1">
                                                {record.vet_name && (
                                                    <span className="flex items-center gap-1">
                                                        <Stethoscope className="h-3.5 w-3.5 text-woof-gold" /> Dr. {record.vet_name}
                                                    </span>
                                                )}
                                                {record.next_due_date && (
                                                    <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px] font-medium">
                                                        <Clock className="h-3 w-3" /> Next Due: {new Date(record.next_due_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditDialog(record)}
                                            className="h-9 w-9 rounded-full text-woof-charcoal hover:bg-[#fcfbf9] hover:text-woof-gold"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedForDelete(record);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                            className="h-9 w-9 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 max-w-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-woof-charcoal">
                            {editingRecord ? 'Edit Health Record' : 'Add Clinical Record'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/60">
                            Log a medical procedure or health milestone for {litter.title}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Treatment Type</Label>
                                <Select value={data.record_type} onValueChange={(v) => setData('record_type', v)}>
                                    <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                        {recordTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="text-xs capitalize">
                                                {type.replace('_', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Date Administered</Label>
                                <Input
                                    type="date"
                                    value={data.administered_date}
                                    onChange={(e) => setData('administered_date', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                    required
                                />
                                {errors.administered_date && (
                                    <p className="text-xs font-bold text-rose-600 mt-1">{errors.administered_date}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Treatment / Vaccine Title</Label>
                            <Input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                placeholder="e.g. DHPP Vaccination (1st Dose)"
                                required
                            />
                            {errors.title && <p className="text-xs font-bold text-rose-600 mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Next Booster Due (Optional)</Label>
                                <Input
                                    type="date"
                                    value={data.next_due_date}
                                    onChange={(e) => setData('next_due_date', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Vet Name (Optional)</Label>
                                <Input
                                    value={data.vet_name}
                                    onChange={(e) => setData('vet_name', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                    placeholder="Dr. Sharma"
                                />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Description / Findings</Label>
                            <Textarea
                                value={data.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                className="min-h-[80px] rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold resize-none"
                                placeholder="Notes about the checkup or batch number..."
                            />
                        </div>

                        <DialogFooter className="pt-4 flex gap-3 border-t border-[#e8ded1]">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                className="rounded-full border-[#e8ded1] bg-[#fcfbf9] text-xs font-bold text-woof-charcoal h-10 px-5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white text-xs font-bold h-10 px-6 cursor-pointer"
                            >
                                {processing ? 'Saving...' : editingRecord ? 'Update Record' : 'Save Record'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Transfer Modal */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 max-w-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-woof-charcoal">Transfer Health Records</DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/60">
                            Transfer this puppy's clinical history directly to their new registered owner.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleTransfer} className="space-y-4 pt-2">
                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Select New Owner</Label>
                            <Select value={transferForm.data.user_id} onValueChange={(v) => transferForm.setData('user_id', v)}>
                                <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold">
                                    <SelectValue placeholder="Choose a registered user..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={u.id.toString()} className="text-xs">
                                            {u.name} ({u.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {transferForm.errors.user_id && (
                                <p className="text-xs font-bold text-rose-600 mt-1">{transferForm.errors.user_id}</p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Puppy Name</Label>
                            <Input
                                value={transferForm.data.pet_name}
                                onChange={(e) => transferForm.setData('pet_name', e.target.value)}
                                placeholder="Puppy's official name"
                                className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                required
                            />
                            {transferForm.errors.pet_name && (
                                <p className="text-xs font-bold text-rose-600 mt-1">{transferForm.errors.pet_name}</p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Gender</Label>
                                <Select value={transferForm.data.gender} onValueChange={(v) => transferForm.setData('gender', v)}>
                                    <SelectTrigger className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus:ring-woof-gold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-[#e8ded1] bg-white">
                                        <SelectItem value="male" className="text-xs">Male</SelectItem>
                                        <SelectItem value="female" className="text-xs">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={transferForm.data.date_of_birth}
                                    onChange={(e) => transferForm.setData('date_of_birth', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs text-amber-900 leading-relaxed">
                                Note: This will migrate this puppy's clinical passport to the new owner's account.
                            </p>
                        </div>

                        <DialogFooter className="pt-4 flex gap-3 border-t border-[#e8ded1]">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsTransferOpen(false)}
                                className="rounded-full border-[#e8ded1] bg-[#fcfbf9] text-xs font-bold text-woof-charcoal h-10 px-5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={transferForm.processing}
                                className="rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white text-xs font-bold h-10 px-6 cursor-pointer"
                            >
                                {transferForm.processing ? 'Transferring...' : 'Execute Transfer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 max-w-md shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-rose-700">Delete Record?</DialogTitle>
                        <DialogDescription className="text-xs text-woof-charcoal/70 mt-2">
                            Are you sure you want to delete <span className="font-bold text-woof-charcoal">{selectedForDelete?.title}</span>? This will permanently remove this health entry.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-6 flex gap-3 border-t border-[#e8ded1]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-full border-[#e8ded1] bg-[#fcfbf9] text-xs font-bold text-woof-charcoal h-10 px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-10 px-6 cursor-pointer"
                        >
                            Delete Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
