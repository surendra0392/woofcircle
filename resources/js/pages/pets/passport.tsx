import React, { useState } from 'react';
import PublicLayout from '@/layouts/public/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import PetPassportCard from '@/components/pets/PetPassportCard';
import MedicalRecordExportModal from '@/components/pets/MedicalRecordExportModal';
import { ShieldCheck, CheckCircle2, Award, Calendar, FileText, ArrowRight, Link as LinkIcon, Phone, Mail, User, Clock, AlertTriangle, AlertCircle, Dna, Heart } from 'lucide-react';

interface PassportPageProps {
    pet: {
        id: number;
        name: string;
        passport_number: string;
        microchip_number?: string;
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
        is_followed?: boolean;
    };
    verification_status: string;
    verified_at: string;
    auth: {
        user: any;
    };
}

export default function PetPassportVerificationPage({ pet, verification_status, verified_at, auth }: PassportPageProps) {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isFollowing, setIsFollowing] = useState(pet.is_followed || false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFollowToggle = () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }
        setIsFollowing(!isFollowing);
        router.post(route('pets.follow', pet.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Keep the optimistic update unless it fails
            },
            onError: () => {
                // Revert if error
                setIsFollowing(pet.is_followed || false);
            }
        });
    };

    const getTimelineColor = (type: string) => {
        switch(type) {
            case 'created': return 'border-emerald-500 bg-emerald-500';
            case 'vaccination': return 'border-blue-500 bg-blue-500';
            case 'medical': return 'border-amber-500 bg-amber-500';
            case 'transfer': return 'border-violet-500 bg-violet-500';
            case 'lost': return 'border-rose-500 bg-rose-500';
            default: return 'border-zinc-500 bg-zinc-500';
        }
    };

    return (
        <PublicLayout>
            <Head title={`${pet.name} | Official Pet Passport (${pet.passport_number})`} />

            <div className="bg-[#fcfbf9] min-h-screen pt-36 sm:pt-44 pb-24 text-woof-charcoal">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Lost Pet Alert Banner */}
                    {pet.is_lost && (
                        <div className="rounded-3xl border-2 border-rose-500 animate-pulse bg-rose-50 p-6 text-center space-y-3 shadow-md">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold uppercase text-rose-700 tracking-tight">
                                ⚠️ This Pet Has Been Reported Missing
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

                    {/* Verification Status Header Banner */}
                    <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/60 p-6 sm:p-8 text-center space-y-2 shadow-xs">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 block">
                            Official Verified Record
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-woof-charcoal">
                            Digital Passport Verified Genuine
                        </h1>
                        <p className="text-xs text-woof-charcoal/60">
                            Authenticated on Woof Circle Registry at {new Date(verified_at).toLocaleTimeString()}
                        </p>
                    </div>

                    {/* Digital Pet Passport Card Component */}
                    <PetPassportCard pet={pet} onExportPdf={() => setIsExportOpen(true)} />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 rounded-full border border-[#e8ded1] bg-white px-6 h-11 text-xs font-bold uppercase tracking-wider text-woof-charcoal hover:border-woof-gold/50 shadow-2xs transition-colors cursor-pointer"
                        >
                            <LinkIcon className="h-3.5 w-3.5 text-woof-gold" />
                            {copied ? 'Link Copied!' : 'Share Link'}
                        </button>
                        <Link
                            href={route('pets.pedigree.show', pet.id)}
                            className="flex items-center gap-2 rounded-full border border-woof-gold/30 bg-woof-gold/10 px-6 h-11 text-xs font-bold uppercase tracking-wider text-woof-charcoal hover:bg-woof-gold/20 shadow-2xs transition-colors cursor-pointer"
                        >
                            <Dna className="h-3.5 w-3.5 text-woof-gold" />
                            View Pedigree Tree
                        </Link>
                        <button
                            onClick={handleFollowToggle}
                            className={`flex items-center gap-2 rounded-full px-6 h-11 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer ${
                                isFollowing
                                ? 'bg-white text-woof-charcoal border border-[#e8ded1] hover:bg-[#fcfbf9]'
                                : 'bg-woof-charcoal text-white hover:bg-woof-gold hover:text-woof-charcoal'
                            }`}
                        >
                            <Heart className="h-3.5 w-3.5" fill={isFollowing ? 'currentColor' : 'none'} />
                            {isFollowing ? 'Following' : 'Follow Pet'}
                        </button>
                    </div>

                    {/* Health & Immunization Verification Summary */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-bold text-woof-charcoal">
                                    Immunization & Health Clearances
                                </h3>
                            </div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                                pet.vaccination_expiry_status === 'expired' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                                pet.vaccination_expiry_status === 'expiring_soon' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                'text-emerald-600 bg-emerald-50 border-emerald-200'
                            }`}>
                                {pet.vaccinations?.length || 0} Verified Vaccines
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                pet.vaccinations.map((vac: any) => {
                                    let badgeClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
                                    let badgeText = "VALID";
                                    if (vac.next_due_date) {
                                        const dueDate = new Date(vac.next_due_date);
                                        const now = new Date();
                                        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                                        
                                        if (dueDate < now) {
                                            badgeClass = "text-rose-600 bg-rose-50 border-rose-200";
                                            badgeText = "EXPIRED";
                                        } else if (dueDate.getTime() - now.getTime() < thirtyDays) {
                                            badgeClass = "text-amber-600 bg-amber-50 border-amber-200";
                                            badgeText = "EXPIRING SOON";
                                        }
                                    }

                                    return (
                                        <div key={vac.id} className="rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-woof-charcoal">{vac.vaccine_name}</span>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                                                    {badgeText}
                                                </span>
                                            </div>
                                            <div className="text-xs text-woof-charcoal/70 space-y-1 font-normal">
                                                <p>Administered: {vac.vaccination_date || 'N/A'}</p>
                                                <p className="text-woof-charcoal font-semibold">Booster Due: {vac.next_due_date || 'N/A'}</p>
                                                <p className="text-woof-charcoal/50">Vet: {vac.vet_name || 'Verified Clinic'}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="col-span-full text-center py-6 text-woof-charcoal/50 text-xs uppercase tracking-wider">
                                    No immunization records found
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Timeline Section */}
                    {pet.timeline && pet.timeline.length > 0 && (
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-9 h-9 rounded-xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shadow-2xs">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-bold text-woof-charcoal">
                                    Passport Activity Timeline
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
                                                <span className="text-xs font-bold text-woof-charcoal/60">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            {/* Colored dot (Center) */}
                                            <div className={`absolute left-0 sm:left-[116px] top-1.5 h-3 w-3 rounded-full border-2 ${getTimelineColor(event.type)} z-10 shadow-xs`}></div>
                                            
                                            {/* Event content (Right) */}
                                            <div className="flex-1 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] p-4 group-hover:border-woof-gold/40 transition-colors ml-6 sm:ml-0">
                                                <h4 className="text-sm font-bold text-woof-charcoal">
                                                    {event.label}
                                                </h4>
                                                {event.description && (
                                                    <p className="mt-1 text-xs text-woof-charcoal/70 font-normal">
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
                        <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
                            <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                <h3 className="text-base font-bold text-woof-charcoal">
                                    Emergency Contact Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold shadow-2xs">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-woof-charcoal/50">Primary Contact</p>
                                        <p className="text-sm font-bold text-woof-charcoal">{pet.emergency_contact.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold shadow-2xs">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-woof-charcoal/50">Phone</p>
                                        <a href={`tel:${pet.emergency_contact.phone}`} className="text-sm font-bold text-woof-charcoal hover:text-woof-gold hover:underline">
                                            {pet.emergency_contact.phone}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold shadow-2xs">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-woof-charcoal/50">Email</p>
                                        <a href={`mailto:${pet.emergency_contact.email}`} className="text-sm font-bold text-woof-charcoal hover:text-woof-gold hover:underline break-all">
                                            {pet.emergency_contact.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Export Modal */}
            <MedicalRecordExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                pet={pet as any}
            />
        </PublicLayout>
    );
}
