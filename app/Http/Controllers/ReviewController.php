<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController
{
    /**
     * Display a listing of the reviews for a specific reviewable item.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'reviewable_id' => 'required|integer',
            'reviewable_type' => 'required|string',
        ]);

        $reviews = Review::with('user')
            ->where('reviewable_id', $validated['reviewable_id'])
            ->where('reviewable_type', $validated['reviewable_type'])
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // Fetch rating breakdown
        $breakdownQuery = Review::where('reviewable_id', $validated['reviewable_id'])
            ->where('reviewable_type', $validated['reviewable_type'])
            ->where('status', 'approved')
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        $breakdown = [];
        for ($i = 1; $i <= 5; $i++) {
            $breakdown[$i] = $breakdownQuery[$i] ?? 0;
        }

        return response()->json([
            'pagination' => $reviews,
            'breakdown' => $breakdown,
        ]);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'reviewable_id' => 'required|integer',
            'reviewable_type' => 'required|string',
        ]);

        $review = Review::create([
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'reviewable_id' => $validated['reviewable_id'],
            'reviewable_type' => $validated['reviewable_type'],
            'is_verified' => Auth::user()->email_verified_at !== null,
            'status' => 'approved', // Auto-approve for now, can be changed to 'pending' later
        ]);

        return back()->with('success', 'Your review has been submitted successfully.');
    }

    /**
     * Update the specified review in storage.
     */
    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Your review has been updated successfully.');
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Your review has been deleted successfully.');
    }
}
