import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Building2, Calendar, FileText } from 'lucide-react';

export default function VaccinationEditPage({ vaccination, pets = [], vets = [] }: any) {
    const { data, setData, post, errors, processing, transform } = useForm({
        pet_id: vaccination.pet_id?.toString() || '',
        vaccine_name: vaccination.vaccine_name || '',
        vaccination_date: vaccination.vaccination_date || '',
        next_due_date: vaccination.next_due_date || '',
        vet_id: vaccination.vet_id ? vaccination.vet_id.toString() : (vaccination.vet_name ? 'other' : ''),
        vet_name: vaccination.vet_name || '',
        notes: vaccination.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Transform vet_id if other is selected
        transform((data) => ({
            ...data,
            vet_id: data.vet_id === 'other' ? '' : data.vet_id
        }));

        post(route('admin.vaccinations.update', vaccination.id), {
            onSuccess: () => {
                toast.success('Vaccination record updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update vaccination. Please check form validation errors.');
            }
        });
    };

    return (
        <AdminLayout title="Edit Vaccination Record">
            <Head title={`Edit Vaccination - ${vaccination.vaccine_name}`} />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.vaccinations.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Vaccination: {vaccination.vaccine_name}</h2>
                    <p className="text-xs text-woof-charcoal/60">Update administered date, provider clinic, and next booster timeline</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* 1. Pet Selection Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Pet Selection</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Select the target pet that received this immunization from the registry.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="pet_id" className="text-xs font-bold text-woof-charcoal">Target Pet *</Label>
                            <SearchableSelect 
                                options={[
                                    { value: '', label: 'Select Target Pet...' },
                                    ...(pets?.map((p: any) => ({
                                        value: p.id.toString(),
                                        label: `${p.name} (${p.breed?.name || 'Unknown Breed'}) - ${p.user?.name || 'No Owner'}`
                                    })) || [])
                                ]}
                                value={data.pet_id || ''}
                                onChange={(val) => setData('pet_id', val)}
                                placeholder="Search pet by name or breed..."
                                className="w-full h-10 border-[#e8ded1] bg-[#fcfbf9] rounded-2xl text-xs font-medium"
                            />
                            {errors.pet_id && <p className="text-xs text-rose-500">{errors.pet_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Vaccine details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Vaccine & Timing</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide the vaccine label, date administered, and the optional booster next due date.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="vaccine_name" className="text-xs font-bold text-woof-charcoal">Vaccine Name *</Label>
                            <Input 
                                id="vaccine_name" 
                                value={data.vaccine_name} 
                                onChange={e => setData('vaccine_name', e.target.value)} 
                                placeholder="e.g. DHPP, Rabies, Parvo" 
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.vaccine_name && <p className="text-xs text-rose-500">{errors.vaccine_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="vaccination_date" className="text-xs font-bold text-woof-charcoal">Date Administered *</Label>
                                <Input 
                                    id="vaccination_date" 
                                    type="date"
                                    value={data.vaccination_date} 
                                    onChange={e => setData('vaccination_date', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.vaccination_date && <p className="text-xs text-rose-500">{errors.vaccination_date}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="next_due_date" className="text-xs font-bold text-woof-charcoal">Booster Due Date</Label>
                                <Input 
                                    id="next_due_date" 
                                    type="date"
                                    value={data.next_due_date} 
                                    onChange={e => setData('next_due_date', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.next_due_date && <p className="text-xs text-rose-500">{errors.next_due_date}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Provider details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Provider Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Link to a clinic partner profile or enter the clinic details manually.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="vet_id" className="text-xs font-bold text-woof-charcoal">Registered Clinic</Label>
                            <select 
                                id="vet_id" 
                                className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                value={data.vet_id} 
                                onChange={e => setData('vet_id', e.target.value)}
                            >
                                <option value="">Select Clinic...</option>
                                <option value="other">Manual Entry / Other</option>
                                {vets?.map((v: any) => (
                                    <option key={v.id} value={v.id.toString()}>{v.clinic_name}</option>
                                ))}
                            </select>
                            {errors.vet_id && <p className="text-xs text-rose-500">{errors.vet_id}</p>}
                        </div>

                        {data.vet_id === 'other' && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label htmlFor="vet_name" className="text-xs font-bold text-woof-charcoal">Manual Provider Name</Label>
                                <Input 
                                    id="vet_name" 
                                    value={data.vet_name} 
                                    onChange={e => setData('vet_name', e.target.value)} 
                                    placeholder="Enter clinic or doctor name..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.vet_name && <p className="text-xs text-rose-500">{errors.vet_name}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Notes Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <FileText className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Remarks</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Add clinical health remarks, side-effects, or future medication logs.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal">Internal Remarks</Label>
                            <Textarea 
                                id="notes" 
                                value={data.notes} 
                                onChange={e => setData('notes', e.target.value)} 
                                placeholder="Add medication logs, comments, or follow-up details..." 
                                className="min-h-24 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                            />
                            {errors.notes && <p className="text-xs text-rose-500">{errors.notes}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.vaccinations.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Update Record
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
