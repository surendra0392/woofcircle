import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, CheckCircle2, Dog, FileText, Image as ImageIcon, IndianRupee, MapPin, Plus, Save, Trophy, Upload, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface Profile {
    id: number;
    name: string;
    type: string;
    label: string;
}

interface StudServiceImage {
    id: number;
    image_url: string;
}

interface StudService {
    id?: number;
    title: string;
    stud_dog_name: string;
    description: string;
    breed_id: string | number;
    state_id: string | number;
    city_id: string | number;
    fee: string | number | null;
    age: string;
    is_negotiable: boolean;
    is_vaccinated: boolean;
    is_available: boolean;
    is_approved: boolean;
    is_champion: boolean;
    awards_count: number;
    kci_registered: boolean;
    sire_name: string;
    dam_name: string;
    profile_id: number | null;
    profile_type: string | null;
    featured_image_url?: string;
    images?: StudServiceImage[];
}

interface Props {
    studService?: StudService;
    breeds: {
        id: number;
        name: string;
    }[];
    states: {
        id: number;
        name: string;
    }[];
    cities: {
        id: number;
        name: string;
        state_id: number;
    }[];
    profiles: Profile[];
}

export default function StudServiceForm({ studService, breeds, states, cities, profiles }: Props) {
    const isEditing = !!studService;
    const { data, setData, post, processing, errors } = useForm({
        _method: isEditing ? 'POST' : 'POST',
        title: studService?.title || '',
        stud_dog_name: studService?.stud_dog_name || '',
        description: studService?.description || '',
        breed_id: studService?.breed_id || '',
        state_id: studService?.state_id || '',
        city_id: studService?.city_id || '',
        fee: studService?.fee || '',
        age: studService?.age || '',
        is_negotiable: studService?.is_negotiable ?? false,
        is_vaccinated: studService?.is_vaccinated ?? true,
        is_available: studService?.is_available ?? true,
        is_champion: studService?.is_champion ?? false,
        awards_count: studService?.awards_count ?? 0,
        kci_registered: studService?.kci_registered ?? false,
        sire_name: studService?.sire_name || '',
        dam_name: studService?.dam_name || '',
        profile_id: studService?.profile_id || null,
        profile_type: studService?.profile_type || null,
        featured_image: null as File | null,
        images: [] as File[],
    });

    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [featuredPreview, setFeaturedPreview] = React.useState<string | null>(studService?.featured_image_url || null);

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Stud Services',
            href: '/dashboard/stud-services',
        },
        {
            title: isEditing ? 'Edit Stud Service' : 'Add Stud Dog',
            href: '#',
        },
    ];

    const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFeaturedPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('images', [...data.images, ...files]);
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImagePreview = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            post(route('dashboard.stud-services.update', studService.id), {
                onSuccess: () => {
                    toast.success('Stud service listing updated successfully.');
                },
                onError: () => {
                    toast.error('Failed to save listing. Please review the form.');
                }
            });
        } else {
            post(route('dashboard.stud-services.store'), {
                onSuccess: () => {
                    toast.success('Stud service listing published successfully.');
                },
                onError: () => {
                    toast.error('Failed to publish listing. Please review the form.');
                }
            });
        }
    };

    const filteredCities = cities.filter((city) => city.state_id === Number(data.state_id));

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title={isEditing ? 'Edit Stud Service' : 'List Stud Dog'}
            subtitle={isEditing ? 'Update stud dog details and breeding terms' : 'Showcase your pedigree male for breeding services'}
            actions={
                <div className="flex items-center gap-3">
                    <Link href={route('dashboard.stud-services.index')}>
                        <Button
                            variant="outline"
                            className="border-[#e8ded1] hover:bg-[#fcfbf9] text-woof-charcoal rounded-full font-bold text-xs h-10 px-5 transition-all shadow-2xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        form="stud-service-form"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-10 px-6 transition-all shadow-xs cursor-pointer"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Saving...
                            </div>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? 'Update Listing' : 'Publish Stud Dog'}
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <Head title={isEditing ? `Edit ${studService.title}` : 'Add Stud Dog'} />
            <div className="pb-16 max-w-4xl mx-auto space-y-6">
                <form id="stud-service-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Section: Stud Dog Identity */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Dog className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Stud Dog Profile</h3>
                                <p className="text-xs text-woof-charcoal/60">Registered name, breed and lineage</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="stud_dog_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    Dog's Registered Name <span className="text-rose-600">*</span>
                                </Label>
                                <Input
                                    id="stud_dog_name"
                                    value={data.stud_dog_name}
                                    onChange={(e) => setData('stud_dog_name', e.target.value)}
                                    placeholder="e.g. Thor of Von Haulin Line"
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    required
                                />
                                {errors.stud_dog_name && <p className="text-xs font-bold text-rose-500">{errors.stud_dog_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Breed <span className="text-rose-600">*</span></Label>
                                <Select value={data.breed_id.toString()} onValueChange={(v) => setData('breed_id', v)}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select Breed" />
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
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Age</Label>
                                <Input
                                    value={data.age}
                                    onChange={(e) => setData('age', e.target.value)}
                                    placeholder="e.g. 2.5 Years"
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                />
                                {errors.age && <p className="text-xs font-bold text-rose-500">{errors.age}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="sire_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Sire Name</Label>
                                    <Input
                                        id="sire_name"
                                        value={data.sire_name}
                                        onChange={(e) => setData('sire_name', e.target.value)}
                                        placeholder="Father"
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dam_name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Dam Name</Label>
                                    <Input
                                        id="dam_name"
                                        value={data.dam_name}
                                        onChange={(e) => setData('dam_name', e.target.value)}
                                        placeholder="Mother"
                                        className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Vaccinated</Label>
                                    <p className="text-[10px] text-woof-charcoal/50">Up to date</p>
                                </div>
                                <Checkbox
                                    checked={data.is_vaccinated}
                                    onCheckedChange={(checked: boolean) => setData('is_vaccinated', checked)}
                                    className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-6 w-6 rounded-md"
                                />
                            </div>

                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Club Registered</Label>
                                    <p className="text-[10px] text-woof-charcoal/50">KCI / Official Kennel</p>
                                </div>
                                <Checkbox
                                    checked={data.kci_registered}
                                    onCheckedChange={(checked: boolean) => setData('kci_registered', checked)}
                                    className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-6 w-6 rounded-md"
                                />
                            </div>

                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Champion</Label>
                                    <p className="text-[10px] text-woof-charcoal/50">Show winner</p>
                                </div>
                                <Checkbox
                                    checked={data.is_champion}
                                    onCheckedChange={(checked: boolean) => {
                                        setData((prev) => ({
                                            ...prev,
                                            is_champion: checked,
                                            awards_count: checked ? prev.awards_count : 0,
                                        }));
                                    }}
                                    className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-6 w-6 rounded-md"
                                />
                            </div>
                        </div>

                        {data.is_champion && (
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-2">
                                    <Trophy className="text-woof-gold h-4 w-4" /> Awards & Titles Count
                                </Label>
                                <Input
                                    type="number"
                                    value={data.awards_count}
                                    onChange={(e) => setData('awards_count', parseInt(e.target.value) || 0)}
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                />
                            </div>
                        )}
                    </div>

                    {/* Section: Listing Details & Description */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Listing Content</h3>
                                <p className="text-xs text-woof-charcoal/60">Heading and breeding terms</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Listing Title <span className="text-rose-600">*</span></Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Proven Champion German Shepherd Available for Stud"
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                    required
                                />
                                {errors.title && <p className="text-xs font-bold text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Description & Breeding Terms</Label>
                                <div className="rounded-2xl border border-[#e8ded1] overflow-hidden">
                                    <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                                </div>
                                {errors.description && (
                                    <p className="text-xs font-bold text-rose-500">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Location & Fee */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Location & Stud Fee</h3>
                                <p className="text-xs text-woof-charcoal/60">Geographic availability and fee requirements</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">State <span className="text-rose-600">*</span></Label>
                                <Select
                                    value={data.state_id.toString()}
                                    onValueChange={(v) => {
                                        setData({ ...data, state_id: v, city_id: '' });
                                    }}
                                >
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {states.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.state_id && (
                                    <p className="text-xs font-bold text-rose-500">{errors.state_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">City <span className="text-rose-600">*</span></Label>
                                <Select value={data.city_id.toString()} onValueChange={(v) => setData('city_id', v)} disabled={!data.state_id}>
                                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal disabled:opacity-50">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                        {filteredCities.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.city_id && (
                                    <p className="text-xs font-bold text-rose-500">{errors.city_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid items-center gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-1.5">
                                    <IndianRupee className="h-3.5 w-3.5 text-woof-gold" /> Stud Service Fee
                                </Label>
                                <Input
                                    type="number"
                                    value={data.fee}
                                    onChange={(e) => setData('fee', e.target.value)}
                                    placeholder="e.g. 15000"
                                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                                />
                                {errors.fee && <p className="text-xs font-bold text-rose-500">{errors.fee}</p>}
                            </div>

                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Fee / Pick-of-Litter Negotiable</Label>
                                    <p className="text-xs text-woof-charcoal/50">Open to terms negotiation</p>
                                </div>
                                <Checkbox
                                    checked={data.is_negotiable}
                                    onCheckedChange={(checked: boolean) => setData('is_negotiable', checked)}
                                    className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-6 w-6 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Photos */}
                    <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                                <Camera className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-woof-charcoal">Photos & Progeny Proof</h3>
                                <p className="text-xs text-woof-charcoal/60">Upload clear pictures of the stud dog and past litters</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Primary Photo</Label>
                                <div className="border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] hover:bg-[#f4ebe1]/30 hover:border-woof-gold group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-10 transition-all">
                                    {featuredPreview ? (
                                        <div className="relative h-48 w-full max-w-sm rounded-2xl overflow-hidden">
                                            <img src={featuredPreview} className="h-full w-full object-cover" />
                                            <div className="bg-woof-charcoal/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-2xs">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="text-woof-charcoal hover:bg-woof-gold h-9 rounded-full bg-white px-5 text-xs font-bold shadow-xs hover:text-white"
                                                    onClick={() => setFeaturedPreview(null)}
                                                >
                                                    Change Photo
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-[#e8ded1] flex items-center justify-center mb-3 text-woof-gold">
                                                <Upload className="h-6 w-6 text-woof-gold" />
                                            </div>
                                            <p className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Upload Main Photo</p>
                                            <p className="text-xs text-woof-charcoal/40 mt-1">
                                                Max size: 2MB (JPG, PNG, WEBP)
                                            </p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                        onChange={handleFeaturedChange}
                                        accept="image/*"
                                    />
                                </div>
                                {errors.featured_image && (
                                    <p className="text-xs font-bold text-rose-500">{errors.featured_image}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Additional Photos & Lineage Proof</Label>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                                    {imagePreviews.map((preview, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e8ded1] shadow-2xs"
                                        >
                                            <img src={preview} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImagePreview(idx)}
                                                className="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white opacity-0 transition-all group-hover:opacity-100 hover:scale-110 shadow-xs"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {isEditing &&
                                        studService?.images?.map((img) => (
                                            <div
                                                key={`existing-${img.id}`}
                                                className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e8ded1] shadow-2xs"
                                            >
                                                <img
                                                    src={img.image_url}
                                                    className="h-full w-full object-cover"
                                                />
                                                <Link
                                                    href={route('dashboard.stud-services.image.destroy', img.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white opacity-0 transition-all group-hover:opacity-100 hover:scale-110 shadow-xs"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        ))}
                                    <div className="border-2 border-dashed border-[#e8ded1] bg-[#fcfbf9] hover:bg-[#f4ebe1]/30 hover:border-woof-gold group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl transition-all">
                                        <Plus className="text-woof-gold h-6 w-6" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/60 mt-1">Add More</span>
                                        <input
                                            type="file"
                                            multiple
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                            onChange={handleImagesChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
