import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Dna, Info, Lock, Sparkles, Star } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface PetNode {
    id: number;
    name: string;
    breed: { name: string } | null;
    profile_image_url: string | null;
    passport_number: string | null;
    is_champion: boolean;
    sire: PetNode | null;
    dam: PetNode | null;
}

interface PageProps {
    pet: PetNode;
    can_access_full_lineage?: boolean;
    user_tier?: string;
    [key: string]: any;
}

export default function Pedigree() {
    const { pet, can_access_full_lineage = false, user_tier = 'Free' } = usePage<PageProps>().props;

    const renderNode = (node: PetNode | null, label: string, gen: number) => {
        if (!node) {
            return (
                <div className="flex flex-col items-center justify-center p-4 h-full min-h-[120px] bg-[#fcfbf9] border border-dashed border-[#e8ded1] rounded-2xl w-full">
                    <span className="text-[10px] font-bold text-woof-charcoal/40 uppercase tracking-wider">{label}</span>
                    <span className="text-xs font-medium text-woof-charcoal/40 mt-1">Unknown</span>
                </div>
            );
        }

        return (
            <Link href={route('pets.passport.show', node.passport_number || '')} className="block w-full h-full">
                <Card className="rounded-2xl border border-[#e8ded1] shadow-xs hover:border-woof-gold/50 hover:shadow-md transition-all cursor-pointer h-full group relative overflow-hidden bg-white">
                    {node.is_champion && (
                        <div className="absolute top-2 right-2 bg-woof-gold text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-2xs">
                            CH
                        </div>
                    )}
                    <CardContent className="p-4 flex flex-col items-center text-center h-full justify-center">
                        <Avatar className="h-14 w-14 mb-2 rounded-2xl ring-2 ring-transparent group-hover:ring-woof-gold/40 transition-all border border-[#e8ded1]">
                            <AvatarImage src={node.profile_image_url || undefined} className="object-cover rounded-2xl" />
                            <AvatarFallback className="rounded-2xl bg-woof-cream text-woof-charcoal font-bold text-xs">{node.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-bold text-woof-gold uppercase tracking-wider mb-0.5">{label}</span>
                        <h4 className="text-sm font-bold text-woof-charcoal leading-tight truncate w-full group-hover:text-woof-gold transition-colors">
                            {node.name}
                        </h4>
                        {node.passport_number && (
                            <div className="text-[9px] font-mono font-medium text-woof-charcoal/50 mt-1 tracking-wider uppercase">
                                {node.passport_number.replace('WCTG ', '')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Link>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'My Pets', href: route('dashboard') }, { title: pet.name, href: route('dashboard') }, { title: 'Pedigree', href: '#' }]}>
            <Head title={`${pet.name} Pedigree`} />
            
            <div className="container-wide px-6 lg:px-12 py-8 max-w-6xl space-y-8">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                            <Dna className="h-4 w-4" />
                            <span>Official Lineage</span>
                        </div>
                        <h1 className="text-3xl font-bold text-woof-charcoal tracking-tight">
                            Pedigree Certificate
                        </h1>
                        <p className="text-xs text-woof-charcoal/70">
                            Ancestry Tree for <span className="font-bold text-woof-charcoal">{pet.name}</span>
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-woof-cream border border-[#e8ded1] text-woof-charcoal/70">
                                {can_access_full_lineage ? '5-Gen Unlocked' : '3-Gen Standard'}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {pet.passport_number && (
                            <Link
                                href={route('pets.passport.show', pet.passport_number)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e8ded1] bg-white text-woof-charcoal hover:bg-woof-cream text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                            >
                                View Passport
                            </Link>
                        )}
                        {!can_access_full_lineage && (
                            <Link
                                href="/settings/subscription"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-woof-gold text-[#24221c] hover:bg-woof-champagne text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                            >
                                <Crown className="h-4 w-4" />
                                Unlock 5-Gen Tree
                            </Link>
                        )}
                    </div>
                </div>

                {!can_access_full_lineage && (
                    <div className="rounded-3xl border border-woof-gold/30 bg-gradient-to-r from-woof-gold/10 via-woof-champagne/10 to-woof-pearl/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white border border-woof-gold/30 flex items-center justify-center text-woof-gold shrink-0">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">
                                    5-Generation Certified Heritage Lineage Preview
                                </h4>
                                <p className="text-[11px] text-woof-charcoal/70">
                                    You are viewing the standard 3-generation registry. Upgrade to Connoisseur for 5-generation lineage certificates and print-ready PDF pedigree generation.
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="rounded-xl bg-woof-gold hover:bg-woof-champagne text-[#24221c] text-xs font-black uppercase tracking-wider shrink-0"
                        >
                            <Link href="/settings/subscription">
                                <Crown className="h-3.5 w-3.5 mr-1" /> Upgrade
                            </Link>
                        </Button>
                    </div>
                )}

                <div className="bg-white border border-[#e8ded1] rounded-3xl p-6 sm:p-10 shadow-xs overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-4 gap-4">
                            
                            {/* Generation 1 (The Pet) */}
                            <div className="col-span-1 flex flex-col justify-center items-center relative">
                                <div className="w-full relative z-10 bg-white">
                                    {renderNode(pet, 'Subject', 1)}
                                </div>
                                {/* Connecting line to Gen 2 */}
                                <div className="absolute top-1/2 -right-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                            </div>

                            {/* Generation 2 (Parents) */}
                            <div className="col-span-1 flex flex-col justify-between py-12 relative gap-16">
                                {/* Connecting line from Gen 1 */}
                                <div className="absolute top-1/4 bottom-1/4 -left-4 border-l-2 border-[#e8ded1] z-0" />
                                
                                <div className="w-full relative z-10 flex-1 flex items-center">
                                    {renderNode(pet.sire, 'Sire (Father)', 2)}
                                    <div className="absolute top-1/2 -left-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                    <div className="absolute top-1/2 -right-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                </div>
                                <div className="w-full relative z-10 flex-1 flex items-center">
                                    {renderNode(pet.dam, 'Dam (Mother)', 2)}
                                    <div className="absolute top-1/2 -left-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                    <div className="absolute top-1/2 -right-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                </div>
                            </div>

                            {/* Generation 3 (Grandparents) */}
                            <div className="col-span-1 flex flex-col justify-between py-4 relative gap-4">
                                {/* Sire's Parents Lines */}
                                <div className="absolute top-[12.5%] bottom-[37.5%] -left-4 border-l-2 border-[#e8ded1] z-0" />
                                {/* Dam's Parents Lines */}
                                <div className="absolute top-[62.5%] bottom-[87.5%] -left-4 border-l-2 border-[#e8ded1] z-0" />

                                <div className="w-full relative z-10 flex-1 flex items-center">
                                    {renderNode(pet.sire?.sire || null, 'Grandsire', 3)}
                                    <div className="absolute top-1/2 -left-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                </div>
                                <div className="w-full relative z-10 flex-1 flex items-center">
                                    {renderNode(pet.sire?.dam || null, 'Granddam', 3)}
                                    <div className="absolute top-1/2 -left-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                </div>
                                <div className="w-full relative z-10 flex-1 flex items-center">
                                    {renderNode(pet.dam?.sire || null, 'Grandsire', 3)}
                                    <div className="absolute top-1/2 -left-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                </div>
                                <div className="w-full relative z-10 flex-1 flex items-center">
                                    {renderNode(pet.dam?.dam || null, 'Granddam', 3)}
                                    <div className="absolute top-1/2 -left-4 w-4 border-t-2 border-[#e8ded1] z-0" />
                                </div>
                            </div>
                            
                            {/* Generation 4 (Great-Grandparents - Optional visual filler) */}
                             <div className="col-span-1 flex flex-col justify-between py-0 relative gap-2 opacity-50 pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-full h-[60px] relative z-10 flex-1 flex items-center">
                                        <div className="flex flex-col items-center justify-center h-full w-full bg-[#fcfbf9] border border-dashed border-[#e8ded1] rounded-xl">
                                            <span className="text-[8px] font-bold text-woof-charcoal/40 uppercase tracking-wider">Great</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-3xl p-6 flex items-start gap-4 shadow-2xs">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                        <Info className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-woof-charcoal text-sm">About Pedigrees & Lineage</h4>
                        <p className="text-xs text-woof-charcoal/70 leading-relaxed font-normal">
                            Click on any known ancestor to view their digital passport and verify their credentials. Champion (CH) titles are displayed for verified award-winning ancestors. To add ancestry information to your pet, edit their profile and link existing WoofCircle pets via their passport ID.
                        </p>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
