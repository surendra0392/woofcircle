import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Camera, Crown, Dog, Info, Palette, ShieldCheck, Tag, Trophy, Heart, ArrowLeft, Sparkles } from 'lucide-react';
import * as React from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface Breed {
    id: number;
    name: string;
}

interface PageProps {
    breeds: Breed[];
    tier_info?: {
        tier_name: string;
        pet_count: number;
        max_pets: number;
        is_unlimited: boolean;
    };
}

interface PetFormData {
    name: string;
    breed_id: string;
    gender: 'male' | 'female';
    date_of_birth: string;
    color: string;
    microchip_number: string;
    profile_image: File | null;
    notes: string;
    is_champion: boolean;
    awards_count: number;
    [key: string]: any;
}

export default function CreatePet({ breeds, tier_info }: PageProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<PetFormData>({
        name: '',
        breed_id: '',
        gender: 'male',
        date_of_birth: '',
        color: '',
        microchip_number: '',
        profile_image: null,
        notes: '',
        is_champion: false,
        awards_count: 0,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pets.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Pet profile created successfully.');
            }
        });
    };

    return (
        <DashboardLayout
            title="Add New Pet"
            subtitle="Register a new companion and start their medical passport"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Pets', href: '/dashboard/pets' },
                { title: 'Add Pet', href: '/dashboard/pets/create' },
            ]}
            actions={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('pets.index')}
                        className="border border-[#e8ded1] hover:bg-[#fcfbf9] text-woof-charcoal rounded-full font-bold text-xs h-10 px-5 inline-flex items-center justify-center transition-colors shadow-2xs"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        form="pet-create-form"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-10 px-6 transition-all shadow-xs cursor-pointer"
                    >
                        {processing ? 'Saving...' : 'Save Pet Profile'}
                    </Button>
                </div>
            }
        >
            <Head title="Add New Pet" />
            
            <div className="w-full space-y-6 pb-16">
                {tier_info && !tier_info.is_unlimited && (
                    <div className="p-4 rounded-2xl border border-woof-gold/30 bg-woof-cream/60 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <Crown className="h-4 w-4 text-woof-gold shrink-0" />
                            <p className="text-xs text-woof-charcoal font-medium">
                                You are using <span className="font-bold text-woof-charcoal">{tier_info.pet_count} of {tier_info.max_pets}</span> free pet profile slots on the <span className="font-bold text-woof-gold">{tier_info.tier_name}</span> plan.
                            </p>
                        </div>
                        <Link
                            href="/settings/subscription"
                            className="text-[10px] font-black uppercase tracking-wider text-woof-gold hover:underline shrink-0"
                        >
                            Get Unlimited Pets →
                        </Link>
                    </div>
                )}

                <form id="pet-create-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details Section */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Basic Information</h3>
                                <p className="text-xs text-woof-charcoal/60">Essential identity and breed information</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Pet Name <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    placeholder="e.g. Buddy"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs font-bold text-rose-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Breed <span className="text-rose-600">*</span>
                                </Label>
                                <Select value={data.breed_id} onValueChange={(v) => setData('breed_id', v)}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select breed" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {breeds.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.breed_id && (
                                    <p className="text-xs font-bold text-rose-500">{errors.breed_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Gender <span className="text-rose-600">*</span>
                                </Label>
                                <Select value={data.gender} onValueChange={(v: 'male' | 'female') => setData('gender', v)}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-xs font-bold text-rose-500">{errors.gender}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Date of Birth
                                </Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                />
                                {errors.date_of_birth && (
                                    <p className="text-xs font-bold text-rose-500">{errors.date_of_birth}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Extra Details Section */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Palette className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Physical & Pedigree Details</h3>
                                <p className="text-xs text-woof-charcoal/60">Coat color, microchip number, notes and champion status</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="color" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Color</Label>
                                <Input
                                    id="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    placeholder="e.g. Golden Blonde / Black & Tan"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="microchip" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Microchip Number</Label>
                                <Input
                                    id="microchip"
                                    value={data.microchip_number}
                                    onChange={(e) => setData('microchip_number', e.target.value)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    placeholder="e.g. 981023456789"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Notes / Care Remarks</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold min-h-[100px] rounded-2xl p-4 font-medium text-xs text-woof-charcoal"
                                placeholder="Add any special care instructions, temperaments, dietary requirements or health history..."
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 items-center">
                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                        Champion Bloodline
                                    </Label>
                                    <p className="text-xs text-woof-charcoal/50">
                                        Pedigree verified lineage with awards
                                    </p>
                                </div>
                                <Checkbox
                                    checked={data.is_champion}
                                    onCheckedChange={(checked: boolean) => setData('is_champion', checked)}
                                    className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-6 w-6 rounded-md transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="awards_count" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Awards / Titles Count</Label>
                                <Input
                                    id="awards_count"
                                    type="number"
                                    value={data.awards_count}
                                    onChange={(e) => setData('awards_count', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                />
                                {errors.awards_count && (
                                    <p className="text-xs font-bold text-rose-500">{errors.awards_count}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Photo Section */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-woof-charcoal">Profile Photo</h3>
                            <p className="text-xs text-woof-charcoal/60">Upload a clear picture of your companion for their digital passport</p>
                        </div>

                        <div
                            onClick={() => imageInputRef.current?.click()}
                            className="bg-[#fcfbf9] hover:bg-[#f4ebe1]/50 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold relative flex h-48 w-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl transition-all group shadow-2xs"
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} className="h-full w-full object-cover" />
                                    <div className="bg-woof-charcoal/50 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-2xs">
                                        <Camera className="h-7 w-7 text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Dog className="text-woof-gold/40 mb-3 h-10 w-10" />
                                    <span className="text-xs font-bold text-woof-charcoal/70 uppercase tracking-wider">
                                        Upload Image
                                    </span>
                                </>
                            )}
                        </div>
                        <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        <p className="text-xs text-woof-charcoal/50 font-medium">
                            Max size: 2MB. Accepted formats: JPG, PNG, WEBP.
                        </p>
                        {errors.profile_image && (
                            <p className="text-xs font-bold text-rose-500">
                                {errors.profile_image}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
