import React, { useState } from 'react';
import { Award, ShieldCheck, Heart, Sparkles, ChevronRight, Info } from 'lucide-react';

export interface Ancestor {
    name: string;
    titles?: string;
    breed?: string;
    color?: string;
    reg_number?: string;
    image_url?: string;
    is_champion?: boolean;
    health_clearance?: string;
}

export interface PedigreeProps {
    subjectName?: string;
    sire?: Ancestor;
    dam?: Ancestor;
    sireSire?: Ancestor;
    sireDam?: Ancestor;
    damSire?: Ancestor;
    damDam?: Ancestor;
}

export default function PedigreeTree({
    subjectName = 'Litter Pedigree',
    sire = {
        name: 'CH Royal Vanguard Sterling',
        titles: 'Grand National Champion 2024',
        breed: 'Golden Retriever',
        color: 'Rich Honey Gold',
        reg_number: 'AKC-GR-99821',
        image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
        is_champion: true,
        health_clearance: 'OFA Hips Excellent, Elbows Normal',
    },
    dam = {
        name: 'Int CH Aurelia Duchess of Kent',
        titles: 'International Beauty Champion',
        breed: 'Golden Retriever',
        color: 'Cream White',
        reg_number: 'AKC-GR-88712',
        image_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600&auto=format&fit=crop',
        is_champion: true,
        health_clearance: 'OFA Hips Good, Eyes Clear',
    },
    sireSire = {
        name: 'GCH Supreme Monarch III',
        titles: 'Hall of Fame Sire',
        is_champion: true,
    },
    sireDam = {
        name: 'CH Lady Genevieve of Sussex',
        titles: 'Champion Producer',
        is_champion: true,
    },
    damSire = {
        name: 'GCH Windsor Apex Commander',
        titles: 'Supreme Best In Show',
        is_champion: true,
    },
    damDam = {
        name: 'CH Crystal Elegance Rose',
        titles: 'National Winner',
        is_champion: true,
    },
}: PedigreeProps) {
    const [activeNode, setActiveNode] = useState<Ancestor | null>(sire);

    const renderCard = (ancestor: Ancestor, label: string, isParent: boolean = false) => (
        <div
            onClick={() => setActiveNode(ancestor)}
            className={`group relative cursor-pointer border p-4 transition-all duration-300 ${
                activeNode?.name === ancestor.name
                    ? 'border-[#bb8b62] bg-[#1f1d18] shadow-lg scale-[1.02]'
                    : 'border-[#27272a] bg-[#121215] hover:border-[#bb8b62]/50 hover:bg-[#18181b]'
            } ${isParent ? 'rounded-2xl' : 'rounded-xl'}`}
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#bb8b62]">
                    {label}
                </span>
                {ancestor.is_champion && (
                    <span className="flex items-center gap-1 text-[8px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        <Award className="h-3 w-3" /> CHAMPION
                    </span>
                )}
            </div>

            <div className="mt-2 flex items-center gap-3">
                {ancestor.image_url ? (
                    <img
                        src={ancestor.image_url}
                        alt={ancestor.name}
                        className="h-10 w-10 shrink-0 rounded-xl object-cover border border-[#bb8b62]/30"
                    />
                ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 font-serif text-sm font-bold text-[#bb8b62]">
                        {ancestor.name.charAt(0)}
                    </div>
                )}
                <div className="overflow-hidden">
                    <h4 className="font-sans text-xs font-bold text-white uppercase truncate group-hover:text-[#bb8b62] transition-colors">
                        {ancestor.name}
                    </h4>
                    <p className="font-mono text-[9px] font-medium text-zinc-400 truncate mt-0.5">
                        {ancestor.titles || ancestor.reg_number || 'Certified Ancestor'}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="rounded-3xl border border-[#27272a] bg-[#09090b] p-6 sm:p-8 text-white shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27272a] pb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#bb8b62]" />
                        <span className="font-mono text-[10px] font-black tracking-[0.3em] text-[#bb8b62] uppercase">
                            LINEAGE & ANCESTRY
                        </span>
                    </div>
                    <h3 className="font-sans text-2xl font-bold uppercase text-white mt-1">
                        VERIFIED PEDIGREE TREE
                    </h3>
                </div>
                <div className="flex items-center gap-2 bg-[#121215] border border-[#27272a] px-4 py-2 rounded-xl text-xs font-mono font-semibold text-zinc-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    100% GENETICALLY VERIFIED
                </div>
            </div>

            {/* Tree Diagram Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* SIRE (FATHER'S LINE) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#bb8b62] uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-[#bb8b62]" />
                        SIRE LINEAGE (FATHER)
                    </div>

                    {renderCard(sire, 'SIRE (FATHER)', true)}

                    <div className="pl-6 border-l-2 border-[#bb8b62]/30 space-y-3 pt-2">
                        <span className="font-mono text-[8px] font-bold text-zinc-500 uppercase block">GRANDPARENTS</span>
                        {renderCard(sireSire, "SIRE'S SIRE (PATERNAL GRANDFATHER)")}
                        {renderCard(sireDam, "SIRE'S DAM (PATERNAL GRANDMOTHER)")}
                    </div>
                </div>

                {/* DAM (MOTHER'S LINE) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#deb893] uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-[#deb893]" />
                        DAM LINEAGE (MOTHER)
                    </div>

                    {renderCard(dam, 'DAM (MOTHER)', true)}

                    <div className="pl-6 border-l-2 border-[#deb893]/30 space-y-3 pt-2">
                        <span className="font-mono text-[8px] font-bold text-zinc-500 uppercase block">GRANDPARENTS</span>
                        {renderCard(damSire, "DAM'S SIRE (MATERNAL GRANDFATHER)")}
                        {renderCard(damDam, "DAM'S DAM (MATERNAL GRANDMOTHER)")}
                    </div>
                </div>
            </div>

            {/* Active Node Detail Card Preview */}
            {activeNode && (
                <div className="mt-8 rounded-2xl border border-[#bb8b62]/30 bg-[#121215] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#bb8b62]/10 border border-[#bb8b62]/30 text-[#bb8b62]">
                            <Info className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="font-mono text-[9px] font-bold text-[#bb8b62] uppercase tracking-widest block">SELECTED ANCESTOR</span>
                            <h4 className="font-sans text-base font-bold text-white uppercase">{activeNode.name}</h4>
                            <p className="font-mono text-xs font-semibold text-zinc-400 mt-0.5">
                                {activeNode.health_clearance || 'Certified Lineage Champion'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
