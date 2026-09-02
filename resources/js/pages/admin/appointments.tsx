import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    Calendar,
    Clock,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    Building2,
    Dog
} from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/time';

interface Pet {
    id: number;
    name: string;
    breed?: { name: string };
    user: { name: string; email: string };
}

interface Vet {
    id: number;
    clinic_name: string;
}

interface Appointment {
    id: number;
    pet_id: number;
    appointment_type: string;
    appointment_date: string;
    status: string;
    doctor_name: string | null;
    clinic_name: string | null;
    notes: string | null;
    vet_profile_id: number | null;
    pet: Pet;
    vet_profile?: Vet;
}

interface PageProps {
    appointments: { data: Appointment[]; links: { url: string | null; label: string; active: boolean }[]; total: number };
    filters: { search?: string; status?: string; appointment_type?: string };
    appointmentTypes: string[];
    statuses: string[];
}

export default function AdminAppointments({ appointments, filters, appointmentTypes, statuses }: PageProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        router.get(
            route('admin.appointments.index'),
            { search: formData.get('search') as string, status: filters.status, appointment_type: filters.appointment_type },
            { preserveState: true },
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
        router.get(route('admin.appointments.index'), newFilters, { preserveState: true });
    };

    const handleDelete = () => {
        if (appointmentToDelete) {
            router.delete(route('admin.appointments.destroy', appointmentToDelete.id), {
                onSuccess: () => {
                    toast.success('Appointment deleted successfully.');
                    setIsDeleteDialogOpen(false);
                }
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return (
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-sky-800 uppercase">
                        Scheduled
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                        Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-rose-800 uppercase">
                        Cancelled
                    </span>
                );
            case 'no_show':
                return (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase">
                        No Show
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full border border-[#e8ded1] bg-[#fcfbf9] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-woof-charcoal uppercase">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Appointments">
            <Head title="Admin - Appointments" />
            <div className="mx-auto max-w-full space-y-6">

                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Appointments Schedule</h2>
                            <p className="text-xs text-woof-charcoal/60">
                                Oversee clinical consultations, training sessions, and veterinary appointments
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={route('admin.appointments.create')}
                        className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Book Appointment
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <form onSubmit={handleSearch} className="relative min-w-[240px] flex-1 sm:max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-woof-charcoal/40" />
                        <Input
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Search pet, doctor, or clinic..."
                            className="pl-9 h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                        />
                    </form>

                    <select
                        value={filters.appointment_type || 'all'}
                        onChange={(e) => handleFilterChange('appointment_type', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Service Types</option>
                        {appointmentTypes.map((type) => (
                            <option key={type} value={type}>{type.replace(/_/g, ' ').toUpperCase()}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status || 'all'}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="h-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map((st) => (
                            <option key={st} value={st}>{st.replace(/_/g, ' ').toUpperCase()}</option>
                        ))}
                    </select>

                    {(filters.search || filters.appointment_type || filters.status) && (
                        <Button
                            variant="ghost"
                            onClick={() => router.get(route('admin.appointments.index'))}
                            className="h-10 rounded-full border border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9] px-4"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                        </Button>
                    )}
                </div>

                {/* Content Table */}
                <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Pet Details</th>
                                    <th className="px-6 py-4">Service Type</th>
                                    <th className="px-6 py-4">Schedule Date & Time</th>
                                    <th className="px-6 py-4">Clinician / Partner</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {appointments?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Calendar className="h-8 w-8 text-woof-charcoal/30" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No scheduled appointments found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    appointments?.data?.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shrink-0">
                                                        <Dog className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-woof-charcoal">{appointment.pet?.name}</div>
                                                        <div className="text-[11px] text-woof-charcoal/50">
                                                            {appointment.pet?.breed?.name || 'Pet'} &bull; Owner: {appointment.pet?.user?.name || 'Admin'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal">
                                                    {appointment.appointment_type.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-woof-charcoal/40" />
                                                    {formatDate(appointment.appointment_date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-woof-charcoal flex items-center gap-1">
                                                    <Building2 className="h-3 w-3 text-woof-gold shrink-0" />
                                                    {appointment.vet_profile?.clinic_name || appointment.clinic_name || 'Direct Clinic Visit'}
                                                </div>
                                                <div className="text-[11px] text-woof-charcoal/50">
                                                    {appointment.doctor_name ? `Dr. ${appointment.doctor_name}` : 'Attending Specialist'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(appointment.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={route('admin.appointments.edit', appointment.id)} 
                                                        className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Edit Appointment"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            setAppointmentToDelete(appointment);
                                                            setIsDeleteDialogOpen(true);
                                                        }} 
                                                        className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs" 
                                                        title="Delete Appointment"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {appointments?.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={appointments.links} />
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[400px] p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-rose-600">Cancel / Delete Appointment</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p className="text-xs text-woof-charcoal/70">
                                Are you sure you want to delete appointment for <span className="font-bold text-woof-charcoal">{appointmentToDelete?.pet?.name}</span> on {appointmentToDelete?.appointment_date ? formatDate(appointmentToDelete.appointment_date) : ''}? This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} className="rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
