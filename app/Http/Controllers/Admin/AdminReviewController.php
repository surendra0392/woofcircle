<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReviewController
{
    /**
     * Display a listing of the reviews.
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'reviewable']);

        // Search by comment or user name/email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by rating
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        $reviews = $query->latest()->paginate(10)->withQueryString();

        // Data for Add/Edit
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        // We'll provide the reviewable types
        $reviewableTypes = [
            ['label' => 'Veterinary Clinic', 'value' => 'App\Models\VetProfile'],
            ['label' => 'Dog Trainer', 'value' => 'App\Models\TrainerProfile'],
            ['label' => 'Boarding & Daycare', 'value' => 'App\Models\BoardingProfile'],
            ['label' => 'Welfare & Rescue', 'value' => 'App\Models\WelfareProfile'],
            ['label' => 'Pet Shop', 'value' => 'App\Models\PetShopProfile'],
            ['label' => 'Breeder Profile', 'value' => 'App\Models\BreederProfile'],
        ];

        return Inertia::render('admin/reviews', [
            'reviews' => $reviews,
            'users' => $users,
            'reviewableTypes' => $reviewableTypes,
            'filters' => $request->only(['search', 'status', 'rating']),
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
            'status' => 'required|in:approved,pending,rejected',
            'reviewable_id' => 'required|integer',
            'reviewable_type' => 'required|string',
        ]);

        Review::create($data);

        return back()->with('success', 'Review created successfully.');
    }

    /**
     * Update the review.
     */
    public function update(Request $request, Review $review)
    {
        $data = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'sometimes|required|string|max:1000',
            'status' => 'required|in:approved,pending,rejected',
        ]);

        $review->update($data);

        return back()->with('success', 'Review updated successfully.');
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}
