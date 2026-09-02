import { useEffect, useState } from 'react';
import { StarRating } from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Lock, MessageSquare, Send, Sparkles } from 'lucide-react';
import { SharedData } from '@/types';

interface ReviewFormProps {
    reviewableId: number;
    reviewableType: 'vet' | 'trainer' | 'boarding' | 'welfare' | 'pet-shop' | 'breeder' | 'adoption' | 'litter' | 'stud';
    onSuccess?: () => void;
}

const ratingLabels: Record<number, string> = {
    5: 'Exceptional (5/5)',
    4: 'Very Good (4/5)',
    3: 'Average (3/5)',
    2: 'Below Average (2/5)',
    1: 'Poor (1/5)',
};

export function ReviewForm({ reviewableId, reviewableType, onSuccess }: ReviewFormProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        rating: 5,
        comment: '',
        reviewable_id: reviewableId,
        reviewable_type: reviewableType,
    });

    useEffect(() => {
        setData('reviewable_id', reviewableId);
    }, [reviewableId, setData]);

    useEffect(() => {
        setData('reviewable_type', reviewableType);
    }, [reviewableType, setData]);

    if (!user) {
        return (
            <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-8 text-center shadow-xs">
                <div className="bg-woof-cream border border-[#e8ded1] text-woof-gold mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xs">
                    <MessageSquare className="h-6 w-6 stroke-[1.75]" />
                </div>
                <h4 className="text-woof-charcoal font-sans text-xl font-bold tracking-tight">
                    Share Your Experience
                </h4>
                <p className="text-woof-charcoal/60 mt-1.5 mb-6 text-xs font-normal max-w-xs mx-auto leading-relaxed">
                    Sign in with your verified account to post a review and help the pet community.
                </p>
                <Link
                    href={route('login')}
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal inline-flex h-11 items-center justify-center rounded-full px-8 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all cursor-pointer"
                >
                    Log In to Review
                </Link>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reviews.store'), {
            onSuccess: () => {
                reset('comment', 'rating');
                if (onSuccess) onSuccess();
            },
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3.5 border-b border-[#e8ded1] pb-5">
                <div className="bg-woof-cream border border-[#e8ded1] text-woof-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-2xs">
                    <Sparkles className="h-5 w-5 stroke-[1.75]" />
                </div>
                <div>
                    <h4 className="text-woof-charcoal font-sans text-lg font-bold tracking-tight">
                        Write a Verified Review
                    </h4>
                    <p className="text-woof-charcoal/60 text-xs font-normal">
                        Posting as <span className="font-semibold text-woof-charcoal">{user.name}</span>
                    </p>
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <label className="text-woof-charcoal/60 text-xs font-bold tracking-wider uppercase">
                        Your Rating
                    </label>
                    <span className="text-woof-gold text-xs font-bold">
                        {ratingLabels[data.rating] || `${data.rating} Stars`}
                    </span>
                </div>
                <div className="bg-white rounded-2xl border border-[#e8ded1] p-3 flex items-center justify-center">
                    <StarRating rating={data.rating} size={6} interactive={true} onRate={(star) => setData('rating', star)} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-woof-charcoal/60 text-xs font-bold tracking-wider uppercase">
                    Your Feedback
                </label>
                <Textarea
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Describe your personal experience with services, communication, and care..."
                    className="border-[#e8ded1] focus:border-woof-gold focus:ring-2 focus:ring-woof-gold/10 placeholder:text-woof-charcoal/30 min-h-[120px] rounded-2xl bg-white p-4 text-sm font-normal transition-all"
                />
                {errors.comment && <p className="text-xs font-bold text-rose-500">{errors.comment}</p>}
            </div>

            <Button
                type="submit"
                disabled={processing}
                className="bg-woof-charcoal group hover:bg-woof-gold hover:text-woof-charcoal h-12 w-full cursor-pointer rounded-full text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all active:scale-[0.99]"
            >
                {processing ? (
                    'Submitting Review...'
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        Post Verified Review <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                )}
            </Button>

            {recentlySuccessful && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    Thank you! Your review has been submitted.
                </div>
            )}
        </form>
    );
}
