import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { StarRating } from '@/components/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { useForm, router, Head, Link } from '@inertiajs/react';
import { Calendar, Quote, Edit2, Trash2, X, Check, MessageSquare, ExternalLink, Filter } from 'lucide-react';
import { type BreadcrumbItem, type Review, type PaginatedResponse } from '@/types';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DashboardReview extends Review {
    item_type: 'vet' | 'trainer' | 'boarding' | 'welfare' | 'pet-shop' | 'breeder' | 'adoption' | 'litter' | 'stud' | 'unknown';
    item_name: string;
    item_url: string;
}

interface Props {
    roles: string[];
    reviews: PaginatedResponse<DashboardReview>;
    filters: {
        rating: string;
        type: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Reviews', href: '/dashboard/reviews' },
];

export default function MyReviews({ roles, reviews, filters }: Props) {
    const [selectedRating, setSelectedRating] = useState(filters?.rating || 'all');
    const [selectedType, setSelectedType] = useState(filters?.type || 'all');

    useEffect(() => {
        setSelectedRating(filters?.rating || 'all');
        setSelectedType(filters?.type || 'all');
    }, [filters]);

    const handleRatingChange = (value: string) => {
        setSelectedRating(value);
        router.get(
            route('dashboard.reviews'),
            {
                rating: value === 'all' ? '' : value,
                type: selectedType === 'all' ? '' : selectedType,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        router.get(
            route('dashboard.reviews'),
            {
                rating: selectedRating === 'all' ? '' : selectedRating,
                type: value === 'all' ? '' : value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleClearFilters = () => {
        setSelectedRating('all');
        setSelectedType('all');
        router.get(
            route('dashboard.reviews'),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const hasActiveFilters = selectedRating !== 'all' || selectedType !== 'all';

    return (
        <DashboardLayout
            breadcrumbs={breadcrumbs}
            title="My Reviews"
            subtitle="Manage and edit your reviews and ratings across the platform."
        >
            <Head title="My Reviews" />

            <div className="space-y-6">
                {/* Top Filter Bar */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col md:flex-row gap-5 justify-between items-stretch md:items-center">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
                        <div className="w-full sm:w-48">
                            <label className="text-woof-charcoal text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Filter by Rating
                            </label>
                            <Select value={selectedRating} onValueChange={handleRatingChange}>
                                <SelectTrigger className="w-full bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-10 rounded-2xl font-bold text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Ratings" />
                                </SelectTrigger>
                                <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                    <SelectItem value="all">All Ratings</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-56">
                            <label className="text-woof-charcoal text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Filter by Category
                            </label>
                            <Select value={selectedType} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-full bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-10 rounded-2xl font-bold text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="vet">Veterinary Clinic</SelectItem>
                                    <SelectItem value="trainer">Trainer Profile</SelectItem>
                                    <SelectItem value="boarding">Boarding Service</SelectItem>
                                    <SelectItem value="welfare">Welfare Organization</SelectItem>
                                    <SelectItem value="pet-shop">Pet Shop</SelectItem>
                                    <SelectItem value="breeder">Breeder Profile</SelectItem>
                                    <SelectItem value="adoption">Adoption Listing</SelectItem>
                                    <SelectItem value="litter">Puppy Litter</SelectItem>
                                    <SelectItem value="stud">Stud Service</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="bg-[#fcfbf9] border border-[#e8ded1] hover:bg-woof-charcoal hover:text-white text-woof-charcoal text-xs font-bold px-4 py-2 self-start md:self-end rounded-full transition-all inline-flex items-center gap-1.5 h-10 cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" /> Clear Filters
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
                    <h3 className="text-woof-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-woof-gold" />
                        My Reviews ({reviews.total})
                    </h3>
                </div>

                {reviews.data.length > 0 ? (
                    <div className="space-y-5">
                        <div className="space-y-5">
                            {reviews.data.map((review) => (
                                <DashboardReviewItem key={review.id} review={review} />
                            ))}
                        </div>

                        {/* Pagination controls */}
                        {reviews.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-[#e8ded1] shadow-xs">
                                <div className="text-xs font-medium text-woof-charcoal/60">
                                    Showing <span className="font-bold text-woof-charcoal">{reviews.from}</span> to <span className="font-bold text-woof-charcoal">{reviews.to}</span> of <span className="font-bold text-woof-charcoal">{reviews.total}</span> Reviews
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {reviews.links.map((link, idx) => {
                                        let label = link.label;
                                        if (label.includes('Previous')) {
                                            label = 'Prev';
                                        } else if (label.includes('Next')) {
                                            label = 'Next';
                                        }

                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="px-3.5 py-1.5 text-xs font-bold rounded-full border border-[#e8ded1] text-woof-charcoal/30 bg-[#fcfbf9] cursor-not-allowed select-none"
                                                >
                                                    {label}
                                                </span>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                preserveState
                                                className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all ${
                                                    link.active
                                                        ? 'bg-woof-charcoal border-woof-charcoal text-white shadow-xs'
                                                        : 'bg-white border-[#e8ded1] text-woof-charcoal hover:bg-[#fcfbf9] hover:border-woof-gold'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-16 text-center rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                        <div className="w-14 h-14 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] text-woof-gold flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="size-6 text-woof-gold/40" />
                        </div>
                        <p className="text-woof-charcoal text-sm font-bold">
                            {hasActiveFilters ? 'No reviews match filters' : 'No reviews yet'}
                        </p>
                        <p className="text-woof-charcoal/60 mt-1 text-xs font-normal max-w-sm mx-auto">
                            {hasActiveFilters
                                ? 'Try adjusting your rating or category filters to find what you are looking for.'
                                : "You haven't posted any reviews yet. Share your experience on clinics, trainers, breeder profiles, or litters!"}
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            {hasActiveFilters ? (
                                <button
                                    onClick={handleClearFilters}
                                    className="bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors cursor-pointer"
                                >
                                    Clear Filters
                                </button>
                            ) : (
                                <>
                                    <Link href={route('directory.index')} className="bg-woof-charcoal text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-woof-gold hover:text-woof-charcoal transition-colors shadow-xs">
                                        Browse Directory
                                    </Link>
                                    <Link href={route('marketplace.index')} className="bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal text-xs font-bold px-5 py-2.5 rounded-full hover:border-woof-gold transition-colors">
                                        Browse Marketplace
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

interface ReviewItemProps {
    review: DashboardReview;
}

function DashboardReviewItem({ review }: ReviewItemProps) {
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

    const typeLabel = {
        breeder: 'Breeder Profile',
        vet: 'Veterinary Clinic',
        trainer: 'Trainer Profile',
        boarding: 'Boarding Service',
        welfare: 'Welfare Organization',
        'pet-shop': 'Pet Shop',
        adoption: 'Adoption Listing',
        litter: 'Puppy Litter',
        stud: 'Stud Service',
        unknown: 'Reviewed Item'
    }[review.item_type] || 'Reviewed Item';

    const typeColor = {
        breeder: 'text-amber-800 bg-amber-50 border-amber-200',
        vet: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        trainer: 'text-sky-800 bg-sky-50 border-sky-200',
        boarding: 'text-sky-800 bg-sky-50 border-sky-200',
        welfare: 'text-rose-800 bg-rose-50 border-rose-200',
        'pet-shop': 'text-amber-800 bg-amber-50 border-amber-200',
        adoption: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        litter: 'text-woof-gold bg-amber-50 border-amber-200',
        stud: 'text-woof-charcoal bg-[#fcfbf9] border-[#e8ded1]',
        unknown: 'text-woof-charcoal/70 bg-[#fcfbf9] border-[#e8ded1]'
    }[review.item_type] || 'text-woof-charcoal/70 bg-[#fcfbf9] border-[#e8ded1]';

    return (
        <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-7 transition-all hover:shadow-md relative overflow-hidden shadow-xs">
            {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className={`inline-block px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border mb-1.5 ${typeColor}`}>
                                {typeLabel}
                            </span>
                            <h4 className="text-woof-charcoal text-sm font-bold tracking-tight">
                                Editing Review for {review.item_name}
                            </h4>
                        </div>
                        <StarRating rating={data.rating} size={5} interactive={true} onRate={(star) => setData('rating', star)} />
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            placeholder="Tell us about your experience..."
                            className="border-[#e8ded1] bg-[#fcfbf9] focus:border-woof-gold focus:ring-woof-gold placeholder:text-woof-charcoal/30 min-h-[100px] rounded-2xl text-xs font-medium"
                        />
                        {errors.comment && <p className="text-xs font-bold text-rose-600">{errors.comment}</p>}
                    </div>

                    <div className="flex justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                            }}
                            className="border border-[#e8ded1] hover:bg-[#fcfbf9] flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold text-woof-charcoal transition-all cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                        >
                            <Check className="h-3.5 w-3.5" /> Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                            <span className={`inline-block px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${typeColor}`}>
                                {typeLabel}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-woof-charcoal text-base font-bold tracking-tight">
                                    {review.item_name}
                                </h4>
                                {review.item_url !== '#' && (
                                    <Link
                                        href={review.item_url}
                                        className="text-woof-charcoal/40 hover:text-woof-gold transition-colors p-0.5 inline-flex items-center"
                                        title="View Page"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                )}
                            </div>
                            <div className="text-woof-charcoal/50 flex items-center gap-1.5 text-xs font-medium">
                                <Calendar className="h-3.5 w-3.5 text-woof-gold" /> Reviewed on {new Date(review.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-center">
                            <StarRating rating={review.rating} size={4} />
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    title="Edit Review"
                                    className="text-woof-charcoal/50 hover:text-woof-gold p-1.5 rounded-full hover:bg-[#fcfbf9] transition-colors cursor-pointer"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    title="Delete Review"
                                    className="text-woof-charcoal/50 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-woof-charcoal/80 relative leading-relaxed font-medium text-xs sm:text-sm pl-6 border-l-2 border-woof-gold/30">
                        "{review.comment || 'No comment provided.'}"
                    </p>
                </div>
            )}
        </div>
    );
}
