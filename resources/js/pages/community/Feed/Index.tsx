import React, { useState, useRef } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Heart, MessageCircle, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeedIndex({ photos, auth }: any) {
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        image: null as File | null,
        caption: '',
        pet_id: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submitPost = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('community.feed.store'), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
                setIsPosting(false);
            },
        });
    };

    const toggleLike = (photoId: number) => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }
        router.post(route('community.feed.like', photoId), {}, {
            preserveScroll: true
        });
    };

    return (
        <PublicLayout>
            <Head title="Woof Feed - Community" />

            <section className="border-b border-[#e8ded1] bg-[#fcfbf9] pt-32 pb-12">
                <div className="container-wide px-6 lg:px-12">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                                <span>Community Live</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-woof-charcoal">Woof Feed</h1>
                            <p className="text-sm text-woof-charcoal/70">Share daily moments with the pet community.</p>
                        </div>
                        {auth.user && (
                            <Button onClick={() => setIsPosting(!isPosting)} className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 h-11 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer">
                                Share Photo
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            <div className="bg-white min-h-screen py-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    {isPosting && (
                        <div className="bg-[#fcfbf9] rounded-3xl p-6 shadow-xs border border-[#e8ded1] mb-8">
                            <form onSubmit={submitPost} className="space-y-4">
                                <div>
                                    <textarea
                                        className="w-full bg-white border border-[#e8ded1] rounded-2xl p-4 focus:ring-2 focus:ring-woof-gold/20 text-woof-charcoal text-sm placeholder:text-woof-charcoal/40 resize-none outline-none"
                                        placeholder="What's your pet up to today?"
                                        rows={3}
                                        value={data.caption}
                                        onChange={(e) => setData('caption', e.target.value)}
                                    ></textarea>
                                    {errors.caption && <div className="text-red-500 text-xs mt-1">{errors.caption}</div>}
                                </div>

                                {imagePreview ? (
                                    <div className="relative rounded-2xl overflow-hidden bg-white border border-[#e8ded1] aspect-video flex items-center justify-center p-2">
                                        <img src={imagePreview} alt="Preview" className="max-h-full rounded-xl object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData('image', null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute top-4 right-4 bg-woof-charcoal/80 text-white p-2 rounded-full hover:bg-woof-charcoal transition cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-[#e8ded1] bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-woof-charcoal/60 hover:border-woof-gold/40 hover:bg-woof-cream/20 transition cursor-pointer"
                                    >
                                        <ImageIcon className="w-8 h-8 mb-2 text-woof-gold" />
                                        <span className="font-bold text-xs uppercase tracking-wider text-woof-charcoal">Click to select photo</span>
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setIsPosting(false)} className="rounded-full text-xs font-bold uppercase tracking-wider hover:bg-woof-cream/40">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={!data.image || processing} className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full px-6 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer">
                                        {processing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Post Photo
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-8">
                        {photos.data.map((photo: any) => (
                            <div key={photo.id} className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#e8ded1]">
                                <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[#e8ded1]">
                                    {photo.user.avatar ? (
                                        <img src={`/storage/${photo.user.avatar}`} alt="Avatar" className="w-11 h-11 rounded-2xl object-cover border border-[#e8ded1]" />
                                    ) : (
                                        <div className="w-11 h-11 rounded-2xl bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-charcoal text-xs font-bold">
                                            {photo.user.first_name[0]}{photo.user.last_name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-sm text-woof-charcoal flex items-center gap-2">
                                            {photo.user.first_name} {photo.user.last_name}
                                            {photo.pet && (
                                                <>
                                                    <span className="text-woof-charcoal/40 text-xs font-normal">with</span>
                                                    {photo.pet.passport_number ? (
                                                        <Link href={route('pets.passport.show', photo.pet.passport_number)} className="text-woof-gold hover:underline font-bold text-xs">
                                                            {photo.pet.name}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-woof-gold font-bold text-xs">{photo.pet.name}</span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full bg-[#fcfbf9] flex items-center justify-center p-2">
                                    <img src={`/storage/${photo.image_path}`} alt="Pet Photo" className="w-full max-h-[550px] object-contain rounded-2xl" />
                                </div>

                                <div className="p-4 sm:p-5 space-y-3">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => toggleLike(photo.id)} 
                                            className={`flex items-center gap-1.5 transition cursor-pointer ${photo.has_liked ? 'text-rose-500' : 'text-woof-charcoal/60 hover:text-rose-500'}`}
                                        >
                                            <Heart className="w-5 h-5" fill={photo.has_liked ? "currentColor" : "none"} />
                                            <span className="font-bold text-xs">{photo.likes_count}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-woof-charcoal/60 hover:text-woof-gold transition cursor-pointer">
                                            <MessageCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {photo.caption && (
                                        <div className="text-sm text-woof-charcoal leading-relaxed">
                                            <span className="font-bold mr-2">{photo.user.first_name}</span>
                                            <span className="text-woof-charcoal/80">{photo.caption}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {photos.data.length === 0 && (
                            <div className="text-center py-16 bg-[#fcfbf9] rounded-3xl border border-dashed border-[#e8ded1] space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e8ded1] mx-auto flex items-center justify-center text-woof-gold shadow-2xs">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-woof-charcoal">No photos yet</h3>
                                <p className="text-xs text-woof-charcoal/60">Be the first to share a moment with the community!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
