import React, { useState, useRef } from 'react';
import { ShieldCheck, Award, QrCode, Sparkles, RotateCw, FileText, CheckCircle2, Crown, Shield, Link2, Camera } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

interface PetPassportProps {
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
        vaccination_expiry_status?: string;
        badges?: any[];
        breed?: { id?: number; name: string; breed_group?: string; };
        owner?: { name: string; email?: string; };
        transfer_count?: number;
        sale_count?: number;
        adoption_count?: number;
    };
    onExportPdf?: () => void;
    htmlFor?: string;
    id?: string;
}

export default function PetPassportCard({ pet, onExportPdf, htmlFor, id }: PetPassportProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const pageProps = usePage<SharedData>().props;
    const settings = pageProps?.settings;
    const passportId = pet.passport_number || 'WCTG 1578 5792 57985';

    const hasLogo =
        typeof settings?.site_logo === 'string' &&
        settings.site_logo.trim() !== '' &&
        settings.site_logo !== 'null' &&
        settings.site_logo !== 'undefined';

    const verifyUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/pets/passport/${encodeURIComponent(passportId.replace(/\s+/g, ''))}`
            : `/pets/passport/${encodeURIComponent(passportId.replace(/\s+/g, ''))}`;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(verifyUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDownload = async () => {
        window.print();
    };

    const renderHealthClearance = () => {
        if (pet.vaccination_expiry_status === 'valid') {
            return <span className="block font-bold text-emerald-400 uppercase mt-0.5">ALL CURRENT</span>;
        }
        if (pet.vaccination_expiry_status === 'expiring_soon') {
            return <span className="block font-bold text-amber-400 uppercase mt-0.5">RENEWAL NEEDED</span>;
        }
        if (pet.vaccination_expiry_status === 'expired') {
            return <span className="block font-bold text-rose-400 uppercase mt-0.5">EXPIRED</span>;
        }
        return <span className="block font-bold text-emerald-400 uppercase mt-0.5">100% VERIFIED</span>;
    };

    return (
        <div className="mx-auto w-full max-w-xl">
            <style>{`
                @keyframes holographic-shimmer {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .shimmer-effect {
                    background: linear-gradient(
                        115deg,
                        transparent 20%,
                        rgba(255, 255, 255, 0.15) 30%,
                        rgba(255, 105, 180, 0.1) 40%,
                        rgba(0, 255, 255, 0.1) 60%,
                        rgba(255, 255, 255, 0.15) 70%,
                        transparent 80%
                    );
                    background-size: 200% auto;
                    animation: holographic-shimmer 15s linear infinite;
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(187,139,98,0.2), inset 0 0 10px rgba(187,139,98,0.2); }
                    50% { box-shadow: 0 0 20px rgba(187,139,98,0.6), inset 0 0 20px rgba(187,139,98,0.6); }
                }
                .pulse-glow-seal {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
            
            {/* Top Interactive Action Bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-2">
                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#bb8b62]/40 bg-[#1c1a16] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#bb8b62] shadow-md transition-all hover:border-[#bb8b62] hover:bg-[#bb8b62] hover:text-black cursor-pointer"
                >
                    <RotateCw className={`h-3.5 w-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
                    {isFlipped ? 'Show Front' : 'Flip to Back ↺'}
                </button>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#bb8b62]/40 bg-[#1c1a16] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#bb8b62] shadow-md transition-all hover:border-[#bb8b62] hover:bg-[#bb8b62] hover:text-black cursor-pointer"
                    >
                        {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
                        {isCopied ? 'Copied!' : 'Share'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#bb8b62]/40 bg-[#1c1a16] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#bb8b62] shadow-md transition-all hover:border-[#bb8b62] hover:bg-[#bb8b62] hover:text-black cursor-pointer"
                    >
                        <Camera className="h-3.5 w-3.5" /> Download PNG
                    </button>
                    <a
                        href={`/pets/passport/${encodeURIComponent(passportId.replace(/\s+/g, ''))}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#bb8b62] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-black shadow-md transition-all hover:bg-[#deb893] hover:scale-105 cursor-pointer"
                    >
                        <FileText className="h-3.5 w-3.5" /> Export PDF
                    </a>
                </div>
            </div>

            {/* 3D Flip Credit Card Aspect Container */}
            <div className="group relative aspect-[1.586/1] w-full [perspective:1000px]">
                <div
                    ref={cardRef}
                    className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
                        isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                >
                    {/* ==================== FRONT SIDE: LUXURY MEMBERSHIP CARD ==================== */}
                    <div className="absolute inset-0 flex flex-col justify-between h-full w-full overflow-hidden rounded-3xl border-2 border-[#bb8b62]/60 bg-gradient-to-br from-[#1c1a16] via-[#24221c] to-[#11100d] p-7 text-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] [backface-visibility:hidden]">
                        
                        {/* Shimmer Overlay */}
                        <div className="pointer-events-none absolute inset-0 z-20 shimmer-effect mix-blend-overlay" />

                        {/* Metallic Gold Background Lattice & Radial Blur */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#bb8b62_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-10" />
                        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#bb8b62]/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#deb893]/15 blur-3xl" />

                        {/* Missing Watermark */}
                        {pet.is_lost && (
                            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
                                <div className="rotate-[-30deg] border-4 border-red-500/80 px-8 py-2 text-6xl md:text-7xl font-black tracking-widest text-red-500/80 drop-shadow-lg backdrop-blur-[2px]">
                                    MISSING
                                </div>
                            </div>
                        )}

                        {/* Top Header: Official Site Logo & Gold Foil Registry Badge */}
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {hasLogo ? (
                                    <div className="flex items-center justify-center rounded-xl border border-[#bb8b62]/40 bg-[#12110e]/80 p-2 shadow-inner backdrop-blur-md">
                                        <img
                                            src={settings.site_logo as string}
                                            alt={(settings.site_name as string) || 'Woof Circle'}
                                            className="h-8 max-w-[120px] w-auto object-contain brightness-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#bb8b62]/50 bg-gradient-to-br from-[#bb8b62]/30 to-[#8c5a32]/20 shadow-md">
                                            <Crown className="h-5 w-5 text-[#deb893]" />
                                        </div>
                                        <div>
                                            <span className="block font-mono text-[8px] font-black uppercase tracking-[0.35em] text-[#bb8b62]">
                                                CANINE HERITAGE CLUB
                                            </span>
                                            {htmlFor || id ? (
                                                <label htmlFor={htmlFor} id={id} className="font-serif text-base font-bold uppercase tracking-wider text-white cursor-pointer block">
                                                    {(settings?.site_name as string) || 'WOOF CIRCLE'} MEMBERSHIP
                                                </label>
                                            ) : (
                                                <h2 className="font-serif text-base font-bold uppercase tracking-wider text-white">
                                                    {(settings?.site_name as string) || 'WOOF CIRCLE'} MEMBERSHIP
                                                </h2>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Verification Badge */}
                            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[8px] font-bold text-emerald-400 backdrop-blur-md">
                                <CheckCircle2 className="h-3 w-3" /> OFFICIAL REGISTRY
                            </div>
                        </div>

                        {/* Middle Block: Companion & Lineage Details */}
                        <div className="relative z-10 grid grid-cols-12 items-end gap-4 my-auto pt-2">
                            <div className="col-span-8 space-y-1">
                                <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#bb8b62]">
                                    REGISTERED COMPANION
                                </span>
                                <h3 className="font-serif text-2xl font-black uppercase tracking-tight text-white leading-none drop-shadow-sm">
                                    {pet.name}
                                </h3>
                                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-200/90 pt-0.5">
                                    {pet.breed?.name || 'Heritage Purebred'}
                                </p>
                            </div>

                            <div className="col-span-4 flex flex-col items-end gap-1.5">
                                {/* Champion Badge (if applicable) */}
                                {pet.is_champion && (
                                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#bb8b62]/40 bg-[#bb8b62]/10 px-3 py-1.5 text-[8px] font-mono font-bold text-[#deb893] shadow-md">
                                        <Award className="h-3.5 w-3.5 text-[#bb8b62]" /> CHAMPION
                                    </div>
                                )}
                                
                                {/* Dynamic Badges */}
                                {pet.badges && pet.badges.map((badge, idx) => (
                                    <div key={idx} className={`inline-flex items-center gap-1.5 rounded-xl border border-[#bb8b62]/20 bg-black/20 px-3 py-1.5 text-[8px] font-mono font-bold ${badge.color} shadow-sm backdrop-blur-sm`} title={badge.description}>
                                        <Award className={`h-3 w-3 ${badge.color}`} /> {badge.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Embossed Passport Identity Number & QR Verification Code */}
                        <div className="relative z-10 flex items-end justify-between border-t border-[#bb8b62]/25 pt-3">
                            <div className="space-y-1">
                                <span className="block font-mono text-[7px] font-bold uppercase tracking-widest text-[#bb8b62]">
                                    PASSPORT UNIQUE IDENTITY CODE
                                </span>
                                <div className="font-mono text-lg font-black tracking-[0.2em] text-[#deb893] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                    {passportId}
                                </div>
                            </div>

                            {/* Dynamic Verification QR Code */}
                            <a
                                href={verifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/qr flex items-center gap-2 rounded-xl border border-[#bb8b62]/40 bg-black/70 p-1.5 backdrop-blur-md transition-all hover:border-[#bb8b62]"
                                title="Scan to verify passport"
                            >
                                <div className="rounded-md bg-white p-1">
                                    <QRCodeSVG 
                                        value={verifyUrl} 
                                        size={28}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"L"}
                                        includeMargin={false}
                                    />
                                </div>
                                <div className="pr-1 text-left">
                                    <span className="block font-mono text-[7px] font-bold uppercase text-[#bb8b62]">SCAN QR</span>
                                    <span className="block font-sans text-[8px] font-black uppercase text-white">VERIFY</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* ==================== BACK SIDE: REVERSE SPECIFICATIONS ==================== */}
                    <div className="absolute inset-0 flex flex-col justify-between h-full w-full overflow-hidden rounded-3xl border-2 border-[#bb8b62]/60 bg-gradient-to-br from-[#11100d] via-[#1a1814] to-[#14120e] p-7 text-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        {/* Magnetic Stripe Bar */}
                        <div className="-mx-7 -mt-7 h-10 w-[calc(100%+3.5rem)] bg-[#0a0a09] shadow-inner border-b border-zinc-800" />

                        {/* Signature & Security Seal Row */}
                        <div className="relative z-10 pt-2 space-y-3">
                            <div className="grid grid-cols-12 items-center gap-4">
                                {/* Owner Signature Box */}
                                <div className="col-span-8">
                                    <span className="block font-mono text-[7px] font-bold uppercase tracking-widest text-[#bb8b62]">
                                        AUTHORIZED OWNER SIGNATURE
                                    </span>
                                    <div className="mt-1 flex h-8 items-center rounded-lg border border-zinc-700 bg-zinc-200/90 px-3 font-serif text-xs text-zinc-900 shadow-inner">
                                        {pet.owner?.name || 'Verified Owner'}
                                    </div>
                                </div>

                                {/* Holographic Seal with Pulse Glow */}
                                <div className="col-span-4 text-right">
                                    <span className="block font-mono text-[7px] font-bold uppercase tracking-widest text-zinc-400">
                                        REGISTRY SEAL
                                    </span>
                                    <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-[#deb893]/40 bg-[#bb8b62]/10 px-2.5 py-1 text-[8px] font-mono font-bold text-[#deb893] pulse-glow-seal">
                                        <Sparkles className="h-3 w-3 text-[#deb893]" /> GENUINE
                                    </div>
                                </div>
                            </div>

                            {/* Companion Specifications */}
                            <div className="grid grid-cols-3 gap-3 rounded-xl border border-[#bb8b62]/20 bg-black/50 p-3 font-mono text-[9px]">
                                <div>
                                    <span className="block font-bold text-[#bb8b62] uppercase">GENDER</span>
                                    <span className="block font-bold text-white uppercase mt-0.5">{pet.gender || 'Female'}</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-[#bb8b62] uppercase">DATE OF BIRTH</span>
                                    <span className="block font-bold text-white uppercase mt-0.5">{pet.date_of_birth || '2024-02-14'}</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-[#bb8b62] uppercase">HEALTH CLEARANCE</span>
                                    {renderHealthClearance()}
                                </div>
                            </div>
                            
                            {/* Lifecycle Activity Stats */}
                            <div className="grid grid-cols-3 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 font-mono text-[9px]">
                                <div className="text-center border-r border-zinc-800">
                                    <span className="block font-bold text-zinc-500 uppercase">TRANSFERS</span>
                                    <span className="block font-black text-white text-base mt-0.5">{pet.transfer_count || 0}</span>
                                </div>
                                <div className="text-center border-r border-zinc-800">
                                    <span className="block font-bold text-zinc-500 uppercase">SALES</span>
                                    <span className="block font-black text-white text-base mt-0.5">{pet.sale_count || 0}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-zinc-500 uppercase">ADOPTIONS</span>
                                    <span className="block font-black text-white text-base mt-0.5">{pet.adoption_count || 0}</span>
                                </div>
                            </div>

                            {/* Registry Footer Terms */}
                            <div className="flex items-center justify-between border-t border-[#bb8b62]/20 pt-2 text-[8px] font-mono text-zinc-400">
                                <p className="leading-tight uppercase max-w-[290px]">
                                    Property of Woof Circle Canine Registry. Scan QR code to access live medical passport records.
                                </p>
                                <span className="font-bold text-[#bb8b62]">woofcircle.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
