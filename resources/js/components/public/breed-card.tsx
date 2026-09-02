import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BreedListItem {
    id: number;
    name: string;
    slug: string;
    image_url?: string | null;
    is_indian?: boolean;
    size?: string | null;
    breed_group?: string | null;
    description?: string | null;
}

interface BreedCardProps {
    breed: BreedListItem;
    view?: 'grid' | 'list';
    idx?: number;
}

export default function BreedCard({ breed, view = 'grid', idx = 0 }: BreedCardProps) {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [breed.id, breed.image_url]);

    const detailUrl = route('breeds.show', { slug: breed.slug });
    const hasValidImage = Boolean(breed.image_url && breed.image_url.trim() !== '' && !imgError);

    if (view === 'list') {
        return (
            <div
                className="animate-fade-in-up group border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 md:flex-row md:min-h-[220px]"
                style={{ animationDelay: `${idx * 0.05}s` }}
            >
                {/* Full-card link overlay */}
                <Link href={detailUrl} className="absolute inset-0 z-10 cursor-pointer">
                    <span className="sr-only">View Breed {breed.name}</span>
                </Link>

                <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-64 bg-woof-cream/60">
                    {!hasValidImage ? (
                        <div className="bg-woof-cream/60 absolute inset-0 flex h-full w-full flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r border-[#e8ded1]">
                            <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                                <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                            </div>
                            <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                        </div>
                    ) : (
                        <img
                            src={breed.image_url!}
                            alt={breed.name}
                            onError={() => setImgError(true)}
                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    )}

                    {breed.is_indian && (
                        <div className="absolute top-4 left-4 z-20">
                            <Badge className="bg-woof-gold rounded-full border-none px-3 py-1 text-[8px] font-bold tracking-wider text-white uppercase shadow-xs">
                                Indian Breed
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6 min-w-0">
                    <div className="space-y-1.5">
                        <h4 className="text-woof-charcoal group-hover:text-woof-gold text-lg sm:text-xl font-bold tracking-tight uppercase transition-colors duration-300">
                            {breed.name}
                        </h4>

                        <div className="text-woof-gold flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                            <span>{breed.size || 'Medium'}</span>
                            <span className="bg-[#e8ded1] h-1 w-1 rounded-full"></span>
                            <span>{breed.breed_group || 'Sporting'}</span>
                        </div>

                        {breed.description && (
                            <p className="text-woof-charcoal/60 line-clamp-2 text-xs leading-relaxed font-normal pt-1">
                                {breed.description}
                            </p>
                        )}
                    </div>

                    <div className="border-[#e8ded1] mt-3 flex items-center justify-between border-t pt-3">
                        <span className="text-woof-gold group-hover:underline text-[11px] font-bold uppercase flex items-center gap-1">
                            Read Guide <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="animate-fade-in-up group border-[#e8ded1] hover:border-woof-gold/50 hover:shadow-xl relative flex aspect-3/4 flex-col overflow-hidden rounded-3xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1.5"
            style={{ animationDelay: `${idx * 0.05}s` }}
        >
            {/* Full-card link overlay */}
            <Link href={detailUrl} className="absolute inset-0 z-10 cursor-pointer">
                <span className="sr-only">View Breed {breed.name}</span>
            </Link>

            <div className="relative h-full w-full overflow-hidden bg-woof-cream/40">
                {!hasValidImage ? (
                    <div className="bg-woof-cream/60 absolute inset-0 flex h-full w-full flex-col items-center justify-center p-6 text-center border-b border-[#e8ded1]">
                        <div className="bg-white border border-[#e8ded1] shadow-2xs mb-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                            <img src="/images/favicon.png" alt="WoofCircle" className="h-6 w-6 object-contain" />
                        </div>
                        <span className="text-woof-charcoal/50 text-[10px] font-bold tracking-wider uppercase">No Image Available</span>
                    </div>
                ) : (
                    <img
                        src={breed.image_url!}
                        alt={breed.name}
                        onError={() => setImgError(true)}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                )}

                {/* Asymmetric Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent transition-opacity duration-500" />

                {breed.is_indian && (
                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-woof-gold rounded-full border-none px-3 py-1 text-[8px] font-bold tracking-wider text-white uppercase shadow-xs">
                            Indian Breed
                        </Badge>
                    </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-6 text-white">
                    <div className="space-y-1.5">
                        <h4 className="text-xl font-bold tracking-tight uppercase text-white leading-none">
                            {breed.name}
                        </h4>

                        <div className="text-woof-gold flex items-center gap-2 text-[9px] font-bold tracking-wider uppercase">
                            <span>{breed.size || 'Medium'}</span>
                            <span className="bg-white/40 h-1 w-1 rounded-full"></span>
                            <span>{breed.breed_group || 'Sporting'}</span>
                        </div>

                        <div className="pt-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="text-woof-pearl text-[10px] font-bold uppercase flex w-fit items-center gap-1.5">
                                Read Guide <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
