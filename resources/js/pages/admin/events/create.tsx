import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LazyRichTextEditor as RichTextEditor } from '@/components/ui/RichTextEditorLazy';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Calendar, Globe, Image as ImageIcon, MapPin, Sparkles, UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface State {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface EventType {
    id: number;
    name: string;
    slug: string;
}

interface PageProps {
    eventTypes: EventType[];
    states: State[];
    cities: City[];
}

export default function EventCreatePage({ eventTypes = [], states = [], cities = [] }: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        title: '',
        description: '',
        event_type_id: '',
        start_date: '',
        end_date: '',
        start_time: '',
        state_id: '',
        city_id: '',
        venue_name: '',
        address: '',
        organizer_name: '',
        contact_phone: '',
        contact_email: '',
        is_featured: false as boolean,
        is_active: true as boolean,
        banner_image: null as File | null,
        gallery: [] as File[],
    });

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('banner_image', file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.events.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Event created successfully.');
            },
            onError: () => {
                toast.error('Failed to create event. Please check form validation errors.');
            }
        });
    };

    const filteredFormCities = cities.filter(c => c.state_id.toString() === data.state_id);

    return (
        <AdminLayout title="Add Event">
            <Head title="Add Event - Admin" />

            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link 
                    href={route('admin.events.index')} 
                    className="flex h-10 w-10 items-center justify-center border border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-all rounded-full shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Create Event Listing</h2>
                    <p className="text-xs text-woof-charcoal/60">Register a new dog show, exhibition, seminar, or meetup</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6" encType="multipart/form-data">
                {/* 1. Basic Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Basic Information</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Set the event title, select its category type, and write a thorough agenda description.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="title" className="text-xs font-bold text-woof-charcoal">Event Title *</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. Annual Pet Adoption Drive 2026" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="event_type_id" className="text-xs font-bold text-woof-charcoal">Event Type Category *</Label>
                                <select 
                                    id="event_type_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.event_type_id} 
                                    onChange={e => setData('event_type_id', e.target.value)}
                                >
                                    <option value="">Select Category type...</option>
                                    {eventTypes.map((t) => (
                                        <option key={t.id} value={t.id.toString()}>{t.name}</option>
                                    ))}
                                </select>
                                {errors.event_type_id && <p className="text-xs text-rose-500">{errors.event_type_id}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-woof-charcoal">Event Description & Agenda</Label>
                            <div className="rounded-2xl overflow-hidden border border-[#e8ded1]">
                                <RichTextEditor value={data.description} onChange={(val: string) => setData('description', val)} />
                            </div>
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Timings & Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Timings & Schedule</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Specify when the event starts and ends. You can optionally define a starting time.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="start_date" className="text-xs font-bold text-woof-charcoal">Start Date *</Label>
                                <Input 
                                    id="start_date" 
                                    type="date"
                                    value={data.start_date} 
                                    onChange={e => setData('start_date', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.start_date && <p className="text-xs text-rose-500">{errors.start_date}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="end_date" className="text-xs font-bold text-woof-charcoal">End Date (Optional)</Label>
                                <Input 
                                    id="end_date" 
                                    type="date"
                                    value={data.end_date} 
                                    onChange={e => setData('end_date', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.end_date && <p className="text-xs text-rose-500">{errors.end_date}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="start_time" className="text-xs font-bold text-woof-charcoal">Start Time (Optional)</Label>
                                <Input 
                                    id="start_time" 
                                    type="time"
                                    value={data.start_time} 
                                    onChange={e => setData('start_time', e.target.value)} 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.start_time && <p className="text-xs text-rose-500">{errors.start_time}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Venue & Geographical Location */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Globe className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Venue & Location</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Indicate the state and city region, and outline the physical address and building venue location.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="state_id" className="text-xs font-bold text-woof-charcoal">State *</Label>
                                <select 
                                    id="state_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20" 
                                    value={data.state_id} 
                                    onChange={e => {
                                        setData('state_id', e.target.value);
                                        setData('city_id', '');
                                    }}
                                >
                                    <option value="">Select State...</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id.toString()}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.state_id && <p className="text-xs text-rose-500">{errors.state_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="city_id" className="text-xs font-bold text-woof-charcoal">City *</Label>
                                <select 
                                    id="city_id" 
                                    className="flex h-10 w-full rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] px-3 py-2 text-xs font-medium text-woof-charcoal focus:outline-none focus:ring-2 focus:ring-woof-gold/20 disabled:opacity-50" 
                                    value={data.city_id} 
                                    onChange={e => setData('city_id', e.target.value)}
                                    disabled={!data.state_id}
                                >
                                    <option value="">Select City...</option>
                                    {filteredFormCities.map((city) => (
                                        <option key={city.id} value={city.id.toString()}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="text-xs text-rose-500">{errors.city_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="venue_name" className="text-xs font-bold text-woof-charcoal">Venue Name *</Label>
                                <Input 
                                    id="venue_name" 
                                    value={data.venue_name} 
                                    onChange={e => setData('venue_name', e.target.value)} 
                                    placeholder="e.g. Ground A, Exhibition Complex" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.venue_name && <p className="text-xs text-rose-500">{errors.venue_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="address" className="text-xs font-bold text-woof-charcoal">Physical Address *</Label>
                                <Input 
                                    id="address" 
                                    value={data.address} 
                                    onChange={e => setData('address', e.target.value)} 
                                    placeholder="Complete street address..." 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.address && <p className="text-xs text-rose-500">{errors.address}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Organizer Contact Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Organizer Details</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Enter contact numbers, emails, and entity names managing operations on site.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="organizer_name" className="text-xs font-bold text-woof-charcoal">Organizer Entity Name</Label>
                                <Input 
                                    id="organizer_name" 
                                    value={data.organizer_name} 
                                    onChange={e => setData('organizer_name', e.target.value)} 
                                    placeholder="e.g. Woof Circle Team" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.organizer_name && <p className="text-xs text-rose-500">{errors.organizer_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="contact_phone" className="text-xs font-bold text-woof-charcoal">Contact Phone</Label>
                                <Input 
                                    id="contact_phone" 
                                    value={data.contact_phone} 
                                    onChange={e => setData('contact_phone', e.target.value)} 
                                    placeholder="e.g. 9876543210" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.contact_phone && <p className="text-xs text-rose-500">{errors.contact_phone}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="contact_email" className="text-xs font-bold text-woof-charcoal">Contact Email</Label>
                                <Input 
                                    id="contact_email" 
                                    type="email"
                                    value={data.contact_email} 
                                    onChange={e => setData('contact_email', e.target.value)} 
                                    placeholder="events@woofcircle.com" 
                                    className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20" 
                                />
                                {errors.contact_email && <p className="text-xs text-rose-500">{errors.contact_email}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Highlight & Promotion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Status & Promotion</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Configure visibility settings and banner spotlight flags.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex items-center gap-2.5 p-3.5 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_active ? 'border-woof-gold bg-woof-gold/10' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox 
                                    id="is_active" 
                                    checked={data.is_active} 
                                    onCheckedChange={checked => setData('is_active', !!checked)} 
                                />
                                <Label htmlFor="is_active" className="text-xs font-bold text-woof-charcoal cursor-pointer">Active Event (Visible to public)</Label>
                            </div>

                            <div 
                                onClick={() => setData('is_featured', !data.is_featured)}
                                className={`flex items-center gap-2.5 p-3.5 border cursor-pointer transition-all rounded-2xl ${
                                    data.is_featured ? 'border-amber-400 bg-amber-50' : 'border-[#e8ded1] bg-[#fcfbf9] hover:bg-white'
                                }`}
                            >
                                <Checkbox 
                                    id="is_featured" 
                                    checked={data.is_featured} 
                                    onCheckedChange={checked => setData('is_featured', !!checked)} 
                                />
                                <Label htmlFor="is_featured" className="text-xs font-bold text-woof-charcoal cursor-pointer">Featured Event Spotlight</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Media upload */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-woof-charcoal">Banner & Gallery</h3>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 leading-relaxed pl-12">
                            Upload a primary landscape banner and optional album gallery photos of the event.
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-[#e8ded1] p-6 rounded-3xl shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Landscape Banner Image</Label>
                                <div className="flex flex-col gap-3">
                                    {bannerPreview ? (
                                        <div className="h-32 w-full border border-[#e8ded1] rounded-2xl bg-[#fcfbf9] flex items-center justify-center relative overflow-hidden group">
                                            <img src={bannerPreview} alt="Banner Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs text-white font-bold">Change Banner</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-32 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-7 w-7 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Event Banner</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.banner_image && <p className="text-xs text-rose-500">{errors.banner_image}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Album Gallery Photos</Label>
                                <div className="flex flex-col gap-3">
                                    {data.gallery && data.gallery.length > 0 ? (
                                        <div className="border border-[#e8ded1] p-3 rounded-2xl bg-[#fcfbf9] space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {data.gallery.map((file: File, idx: number) => (
                                                    <img key={idx} src={URL.createObjectURL(file)} alt={`Gallery Preview ${idx}`} className="h-16 w-16 object-cover border border-[#e8ded1] rounded-xl" />
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('gallery', [])}
                                                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                                                >
                                                    Clear Images
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-32 border-2 border-dashed border-[#e8ded1] hover:border-woof-gold transition-colors p-4 bg-[#fcfbf9] rounded-2xl flex flex-col items-center justify-center text-center relative cursor-pointer">
                                            <UploadCloud className="h-7 w-7 text-woof-charcoal/40 mb-1" />
                                            <span className="text-xs font-bold text-woof-charcoal">Upload Album Photos</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={e => setData('gallery', Array.from(e.target.files || []))}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.gallery && <p className="text-xs text-rose-500">{errors.gallery}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit actions */}
                <div className="flex justify-end gap-3 border-t border-[#e8ded1] pt-6">
                    <Link 
                        href={route('admin.events.index')}
                        className="inline-flex items-center justify-center rounded-full border border-[#e8ded1] bg-white px-5 h-10 text-xs font-bold hover:bg-[#fcfbf9] text-woof-charcoal transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="h-10 px-7 text-xs font-bold bg-woof-charcoal hover:bg-woof-forest text-white rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Save Event
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
