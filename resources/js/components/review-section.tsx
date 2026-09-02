import { useState, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { ReviewForm } from '@/components/review-form';
import { StarRating } from '@/components/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { Review, SharedData } from '@/types';
import { Calendar, Quote, User, Edit2, Trash2, X, Check, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewSectionProps {
    reviews: Review[];
    averageRating: number;
    reviewsCount: number;
    reviewableId: number;
    reviewableType: 'vet' | 'trainer' | 'boarding' | 'welfare' | 'pet-shop' | 'breeder' | 'adoption' | 'litter' | 'stud';
}

export function ReviewSection({ reviews, averageRating, reviewsCount, reviewableId, reviewableType }: ReviewSectionProps) {
    const { auth } = usePage<SharedData>().props;
    const currentUser = auth?.user;

    const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(() => Math.ceil(reviewsCount / 5));
    const [localReviewsCount, setLocalReviewsCount] = useState(reviewsCount);
    const [isLoading, setIsLoading] = useState(false);

    const [breakdown, setBreakdown] = useState<Record<number, number>>(() => {
        const initialBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => {
            initialBreakdown[r.rating] = (initialBreakdown[r.rating] || 0) + 1;
        });
        return initialBreakdown;
    });

    const fetchPageData = async (page: number, updateReviewsList = true) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/reviews?reviewable_id=${reviewableId}&reviewable_type=${reviewableType}&page=${page}`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            
            if (updateReviewsList) {
                setLocalReviews(data.pagination.data);
                setCurrentPage(data.pagination.current_page);
                setTotalPages(data.pagination.last_page);
                setLocalReviewsCount(data.pagination.total);
            }
            if (data.breakdown) {
                setBreakdown(data.breakdown);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    };

    // Sync with page props updates (e.g. after Inertia submissions)
    useEffect(() => {
        setLocalReviews(reviews);
        setLocalReviewsCount(reviewsCount);
        setTotalPages(Math.ceil(reviewsCount / 5));
        setCurrentPage(1);

        const initialBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => {
            initialBreakdown[r.rating] = (initialBreakdown[r.rating] || 0) + 1;
        });
        setBreakdown(initialBreakdown);

        if (reviewsCount > 5) {
            fetchPageData(1, false);
        }
    }, [reviews, reviewsCount]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        fetchPageData(page, true);
    };

    return (
        <div className="space-y-12">
            <div className="grid items-start gap-12 lg:grid-cols-12">
                {/* Stats & Form */}
                <div className="space-y-8 lg:col-span-5">
                    <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6 shadow-xs">
                        <div className="flex items-center gap-6 border-b border-[#e8ded1] pb-6">
                            <div className="text-woof-charcoal font-sans text-5xl sm:text-6xl font-bold tracking-tight">
                                {Number(averageRating || 0).toFixed(1)}
                            </div>
                            <div className="space-y-1.5">
                                <StarRating rating={Number(averageRating || 0)} size={5} />
                                <p className="text-woof-charcoal/60 text-xs font-semibold">
                                    Based on {localReviewsCount} {localReviewsCount === 1 ? 'verified review' : 'verified reviews'}
                                </p>
                            </div>
                        </div>

                        {/* Rating Breakdown Bar */}
                        <div className="space-y-2.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = breakdown[star] || 0;
                                const percentage = localReviewsCount > 0 ? (count / localReviewsCount) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-3 text-xs">
                                        <div className="flex items-center gap-1 w-7 shrink-0 font-bold text-woof-charcoal">
                                            <span>{star}</span>
                                            <Star className="h-3.5 w-3.5 text-woof-gold fill-woof-gold" />
                                        </div>
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#ece5dc]">
                                            <div
                                                className="bg-woof-gold h-full rounded-full transition-all duration-700"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-woof-charcoal/60 w-8 text-right font-medium">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <ReviewForm reviewableId={reviewableId} reviewableType={reviewableType} />
                </div>

                {/* Review List */}
                <div className="space-y-8 lg:col-span-7">
                    <div className="space-y-1">
                        <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                            Community Feedback
                        </span>
                        <h3 className="text-woof-charcoal font-sans text-2xl sm:text-3xl font-bold tracking-tight">
                            Latest Reviews
                        </h3>
                    </div>

                    {localReviews.length === 0 ? (
                        <div className="rounded-3xl border border-[#e8ded1] bg-[#fcfbf9] p-10 sm:p-14 text-center space-y-4 shadow-xs">
                            <div className="bg-woof-cream border border-[#e8ded1] text-woof-gold mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xs">
                                <Quote className="h-7 w-7 stroke-[1.75]" />
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-woof-charcoal font-sans text-xl font-bold">No Reviews Yet</h4>
                                <p className="text-woof-charcoal/60 text-xs font-normal max-w-sm mx-auto leading-relaxed">
                                    Be the first verified customer to share your thoughts and help others make informed decisions.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className={`space-y-6 transition-opacity duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                                {localReviews.map((review) => {
                                    const isOwner = currentUser && currentUser.id === review.user_id;
                                    return (
                                        <ReviewItem
                                            key={review.id}
                                            review={review}
                                            isOwner={!!isOwner}
                                        />
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="border-t border-[#e8ded1] flex items-center justify-between pt-6">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || isLoading}
                                        className="border border-[#e8ded1] hover:bg-woof-cream hover:border-woof-gold/40 flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold tracking-wider text-woof-charcoal uppercase transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Prev
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                disabled={isLoading}
                                                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer ${
                                                    currentPage === page
                                                        ? 'bg-woof-charcoal text-white shadow-sm'
                                                        : 'border border-[#e8ded1] text-woof-charcoal hover:bg-woof-cream'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || isLoading}
                                        className="border border-[#e8ded1] hover:bg-woof-cream hover:border-woof-gold/40 flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold tracking-wider text-woof-charcoal uppercase transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                    >
                                        Next <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ReviewItemProps {
    review: Review;
    isOwner: boolean;
}

function ReviewItem({ review, isOwner }: ReviewItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        rating: review.rating,
        comment: review.comment || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('reviews.update', review.id), {
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Review updated successfully');
            },
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(route('reviews.destroy', review.id), {
                onSuccess: () => {
                    toast.success('Review deleted successfully');
                },
                preserveScroll: true,
            });
        }
    };

    const authorName = review.user?.name || 'Verified Member';
    const authorInitial = authorName.charAt(0).toUpperCase();

    return (
        <div className="group rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:border-woof-gold/40">
            {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                        <div className="flex items-center gap-3.5">
                            <div className="bg-woof-cream border border-[#e8ded1] text-woof-gold flex h-10 w-10 items-center justify-center rounded-2xl font-bold">
                                {authorInitial}
                            </div>
                            <div>
                                <h4 className="text-woof-charcoal font-sans text-sm font-bold">
                                    Editing Your Review
                                </h4>
                                <span className="text-woof-charcoal/50 text-xs">Update your rating and comments below</span>
                            </div>
                        </div>
                        <StarRating rating={data.rating} size={4} interactive={true} onRate={(star) => setData('rating', star)} />
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            placeholder="Tell us about your experience..."
                            className="border-[#e8ded1] focus:border-woof-gold focus:ring-2 focus:ring-woof-gold/10 placeholder:text-woof-charcoal/30 min-h-[100px] rounded-2xl bg-[#fcfbf9] p-4 text-sm font-normal"
                        />
                        {errors.comment && <p className="text-xs font-bold text-rose-500">{errors.comment}</p>}
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                            }}
                            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#e8ded1] px-5 text-xs font-bold uppercase tracking-wider text-woof-charcoal/80 transition-all hover:bg-woof-cream cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all cursor-pointer"
                        >
                            <Check className="h-3.5 w-3.5" /> Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="bg-woof-cream border border-[#e8ded1] text-woof-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold font-sans text-sm shadow-2xs">
                                {authorInitial}
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-woof-charcoal font-sans text-sm font-bold">
                                        {authorName}
                                    </h4>
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                        Verified
                                    </span>
                                </div>

                                <div className="text-woof-charcoal/50 flex items-center gap-1.5 text-xs font-medium">
                                    <Calendar className="h-3.5 w-3.5 text-woof-gold" />
                                    <span>{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-[#fcfbf9] border border-[#e8ded1] rounded-2xl px-3 py-1.5 shadow-2xs">
                                <StarRating rating={review.rating} size={4} />
                            </div>

                            {isOwner && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        title="Edit Review"
                                        className="text-woof-charcoal/50 hover:text-woof-gold hover:bg-woof-cream p-2 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        title="Delete Review"
                                        className="text-woof-charcoal/50 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative rounded-2xl border border-[#e8ded1]/70 bg-[#fcfbf9] p-5">
                        <p className="text-woof-charcoal/80 font-sans text-sm leading-relaxed">
                            {review.comment || 'No written comment provided.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
