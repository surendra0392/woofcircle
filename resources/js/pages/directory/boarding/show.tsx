import { Breadcrumbs } from '@/components/breadcrumbs';
import { ReviewSection } from '@/components/review-section';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Pet, Review, SharedData } from '@/types';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ShareDialog from '@/components/public/share-dialog';
import { ArrowUpRight, Camera, CheckCircle2, Clock, Dog, Home, MapPin, Share2, ShieldCheck, Star, Users } from 'lucide-react';
import SaveButton from '@/components/public/save-button';
interface Boarding {
    id: number;
    name: string;
    logo_url: string | null;
    address: string;
    description: string | null;
    is_verified: boolean;
    city: { name: string };
    state: { name: string };
    service_type: string | null;
    capacity: number | null;
    price_per_day: number | null;
    phone: string | null;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
}
interface PageProps {
    boarding: Boarding;
    pets?: Pet[];
}
export default function BoardingShow({ boarding, pets = [] }: PageProps) {
    const { auth, settings } = usePage<SharedData>().props;
    const displayName = boarding.name || 'Boarding & Daycare';
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [boarding.id, boarding.logo_url]);

    const hasValidImage = Boolean(boarding.logo_url && boarding.logo_url.trim() !== '' && !imgError);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

    const bookingForm = useForm({
        pet_id: '',
        check_in_date: '',
        check_out_date: '',
        notes: '',
    });

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!auth.user) {
            toast.error('Please log in to book a stay.');
            router.get(route('login'));
            return;
        }

        bookingForm.post(route('directory.boarding.book', { boarding: boarding.id }), {
            onSuccess: () => {
                setIsBookingDialogOpen(false);
                toast.success('Your boarding request has been sent to the facility owner!');
                bookingForm.reset();
            },
            onError: () => toast.error('Please check the form for errors.'),
        });
    };

    return (
        <PublicLayout>
            <Head title={`${displayName} | Premium Boarding & Daycare | ${settings.site_name}`} /> {/* --- CINEMATIC HERO --- */}
            <div className="bg-woof-pearl/5 border-woof-charcoal/5 relative overflow-hidden border-b pt-32 pb-16">
                {/* Immersive Background */}

                <div className="animate-reveal absolute inset-0 z-0 rounded-none opacity-10 blur-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop"
                        alt="Background Decor"
                        className="h-full w-full object-cover grayscale"
                    />
                </div>

                <div className="container-wide relative z-10 px-6 lg:px-12">
                    <div className="animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Home', href: '/' },
                                { title: 'Directory', href: route('directory.index') },
                                { title: 'Boarding & Daycare', href: route('directory.boarding') },
                                { title: displayName, href: '#' },
                            ]}
                            className="mb-6"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
                        <div className="group animate-reveal relative [animation-delay:400ms]">
                            <div className="h-56 w-56 overflow-hidden rounded-3xl border border-[#e8ded1] bg-white p-2 shadow-md transition-all duration-500 group-hover:shadow-xl">
                                {hasValidImage ? (
                                    <img
                                        src={boarding.logo_url!}
                                        alt={displayName}
                                        onError={() => setImgError(true)}
                                        className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="bg-woof-cream/60 flex h-full w-full flex-col items-center justify-center rounded-2xl text-center">
                                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-14 w-14 items-center justify-center rounded-2xl">
                                            <img src="/images/favicon.png" alt="WoofCircle" className="h-7 w-7 object-contain" />
                                        </div>
                                        <span className="text-woof-charcoal/50 text-[9px] font-bold tracking-wider uppercase">No Logo Available</span>
                                    </div>
                                )}
                            </div>

                            {boarding.is_verified && (
                                <div className="bg-woof-gold border-white absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 text-white shadow-xl">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="animate-reveal space-y-3" style={{ animationDelay: '0.6s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-woof-gold h-px w-8" />

                                    <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                                        Verified Premium Facility
                                    </span>
                                </div>

                                <h1 className="text-woof-charcoal font-sans text-3xl sm:text-4xl leading-tight font-bold tracking-tight">
                                    {displayName}
                                </h1>
                            </div>

                            <div className="animate-reveal flex flex-wrap items-center gap-6 [animation-delay:800ms]">
                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <MapPin className="text-woof-gold h-4 w-4" /> {boarding.city?.name}, {boarding.state?.name}
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Star className="text-woof-gold fill-woof-gold h-4 w-4" /> {Number(boarding.average_rating || 0).toFixed(1)} Guest Rating
                                </div>
                                <div className="bg-woof-charcoal/20 h-1 w-1 rounded-full"></div>

                                <div className="text-woof-charcoal/70 flex items-center gap-2 text-xs font-medium">
                                    <Clock className="text-woof-gold h-4 w-4" /> Open 24/7
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- CORE CONTENT --- */}
            <section className="bg-white py-20">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid items-start gap-16 lg:grid-cols-12">
                        <div className="space-y-16 lg:col-span-8">
                            {/* Philosophy */}

                            <div className="animate-reveal space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Service Philosophy</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        About {boarding.name}
                                    </h4>
                                </div>
                                <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8">
                                    <div
                                        className="prose prose-slate max-w-none text-base leading-relaxed text-woof-charcoal/80 prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0 prose-strong:text-woof-charcoal prose-strong:font-bold prose-a:text-woof-gold hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: boarding.description
                                                ? (/<[a-z][\s\S]*>/i.test(boarding.description) ? boarding.description : boarding.description.replace(/\n/g, '<br/>'))
                                                : 'A luxury home away from home. We provide climate-controlled suites, personalized play schedules, and 24/7 expert supervision.'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Gallery - LENS STYLE */}

                            <div className="animate-reveal space-y-6">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Visual Tour</h3>
                                        <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">The Sanctuary</h4>
                                    </div>
                                </div>

                                <div className="grid h-[450px] grid-cols-12 gap-4">
                                    <div className="border-[#e8ded1] group col-span-8 overflow-hidden rounded-3xl border shadow-xs bg-woof-cream/30">
                                        <img
                                            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop"
                                            alt="Facility Main"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="col-span-4 flex flex-col gap-4">
                                        <div className="border-[#e8ded1] group flex-1 overflow-hidden rounded-2xl border shadow-xs bg-woof-cream/30">
                                            <img
                                                src="https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?q=80&w=2070&auto=format&fit=crop"
                                                alt="Facility Detail"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="border-[#e8ded1] group flex-1 overflow-hidden rounded-2xl border shadow-xs bg-woof-cream/30">
                                            <img
                                                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop"
                                                alt="Facility Detail"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Amenities */}

                            <div className="animate-reveal space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-woof-gold text-xs font-bold tracking-wider uppercase">Facility Amenities</h3>
                                    <h4 className="font-sans text-2xl font-bold tracking-tight text-woof-charcoal">
                                        Elite Comfort
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {[
                                        { name: 'Climate Control', desc: 'Optimized temperature zones for all seasons.', icon: Home },
                                        { name: 'CCTV Surveillance', desc: '24/7 digital monitoring and daily guest updates.', icon: Camera },
                                        { name: 'Personalized Play', desc: 'Structured activity, agility areas, and socialization.', icon: Users },
                                        { name: 'Medical Supervision', desc: 'On-call veterinary support and dietary tracking.', icon: ShieldCheck },
                                    ].map((amenity) => (
                                        <div
                                            key={amenity.name}
                                            className="border-[#e8ded1] group flex items-start gap-4 sm:gap-5 rounded-3xl border bg-white hover:border-woof-gold/40 hover:shadow-lg p-5 sm:p-6 transition-all duration-300"
                                        >
                                            <div className="bg-woof-cream text-woof-gold group-hover:bg-woof-gold group-hover:text-white flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#e8ded1] shadow-2xs transition-all duration-300 mt-0.5">
                                                <amenity.icon className="h-6 w-6 stroke-[1.75]" />
                                            </div>

                                            <div className="space-y-1 min-w-0 flex-1">
                                                <h5 className="text-woof-charcoal font-sans text-base sm:text-lg font-bold tracking-tight">
                                                    {amenity.name}
                                                </h5>

                                                <p className="text-woof-charcoal/70 text-xs sm:text-sm leading-relaxed font-normal">
                                                    {amenity.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Reviews */}

                            <div className="border-[#e8ded1] animate-reveal border-t pt-16">
                                <ReviewSection
                                    reviews={boarding.reviews || []}
                                    averageRating={boarding.average_rating || 0}
                                    reviewsCount={boarding.reviews_count || 0}
                                    reviewableId={boarding.id}
                                    reviewableType="boarding"
                                />
                            </div>
                        </div>
                        {/* --- CINEMATIC SIDEBAR --- */}

                        <div className="animate-reveal space-y-8 [animation-delay:1000ms] lg:sticky lg:top-32 lg:col-span-4">
                            <div className="bg-woof-charcoal shadow-xl group relative space-y-8 overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
                                <div className="bg-woof-gold/10 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150"></div>
                                <div className="bg-woof-gold/20 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[100px]"></div>

                                <div className="relative z-10 space-y-6 text-center">
                                    <div className="space-y-2">
                                        <h4 className="font-sans text-3xl font-bold text-white">
                                            Stay Registry
                                        </h4>

                                        <p className="text-woof-gold text-xs font-bold tracking-wider uppercase"> Trusted Booking </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Starting From</p>

                                            <p className="font-sans text-3xl font-bold text-white">
                                                ₹{boarding.price_per_day || '950'}
                                                <span className="ml-2 text-xs font-medium text-white/50 uppercase">/ Day</span>
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                            <p className="text-woof-gold mb-1 text-xs font-bold uppercase tracking-wider">Facility Contact</p>

                                            <p className="font-sans text-xl font-bold text-white cursor-pointer hover:text-woof-gold transition-colors"
                                                onClick={() => { fetch('/api/track-interaction', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' }, body: JSON.stringify({ viewable_type: 'App\\Models\\BoardingProfile', viewable_id: boarding.id, interaction_type: 'phone_click' }) }).catch(() => {}); window.location.href = `tel:${boarding.phone}`; }}
                                            >
                                                {boarding.phone || '98765 43210'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <Button 
                                            onClick={() => {
                                                if (!auth.user) {
                                                    toast.error('Please log in to book a stay.');
                                                    router.get(route('login'));
                                                } else {
                                                    setIsBookingDialogOpen(true);
                                                }
                                            }}
                                            className="hover:bg-woof-gold hover:text-woof-charcoal text-woof-charcoal h-13 w-full rounded-full bg-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                        >
                                            Instant Booking <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsShareDialogOpen(true)}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-4 h-11 text-xs font-bold tracking-wider uppercase text-white/90 hover:text-woof-gold hover:bg-white/10 transition-all cursor-pointer w-full"
                                            >
                                                <Share2 className="h-3.5 w-3.5" /> Share
                                            </button>

                                            <SaveButton
                                                itemId={boarding.id}
                                                itemType="boarding"
                                                isSaved={!!(boarding as unknown as { is_saved?: boolean }).is_saved}
                                                variant="button"
                                                theme="dark"
                                                className="h-11 text-xs font-bold tracking-wider uppercase rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Verification Card */}

                            <div className="bg-woof-champagne/10 border-woof-gold/30 animate-reveal space-y-4 rounded-3xl border p-6 sm:p-8 [animation-delay:1200ms] shadow-2xs">
                                <ShieldCheck className="text-woof-gold h-10 w-10" />

                                <div className="space-y-1">
                                    <h5 className="text-woof-charcoal font-sans text-xl font-bold">
                                        Woof Circle Verified
                                    </h5>

                                    <p className="text-woof-charcoal/70 text-xs leading-relaxed font-normal">
                                        This facility has been manually inspected for safety, hygiene, and ethical standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <ShareDialog 
                isOpen={isShareDialogOpen} 
                setIsOpen={setIsShareDialogOpen} 
                title={boarding.name} 
            />

            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogContent className="border-[#e8ded1] sm:max-w-md rounded-3xl bg-white p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="bg-woof-charcoal p-6 sm:p-8">
                        <DialogTitle className="text-woof-gold font-sans text-2xl font-bold">Request Booking</DialogTitle>
                        <DialogDescription className="text-white/70 text-xs font-medium mt-1">
                            Book a stay at {boarding.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBooking} className="space-y-4 p-6 sm:p-8">
                        {pets.length > 0 ? (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="pet" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Select Pet</Label>
                                    <Select
                                        value={bookingForm.data.pet_id}
                                        onValueChange={(val) => bookingForm.setData('pet_id', val)}
                                    >
                                        <SelectTrigger className="rounded-2xl border-[#e8ded1] h-12 font-medium text-xs">
                                            <SelectValue placeholder="Select your pet" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[#e8ded1]">
                                            {pets.map((pet) => (
                                                <SelectItem key={pet.id} value={pet.id.toString()} className="font-medium text-xs cursor-pointer rounded-xl">
                                                    {pet.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {bookingForm.errors.pet_id && <p className="text-xs text-red-500 font-medium">{bookingForm.errors.pet_id}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="check_in_date" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Check-in Date</Label>
                                        <Input
                                            type="date"
                                            id="check_in_date"
                                            value={bookingForm.data.check_in_date}
                                            onChange={(e) => bookingForm.setData('check_in_date', e.target.value)}
                                            className="rounded-2xl border-[#e8ded1] h-12 font-medium text-xs"
                                        />
                                        {bookingForm.errors.check_in_date && <p className="text-xs text-red-500 font-medium">{bookingForm.errors.check_in_date}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="check_out_date" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Check-out Date</Label>
                                        <Input
                                            type="date"
                                            id="check_out_date"
                                            value={bookingForm.data.check_out_date}
                                            onChange={(e) => bookingForm.setData('check_out_date', e.target.value)}
                                            className="rounded-2xl border-[#e8ded1] h-12 font-medium text-xs"
                                        />
                                        {bookingForm.errors.check_out_date && <p className="text-xs text-red-500 font-medium">{bookingForm.errors.check_out_date}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-woof-charcoal">Special Requirements (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any dietary needs or medical conditions?"
                                        value={bookingForm.data.notes}
                                        onChange={(e) => bookingForm.setData('notes', e.target.value)}
                                        className="rounded-2xl border-[#e8ded1] font-medium text-xs min-h-[100px]"
                                    />
                                    {bookingForm.errors.notes && <p className="text-xs text-red-500 font-medium">{bookingForm.errors.notes}</p>}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={bookingForm.processing}
                                    className="w-full rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs h-12 transition-colors cursor-pointer"
                                >
                                    {bookingForm.processing ? 'Sending Request...' : 'Confirm Request'}
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <p className="text-xs font-medium text-woof-charcoal/70">You need to add a pet to your profile before booking.</p>
                                <Button
                                    type="button"
                                    onClick={() => router.get(route('dashboard'))}
                                    className="w-full rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white font-bold uppercase tracking-wider text-xs h-12 transition-colors cursor-pointer"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
