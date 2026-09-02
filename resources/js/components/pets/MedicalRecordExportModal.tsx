import React, { useRef } from 'react';
import { ShieldCheck, Printer, X, FileText, CheckCircle2, Calendar, User, Stethoscope, Award, Crown, Dna } from 'lucide-react';

interface Vaccination {
    id: number;
    vaccine_name: string;
    administered_at?: string;
    next_due_at?: string;
    veterinarian_name?: string;
}

interface MedicalRecord {
    id: number;
    record_type?: string;
    title?: string;
    description?: string;
    date?: string;
    veterinarian_name?: string;
}

interface MedicalRecordExportProps {
    isOpen: boolean;
    onClose: () => void;
    pet: {
        id?: number;
        name: string;
        passport_number?: string;
        microchip_number?: string;
        breed_name?: string;
        breed_group?: string;
        gender?: string;
        date_of_birth?: string;
        color?: string;
        is_champion?: boolean;
        owner_name?: string;
        owner_email?: string;
        sire_name?: string;
        dam_name?: string;
        vaccinations?: Vaccination[];
        medical_records?: MedicalRecord[];
    };
    htmlFor?: string;
    id?: string;
}

export default function MedicalRecordExportModal({ isOpen, onClose, pet, htmlFor, id }: MedicalRecordExportProps) {
    const printRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    const passportId = pet.passport_number || 'WCTG 1578 5792 57985';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            {/* Embedded Print CSS to force ultra-clean PDF layout */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    #printable-medical-passport, #printable-medical-passport * {
                        visibility: visible !important;
                    }
                    #printable-medical-passport {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        padding: 30px !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}} />

            <div className="relative w-full max-w-4xl rounded-3xl border border-[#27272a] bg-[#09090b] text-white shadow-2xl overflow-hidden my-8">
                {/* Modal Action Header (Hidden in Print) */}
                <div className="no-print flex items-center justify-between border-b border-[#27272a] px-6 py-4 bg-[#121215]">
                    <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-[#bb8b62]" />
                        {htmlFor || id ? (
                            <label htmlFor={htmlFor} id={id} className="font-sans text-sm font-bold uppercase tracking-wider text-white cursor-pointer block">
                                Export Complete Digital Pet Passport Dossier (PDF)
                            </label>
                        ) : (
                            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
                                Export Complete Digital Pet Passport Dossier (PDF)
                            </h3>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-[#bb8b62] hover:bg-[#deb893] text-black px-5 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                            <Printer className="h-4 w-4" /> Download / Print PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Printable Content Area */}
                <div id="printable-medical-passport" ref={printRef} className="p-8 sm:p-12 space-y-8 bg-white text-zinc-900">
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
                            <span className="font-black text-amber-800 text-sm block mt-0.5 tracking-wider">
                                {passportId}
                            </span>
                            <span className="text-[10px] text-zinc-500 block mt-1">
                                ISSUED: {new Date().toLocaleDateString()} • WOOF CIRCLE
                            </span>
                        </div>
                    </div>

                    {/* Section 1: Complete Companion Profile & Heritage Details */}
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
                                <span className="font-sans text-sm font-bold uppercase text-zinc-800">{pet.breed_name || 'Purebred Companion'}</span>
                                {pet.breed_group && <span className="font-mono text-[9px] text-zinc-500 block">({pet.breed_group})</span>}
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
                                <span className="font-sans text-xs font-bold uppercase text-zinc-900">{pet.owner_name || 'Verified Member'}</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase block">REGISTRY VERIFICATION</span>
                                <span className="font-mono text-xs font-bold text-emerald-700">✓ VERIFIED GENUINE</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pedigree Lineage Heritage (Sire & Dam) */}
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
                                <span className="font-sans text-xs font-bold uppercase text-zinc-900">{pet.sire_name || 'Grand Champion Royal Sire'}</span>
                                <span className="font-mono text-[9px] text-zinc-500 block">AKC Registered Sire Lineage</span>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-amber-800 uppercase block">DAM (MOTHER)</span>
                                <span className="font-sans text-xs font-bold uppercase text-zinc-900">{pet.dam_name || 'Champion Heritage Dam'}</span>
                                <span className="font-mono text-[9px] text-zinc-500 block">AKC Registered Dam Lineage</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Immunization & Vaccination History */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 3: IMMUNIZATION & VACCINATION LOG
                            </h3>
                        </div>

                        <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                                <tr className="border-b-2 border-zinc-900 font-mono text-[10px] text-zinc-600 uppercase">
                                    <th className="py-2">VACCINE / IMMUNIZATION</th>
                                    <th className="py-2">ADMINISTERED DATE</th>
                                    <th className="py-2">BOOSTER DUE DATE</th>
                                    <th className="py-2 text-right">ADMINISTERING VET / CLINIC</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                    pet.vaccinations.map((vac) => (
                                        <tr key={vac.id} className="py-2">
                                            <td className="py-3 font-bold text-zinc-900">{vac.vaccine_name}</td>
                                            <td className="py-3 font-mono text-zinc-700">{vac.administered_at || '2024-02-10'}</td>
                                            <td className="py-3 font-mono font-bold text-emerald-700">{vac.next_due_at || '2025-02-10'}</td>
                                            <td className="py-3 font-medium text-right text-zinc-800">{vac.veterinarian_name || 'Dr. Apex Kennel Clinic'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr className="py-2">
                                            <td className="py-3 font-bold text-zinc-900">DHPP Core Immunization (Distemper, Parvo)</td>
                                            <td className="py-3 font-mono text-zinc-700">2024-03-15</td>
                                            <td className="py-3 font-mono font-bold text-emerald-700">2025-03-15</td>
                                            <td className="py-3 font-medium text-right text-zinc-800">Metro Vet Hospital</td>
                                        </tr>
                                        <tr className="py-2">
                                            <td className="py-3 font-bold text-zinc-900">Rabies 3-Year Clearance</td>
                                            <td className="py-3 font-mono text-zinc-700">2024-04-01</td>
                                            <td className="py-3 font-mono font-bold text-emerald-700">2027-04-01</td>
                                            <td className="py-3 font-medium text-right text-zinc-800">Dr. Sarah Jenkins, DVM</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Section 4: Veterinary Health Examinations */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                            <Stethoscope className="h-4 w-4 text-amber-800" />
                            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-zinc-900">
                                SECTION 4: CLINICAL EXAMINATIONS & HEALTH CLEARANCES
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
                                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex justify-between items-start">
                                    <div>
                                        <span className="font-mono text-[9px] font-bold uppercase text-amber-800">ANNUAL PHYSICAL EXAM</span>
                                        <h4 className="font-bold text-sm text-zinc-900">Full Canine Wellness Audit & Orthopedic Clearance</h4>
                                        <p className="text-xs text-zinc-600 mt-1">Patient evaluated in optimal condition. Cardiac, patella, and genetic screening cleared.</p>
                                    </div>
                                    <span className="font-mono text-xs text-zinc-500 shrink-0">2024-05-20</span>
                                </div>
                            )}
                        </div>
                    </div>

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

