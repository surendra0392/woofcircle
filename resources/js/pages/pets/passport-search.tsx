import React, { useState } from 'react';
import PublicLayout from '@/layouts/public/public-layout';
import { Head, router } from '@inertiajs/react';
import PetPassportCard from '@/components/pets/PetPassportCard';
import MedicalRecordExportModal from '@/components/pets/MedicalRecordExportModal';
import { ShieldCheck, Search, CheckCircle2, Award, FileText, AlertCircle, Sparkles, QrCode, ArrowRight, Link, Phone, Mail, User, Clock, AlertTriangle } from 'lucide-react';

interface PassportSearchProps {
    pet: {
        id: number;
        name: string;
        passport_number: string;
        gender?: string;
        date_of_birth?: string;
        color?: string;
        profile_image_url?: string;
        is_champion?: boolean;
        is_lost?: boolean;
        lost_at?: string;
        lost_description?: string;
        lost_location?: string;
        emergency_contact?: {
            name: string;
            phone: string;
            email: string;
        };
        vaccination_expiry_status?: 'valid' | 'expiring_soon' | 'expired';
        timeline?: {
            type: 'created' | 'vaccination' | 'medical' | 'transfer' | 'lost';
            label: string;
            description?: string;
            date: string;
            icon?: string;
        }[];
        breed?: {
            name: string;
            breed_group?: string;
        };
        owner?: {
            name: string;
            email?: string;
        };
        vaccinations?: any[];
        medical_records?: any[];
    } | null;
    search_query?: string;
    not_found?: boolean;
    verified_at: string;
}

