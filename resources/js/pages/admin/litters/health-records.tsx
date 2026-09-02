import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    ChevronLeft,
    ClipboardList,
    Clock,
    Dog,
    Pencil,
    FileText,
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

interface User {
    id: number;
    name: string;
    email: string;
}

interface Litter {
    id: number;
    title: string;
    breed: Breed;
    user: User;
    featured_image_path: string | null;
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

interface PageProps {
    litter: Litter;
    records: PuppyHealthRecord[];
    recordTypes: string[];
    users: User[];
}

export default function AdminLitterHealthRecords({ litter, records, recordTypes, users }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PuppyHealthRecord | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<PuppyHealthRecord | null>(null);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    const { data, setData, processing, errors, reset, clearErrors } = useForm({
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
            administered_date: record.administered_date ? record.administered_date.split('T')[0] : '',
            next_due_date: record.next_due_date ? record.next_due_date.split('T')[0] : '',
            vet_name: record.vet_name || '',
            notes: record.notes || '',
        });
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRecord) {
            router.put(route('admin.litters.health-records.update', [litter.id, editingRecord.id]), data, {
                onSuccess: () => { 
                    toast.success('Health record updated successfully'); 
                    setIsFormOpen(false); 
                },
            });
        } else {
            router.post(route('admin.litters.health-records.store', litter.id), data, {
                onSuccess: () => { 
                    toast.success('Health record created successfully'); 
                    setIsFormOpen(false); 
                    reset(); 
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedForDelete) {
            router.delete(route('admin.litters.health-records.destroy', [litter.id, selectedForDelete.id]), {
                onSuccess: () => { 
                    toast.success('Health record deleted successfully'); 
                    setIsDeleteDialogOpen(false); 
                },
            });
        }
    };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.litters.transfer', litter.id), transferForm.data as any, {
            onSuccess: () => { 
                toast.success('Litter successfully transferred to pet dashboard');
                setIsTransferOpen(false);
                transferForm.reset();
            },
        });
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

    const getRecordColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'vaccination':
                return 'bg-amber-50 text-amber-800 border-amber-200';
            case 'deworming':
                return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'health_check':
                return 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            <Head title={`${litter.title} - Health Records (Admin)`} />

