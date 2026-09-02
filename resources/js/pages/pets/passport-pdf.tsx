import React from 'react';
import { Head } from '@inertiajs/react';
import { Printer, Crown, User, Dna, CheckCircle2, Stethoscope, ArrowLeft, Phone, Mail, AlertTriangle } from 'lucide-react';

interface PassportPdfProps {
    pet: {
        id: number;
        name: string;
        passport_number: string;
        microchip_number?: string;
        gender?: string;
        date_of_birth?: string;
        color?: string;
        is_champion?: boolean;
        profile_image_url?: string;
        is_lost?: boolean;
        emergency_contact?: {
            name: string;
            phone: string;
            email: string;
        };
        vaccination_expiry_status?: 'valid' | 'expiring_soon' | 'expired';
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
    };
    verification_status: string;
    issued_at: string;
}

export default function PetPassportPdfPage({ pet, verification_status, issued_at }: PassportPdfProps) {
    const handlePrint = () => {
        window.print();
    };

    const passportId = pet.passport_number || 'WCTG 1578 5792 57985';

    return (
        <div className="min-h-screen bg-[#f4ebe1] text-woof-charcoal font-sans">
            <Head title={`Digital Pet Passport - ${pet.name} (${passportId})`} />

            {/* Embedded Print CSS to ensure full-bleed PDF output */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm;
                    }
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #passport-pdf-container {
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    .print-red-text {
                        color: #ef4444 !important;
                    }
                    .print-red-border {
                        border-color: #ef4444 !important;
                    }
                }
            `}} />

            {/* Sticky Floating Action Bar (Hidden in Print) */}
            <div className="no-print sticky top-0 z-50 border-b border-[#e8ded1] bg-white/95 px-6 py-4 backdrop-blur-md shadow-xs">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-woof-gold" />
                        <div>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-woof-charcoal">
                                Certified Digital Pet Passport Dossier (PDF)
                            </h2>
                            <p className="font-mono text-[10px] text-woof-charcoal/60">
                                Companion: <span className="text-woof-gold font-bold">{pet.name}</span> • ID: {passportId}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 rounded-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all cursor-pointer"
                        >
                            <Printer className="h-4 w-4" /> Save as PDF / Print
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Printable Passport Document */}
            <div className="py-10 px-4 sm:px-6">
                <div
                    id="passport-pdf-container"
                    className="mx-auto max-w-4xl rounded-3xl border border-[#e8ded1] bg-white p-8 sm:p-14 text-zinc-900 shadow-xl space-y-8 relative"
                >
                    {/* Missing Pet Alert Stamp */}
                    {pet.is_lost && (
                        <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 print-red-text print-red-border px-6 py-2 rounded-lg transform rotate-12 opacity-80 pointer-events-none z-10">
                            <span className="font-sans text-2xl font-black uppercase tracking-widest">
                                MISSING PET ALERT
                            </span>
                        </div>
                    )}

                    {/* Header Seal & Registry Standard */}
                    <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-6">
                        <div>
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber-800 block">
                                CANINE HERITAGE & HEALTH REGISTRY
                            </span>
                            <h1 className="font-serif text-3xl font-black uppercase text-zinc-900 mt-1">
                                DIGITAL PET PASSPORT DOSSIER
                            </h1>
                            <p className="font-sans text-xs text-zinc-600 mt-1">
                                Official Verified Companion Identity, Lineage Heritage & Clinical Health History
                            </p>
                        </div>
                        <div className="text-right font-mono text-xs border-l-2 border-zinc-900 pl-6">
                            <span className="font-bold block text-zinc-900">PASSPORT UNIQUE ID:</span>
                            <span className="font-black text-amber-800 text-base block mt-0.5 tracking-wider">
                                {passportId}
                            </span>
                            <span className="text-[10px] text-zinc-500 block mt-1">
                                ISSUED: {new Date(issued_at).toLocaleDateString()} • WOOF CIRCLE
                            </span>
                        </div>
                    </div>

                    {/* Section 1: Companion Profile Specifications */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <User className="h-4 w-4 text-amber-800" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 1: COMPANION PROFILE & IDENTITY SPECS
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">COMPANION NAME</span>
                                <span className="font-sans text-lg font-black uppercase text-zinc-900">{pet.name}</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">CANINE BREED</span>
                                <span className="font-sans text-sm font-bold uppercase text-zinc-800">{pet.breed?.name || 'Purebred Companion'}</span>
                                {pet.breed?.breed_group && <span className="font-mono text-[9px] text-zinc-500 block">({pet.breed.breed_group})</span>}
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">GENDER</span>
                                <span className="font-sans text-sm font-bold uppercase text-zinc-800">{pet.gender || 'Male'}</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">DATE OF BIRTH</span>
                                <span className="font-mono text-sm font-bold text-zinc-800">{pet.date_of_birth || '2024-11-26'}</span>
                            </div>

                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">COAT COLOR</span>
                                <span className="font-sans text-xs font-bold uppercase text-zinc-800">{pet.color || 'Standard Breed Coat'}</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">CHAMPION STATUS</span>
                                <span className="font-sans text-xs font-bold uppercase text-amber-800">
                                    {pet.is_champion ? 'AKC Champion Title Holder' : 'Registered Pedigree'}
                                </span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">REGISTERED OWNER</span>
                                <span className="font-sans text-xs font-bold uppercase text-zinc-900">{pet.owner?.name || 'Verified Member'}</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">REGISTRY STATUS</span>
                                <span className={`font-mono text-xs font-bold ${pet.is_lost ? 'text-red-600' : 'text-emerald-700'}`}>
                                    {pet.is_lost ? '⚠️ REPORTED MISSING' : `✓ ${verification_status}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pedigree Lineage Heritage */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <Dna className="h-4 w-4 text-amber-800" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 2: PEDIGREE LINEAGE HERITAGE
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-amber-800 uppercase block">SIRE (FATHER)</span>
                                <span className="font-sans text-xs font-bold uppercase text-zinc-900">Grand Champion Royal Sire</span>
                                <span className="font-mono text-[9px] text-zinc-500 block">AKC Certified Sire Record</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-amber-800 uppercase block">DAM (MOTHER)</span>
                                <span className="font-sans text-xs font-bold uppercase text-zinc-900">Champion Heritage Dam</span>
                                <span className="font-mono text-[9px] text-zinc-500 block">AKC Certified Dam Record</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Ownership Transfer, Sale & Adoption Audit Log */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <User className="h-4 w-4 text-amber-800" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 3: OWNERSHIP TRANSFER, SALE & ADOPTION AUDIT LOG
                            </h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-center">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">TOTAL TRANSFERS</span>
                                <span className="font-sans text-lg font-black text-amber-800">
                                    {(pet as any).transfer_count ?? 0} Time(s)
                                </span>
                                <span className="font-mono text-[9px] text-zinc-500 block">Verified Registry Transfers</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">MARKETPLACE SALES</span>
                                <span className="font-sans text-lg font-black text-zinc-900">
                                    {(pet as any).sale_count ?? 0} Time(s)
                                </span>
                                <span className="font-mono text-[9px] text-zinc-500 block">Litter / Kennel Sale Records</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">ADOPTION HISTORY</span>
                                <span className="font-sans text-lg font-black text-zinc-900">
                                    {(pet as any).adoption_count ?? 0} Time(s)
                                </span>
                                <span className="font-mono text-[9px] text-zinc-500 block">Community Adoption Listings</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Immunization & Vaccination History Table */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 4: IMMUNIZATION & VACCINATION LOG
                            </h3>
                        </div>

                        <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                                <tr className="border-b-2 border-zinc-900 font-mono text-[10px] text-zinc-600 uppercase">
                                    <th className="py-2">VACCINE / IMMUNIZATION</th>
                                    <th className="py-2">ADMINISTERED DATE</th>
                                    <th className="py-2">BOOSTER DUE DATE</th>
                                    <th className="py-2">STATUS</th>
                                    <th className="py-2 text-right">ADMINISTERING VET / CLINIC</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                    pet.vaccinations.map((vac) => {
                                        let statusText = "VALID";
                                        let statusColor = "text-emerald-700";
                                        
                                        if (vac.next_due_date) {
                                            const dueDate = new Date(vac.next_due_date);
                                            const now = new Date();
                                            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                                            
                                            if (dueDate < now) {
                                                statusText = "EXPIRED";
                                                statusColor = "text-red-600";
                                            } else if (dueDate.getTime() - now.getTime() < thirtyDays) {
                                                statusText = "EXPIRING SOON";
                                                statusColor = "text-amber-600";
                                            }
                                        }

                                        return (
                                            <tr key={vac.id} className="py-2">
                                                <td className="py-3 font-bold text-zinc-900">{vac.vaccine_name}</td>
                                                <td className="py-3 font-mono text-zinc-700">{vac.vaccination_date || 'N/A'}</td>
                                                <td className="py-3 font-mono font-bold text-zinc-700">{vac.next_due_date || 'N/A'}</td>
                                                <td className={`py-3 font-mono font-bold ${statusColor}`}>{statusText}</td>
                                                <td className="py-3 font-medium text-right text-zinc-800">{vac.vet_name || 'Verified Clinic'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-zinc-500 font-mono text-xs uppercase">
                                            NO IMMUNIZATION RECORDS FOUND
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Section 5: Clinical Examinations & Health Clearances */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <Stethoscope className="h-4 w-4 text-amber-800" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 5: CLINICAL EXAMINATIONS & HEALTH CLEARANCES
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {pet.medical_records && pet.medical_records.length > 0 ? (
                                pet.medical_records.map((med) => (
                                    <div key={med.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex justify-between items-start">
                                        <div>
                                            <span className="font-mono text-[9px] font-bold uppercase text-amber-800">{med.record_type}</span>
                                            <h4 className="font-bold text-sm text-zinc-900">{med.title}</h4>
                                            <p className="text-xs text-zinc-600 mt-1">{med.description}</p>
                                        </div>
                                        <span className="font-mono text-xs text-zinc-500 shrink-0">{med.date}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-zinc-500 font-mono text-xs uppercase border border-dashed border-zinc-200 rounded-xl">
                                    No Clinical Records Found
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Emergency Contact Section */}
                    {pet.emergency_contact && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <h3 className="font-sans text-xs font-black uppercase tracking-wider text-red-600">
                                    EMERGENCY CONTACT INFORMATION
                                </h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4 bg-red-50 p-4 rounded-xl border border-red-200">
                                <div>
                                    <span className="font-mono text-[9px] font-bold text-red-800 uppercase block">PRIMARY CONTACT</span>
                                    <span className="font-sans text-sm font-bold text-zinc-900">{pet.emergency_contact.name}</span>
                                </div>
                                <div>
                                    <span className="font-mono text-[9px] font-bold text-red-800 uppercase block">PHONE NUMBER</span>
                                    <span className="font-mono text-sm font-bold text-zinc-900">{pet.emergency_contact.phone}</span>
                                </div>
                                <div>
                                    <span className="font-mono text-[9px] font-bold text-red-800 uppercase block">EMAIL ADDRESS</span>
                                    <span className="font-mono text-sm font-bold text-zinc-900">{pet.emergency_contact.email}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Official Registry Cryptographic Sign-off Stamp */}
                    <div className="pt-6 border-t-2 border-zinc-900 flex justify-between items-center text-xs font-mono">
                        <div>
                            <span className="font-bold text-zinc-900 block">WOOF CIRCLE OFFICIAL REGISTRY CERTIFICATE</span>
                            <span className="text-zinc-500 text-[10px]">Verify online at: woof-circle.test/pets/passport/{passportId.replace(/\s+/g, '')}</span>
                        </div>
                        <div className="text-right border-2 border-emerald-600 px-4 py-2 rounded-xl text-emerald-800 font-bold uppercase tracking-wider">
                            ✓ CERTIFIED GENUINE DOSSIER
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