export default function PetPassportSearchPortal({ pet, search_query = '', not_found = false, verified_at }: PassportSearchProps) {
    const [passportInput, setPassportInput] = useState(search_query);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passportInput.trim()) return;
        router.get('/pets/passport-verification', { passport: passportInput.trim() }, { preserveState: true });
    };

    const handleSampleClick = (sampleCode: string) => {
        setPassportInput(sampleCode);
        router.get('/pets/passport-verification', { passport: sampleCode }, { preserveState: true });
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getTimelineColor = (type: string) => {
        switch(type) {
            case 'created': return 'border-emerald-500 bg-emerald-500';
            case 'vaccination': return 'border-sky-500 bg-sky-500';
            case 'medical': return 'border-amber-500 bg-amber-500';
            case 'transfer': return 'border-woof-gold bg-woof-gold';
            case 'lost': return 'border-rose-500 bg-rose-500';
            default: return 'border-zinc-400 bg-zinc-400';
        }
    };

    return (
        <PublicLayout>
            <Head title="Digital Pet Passport Verification Portal | Woof Circle Registry" />

            <div className="min-h-screen bg-[#fcfbf9] pt-36 sm:pt-44 pb-24 text-woof-charcoal">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
                    {/* Header Portal Hero */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-4 py-1.5 backdrop-blur-md">
                            <ShieldCheck className="h-4 w-4 text-woof-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold">
                                Official Canine Registry Portal
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal leading-tight">
                            Verify Digital <span className="text-woof-gold">Pet Passport</span>
                        </h1>

                        <p className="text-xs sm:text-sm font-normal leading-relaxed text-woof-charcoal/70">
                            Enter any companion's 15-character Passport Unique Identity Code (e.g.{' '}
                            <span className="font-mono font-bold text-woof-charcoal">WCTG 1578 5792 57985</span>) to inspect authentic registry records, immunization history, and health clearances.
                        </p>
                    </div>

                    {/* Passport Identity Search Form Bar */}
                    <div className="mx-auto max-w-2xl">
                        <form onSubmit={handleSearch} className="relative flex items-center">
                            <div className="relative w-full">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-woof-gold" />
                                <input
                                    type="text"
                                    value={passportInput}
                                    onChange={(e) => setPassportInput(e.target.value)}
                                    placeholder="Enter Passport ID (e.g. WCTG 1578 5792 57985)..."
                                    className="w-full rounded-full border border-[#e8ded1] bg-white py-3.5 pl-14 pr-36 font-mono text-xs uppercase text-woof-charcoal placeholder:text-woof-charcoal/40 shadow-sm focus:border-woof-gold focus:outline-none focus:ring-2 focus:ring-woof-gold/20"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all cursor-pointer"
                                >
                                    VERIFY
                                </button>
                            </div>
                        </form>

                        {/* Quick Sample Quick Links */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-woof-charcoal/60">
                            <span>Try Sample Passport:</span>
                            <button
                                type="button"
                                onClick={() => handleSampleClick('WCTG 8614 4813 4954')}
                                className="font-mono font-bold text-woof-gold hover:underline cursor-pointer"
                            >
                                WCTG 8614 4813 4954
                            </button>
                        </div>
                    </div>

                    {/* Search Results Area */}
                    {pet && (
                        <div className="space-y-10 animate-in fade-in duration-700">
                            {/* Lost Pet Alert Banner */}
                            {pet.is_lost && (
                                <div className="rounded-3xl border-2 border-rose-500 animate-pulse bg-rose-50 p-6 text-center space-y-3 shadow-md">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-xl font-bold uppercase text-rose-700 tracking-tight">
                                        ⚠️ THIS PET HAS BEEN REPORTED MISSING
                                    </h2>
                                    {pet.lost_at && (
                                        <p className="text-xs text-rose-600 font-medium">
                                            Lost Date: {new Date(pet.lost_at).toLocaleDateString()}
                                        </p>
                                    )}
                                    {pet.lost_location && (
                                        <p className="text-xs text-rose-600 font-medium">
                                            Location: {pet.lost_location}
                                        </p>
                                    )}
                                    {pet.lost_description && (
                                        <p className="text-xs text-rose-500 max-w-2xl mx-auto mt-1 font-normal">
                                            {pet.lost_description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Verification Banner */}
                            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/60 p-6 text-center space-y-2 shadow-xs">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xs">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 block">
                                    MATCH FOUND & AUTHENTICATED
                                </span>
                                <h2 className="text-xl font-bold uppercase text-woof-charcoal tracking-tight">
                                    DIGITAL PASSPORT VERIFIED GENUINE
                                </h2>
                                <p className="text-xs text-woof-charcoal/60">
                                    Authenticated on Woof Circle Registry at {new Date(verified_at).toLocaleTimeString()}
                                </p>
                            </div>

                            {/* 3D Flip Pet Passport Card */}
                            <PetPassportCard pet={pet as any} onExportPdf={() => setIsExportOpen(true)} />

                            {/* Share Passport Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center gap-2 rounded-full border border-[#e8ded1] bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-woof-charcoal hover:bg-woof-charcoal hover:text-white shadow-xs transition-all cursor-pointer"
                                >
                                    <Link className="h-4 w-4 text-woof-gold" />
                                    {copied ? 'LINK COPIED!' : 'SHARE PASSPORT LINK'}
                                </button>
                            </div>

                            {/* Ownership Transfer, Sales & Adoption History Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 text-center space-y-2 shadow-xs">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold block">
                                        OWNERSHIP TRANSFERS
                                    </span>
                                    <div className="text-3xl font-black text-woof-charcoal">
                                        {(pet as any).transfer_count ?? 0} <span className="text-xs text-woof-charcoal/50 font-normal">Times</span>
                                    </div>
                                    <p className="text-xs text-woof-charcoal/60">
                                        Verified Registry Ownership Changes
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 text-center space-y-2 shadow-xs">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold block">
                                        MARKETPLACE SALES
                                    </span>
                                    <div className="text-3xl font-black text-woof-charcoal">
                                        {(pet as any).sale_count ?? 0} <span className="text-xs text-woof-charcoal/50 font-normal">Times</span>
                                    </div>
                                    <p className="text-xs text-woof-charcoal/60">
                                        Registered Litter & Kennel Sale Records
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 text-center space-y-2 shadow-xs">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-woof-gold block">
                                        ADOPTION HISTORY
                                    </span>
                                    <div className="text-3xl font-black text-woof-charcoal">
                                        {(pet as any).adoption_count ?? 0} <span className="text-xs text-woof-charcoal/50 font-normal">Times</span>
                                    </div>
                                    <p className="text-xs text-woof-charcoal/60">
                                        Sanctuary & Community Adoption Listings
                                    </p>
                                </div>
                            </div>

                            {/* Immunization & Medical Clearances Breakdown */}
                            <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
                                <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-woof-gold" />
                                        <h3 className="text-base font-bold uppercase text-woof-charcoal tracking-wide">
                                            IMMUNIZATION & CLINICAL DOSSIER
                                        </h3>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                        pet.vaccination_expiry_status === 'expired' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                                        pet.vaccination_expiry_status === 'expiring_soon' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                                        'text-emerald-700 bg-emerald-50 border-emerald-200'
                                    }`}>
                                        {pet.vaccinations?.length || 0} VERIFIED RECORDS
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                        pet.vaccinations.map((vac: any) => {
                                            let badgeClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
                                            let badgeText = "VALID";
                                            if (vac.next_due_date) {
                                                const dueDate = new Date(vac.next_due_date);
                                                const now = new Date();
                                                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                                                
                                                if (dueDate < now) {
                                                    badgeClass = "text-rose-700 bg-rose-50 border-rose-200";
                                                    badgeText = "EXPIRED";
                                                } else if (dueDate.getTime() - now.getTime() < thirtyDays) {
                                                    badgeClass = "text-amber-700 bg-amber-50 border-amber-200";
                                                    badgeText = "EXPIRING SOON";
                                                }
                                            }

                                            return (
                                                <div key={vac.id} className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-5 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-woof-charcoal uppercase">{vac.vaccine_name}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                                                            {badgeText}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-woof-charcoal/60 space-y-1">
                                                        <p>Administered: <span className="font-semibold text-woof-charcoal">{vac.vaccination_date || 'N/A'}</span></p>
                                                        <p>Booster Due: <span className="font-semibold text-woof-charcoal">{vac.next_due_date || 'N/A'}</span></p>
                                                        <p className="text-woof-charcoal/50">Vet: {vac.vet_name || 'Verified Clinic'}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="col-span-full text-center py-6 text-woof-charcoal/50 text-xs font-medium uppercase">
                                            NO IMMUNIZATION RECORDS FOUND
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Timeline Section */}
                            {pet.timeline && pet.timeline.length > 0 && (
                                <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
                                    <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                        <Clock className="h-5 w-5 text-woof-gold" />
                                        <h3 className="text-base font-bold uppercase text-woof-charcoal tracking-wide">
                                            PASSPORT ACTIVITY TIMELINE
                                        </h3>
                                    </div>
                                    <div className="relative pl-6 sm:pl-32 py-4">
                                        {/* Vertical line */}
                                        <div className="absolute left-6 sm:left-[140px] top-4 bottom-4 w-px bg-[#e8ded1]"></div>
                                        
                                        <div className="space-y-6">
                                            {pet.timeline.map((event, index) => (
                                                <div key={index} className="relative flex flex-col sm:flex-row gap-4 sm:gap-12 group">
                                                    {/* Date label (Left) */}
                                                    <div className="sm:w-28 pt-1 sm:text-right">
                                                        <span className="text-xs font-medium text-woof-charcoal/60 uppercase">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Colored dot (Center) */}
                                                    <div className={`absolute left-0 sm:left-[116px] top-1.5 h-3 w-3 rounded-full border-2 ${getTimelineColor(event.type)} z-10 shadow-xs`}></div>
                                                    
                                                    {/* Event content (Right) */}
                                                    <div className="flex-1 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] p-4 group-hover:border-woof-gold transition-colors ml-6 sm:ml-0">
                                                        <h4 className="text-xs font-bold text-woof-charcoal uppercase tracking-wide">
                                                            {event.label}
                                                        </h4>
                                                        {event.description && (
                                                            <p className="mt-1 text-xs text-woof-charcoal/60">
                                                                {event.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Emergency Contact Card */}
                            {pet.emergency_contact && (
                                <div className="rounded-3xl border border-amber-300/60 bg-amber-50/40 p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
                                    <div className="flex items-center gap-3 border-b border-amber-200 pb-4 relative">
                                        <AlertCircle className="h-5 w-5 text-amber-600" />
                                        <h3 className="text-base font-bold uppercase text-woof-charcoal tracking-wide">
                                            EMERGENCY CONTACT INFORMATION
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Primary Contact</p>
                                                <p className="text-xs font-bold text-woof-charcoal">{pet.emergency_contact.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Phone</p>
                                                <a href={`tel:${pet.emergency_contact.phone}`} className="text-xs font-bold text-amber-800 hover:underline">
                                                    {pet.emergency_contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Email</p>
                                                <a href={`mailto:${pet.emergency_contact.email}`} className="text-xs font-bold text-amber-800 hover:underline break-all">
                                                    {pet.emergency_contact.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Not Found Error State */}
                    {not_found && (
                        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3 max-w-xl mx-auto shadow-xs">
                            <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
                            <h3 className="text-base font-bold uppercase text-rose-900">Passport ID Not Found</h3>
                            <p className="text-xs text-rose-700 leading-relaxed">
                                No registered companion matching passport code <span className="font-bold">"{search_query}"</span> was found in the official registry. Please verify the 15-character code format.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Companion Digital Passport Dossier PDF Export Modal */}
            {pet && (
                <MedicalRecordExportModal
                    isOpen={isExportOpen}
                    onClose={() => setIsExportOpen(false)}
                    pet={pet as any}
                />
            )}
        </PublicLayout>
    );
}
