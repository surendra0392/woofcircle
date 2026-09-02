import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Camera, User, Tag, UploadCloud } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PetCreatePage({ breeds = [], users = [] }: any) {
    const { data, setData, post, errors, processing } = useForm({
        user_id: '',
        name: '',
        breed_id: '',
        gender: 'male',
        date_of_birth: '',
        color: '',
        microchip_number: '',
        profile_image: null as File | null,
        is_champion: false as boolean,
        awards_count: 0,
        notes: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.pets.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Pet registered successfully.');
            },
            onError: () => {
                toast.error('Failed to register pet. Please check form validation errors.');
            }
        });
    };

    return (
        <AdminLayout title="Register Pet">
            <Head title="Register New Pet - Admin" />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.pets.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Register New Pet</h2>
                    <p className="text-xs text-woof-charcoal/60">Create a registered pet entry, assign owner, and attach medical identity</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6" encType="multipart/form-data">
                {/* 1. Basic Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Pet Information</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide the pet's name, breed, gender, date of birth, color, and microchip identifier.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Pet Name *</Label>
                                <Input 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="e.g. Max" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="breed_id" className="text-xs font-bold text-woof-charcoal">Breed *</Label>
                                <select 
                                    id="breed_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.breed_id} 
                                    onChange={e => setData('breed_id', e.target.value)}
                                >
                                    <option value="">Select Breed</option>
                                    {breeds?.map((breed: any) => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </select>
                                {errors.breed_id && <p className="text-xs text-rose-500">{errors.breed_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="gender" className="text-xs font-bold text-woof-charcoal">Gender *</Label>
                                <select 
                                    id="gender" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.gender} 
                                    onChange={e => setData('gender', e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && <p className="text-xs text-rose-500">{errors.gender}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="date_of_birth" className="text-xs font-bold text-woof-charcoal">Date of Birth</Label>
                                <Input 
                                    id="date_of_birth" 
                                    type="date"
                                    value={data.date_of_birth} 
                                    onChange={e => setData('date_of_birth', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.date_of_birth && <p className="text-xs text-rose-500">{errors.date_of_birth}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="color" className="text-xs font-bold text-woof-charcoal">Color</Label>
                                <Input 
                                    id="color" 
                                    value={data.color} 
                                    onChange={e => setData('color', e.target.value)} 
                                    placeholder="e.g. Golden, Fawn" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.color && <p className="text-xs text-rose-500">{errors.color}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="microchip_number" className="text-xs font-bold text-woof-charcoal">Microchip Number</Label>
                                <Input 
                                    id="microchip_number" 
                                    value={data.microchip_number} 
                                    onChange={e => setData('microchip_number', e.target.value)} 
                                    placeholder="e.g. 956000001234567" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 font-mono" 
                                />
                                {errors.microchip_number && <p className="text-xs text-rose-500">{errors.microchip_number}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Ownership Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <User className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Ownership Linkage</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Assign this pet record to a registered user account on the platform.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="user_id" className="text-xs font-bold text-woof-charcoal">Owner User *</Label>
                            <SearchableSelect 
                                options={[
                                    { value: '', label: 'Select Owner...' },
                                    ...(users?.map((u: any) => ({
                                        value: u.id.toString(),
                                        label: `${u.name} (${u.email})`
                                    })) || [])
                                ]}
                                value={data.user_id || ''}
                                onChange={(val) => setData('user_id', val)}
                                placeholder="Search user by name or email..."
                                className="w-full h-10 border-[#e8ded1] rounded-2xl text-xs"
                            />
                            {errors.user_id && <p className="text-xs text-rose-500">{errors.user_id}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Credentials & Remarks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Tag className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Registry & Notes</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Specify if the pet is a champion, the count of awards won, and any administrative notes.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div 
                            onClick={() => setData('is_champion', !data.is_champion)}
                            className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                data.is_champion ? 'border-woof-gold bg-woof-gold/10 shadow-2xs' : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                            }`}
                        >
                            <Checkbox id="is_champion" checked={data.is_champion} onCheckedChange={(c) => setData('is_champion', c as boolean)} className="mt-0.5" />
                            <div>
                                <Label htmlFor="is_champion" className="text-xs font-bold text-woof-charcoal cursor-pointer">Certified Show Champion</Label>
                                <p className="text-[11px] text-woof-charcoal/60 mt-0.5 leading-relaxed">Indicates if this pet holds official show champion certificates or titles.</p>
                            </div>
                        </div>
                        
                        {data.is_champion && (
                            <div className="space-y-1.5 max-w-xs">
                                <Label htmlFor="awards_count" className="text-xs font-bold text-woof-charcoal">Awards Count</Label>
                                <Input 
                                    id="awards_count" 
                                    type="number"
                                    min="0"
                                    value={data.awards_count} 
                                    onChange={e => setData('awards_count', parseInt(e.target.value) || 0)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 w-32" 
                                />
                                {errors.awards_count && <p className="text-xs text-rose-500">{errors.awards_count}</p>}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal">Internal Notes</Label>
                            <Textarea 
                                id="notes" 
                                value={data.notes} 
                                onChange={e => setData('notes', e.target.value)} 
                                placeholder="Add administrative details, show history, or custom health notes..." 
                                className="min-h-20 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 resize-none p-3" 
                            />
                            {errors.notes && <p className="text-xs text-rose-500">{errors.notes}</p>}
                        </div>
                    </div>
                </div>

                {/* 4. Media & Picture */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Camera className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Profile Picture</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload a high-quality display image of the pet.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">Display Photo</Label>
                            {imagePreview ? (
                                <div className="h-48 border border-[#e8ded1] bg-[#fcfbf9] flex items-center justify-center relative overflow-hidden group rounded-2xl shadow-2xs">
                                    <img src={imagePreview} alt="Pet Preview" className="h-full w-full object-contain p-2" />
                                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] text-white font-bold uppercase">Change Photo</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] flex flex-col items-center justify-center text-center relative cursor-pointer rounded-2xl">
                                    <UploadCloud className="h-8 w-8 text-woof-charcoal/40 mb-1" />
                                    <span className="text-xs font-bold text-woof-charcoal">Upload Pet Profile Image</span>
                                    <span className="text-[10px] text-woof-charcoal/50 mt-0.5">JPEG, PNG up to 2MB</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            )}
                            {errors.profile_image && <p className="text-xs text-rose-500">{errors.profile_image}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.pets.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Register Pet
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
