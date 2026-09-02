import { Head, useForm, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/layouts/admin/admin-layout';
import { ArrowLeft, Save, Info, Briefcase } from 'lucide-react';

export default function PositionEdit({ position }: any) {
    const { data, setData, put, processing, errors } = useForm({
        title: position.title || '',
        department: position.department || 'Engineering',
        location: position.location || 'Remote',
        type: position.type || 'full-time',
        description: position.description || '',
        requirements: position.requirements || '',
        is_active: position.is_active === 1 || position.is_active === true,
        sort_order: position.sort_order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.career-positions.update', position.id), {
            onSuccess: () => {
                toast.success('Career position updated successfully');
            }
        });
    };

    return (
        <AdminLayout title="Edit Career Position">
            <Head title={`Edit Position: ${position.title} - Admin`} />
            <div className="mx-auto max-w-4xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('admin.career-positions.index')}
                        className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Edit Career Position</h2>
                        <p className="text-xs text-woof-charcoal/60">Currently editing: <span className="font-bold text-woof-charcoal">{position.title}</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                    {/* Basic details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                    <Info className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold text-woof-charcoal">Position Details</h3>
                            </div>
                            <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                                Specify role title, department, workplace location type, and job commitment.
                            </p>
                        </div>

                        <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Job Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                        placeholder="e.g. Senior Full-Stack Developer"
                                        required
                                    />
                                    {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="department" className="text-xs font-bold text-woof-charcoal">Department *</Label>
                                    <select
                                        id="department"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                        required
                                    >
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Content">Content</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Growth">Growth</option>
                                    </select>
                                    {errors.department && <p className="text-xs text-rose-500">{errors.department}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="location" className="text-xs font-bold text-woof-charcoal">Location *</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                        placeholder="e.g. Remote / Bangalore"
                                        required
                                    />
                                    {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="type" className="text-xs font-bold text-woof-charcoal">Job Type *</Label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                        required
                                    >
                                        <option value="full-time">Full-Time</option>
                                        <option value="part-time">Part-Time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                    {errors.type && <p className="text-xs text-rose-500">{errors.type}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sort_order" className="text-xs font-bold text-woof-charcoal">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    />
                                    {errors.sort_order && <p className="text-xs text-rose-500">{errors.sort_order}</p>}
                                </div>

                                <div className="flex items-center pt-5">
                                    <div 
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`flex items-center gap-2.5 p-3 border cursor-pointer transition-all rounded-2xl w-full ${
                                            data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                        }`}
                                    >
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', !!checked)}
                                        />
                                        <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">
                                            Active / Accepting Applications
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                    <Briefcase className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold text-woof-charcoal">Role Scope & Criteria</h3>
                            </div>
                            <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                                Write out the job description, core responsibilities, and expected candidate requirements.
                            </p>
                        </div>

                        <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description *</Label>
                                <Textarea
                                    id="description"
                                    rows={6}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    placeholder="Enter detailed job description, responsibilities, culture..."
                                    required
                                />
                                {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="requirements" className="text-xs font-bold text-woof-charcoal">Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    rows={5}
                                    value={data.requirements}
                                    onChange={(e) => setData('requirements', e.target.value)}
                                    className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                    placeholder="Enter job requirements (skills, experience, qualifications...)"
                                />
                                {errors.requirements && <p className="text-xs text-rose-500">{errors.requirements}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                        <Link 
                            href={route('admin.career-positions.index')}
                            className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                            <Save className="h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
