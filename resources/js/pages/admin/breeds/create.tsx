import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Info, BookOpen, Heart, Ruler, Image, UploadCloud } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CreateBreed({ groups = [] }: { groups?: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        history: '',
        other_names: '',
        naming: '',
        variants: '',
        appearance: '',
        health: '',
        temperament: '',
        behavior: '',
        intelligence: '',
        use: '',
        origin: '',
        life_span: '',
        male_height: '',
        female_height: '',
        male_weight: '',
        female_weight: '',
        size: 'medium',
        breed_group: '',
        coat_type: '',
        colors: '',
        energy_level: '',
        is_active: true as boolean,
        is_indian: false as boolean,
        image_file: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.breeds.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Add Breed">
            <Head title="Add Breed" />
            
            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.breeds.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Add Breed</h2>
                    <p className="text-xs text-woof-charcoal/60">Configure standardized canine profile and breed details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* 1. Basic Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Basic Information</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Provide the breed's registry names, optional slug URL configurations, and geographical origins.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. German Shepherd"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="slug" className="text-xs font-bold text-woof-charcoal">Slug (Optional)</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. german-shepherd"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.slug && <p className="text-xs text-rose-500">{errors.slug}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="other_names" className="text-xs font-bold text-woof-charcoal">Other Names</Label>
                                <Input
                                    id="other_names"
                                    value={data.other_names}
                                    onChange={(e) => setData('other_names', e.target.value)}
                                    placeholder="e.g. Alsatian, Deutscher Schäferhund"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.other_names && <p className="text-xs text-rose-500">{errors.other_names}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="breed_group" className="text-xs font-bold text-woof-charcoal">Breed Group</Label>
                                <Select value={data.breed_group} onValueChange={(v) => setData('breed_group', v === 'none' ? '' : v)}>
                                    <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal">
                                        <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-[#e8ded1]">
                                        <SelectItem value="none">None</SelectItem>
                                        {groups.map((g) => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.breed_group && <p className="text-xs text-rose-500">{errors.breed_group}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="origin" className="text-xs font-bold text-woof-charcoal">Origin</Label>
                                <Input
                                    id="origin"
                                    value={data.origin}
                                    onChange={(e) => setData('origin', e.target.value)}
                                    placeholder="e.g. Germany"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.origin && <p className="text-xs text-rose-500">{errors.origin}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="life_span" className="text-xs font-bold text-woof-charcoal">Life Span</Label>
                                <Input
                                    id="life_span"
                                    value={data.life_span}
                                    onChange={(e) => setData('life_span', e.target.value)}
                                    placeholder="e.g. 10 - 13 years"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.life_span && <p className="text-xs text-rose-500">{errors.life_span}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Detailed Descriptions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Descriptions</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Write descriptive narratives regarding the breed's historical timeline, temperament, and appearance standards.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Description</Label>
                            <RichTextEditor
                                value={data.description}
                                onChange={(val: string) => setData('description', val)}
                            />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                        
                        <div className="space-y-1.5">
                            <Label htmlFor="history" className="text-xs font-bold text-woof-charcoal">History</Label>
                            <RichTextEditor 
                                value={data.history || ""} 
                                onChange={(val: string) => setData("history", val)} 
                            />
                            {errors.history && <p className="text-xs text-rose-500">{errors.history}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="appearance" className="text-xs font-bold text-woof-charcoal">Appearance</Label>
                                <RichTextEditor 
                                    value={data.appearance || ""} 
                                    onChange={(val: string) => setData("appearance", val)} 
                                />
                                {errors.appearance && <p className="text-xs text-rose-500">{errors.appearance}</p>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="temperament" className="text-xs font-bold text-woof-charcoal">Temperament</Label>
                                <RichTextEditor 
                                    value={data.temperament || ""} 
                                    onChange={(val: string) => setData("temperament", val)} 
                                />
                                {errors.temperament && <p className="text-xs text-rose-500">{errors.temperament}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="use" className="text-xs font-bold text-woof-charcoal">Use</Label>
                            <Input
                                id="use"
                                value={data.use}
                                onChange={(e) => setData('use', e.target.value)}
                                placeholder="e.g. Herding, Guard dog, Police/Military work"
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                            />
                            {errors.use && <p className="text-xs text-rose-500">{errors.use}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Characteristics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Heart className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Characteristics</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Specify classification indicators including general sizes, energy indexes, and coat variants.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="size" className="text-xs font-bold text-woof-charcoal">Size *</Label>
                                <Select value={data.size} onValueChange={(v) => setData('size', v)}>
                                    <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal">
                                        <SelectValue placeholder="Select Size" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-[#e8ded1]">
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                        <SelectItem value="giant">Giant</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.size && <p className="text-xs text-rose-500">{errors.size}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="energy_level" className="text-xs font-bold text-woof-charcoal">Energy Level</Label>
                                <Input
                                    id="energy_level"
                                    value={data.energy_level}
                                    onChange={(e) => setData('energy_level', e.target.value)}
                                    placeholder="e.g. High, Medium, Low"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.energy_level && <p className="text-xs text-rose-500">{errors.energy_level}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="coat_type" className="text-xs font-bold text-woof-charcoal">Coat Type</Label>
                                <Input
                                    id="coat_type"
                                    value={data.coat_type}
                                    onChange={(e) => setData('coat_type', e.target.value)}
                                    placeholder="e.g. Double coat, short, long"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.coat_type && <p className="text-xs text-rose-500">{errors.coat_type}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="colors" className="text-xs font-bold text-woof-charcoal">Colors</Label>
                                <Input
                                    id="colors"
                                    value={data.colors}
                                    onChange={(e) => setData('colors', e.target.value)}
                                    placeholder="e.g. Black & Tan, Sable, Solid Black"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.colors && <p className="text-xs text-rose-500">{errors.colors}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Dimensions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Ruler className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Dimensions</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Set physical registry profiles such as average height ranges and weight constraints for males and females.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="male_height" className="text-xs font-bold text-woof-charcoal">Male Height</Label>
                                <Input
                                    id="male_height"
                                    value={data.male_height}
                                    onChange={(e) => setData('male_height', e.target.value)}
                                    placeholder="e.g. 60 - 65 cm"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.male_height && <p className="text-xs text-rose-500">{errors.male_height}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="female_height" className="text-xs font-bold text-woof-charcoal">Female Height</Label>
                                <Input
                                    id="female_height"
                                    value={data.female_height}
                                    onChange={(e) => setData('female_height', e.target.value)}
                                    placeholder="e.g. 55 - 60 cm"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.female_height && <p className="text-xs text-rose-500">{errors.female_height}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="male_weight" className="text-xs font-bold text-woof-charcoal">Male Weight</Label>
                                <Input
                                    id="male_weight"
                                    value={data.male_weight}
                                    onChange={(e) => setData('male_weight', e.target.value)}
                                    placeholder="e.g. 30 - 40 kg"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.male_weight && <p className="text-xs text-rose-500">{errors.male_weight}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="female_weight" className="text-xs font-bold text-woof-charcoal">Female Weight</Label>
                                <Input
                                    id="female_weight"
                                    value={data.female_weight}
                                    onChange={(e) => setData('female_weight', e.target.value)}
                                    placeholder="e.g. 22 - 32 kg"
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {errors.female_weight && <p className="text-xs text-rose-500">{errors.female_weight}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Media & Settings Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Image className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Media & Settings</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload high-quality images and toggle Indian breed flags or platform visibility status.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        {/* Dropzone Breed Image */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">Breed Image (Optional)</Label>
                            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                {imagePreview ? (
                                    <div className="h-28 w-28 border border-[#e8ded1] rounded-2xl bg-[#fcfbf9] flex items-center justify-center relative overflow-hidden group shadow-2xs">
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] text-white font-bold uppercase">Change</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-5 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                        <UploadCloud className="h-6 w-6 text-woof-charcoal/40 mb-1.5" />
                                        <span className="text-xs font-bold text-woof-charcoal">Click to upload breed photo</span>
                                        <span className="text-[10px] text-woof-charcoal/50 mt-0.5 font-medium">PNG, JPG or WEBP up to 5MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.image_file && <p className="text-xs text-rose-500">{errors.image_file}</p>}
                        </div>

                        {/* Toggle Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div 
                                onClick={() => setData('is_indian', !data.is_indian)}
                                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_indian 
                                        ? 'border-woof-gold bg-woof-gold/10 shadow-2xs' 
                                        : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox
                                    id="is_indian"
                                    checked={data.is_indian}
                                    onCheckedChange={(checked) => setData('is_indian', checked as boolean)}
                                    className="mt-0.5"
                                />
                                <div>
                                    <Label htmlFor="is_indian" className="text-xs font-bold text-woof-charcoal cursor-pointer">
                                        Indian Breed
                                    </Label>
                                    <p className="text-[11px] text-woof-charcoal/60 mt-0.5 leading-relaxed">
                                        Indicates if this breed is native to the Indian subcontinent.
                                    </p>
                                </div>
                            </div>

                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all duration-200 rounded-2xl ${
                                    data.is_active 
                                        ? 'border-emerald-200 bg-emerald-50 shadow-2xs' 
                                        : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-[#deb893]'
                                }`}
                            >
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    className="mt-0.5"
                                />
                                <div>
                                    <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">
                                        Active & Published
                                    </Label>
                                    <p className="text-[11px] text-woof-charcoal/60 mt-0.5 leading-relaxed">
                                        Visible to general users and available throughout the platform.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex justify-end pt-6 border-t border-[#e8ded1] gap-3">
                    <Link 
                        href={route('admin.breeds.index')} 
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-7 text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Breed'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
