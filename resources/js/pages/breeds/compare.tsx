import PublicLayout from '@/layouts/public/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRightLeft, Check, Info } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Breed {
    id: number;
    name: string;
    slug: string;
    cover_image: string | null;
    breed_group: string | null;
    size: string | null;
    weight_range: string | null;
    height_range: string | null;
    lifespan: string | null;
    temperament: string | null;
    exercise_needs: number | null;
    grooming_needs: number | null;
    trainability: number | null;
    good_with_children: number | null;
    good_with_pets: number | null;
    origin: string | null;
    description: string | null;
}

interface PageProps {
    all_breeds: { id: number; name: string }[];
    selected_breeds: Breed[];
    breed_ids: string | null;
}

export default function BreedCompare({ all_breeds, selected_breeds, breed_ids }: PageProps) {
    const handleSelectBreed = (index: number, breedId: string) => {
        const currentIds = breed_ids ? breed_ids.split(',') : [];
        if (breedId) {
            currentIds[index] = breedId;
        } else {
            currentIds.splice(index, 1);
        }
        
        router.get(route('breeds.compare'), { breeds: currentIds.filter(Boolean).join(',') }, { preserveState: true });
    };

    const renderBar = (value: number | null) => {
        if (!value) return <span className="text-woof-charcoal/30 text-xs">Data unavailable</span>;
        return (
            <div className="flex items-center gap-1.5 max-w-[120px]">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-2 flex-1 rounded-full ${level <= value ? 'bg-woof-gold' : 'bg-woof-charcoal/10'}`}
                    />
                ))}
            </div>
        );
    };

    const compareSlots = [0, 1, 2];

    return (
        <PublicLayout>
            <Head title="Compare Breeds - Woof Circle" />

            <div className="bg-[#fcfbf9] border-b border-[#e8ded1] pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: '/' },
                            { title: 'Breed Library', href: route('breeds.index') },
                            { title: 'Compare Breeds', href: '#' },
                        ]}
                        className="mb-6"
                    />

                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <div className="bg-woof-gold h-px w-8" />
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Side-by-Side Analysis</span>
                            <div className="bg-woof-gold h-px w-8" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-woof-charcoal">
                            Breed Comparison
                        </h1>
                        <p className="text-sm font-normal text-woof-charcoal/70 leading-relaxed">
                            Compare up to 3 breeds side-by-side to find the perfect companion for your lifestyle.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white min-h-screen py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {compareSlots.map((index) => {
                            const selectedBreed = selected_breeds[index];
                            return (
                                <div key={index} className="bg-white p-6 rounded-3xl border border-[#e8ded1] shadow-xs">
                                    <label className="text-xs font-bold uppercase tracking-wider text-woof-charcoal/70 block mb-3">
                                        Slot {index + 1}
                                    </label>
                                    <select
                                        value={selectedBreed?.id || ''}
                                        onChange={(e) => handleSelectBreed(index, e.target.value)}
                                        className="w-full bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl text-woof-charcoal text-xs font-bold px-4 py-3 focus:outline-none focus:ring-1 focus:ring-woof-gold cursor-pointer"
                                    >
                                        <option value="">Select a breed...</option>
                                        {all_breeds.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                    
                                    {selectedBreed && (
                                        <div className="mt-4 aspect-4/3 bg-woof-cream/40 rounded-2xl border border-[#e8ded1] relative overflow-hidden">
                                            {selectedBreed.cover_image ? (
                                                <img
                                                    src={selectedBreed.cover_image}
                                                    alt={selectedBreed.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                                    <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-10 w-10 items-center justify-center rounded-xl">
                                                        <img src="/images/favicon.png" alt="WoofCircle" className="h-5 w-5 object-contain" />
                                                    </div>
                                                    <span className="text-woof-charcoal/40 text-[10px] font-bold tracking-wider uppercase">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Comparison Table */}
                    {selected_breeds.length > 0 ? (
                        <div className="border border-[#e8ded1] rounded-3xl bg-white overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <tbody>
                                        {/* Physical Traits */}
                                        <tr className="bg-[#fcfbf9] border-b border-[#e8ded1]">
                                            <th colSpan={4} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-woof-charcoal">Physical Traits</th>
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Size & Group</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1]">
                                                    {selected_breeds[i] ? (
                                                        <div>
                                                            <div className="font-bold text-xs text-woof-charcoal">{selected_breeds[i].size || 'N/A'}</div>
                                                            <div className="text-xs text-woof-charcoal/60 font-medium">{selected_breeds[i].breed_group || 'N/A'}</div>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Weight Range</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1] font-bold text-xs text-woof-charcoal">
                                                    {selected_breeds[i]?.weight_range || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Lifespan</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1] font-bold text-xs text-woof-charcoal">
                                                    {selected_breeds[i]?.lifespan || '-'}
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Characteristics */}
                                        <tr className="bg-[#fcfbf9] border-b border-[#e8ded1]">
                                            <th colSpan={4} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-woof-charcoal">Characteristics & Care</th>
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Temperament</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1] text-xs text-woof-charcoal leading-relaxed font-normal">
                                                    {selected_breeds[i]?.temperament || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Exercise Needs</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1]">
                                                    {selected_breeds[i] ? renderBar(selected_breeds[i].exercise_needs) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Grooming Needs</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1]">
                                                    {selected_breeds[i] ? renderBar(selected_breeds[i].grooming_needs) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Trainability</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1]">
                                                    {selected_breeds[i] ? renderBar(selected_breeds[i].trainability) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-[#e8ded1]">
                                            <td className="py-4 px-6 w-1/4 font-medium text-xs text-woof-charcoal/70">Good with Children</td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-4 px-6 w-1/4 border-l border-[#e8ded1]">
                                                    {selected_breeds[i] ? renderBar(selected_breeds[i].good_with_children) : '-'}
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Action Buttons */}
                                        <tr>
                                            <td className="py-6 px-6"></td>
                                            {compareSlots.map(i => (
                                                <td key={i} className="py-6 px-6 w-1/4 border-l border-[#e8ded1]">
                                                    {selected_breeds[i] ? (
                                                        <Link
                                                            href={route('marketplace.index', { breed_id: selected_breeds[i].id })}
                                                            className="w-full inline-flex items-center justify-center bg-woof-charcoal text-white hover:bg-woof-gold hover:text-woof-charcoal text-xs font-bold tracking-wider uppercase h-11 rounded-full transition-colors cursor-pointer shadow-sm"
                                                        >
                                                            Find Puppies
                                                        </Link>
                                                    ) : null}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#fcfbf9] border border-[#e8ded1] rounded-3xl">
                            <Info className="h-8 w-8 text-woof-gold mx-auto mb-3" />
                            <p className="text-woof-charcoal/70 font-medium text-xs">Select breeds from the dropdowns above to start comparing.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