            <div className="space-y-6 pb-20">
                {/* Back Button & Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.get(route('admin.litters.index'))}
                        className="h-10 w-10 rounded-full border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all shadow-2xs cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Litter Health Management</h2>
                        <p className="text-xs text-woof-charcoal/60">Clinical history, vaccinations, and pet transfers for {litter.title}</p>
                    </div>
                </div>

                {/* Hero Header Card */}
                <div className="relative overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-5">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] shadow-2xs">
                                {litter.featured_image_path ? (
                                    <img
                                        src={`/storage/${litter.featured_image_path}`}
                                        alt={litter.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-woof-gold">
                                        <Dog className="h-8 w-8" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                        Clinical History
                                    </span>
                                    <span className="text-xs text-woof-charcoal/60">
                                        Owned by: <span className="font-bold text-woof-charcoal">{litter.user.name}</span>
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-woof-charcoal tracking-tight">{litter.title}</h2>

                                <p className="text-xs text-woof-charcoal/60 mt-0.5">
                                    {litter.breed.name} <span className="mx-1.5 opacity-40">|</span> {records.length} Health Logs
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            <Button
                                onClick={() => setIsTransferOpen(true)}
                                className="h-10 rounded-full bg-woof-gold hover:bg-woof-gold/90 px-5 text-xs font-bold text-white transition-all shadow-xs flex items-center gap-2"
                            >
                                <Send className="h-3.5 w-3.5" /> Transfer to Pet
                            </Button>

                            <Button
                                onClick={openAddDialog}
                                className="h-10 rounded-full bg-woof-charcoal hover:bg-woof-forest px-5 text-xs font-bold text-white transition-all shadow-xs flex items-center gap-2"
                            >
                                <Plus className="h-3.5 w-3.5" /> New Record
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Records List */}
                <div className="grid gap-4">
                    {records.length === 0 ? (
                        <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#e8ded1] bg-white p-16 text-center shadow-xs">
                            <ClipboardList className="mb-3 h-10 w-10 text-woof-charcoal/30" />
                            <h3 className="text-base font-bold text-woof-charcoal">No clinical records found</h3>
                            <p className="mt-1 text-xs text-woof-charcoal/60">
                                Start building the health history for this litter.
                            </p>
                        </div>
                    ) : (
                        records.map((record) => (
                            <div
                                key={record.id}
                                className="rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs transition-all hover:border-[#deb893]"
                            >
                                <div className="flex flex-col items-start gap-5 sm:flex-row">
                                    <div
                                        className={`h-11 w-11 rounded-2xl border ${getRecordColor(
                                            record.record_type,
                                        )} flex shrink-0 items-center justify-center shadow-2xs`}
                                    >
                                        {getRecordIcon(record.record_type)}
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                            <div>
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span
                                                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRecordColor(
                                                            record.record_type,
                                                        )}`}
                                                    >
                                                        {record.record_type}
                                                    </span>

                                                    <span className="flex items-center gap-1 text-xs text-woof-charcoal/60">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(record.administered_date).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-woof-charcoal">{record.title}</h3>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => openEditDialog(record)}
                                                    className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedForDelete(record);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                    className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <p className="text-xs leading-relaxed text-woof-charcoal/70">
                                                    {record.description || 'No detailed description.'}
                                                </p>

                                                {record.vet_name && (
                                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-3 py-1 text-xs text-woof-charcoal/80">
                                                        <Stethoscope className="h-3.5 w-3.5 text-woof-gold" />
                                                        <span>Dr. {record.vet_name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 text-xs">
                                                <div>
                                                    <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                                        <Clock className="h-3 w-3" /> Next Due
                                                    </div>
                                                    <p className="font-bold text-woof-charcoal">
                                                        {record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>

                                                {record.notes && (
                                                    <div className="border-t border-[#e8ded1] pt-2">
                                                        <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                                            <FileText className="h-3 w-3" /> Notes
                                                        </div>
                                                        <p className="text-xs text-woof-charcoal/70">{record.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Form Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-xl rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">
                                {editingRecord ? 'Update Clinical Record' : 'New Health Record'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Manual health data entry for this marketplace litter.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">Type</Label>
                                    <Select value={data.record_type} onValueChange={(v) => setData('record_type', v)}>
                                        <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[#e8ded1]">
                                            {recordTypes.map((t) => (
                                                <SelectItem key={t} value={t} className="capitalize">
                                                    {t.replace('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">Date</Label>
                                    <Input
                                        type="date"
                                        value={data.administered_date}
                                        onChange={(e) => setData('administered_date', e.target.value)}
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                    {errors.administered_date && (
                                        <p className="text-xs text-rose-500">{errors.administered_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Record Title</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Parvovirus Vaccination"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">Next Due Date</Label>
                                    <Input
                                        type="date"
                                        value={data.next_due_date}
                                        onChange={(e) => setData('next_due_date', e.target.value)}
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">Veterinarian</Label>
                                    <Input
                                        value={data.vet_name}
                                        onChange={(e) => setData('vet_name', e.target.value)}
                                        placeholder="Dr. Name"
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Description</Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="min-h-[80px] rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 resize-none p-3"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsFormOpen(false)}
                                    className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-forest rounded-full text-xs font-bold text-white shadow-xs"
                                >
                                    {editingRecord ? 'Update Record' : 'Save Record'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Transfer Dialog */}
                <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                    <DialogContent className="max-w-lg rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal flex items-center gap-2">
                                <Send className="h-5 w-5 text-woof-gold" /> System Pet Transfer
                            </DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                This will migrate all health records to a personal pet profile for the selected user.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleTransfer} className="space-y-4 pt-2">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">Target Owner (User)</Label>
                                    <Select value={transferForm.data.user_id} onValueChange={(v) => transferForm.setData('user_id', v)}>
                                        <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal">
                                            <SelectValue placeholder="Choose recipient..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[#e8ded1]">
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={u.id.toString()}>
                                                    {u.name} ({u.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {transferForm.errors.user_id && (
                                        <p className="text-xs text-rose-500">{transferForm.errors.user_id}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">Assigned Pet Name</Label>
                                    <Input
                                        value={transferForm.data.pet_name}
                                        onChange={(e) => transferForm.setData('pet_name', e.target.value)}
                                        placeholder="Puppy's New Name"
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                    {transferForm.errors.pet_name && (
                                        <p className="text-xs text-rose-500">{transferForm.errors.pet_name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-woof-charcoal">Gender</Label>
                                        <Select value={transferForm.data.gender} onValueChange={(v) => transferForm.setData('gender', v)}>
                                            <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[#e8ded1]">
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-woof-charcoal">Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={transferForm.data.date_of_birth}
                                            onChange={(e) => transferForm.setData('date_of_birth', e.target.value)}
                                            className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-3 text-center">
                                <p className="text-[11px] text-woof-charcoal/70">
                                    Action is permanent. Records will be converted to Pet Vaccinations & Medical Records.
                                </p>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsTransferOpen(false)}
                                    className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={transferForm.processing}
                                    className="bg-woof-gold hover:bg-woof-gold/90 text-white rounded-full text-xs font-bold shadow-xs px-6"
                                >
                                    Execute Transfer
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="max-w-md rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Delete Record?</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                This will permanently remove this health entry from the litter's registry.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs px-6"
                            >
                                Delete Permanently
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
